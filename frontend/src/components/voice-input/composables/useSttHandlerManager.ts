// File: frontend/src/components/voice-input/composables/useSttHandlerManager.ts
import { ref, computed, watch, nextTick, type Ref, type Component } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode, STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

export interface SttHandlerInstance {
  startListening: (forVadCommand: boolean) => Promise<void | boolean>; // Can return boolean for success/fail
  stopListening: (abort?: boolean) => Promise<void>;
  reinitialize: () => Promise<void>;
  stopAll: (abort?: boolean) => Promise<void>;
  // Status flags from the handler itself
  isActive?: Readonly<Ref<boolean>>; // Should be Readonly<Ref<boolean>>
  isListeningForWakeWord?: Readonly<Ref<boolean>>; // Should be Readonly<Ref<boolean>>
  hasPendingTranscript?: Readonly<Ref<boolean>>; // Should be Readonly<Ref<boolean>>
  pendingTranscript?: Readonly<Ref<string>>; // Should be Readonly<Ref<string>>
  clearPendingTranscript?: () => void;
}

export interface UseSttHandlerManagerOptions {
  settings: Readonly<Ref<VoiceApplicationSettings>>; // Ensure this is Readonly<Ref<...>>
  toast?: ToastService;
  isProcessingLLM: Readonly<Ref<boolean>>; // Ensure this is Readonly<Ref<...>>
  currentMicPermission: Readonly<Ref<'prompt' | 'granted' | 'denied' | 'error' | ''>>; // Ensure this is Readonly<Ref<...>>
}

export interface SttHandlerEvents {
  onTranscription: (text: string) => void;
  onProcessingAudio: (isProcessing: boolean) => void;
  onListeningForWakeWord: (isListening: boolean) => void;
  onWakeWordDetected: () => void;
  onError: (error: { type: string; message: string; code?: string }) => void;
  onReady: (handlerId: 'browser' | 'whisper', handlerApi: SttHandlerInstance) => void; // Pass handlerId too
}

