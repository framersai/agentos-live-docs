// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
// Version: 4.0.4 - Refined recognizer lifecycle management, event handler detachment.
<template>
  </template>

<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Vue 3 Composition API component for handling browser-based SpeechRecognition.
 * Manages microphone access, recognition lifecycle, and emits transcription results or errors.
 * Designed to be robust across different audio input modes (PTT, Continuous, VAD).
 *
 * This component is intended to be used as a child of a voice input manager,
 * receiving settings and mode changes as props, and emitting events for its state.
 * It does not directly interact with global stores but relies on props and emits for communication.
 *
 * @version 4.0.4
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, nextTick, type Ref, type ComputedRef } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

// Ambient type declarations for Web Speech API
// Note: For a more robust setup, ensure "dom" is in your tsconfig.json's "lib" array,
// or consider installing `@types/wicg-speech-api`.
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  // Base SpeechRecognition interface
  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string; // Though often not used or implemented

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

    addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  // Constructor for SpeechRecognition
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
  // For Safari and older Chrome, often prefixed
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };

  interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "audioend": Event;
    "end": Event;
    "error": SpeechRecognitionErrorEvent;
    "nomatch": SpeechRecognitionEvent;
    "result": SpeechRecognitionEvent;
    "soundstart": Event;
    "soundend": Event;
    "speechstart": Event;
    "speechend": Event;
    "start": Event;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }
  var SpeechGrammar: {
    prototype: SpeechGrammar;
    new(): SpeechGrammar;
  };

  interface SpeechGrammarList {
    readonly length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
  }
  var SpeechGrammarList: {
    prototype: SpeechGrammarList;
    new(): SpeechGrammarList;
  };

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionEventInit extends EventInit {
    resultIndex?: number;
    results?: SpeechRecognitionResultList;
    emma?: Document | null; // Added from MDN
    interpretation?: any; // Added from MDN
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly emma: Document | null; // Added from MDN
    readonly interpretation: any; // Added from MDN
  }
  var SpeechRecognitionEvent: {
    prototype: SpeechRecognitionEvent;
    new(type: string, eventInitDict: SpeechRecognitionEventInit): SpeechRecognitionEvent;
  };

  type SpeechRecognitionErrorCode =
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported";

  interface SpeechRecognitionErrorEventInit extends EventInit {
    error: SpeechRecognitionErrorCode;
    message?: string;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
  }
  var SpeechRecognitionErrorEvent: {
    prototype: SpeechRecognitionErrorEvent;
    new(type: string, eventInitDict: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent;
  };
}


// Props
const props = defineProps<{
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean;
  currentMicPermission: 'prompt' | 'granted' | 'denied' | 'error' | '';
}>();

// Emits
const emit = defineEmits<{
  (e: 'handler-api-ready', api: BrowserSpeechHandlerApi): void;
  (e: 'unmounted'): void;
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: { type: string; message: string; code?: string }): void;
  (e: 'wake-word-detected'): void;
}>();

const toast = inject<ToastService>('toast');

const SpeechRecognitionAPI = ref<typeof SpeechRecognition | null>(null);

type RecognitionState =
  | 'IDLE'
  | 'STARTING_MAIN'
  | 'MAIN_ACTIVE'
  | 'STARTING_VAD_WAKE'
  | 'VAD_WAKE_LISTENING'
  | 'STOPPING';

const state = ref<RecognitionState>('IDLE');
const mainRecognizer = ref<SpeechRecognition | null>(null);
const vadRecognizer = ref<SpeechRecognition | null>(null);
const isActive = ref(false);
const isListeningForWakeWord = ref(false);

const interimTranscript = ref('');
const finalTranscriptPTT = ref('');
const pendingContinuousTranscript = ref('');
const hasPendingTranscript = computed<boolean>(() => !!pendingContinuousTranscript.value.trim());

let continuousPauseTimer: number | null = null;
let vadCommandTimer: number | null = null;
let restartTimer: number | null = null;

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');

/**
 * Detaches all event handlers from a SpeechRecognition instance.
 * @param {SpeechRecognition | null} recognizer - The recognizer instance.
 */
