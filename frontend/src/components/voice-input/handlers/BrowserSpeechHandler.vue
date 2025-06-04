<template>
  <!-- Minimal template to satisfy Vue compiler for setup-only component -->
</template>

<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Vue 3 Composition API component for handling browser-based SpeechRecognition (Web Speech API).
 * It manages two recognizer instances: one for continuous wake-word detection (VAD) and another for
 * main speech capture (commands, dictation, continuous listening). It handles complex state transitions,
 * error recovery, and exposes a consistent API for an STT (Speech-To-Text) handler manager.
 *
 * This component aims for robustness by managing mic permissions, LLM processing states,
 * and various audio input modes (Push-to-Talk, Continuous, Voice Activation).
 *
 * @component BrowserSpeechHandler
 * @version 4.3.5 - Added minimal template to satisfy Vue compiler for setup-only component. Internal logic from v4.3.4.
 */

import { ref, computed, onMounted, onBeforeUnmount, watch, inject, nextTick, readonly } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import type { SttHandlerInstance } from '../composables/useSttHandlerManager';

// --- Ambient Type Declarations for Web Speech API ---
// These interfaces define the shape of the Web Speech API objects if they are not globally available in the TS environment.

/**
 * @interface CustomSpeechRecognitionEventMap
 * @description Extends EventListenerObject to map Web Speech API event names to their specific event types.
 */
interface CustomSpeechRecognitionEventMap extends EventListenerObject {
  audiostart: Event;
  audioend: Event;
  end: Event;
  error: CustomSpeechRecognitionErrorEvent;
  nomatch: CustomSpeechRecognitionEvent;
  result: CustomSpeechRecognitionEvent;
  soundstart: Event;
  soundend: Event;
  speechstart: Event;
  speechend: Event;
  start: Event;
}

interface CustomSpeechRecognition extends EventTarget {
  grammars: CustomSpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onend: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEvent) => any) | null;
  onresult: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null;
  addEventListener<K extends keyof CustomSpeechRecognitionEventMap>(
    type: K,
    listener: (this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof CustomSpeechRecognitionEventMap>(
    type: K,
    listener: (this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface CustomSpeechRecognitionStatic {
  prototype: CustomSpeechRecognition;
  new (): CustomSpeechRecognition;
}

const WindowSpeechRecognition: CustomSpeechRecognitionStatic | undefined =
  typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

interface CustomSpeechGrammar {
  src: string;
  weight?: number;
}

interface CustomSpeechGrammarList {
  readonly length: number;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  item(index: number): CustomSpeechGrammar;
  [index: number]: CustomSpeechGrammar;
}

interface CustomSpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface CustomSpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): CustomSpeechRecognitionAlternative;
  [index: number]: CustomSpeechRecognitionAlternative;
}

interface CustomSpeechRecognitionResultList {
  readonly length: number;
  item(index: number): CustomSpeechRecognitionResult;
  [index: number]: CustomSpeechRecognitionResult;
}

interface CustomSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: CustomSpeechRecognitionResultList;
  readonly emma: Document | null;
  readonly interpretation: any;
}

type CustomSpeechRecognitionErrorCode = "no-speech" | "aborted" | "audio-capture" | "network" | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";

interface CustomSpeechRecognitionErrorEvent extends Event {
  readonly error: CustomSpeechRecognitionErrorCode;
  readonly message: string;
}

// --- END: Ambient Type Declarations ---

const props = defineProps<{
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean;
  currentMicPermission: 'prompt' | 'granted' | 'denied' | 'error' | '';
}>();

const emit = defineEmits<{
  (e: 'handler-api-ready', api: SttHandlerInstance): void;
  (e: 'unmounted'): void;
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: { type: string; message: string; code?: string }): void;
  (e: 'wake-word-detected'): void;
}>();

const toast = inject<ToastService>('toast');
const SpeechRecognitionAPIConstructor = ref<CustomSpeechRecognitionStatic | null>(null);

/**
 * @typedef {string} RecognitionState
 * @description Represents the current state of the speech recognition handler.
 * - IDLE: No recognition is active
 * - STARTING_MAIN: Main recognizer is starting
 * - MAIN_ACTIVE: Main recognizer is actively listening
 * - STARTING_VAD_WAKE: VAD wake word recognizer is starting
 * - VAD_WAKE_LISTENING: VAD is actively listening for wake words
 * - TRANSITIONING_VAD_TO_MAIN: Transitioning from VAD to main after wake word detection
 * - STOPPING: Recognition is being stopped
 */
type RecognitionState =
  | 'IDLE'
  | 'STARTING_MAIN'
  | 'MAIN_ACTIVE'
  | 'STARTING_VAD_WAKE'
  | 'VAD_WAKE_LISTENING'
  | 'TRANSITIONING_VAD_TO_MAIN'
  | 'STOPPING';

const state = ref<RecognitionState>('IDLE');
const mainRecognizer = ref<CustomSpeechRecognition | null>(null);
const vadRecognizer = ref<CustomSpeechRecognition | null>(null);
const isVadStoppingForTransitionIntent = ref(false); // Flag for intentional VAD abort
const activeStopReason = ref<string | null>(null);

const isActive = ref(false);
const isListeningForWakeWord = ref(false);

const pendingContinuousTranscript = ref('');
const hasPendingTranscript = computed<boolean>(() => !!pendingContinuousTranscript.value.trim());

let recognizerStartTime = 0;
let lastTranscriptionEmitTime = 0;
let continuousTranscriptBuffer = '';
let finalTranscriptPTT = '';
let vadCommandSilenceTimer: number | null = null;
let restartDebounceTimer: number | null = null;
let continuousEmitDebounceTimer: number | null = null;

