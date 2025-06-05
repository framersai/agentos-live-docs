// File: frontend/src/components/voice-input/composables/useSttManager.ts
/**
 * @file useSttManager.ts
 * @description Unified manager for Speech-to-Text (STT) functionality.
 * Manages STT handlers (Browser, Whisper) and input modes (PTT, Continuous, VAD).
 * It orchestrates the interaction between the selected STT engine, the chosen input mode,
 * and the UI, providing a consistent STT experience.
 *
 * @version 2.3.1
 * @updated 2025-06-05 - Imported VoiceInputSharedState. Corrected Vue Readonly type usage.
 * - Removed other unused imports and variables.
 * - Ensured correct import of BaseSttMode and SttModeContext.
 */

import { ref, computed, watch, shallowRef, effectScope, onScopeDispose, readonly } from 'vue';
import type { Ref, ShallowRef, ComputedRef, EffectScope } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { PttMode } from './modes/usePttMode';
import { ContinuousMode } from './modes/useContinuousMode';
import { VadMode } from './modes/useVadMode';
import { BaseSttMode, type SttModeContext } from './modes/BaseSttMode';
import type { SttHandlerInstance, SttHandlerErrorPayload } from '../types';
import type { VoiceInputSharedState } from '../composables/shared/useVoiceInputState'; // Corrected import path

/**
 * @typedef SttInternalHandlerType
 * @description Defines the internal keys used to manage STT handler instances within the SttManager.
 */
type SttInternalHandlerType = 'browser' | 'whisper';


export interface UseSttManagerOptions {
  audioMode: Readonly<Ref<AudioInputMode>>;
  settings: Readonly<Ref<VoiceApplicationSettings>>;
  sharedState: VoiceInputSharedState;
  micPermissionStatus: Readonly<Ref<string>>;
  isProcessingLLM: Readonly<Ref<boolean>>;
  audioFeedback: import('./shared/useAudioFeedback').AudioFeedbackInstance;
  transcriptionDisplay: ReturnType<typeof import('./shared/useTranscriptionDisplay').useTranscriptionDisplay>;
  emit: (event: string, ...args: any[]) => void;
  toast?: ToastService;
}

export interface SttManagerInstance {
  currentModeInstance: Readonly<ShallowRef<BaseSttMode | null>>;
  isActive: ComputedRef<boolean>;
  canStart: ComputedRef<boolean>;
  statusText: ComputedRef<string>;
  placeholderText: ComputedRef<string>;
  activeHandlerApi: Readonly<ShallowRef<SttHandlerInstance | null>>;
  isProcessingAudio: ComputedRef<boolean>;
  isListeningForWakeWord: ComputedRef<boolean>;
  handleMicButtonClick: () => Promise<void>;
  registerHandler: (type: SttInternalHandlerType, api: SttHandlerInstance) => void;
  unregisterHandler: (type: SttInternalHandlerType) => Promise<void>;
  cleanup: () => Promise<void>;
  handleTranscriptionFromHandler: (text: string, isFinal: boolean) => void;
  handleWakeWordDetectedFromHandler: () => Promise<void>;
  handleErrorFromHandler: (errorPayload: SttHandlerErrorPayload) => void;
  handleProcessingAudioChange: (_isProcessing: boolean) => void;
  handleListeningForWakeWordChange: (_isListening: boolean) => void;
}

const MIN_TIME_BETWEEN_REINITS_MS = 2000;
const LLM_STATE_DEBOUNCE_MS = 300;
const VAD_COMMAND_RESULT_TIMEOUT_MS = 7000;