function detachEventHandlers(recognizer: SpeechRecognition | null): void {
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

function createRecognizer(forWakeWord: boolean = false): SpeechRecognition | null {
  if (!SpeechRecognitionAPI.value) {
    console.error('[BSH] SpeechRecognition API not available.');
    emit('error', { type: 'init', message: 'Web Speech API not supported in this browser.' });
    return null;
  }
  try {
    const recognizer = new SpeechRecognitionAPI.value();
    recognizer.lang = props.settings.speechLanguage || 'en-US';
    recognizer.continuous = forWakeWord || isContinuousMode.value;
    recognizer.interimResults = !forWakeWord;
    recognizer.maxAlternatives = 1;
    // console.log(`[BSH] Created recognizer. Lang: ${recognizer.lang}, Continuous: ${recognizer.continuous}, Interim: ${recognizer.interimResults}, ForWakeWord: ${forWakeWord}`);
    return recognizer;
  } catch (e) {
    console.error("[BSH] Error constructing SpeechRecognition instance:", e);
    emit('error', { type: 'init', message: 'Failed to create SpeechRecognition instance.' });
    return null;
  }
}

function initMainRecognizer(): boolean {
  // console.log('[BSH] initMainRecognizer called.');
  if (mainRecognizer.value) {
    console.log('[BSH] Cleaning up existing mainRecognizer before re-init.');
    detachEventHandlers(mainRecognizer.value);
    try {
      mainRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting previous mainRecognizer instance during init:', e);
    }
    mainRecognizer.value = null;
  }

  const recognizer = createRecognizer(false);
  if (!recognizer) {
    return false;
  }

  recognizer.onstart = () => {
    if (mainRecognizer.value !== recognizer) return; // Stale event
    // console.log('[BSH] Main recognizer onstart. Current state:', state.value);
    if (state.value === 'STARTING_MAIN') {
      state.value = 'MAIN_ACTIVE';
      isActive.value = true;
      emit('processing-audio', true);
      interimTranscript.value = '';
      if (isPttMode.value) finalTranscriptPTT.value = '';
      console.log('[BSH] Main recognizer successfully started and now MAIN_ACTIVE.');
    } else {
      console.warn(`[BSH] Main recognizer onstart fired but state was ${state.value}, not STARTING_MAIN. Forcing to MAIN_ACTIVE.`);
      state.value = 'MAIN_ACTIVE';
      isActive.value = true;
      emit('processing-audio', true);
    }
  };

  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    if (mainRecognizer.value !== recognizer || state.value !== 'MAIN_ACTIVE' || props.parentIsProcessingLLM) {
      if(props.parentIsProcessingLLM && state.value === 'MAIN_ACTIVE') console.log('[BSH] Main onresult: Ignoring result as parentIsProcessingLLM is true.');
      return;
    }
    clearContinuousPauseTimer();
    let currentInterim = '';
    let currentFinal = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const resultItem = event.results.item(i);
      if (resultItem.isFinal) {
        currentFinal += resultItem.item(0).transcript;
      } else {
        currentInterim += resultItem.item(0).transcript;
      }
    }
    interimTranscript.value = currentInterim;
    if (currentFinal.trim()) {
      if (isPttMode.value) {
        finalTranscriptPTT.value += (finalTranscriptPTT.value ? ' ' : '') + currentFinal.trim();
      } else if (isContinuousMode.value) {
        pendingContinuousTranscript.value += (pendingContinuousTranscript.value ? ' ' : '') + currentFinal.trim();
        if (props.settings.continuousModeAutoSend) {
          startContinuousPauseTimer();
        }
      } else if (isVoiceActivationMode.value) {
        emit('transcription', currentFinal.trim());
         if (mainRecognizer.value === recognizer && state.value === 'MAIN_ACTIVE') { // Ensure it's still the active one
            console.log("[BSH] VAD Command captured, stopping main recognizer (onresult).");
            detachEventHandlers(mainRecognizer.value); // Detach before stop
            mainRecognizer.value.stop();
            // mainRecognizer.value = null; // Let onEnd handle nulling if stop is graceful
        }
      }
    }
  };

  recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (mainRecognizer.value !== recognizer) {
      console.warn("[BSH] Main recognizer onerror from a stale instance. Ignoring.");
      return;
    }
    console.error('[BSH] Main recognizer error:', event.error, event.message, 'Current State:', state.value);
    handleError(event.error, 'main');
  };

  recognizer.onend = () => {
    if (mainRecognizer.value !== recognizer && mainRecognizer.value !== null) {
       console.warn("[BSH] Main recognizer onend from a stale instance. Current mainRecognizer ref is different or already cleared. Ignoring.");
        if (state.value !== 'IDLE' && !mainRecognizer.value && !vadRecognizer.value) {
            state.value = 'IDLE';
            isActive.value = false;
            emit('processing-audio', false);
        }
       return;
    }

    const previousState = state.value;
    // console.log(`[BSH] Main recognizer onend. Recognizer matches current: ${mainRecognizer.value === recognizer}. Prev state: ${previousState}, Current state (before this onend logic): ${state.value}`);

    if (mainRecognizer.value === recognizer) { // Only nullify if it's the one that just ended
        detachEventHandlers(mainRecognizer.value); // Ensure handlers detached if not already
        mainRecognizer.value = null;
    }

    if (previousState === 'MAIN_ACTIVE' || previousState === 'STARTING_MAIN' || previousState === 'STOPPING') {
      if (state.value !== 'IDLE') { // Only set to IDLE if not already set by handleError or other logic
        state.value = 'IDLE';
      }
    }

    if (!mainRecognizer.value) { // If it is now null (either by this onEnd or handleError)
        if(isActive.value) emit('processing-audio', false);
        isActive.value = false;
    }
    interimTranscript.value = '';

    if (previousState === 'MAIN_ACTIVE' || previousState === 'STARTING_MAIN') {
      if (isPttMode.value && finalTranscriptPTT.value.trim()) {
        emit('transcription', finalTranscriptPTT.value.trim());
      }
      if (isContinuousMode.value && pendingContinuousTranscript.value.trim()) {
         if (props.settings.continuousModeAutoSend && !continuousPauseTimer) {
            emit('transcription', pendingContinuousTranscript.value.trim());
         }
      }
    } else {
        // console.log(`[BSH] Main onend: Not processing final PTT/Continuous transcripts as previous state was ${previousState}.`);
    }
    finalTranscriptPTT.value = '';
    pendingContinuousTranscript.value = '';

    if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && state.value === 'IDLE') {
      if (isContinuousMode.value && (previousState === 'MAIN_ACTIVE' || previousState === 'STARTING_MAIN')) {
        scheduleRestart('main_continuous_onend_reinit_v405');
      } else if (isVoiceActivationMode.value && previousState === 'MAIN_ACTIVE') {
        scheduleRestart('main_vad_command_end_reinit_v405');
      }
    } else {
      // console.log(`[BSH] Not auto-restarting after main.onend. Mic perm: ${props.currentMicPermission}, LLM busy: ${props.parentIsProcessingLLM}, Prev State: ${previousState}, Current State: ${state.value}`);
    }
  };
  mainRecognizer.value = recognizer;
  return true;
}