export function useSttHandlerManager(options: UseSttHandlerManagerOptions, events: SttHandlerEvents) {
  const { settings, toast, isProcessingLLM, currentMicPermission } = options;

  const browserHandlerRef = ref<SttHandlerInstance | null>(null);
  const whisperHandlerRef = ref<SttHandlerInstance | null>(null);

  const isAnyHandlerReady = ref(false); // True if *any* handler is registered and potentially ready
  const activeHandlerType = ref<'browser' | 'whisper' | null>(null);

  // This computed determines which handler *should* be active based on settings
  const targetHandlerType = computed<'browser' | 'whisper'>(() => {
    return settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
  });

  // This computed provides the actual API of the currently active and ready handler
  const activeHandlerApi = computed<SttHandlerInstance | null>(() => {
    const currentTarget = targetHandlerType.value;
    if (currentTarget === 'browser' && browserHandlerRef.value) {
      return browserHandlerRef.value;
    }
    if (currentTarget === 'whisper' && whisperHandlerRef.value) {
      return whisperHandlerRef.value;
    }
    return null;
  });

  // Reflects if the *currently desired* handler is ready
  const isCurrentHandlerReady = computed<boolean>(() => !!activeHandlerApi.value);


  // Expose combined processing/listening states from the active handler, or default to false
  const isProcessingAudio = computed<boolean>(() => activeHandlerApi.value?.isActive?.value ?? false);
  const isListeningForWakeWord = computed<boolean>(() => activeHandlerApi.value?.isListeningForWakeWord?.value ?? false);


  const currentAudioMode = computed(() => settings.value.audioInputMode);
  const isPttMode = computed(() => currentAudioMode.value === 'push-to-talk');
  const isContinuousMode = computed(() => currentAudioMode.value === 'continuous');
  const isVoiceActivationMode = computed(() => currentAudioMode.value === 'voice-activation');


  const registerHandler = (type: 'browser' | 'whisper', handlerApi: SttHandlerInstance) => {
    console.log(`[SttHandlerManager] Registering ${type} handler.`);
    if (type === 'browser') {
      browserHandlerRef.value = handlerApi;
    } else {
      whisperHandlerRef.value = handlerApi;
    }
    isAnyHandlerReady.value = true; // At least one handler is now available

    if (targetHandlerType.value === type) {
      activeHandlerType.value = type; // The newly registered handler is the one we want
      console.log(`[SttHandlerManager] ${type} handler is now the active target and registered.`);
      events.onReady(type, handlerApi); // Notify parent that the *active* handler is ready
      // Auto-start if appropriate for the newly active handler
      nextTick(() => {
        if (shouldAutoStartListening()) {
          console.log(`[SttHandlerManager] Auto-starting ${type} handler after registration.`);
          startListening();
        }
      });
    }
  };

  const unregisterHandler = async (type: 'browser' | 'whisper') => {
    console.log(`[SttHandlerManager] Unregistering ${type} handler.`);
    const handlerToStop = type === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value;
    if (handlerToStop) {
      await handlerToStop.stopAll(true); // Ensure it's fully stopped before unregistering
    }

    if (type === 'browser') {
      browserHandlerRef.value = null;
    } else {
      whisperHandlerRef.value = null;
    }

    if (activeHandlerType.value === type) { // If the unregistered handler was the active one
      activeHandlerType.value = null; // No handler is active now
      console.log(`[SttHandlerManager] Active handler ${type} was unregistered.`);
    }
    isAnyHandlerReady.value = !!(browserHandlerRef.value || whisperHandlerRef.value);
  };


  const shouldAutoStartListening = (): boolean => {
    if (!isCurrentHandlerReady.value || isProcessingLLM.value || currentMicPermission.value !== 'granted') {
      return false;
    }
    // Only auto-start for Continuous or VAD modes
    return isContinuousMode.value || isVoiceActivationMode.value;
  };

  const startListening = async (forVadCommandInternal: boolean = false): Promise<boolean> => {
    if (!activeHandlerApi.value) {
      console.warn('[SttHandlerManager] startListening: No active and ready handler available.');
      toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech service not available. Please select one or wait.'});
      return false;
    }
    if (isProcessingLLM.value && !isContinuousMode.value && !(isVoiceActivationMode.value && forVadCommandInternal) ) {
      // Allow VAD command capture even if LLM is processing, but not general PTT/Continuous.
      // Or, if it's continuous mode, it might still record but not send (handler logic).
      // This check might be redundant if BSH also has it, but good for manager level.
      console.log('[SttHandlerManager] startListening: LLM processing, and not a continuous or VAD command capture scenario. Start blocked.');
      toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.' });
      return false;
    }

    // Determine if this call is for VAD wake word based on current mode.
    // `forVadCommandInternal` is true ONLY when wake word was detected and we need to capture command.
    const isVADWakeAttempt = isVoiceActivationMode.value && !forVadCommandInternal;

    console.log(`[SttHandlerManager] Requesting active handler to start. VADWakeAttempt: ${isVADWakeAttempt}, forVadCommandInternal: ${forVadCommandInternal}`);
    try {
      // `startListening` on the handler will receive `true` if it's for actual command capture after VAD,
      // and `false` if it's PTT, Continuous, OR VAD wake word listening.
      // The handler itself differentiates VAD wake vs continuous via its internal mode.
      const success = await activeHandlerApi.value.startListening(forVadCommandInternal);
      return typeof success === 'boolean' ? success : true; // Assume success if no boolean returned
    } catch (error) {
      console.error('[SttHandlerManager] Error calling startListening on active handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue start command to STT handler.', code: 'START_CMD_FAIL' });
      return false;
    }
  };

  const stopListening = async (abort: boolean = false): Promise<void> => {
    if (!activeHandlerApi.value) {
      // console.warn('[SttHandlerManager] stopListening: No active handler.');
      return;
    }
    console.log(`[SttHandlerManager] Requesting active handler to stop. Abort: ${abort}`);
    try {
      await activeHandlerApi.value.stopListening(abort);
    } catch (error) {
      console.error('[SttHandlerManager] Error calling stopListening on active handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue stop command to STT handler.', code: 'STOP_CMD_FAIL'});
    }
  };

  const stopAll = async (): Promise<void> => {
    if (!activeHandlerApi.value) {
      // console.warn('[SttHandlerManager] stopAll: No active handler.');
      return;
    }
    console.log(`[SttHandlerManager] Requesting active handler to stopAll.`);
    try {
      await activeHandlerApi.value.stopAll(true); // Always abort on stopAll from manager
    } catch (error) {
      console.error('[SttHandlerManager] Error calling stopAll on active handler:', error);
       events.onError({ type: 'handler_command', message: 'Failed to issue stopAll command to STT handler.', code: 'STOPALL_CMD_FAIL'});
    }
  };

  const reinitializeActiveHandler = async (): Promise<void> => {
    if (!activeHandlerApi.value) {
      console.warn('[SttHandlerManager] reinitializeActiveHandler: No active handler to reinitialize.');
      return;
    }
    console.log(`[SttHandlerManager] Requesting active handler (${activeHandlerType.value || 'unknown'}) to reinitialize.`);
    try {
      await activeHandlerApi.value.reinitialize();
      // After reinitialize, check if it should auto-start
      if (shouldAutoStartListening()) {
        console.log(`[SttHandlerManager] Auto-starting after reinitialize.`);
        await nextTick(); // Allow handler's internal reinit to settle
        startListening();
      }
    } catch (error) {
      console.error('[SttHandlerManager] Error calling reinitialize on active handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue reinitialize command to STT handler.', code: 'REINIT_CMD_FAIL'});
    }
  };

  const handlePttClick = async () => {
    if (!isPttMode.value || !activeHandlerApi.value) {
      console.warn('[SttHandlerManager] PTT click ignored: Not PTT mode or no active handler.');
      return;
    }
    const currentHandlerIsActive = activeHandlerApi.value.isActive?.value ?? false;
    console.log(`[SttHandlerManager] PTT button clicked. Handler active: ${currentHandlerIsActive}`);
    if (currentHandlerIsActive) {
      await stopListening(false); // Graceful stop for PTT to finalize transcription
    } else {
      // Ensure mic permission before starting. startListening will also check.
      if (currentMicPermission.value !== 'granted') {
        toast?.add({type: 'warning', title: 'Microphone Access', message: 'Please grant microphone permission to record.'});
        // Potentially trigger permission request here if VoiceInput doesn't handle it on button click
        return;
      }
      await startListening(false);
    }
  };

  // Watch for changes in STT Preference (Browser vs Whisper)
  watch(targetHandlerType, async (newType, oldType) => {
    if (newType === oldType || !isAnyHandlerReady.value) return; // No change or no handlers registered yet

    console.log(`[SttHandlerManager] Target STT preference changed: ${oldType || 'none'} -> ${newType}.`);

    // Stop the old handler if it was active
    const oldHandlerApi = oldType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value;
    if (oldHandlerApi && activeHandlerType.value === oldType) {
      console.log(`[SttHandlerManager] Stopping old ${oldType} handler.`);
      await oldHandlerApi.stopAll(true);
    }
    activeHandlerType.value = null; // Mark no handler as active until the new one is ready

    // The new target handler might already be registered. If so, call onReady.
    const newHandlerApi = newType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value;
    if (newHandlerApi) {
      activeHandlerType.value = newType;
      console.log(`[SttHandlerManager] New target handler ${newType} is already registered. Notifying ready.`);
      events.onReady(newType, newHandlerApi);
      // Reinitialize and auto-start the new active handler
      console.log(`[SttHandlerManager] Reinitializing new active ${newType} handler due to preference change.`);
      await reinitializeActiveHandler(); // This also handles auto-start
    } else {
      console.log(`[SttHandlerManager] New target handler ${newType} is not yet registered. Waiting for registration.`);
      // Parent VoiceInput component is responsible for mounting/providing the correct handler component instance.
    }
  });


  // Watch for changes in Audio Input Mode
  watch(currentAudioMode, async (newMode, oldMode) => {
    if (newMode === oldMode || !isCurrentHandlerReady.value || !activeHandlerApi.value) return;

    console.log(`[SttHandlerManager] Audio input mode changed: ${oldMode} -> ${newMode}. Current STT: ${activeHandlerType.value}`);

    // Always stop the current STT activity before mode-specific actions.
    // This ensures cleaner transitions. Use abort=true for quick change.
    console.log(`[SttHandlerManager] Stopping current STT due to mode change.`);
    await activeHandlerApi.value.stopAll(true); // Use the computed activeHandlerApi

    // Wait for stop to complete and state to potentially settle in handler
    await nextTick();

    // Now, re-evaluate auto-start for the new mode or specific actions
    if (shouldAutoStartListening()) {
        console.log(`[SttHandlerManager] New mode (${newMode}) requires auto-start. Starting listening.`);
        // Need to ensure the handler is re-initialized correctly for the new mode if its internal logic depends on it.
        // `reinitializeActiveHandler` handles both reinitialization and auto-start.
        await reinitializeActiveHandler();
    } else {
        console.log(`[SttHandlerManager] New mode (${newMode}) does not require auto-start. Handler remains idle unless PTT is used.`);
        // For PTT, no auto-start. For other modes if shouldAutoStartListening is false (e.g. mic perm lost), it won't start.
        // If transitioning *to* PTT, just ensure it's stopped and ready.
        // If handler was active and is now PTT, it's stopped. If it was idle, it remains idle.
        // Call reinitialize to ensure it's in a clean state for the new PTT mode.
         if (newMode === 'push-to-talk' && activeHandlerApi.value) {
             console.log("[SttHandlerManager] Mode changed to PTT, ensuring handler is reinitialized for PTT.")
             await activeHandlerApi.value.reinitialize(); // Ensure clean state for PTT
         }
    }
  }, { immediate: false }); // immediate: false to avoid running on initial setup before handler is ready


  // Watch for LLM processing state changes
  watch(isProcessingLLM, async (isLLMNowProcessing, wasLLMProcessing) => {
    if (!isCurrentHandlerReady.value || !activeHandlerApi.value) return;
    if (isLLMNowProcessing === wasLLMProcessing) return; // No actual change

    console.log(`[SttHandlerManager] isProcessingLLM changed: ${wasLLMProcessing} -> ${isLLMNowProcessing}`);

    if (isLLMNowProcessing) {
      // LLM started processing. If STT is active, BSH itself should react to its prop.
      // Manager can also issue a stop command as a safeguard, though BSH's watcher should handle it.
      // This might be redundant if BSH's own watcher for parentIsProcessingLLM is effective.
      const currentHandlerIsActive = activeHandlerApi.value.isActive?.value ?? false;
      const currentHandlerIsVADWake = activeHandlerApi.value.isListeningForWakeWord?.value ?? false;
      if (currentHandlerIsActive || currentHandlerIsVADWake) {
         console.log('[SttHandlerManager] LLM started. Instructing active STT handler to stop all.');
         await activeHandlerApi.value.stopAll(true); // Force abort
      }
    } else {
      // LLM finished processing. Restart STT if it's continuous/VAD and conditions are met.
      if (shouldAutoStartListening()) {
        console.log('[SttHandlerManager] LLM finished processing. Conditions met to auto-start STT.');
        // Ensure state is IDLE in BSH before starting.
        // Reinitialize might be safer to ensure the handler is in a clean state.
        await nextTick(); // Allow BSH to process its own watcher for parentIsProcessingLLM first
        if (activeHandlerApi.value?.isActive?.value === false && activeHandlerApi.value?.isListeningForWakeWord?.value === false) {
            console.log('[SttHandlerManager] Handler appears idle after LLM finished. Attempting start.');
            startListening(); // This will internally decide if it's for VAD wake or continuous based on mode
        } else {
            console.log('[SttHandlerManager] LLM finished, but handler is not fully idle or conditions changed. Reinitializing for safety.');
            await reinitializeActiveHandler(); // This will re-init and then auto-start if appropriate.
        }

      } else {
         console.log('[SttHandlerManager] LLM finished, but conditions not met for auto-start STT.');
      }
    }
  });

  // Watch for microphone permission changes
  watch(currentMicPermission, async (newPerm, oldPerm) => {
    if (newPerm === oldPerm || !isCurrentHandlerReady.value || !activeHandlerApi.value) return;
    console.log(`[SttHandlerManager] Mic permission changed: ${oldPerm} -> ${newPerm}.`);
    if (newPerm !== 'granted') {
      console.log('[SttHandlerManager] Mic permission not granted. Stopping STT.');
      await activeHandlerApi.value.stopAll(true);
    } else { // Permission newly granted
      if (shouldAutoStartListening()) {
        console.log('[SttHandlerManager] Mic permission granted. Auto-starting STT.');
        await nextTick();
        // It's possible the handler needs reinitialization if it was in an error state due to lack of permission.
        await reinitializeActiveHandler(); // This will also attempt auto-start.
      }
    }
  });

  // Propagate isActive and isListeningForWakeWord changes from the active handler to the parent (VoiceInput)
  watch(isProcessingAudio, (newVal) => {
    events.onProcessingAudio(newVal);
  });
  watch(isListeningForWakeWord, (newVal) => {
    events.onListeningForWakeWord(newVal);
  });


  return {
    // Refs for parent to populate
    browserHandlerRef, // Not typically needed externally if using registerHandler correctly
    whisperHandlerRef, // "

    // State
    isCurrentHandlerReady, // Use this to check if the *desired* handler is ready
    isProcessingAudio,     // Combined state from the active handler
    isListeningForWakeWord,// Combined state from the active handler
    activeHandlerApi,      // Direct access to the current handler's API

    // Methods
    registerHandler,
    unregisterHandler,
    startListening,        // Manager's startListening
    stopListening,         // Manager's stopListening
    stopAll,               // Manager's stopAll
    reinitializeActiveHandler, // Manager's reinitialize
    handlePttClick,
  };
}