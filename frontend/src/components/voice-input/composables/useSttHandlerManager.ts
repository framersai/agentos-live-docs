// File: frontend/src/components/voice-input/composables/useSttHandlerManager.ts
/**
 * @file useSttHandlerManager.ts
 * @description Composable for managing Speech-to-Text (STT) handlers (e.g., Browser Web Speech API, Whisper API).
 * It orchestrates handler registration, initialization, starting/stopping listening,
 * and state synchronization between the active STT handler and the UI.
 * This version includes refined VAD lifecycle management and more robust state transition guards.
 *
 * @module composables/useSttHandlerManager
 * @version 1.3.0 - Added VAD command transcription grace period; refined logging for state transitions.
 */

import { ref, computed, watch, nextTick, type Ref, readonly, shallowRef } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

/**
 * @interface SttHandlerInstance
 * @description Defines the contract for an STT handler implementation.
 * Each handler (e.g., BrowserSpeechHandler, WhisperSpeechHandler) must expose these methods and properties.
 */
export interface SttHandlerInstance {
  /**
   * Starts the speech recognition process.
   * @param {boolean} forVadCommandCapture - If true, and the handler supports VAD,
   * it should start listening for a command immediately after a wake word (rather than the wake word itself).
   * @returns {Promise<void | boolean>} A promise that resolves when listening has started, or a boolean indicating success.
   */
  startListening: (forVadCommandCapture: boolean) => Promise<void | boolean>;
  /**
   * Stops the current speech recognition process.
   * @param {boolean} [abort=false] - If true, attempts to abort recognition immediately without processing partial results.
   * @returns {Promise<void>}
   */
  stopListening: (abort?: boolean) => Promise<void>;
  /**
   * Reinitializes the handler. This typically involves stopping all current activity,
   * resetting internal state, and preparing for new recognition tasks.
   * @returns {Promise<void>}
   */
  reinitialize: () => Promise<void>;
  /**
   * Stops all recognition activities forcefully and cleans up resources.
   * @param {boolean} [abort=true] - If true, aborts immediately.
   * @returns {Promise<void>}
   */
  stopAll: (abort?: boolean) => Promise<void>;
  /** Reactive property indicating if the handler is actively processing audio for command/dictation. */
  isActive?: Readonly<Ref<boolean>>;
  /** Reactive property indicating if the handler is listening for a VAD wake word. */
  isListeningForWakeWord?: Readonly<Ref<boolean>>;
  /** Reactive property indicating if there's a pending (interim) transcript. */
  hasPendingTranscript?: Readonly<Ref<boolean>>;
  /** Reactive property holding the current pending (interim) transcript. */
  pendingTranscript?: Readonly<Ref<string>>;
  /** Method to clear any pending (interim) transcript. */
  clearPendingTranscript?: () => void;
}

/**
 * @interface UseSttHandlerManagerOptions
 * @description Configuration options for the `useSttHandlerManager` composable.
 */
export interface UseSttHandlerManagerOptions {
  /** Reactive reference to the application's voice settings. */
  settings: Readonly<Ref<VoiceApplicationSettings>>;
  /** Optional toast service for displaying notifications. */
  toast?: ToastService;
  /** Reactive reference indicating if the parent LLM is currently processing. */
  isProcessingLLM: Readonly<Ref<boolean>>;
  /** Reactive reference to the current microphone permission status. */
  currentMicPermission: Readonly<Ref<'prompt' | 'granted' | 'denied' | 'error' | ''>>;
}

/**
 * @interface SttHandlerEvents
 * @description Callbacks for events emitted by the active STT handler, to be processed by the parent UI component.
 */
