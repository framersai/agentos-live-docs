// File: frontend/src/components/voice-input/composables/useSttModeManager.ts
/**
 * @file useSttModeManager.ts
 * @description Manages the active Speech-to-Text (STT) mode (e.g., Push-to-Talk, Continuous, VAD).
 * This composable orchestrates the lifecycle of different STT modes,
 * selects the appropriate mode based on user settings, and delegates STT operations
 * to the currently active STT handler.
 *
 * @version 1.5.0
 * @updated 2025-06-05 - Made cleanup more robust to prevent 'cannot read properties of null' error.
 * - Added UI feedback message on audio mode switch.
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
import type { useTranscriptionDisplay } from './shared/useTranscriptionDisplay'; // Corrected import name
import type { SttHandlerInstance, SttEngineType, SttHandlerErrorPayload } from '../types';
import type { ToastService } from '@/services/services';

export interface UseSttModeManagerOptions {
  audioMode: Ref<AudioInputMode>;
  settings: Ref<VoiceApplicationSettings>;
  sharedState: VoiceInputSharedState;
  micPermissionStatus: Ref<string>;
  isProcessingLLM: Ref<boolean>;
  audioFeedback: AudioFeedbackInstance;
  transcriptionDisplay: ReturnType<typeof useTranscriptionDisplay>; // Correct type
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

export function useSttModeManager(
  options: UseSttModeManagerOptions
): SttModeManagerInstance {
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
  const handlers = new Map<SttEngineType, SttHandlerInstance>();
  const activeHandlerApi = shallowRef<SttHandlerInstance | null>(null);
  const currentModeInstance = shallowRef<BaseSttMode | null>(null);

  const isActive = computed<boolean>(() => currentModeInstance.value?.isActive.value ?? false);
  const canStart = computed<boolean>(() => currentModeInstance.value?.canStart.value ?? false);
  const statusText = computed<string>(() => {
    // If transcription display is showing a mode hint, prioritize that for a moment.
    if (sharedState.currentRecordingStatusHtml.value.includes('mode-hint-feedback')) {
        return sharedState.currentRecordingStatusHtml.value;
    }
    return currentModeInstance.value?.statusText.value ?? 'Initializing...';
  });
  const placeholderText = computed<string>(() => currentModeInstance.value?.placeholderText.value ?? 'Please wait...');

  const createModeContext = (): SttModeContext => ({
    isProcessingLLM,
    micPermissionGranted: computed(() => micPermissionStatus.value === 'granted'),
    activeHandlerApi,
    settings,
    sharedState,
    transcriptionDisplay,
    audioFeedback,
    toast,
    emit,
    audioMode: options.audioMode,
    playSound: (buffer: AudioBuffer | null, volume?: number) => audioFeedback.playSound(buffer, volume),
  });

  const createMode = (modeValue: AudioInputMode): BaseSttMode | null => {
    const context = createModeContext();
    console.log(`[SttModeManager] Creating mode: ${modeValue}`);
    switch (modeValue) {
      case 'push-to-talk': return new PttMode(context);
      case 'continuous': return new ContinuousMode(context);
      case 'voice-activation': return new VadMode(context);
      default:
        console.error(`[SttModeManager] Unknown audio mode: ${modeValue}`);
        toast?.add({ type: 'error', title: 'Mode Error', message: `Unknown audio mode: ${modeValue}`});
        return null;
    }
  };

  const switchMode = async (newModeValue: AudioInputMode): Promise<void> => {
    console.log(`[SttModeManager] Switching mode to: ${newModeValue}`);
    const oldModeInstance = currentModeInstance.value;
    if (oldModeInstance) {
      console.log(`[SttModeManager] Cleaning up old mode: ${oldModeInstance.constructor.name}`);
      await oldModeInstance.stop();
      oldModeInstance.cleanup();
    }

    currentModeInstance.value = createMode(newModeValue);
    console.log(`[SttModeManager] Switched to new mode: ${currentModeInstance.value?.constructor.name}`);

    if (currentModeInstance.value) {
      let modeHint = "";
      const currentModeIsActive = currentModeInstance.value.isActive.value; // Check if it auto-started

      switch(newModeValue) {
        case 'push-to-talk':
          if (!currentModeIsActive) modeHint = "Push-to-Talk: Hold mic to speak.";
          break;
        case 'voice-activation':
          if (!currentModeIsActive) {
            const wakeWords = settings.value.vadWakeWordsBrowserSTT ?? [];
            const displayWakeWord = (wakeWords.length > 0 ? wakeWords[0] : 'wake word').toUpperCase();
            modeHint = `VAD Ready: Say "${displayWakeWord}" or press mic.`;
          }
          break;
        case 'continuous':
          if (!currentModeIsActive) modeHint = "Continuous Ready: Press mic to start listening.";
          break;
      }
      if (modeHint) {
        transcriptionDisplay.showInterimTranscript(`
            ${modeHint}
            `);
            // <span class="mode-hint-feedback">
            // </span>

        setTimeout(() => {
          // Clear only if the hint is still the current message
          if (sharedState.currentRecordingStatusHtml.value.includes(modeHint)) {
            transcriptionDisplay.clearTranscription();
          }
        }, 4000);
      }
    }

    if (currentModeInstance.value && (newModeValue === 'continuous' || newModeValue === 'voice-activation')) {
      if (micPermissionStatus.value === 'granted' && !isProcessingLLM.value && activeHandlerApi.value && currentModeInstance.value.canStart.value) {
        console.log(`[SttModeManager] Auto-starting ${newModeValue} mode after switch.`);
        await currentModeInstance.value.start();
      } else {
        console.log(`[SttModeManager] Conditions not met for auto-starting ${newModeValue} after switch: mic=${micPermissionStatus.value}, llm=${isProcessingLLM.value}, handler=${!!activeHandlerApi.value}, canStart=${currentModeInstance.value?.canStart.value}`);
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
        if (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') {
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
      handlers.delete(type);
    }
    if (activeHandlerApi.value === handler) {
      console.log(`[SttModeManager] Active handler ${type} was unregistered.`);
      activeHandlerApi.value = null;
      const modeToStop = currentModeInstance.value; // Capture instance
      if (modeToStop?.isActive.value) {
        console.warn(`[SttModeManager] Active STT handler removed while mode ${modeToStop.constructor.name} was active. Stopping mode.`);
        await modeToStop.stop();
      }
    }
  };

  const cleanup = async (): Promise<void> => {
    console.log('[SttModeManager] Cleanup initiated.');
    const modeToCleanup = currentModeInstance.value; // Capture the instance before any async ops
    currentModeInstance.value = null; // Set to null early to prevent race conditions for new mode creation

    if (modeToCleanup) {
      console.log(`[SttModeManager] Cleaning up mode: ${modeToCleanup.constructor.name}`);
      try {
        await modeToCleanup.stop();
        modeToCleanup.cleanup();
      } catch (e) {
        console.error(`[SttModeManager] Error during mode cleanup for ${modeToCleanup.constructor.name}:`, e);
      }
    }

    // Iterate over a copy of handlers if modification during iteration is a concern, though Map.values() should be fine.
    for (const [type, handlerApiInstance] of handlers) {
      console.log(`[SttModeManager] Stopping handler during cleanup: ${type}`);
      try {
        await handlerApiInstance.stopAll(true);
      } catch (e) {
         console.error(`[SttModeManager] Error stopping handler ${type} during cleanup:`, e);
      }
    }
    handlers.clear();
    activeHandlerApi.value = null; // Clear active handler API
    console.log('[SttModeManager] Cleanup complete.');
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
    const mode = currentModeInstance.value; // Capture instance
    if (!mode) {
      console.warn('[SttModeManager] Received transcription but no current mode instance.');
      return;
    }
    if (isFinal) {
      mode.handleTranscription(text);
    } else {
      if (mode instanceof ContinuousMode || mode instanceof VadMode) {
        (mode as ContinuousMode | VadMode).handleInterimTranscript?.(text);
      } else if (mode instanceof PttMode) {
        (mode as PttMode).handleInterimTranscript?.(text);
      }
    }
  };

  const handleWakeWordDetectedFromHandler = async (): Promise<void> => {
    const mode = currentModeInstance.value; // Capture instance
    if (options.audioMode.value === 'voice-activation' && mode instanceof VadMode) {
      await (mode as VadMode).handleWakeWordDetected();
    } else {
      console.warn(
        `[SttModeManager] Received wake word, but current mode is not VadMode or audioMode is not 'voice-activation'. Mode: ${mode?.constructor.name}, AudioSetting: ${options.audioMode.value}`
      );
    }
  };

  const handleErrorFromHandler = (errorPayload: SttHandlerErrorPayload): void => {
    console.error('[SttModeManager] Error from STT handler:', errorPayload);
    const mode = currentModeInstance.value; // Capture instance
    if (mode) {
      mode.handleError(errorPayload);
    } else {
      emit('error', errorPayload);
      toast?.add({type: 'error', title: `STT Error: ${errorPayload.type}`, message: errorPayload.message });
    }
  };

  scope.run(() => {
    watch(options.audioMode, (newMode, oldMode) => {
      if (newMode !== oldMode) switchMode(newMode);
    }, { immediate: true });

    watch(() => settings.value.sttPreference, (newEnginePreference, oldEnginePreference) => {
      if (newEnginePreference === oldEnginePreference) return;
      console.log(`[SttModeManager] STT engine preference changed to: ${newEnginePreference}`);
      const preferredHandler = handlers.get(newEnginePreference);
      if (preferredHandler) {
        if (activeHandlerApi.value !== preferredHandler) {
          activeHandlerApi.value = preferredHandler;
           const mode = currentModeInstance.value; // Capture instance
           if (mode && !mode.isActive.value && mode.canStart.value) {
             if (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') {
                mode.start();
             }
           }
        }
      } else {
        activeHandlerApi.value = null;
      }
    }, { immediate: true });

    watch(isProcessingLLM, async (isProcessing) => {
      const mode = currentModeInstance.value; // Capture instance
      if (!mode) return;
      if (isProcessing && mode.isActive.value) {
        if (mode instanceof VadMode && (mode as VadMode).getCurrentPhase() === 'listening-wake') {
          console.log('[SttModeManager] LLM processing started, VAD wake listening continues.');
          return;
        }
        console.log('[SttModeManager] LLM processing started, stopping active STT mode.');
        await mode.stop();
      } else if (!isProcessing && !mode.isActive.value) {
        if ((options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') &&
            micPermissionStatus.value === 'granted' && activeHandlerApi.value && mode.canStart.value) {
          console.log('[SttModeManager] LLM processing finished, auto-starting STT mode.');
          await mode.start();
        }
      }
    });

    watch(micPermissionStatus, async (newStatus, oldStatus) => {
      const mode = currentModeInstance.value; // Capture instance
      if (!mode || newStatus === oldStatus) return;
      if (newStatus === 'granted') {
        if (oldStatus !== 'granted' && (options.audioMode.value === 'continuous' || options.audioMode.value === 'voice-activation') &&
            !mode.isActive.value && !isProcessingLLM.value && activeHandlerApi.value && mode.canStart.value) {
          console.log('[SttModeManager] Mic permission granted, auto-starting STT mode.');
          await mode.start();
        }
      } else if (newStatus === 'denied' || newStatus === 'error') {
        if (mode.isActive.value) {
          console.warn('[SttModeManager] Mic permission lost/denied. Stopping active STT mode.');
          await mode.stop();
          toast?.add({ type: 'error', title: 'Microphone Error', message: 'Microphone access was lost or denied.' });
        }
      }
    });
  });

  onScopeDispose(async () => {
    console.log('[SttModeManager] Effect scope disposing. Running cleanup.');
    await cleanup();
    // scope.stop(); // Vue should handle stopping the scope if created in setup()
    console.log('[SttModeManager] Effect scope cleanup processing finished for onScopeDispose.');
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