function initVadRecognizer(): boolean {
  // console.log('[BSH] initVadRecognizer called.');
  if (vadRecognizer.value) {
    console.log('[BSH] Cleaning up existing vadRecognizer before re-init.');
    detachEventHandlers(vadRecognizer.value);
    try {
      vadRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting previous vadRecognizer instance during init:', e);
    }
    vadRecognizer.value = null;
  }
  const recognizer = createRecognizer(true);
  if (!recognizer) {
    return false;
  }
  recognizer.onstart = () => {
    if (vadRecognizer.value !== recognizer) return; // Stale event
    // console.log('[BSH] VAD recognizer onstart. Current state:', state.value);
    if (state.value === 'STARTING_VAD_WAKE') {
      state.value = 'VAD_WAKE_LISTENING';
      isListeningForWakeWord.value = true;
      emit('is-listening-for-wake-word', true);
      console.log('[BSH] VAD recognizer successfully started and now VAD_WAKE_LISTENING.');
    } else {
      console.warn(`[BSH] VAD recognizer onstart fired but state was ${state.value}, not STARTING_VAD_WAKE. Forcing to VAD_WAKE_LISTENING.`);
      state.value = 'VAD_WAKE_LISTENING';
      isListeningForWakeWord.value = true;
      emit('is-listening-for-wake-word', true);
    }
  };
  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    if (vadRecognizer.value !== recognizer || state.value !== 'VAD_WAKE_LISTENING' || props.parentIsProcessingLLM) {
      if(props.parentIsProcessingLLM && state.value === 'VAD_WAKE_LISTENING') console.log('[BSH] VAD onresult: Ignoring result as parentIsProcessingLLM is true.');
      return;
    }
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results.item(i).item(0).transcript;
    }
    const wakeWords = props.settings.vadWakeWordsBrowserSTT?.map(w => w.toLowerCase()) || ['v', 'vee'];
    const detected = wakeWords.some(word => transcript.toLowerCase().includes(word));
    if (detected) {
      console.log('[BSH] Wake word detected in VAD transcript:', transcript);
      if (vadRecognizer.value === recognizer && state.value === 'VAD_WAKE_LISTENING') {
        console.log("[BSH] Wake word detected. Aborting current VAD recognizer to transition.");
        detachEventHandlers(vadRecognizer.value);
        try { vadRecognizer.value.abort(); } catch (e) { console.warn("[BSH] Error aborting VAD (onresult detect):", e); }
        vadRecognizer.value = null;
        state.value = 'IDLE'; // Wake word found, VAD mission accomplished for this cycle
        isListeningForWakeWord.value = false;
        emit('is-listening-for-wake-word', false);
      }
      emit('wake-word-detected');
    }
  };
  recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (vadRecognizer.value !== recognizer) {
      console.warn("[BSH] VAD recognizer onerror from a stale instance. Ignoring.");
      return;
    }
    console.error('[BSH] VAD recognizer error:', event.error, event.message, 'Current State:', state.value);
    handleError(event.error, 'vad');
  };
  recognizer.onend = () => {
    if (vadRecognizer.value !== recognizer && vadRecognizer.value !== null) {
       console.warn("[BSH] VAD recognizer onend from a stale instance. Ignoring.");
        if (state.value !== 'IDLE' && !mainRecognizer.value && !vadRecognizer.value) {
            state.value = 'IDLE';
            isListeningForWakeWord.value = false;
            emit('is-listening-for-wake-word', false);
        }
       return;
    }
    const previousState = state.value;
    // console.log(`[BSH] VAD recognizer onend. Recognizer matches current: ${vadRecognizer.value === recognizer}. Prev state: ${previousState}, Current state (before this onend logic): ${state.value}`);

    if (vadRecognizer.value === recognizer) {
        detachEventHandlers(vadRecognizer.value);
        vadRecognizer.value = null;
    }
    if (previousState === 'VAD_WAKE_LISTENING' || previousState === 'STARTING_VAD_WAKE' || previousState === 'STOPPING') {
      if (state.value !== 'IDLE') {
        state.value = 'IDLE';
      }
    }
    if (!vadRecognizer.value) {
        if(isListeningForWakeWord.value) emit('is-listening-for-wake-word', false);
        isListeningForWakeWord.value = false;
    }

    if ((previousState === 'VAD_WAKE_LISTENING' || previousState === 'STARTING_VAD_WAKE')) {
      if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && state.value === 'IDLE') {
        // console.log('[BSH] VAD onend: Scheduling VAD wake restart.');
        scheduleRestart('vad_onend_reinit_v405');
      } else {
        // console.log(`[BSH] VAD onend: Not restarting. Mic perm: ${props.currentMicPermission}, LLM busy: ${props.parentIsProcessingLLM}, State: ${state.value}, Prev State: ${previousState}`);
      }
    }
  };
  vadRecognizer.value = recognizer;
  return true;
}

