// File: frontend/src/components/voice-input/composables/useSttManager.ts
/**
 * @file useSttManager.ts
 * @description Unified manager for Speech-to-Text (STT) functionality.
 * Manages STT handlers (Browser, Whisper) and input modes (PTT, Continuous, VAD).
 * It orchestrates the interaction between the selected STT engine, the chosen input mode,
 * and the UI, providing a consistent STT experience.
 *
 * @version 2.4.2
 * @updated 2025-06-05
 * - Added `isExplicitlyStoppedByUser` to `SttManagerInstance` interface.
 * - Ensured readonly refs are correctly typed for context and return.
 */

import { ref, computed, watch, shallowRef, effectScope, onScopeDispose, readonly, shallowReadonly } from 'vue';
import type { Ref, ShallowRef, ComputedRef, EffectScope } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { PttMode } from './modes/usePttMode';
import { ContinuousMode } from './modes/useContinuousMode';
import { VadMode } from './modes/useVadMode';
import { BaseSttMode, type SttModeContext } from './modes/BaseSttMode';
import type { SttHandlerInstance, SttHandlerErrorPayload } from '../types';
import type { VoiceInputSharedState } from '../composables/shared/useVoiceInputState';

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
  t?: (key: string, params?: any) => string; // i18n translator function
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
  isAwaitingVadCommandResult: Readonly<Ref<boolean>>; // Expose this
  isExplicitlyStoppedByUser: Readonly<Ref<boolean>>; // ADDED
  handleMicButtonClick: () => Promise<void>;
  startPtt: () => Promise<void>; // Added for direct PTT control
  stopPtt: () => Promise<void>; // Added for direct PTT control
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
    t, // i18n translator
  } = options;

  const scope: EffectScope = effectScope();
  const handlers = new Map<SttInternalHandlerType, SttHandlerInstance>();
  const _activeHandlerApi = shallowRef<SttHandlerInstance | null>(null);
  const _currentModeInstance = shallowRef<BaseSttMode | null>(null);

  const isReinitializing = ref(false);
  const _isAwaitingVadCommandResult = ref(false); // Internal ref
  const lastReinitializeTime = ref(0);
  let vadCommandResultTimeoutId: number | null = null;
  let llmDebounceTimer: number | null = null;
  const _isExplicitlyStoppedByUser = ref(false); // Internal ref

  const targetInternalHandlerType = computed<SttInternalHandlerType>(() => {
    return settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
  });

  const isActive = computed<boolean>(() => {
    const active = _currentModeInstance.value?.isActive.value ?? false;
    const modeName = _currentModeInstance.value ? _currentModeInstance.value.constructor.name : 'none';
    console.log('[SttManager] isActive computed:', active, 'mode:', modeName);
    return active;
  });
  const canStart = computed<boolean>(() => _currentModeInstance.value?.canStart.value ?? false);
  const isProcessingAudio = computed<boolean>(() => _activeHandlerApi.value?.isActive?.value ?? false);
  const isListeningForWakeWord = computed<boolean>(() => _activeHandlerApi.value?.isListeningForWakeWord?.value ?? false);

  const statusText = computed<string>(() => {
    if (sharedState.currentRecordingStatusHtml.value.includes('mode-hint-feedback')) {
      return sharedState.currentRecordingStatusHtml.value;
    }
    const status = _currentModeInstance.value?.statusText.value ?? 'Initializing STT...';
    console.log('[SttManager] statusText computed:', status);
    return status;
  });

  const placeholderText = computed<string>(() => _currentModeInstance.value?.placeholderText.value ?? 'Please wait, voice input loading...');

  const isContinuousModeActive = computed<boolean>(() => options.audioMode.value === 'continuous');
  const isVoiceActivationModeActive = computed<boolean>(() => options.audioMode.value === 'voice-activation');

  const _createModeContext = (): SttModeContext => ({
    isProcessingLLM: options.isProcessingLLM,
    micPermissionGranted: computed(() => micPermissionStatus.value === 'granted'),
    activeHandlerApi: shallowReadonly(_activeHandlerApi),
    settings: options.settings,
    sharedState,
    transcriptionDisplay,
    audioFeedback,
    toast,
    emit,
    audioMode: options.audioMode,
    playSound: (buffer: AudioBuffer | null, volume?: number) => audioFeedback.playSound(buffer, volume),
    isAwaitingVadCommandResult: readonly(_isAwaitingVadCommandResult),
    clearVadCommandTimeout: () => _clearVadCommandTimeout(),
    isExplicitlyStoppedByUser: readonly(_isExplicitlyStoppedByUser),
    setExplicitlyStoppedByUser: (value: boolean) => { _isExplicitlyStoppedByUser.value = value; },
    t: t || ((key: string) => key), // Pass translator or fallback
  });

  const _createMode = (modeValue: AudioInputMode): BaseSttMode | null => {
    const context = _createModeContext();
    // console.log(`[SttManager] Creating mode instance for: ${modeValue}`); // Reduced verbosity
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
    if (isReinitializing.value || !_activeHandlerApi.value || _isExplicitlyStoppedByUser.value) return false;
    if (isProcessingLLM.value && !_isAwaitingVadCommandResult.value) return false;
    if (micPermissionStatus.value !== 'granted') return false;

    const autoStartModeEnabled = isContinuousModeActive.value || isVoiceActivationModeActive.value;
    const notCurrentlyActive = !isProcessingAudio.value && !isListeningForWakeWord.value && !_currentModeInstance.value?.isActive.value;
    return autoStartModeEnabled && notCurrentlyActive;
  };

  const _clearVadCommandTimeout = () => {
    if (vadCommandResultTimeoutId) {
      clearTimeout(vadCommandResultTimeoutId);
      vadCommandResultTimeoutId = null;
    }
    if (_isAwaitingVadCommandResult.value) {
      _isAwaitingVadCommandResult.value = false;
    }
  };

  const _switchMode = async (newModeValue: AudioInputMode): Promise<void> => {
    // console.log(`[SttManager] Attempting to switch mode to: ${newModeValue}`); // Reduced verbosity
    _isExplicitlyStoppedByUser.value = false;
    const oldModeInstance = _currentModeInstance.value;
    if (oldModeInstance) {
      // console.log(`[SttManager] Cleaning up old mode: ${oldModeInstance.constructor.name}`); // Reduced verbosity
      await oldModeInstance.stop();
      oldModeInstance.cleanup();
    }
    _currentModeInstance.value = _createMode(newModeValue);
    if (_currentModeInstance.value) {
      // console.log(`[SttManager] Successfully switched to new mode: ${_currentModeInstance.value.constructor.name}`); // Reduced verbosity
      if (_shouldAutoStartListening()) {
        // console.log(`[SttManager] Auto-starting STT for mode '${newModeValue}' after mode switch.`); // Reduced verbosity
        await _currentModeInstance.value.start();
      }
    }
  };

  const registerHandler = (type: SttInternalHandlerType, api: SttHandlerInstance): void => {
    console.log(`[SttManager] Registering STT handler: ${type}`); // Enable for debugging
    handlers.set(type, api);
    if (targetInternalHandlerType.value === type && !_activeHandlerApi.value) {
      _activeHandlerApi.value = api;
      console.log(`[SttManager] Active handler set to: ${type}`);
      if (_currentModeInstance.value && _shouldAutoStartListening()) {
         console.log(`[SttManager] Auto-starting after handler registration`);
         _currentModeInstance.value.start();
      }
    }
  };

  const unregisterHandler = async (type: SttInternalHandlerType): Promise<void> => {
    // console.log(`[SttManager] Unregistering STT handler: ${type}`); // Reduced verbosity
    const handlerApiToUnregister = handlers.get(type);
    if (handlerApiToUnregister) {
      await handlerApiToUnregister.stopAll(true);
      handlers.delete(type);
    }
    if (_activeHandlerApi.value === handlerApiToUnregister) {
      _activeHandlerApi.value = null;
      const modeInstance = _currentModeInstance.value;
      if (modeInstance?.isActive.value) {
        _isExplicitlyStoppedByUser.value = true;
        await modeInstance.stop();
      }
    }
  };

  const _reinitializeActiveHandler = async (forceRestart: boolean = false): Promise<void> => {
    // ... (Implementation unchanged from previous version 2.4.1) ...
    const now = Date.now();
    if (!forceRestart && now - lastReinitializeTime.value < MIN_TIME_BETWEEN_REINITS_MS) {
      console.warn(`[SttManager] Reinitialization attempt blocked: too soon (last was ${now - lastReinitializeTime.value}ms ago).`);
      return;
    }
    if (isReinitializing.value) {
      console.warn('[SttManager] Reinitialization attempt blocked: already in progress.');
      return;
    }
    if (!_activeHandlerApi.value) {
      console.warn('[SttManager] Reinitialization attempt blocked: no active handler.');
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
      // console.log('[SttManager] Auto-starting STT after reinitialization.'); // Reduced verbosity
      if (_currentModeInstance.value) {
        await _currentModeInstance.value.start();
      }
    }
  };

  const handleMicButtonClick = async (): Promise<void> => {
    // ... (Implementation unchanged from previous version 2.4.1) ...
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
      // console.log('[SttManager] Mic button: User requested STOP.'); // Reduced verbosity
      _isExplicitlyStoppedByUser.value = true;
      await currentMode.stop();
    } else if (currentMode.canStart.value) {
      // console.log('[SttManager] Mic button: User requested START.'); // Reduced verbosity
      _isExplicitlyStoppedByUser.value = false;
      await currentMode.start();
    } else {
      // console.warn('[SttManager] Mic button clicked, but current mode cannot start.'); // Reduced verbosity
      if (micPermissionStatus.value !== 'granted') {
        toast?.add({ type: 'error', title: 'Microphone Permission', message: 'Microphone access is required.' });
      } else if (isProcessingLLM.value && !_isAwaitingVadCommandResult.value) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Assistant is currently processing.' });
      } else if (_isExplicitlyStoppedByUser.value) {
        toast?.add({ type: 'info', title: t ? t('voice.voiceInputOff') : 'Voice Input Off', message: t ? t('voice.clickMicToStartListening') : 'Click mic to start listening.'});
      } else {
        toast?.add({ type: 'info', title: 'Voice Input Not Ready', message: 'Cannot start voice input now.' });
      }
    }
  };

  // PTT-specific methods
  const startPtt = async (): Promise<void> => {
    console.log('[SttManager] startPtt called');
    const currentMode = _currentModeInstance.value;
    if (!currentMode) {
      console.error('[SttManager] startPtt: No current mode instance.');
      return;
    }

    // For PTT mode, directly start without checking all conditions
    if (currentMode.constructor.name === 'PttMode') {
      _isExplicitlyStoppedByUser.value = false;
      await currentMode.start();
    }
  };

  const stopPtt = async (): Promise<void> => {
    console.log('[SttManager] stopPtt called');
    const currentMode = _currentModeInstance.value;
    if (!currentMode) {
      console.error('[SttManager] stopPtt: No current mode instance.');
      return;
    }

    // For PTT mode, directly stop
    if (currentMode.constructor.name === 'PttMode' && currentMode.isActive.value) {
      await currentMode.stop();
    }
  };

  const handleTranscriptionFromHandler = (text: string, isFinal: boolean): void => {
    const currentMode = _currentModeInstance.value;
    if (!currentMode) return;
    if (isFinal) {
      currentMode.handleTranscription(text);
    } else {
      const interimHandler = (currentMode as any).handleInterimTranscript;
      if (typeof interimHandler === 'function') interimHandler.call(currentMode, text);
      else sharedState.pendingTranscript.value = text;
    }
  };

  const handleWakeWordDetectedFromHandler = async (): Promise<void> => {
    // ... (Implementation unchanged from previous version 2.4.1) ...
    if (options.audioMode.value === 'voice-activation' && _currentModeInstance.value instanceof VadMode) {
      // Allow wake word detection even when LLM is processing - VAD should work independently
      // if (isProcessingLLM.value) {
      //   console.warn('[SttManager] Wake word detected, but LLM is processing. Ignoring.');
      //   return;
      // }
      _isAwaitingVadCommandResult.value = true;
      // console.log(`[SttManager] VAD wake word detected. Setting VAD command timeout (${VAD_COMMAND_RESULT_TIMEOUT_MS}ms).`); // Reduced verbosity
      if (vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
      vadCommandResultTimeoutId = window.setTimeout(() => {
        console.warn('[SttManager] VAD command result timeout.');
        const wasAwaiting = _isAwaitingVadCommandResult.value;
        _clearVadCommandTimeout();
        if (wasAwaiting && _currentModeInstance.value instanceof VadMode) {
            _currentModeInstance.value.handleError({
                type: 'recognition', code: 'vad-command-timeout-internal',
                message: 'No command speech detected after wake word (manager timeout).', fatal: false,
            });
        }
      }, VAD_COMMAND_RESULT_TIMEOUT_MS);
      await (_currentModeInstance.value as VadMode).handleWakeWordDetected();
    }
  };

  const handleErrorFromHandler = (errorPayload: SttHandlerErrorPayload): void => {
    // ... (Implementation unchanged from previous version 2.4.1) ...
    // console.error('[SttManager] Error from STT handler:', JSON.stringify(errorPayload)); // Reduced verbosity
    if (_isAwaitingVadCommandResult.value && errorPayload.code !== 'vad-command-timeout-internal') {
      _clearVadCommandTimeout();
    }
    const mode = _currentModeInstance.value;
    if (mode) mode.handleError(errorPayload);
    else {
      emit('voice-input-error', errorPayload);
      toast?.add({ type: 'error', title: `STT Error: ${errorPayload.type}`, message: errorPayload.message });
    }
  };

  const handleProcessingAudioChange = (_isProcessing: boolean): void => {};
  const handleListeningForWakeWordChange = (_isListening: boolean): void => {};

  const cleanup = async (): Promise<void> => {
    // ... (Implementation unchanged from previous version 2.4.1) ...
    // console.log('[SttManager] Cleanup process initiated...'); // Reduced verbosity
    if (llmDebounceTimer) clearTimeout(llmDebounceTimer);
    _clearVadCommandTimeout();
    const modeToCleanup = _currentModeInstance.value;
    _currentModeInstance.value = null;
    if (modeToCleanup) {
      try { await modeToCleanup.stop(); modeToCleanup.cleanup(); } catch (e: any) { /* ... */ }
    }
    for (const [, handler] of handlers) { try { await handler.stopAll(true); } catch (e: any) { /* ... */ } }
    handlers.clear();
    _activeHandlerApi.value = null;
    _isExplicitlyStoppedByUser.value = false;
    // console.log('[SttManager] Cleanup process complete.'); // Reduced verbosity
  };

  scope.run(() => {
    watch(options.audioMode, (newMode, oldMode) => { if (newMode !== oldMode) _switchMode(newMode); }, { immediate: true });
    watch(targetInternalHandlerType, async (newInternalType, oldInternalType) => {
      // ... (Implementation unchanged from previous version 2.4.1) ...
      if (newInternalType === oldInternalType && _activeHandlerApi.value) return;
      // console.log(`[SttManager] Target STT handler type changed: ${oldInternalType || 'none'} -> ${newInternalType}`); // Reduced verbosity
      const newHandlerInstance = handlers.get(newInternalType);
      if (newHandlerInstance) {
        if (_activeHandlerApi.value !== newHandlerInstance) {
            _activeHandlerApi.value = newHandlerInstance;
            await _reinitializeActiveHandler(true);
        }
      } else {
        if (_activeHandlerApi.value) await _activeHandlerApi.value.stopAll(true);
        _activeHandlerApi.value = null;
      }
    });
    watch(isProcessingLLM, async (isLLMNowProcessing, wasLLMProcessing) => {
      // ... (Implementation unchanged from previous version 2.4.1) ...
      if (isLLMNowProcessing === wasLLMProcessing) return;
      // console.log(`[SttManager] LLM processing state changed to: ${isLLMNowProcessing}`); // Reduced verbosity
      if (llmDebounceTimer) clearTimeout(llmDebounceTimer);
      if (isLLMNowProcessing) {
        const shouldStopStt = _currentModeInstance.value?.isActive.value && !(isVoiceActivationModeActive.value && (isListeningForWakeWord.value || _isAwaitingVadCommandResult.value));
        if (shouldStopStt && _currentModeInstance.value) await _currentModeInstance.value.stop();
      } else {
        _clearVadCommandTimeout();
        llmDebounceTimer = window.setTimeout(async () => {
          llmDebounceTimer = null;
          if (!isProcessingLLM.value && !_isExplicitlyStoppedByUser.value && _shouldAutoStartListening()) {
            await _reinitializeActiveHandler(); 
          }
        }, LLM_STATE_DEBOUNCE_MS);
      }
    });
    watch(micPermissionStatus, async (newStatus, oldStatus) => {
      // ... (Implementation unchanged from previous version 2.4.1) ...
      if (newStatus === oldStatus) return;
      // console.log(`[SttManager] Mic permission: ${oldStatus || 'initial'} -> ${newStatus}`); // Reduced verbosity
      if (newStatus !== 'granted') {
        if (_currentModeInstance.value?.isActive.value) {
          _isExplicitlyStoppedByUser.value = true;
          await _currentModeInstance.value.stop();
          toast?.add({ type: 'error', title: 'Mic Access Issue', message: 'Mic access lost. Voice input stopped.' });
        }
      } else if (oldStatus !== 'granted' && !_isExplicitlyStoppedByUser.value && _shouldAutoStartListening()) {
        await _reinitializeActiveHandler(true);
      }
    });
  }); 

  onScopeDispose(async () => {
    // console.log('[SttManager] Scope disposing. Cleanup...'); // Reduced verbosity
    await cleanup();
    if (scope) scope.stop();
  });

  return {
    currentModeInstance: shallowReadonly(_currentModeInstance),
    isActive,
    canStart,
    statusText,
    placeholderText,
    activeHandlerApi: shallowReadonly(_activeHandlerApi),
    isProcessingAudio,
    isListeningForWakeWord,
    isAwaitingVadCommandResult: readonly(_isAwaitingVadCommandResult), // Expose readonly version
    isExplicitlyStoppedByUser: readonly(_isExplicitlyStoppedByUser), // Expose readonly version
    handleMicButtonClick,
    startPtt, // Added for direct PTT control
    stopPtt, // Added for direct PTT control
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