export interface SttHandlerEvents {
  /** Called when a final transcription is available. @param {string} text - The transcribed text. */
  onTranscription: (text: string) => void;
  /** Called when the handler's audio processing state changes. @param {boolean} isProcessing - True if processing audio. */
  onProcessingAudio: (isProcessing: boolean) => void;
  /** Called when the handler's VAD wake word listening state changes. @param {boolean} isListening - True if listening for wake word. */
  onListeningForWakeWord: (isListening: boolean) => void;
  /** Called when a VAD wake word is detected by the handler. */
  onWakeWordDetected: () => void;
  /** Called when an error occurs in the handler. @param error - Error details. */
  onError: (error: { type: string; message: string; code?: string }) => void;
  /** Called when a handler (browser or whisper) reports it's ready. @param handlerId - ID of the ready handler. @param handlerApi - The API of the ready handler. */
  onReady: (handlerId: 'browser' | 'whisper', handlerApi: SttHandlerInstance) => void;
}

/** Minimum time (ms) to wait between reinitialization attempts to prevent rapid cycling. */
const MIN_TIME_BETWEEN_REINITS_MS = 2000;
/** Milliseconds to wait after LLM state changes before reacting (e.g., restarting STT). */
const LLM_STATE_DEBOUNCE_MS = 300; // Slightly reduced for responsiveness
/** Timeout for waiting for a VAD command result after LLM processing starts for that command. */
const VAD_COMMAND_RESULT_TIMEOUT_MS = 7000;