async function startListening(forVadCommand: boolean = false): Promise<void> {
  // console.log(`[BSH] Public startListening. forVadCommand: ${forVadCommand}, Mode: ${props.audioInputMode}, State: ${state.value}, MicPerm: ${props.currentMicPermission}`);
  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: 'Microphone permission not granted.' });
    // toast?.add({type: 'warning', title: 'Mic Required', message: 'Please grant microphone access.'}); // Can be noisy
    return;
  }

  const localCurrentState = state.value; // Capture current state for checks

  if (isVoiceActivationMode.value && !forVadCommand && (localCurrentState === 'VAD_WAKE_LISTENING' || localCurrentState === 'STARTING_VAD_WAKE')) {
    // console.log('[BSH] startListening: Already listening/starting for VAD wake word.');
    return;
  }
  if (!isVoiceActivationMode.value && (localCurrentState === 'MAIN_ACTIVE' || localCurrentState === 'STARTING_MAIN')) {
    // console.log('[BSH] startListening: Main recognizer already active/starting for PTT/Continuous.');
    return;
  }
   if (forVadCommand && (localCurrentState === 'MAIN_ACTIVE' || localCurrentState === 'STARTING_MAIN') && isVoiceActivationMode.value) {
    // console.log('[BSH] startListening: Already capturing/starting VAD command.');
    return;
  }

  // This condition was flagged by TypeScript as having no overlap (TS2367).
  // However, `RecognitionState` includes 'IDLE', so `localCurrentState !== 'IDLE'` is a valid logical check.
  // The error might be a linter/compiler quirk if type definitions are otherwise correct.
  if (localCurrentState !== 'IDLE') {
    console.warn(`[BSH] startListening called but state is ${localCurrentState}. Attempting to stop existing activity first.`);
    await _stopAllInternal(true); // Ensure abort is true for quick stop
    await nextTick(); // Give Vue time for state propagation
    // After stopAll, state should be IDLE. If not, log an error.
    if (state.value !== 'IDLE') {
        console.error(`[BSH] Critical: Failed to reach IDLE state after _stopAllInternal in startListening. Current state: ${state.value}. Forcing IDLE.`);
        state.value = 'IDLE';
        isActive.value = false;
        isListeningForWakeWord.value = false;
        emit('processing-audio', false);
        emit('is-listening-for-wake-word', false);
    }
  }

  clearAllTimers(); // Clear timers before starting new recognition

  if (isVoiceActivationMode.value && !forVadCommand) {
    // console.log('[BSH] startListening: Attempting to start VAD wake listener.');
    state.value = 'STARTING_VAD_WAKE'; // Set state BEFORE init
    if (!initVadRecognizer()) {
      // If init fails, it should reset state to IDLE and emit error.
      return;
    }
    try {
      if (vadRecognizer.value) vadRecognizer.value!.start();
      else console.error("[BSH] VAD recognizer ref is null after init in startListening for VAD wake.");
    } catch (e: any) {
      console.error('[BSH] Error invoking vadRecognizer.start():', e);
      handleError(e.name || 'start_failed' as SpeechRecognitionErrorCode, 'vad');
    }
  } else {
    // console.log(`[BSH] startListening: Attempting to start main recognizer. Mode: ${props.audioInputMode}, forVadCommand: ${forVadCommand}`);
    state.value = 'STARTING_MAIN'; // Set state BEFORE init
    if (!initMainRecognizer()) {
      return;
    }
    try {
      if (mainRecognizer.value) mainRecognizer.value!.start();
      else console.error("[BSH] Main recognizer ref is null after init in startListening for Main.");

      if (forVadCommand && isVoiceActivationMode.value) {
        clearVadCommandTimer();
        vadCommandTimer = window.setTimeout(() => {
          if (state.value === 'MAIN_ACTIVE' && mainRecognizer.value) {
            console.log('[BSH] VAD command silence/duration timeout. Stopping command capture.');
            _stopListeningInternal(false, 'main'); // Request graceful stop
          }
        }, props.settings.vadSilenceTimeoutMs || 3000);
      }
    } catch (e: any) {
      console.error('[BSH] Error invoking mainRecognizer.start():', e);
      handleError(e.name || 'start_failed' as SpeechRecognitionErrorCode, 'main');
    }
  }
}