export function useSttManager(options: UseSttManagerOptions): SttManagerInstance {
  const {
    settings,
    sharedState,
    micPermissionStatus,
    isProcessingLLM,
    audioFeedback,
    transcriptionDisplay,
    emit,
    toast,
  } = options;

  const scope: EffectScope = effectScope();
  const handlers = new Map<SttInternalHandlerType, SttHandlerInstance>();
  const _activeHandlerApi = shallowRef<SttHandlerInstance | null>(null);
  const _currentModeInstance = shallowRef<BaseSttMode | null>(null);

  const isReinitializing = ref(false);
  const isAwaitingVadCommandResult = ref(false);
  const lastReinitializeTime = ref(0);
  let vadCommandResultTimeoutId: number | null = null;
  let llmDebounceTimer: number | null = null;

  const targetInternalHandlerType = computed<SttInternalHandlerType>(() => {
    return settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
  });

  const isActive = computed<boolean>(() => _currentModeInstance.value?.isActive.value ?? false);
  const canStart = computed<boolean>(() => _currentModeInstance.value?.canStart.value ?? false);
  const isProcessingAudio = computed<boolean>(() => _activeHandlerApi.value?.isActive?.value ?? false);
  const isListeningForWakeWord = computed<boolean>(() => _activeHandlerApi.value?.isListeningForWakeWord?.value ?? false);

  const statusText = computed<string>(() => {
    if (sharedState.currentRecordingStatusHtml.value.includes('mode-hint-feedback')) {
      return sharedState.currentRecordingStatusHtml.value;
    }
    return _currentModeInstance.value?.statusText.value ?? 'Initializing STT...';
  });

  const placeholderText = computed<string>(() => _currentModeInstance.value?.placeholderText.value ?? 'Please wait, voice input loading...');

  const isContinuousMode = computed<boolean>(() => options.audioMode.value === 'continuous');
  const isVoiceActivationMode = computed<boolean>(() => options.audioMode.value === 'voice-activation');

  const _createModeContext = (): SttModeContext => ({
    isProcessingLLM: isProcessingLLM as Readonly<Ref<boolean>>, // Already Readonly<Ref<T>> from props
    micPermissionGranted: computed(() => micPermissionStatus.value === 'granted'),
    activeHandlerApi: _activeHandlerApi as Readonly<Ref<SttHandlerInstance | null>>, // Already Readonly<ShallowRef<T>> from SttManagerInstance
    settings: settings as Readonly<Ref<VoiceApplicationSettings>>, // Already Readonly<Ref<T>> from props
    sharedState,
    transcriptionDisplay,
    audioFeedback,
    toast,
    emit,
    audioMode: options.audioMode as Readonly<Ref<AudioInputMode>>, // Already Readonly<Ref<T>> from props
    playSound: (buffer: AudioBuffer | null, volume?: number) => audioFeedback.playSound(buffer, volume),
    isAwaitingVadCommandResult: readonly(isAwaitingVadCommandResult) as Readonly<Ref<boolean>>,
    clearVadCommandTimeout: () => _clearVadCommandTimeout(),
  });

  const _createMode = (modeValue: AudioInputMode): BaseSttMode | null => {
    const context = _createModeContext();
    console.log(`[SttManager] Creating mode instance for: ${modeValue}`);
    switch (modeValue) {
      case 'push-to-talk': return new PttMode(context);
      case 'continuous': return new ContinuousMode(context);
      case 'voice-activation': return new VadMode(context);
      default:
        console.error(`[SttManager] Unknown audio mode specified: ${modeValue}`);
        toast?.add({ type: 'error', title: 'Internal Mode Error', message: `Unsupported audio mode: ${modeValue}` });
        return null;
    }
  };

  const _shouldAutoStartListening = (): boolean => {
    if (isReinitializing.value || !_activeHandlerApi.value) return false;
    if (isProcessingLLM.value && !isAwaitingVadCommandResult.value) return false;
    if (micPermissionStatus.value !== 'granted') return false;

    const autoStartMode = isContinuousMode.value || isVoiceActivationMode.value;
    const notAlreadyActiveOrListening = !isProcessingAudio.value && !isListeningForWakeWord.value;

    return autoStartMode && notAlreadyActiveOrListening;
  };

  const _clearVadCommandTimeout = () => {
    if (vadCommandResultTimeoutId) {
      clearTimeout(vadCommandResultTimeoutId);
      vadCommandResultTimeoutId = null;
    }
    isAwaitingVadCommandResult.value = false;
  };

  const _switchMode = async (newModeValue: AudioInputMode): Promise<void> => {
    console.log(`[SttManager] Attempting to switch mode to: ${newModeValue}`);

    const oldModeInstance = _currentModeInstance.value;
    if (oldModeInstance) {
      console.log(`[SttManager] Cleaning up old mode: ${oldModeInstance.constructor.name}`);
      await oldModeInstance.stop();
      oldModeInstance.cleanup();
    }

    _currentModeInstance.value = _createMode(newModeValue);
    if (_currentModeInstance.value) {
      console.log(`[SttManager] Successfully switched to new mode: ${_currentModeInstance.value.constructor.name}`);
      if (_shouldAutoStartListening()) {
        console.log(`[SttManager] Auto-starting STT for mode '${newModeValue}' after mode switch.`);
        await _currentModeInstance.value.start();
      }
    } else {
      console.error(`[SttManager] Failed to create instance for mode: ${newModeValue}`);
    }
  };

  const registerHandler = (type: SttInternalHandlerType, api: SttHandlerInstance): void => {
    console.log(`[SttManager] Registering STT handler: ${type}`);
    handlers.set(type, api);

    if (targetInternalHandlerType.value === type) {
      console.log(`[SttManager] Setting active STT handler to: ${type}`);
      _activeHandlerApi.value = api;

      if (_currentModeInstance.value && !_currentModeInstance.value.isActive.value && _currentModeInstance.value.canStart.value) {
        if (isContinuousMode.value || isVoiceActivationMode.value) {
          console.log(`[SttManager] Handler '${type}' registered, auto-starting STT for mode: ${options.audioMode.value}.`);
          _currentModeInstance.value.start();
        }
      }
    }
  };

  const unregisterHandler = async (type: SttInternalHandlerType): Promise<void> => {
    console.log(`[SttManager] Unregistering STT handler: ${type}`);
    const handlerApiToUnregister = handlers.get(type);
    if (handlerApiToUnregister) {
      await handlerApiToUnregister.stopAll(true);
      handlers.delete(type);
    }

    if (_activeHandlerApi.value === handlerApiToUnregister) {
      console.log(`[SttManager] Active STT handler '${type}' was unregistered.`);
      _activeHandlerApi.value = null;
      const modeInstance = _currentModeInstance.value;
      if (modeInstance?.isActive.value) {
        console.warn(`[SttManager] Active handler removed while mode '${modeInstance.constructor.name}' was active. Stopping mode.`);
        await modeInstance.stop();
      }
    }
  };

  const _reinitializeActiveHandler = async (): Promise<void> => {
    const now = Date.now();
    if (now - lastReinitializeTime.value < MIN_TIME_BETWEEN_REINITS_MS) {
      console.warn(`[SttManager] Reinitialization attempt blocked: too soon (last was ${now - lastReinitializeTime.value}ms ago).`);
      return;
    }

    if (isReinitializing.value || !_activeHandlerApi.value) {
      console.warn('[SttManager] Reinitialization attempt blocked: already in progress or no active handler.');
      return;
    }

    isReinitializing.value = true;
    lastReinitializeTime.value = now;
    _clearVadCommandTimeout();

    console.log('[SttManager] Reinitializing active STT handler...');
    try {
      await _activeHandlerApi.value.reinitialize();
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error: any) {
      console.error('[SttManager] Error during STT handler reinitialization:', error.message);
      emit('voice-input-error', { type: 'handler_command', message: 'Failed to reinitialize STT handler.' } as SttHandlerErrorPayload);
    } finally {
      isReinitializing.value = false;
    }

    await new Promise(resolve => setTimeout(resolve, 250));

    if (_shouldAutoStartListening()) {
      console.log('[SttManager] Auto-starting STT after reinitialization.');
      if (_currentModeInstance.value) {
        await _currentModeInstance.value.start();
      }
    }
  };


  const handleMicButtonClick = async (): Promise<void> => {
    const currentMode = _currentModeInstance.value;
    if (!currentMode) {
      console.error('[SttManager] Microphone button clicked, but no STT mode instance is active.');
      toast?.add({ type: 'error', title: 'Mode Error', message: 'No voice input mode selected or initialized.' });
      return;
    }
    if (currentMode.requiresHandler && !_activeHandlerApi.value) {
      toast?.add({ type: 'warning', title: 'STT Service Unavailable', message: 'The speech recognition service is not ready.' });
      return;
    }

    if (currentMode.isActive.value) {
      await currentMode.stop();
    } else if (currentMode.canStart.value) {
      await currentMode.start();
    } else {
      console.warn('[SttManager] Mic button clicked, but current mode cannot start.');
      if (micPermissionStatus.value !== 'granted') {
        toast?.add({ type: 'error', title: 'Microphone Permission', message: 'Microphone access is required. Please grant permission.' });
      } else if (isProcessingLLM.value) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'The assistant is currently processing your request.' });
      } else {
        toast?.add({ type: 'info', title: 'Voice Input Not Ready', message: 'Cannot start voice input at the moment. Please try again shortly.' });
      }
    }
  };

  const handleTranscriptionFromHandler = (text: string, isFinal: boolean): void => {
    if (isAwaitingVadCommandResult.value) {
      console.log('[SttManager] VAD command transcription received. Clearing VAD command await flag.');
      _clearVadCommandTimeout();
    }

    const currentMode = _currentModeInstance.value;
    if (!currentMode) {
      console.warn('[SttManager] Received transcription but no current mode instance is active to handle it.');
      return;
    }

    if (isFinal) {
      currentMode.handleTranscription(text);
    } else {
      const interimHandler = (currentMode as any).handleInterimTranscript;
      if (typeof interimHandler === 'function') {
        interimHandler.call(currentMode, text);
      } else {
        sharedState.pendingTranscript.value = text;
      }
    }
  };

  const handleWakeWordDetectedFromHandler = async (): Promise<void> => {
    if (options.audioMode.value === 'voice-activation' && _currentModeInstance.value instanceof VadMode) {
      isAwaitingVadCommandResult.value = true;
      vadCommandResultTimeoutId = window.setTimeout(() => {
        console.warn('[SttManager] VAD command result timeout. No command received after wake word.');
        _clearVadCommandTimeout();
        if (_currentModeInstance.value instanceof VadMode) {
            _currentModeInstance.value.handleError({
                type: 'recognition',
                code: 'vad-command-timeout-internal',
                message: 'No command speech detected after wake word (internal timeout).',
                fatal: false,
            });
        }
      }, VAD_COMMAND_RESULT_TIMEOUT_MS);

      await (_currentModeInstance.value as VadMode).handleWakeWordDetected();
    } else {
      console.warn(`[SttManager] Wake word detected event received, but not in VAD mode or current mode is not VadMode instance. Mode: ${options.audioMode.value}`);
    }
  };

  const handleErrorFromHandler = (errorPayload: SttHandlerErrorPayload): void => {
    console.error('[SttManager] Error received from STT handler:', JSON.stringify(errorPayload));

    if (isAwaitingVadCommandResult.value && errorPayload.code !== 'vad-command-timeout-internal') {
      console.log('[SttManager] Error occurred during VAD command phase. Clearing VAD command await flag.');
      _clearVadCommandTimeout();
    }

    const mode = _currentModeInstance.value;
    if (mode) {
      mode.handleError(errorPayload);
    } else {
      emit('voice-input-error', errorPayload);
      toast?.add({ type: 'error', title: `STT Error: ${errorPayload.type}`, message: errorPayload.message });
    }
  };

  const handleProcessingAudioChange = (_isProcessing: boolean): void => {
    // Marked as unused
  };

  const handleListeningForWakeWordChange = (_isListening: boolean): void => {
    // Marked as unused
  };

  const cleanup = async (): Promise<void> => {
    console.log('[SttManager] Cleanup process initiated...');

    if (llmDebounceTimer) clearTimeout(llmDebounceTimer);
    _clearVadCommandTimeout();

    const modeToCleanup = _currentModeInstance.value;
    _currentModeInstance.value = null;

    if (modeToCleanup) {
      try {
        console.log(`[SttManager] Stopping and cleaning up mode: ${modeToCleanup.constructor.name}`);
        await modeToCleanup.stop();
        modeToCleanup.cleanup();
      } catch (e: any) {
        console.error(`[SttManager] Error during cleanup of mode ${modeToCleanup.constructor.name}:`, e.message);
      }
    }

    for (const [type, handler] of handlers) {
      try {
        console.log(`[SttManager] Stopping handler: ${type}`);
        await handler.stopAll(true);
      } catch (e: any) {
        console.error(`[SttManager] Error stopping handler ${type}:`, e.message);
      }
    }

    handlers.clear();
    _activeHandlerApi.value = null;
    console.log('[SttManager] Cleanup process complete.');
  };

  scope.run(() => {
    watch(options.audioMode, (newMode, oldMode) => {
      if (newMode !== oldMode) {
        _switchMode(newMode);
      }
    }, { immediate: true });

    watch(targetInternalHandlerType, async (newInternalType, oldInternalType) => {
      if (newInternalType === oldInternalType) return;
      console.log(`[SttManager] Target STT handler type changed: ${oldInternalType || 'none'} -> ${newInternalType}`);

      const newHandlerInstance = handlers.get(newInternalType);
      if (newHandlerInstance) {
        _activeHandlerApi.value = newHandlerInstance;
        console.log(`[SttManager] Switched active handler to: ${newInternalType}. Reinitializing...`);
        await _reinitializeActiveHandler();
      } else {
        if (_activeHandlerApi.value) {
            console.log(`[SttManager] Target handler ${newInternalType} not registered. Stopping current active handler.`);
            await _activeHandlerApi.value.stopAll(true);
        }
        _activeHandlerApi.value = null;
        console.log(`[SttManager] Active STT handler set to null as '${newInternalType}' is not yet registered.`);
      }
    });

    watch(isProcessingLLM, async (isLLMNowProcessing) => {
      if (llmDebounceTimer) clearTimeout(llmDebounceTimer);

      if (isLLMNowProcessing) {
        if (!isListeningForWakeWord.value && !isAwaitingVadCommandResult.value && isActive.value) {
          console.log('[SttManager] LLM processing started. Stopping active STT (not VAD wake/command phase).');
          if (_currentModeInstance.value) {
            await _currentModeInstance.value.stop();
          }
        }
      } else {
        _clearVadCommandTimeout();
        llmDebounceTimer = window.setTimeout(async () => {
          if (!isProcessingLLM.value && _shouldAutoStartListening()) {
            console.log('[SttManager] LLM processing finished. Restarting STT for applicable mode.');
            await _reinitializeActiveHandler();
          }
          llmDebounceTimer = null;
        }, LLM_STATE_DEBOUNCE_MS);
      }
    });

    watch(micPermissionStatus, async (newStatus, oldStatus) => {
      if (newStatus === oldStatus) return;
      console.log(`[SttManager] Microphone permission status changed: ${oldStatus || 'initial'} -> ${newStatus}`);

      if (newStatus !== 'granted') {
        if (_currentModeInstance.value?.isActive.value) {
          console.warn('[SttManager] Microphone permission lost or denied. Stopping active STT mode.');
          await _currentModeInstance.value.stop();
          toast?.add({ type: 'error', title: 'Microphone Access Issue', message: 'Microphone access was lost or denied. Voice input stopped.' });
        }
      } else if (oldStatus !== 'granted' && _shouldAutoStartListening()) {
        console.log('[SttManager] Microphone permission granted. Attempting to auto-start STT if applicable.');
        await _reinitializeActiveHandler();
      }
    });
  });

  onScopeDispose(async () => {
    console.log('[SttManager] SttManager scope is being disposed. Initiating cleanup.');
    await cleanup();
  });

  // Ensure returned types for Readonly<ShallowRef<T>> are correct
  return {
    currentModeInstance: readonly(_currentModeInstance) as Readonly<ShallowRef<BaseSttMode | null>>,
    isActive,
    canStart,
    statusText,
    placeholderText,
    activeHandlerApi: readonly(_activeHandlerApi) as Readonly<ShallowRef<SttHandlerInstance | null>>,
    isProcessingAudio,
    isListeningForWakeWord,
    handleMicButtonClick,
    registerHandler,
    unregisterHandler,
    cleanup,
    handleTranscriptionFromHandler,
    handleWakeWordDetectedFromHandler,
    handleErrorFromHandler,
    handleProcessingAudioChange,
    handleListeningForWakeWordChange,
  };
}