// File: frontend/src/components/voice-input/composables/useSttModeManager.ts
/**
 * @file useSttModeManager.ts
 * @description Manages the active Speech-to-Text (STT) mode (e.g., Push-to-Talk, Continuous, VAD).
 * This composable orchestrates the lifecycle of different STT modes,
 * selects the appropriate mode based on user settings, and delegates STT operations
 * to the currently active STT handler.
 *
 * @version 1.4.0
 * @updated 2025-06-04 - Corrected playSound assignment in createModeContext to align with SttModeContext.
 * Replaced string literal "vad" with 'voice-activation' for AudioInputMode comparisons.
 * Removed unused destructured audioMode variable; using options.audioMode directly.
 * Ensured SttHandlerErrorPayload is used for error handling.
 */
import { computed, watch, shallowRef, effectScope, onScopeDispose, type EffectScope } from 'vue';
import type { ShallowRef, ComputedRef, Ref } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import { PttMode } from './modes/usePttMode';
import { ContinuousMode } from './modes/useContinuousMode';
import { VadMode } from './modes/useVadMode';
import type { BaseSttMode, SttModeContext } from './modes/BaseSttMode';
import type { VoiceInputSharedState } from './shared/useVoiceInputState';
import type { AudioFeedbackInstance } from './shared/useAudioFeedback';
import type { useTranscriptionDisplay } from './shared/useTranscriptionDisplay';
import type { SttHandlerInstance, SttEngineType, SttHandlerErrorPayload } from '../types';
import type { ToastService } from '@/services/services';

export interface UseSttModeManagerOptions {
  audioMode: Ref<AudioInputMode>;
  settings: Ref<VoiceApplicationSettings>;
  sharedState: VoiceInputSharedState;
  micPermissionStatus: Ref<string>;
  isProcessingLLM: Ref<boolean>;
  audioFeedback: AudioFeedbackInstance;
  transcriptionDisplay: ReturnType<typeof useTranscriptionDisplay>;
  emit: (event: string, ...args: any[]) => void;
  toast?: ToastService;
}

export interface SttModeManagerInstance {
  currentModeInstance: ShallowRef<BaseSttMode | null>;
  activeHandlerApi: ShallowRef<SttHandlerInstance | null>;
  isActive: ComputedRef<boolean>;
  canStart: ComputedRef<boolean>;
  statusText: ComputedRef<string>;
  placeholderText: ComputedRef<string>;
  handleMicButtonClick: () => Promise<void>;
  registerHandler: (type: SttEngineType, api: SttHandlerInstance) => void;
  unregisterHandler: (type: SttEngineType) => Promise<void>;
  cleanup: () => Promise<void>;
  handleTranscriptionFromHandler: (text: string, isFinal: boolean) => void;
  handleWakeWordDetectedFromHandler: () => Promise<void>;
  handleErrorFromHandler: (errorPayload: SttHandlerErrorPayload) => void;
}

/**
 * @function useSttModeManager
 * @description Factory function to create and manage STT modes and their interaction with STT handlers.
 * @param {UseSttModeManagerOptions} options - Dependencies and configuration for the manager.
 * @returns {SttModeManagerInstance} The public API of the STT Mode Manager.
 */