async function _stopListeningInternal(abort: boolean = false, recognizerType: 'main' | 'vad'): Promise<void> {
  // console.log(`[BSH] _stopListeningInternal. Abort: ${abort}, Type: ${recognizerType}, Current State: ${state.value}`);
  const recognizerRef = recognizerType === 'main' ? mainRecognizer : vadRecognizer;
  const currentRecognizerInstance = recognizerRef.value; // Capture the instance

  if (!currentRecognizerInstance) {
    // console.log(`[BSH] _stopListeningInternal: No ${recognizerType} instance to stop.`);
    return;
  }

  const isActiveOrStarting = (recognizerType === 'main' && (state.value === 'MAIN_ACTIVE' || state.value === 'STARTING_MAIN')) ||
                           (recognizerType === 'vad' && (state.value === 'VAD_WAKE_LISTENING' || state.value === 'STARTING_VAD_WAKE'));

  if (isActiveOrStarting || state.value === 'STOPPING') {
    if (state.value !== 'STOPPING') {
        state.value = 'STOPPING';
    }
    // console.log(`[BSH] Detaching handlers and stopping/aborting ${recognizerType} recognizer. Abort: ${abort}`);
    detachEventHandlers(currentRecognizerInstance); // Detach from the captured instance

    try {
      if (abort) {
        currentRecognizerInstance.abort();
      } else {
        currentRecognizerInstance.stop();
      }
    } catch (e) {
      console.warn(`[BSH] Error during ${recognizerType} recognizer.stop/abort() for instance:`, e);
      // If stop/abort itself throws, forcefully clean up state related to this recognizer type
      if (recognizerRef.value === currentRecognizerInstance) { // Check if ref still points to this instance
          recognizerRef.value = null;
      }
       if (recognizerType === 'main') {
        if(isActive.value) emit('processing-audio', false);
        isActive.value = false;
      } else {
        if(isListeningForWakeWord.value) emit('is-listening-for-wake-word', false);
        isListeningForWakeWord.value = false;
      }
      if (!mainRecognizer.value && !vadRecognizer.value && state.value === 'STOPPING') { // If both gone, ensure IDLE
          state.value = 'IDLE';
      }
    }
    // Note: recognizerRef.value might be nulled out by an onEnd handler that fires due to stop/abort.
    // The primary purpose of detaching handlers is to prevent *their logic* from running if we are manually stopping.
  }
}

