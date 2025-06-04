// File: frontend/src/components/voice-input/composables/useSttHandlerManager.ts
/**
 * @file useSttHandlerManager.ts
 * @description Composable for managing Speech-to-Text (STT) handlers (e.g., Browser Web Speech API, Whisper API).
 * It orchestrates handler registration, initialization, starting/stopping listening,
 * and state synchronization between the active STT handler and the UI.
 * This version includes refined VAD lifecycle management and more robust state transition guards.
 *
 * @module composables/useSttHandlerManager
 * @version 1.2.0 - Enhanced VAD lifecycle management, JSDoc, and state transition robustness.
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
const LLM_STATE_DEBOUNCE_MS = 500;

/**
 * Composable for managing STT handlers.
 *
 * @param {UseSttHandlerManagerOptions} options - Configuration options for the manager.
 * @param {SttHandlerEvents} events - Event callbacks to be invoked by the manager.
 * @returns An object containing methods and reactive properties to control and monitor STT operations.
 */
export function useSttHandlerManager(options: UseSttHandlerManagerOptions, events: SttHandlerEvents) {
  const { settings, toast, isProcessingLLM, currentMicPermission } = options;

  /** @type {Ref<SttHandlerInstance | null>} Reactive reference to the registered Browser Web Speech API handler. */
  const browserHandlerRef = shallowRef<SttHandlerInstance | null>(null);
  /** @type {Ref<SttHandlerInstance | null>} Reactive reference to the registered Whisper API handler. */
  const whisperHandlerRef = shallowRef<SttHandlerInstance | null>(null);

  /** @type {Ref<boolean>} True if at least one STT handler is currently registered. */
  const isAnyHandlerRegistered = ref(false);
  /** @type {Ref<'browser' | 'whisper' | null>} The type of the currently active STT handler. */
  const activeHandlerTypeInternal = ref<'browser' | 'whisper' | null>(null);
  /** @type {Ref<boolean>} True if the active handler is currently undergoing reinitialization. */
  const isReinitializing = ref(false);

  /** @type {Ref<number>} Timestamp of the last LLM state change, for debouncing reactions. */
  const lastLLMStateChangeTime = ref(0);
  /** @type {Ref<number>} Timestamp of the last handler reinitialization, for throttling. */
  const lastReinitializeTime = ref(0);
  /** @type {Ref<boolean>} True if a `startListening` operation is currently in progress, to prevent re-entrancy. */
  const isStartOperationInProgress = ref(false);
  /** @type {number | null} Timer ID for debouncing reactions to LLM state changes. */
  let llmDebounceTimer: number | null = null;


  /**
   * @computed targetHandlerType
   * @description Determines the target STT handler type ('browser' or 'whisper') based on current application settings.
   * @returns {'browser' | 'whisper'}
   */
  const targetHandlerType = computed<'browser' | 'whisper'>(() => {
    return settings.value.sttPreference === 'browser_webspeech_api' ? 'browser' : 'whisper';
  });

  /**
   * @computed activeHandlerApi
   * @description Provides reactive access to the API of the currently selected and registered STT handler.
   * Returns null if the target handler is not registered or available.
   * @returns {SttHandlerInstance | null}
   */
  const activeHandlerApi = computed<SttHandlerInstance | null>(() => {
    const currentTarget = targetHandlerType.value;
    if (currentTarget === 'browser' && browserHandlerRef.value) return browserHandlerRef.value;
    if (currentTarget === 'whisper' && whisperHandlerRef.value) return whisperHandlerRef.value;
    return null;
  });

  /**
   * @computed isCurrentHandlerReady
   * @description Reactive boolean indicating if the currently targeted STT handler is registered and ready.
   * @returns {boolean}
   */
  const isCurrentHandlerReady = computed<boolean>(() => !!activeHandlerApi.value);

  /**
   * @computed isProcessingAudio
   * @description Reactive boolean indicating if the active STT handler is currently processing audio for command/dictation.
   * Derived from the handler's `isActive` state.
   * @returns {boolean}
   */
  const isProcessingAudio = computed<boolean>(() => activeHandlerApi.value?.isActive?.value ?? false);

  /**
   * @computed isListeningForWakeWord
   * @description Reactive boolean indicating if the active STT handler is currently listening for a VAD wake word.
   * Derived from the handler's `isListeningForWakeWord` state.
   * @returns {boolean}
   */
  const isListeningForWakeWord = computed<boolean>(() => activeHandlerApi.value?.isListeningForWakeWord?.value ?? false);

  /**
   * @computed currentAudioMode
   * @description Convenience computed property for the current audio input mode from settings.
   * @returns {AudioInputMode}
   */
  const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);
  /** @type {ComputedRef<boolean>} True if in Push-to-Talk mode. */
  const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
  /** @type {ComputedRef<boolean>} True if in Continuous listening mode. */
  const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
  /** @type {ComputedRef<boolean>} True if in Voice Activation (VAD) mode. */
  const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

  /**
   * Registers an STT handler instance with the manager.
   * If the registered handler matches the current `targetHandlerType`, it becomes the active handler.
   * @param {'browser' | 'whisper'} type - The type of handler being registered.
   * @param {SttHandlerInstance} handlerApi - The API instance of the handler.
   */
  const registerHandler = (type: 'browser' | 'whisper', handlerApi: SttHandlerInstance) => {
    console.log(`[SttHandlerManager] Registering ${type} handler.`);
    if (type === 'browser') browserHandlerRef.value = handlerApi;
    else whisperHandlerRef.value = handlerApi;
    isAnyHandlerRegistered.value = true;

    if (targetHandlerType.value === type) {
      if (activeHandlerTypeInternal.value !== type || !isCurrentHandlerReady.value) { // Check if it's a new active handler
        activeHandlerTypeInternal.value = type;
        console.log(`[SttHandlerManager] ${type} handler is now the active target and registered.`);
        events.onReady(type, handlerApi); // Notify parent that the target handler is ready
      }
    }
  };

  /**
   * Unregisters an STT handler instance. Stops the handler if it was active.
   * @param {'browser' | 'whisper'} type - The type of handler to unregister.
   */
  const unregisterHandler = async (type: 'browser' | 'whisper') => {
    console.log(`[SttHandlerManager] Unregistering ${type} handler.`);
    const handlerToStop = type === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value;
    if (handlerToStop) {
      await handlerToStop.stopAll(true); // Ensure it's fully stopped and aborted
    }

    if (type === 'browser') browserHandlerRef.value = null;
    else whisperHandlerRef.value = null;

    if (activeHandlerTypeInternal.value === type) {
      activeHandlerTypeInternal.value = null; // Clear active if it was the one unregistered
    }
    isAnyHandlerRegistered.value = !!(browserHandlerRef.value || whisperHandlerRef.value);
  };

  /**
   * Determines if STT should automatically start listening based on current mode, permissions, and states.
   * Includes throttling logic to prevent rapid restarts.
   * @param {boolean} [checkDuringReinitFinalization=false] - If true, bypasses some time-based throttling, used internally during reinitialization.
   * @returns {boolean} True if conditions for auto-start are met.
   */
  const shouldAutoStartListening = (checkDuringReinitFinalization: boolean = false): boolean => {
    const now = Date.now();
    const timeSinceLLMChange = now - lastLLMStateChangeTime.value;
    const timeSinceLastReinitAttempt = now - lastReinitializeTime.value;

    if (timeSinceLLMChange < LLM_STATE_DEBOUNCE_MS && !checkDuringReinitFinalization) {
      console.log(`[SttHandlerManager] shouldAutoStart: false (LLM state changed ${timeSinceLLMChange}ms ago, waiting for debounce).`);
      return false;
    }
    if (timeSinceLastReinitAttempt < MIN_TIME_BETWEEN_REINITS_MS && !checkDuringReinitFinalization) {
      console.log(`[SttHandlerManager] shouldAutoStart: false (Last reinit attempt was ${timeSinceLastReinitAttempt}ms ago, min ${MIN_TIME_BETWEEN_REINITS_MS}ms).`);
      return false;
    }
    if (isReinitializing.value && !checkDuringReinitFinalization) {
      console.log('[SttHandlerManager] shouldAutoStart: false (reinitialization already in progress).');
      return false;
    }
    if (isStartOperationInProgress.value) {
      console.log('[SttHandlerManager] shouldAutoStart: false (start operation already in progress).');
      return false;
    }
    if (!isCurrentHandlerReady.value) {
      console.log('[SttHandlerManager] shouldAutoStart: false (No current handler ready).');
      return false;
    }
    if (isProcessingLLM.value) {
      console.log('[SttHandlerManager] shouldAutoStart: false (LLM is busy).');
      return false;
    }
    if (currentMicPermission.value !== 'granted') {
      console.log(`[SttHandlerManager] shouldAutoStart: false (Mic permission is ${currentMicPermission.value}).`);
      return false;
    }

    const autoStartMode = isContinuousMode.value || isVoiceActivationMode.value;
    const notAlreadyActive = !isProcessingAudio.value && !isListeningForWakeWord.value;

    const result = autoStartMode && notAlreadyActive;
    console.log(`[SttHandlerManager] shouldAutoStart check: Result = ${result}. Mode: ${currentAudioMode.value}, NotAlreadyActive(Manager): ${notAlreadyActive}, HandlerReady: ${isCurrentHandlerReady.value}, LLMBusy: ${isProcessingLLM.value}, MicPerm: ${currentMicPermission.value}`);
    return result;
  };

  /**
   * Commands the active STT handler to start listening.
   * @param {boolean} [forVadCommandCaptureInternal=false] - If true and in VAD mode, instructs the handler to listen for a command (post-wake-word).
   * Otherwise, behavior depends on the current audio mode (VAD wake, continuous, PTT).
   * @returns {Promise<boolean>} True if the start command was successfully issued, false otherwise.
   */
  const startListening = async (forVadCommandCaptureInternal: boolean = false): Promise<boolean> => {
    if (isReinitializing.value) {
      console.warn('[SttHandlerManager] startListening: Blocked, reinitialization in progress.');
      return false;
    }
    if (isStartOperationInProgress.value) {
      console.warn('[SttHandlerManager] startListening: Another start operation is already in progress.');
      return true; // Considered success as it's being handled
    }
    if (!activeHandlerApi.value) {
      console.warn('[SttHandlerManager] startListening: No active/ready handler to start.');
      toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech service unavailable. Please wait or check settings.'});
      return false;
    }

    // Block general STT if LLM is busy, but allow VAD wake listening.
    // VAD command capture is also allowed as it's an explicit user continuation.
    if (isProcessingLLM.value && !(isVoiceActivationMode.value)) {
        console.log('[SttHandlerManager] startListening blocked: LLM processing and not in VAD mode or starting VAD command capture.');
        return false;
    }
    
    // Check if already in the exact state we want to achieve
    if (forVadCommandCaptureInternal) { // Starting MAIN for command capture after VAD
        if (isProcessingAudio.value && !isListeningForWakeWord.value) { // Already in command capture
            console.log('[SttHandlerManager] startListening(true for VAD command): Already in command capture state.');
            return true;
        }
    } else if (isVoiceActivationMode.value) { // Starting VAD_WAKE listening
        if (isListeningForWakeWord.value) {
            console.log('[SttHandlerManager] startListening(false for VAD wake): Already listening for wake word.');
            return true;
        }
    } else { // Starting MAIN for PTT or Continuous
        if (isProcessingAudio.value) {
            console.log(`[SttHandlerManager] startListening(false for ${currentAudioMode.value}): STT already active.`);
            return true;
        }
    }

    console.log(`[SttHandlerManager] Requesting handler '${activeHandlerTypeInternal.value}' to start. forVadCommandCapture: ${forVadCommandCaptureInternal}`);
    isStartOperationInProgress.value = true;
    let success = false;
    try {
      // The handler's startListening method will interpret forVadCommandCapture based on its own logic and current mode.
      const result = await activeHandlerApi.value.startListening(forVadCommandCaptureInternal);
      success = typeof result === 'boolean' ? result : true; // Assume true if void and no error
    } catch (error) {
      console.error('[SttHandlerManager] Error calling startListening on active handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue start command to handler.', code: 'START_CMD_FAIL'});
      success = false;
    } finally {
      isStartOperationInProgress.value = false;
    }
    return success;
  };

  /**
   * Commands the active STT handler to stop listening.
   * @param {boolean} [abort=false] - If true, attempts to abort recognition immediately.
   */
  const stopListening = async (abort: boolean = false): Promise<void> => {
    if (!activeHandlerApi.value || isStartOperationInProgress.value || isReinitializing.value) {
        console.warn(`[SttHandlerManager] stopListening: No active handler, or operation in progress. OpInProg: ${isStartOperationInProgress.value}, Reinit: ${isReinitializing.value}`);
        return;
    }
    console.log(`[SttHandlerManager] Requesting handler '${activeHandlerTypeInternal.value}' to stop. Abort: ${abort}`);
    try {
      await activeHandlerApi.value.stopListening(abort);
    } catch (error) {
      console.error('[SttHandlerManager] Error calling stopListening on handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue stop command to handler.', code: 'STOP_CMD_FAIL'});
    }
  };

  /** Commands the active STT handler to stop all activities forcefully. */
  const stopAll = async (): Promise<void> => {
    if (!activeHandlerApi.value || isStartOperationInProgress.value || isReinitializing.value) {
        console.warn(`[SttHandlerManager] stopAll: No active handler, or operation in progress. OpInProg: ${isStartOperationInProgress.value}, Reinit: ${isReinitializing.value}`);
        return;
    }
    console.log(`[SttHandlerManager] Requesting handler '${activeHandlerTypeInternal.value}' to stopAll.`);
    try {
      await activeHandlerApi.value.stopAll(true); // Always abort on stopAll from manager
    } catch (error) {
      console.error('[SttHandlerManager] Error calling stopAll on handler:', error);
      events.onError({ type: 'handler_command', message: 'Failed to issue stopAll command to handler.', code: 'STOPALL_CMD_FAIL'});
    }
  };

  /**
   * Reinitializes the currently active STT handler.
   * This is a critical operation that stops the handler, allows it to reset, and then potentially auto-starts it.
   * Includes throttling to prevent rapid reinitialization.
   */
  const reinitializeActiveHandler = async (): Promise<void> => {
    const now = Date.now();
    const timeSinceLastReinitAttempt = now - lastReinitializeTime.value;

    if (timeSinceLastReinitAttempt < MIN_TIME_BETWEEN_REINITS_MS) {
      console.warn(`[SttHandlerManager] Reinitialize blocked: only ${timeSinceLastReinitAttempt}ms since last reinit (min: ${MIN_TIME_BETWEEN_REINITS_MS}ms).`);
      return;
    }
    if (isReinitializing.value) {
      console.warn('[SttHandlerManager] Reinitialization already in progress. Skipping subsequent request.');
      return;
    }

    const handlerType = activeHandlerTypeInternal.value;
    if (!activeHandlerApi.value || !handlerType) {
      console.warn('[SttHandlerManager] reinitializeActiveHandler: No active handler to reinitialize.');
      return;
    }

    isReinitializing.value = true;
    lastReinitializeTime.value = now; // Record time of this attempt
    console.log(`[SttHandlerManager] BEGIN Reinitialization for handler (${handlerType}).`);

    try {
      await activeHandlerApi.value.reinitialize();
      console.log(`[SttHandlerManager] Handler (${handlerType})'s reinitialize() method completed.`);
      // Give a brief moment for the handler to fully settle its internal state after reinit.
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 150)); // Short delay for stability
    } catch (error) {
      console.error(`[SttHandlerManager] Error during reinitialize command to handler (${handlerType}):`, error);
      events.onError({ type: 'handler_command', message: `Failed to reinitialize STT handler ${handlerType}.`, code: 'REINIT_CMD_FAIL'});
    } finally {
      isReinitializing.value = false; // Clear flag regardless of outcome
      console.log(`[SttHandlerManager] isReinitializing flag set to false for handler (${handlerType}).`);
    }

    // After reinitialization, check if STT should auto-start.
    // Use a small delay to ensure all states are propagated.
    await new Promise(resolve => setTimeout(resolve, 250));
    if (shouldAutoStartListening(true)) { // true to bypass some time-based throttling for this specific check
      console.log(`[SttHandlerManager] Conditions met for auto-start for (${handlerType}) AFTER reinitialize logic. Attempting start.`);
      await startListening(false); // Start non-VAD-command listening
    } else {
      console.log(`[SttHandlerManager] Not auto-starting after reinitialize for handler (${handlerType}).`);
    }
    console.log(`[SttHandlerManager] END Reinitialization sequence for handler (${handlerType}).`);
  };

  /** Handles a click on the PTT button, toggling listening state. */
  const handlePttClick = async () => {
    if (!isPttMode.value || !activeHandlerApi.value) {
      console.warn('[SttHandlerManager] PTT click: Invalid conditions (not PTT mode or no active handler).');
      return;
    }
    const isActiveNow = isProcessingAudio.value; // Check current state from manager's perspective
    console.log(`[SttHandlerManager] PTT button clicked. Manager sees STT active (isProcessingAudio): ${isActiveNow}`);
    if (isActiveNow) {
      await stopListening(false); // Graceful stop for PTT
    } else {
      if (currentMicPermission.value !== 'granted') {
        toast?.add({type: 'warning', title: 'Microphone Access Required', message: 'Please grant microphone permission to record.'});
        return;
      }
      await startListening(false); // Start PTT recording
    }
  };

  /**
   * Handles the wake word detected event from the STT handler.
   * Instructs the handler to transition to command capture mode.
   */
  const handleWakeWordDetected = async () => {
    if (!isVoiceActivationMode.value || !activeHandlerApi.value) {
      console.warn('[SttHandlerManager] Wake word detected event received, but not in VAD mode or no active handler.');
      return;
    }
    console.log('[SttHandlerManager] Wake word detected! Attempting to switch to command capture mode.');
    // The handler itself should have stopped VAD wake listening.
    // Now, command the handler to start listening for the command.
    await startListening(true); // true for forVadCommandCapture
  };


  // --- Watchers for settings and state changes ---

  watch(targetHandlerType, async (newType, oldType) => {
    if (newType === oldType || !isAnyHandlerRegistered.value) return;
    console.log(`[SttHandlerManager] Target STT preference changed: ${oldType || 'N/A'} -> ${newType}.`);

    const oldApi = (oldType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value);
    if (oldApi && activeHandlerTypeInternal.value === oldType) {
      console.log(`[SttHandlerManager] Stopping old handler (${oldType}) due to preference change.`);
      await oldApi.stopAll(true); // Force stop and abort
    }
    activeHandlerTypeInternal.value = null; // Temporarily no active handler

    const newApiCandidate = (newType === 'browser' ? browserHandlerRef.value : whisperHandlerRef.value);
    if (newApiCandidate) {
      activeHandlerTypeInternal.value = newType;
      console.log(`[SttHandlerManager] New target handler (${newType}) is registered. Notifying parent and reinitializing.`);
      // Ensure the API passed to onReady has consistently defined reactive properties
       const normalizedApi: SttHandlerInstance = {
            ...newApiCandidate,
            isActive: (newApiCandidate.isActive && typeof (newApiCandidate.isActive as any).value === 'boolean') ? newApiCandidate.isActive : readonly(ref(Boolean((newApiCandidate as any).isActive))),
            isListeningForWakeWord: (newApiCandidate.isListeningForWakeWord && typeof (newApiCandidate.isListeningForWakeWord as any).value === 'boolean') ? newApiCandidate.isListeningForWakeWord : readonly(ref(Boolean((newApiCandidate as any).isListeningForWakeWord))),
        };
      events.onReady(newType, normalizedApi);
      await reinitializeActiveHandler(); // Reinitialize to apply new preference
    } else {
      console.log(`[SttHandlerManager] New target STT handler (${newType}) is not yet registered. Waiting for its registration.`);
    }
  });

  watch(currentAudioMode, async (newMode, oldMode) => {
    if (newMode === oldMode || isReinitializing.value) return;
    if (!activeHandlerApi.value) {
      console.log(`[SttHandlerManager] Audio mode changed: ${oldMode} -> ${newMode}, but no active handler. Will apply on next handler ready/reinit.`);
      return;
    }
    console.log(`[SttHandlerManager] Audio mode changed: ${oldMode} -> ${newMode}. Reinitializing active handler.`);
    await reinitializeActiveHandler(); // Mode change often requires full handler reset
  });

  watch(isProcessingLLM, async (isLLMNowProcessing, wasLLMProcessing) => {
    lastLLMStateChangeTime.value = Date.now(); // Record time of change for debouncing

    if (llmDebounceTimer) { // Clear any existing debounce timer
      clearTimeout(llmDebounceTimer);
      llmDebounceTimer = null;
    }
    if (isReinitializing.value) {
      console.log(`[SttHandlerManager] isProcessingLLM changed, but reinitialization is already in progress. LLM: ${isLLMNowProcessing}`);
      return;
    }
    console.log(`[SttHandlerManager] LLM processing state changed: ${wasLLMProcessing} -> ${isLLMNowProcessing}.`);

    if (isLLMNowProcessing) {
      // If LLM starts processing, stop STT unless it's VAD wake listening.
      if (!isListeningForWakeWord.value && (isProcessingAudio.value || isStartOperationInProgress.value)) {
        console.log('[SttHandlerManager] LLM started processing. Stopping all non-VAD-wake STT activity.');
        await stopAll();
      } else if (isListeningForWakeWord.value) {
          console.log('[SttHandlerManager] LLM started processing, VAD wake listening continues if active.');
      }
    } else { // LLM finished processing
      llmDebounceTimer = window.setTimeout(async () => {
        if (!isProcessingLLM.value && shouldAutoStartListening()) { // Double check LLM state and auto-start conditions
          console.log('[SttHandlerManager] LLM finished processing. Debounced check passed. Reinitializing for a clean STT start.');
          await reinitializeActiveHandler();
        } else {
          console.log('[SttHandlerManager] LLM finished processing. Conditions not met for auto-starting STT after debounce.');
        }
        llmDebounceTimer = null;
      }, LLM_STATE_DEBOUNCE_MS);
    }
  });

  watch(currentMicPermission, async (newPerm, oldPerm) => {
    if (newPerm === oldPerm || isReinitializing.value) return;
    console.log(`[SttHandlerManager] Mic permission changed: ${oldPerm} -> ${newPerm}.`);

    if (newPerm !== 'granted') { // Permission lost or denied
      if (isProcessingAudio.value || isListeningForWakeWord.value || isStartOperationInProgress.value) {
        console.log('[SttHandlerManager] Mic permission lost/denied. Stopping all STT activity.');
        await stopAll();
      }
    } else { // Permission newly granted or confirmed
      // If permission was previously not 'granted', and an auto-start mode is active, reinitialize.
      if (oldPerm !== 'granted' && (isContinuousMode.value || isVoiceActivationMode.value)) {
         console.log('[SttHandlerManager] Mic permission newly granted for auto-start mode. Reinitializing STT.');
         await reinitializeActiveHandler();
      } else if (shouldAutoStartListening()){ // Or if already granted and conditions now met
         console.log('[SttHandlerManager] Mic permission is granted and STT should auto-start. Attempting start.');
         await startListening(false);
      }
    }
  });

  // Cleanup function for component unmount
  const cleanup = () => {
    if (llmDebounceTimer) {
      clearTimeout(llmDebounceTimer);
      llmDebounceTimer = null;
    }
    // Potentially unregister handlers if manager is being destroyed
    // unregisterHandler('browser');
    // unregisterHandler('whisper');
    console.log('[SttHandlerManager] Cleanup called.');
  };

  // Forwarding events from handler to parent (VoiceInput.vue) via the events object
  // These are now directly observed via the handler's reactive properties and direct event emissions
  // from the handler to VoiceInput.vue, then VoiceInput.vue calls manager methods.
  // This manager primarily *commands* the handler and observes its top-level state for orchestration.
  // However, direct state changes from handler should be reflected in manager's computed props.
  // The parent component (VoiceInput) will subscribe to the STT Handler *Manager* events,
  // and the manager will synthesize or forward these.

  // Watch the reactive state from the active handler to emit consolidated events IF NEEDED.
  // For now, VoiceInput.vue subscribes to handler events directly through the manager's `events` object
  // that is passed into this composable. This is a bit circular, but it's how the current `SttHandlerEvents`
  // interface is designed to be used by the parent (VoiceInput) passing its own methods as callbacks.
  // This manager uses these callbacks to inform the parent.

  // Example of watching internal computed states and emitting events if necessary:
  // watch(isProcessingAudio, (newVal) => { if(!isReinitializing.value) events.onProcessingAudio(newVal); });
  // watch(isListeningForWakeWord, (newVal) => { if(!isReinitializing.value) events.onListeningForWakeWord(newVal); });
  // These are implicitly handled because VoiceInput.vue's event handlers (passed in `events`)
  // are called by the STT Handler's emits, and VoiceInput.vue then updates its own state
  // and emits its own `processing-audio` events.

  return {
    browserHandlerRef: readonly(browserHandlerRef), // For inspection if needed
    whisperHandlerRef: readonly(whisperHandlerRef), // For inspection if needed
    isCurrentHandlerReady,
    isProcessingAudio: readonly(isProcessingAudio),
    isListeningForWakeWord: readonly(isListeningForWakeWord),
    activeHandlerApi: readonly(activeHandlerApi), // Expose for direct calls if absolutely necessary (rare)

    registerHandler,
    unregisterHandler,
    startListening,
    stopListening,
    stopAll,
    reinitializeActiveHandler,
    handlePttClick,
    handleWakeWordDetected, // Expose this for VoiceInput to call when handler emits wake word

    cleanup, // Export cleanup for component unmount
  };
}