const RESTART_DEBOUNCE_MS = 2000;
const WARM_UP_PERIOD_MS = 300;
const MIN_TRANSCRIPT_LENGTH_FOR_EMIT = 1;
const CONTINUOUS_EMIT_DEBOUNCE_MS = 250;
const VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT = 3000;

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');

/**
 * Detaches all event handlers from a speech recognition instance.
 * @param {CustomSpeechRecognition | null} recognizer - The recognizer instance to detach handlers from
 */
function detachEventHandlers(recognizer: CustomSpeechRecognition | null): void {
  if (recognizer) {
    recognizer.onstart = null;
    recognizer.onresult = null;
    recognizer.onerror = null;
    recognizer.onend = null;
    recognizer.onaudiostart = null;
    recognizer.onaudioend = null;
    recognizer.onsoundstart = null;
    recognizer.onsoundend = null;
    recognizer.onspeechstart = null;
    recognizer.onspeechend = null;
    recognizer.onnomatch = null;
  }
}

/**
 * Creates a new SpeechRecognition instance with appropriate configuration.
 * @param {boolean} [forWakeWord=false] - If true, configures for wake word detection (continuous, no interim results)
 * @returns {CustomSpeechRecognition | null} The created recognizer instance, or null if creation failed
 */
function createRecognizer(forWakeWord: boolean = false): CustomSpeechRecognition | null {
  if (!SpeechRecognitionAPIConstructor.value) {
    console.error('[BSH] SpeechRecognition API constructor not available.');
    emit('error', { type: 'init', message: 'Web Speech API not supported.' });
    return null;
  }

  try {
    const recognizer = new SpeechRecognitionAPIConstructor.value();
    recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
    
    if (forWakeWord) {
      recognizer.continuous = true;
      recognizer.interimResults = false;
    } else {
      recognizer.continuous = isContinuousMode.value;
      recognizer.interimResults = true;
    }
    
    recognizer.maxAlternatives = 1;
    console.log(`[BSH] Created recognizer (forWakeWord: ${forWakeWord}). Lang: ${recognizer.lang}, Continuous: ${recognizer.continuous}, Interim: ${recognizer.interimResults}`);
    return recognizer;
  } catch (e: any) {
    console.error("[BSH] Error constructing SpeechRecognition instance:", e.name, e.message);
    emit('error', { type: 'init', message: `Failed to create SpeechRecognition: ${e.message}` });
    return null;
  }
}

/**
 * Updates reactive states (isActive, isListeningForWakeWord) based on the current recognition state.
 * Emits appropriate events when these states change.
 * @param {RecognitionState} newInternalState - The new internal state of the handler
 * @private
 */
function _updateReactiveStates(newInternalState: RecognitionState) {
  const newIsActive = newInternalState === 'MAIN_ACTIVE';
  const newIsListeningForWakeWord = newInternalState === 'VAD_WAKE_LISTENING';

  if (isActive.value !== newIsActive) {
    isActive.value = newIsActive;
    console.log(`[BSH] Emitting processing-audio: ${isActive.value} (Internal State: ${newInternalState})`);
    emit('processing-audio', isActive.value);
  }
  
  if (isListeningForWakeWord.value !== newIsListeningForWakeWord) {
    isListeningForWakeWord.value = newIsListeningForWakeWord;
    console.log(`[BSH] Emitting is-listening-for-wake-word: ${isListeningForWakeWord.value} (Internal State: ${newInternalState})`);
    emit('is-listening-for-wake-word', isListeningForWakeWord.value);
  }
}

/**
 * Checks if a given transcript string is valid for emission (non-empty, not just noise/punctuation).
 * @param {string} transcript - The transcript to validate
 * @returns {boolean} True if the transcript is considered valid, false otherwise
 */
function isValidTranscript(transcript: string): boolean {
  if (!transcript || transcript.trim().length < MIN_TRANSCRIPT_LENGTH_FOR_EMIT) return false;
  
  const cleaned = transcript.trim().toLowerCase();
  
  // Filter out common spurious results, especially if they are short and only consist of these
  const spuriousPatterns = ['[', ']', '(', ')', 'hmm', 'uh', 'um', '.', ',', '?', '!'];
  if (spuriousPatterns.some(pattern => cleaned === pattern && cleaned.length <= 3)) return false;
  
  // Check if it's just punctuation or symbols
  if (/^[^\w\s]+$/.test(cleaned)) return false;
  
  return true;
}

/**
 * Emits a continuous mode transcript after a debounce period.
 * This aggregates final segments and prevents flooding the parent with rapid updates.
 * @param {string} transcript - The transcript segment to potentially emit
 */
function debouncedEmitContinuousTranscript(transcript: string) {
  if (!transcript.trim()) return; // Don't bother if the buffer to emit is empty

  if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer);

  continuousEmitDebounceTimer = window.setTimeout(() => {
    if (isValidTranscript(transcript)) { // Use the accumulated buffer
      const now = Date.now();
      // Prevent emissions too close together, even after debounce, for stability
      if (now - lastTranscriptionEmitTime > 500) {
        console.log(`[BSH] Emitting continuous transcript: "${transcript}"`);
        emit('transcription', transcript.trim());
        lastTranscriptionEmitTime = now;
        continuousTranscriptBuffer = ''; // Reset buffer after successful emit
      } else {
        console.warn(`[BSH] Continuous emit skipped (rate limit). Buffered: "${transcript}"`);
        // If skipped, the transcript remains in continuousTranscriptBuffer and will be added to the next segment
      }
    }
    continuousEmitDebounceTimer = null;
  }, CONTINUOUS_EMIT_DEBOUNCE_MS);
}