async function _stopAllInternal(abort: boolean = true): Promise<void> {
  // console.log(`[BSH] _stopAllInternal. Abort: ${abort}, Current State: ${state.value}`);
  const previousState = state.value;
  if (previousState !== 'IDLE' && previousState !== 'STOPPING') {
      state.value = 'STOPPING';
  }
  clearAllTimers();

  // Stop main recognizer if it exists
  if (mainRecognizer.value) {
    const currentMain = mainRecognizer.value; // Capture instance
    // console.log("[BSH] _stopAllInternal: Detaching and stopping/aborting main.");
    detachEventHandlers(currentMain);
    try {
      if (abort) currentMain.abort(); else currentMain.stop();
    } catch (e) { console.warn("[BSH] _stopAllInternal: Error stopping main:", e); }
    mainRecognizer.value = null; // Force nullify after commanding stop/abort
  }

  // Stop VAD recognizer if it exists
  if (vadRecognizer.value) {
    const currentVad = vadRecognizer.value; // Capture instance
    // console.log("[BSH] _stopAllInternal: Detaching and stopping/aborting VAD.");
    detachEventHandlers(currentVad);
    try {
      if (abort) currentVad.abort(); else currentVad.stop();
    } catch (e) { console.warn("[BSH] _stopAllInternal: Error stopping VAD:", e); }
    vadRecognizer.value = null; // Force nullify
  }

  // console.log("[BSH] _stopAllInternal: All stop attempts made. Forcing final IDLE state and flag resets.");
  state.value = 'IDLE';
  if(isActive.value) emit('processing-audio', false);
  isActive.value = false;
  if(isListeningForWakeWord.value) emit('is-listening-for-wake-word', false);
  isListeningForWakeWord.value = false;
  clearAllTranscripts();
}

async function stopListening(abort: boolean = false): Promise<void> {
  // console.log(`[BSH] Public stopListening. Abort: ${abort}, Mode: ${props.audioInputMode}, State: ${state.value}`);
  const currentState = state.value; // Capture state at call time
  if (currentState === 'MAIN_ACTIVE' || currentState === 'STARTING_MAIN') {
    await _stopListeningInternal(abort, 'main');
  } else if (currentState === 'VAD_WAKE_LISTENING' || currentState === 'STARTING_VAD_WAKE') {
    await _stopListeningInternal(abort, 'vad');
  } else if (currentState === 'STOPPING'){
    // console.log("[BSH] Public stopListening: Already in STOPPING state. If force needed, call stopAll(true).");
    if (abort) await _stopAllInternal(true); // If abort is requested during stopping, force stop all.
  } else { // IDLE or other unexpected
    // console.log('[BSH] Public stopListening: No specific recognizer active/starting. Ensuring all stopped if abort requested.');
     if (abort) await _stopAllInternal(true);
  }
}

async function reinitialize(): Promise<void> {
  // console.log(`[BSH] Public reinitialize. Mode: ${props.audioInputMode}, State: ${state.value}`);
  await _stopAllInternal(true);
  await nextTick();
  if (state.value !== 'IDLE') {
      console.warn(`[BSH] Reinitialize: State was ${state.value} after stopAll. Forcing IDLE before restart attempt.`);
      state.value = 'IDLE';
  }
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
    if (isVoiceActivationMode.value || isContinuousMode.value) {
      // console.log('[BSH] Reinitialize: Auto-starting after ensuring IDLE state.');
      startListening();
    }
  } else {
    // console.log(`[BSH] Reinitialize: Not auto-starting. MicPerm: ${props.currentMicPermission}, LLM Busy: ${props.parentIsProcessingLLM}, State: ${state.value}`);
  }
}

async function stopAll(abort: boolean = true): Promise<void> {
  // console.log(`[BSH] Public stopAll. Abort: ${abort}`);
  await _stopAllInternal(abort);
}

function clearContinuousPauseTimer(): void {
  if (continuousPauseTimer) clearTimeout(continuousPauseTimer);
  continuousPauseTimer = null;
}

function startContinuousPauseTimer(): void {
  clearContinuousPauseTimer();
  if (!isContinuousMode.value || !props.settings.continuousModeAutoSend || !pendingContinuousTranscript.value.trim() || props.parentIsProcessingLLM) {
    return;
  }
  continuousPauseTimer = window.setTimeout(() => {
    if (pendingContinuousTranscript.value.trim() && isContinuousMode.value && state.value === 'MAIN_ACTIVE' && !props.parentIsProcessingLLM) {
      // console.log('[BSH] Continuous pause timeout. Sending transcript:', pendingContinuousTranscript.value.trim());
      emit('transcription', pendingContinuousTranscript.value.trim());
      pendingContinuousTranscript.value = '';
    }
  }, props.settings.continuousModePauseTimeoutMs || 3000);
}