export function useSttModeManager(
  options: UseSttModeManagerOptions // audioMode is part of options
): SttModeManagerInstance {
  const {
    // audioMode is not destructured here, options.audioMode will be used directly
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
  const handlers = new Map<SttEngineType, SttHandlerInstance>();
  const activeHandlerApi = shallowRef<SttHandlerInstance | null>(null);
  const currentModeInstance = shallowRef<BaseSttMode | null>(null);

  const isActive = computed<boolean>(() => currentModeInstance.value?.isActive.value ?? false);
  const canStart = computed<boolean>(() => currentModeInstance.value?.canStart.value ?? false);
  const statusText = computed<string>(() => currentModeInstance.value?.statusText.value ?? 'Initializing...');
  const placeholderText = computed<string>(() => currentModeInstance.value?.placeholderText.value ?? 'Please wait...');

  const createModeContext = (): SttModeContext => ({
    isProcessingLLM,
    micPermissionGranted: computed(() => micPermissionStatus.value === 'granted'),
    activeHandlerApi,
    settings,
    sharedState,
    transcriptionDisplay,
    audioFeedback, // This is the AudioFeedbackInstance
    toast,
    emit,
    audioMode: options.audioMode, // Pass the manager's audioMode ref
    // Ensure this assignment matches the corrected signature in SttModeContext
    playSound: (buffer: AudioBuffer | null, volume?: number) => audioFeedback.playSound(buffer, volume),
  });

  const createMode = (modeValue: AudioInputMode): BaseSttMode | null => {
    const context = createModeContext();
    console.log(`[SttModeManager] Creating mode: ${modeValue}`);
    switch (modeValue) {
      case 'push-to-talk':
        return new PttMode(context);
      case 'continuous':
        return new ContinuousMode(context);
      case 'voice-activation': // Corrected from "vad"
        return new VadMode(context);
      default:
        console.error(`[SttModeManager] Unknown audio mode: ${modeValue}`);
        toast?.add({ type: 'error', title: 'Mode Error', message: `Unknown audio mode: ${modeValue}`});
        return null;
    }
  };

  const switchMode = async (newModeValue: AudioInputMode): Promise<void> => {
    console.log(`[SttModeManager] Switching mode to: ${newModeValue}`);
    if (currentModeInstance.value) {
      console.log(`[SttModeManager] Cleaning up old mode: ${currentModeInstance.value.constructor.name}`);
      await currentModeInstance.value.stop();
      currentModeInstance.value.cleanup();
    }
    currentModeInstance.value = createMode(newModeValue);
    console.log(`[SttModeManager] Switched to new mode: ${currentModeInstance.value?.constructor.name}`);

    if (currentModeInstance.value && (newModeValue === 'continuous' || newModeValue === 'voice-activation')) { // Corrected from "vad"
      if (micPermissionStatus.value === 'granted' && !isProcessingLLM.value && activeHandlerApi.value) {
        console.log(`[SttModeManager] Auto-starting ${newModeValue} mode after switch.`);
        await currentModeInstance.value.start();
      } else {
        console.log(`[SttModeManager] Conditions not met for auto-starting ${newModeValue} after switch: mic=${micPermissionStatus.value}, llm=${isProcessingLLM.value}, handler=${!!activeHandlerApi.value}`);
      }
    }
  };

  const registerHandler = (type: SttEngineType, api: SttHandlerInstance): void => {
    console.log(`[SttModeManager] Registering STT handler: ${type}`);
    handlers.set(type, api);
    if (settings.value.sttPreference === type) {
      console.log(`[SttModeManager] Setting active handler to registered: ${type}`);
      activeHandlerApi.value = api;
      if (currentModeInstance.value && !currentModeInstance.value.isActive.value && currentModeInstance.value.canStart.value) {
        if (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') { // Corrected from "vad"
          console.log(`[SttModeManager] Handler registered, auto-starting ${options.audioMode.value} mode.`);
          currentModeInstance.value.start();
        }
      }
    }
  };

  const unregisterHandler = async (type: SttEngineType): Promise<void> => {
    console.log(`[SttModeManager] Unregistering STT handler: ${type}`);
    const handler = handlers.get(type);
    if (handler) {
      await handler.stopAll(true);
      handlers.delete(type); // 'type' parameter is used by Map.delete
    }
    if (activeHandlerApi.value === handler) {
      console.log(`[SttModeManager] Active handler ${type} was unregistered.`);
      activeHandlerApi.value = null;
      if (currentModeInstance.value?.isActive.value) {
        console.warn(`[SttModeManager] Active STT handler removed while mode ${currentModeInstance.value.constructor.name} was active. Stopping mode.`);
        await currentModeInstance.value.stop();
      }
    }
  };

  const handleMicButtonClick = async (): Promise<void> => {
    if (!currentModeInstance.value) {
      console.error('[SttModeManager] No active mode for mic button click.');
      toast?.add({ type: 'error', title: 'Mode Error', message: 'No voice mode selected.' });
      return;
    }
    if (!activeHandlerApi.value) {
      toast?.add({ type: 'warning', title: 'STT Not Ready', message: 'Speech service unavailable.'});
      return;
    }
    if (currentModeInstance.value.isActive.value) {
      await currentModeInstance.value.stop();
    } else if (currentModeInstance.value.canStart.value) {
      await currentModeInstance.value.start();
    } else {
      console.warn('[SttModeManager] Mic button clicked, but cannot start current mode.');
      if (micPermissionStatus.value !== 'granted') {
        toast?.add({ type: 'error', title: 'Mic Permission', message: 'Microphone access required.' });
      } else if (isProcessingLLM.value) {
        toast?.add({ type: 'info', title: 'Busy', message: 'Assistant is currently processing.' });
      } else {
        toast?.add({ type: 'info', title: 'Not Ready', message: 'Cannot start voice input at the moment.' });
      }
    }
  };

  const handleTranscriptionFromHandler = (text: string, isFinal: boolean): void => {
    if (!currentModeInstance.value) {
      console.warn('[SttModeManager] Received transcription but no current mode instance.');
      return;
    }
    if (isFinal) {
      currentModeInstance.value.handleTranscription(text);
    } else {
      if (currentModeInstance.value instanceof ContinuousMode || currentModeInstance.value instanceof VadMode) {
        (currentModeInstance.value as ContinuousMode | VadMode).handleInterimTranscript?.(text);
      } else if (currentModeInstance.value instanceof PttMode) {
        (currentModeInstance.value as PttMode).handleInterimTranscript?.(text);
      }
    }
  };

  const handleWakeWordDetectedFromHandler = async (): Promise<void> => {
    if (options.audioMode.value === 'voice-activation' && currentModeInstance.value instanceof VadMode) { // Corrected from "vad"
      await (currentModeInstance.value as VadMode).handleWakeWordDetected();
    } else {
      console.warn(`[SttModeManager] Received wake word, but current mode is not VadMode or audioMode is not 'voice-activation'. Mode: ${currentModeInstance.value?.constructor.name}, AudioSetting: ${options.audioMode.value}`);
    }
  };

  const handleErrorFromHandler = (errorPayload: SttHandlerErrorPayload): void => {
    console.error('[SttModeManager] Error from STT handler:', errorPayload);
    if (currentModeInstance.value) {
      currentModeInstance.value.handleError(errorPayload); // Pass the payload directly
    } else {
      emit('error', errorPayload);
      toast?.add({type: 'error', title: `STT Error: ${errorPayload.type}`, message: errorPayload.message });
    }
  };

  const cleanup = async (): Promise<void> => {
    console.log('[SttModeManager] Cleanup initiated.');
    if (currentModeInstance.value) {
      await currentModeInstance.value.stop();
      currentModeInstance.value.cleanup();
      currentModeInstance.value = null;
    }
    for (const handlerApiInstance of handlers.values()) {
      await handlerApiInstance.stopAll(true);
    }
    handlers.clear();
    activeHandlerApi.value = null;
    console.log('[SttModeManager] Cleanup complete.');
  };

  scope.run(() => {
    watch(options.audioMode, (newMode, oldMode) => {
      if (newMode !== oldMode) {
        switchMode(newMode);
      }
    }, { immediate: true });

    watch(() => settings.value.sttPreference, (newEnginePreference, oldEnginePreference) => {
      if (newEnginePreference === oldEnginePreference) return;
      console.log(`[SttModeManager] STT engine preference changed to: ${newEnginePreference}`);
      const preferredHandler = handlers.get(newEnginePreference);
      if (preferredHandler) {
        if (activeHandlerApi.value !== preferredHandler) {
          activeHandlerApi.value = preferredHandler;
           if (currentModeInstance.value && !currentModeInstance.value.isActive.value && currentModeInstance.value.canStart.value) {
             if (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') { // Corrected from "vad"
                currentModeInstance.value.start();
             }
           }
        }
      } else {
        activeHandlerApi.value = null;
      }
    }, { immediate: true });

    watch(isProcessingLLM, async (isProcessing) => {
      if (!currentModeInstance.value) return;
      if (isProcessing && currentModeInstance.value.isActive.value) {
        if (currentModeInstance.value instanceof VadMode && (currentModeInstance.value as VadMode).getCurrentPhase() === 'listening-wake') {
          console.log('[SttModeManager] LLM processing started, VAD wake listening continues.');
          return;
        }
        console.log('[SttModeManager] LLM processing started, stopping active STT mode.');
        await currentModeInstance.value.stop();
      } else if (!isProcessing && !currentModeInstance.value.isActive.value) {
        if ((options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') && // Corrected from "vad"
            micPermissionStatus.value === 'granted' && activeHandlerApi.value && currentModeInstance.value.canStart.value) {
          console.log('[SttModeManager] LLM processing finished, auto-starting STT mode.');
          await currentModeInstance.value.start();
        }
      }
    });

    watch(micPermissionStatus, async (newStatus, oldStatus) => {
      if (!currentModeInstance.value || newStatus === oldStatus) return;
      if (newStatus === 'granted') {
        if (oldStatus !== 'granted' && (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') && // Corrected from "vad"
            !currentModeInstance.value.isActive.value && !isProcessingLLM.value && activeHandlerApi.value && currentModeInstance.value.canStart.value) {
          console.log('[SttModeManager] Mic permission granted, auto-starting STT mode.');
          await currentModeInstance.value.start();
        }
      } else if (newStatus === 'denied' || newStatus === 'error') {
        if (currentModeInstance.value.isActive.value) {
          console.warn('[SttModeManager] Mic permission lost/denied. Stopping active STT mode.');
          await currentModeInstance.value.stop();
          toast?.add({ type: 'error', title: 'Microphone Error', message: 'Microphone access was lost or denied.' });
        }
      }
    });
  }); // End of scope.run()

  onScopeDispose(async () => {
    await cleanup();
    scope.stop();
    console.log('[SttModeManager] Effect scope disposed.');
  });

  return {
    currentModeInstance,
    activeHandlerApi,
    isActive,
    canStart,
    statusText,
    placeholderText,
    handleMicButtonClick,
    registerHandler,
    unregisterHandler,
    cleanup,
    handleTranscriptionFromHandler,
    handleWakeWordDetectedFromHandler,
    handleErrorFromHandler,
  };
}