/**
 * Initializes the main SpeechRecognition instance for command/dictation capture.
 * Sets up its event handlers (onstart, onresult, onerror, onend).
 * @returns {boolean} True if initialization was successful, false otherwise
 * @private
 */
function initMainRecognizer(): boolean {
  if (mainRecognizer.value) { // Clean up existing instance
    detachEventHandlers(mainRecognizer.value);
    try {
      mainRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting prev mainRec during init:', e);
    }
    mainRecognizer.value = null;
  }

  const recognizer = createRecognizer(false); // forWakeWord = false
  if (!recognizer) {
    state.value = 'IDLE';
    _updateReactiveStates(state.value);
    return false;
  }

  recognizer.onstart = () => {
    // Ensure this event is for the current recognizer and we're in an expected starting state
    if (mainRecognizer.value !== recognizer || (state.value !== 'STARTING_MAIN' && state.value !== 'TRANSITIONING_VAD_TO_MAIN')) {
      console.warn(`[BSH] Main onstart: Mismatch/unexpected state. State: ${state.value}`);
      return;
    }
    
    console.log('[BSH] Main recognizer started.');
    state.value = 'MAIN_ACTIVE';
    _updateReactiveStates(state.value);
    
    pendingContinuousTranscript.value = ''; // Reset pending UI transcript
    continuousTranscriptBuffer = ''; // Reset continuous mode buffer
    recognizerStartTime = Date.now();
    
    if (isPttMode.value) finalTranscriptPTT = ''; // Reset PTT buffer
  };

  recognizer.onresult = (event: CustomSpeechRecognitionEvent) => {
    if (mainRecognizer.value !== recognizer || state.value !== 'MAIN_ACTIVE') return; // Ensure correct state and instance

    const timeSinceStart = Date.now() - recognizerStartTime;
    
    // For VAD command capture, allow final results even during warm-up for quicker response
    // For other modes, strictly enforce warm-up for interim results
    if (timeSinceStart < WARM_UP_PERIOD_MS && !(isVoiceActivationMode.value && event.results[event.results.length-1].isFinal) && !event.results[event.results.length-1].isFinal) {
      console.log(`[BSH] Main onresult: Ignoring interim during warm-up.`);
      return;
    }

    // If LLM is busy, generally ignore transcripts. Exception: VAD command capture should still proceed
    if (props.parentIsProcessingLLM && !(isVoiceActivationMode.value && state.value === 'MAIN_ACTIVE')) {
      console.log('[BSH] Main onresult: LLM busy, ignoring for non-VAD-command.');
      _stopListeningInternal(true, 'main', 'llm_busy_main_non_vad'); // Abort main recognizer
      return;
    }

    let currentInterim = '';
    let currentFinal = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        currentFinal += event.results[i][0].transcript;
      } else {
        currentInterim += event.results[i][0].transcript;
      }
    }

    if (isContinuousMode.value) {
      // Handle continuous mode transcription
      if (currentInterim.trim()) {
        pendingContinuousTranscript.value = currentInterim; // For UI feedback
      }
      if (currentFinal.trim()) {
        const seg = currentFinal.trim();
        continuousTranscriptBuffer += (continuousTranscriptBuffer ? ' ' : '') + seg;
        debouncedEmitContinuousTranscript(continuousTranscriptBuffer); // Use the buffer for debounced emit
        // Clean up pending UI transcript if the final segment covers it
        pendingContinuousTranscript.value = pendingContinuousTranscript.value.replace(seg, '').trim() || '';
      }
    } else if (currentFinal.trim()) {
      // Handle PTT or VAD Command Mode
      const final = currentFinal.trim();
      if (isPttMode.value) {
        finalTranscriptPTT += (finalTranscriptPTT ? ' ' : '') + final;
        pendingContinuousTranscript.value = finalTranscriptPTT; // Update UI feedback for PTT
      } else if (isVoiceActivationMode.value && isValidTranscript(final)) {
        console.log(`[BSH] VAD Command captured: "${final}"`);
        emit('transcription', final);
        // Stop main recognizer; its onend will handle restarting VAD wake listening
        _stopListeningInternal(false, 'main', 'vad_command_captured_final'); // Graceful stop
      }
    } else if (currentInterim.trim() && (isPttMode.value || (isVoiceActivationMode.value && state.value === 'MAIN_ACTIVE'))) {
      // Update pending UI transcript for PTT or VAD command capture with interim results
      pendingContinuousTranscript.value = (isPttMode.value ? finalTranscriptPTT : '') + ((isPttMode.value && finalTranscriptPTT) ? ' ' : '') + currentInterim;
    }
  };

  recognizer.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
    if (mainRecognizer.value !== recognizer && mainRecognizer.value !== null) return;
    console.error('[BSH] Main error:', event.error, event.message);
    handleError(event.error, 'main', event.message);
  };

  recognizer.onend = () => {
    console.log(`[BSH] Main onend. State: ${state.value}, StopReason: ${activeStopReason.value}`);
    
    const wasThisInstance = mainRecognizer.value === recognizer;
    const prevState = state.value;
    const reason = activeStopReason.value;
    activeStopReason.value = null;
    
    if (!wasThisInstance && mainRecognizer.value !== null) {
      console.log('[BSH] Main onend: Stale.');
      return;
    }
    
    if (wasThisInstance) {
      detachEventHandlers(recognizer);
      mainRecognizer.value = null;
    }
    
    // Update reactive states if we were active
    if (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN') {
      if (isActive.value) {
        isActive.value = false;
        console.log(`[BSH] Main onend: Emitting processing-audio: false.`);
        emit('processing-audio', false);
      }
    }
    
    // Transition to IDLE if not already part of an explicit stop or VAD transition
    if (state.value !== 'STARTING_VAD_WAKE' && state.value !== 'VAD_WAKE_LISTENING' && state.value !== 'STOPPING' && state.value !== 'TRANSITIONING_VAD_TO_MAIN') {
      if (state.value !== 'IDLE') {
        state.value = 'IDLE';
      }
    }
    
    // Handle final transcript emissions for PTT
    if (isPttMode.value && finalTranscriptPTT.trim() && isValidTranscript(finalTranscriptPTT)) {
      emit('transcription', finalTranscriptPTT.trim());
    }
    
    // Clear any pending debounced emit
    if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer);
    
    // Emit any remaining buffer for continuous mode
    if (isContinuousMode.value && continuousTranscriptBuffer.trim() && isValidTranscript(continuousTranscriptBuffer) && 
        reason !== 'api_stop_all_command' && reason !== 'api_reinitialize_command' && !reason?.startsWith('error_handling_')) {
      emit('transcription', continuousTranscriptBuffer.trim());
    }
    
    // Reset all transcript buffers
    finalTranscriptPTT = '';
    pendingContinuousTranscript.value = '';
    continuousTranscriptBuffer = '';
    
    // Auto-restart logic based on mode and conditions
    if (reason === null && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value && (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN')) {
        scheduleRestart('main_continuous_natural_end');
      } else if (isVoiceActivationMode.value && (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN' || prevState === 'TRANSITIONING_VAD_TO_MAIN')) {
        scheduleRestart('vad_wake_after_command_main_ended');
      }
    } else {
      console.log(`[BSH] Main onend: No auto-restart. Reason: ${reason}, State: ${state.value}`);
    }
    
    _updateReactiveStates(state.value);
  };

  mainRecognizer.value = recognizer; // Assign the newly created and configured recognizer
  return true;
}