function clearVadCommandTimer(): void {
  if (vadCommandTimer) clearTimeout(vadCommandTimer);
  vadCommandTimer = null;
}
function clearRestartTimer(): void {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = null;
}
function clearAllTimers(): void {
  clearContinuousPauseTimer();
  clearVadCommandTimer();
  clearRestartTimer();
}

function scheduleRestart(reason: string): void {
  clearRestartTimer();
  // console.log(`[BSH] Scheduling restart. Reason: ${reason}. Delay: 250ms. Current state: ${state.value}`);
  restartTimer = window.setTimeout(() => {
    if (state.value === 'IDLE' && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        // console.log('[BSH] Restart timer fired. Conditions met, calling startListening().');
        startListening();
      } else {
        // console.log('[BSH] Restart timer fired, but mode is PTT. No auto-restart.');
      }
    } else {
      // console.log(`[BSH] Restart timer fired, but conditions NOT met for restart. State: ${state.value}, MicPerm: ${props.currentMicPermission}, LLM Busy: ${props.parentIsProcessingLLM}`);
    }
  }, 250); // Short delay for stability
}

function clearAllTranscripts(): void {
  interimTranscript.value = '';
  finalTranscriptPTT.value = '';
  pendingContinuousTranscript.value = '';
}

function handleError(errorCode: SpeechRecognitionErrorCode, recognizerType: 'main' | 'vad' | 'unknown' = 'unknown'): void {
  const stateBeforeHandle = state.value;
  // console.warn(`[BSH] handleError. Error: "${errorCode}", Recognizer: ${recognizerType}, State before handle: ${stateBeforeHandle}`);

  const recWithError = recognizerType === 'main' ? mainRecognizer.value : (recognizerType === 'vad' ? vadRecognizer.value : null);
  if (recWithError) {
      // console.log(`[BSH] handleError: Detaching handlers from ${recognizerType} recognizer due to error.`);
      detachEventHandlers(recWithError); // Detach from the specific instance that errored
  }

  // Update reactive flags and nullify the specific recognizer ref
  if (recognizerType === 'main') {
    if(isActive.value) emit('processing-audio', false);
    isActive.value = false;
    mainRecognizer.value = null;
  } else if (recognizerType === 'vad') {
    if(isListeningForWakeWord.value) emit('is-listening-for-wake-word', false);
    isListeningForWakeWord.value = false;
    vadRecognizer.value = null;
  } else { // Unknown or if we need to be absolutely sure both are cleared on any error
      if(isActive.value) emit('processing-audio', false);
      isActive.value = false;
      mainRecognizer.value = null;
      if(isListeningForWakeWord.value) emit('is-listening-for-wake-word', false);
      isListeningForWakeWord.value = false;
      vadRecognizer.value = null;
  }

  // Force state to IDLE. This is the most crucial step for allowing recovery.
  state.value = 'IDLE';

  if (errorCode !== 'no-speech' && errorCode !== 'aborted') {
    emit('error', {
      type: 'speech',
      message: `Speech recognition error on ${recognizerType} recognizer: ${errorCode}`,
      code: errorCode,
    });
     if (errorCode === 'audio-capture' || errorCode === 'network' || errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
        toast?.add({type: 'error', title: `Mic/Service Error (${errorCode})`, message: `Please check your microphone, permissions, or network.`, duration: 6000});
    }
  } else if (errorCode === 'aborted') {
      // console.log(`[BSH] Recognition aborted (${recognizerType}). This might be intentional or due to rapid stop/start.`);
  }

  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
    if (isContinuousMode.value || isVoiceActivationMode.value) {
      if (state.value === 'IDLE') { // Confirm state is now IDLE before scheduling restart
        // console.log(`[BSH] Error (${errorCode}) on ${recognizerType}. State is IDLE. Scheduling restart.`);
        scheduleRestart(`error_handled_reinit_${recognizerType}_${errorCode}`);
      } else {
         // console.log(`[BSH] Error (${errorCode}) on ${recognizerType}. State is ${state.value} (not IDLE after error handling). Not scheduling immediate restart.`);
      }
    }
  } else {
    //  console.log(`[BSH] Error (${errorCode}) on ${recognizerType}. Not restarting (mic/LLM state). MicPerm: ${props.currentMicPermission}, LLM Busy: ${props.parentIsProcessingLLM}`);
  }
}

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode === oldMode) return;
  // console.log(`[BSH] audioInputMode prop changed: ${oldMode} -> ${newMode}. Reinitializing.`);
  if (oldMode === 'push-to-talk' && finalTranscriptPTT.value.trim()) {
    emit('transcription', finalTranscriptPTT.value.trim());
  }
  finalTranscriptPTT.value = '';
  if (oldMode === 'continuous' && pendingContinuousTranscript.value.trim()) {
    if(props.settings.continuousModeAutoSend) {
        emit('transcription', pendingContinuousTranscript.value.trim());
    }
  }
  pendingContinuousTranscript.value = '';
  await reinitialize();
});