export function useSttHandlerManager(options: UseSttHandlerManagerOptions, events: SttHandlerEvents) {
  const { settings, toast, isProcessingLLM, currentMicPermission } = options;

  const browserHandlerRef = shallowRef<SttHandlerInstance | null>(null);
  const whisperHandlerRef = shallowRef<SttHandlerInstance | null>(null);

  const isAnyHandlerRegistered = ref(false);
  const activeHandlerTypeInternal = ref<'browser' | 'whisper' | null>(null);
  const isReinitializing = ref(false);
  const isAwaitingVadCommandResult = ref(false); // New flag for VAD command grace period
  let vadCommandResultTimeoutId: number | null = null;

  const lastLLMStateChangeTime = ref(0);
  const lastReinitializeTime = ref(0);
  const isStartOperationInProgress = ref(false);
  let llmDebounceTimer: number | null = null;

  const targetHandlerType = computed<'browser' | 'whisper'>(() => {
    return settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
  });

  const activeHandlerApi = computed<SttHandlerInstance | null>(() => {
    const currentTarget = targetHandlerType.value;
    if (currentTarget === 'browser' && browserHandlerRef.value) return browserHandlerRef.value;
    if (currentTarget === 'whisper' && whisperHandlerRef.value) return whisperHandlerRef.value;
    return null;
  });

  const isCurrentHandlerReady = computed<boolean>(() => !!activeHandlerApi.value);
  const isProcessingAudio = computed<boolean>(() => activeHandlerApi.value?.isActive?.value ?? false);
  const isListeningForWakeWord = computed<boolean>(() => activeHandlerApi.value?.isListeningForWakeWord?.value ?? false);

  const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);
  const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
  const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
  const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

  const registerHandler = (type: 'browser' | 'whisper', handlerApi: SttHandlerInstance) => {
    console.log(`[SttMan] Registering ${type} handler.`);
    if (type === 'browser') browserHandlerRef.value = handlerApi;
    else whisperHandlerRef.value = handlerApi;
    isAnyHandlerRegistered.value = true;

    if (targetHandlerType.value === type) {
      if (activeHandlerTypeInternal.value !== type || !isCurrentHandlerReady.value) {
        activeHandlerTypeInternal.value = type;
        console.log(`[SttMan] ${type} handler is now active target and registered.`);
        events.onReady(type, handlerApi);
      }
    }
  };

  const unregisterHandler = async (type: 'browser' | 'whisper') => {
    console.log(`[SttMan] Unregistering ${type} handler.`);
    const handlerToStop = type === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value;
    if (handlerToStop) {
      await handlerToStop.stopAll(true);
    }
    if (type === 'browser') browserHandlerRef.value = null;
    else whisperHandlerRef.value = null;
    if (activeHandlerTypeInternal.value === type) activeHandlerTypeInternal.value = null;
    isAnyHandlerRegistered.value = !!(browserHandlerRef.value || whisperHandlerRef.value);
  };

  const shouldAutoStartListening = (checkDuringReinitFinalization: boolean = false): boolean => {
    const now = Date.now();
    const timeSinceLLMChange = now - lastLLMStateChangeTime.value;
    const timeSinceLastReinitAttempt = now - lastReinitializeTime.value;

    if (timeSinceLLMChange < LLM_STATE_DEBOUNCE_MS && !checkDuringReinitFinalization && !isAwaitingVadCommandResult.value) {
      console.log(`[SttMan] shouldAutoStart: NO (LLM state changed ${timeSinceLLMChange}ms ago, waiting).`);
      return false;
    }
    if (timeSinceLastReinitAttempt < MIN_TIME_BETWEEN_REINITS_MS && !checkDuringReinitFinalization) {
      console.log(`[SttMan] shouldAutoStart: NO (Last reinit attempt ${timeSinceLastReinitAttempt}ms ago).`);
      return false;
    }
    if (isReinitializing.value && !checkDuringReinitFinalization) {
      console.log('[SttMan] shouldAutoStart: NO (reinit in progress).');
      return false;
    }
    if (isStartOperationInProgress.value) {
      console.log('[SttMan] shouldAutoStart: NO (start op in progress).');
      return false;
    }
    if (!isCurrentHandlerReady.value) {
      console.log('[SttMan] shouldAutoStart: NO (No handler ready).');
      return false;
    }
    if (isProcessingLLM.value && !isAwaitingVadCommandResult.value) { // Allow auto-start if VAD command result is awaited
      console.log('[SttMan] shouldAutoStart: NO (LLM busy, not awaiting VAD command).');
      return false;
    }
    if (currentMicPermission.value !== 'granted') {
      console.log(`[SttMan] shouldAutoStart: NO (Mic perm: ${currentMicPermission.value}).`);
      return false;
    }

    const autoStartMode = isContinuousMode.value || isVoiceActivationMode.value;
    const notAlreadyActive = !isProcessingAudio.value && !isListeningForWakeWord.value;
    const result = autoStartMode && notAlreadyActive;
    console.log(`[SttMan] shouldAutoStart check: Result = ${result}. Mode: ${currentAudioMode.value}, NotAlreadyActive: ${notAlreadyActive}, HandlerReady: ${isCurrentHandlerReady.value}, LLMBusy: ${isProcessingLLM.value}, AwaitingVADRes: ${isAwaitingVadCommandResult.value}, MicPerm: ${currentMicPermission.value}`);
    return result;
  };

  const startListening = async (forVadCommandCaptureInternal: boolean = false): Promise<boolean> => {
    if (isReinitializing.value) {
      console.warn('[SttMan] startListening: Blocked, reinit in progress.');
      return false;
    }
    if (isStartOperationInProgress.value) {
      console.warn('[SttMan] startListening: Another start op already in progress.');
      return true;
    }
    if (!activeHandlerApi.value) {
      console.warn('[SttMan] startListening: No active/ready handler.');
      toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech service unavailable.'});
      return false;
    }

    if (isProcessingLLM.value && !forVadCommandCaptureInternal && !isVoiceActivationMode.value && !isAwaitingVadCommandResult.value) {
      console.log('[SttMan] startListening blocked: LLM processing and not VAD context or awaiting VAD result.');
      return false;
    }
    
    // If starting for VAD command capture, set the awaiting flag
    if (forVadCommandCaptureInternal) {
        isAwaitingVadCommandResult.value = true;
        if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
        vadCommandResultTimeoutId = window.setTimeout(() => {
            if(isAwaitingVadCommandResult.value) {
                console.warn("[SttMan] VAD command result timeout reached. Resetting flag.");
                isAwaitingVadCommandResult.value = false;
            }
        }, VAD_COMMAND_RESULT_TIMEOUT_MS);
    }


    const alreadyInTargetState = (forVadCommandCaptureInternal && isProcessingAudio.value && !isListeningForWakeWord.value) ||
                                 (!forVadCommandCaptureInternal && isVoiceActivationMode.value && isListeningForWakeWord.value) ||
                                 (!forVadCommandCaptureInternal && !isVoiceActivationMode.value && isProcessingAudio.value);

    if (alreadyInTargetState) {
      console.log(`[SttMan] startListening: Already in desired state for forVadCommandCapture=${forVadCommandCaptureInternal}.`);
      return true;
    }

    console.log(`[SttMan] Requesting handler '${activeHandlerTypeInternal.value}' to start. VADCommandCapture: ${forVadCommandCaptureInternal}`);
    isStartOperationInProgress.value = true;
    let success = false;
    try {
      const result = await activeHandlerApi.value.startListening(forVadCommandCaptureInternal);
      success = typeof result === 'boolean' ? result : true;
    } catch (error) {
      console.error('[SttMan] Error calling startListening on handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue start command.', code: 'START_CMD_FAIL'});
      success = false;
      if (forVadCommandCaptureInternal) isAwaitingVadCommandResult.value = false; // Clear flag on error
    } finally {
      isStartOperationInProgress.value = false;
    }
    return success;
  };

  const stopListening = async (abort: boolean = false): Promise<void> => {
    if (!activeHandlerApi.value || isStartOperationInProgress.value || isReinitializing.value) {
        console.warn(`[SttMan] stopListening: Blocked. Active: ${!!activeHandlerApi.value}, StartOp: ${isStartOperationInProgress.value}, Reinit: ${isReinitializing.value}`);
        return;
    }
    console.log(`[SttMan] Requesting handler '${activeHandlerTypeInternal.value}' to stop. Abort: ${abort}`);
    try {
      await activeHandlerApi.value.stopListening(abort);
    } catch (error) {
      console.error('[SttMan] Error calling stopListening on handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue stop command.', code: 'STOP_CMD_FAIL'});
    }
    isAwaitingVadCommandResult.value = false; // Stop implies VAD command phase is over
    if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
  };

  const stopAll = async (): Promise<void> => {
    if (!activeHandlerApi.value || isStartOperationInProgress.value || isReinitializing.value) {
        console.warn(`[SttMan] stopAll: Blocked. Active: ${!!activeHandlerApi.value}, StartOp: ${isStartOperationInProgress.value}, Reinit: ${isReinitializing.value}`);
        return;
    }
    console.log(`[SttMan] Requesting handler '${activeHandlerTypeInternal.value}' to stopAll.`);
    try {
      await activeHandlerApi.value.stopAll(true);
    } catch (error) {
      console.error('[SttMan] Error calling stopAll on handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue stopAll command.', code: 'STOPALL_CMD_FAIL'});
    }
    isAwaitingVadCommandResult.value = false; // StopAll implies VAD command phase is over
    if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
  };

  const reinitializeActiveHandler = async (): Promise<void> => {
    const now = Date.now();
    if (now - lastReinitializeTime.value < MIN_TIME_BETWEEN_REINITS_MS) {
      console.warn(`[SttMan] Reinit blocked: Throttled (Last: ${now - lastReinitializeTime.value}ms ago).`);
      return;
    }
    if (isReinitializing.value) {
      console.warn('[SttMan] Reinit blocked: Already in progress.');
      return;
    }
    const handlerType = activeHandlerTypeInternal.value;
    if (!activeHandlerApi.value || !handlerType) {
      console.warn('[SttMan] reinitializeActiveHandler: No active handler.');
      return;
    }
    isReinitializing.value = true;
    lastReinitializeTime.value = now;
    isAwaitingVadCommandResult.value = false; // Reinit resets VAD state
    if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
    console.log(`[SttMan] BEGIN Reinit for handler (${handlerType}).`);
    try {
      await activeHandlerApi.value.reinitialize();
      console.log(`[SttMan] Handler (${handlerType}) reinitialize() completed.`);
      await nextTick(); // Allow Vue to settle
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      console.error(`[SttMan] Error during reinitialize for handler (${handlerType}):`, error);
      events.onError({ type: 'handler_command', message: `Failed to reinit ${handlerType}.`, code: 'REINIT_CMD_FAIL'});
    } finally {
      isReinitializing.value = false;
      console.log(`[SttMan] isReinitializing = false for (${handlerType}).`);
    }
    await new Promise(resolve => setTimeout(resolve, 250)); // Post-reinit delay
    if (shouldAutoStartListening(true)) {
      console.log(`[SttMan] Auto-starting (${handlerType}) AFTER reinit.`);
      await startListening(false);
    } else {
      console.log(`[SttMan] NOT auto-starting after reinit for (${handlerType}).`);
    }
    console.log(`[SttMan] END Reinit sequence for (${handlerType}).`);
  };

  const handlePttClick = async () => {
    if (!isPttMode.value || !activeHandlerApi.value) {
      console.warn('[SttMan] PTT click: Invalid conditions.');
      return;
    }
    if (isProcessingAudio.value) await stopListening(false);
    else {
      if (currentMicPermission.value !== 'granted') {
        toast?.add({type: 'warning', title: 'Mic Access Required', message: 'Please grant mic permission.'});
        return;
      }
      await startListening(false);
    }
  };

  const handleWakeWordDetected = async () => {
    if (!isVoiceActivationMode.value || !activeHandlerApi.value) {
      console.warn('[SttMan] Wake word detected, but invalid state.');
      return;
    }
    console.log('[SttMan] Wake word detected! Manager starting command capture.');
    // The handler should have stopped VAD_WAKE. Manager now starts MAIN for command.
    await startListening(true); // true for forVadCommandCapture
  };

  // Watcher for isProcessingLLM
  watch(isProcessingLLM, async (isLLMNowProcessing, wasLLMProcessing) => {
    lastLLMStateChangeTime.value = Date.now();
    if (llmDebounceTimer) clearTimeout(llmDebounceTimer);
    if (isReinitializing.value) {
      console.log(`[SttMan] isProcessingLLM changed, but reinit in progress. LLM: ${isLLMNowProcessing}`);
      return;
    }
    console.log(`[SttMan] LLM processing: ${wasLLMProcessing} -> ${isLLMNowProcessing}. AwaitingVAD: ${isAwaitingVadCommandResult.value}`);

    if (isLLMNowProcessing) {
      // If LLM starts processing, stop STT unless it's VAD wake OR we are awaiting VAD command result.
      if (!isListeningForWakeWord.value && !isAwaitingVadCommandResult.value && (isProcessingAudio.value || isStartOperationInProgress.value)) {
        console.log('[SttMan] LLM started. Stopping STT (not VAD wake/cmd).');
        await stopAll();
      } else if (isListeningForWakeWord.value) {
        console.log('[SttMan] LLM started, VAD wake listening continues.');
      } else if (isAwaitingVadCommandResult.value) {
        console.log('[SttMan] LLM started, VAD command capture in progress, STT continues for now.');
      }
    } else { // LLM finished processing
      isAwaitingVadCommandResult.value = false; // LLM done, so VAD command phase is over.
      if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);

      llmDebounceTimer = window.setTimeout(async () => {
        if (!isProcessingLLM.value && shouldAutoStartListening()) {
          console.log('[SttMan] LLM finished. Debounced: Reinitializing for clean STT start.');
          await reinitializeActiveHandler();
        } else {
          console.log('[SttMan] LLM finished. Debounced: Not auto-starting STT.');
        }
        llmDebounceTimer = null;
      }, LLM_STATE_DEBOUNCE_MS);
    }
  });
  
  // Simplified event forwarding: The parent (VoiceInput) passes its methods as `events` callbacks.
  // The STT handler components emit to VoiceInput, which then calls these manager methods.
  // This manager reacts to state changes (props, settings) and commands the active handler.
  // If a direct event from handler to manager is needed, VoiceInput would act as intermediary.
  // The `isAwaitingVadCommandResult` is reset also if `onTranscription` or `onError` is called for a VAD command.
  // This is handled implicitly because `events.onTranscription` and `events.onError` are called by the parent,
  // and those calls often signify the end of the command capture phase.
  // We can add explicit resets here if needed:
  const originalOnTranscription = events.onTranscription;
  events.onTranscription = (text: string) => {
      if (isAwaitingVadCommandResult.value) {
          console.log("[SttMan] Transcription received for VAD command. Clearing await flag.");
          isAwaitingVadCommandResult.value = false;
          if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
      }
      originalOnTranscription(text);
  };

  const originalOnError = events.onError;
  events.onError = (error: { type: string; message: string; code?: string }) => {
      if (isAwaitingVadCommandResult.value) {
          console.log("[SttMan] Error received during VAD command. Clearing await flag.");
          isAwaitingVadCommandResult.value = false;
          if(vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
      }
      originalOnError(error);
  };


  // Other watchers (targetHandlerType, currentAudioMode, currentMicPermission) remain similar to v1.2.0 logic.
  // Ensure they call reinitializeActiveHandler which now resets isAwaitingVadCommandResult.
   watch(targetHandlerType, async (newType, oldType) => {
    if (newType === oldType || !isAnyHandlerRegistered.value) return;
    console.log(`[SttMan] Target STT pref changed: ${oldType || 'N/A'} -> ${newType}.`);
    const oldApi = (oldType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value);
    if (oldApi && activeHandlerTypeInternal.value === oldType) {
      console.log(`[SttMan] Stopping old handler (${oldType}).`);
      await oldApi.stopAll(true);
    }
    activeHandlerTypeInternal.value = null;
    const newApiCandidate = (newType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value);
    if (newApiCandidate) {
      activeHandlerTypeInternal.value = newType;
      console.log(`[SttMan] New target handler (${newType}) registered. Notifying parent and reinit.`);
      const normalizedApi: SttHandlerInstance = { /* ... normalization ... */ ...newApiCandidate }; // simplified
      events.onReady(newType, normalizedApi);
      await reinitializeActiveHandler();
    } else {
      console.log(`[SttMan] New target STT handler (${newType}) not yet registered.`);
    }
  });

  watch(currentAudioMode, async (newMode, oldMode) => {
    if (newMode === oldMode || isReinitializing.value) return;
    if (!activeHandlerApi.value) {
      console.log(`[SttMan] Audio mode changed: ${oldMode} -> ${newMode}, but no active handler.`);
      return;
    }
    console.log(`[SttMan] Audio mode changed: ${oldMode} -> ${newMode}. Reinit active handler.`);
    await reinitializeActiveHandler();
  });

  watch(currentMicPermission, async (newPerm, oldPerm) => {
    if (newPerm === oldPerm || isReinitializing.value) return;
    console.log(`[SttMan] Mic perm changed: ${oldPerm} -> ${newPerm}.`);
    if (newPerm !== 'granted') {
      if (isProcessingAudio.value || isListeningForWakeWord.value || isStartOperationInProgress.value) {
        console.log('[SttMan] Mic perm lost/denied. Stopping STT.');
        await stopAll();
      }
    } else {
      if (oldPerm !== 'granted' && (isContinuousMode.value || isVoiceActivationMode.value)) {
         console.log('[SttMan] Mic perm newly granted for auto-start mode. Reinit STT.');
         await reinitializeActiveHandler();
      } else if (shouldAutoStartListening()){
         console.log('[SttMan] Mic perm granted, STT should auto-start. Attempting start.');
         await startListening(false);
      }
    }
  });


  const cleanup = () => {
    if (llmDebounceTimer) clearTimeout(llmDebounceTimer);
    if (vadCommandResultTimeoutId) clearTimeout(vadCommandResultTimeoutId);
    console.log('[SttMan] Cleanup called.');
  };

  return {
    browserHandlerRef: readonly(browserHandlerRef),
    whisperHandlerRef: readonly(whisperHandlerRef),
    isCurrentHandlerReady,
    isProcessingAudio: readonly(isProcessingAudio),
    isListeningForWakeWord: readonly(isListeningForWakeWord),
    activeHandlerApi: readonly(activeHandlerApi),
    isAwaitingVadCommandResult: readonly(isAwaitingVadCommandResult), // Expose for debugging/UI

    registerHandler,
    unregisterHandler,
    startListening,
    stopListening,
    stopAll,
    reinitializeActiveHandler,
    handlePttClick,
    handleWakeWordDetected,
    cleanup,
  };
}