/**
 * Initializes the VAD (wake word) SpeechRecognition instance.
 * Sets up its event handlers (onstart, onresult, onerror, onend).
 * @returns {boolean} True if initialization was successful, false otherwise
 * @private
 */
function initVadRecognizer(): boolean {
  if (vadRecognizer.value) {
    detachEventHandlers(vadRecognizer.value);
    try {
      vadRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting previous vadRecognizer during init:', e);
    }
    vadRecognizer.value = null;
  }

  const recognizer = createRecognizer(true); // forWakeWord = true
  if (!recognizer) {
    state.value = 'IDLE';
    _updateReactiveStates(state.value);
    return false;
  }

  recognizer.onstart = () => {
    if (vadRecognizer.value !== recognizer || state.value !== 'STARTING_VAD_WAKE') {
      console.warn(`[BSH] VAD onstart: Mismatch/unexpected. State: ${state.value}`);
      return;
    }
    
    console.log('[BSH] VAD recognizer started.');
    state.value = 'VAD_WAKE_LISTENING';
    _updateReactiveStates(state.value);
    recognizerStartTime = Date.now();
  };

  recognizer.onresult = (event: CustomSpeechRecognitionEvent) => {
    if (vadRecognizer.value !== recognizer || state.value !== 'VAD_WAKE_LISTENING') return;

    const timeSinceStart = Date.now() - recognizerStartTime;
    if (timeSinceStart < WARM_UP_PERIOD_MS) {
      console.log(`[BSH] VAD onresult: Ignoring result during warm-up (${timeSinceStart}ms)`);
      return;
    }

    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    
    const wakeWords = props.settings.vadWakeWordsBrowserSTT?.map(w => w.toLowerCase().trim()) || [];
    if (wakeWords.length > 0 && wakeWords.some(word => transcript.toLowerCase().includes(word))) {
      console.log(`[BSH] Wake word detected: "${transcript}"`);
      
      isVadStoppingForTransitionIntent.value = true; // Set flag BEFORE aborting
      state.value = 'TRANSITIONING_VAD_TO_MAIN';
      
      if (isListeningForWakeWord.value) {
        isListeningForWakeWord.value = false;
        console.log(`[BSH] VAD onresult(wake): Emitting is-listening-for-wake-word: false`);
        emit('is-listening-for-wake-word', false);
      }
      
      emit('wake-word-detected');
      _stopListeningInternal(true, 'vad', 'wake_word_detected_transition');
    }
  };

  recognizer.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
    if (vadRecognizer.value !== recognizer && vadRecognizer.value !== null) {
      console.warn('[BSH] VAD onerror: Stale event.');
      return;
    }
    
    const wasIntentional = event.error === 'aborted' && isVadStoppingForTransitionIntent.value;
    
    // Always reset the flag after checking it for this error instance
    if (vadRecognizer.value === recognizer) {
      isVadStoppingForTransitionIntent.value = false;
    }

    console.error(`[BSH] VAD error: ${event.error}, Intentional: ${wasIntentional}, State: ${state.value}`);

    if (wasIntentional) {
      console.log('[BSH] VAD aborted as expected for transition.');
      // If this was the active vadRecognizer, ensure it's cleaned up
      if (vadRecognizer.value === recognizer) {
        detachEventHandlers(recognizer);
        vadRecognizer.value = null;
      }
      return;
    }
    
    // For other errors, proceed to generic error handling
    handleError(event.error, 'vad', event.message);
  };

  recognizer.onend = () => {
    console.log(`[BSH] VAD onend. State: ${state.value}, StopReason: ${activeStopReason.value}, IntentionalTransitionFlag: ${isVadStoppingForTransitionIntent.value}`);
    
    const wasIntentionalTrans = isVadStoppingForTransitionIntent.value;
    
    // Reset the flag only if this onend corresponds to the recognizer that might have set it
    if (vadRecognizer.value === recognizer || !vadRecognizer.value) {
      isVadStoppingForTransitionIntent.value = false;
    }

    const wasThisInstance = vadRecognizer.value === recognizer;
    const prevState = state.value;
    const reason = activeStopReason.value;
    activeStopReason.value = null;
    
    if (!wasThisInstance && vadRecognizer.value !== null) {
      console.log('[BSH] VAD onend: Stale event.');
      return;
    }
    
    if (wasThisInstance) {
      detachEventHandlers(recognizer);
      vadRecognizer.value = null;
    }

    if (isListeningForWakeWord.value) {
      isListeningForWakeWord.value = false;
      console.log(`[BSH] VAD onend: Emitting is-listening-for-wake-word: false.`);
      emit('is-listening-for-wake-word', false);
    }

    // Handle transition to main recognizer after wake word detection
    if (prevState === 'TRANSITIONING_VAD_TO_MAIN' || wasIntentionalTrans) {
      console.log('[BSH] VAD onend: Post wake word. Manager should handle main STT.');
      
      if (state.value !== 'STARTING_MAIN' && state.value !== 'MAIN_ACTIVE' && state.value !== 'STOPPING' && state.value !== 'IDLE') {
        state.value = 'IDLE'; // Ensure clean state
      }
      
      // If main didn't start, schedule VAD restart
      if (state.value === 'IDLE' && isVoiceActivationMode.value && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
        scheduleRestart('vad_wake_after_transition_phase_ended_idle_onend');
      }
    } else if (reason === null && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && isVoiceActivationMode.value) {
      // Natural end - restart VAD wake listening
      if(state.value !== 'IDLE') state.value = 'IDLE';
      scheduleRestart('vad_wake_natural_end_onend_v2');
    } else {
      console.log(`[BSH] VAD onend: No auto-restart. Reason: ${reason}, State: ${state.value}`);
      if(state.value !== 'IDLE' && state.value !== 'STOPPING') state.value = 'IDLE';
    }
    
    _updateReactiveStates(state.value);
  };

  vadRecognizer.value = recognizer;
  return true;
}