watch(() => props.parentIsProcessingLLM, async (isProcessing, wasProcessing) => {
  if (isProcessing === wasProcessing) return;
  // console.log(`[BSH] parentIsProcessingLLM prop changed: ${wasProcessing} -> ${isProcessing}. Current state: ${state.value}`);
  if (isProcessing) {
    // console.log('[BSH] Parent LLM processing started. Stopping all STT activity forcefully (abort).');
    await _stopAllInternal(true);
  } else {
    if (state.value === 'IDLE' && props.currentMicPermission === 'granted') {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        // console.log('[BSH] Parent LLM finished. State is IDLE. Attempting to restart STT for continuous/VAD mode.');
        await nextTick();
        startListening();
      }
    } else {
        // console.log(`[BSH] Parent LLM finished, but not restarting STT. State: ${state.value}, MicPerm: ${props.currentMicPermission}`);
    }
  }
});

watch(() => props.currentMicPermission, async (newPerm, oldPerm) => {
  if (newPerm === oldPerm) return;
  // console.log(`[BSH] currentMicPermission prop changed: ${oldPerm} -> ${newPerm}. Current state: ${state.value}`);
  if (newPerm !== 'granted') {
    // console.log('[BSH] Mic permission not granted (or revoked/error). Stopping all STT activity.');
    await _stopAllInternal(true);
  } else if (newPerm === 'granted' && oldPerm !== 'granted') {
    if (state.value === 'IDLE' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        // console.log('[BSH] Mic permission newly granted. Auto-starting continuous/VAD mode.');
        await nextTick();
        startListening();
      }
    }
  }
});

watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang) {
    // console.log(`[BSH] speechLanguage setting changed: ${oldLang} -> ${newLang}. Reinitializing.`);
    await reinitialize();
  }
});

watch(() => [props.settings.vadWakeWordsBrowserSTT, props.settings.continuousModeAutoSend, props.settings.continuousModePauseTimeoutMs, props.settings.vadSilenceTimeoutMs], () => {
    if(state.value !== 'IDLE') {
        // console.log("[BSH] Watched STT behavioral settings changed. Reinitializing active session.");
        reinitialize();
    }
}, {deep: true});

onMounted(() => {
  if (typeof window !== 'undefined') {
    SpeechRecognitionAPI.value = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  } else {
    SpeechRecognitionAPI.value = null;
  }
  // console.log('[BSH] Component Mounted. Mode:', props.audioInputMode, 'SpeechAPI Available:', !!SpeechRecognitionAPI.value);
  const apiExposed: BrowserSpeechHandlerApi = {
    startListening,
    stopListening,
    reinitialize,
    stopAll,
    isActive,
    isListeningForWakeWord,
    hasPendingTranscript,
    pendingContinuousTranscript,
    clearPendingTranscript: () => { pendingContinuousTranscript.value = ''; },
  };
  emit('handler-api-ready', apiExposed);
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && state.value === 'IDLE') {
    if (isContinuousMode.value || isVoiceActivationMode.value) {
      // console.log('[BSH] Mounted: Auto-starting listening for VAD/Continuous due to initial props.');
      startListening();
    }
  } else {
    //  console.log(`[BSH] Mounted: Not auto-starting. MicPerm: ${props.currentMicPermission}, LLM Processing: ${props.parentIsProcessingLLM}, State: ${state.value}`);
  }
});

onBeforeUnmount(async () => {
  // console.log('[BSH] Component Unmounting. Stopping all recognition.');
  await _stopAllInternal(true);
  mainRecognizer.value = null;
  vadRecognizer.value = null;
  emit('unmounted');
});

export interface BrowserSpeechHandlerApi {
  startListening: (forVadCommand?: boolean) => Promise<void>;
  stopListening: (abort?: boolean) => Promise<void>;
  reinitialize: () => Promise<void>;
  stopAll: (abort?: boolean) => Promise<void>;
  isActive: Ref<boolean>;
  isListeningForWakeWord: Ref<boolean>;
  hasPendingTranscript: ComputedRef<boolean>;
  pendingContinuousTranscript: Ref<string>;
  clearPendingTranscript: () => void;
}

</script>