/**
 * Clears all active timers (VAD silence, restart debounce, continuous emit debounce).
 */
function clearAllTimers(): void {
  if (vadCommandSilenceTimer) clearTimeout(vadCommandSilenceTimer);
  vadCommandSilenceTimer = null;
  if (restartDebounceTimer) clearTimeout(restartDebounceTimer);
  restartDebounceTimer = null;
  if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer);
  continuousEmitDebounceTimer = null;
}

/**
 * Clears all transcript buffers.
 */
function clearAllTranscripts(): void {
  finalTranscriptPTT = '';
  pendingContinuousTranscript.value = '';
  continuousTranscriptBuffer = '';
}

/**
 * Clears the restart debounce timer.
 */
function clearRestartDebounceTimer(): void {
  if (restartDebounceTimer) {
    clearTimeout(restartDebounceTimer);
    restartDebounceTimer = null;
  }
}

/**
 * Public API: Starts listening based on the current audio input mode.
 * Manages transitions between VAD wake word listening and main command capture.
 * @param {boolean} [forVadCommandCapture=false] - If true, and in VAD mode, attempts to start the main recognizer for command capture (typically after a wake word).
 * If false, and in VAD mode, starts VAD wake word listening.
 * In other modes, starts the main recognizer.
 * @returns {Promise<void | boolean>} True if listening was successfully initiated, false otherwise
 * @public
 */
async function startListening(forVadCommandCapture: boolean = false): Promise<void | boolean> {
  console.log(`[BSH] API startListening. VADCommand: ${forVadCommandCapture}, State: ${state.value}, Mode: ${props.audioInputMode}`);
  
  activeStopReason.value = null;
  clearRestartDebounceTimer(); // Clear any pending restart attempts
  
  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: 'Mic permission not granted.' });
    return false;
  }
  
  // Block general STT if LLM is busy, but allow VAD wake listening and VAD command capture
  if (props.parentIsProcessingLLM && !(isVoiceActivationMode.value && forVadCommandCapture) && !(isVoiceActivationMode.value && !forVadCommandCapture)) {
    console.log(`[BSH] startListening blocked: LLM busy.`);
    return false;
  }

  // Stop conflicting activity more cleanly
  const currentRecState = state.value;
  
  if (forVadCommandCapture) {
    // Attempting to start MAIN for command capture (post-VAD)
    if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') {
      await _stopListeningInternal(true, 'vad', 'switch_vad_to_main_cmd_v2');
    } else if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') {
      return true; // Already in desired state
    }
  } else if (isVoiceActivationMode.value) {
    // Attempting to start VAD_WAKE listening
    if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') {
      await _stopListeningInternal(true, 'main', 'switch_main_to_vad_wake_v2');
    } else if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') {
      return true; // Already in desired state
    }
  } else {
    // Attempting to start MAIN for PTT or Continuous
    if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') {
      await _stopListeningInternal(true, 'vad', 'switch_vad_to_main_other_v2');
    } else if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') {
      return true; // Already in desired state
    }
  }

  // If not IDLE after stopping, force a full stop
  if (state.value !== 'IDLE') {
    console.log(`[BSH] startListening: state ${state.value} not IDLE, attempting stopAll.`);
    await _stopAllInternal(true, "force_idle_before_start_v4");
    
    if (state.value !== 'IDLE') {
      console.error(`[BSH] CRITICAL: State ${state.value} after stopAll. Expected IDLE.`);
      state.value = 'IDLE'; // Force
    }
  }
  
  _updateReactiveStates(state.value);

  clearAllTimers();
  let success = false;

  if (isVoiceActivationMode.value && !forVadCommandCapture) {
    // Start VAD Wake Word Listening
    state.value = 'STARTING_VAD_WAKE';
    _updateReactiveStates(state.value);
    
    if (initVadRecognizer() && vadRecognizer.value) {
      try {
        vadRecognizer.value.start();
        success = true;
        console.log('[BSH] VAD wake recognizer.start() OK.');
      } catch (e: any) {
        console.error('[BSH] Err start VAD wake:', e);
        handleError(e.name === 'InvalidStateError' ? 'aborted' : (e.error || 'start_error'), 'vad', e.message);
      }
    } else {
      console.error('[BSH] VAD init failed.');
      state.value = 'IDLE';
      _updateReactiveStates(state.value);
    }
  } else {
    // Start MAIN Recognizer (for PTT, Continuous, or VAD Command Capture)
    state.value = 'STARTING_MAIN';
    _updateReactiveStates(state.value);
    
    if (initMainRecognizer() && mainRecognizer.value) {
      try {
        mainRecognizer.value.start();
        success = true;
        console.log('[BSH] Main recognizer.start() OK.');
      } catch (e: any) {
        console.error('[BSH] Err start MAIN:', e);
        handleError(e.name === 'InvalidStateError' ? 'aborted' : (e.error || 'start_error'), 'main', e.message);
      }
      
      // If starting main for VAD command capture, set up silence timeout
      if (forVadCommandCapture && isVoiceActivationMode.value && success) {
        clearVadCommandSilenceTimer();
        vadCommandSilenceTimer = window.setTimeout(() => {
          if (state.value === 'MAIN_ACTIVE' && mainRecognizer.value) {
            _stopListeningInternal(false, 'main', 'vad_cmd_silence_timeout');
          }
        }, props.settings.vadSilenceTimeoutMs || VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT);
      }
    } else {
      console.error('[BSH] Main init failed.');
      state.value = 'IDLE';
      _updateReactiveStates(state.value);
    }
  }
  
  return success;
}

/**
 * Clears the VAD command silence timer.
 */
function clearVadCommandSilenceTimer(): void {
  if (vadCommandSilenceTimer) {
    clearTimeout(vadCommandSilenceTimer);
    vadCommandSilenceTimer = null;
  }
}

/**
 * Internal utility to stop a specific recognizer (main or VAD).
 * @param {boolean} [abort=false] - If true, calls `abort()` on the recognizer; otherwise, calls `stop()`
 * @param {'main' | 'vad'} recognizerType - Specifies which recognizer to stop
 * @param {string} [reason="unknown"] - A reason string for logging purposes
 * @private
 */
async function _stopListeningInternal(abort: boolean = false, recognizerType: 'main' | 'vad', reason: string = "unknown"): Promise<void> {
  activeStopReason.value = reason;
  
  const recognizerRef = recognizerType === 'main' ? mainRecognizer : vadRecognizer;
  const currentRecognizerInstance = recognizerRef.value;
  
  if (!currentRecognizerInstance || (state.value === 'IDLE' && !isActive.value && !isListeningForWakeWord.value)) {
    activeStopReason.value = null;
    return;
  }
  
  console.log(`[BSH] _stopListeningInternal (${recognizerType}, ${reason}). Abort: ${abort}. State: ${state.value}`);
  
  if (state.value !== 'STOPPING') {
    state.value = 'STOPPING';
    // _updateReactiveStates might be deferred to onend
  }
  
  try {
    if (abort) {
      currentRecognizerInstance.abort();
    } else {
      currentRecognizerInstance.stop();
    }
    console.log(`[BSH] ${recognizerType} ${abort ? 'abort()' : 'stop()'} called.`);
  } catch (e: any) {
    console.warn(`[BSH] Err during ${recognizerType} stop/abort:`, e);
    
    // If the stop/abort command itself fails, attempt a more forceful cleanup
    if (recognizerRef.value === currentRecognizerInstance) {
      detachEventHandlers(currentRecognizerInstance);
      recognizerRef.value = null;
      
      if (recognizerType === 'main' && isActive.value) {
        isActive.value = false;
        emit('processing-audio', false);
      }
      if (recognizerType === 'vad' && isListeningForWakeWord.value) {
        isListeningForWakeWord.value = false;
        emit('is-listening-for-wake-word', false);
      }
    }
    
    // If this was the last active recognizer and stop failed, ensure state becomes IDLE
    if (!mainRecognizer.value && !vadRecognizer.value && state.value === 'STOPPING') {
      state.value = 'IDLE';
      _updateReactiveStates(state.value);
    }
  }
}

/**
 * Internal utility to stop all recognition activity immediately.
 * Aborts both main and VAD recognizers, clears timers and transcripts, and sets state to IDLE.
 * @param {boolean} [abort=true] - If true, calls `abort()` on recognizers; otherwise, calls `stop()`
 * @param {string} [reason="unknown"] - A reason string for logging
 * @private
 */
async function _stopAllInternal(abort: boolean = true, reason: string = "unknown"): Promise<void> {
  console.log(`[BSH] _stopAllInternal. Abort: ${abort}, Reason: ${reason}, State: ${state.value}`);
  
  activeStopReason.value = reason;
  const initialHandlerState = state.value;
  
  if (initialHandlerState === 'IDLE' && !mainRecognizer.value && !vadRecognizer.value && !isActive.value && !isListeningForWakeWord.value) {
    _updateReactiveStates('IDLE');
    activeStopReason.value = null;
    return;
  }
  
  state.value = 'STOPPING';
  clearAllTimers();
  
  const mainRec = mainRecognizer.value;
  const vadRec = vadRecognizer.value;
  
  // Detach and nullify before calling stop/abort to prevent onend handlers from interfering
  if (mainRec) {
    detachEventHandlers(mainRec);
    mainRecognizer.value = null;
    try {
      if (abort) mainRec.abort();
      else mainRec.stop();
    } catch (e) {
      console.warn('[BSH] Err stopping mainRec in stopAll:', e);
    }
  }
  
  if (vadRec) {
    detachEventHandlers(vadRec);
    vadRecognizer.value = null;
    try {
      if (abort) vadRec.abort();
      else vadRec.stop();
    } catch (e) {
      console.warn('[BSH] Err stopping vadRec in stopAll:', e);
    }
  }
  
  state.value = 'IDLE';
  _updateReactiveStates(state.value);
  clearAllTranscripts();
  
  console.log(`[BSH] _stopAllInternal COMPLETED (Reason: ${reason}, FromState: ${initialHandlerState}). Handler forced IDLE.`);
  activeStopReason.value = null;
}

/**
 * Public API: Stops the currently active listening process (main or VAD).
 * @param {boolean} [abort=false] - If true, attempts to abort the recognizer immediately
 * @public
 */
async function stopListeningAPI(abort: boolean = false): Promise<void> {
  await _stopAllInternal(abort, 'api_stop_listening_v2');
}

/**
 * Public API: Reinitializes the handler. Stops all current STT activity, resets internal state to IDLE.
 * The STT manager is expected to call `startListening` again if auto-start conditions are met.
 * @public
 */
async function reinitialize(): Promise<void> {
  console.log('[BSH] API reinitialize.');
  await _stopAllInternal(true, 'api_reinitialize_command_v2');
  await nextTick();
}

/**
 * Public API: Stops all STT activity immediately and forcefully.
 * @param {boolean} [abort=true] - Determines if `abort()` or `stop()` is called on recognizers
 * @public
 */
async function stopAllAPI(abort: boolean = true): Promise<void> {
  await _stopAllInternal(abort, 'api_stop_all_command_v2');
}

/**
 * Public API: Clears any pending (interim) transcript.
 */
function clearPendingTranscript(): void {
  pendingContinuousTranscript.value = '';
}

/**
 * Schedules a debounced restart of the appropriate recognizer (VAD wake or main continuous)
 * if conditions (mic permission, LLM not busy, correct mode) are met.
 * @param {string} reason - A reason string for logging, indicating why the restart is scheduled
 */
function scheduleRestart(reason: string): void {
  clearRestartDebounceTimer(); // Clear any existing restart timer to ensure only one is pending
  
  console.log(`[BSH] Scheduling restart: ${reason}. Debounce: ${RESTART_DEBOUNCE_MS}. Current State: ${state.value}`);
  
  restartDebounceTimer = window.setTimeout(() => {
    console.log(`[BSH] Debounced restart for: ${reason}. State before attempt: ${state.value}`);
    
    // Key conditions for any restart: must be IDLE, mic granted, and LLM not busy
    if (state.value === 'IDLE' && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value) {
        console.log('[BSH] Debounced restart: Continuous mode.');
        startListening(false); // Start main recognizer for continuous listening
      } else if (isVoiceActivationMode.value) {
        console.log('[BSH] Debounced restart: VAD mode.');
        startListening(false); // This will start VAD wake listening
      } else {
        console.log('[BSH] Debounced restart: PTT mode, no scheduled restart.');
      }
    } else {
      console.log(`[BSH] Debounced restart ABORTED. Conditions not met. State: ${state.value}, Mic: ${props.currentMicPermission}, LLM: ${props.parentIsProcessingLLM}`);
    }
  }, RESTART_DEBOUNCE_MS);
}

/**
 * Handles errors from SpeechRecognition instances.
 * Stops all STT activity, emits an error event, and potentially schedules a restart.
 * @param {CustomSpeechRecognitionErrorCode} errorCode - The error code from the SpeechRecognition API
 * @param {'main' | 'vad'} recognizerType - Indicates which recognizer ('main' or 'vad') produced the error
 * @param {string} [message] - Optional error message for additional context
 */
function handleError(errorCode: CustomSpeechRecognitionErrorCode, recognizerType: 'main' | 'vad', message?: string): void {
  const stateWhenError = state.value;
  
  console.error(`[BSH] handleError: ${recognizerType} code: ${errorCode}, msg: ${message || 'N/A'}, StateOnError: ${stateWhenError}`);
  
  activeStopReason.value = `error_${recognizerType}_${errorCode}`;
  clearRestartDebounceTimer();

  // Exception for 'no-speech' - often not a "fatal" error, might just mean silence
  if (errorCode === 'no-speech') {
    console.log(`[BSH] 'no-speech' error (${recognizerType}). Allowing onend to manage or scheduling recovery.`);
    
    emit('error', { type: 'speech_recognition', message: `STT Info (${recognizerType}): ${errorCode} - ${message || ''}`, code: errorCode });
    
    // Force immediate state update for no-speech
    if (recognizerType === 'main' && isActive.value) {
      isActive.value = false;
      emit('processing-audio', false);
    }
    
    if (recognizerType === 'vad' && isListeningForWakeWord.value) {
      isListeningForWakeWord.value = false;
      emit('is-listening-for-wake-word', false);
    }
    
    // Nudge to IDLE to allow restart
    if (state.value === 'MAIN_ACTIVE' || state.value === 'VAD_WAKE_LISTENING' || state.value === 'STARTING_MAIN' || state.value === 'STARTING_VAD_WAKE') {
      state.value = 'IDLE';
    }
    
    _updateReactiveStates(state.value); // Reflect any immediate inactivation

    // Schedule restart for auto-start modes
    if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if ((isContinuousMode.value && recognizerType === 'main') || (isVoiceActivationMode.value)) {
        scheduleRestart(`no_speech_recovery_v2_${recognizerType}`);
      }
    }
    
    return;
  }

  // For other errors, including 'aborted' not handled by the VAD transition logic
  _stopAllInternal(true, `error_handling_critical_${recognizerType}_${errorCode}_v4`);

  // Emit error details
  emit('error', { type: 'speech_recognition', message: `STT Error (${recognizerType}): ${errorCode} - ${message || ''}`, code: errorCode });
  
  if (['audio-capture', 'network', 'not-allowed', 'service-not-allowed'].includes(errorCode)) {
    toast?.add({
      type: 'error',
      title: `Mic/Service Error (${errorCode})`,
      message: `STT failed. Check mic/permissions.`,
      duration: 7000
    });
  }

  // Attempt to schedule a restart for recoverable errors if conditions permit
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
    if (errorCode !== 'not-allowed' && errorCode !== 'service-not-allowed' && errorCode !== 'aborted') {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        scheduleRestart(`critical_error_recovery_v2_${recognizerType}_${errorCode}`);
      }
    }
  }
}

// --- Watchers for prop changes ---

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode === oldMode || !SpeechRecognitionAPIConstructor.value) return;
  console.log(`[BSH] audioInputMode changed: ${oldMode} -> ${newMode}. Reinitializing.`);
  await reinitialize();
});

watch(() => props.parentIsProcessingLLM, async (isProcessing) => {
  if (!SpeechRecognitionAPIConstructor.value) return;
  console.log(`[BSH] parentIsProcessingLLM -> ${isProcessing}. State: ${state.value}`);
  clearRestartDebounceTimer();
  
  if (isProcessing) {
    // If LLM starts processing, STT should stop, unless it's VAD listening for a wake word
    if (state.value !== 'VAD_WAKE_LISTENING' && state.value !== 'STARTING_VAD_WAKE' && state.value !== 'IDLE') {
      await _stopAllInternal(true, 'llm_processing_started_v3');
    }
  } else {
    // LLM finished - check if restart is needed
    if (state.value === 'IDLE' && (isContinuousMode.value || isVoiceActivationMode.value)) {
      scheduleRestart('llm_processing_finished_v3');
    }
  }
});

watch(() => props.currentMicPermission, async (newPerm, oldPerm) => {
  if (newPerm === oldPerm || !SpeechRecognitionAPIConstructor.value) return;
  console.log(`[BSH] MicPerm changed: ${oldPerm} -> ${newPerm}. State: ${state.value}`);
  clearRestartDebounceTimer();
  
  if (newPerm !== 'granted') {
    // Mic permission lost or denied
    if (state.value !== 'IDLE' && state.value !== 'STOPPING') {
      await _stopAllInternal(true, 'mic_perm_lost_v3');
    }
  } else {
    // Mic permission granted
    if (state.value === 'IDLE' && (isContinuousMode.value || isVoiceActivationMode.value)) {
      scheduleRestart('mic_perm_granted_v3');
    }
  }
});

watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang && SpeechRecognitionAPIConstructor.value) {
    console.log(`[BSH] speechLang changed. Reinitializing.`);
    await reinitialize();
  }
});

watch(() => [props.settings.vadWakeWordsBrowserSTT, props.settings.vadSilenceTimeoutMs], async () => {
  if (!SpeechRecognitionAPIConstructor.value) return;
  // If VAD settings change and we're actively using VAD, reinitialize
  if (isVoiceActivationMode.value && state.value !== 'IDLE' && state.value !== 'STOPPING') {
    console.log('[BSH] VAD settings changed. Reinitializing.');
    await reinitialize();
  }
}, { deep: true });

// --- Lifecycle Hooks ---

onMounted(() => {
  SpeechRecognitionAPIConstructor.value = WindowSpeechRecognition || null;
  
  if (!SpeechRecognitionAPIConstructor.value) {
    console.warn("[BSH] Web Speech API not found.");
    emit('error', { type: 'init', message: 'Web Speech API not supported by this browser.' });
  }
  
  const apiExposed: SttHandlerInstance = {
    startListening,
    stopListening: stopListeningAPI,
    reinitialize,
    stopAll: stopAllAPI,
    isActive: readonly(isActive),
    isListeningForWakeWord: readonly(isListeningForWakeWord),
    hasPendingTranscript: readonly(hasPendingTranscript),
    pendingTranscript: readonly(pendingContinuousTranscript),
    clearPendingTranscript,
  };
  
  emit('handler-api-ready', apiExposed);
  console.log(`[BSH] Component Mounted. Initial state: ${state.value}.`);
});

onBeforeUnmount(async () => {
  console.log('[BSH] Unmounting.');
  clearAllTimers();
  await _stopAllInternal(true, 'component_unmount_v4');
  mainRecognizer.value = null;
  vadRecognizer.value = null;
  emit('unmounted');
});

</script>