// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
/**
 * @file BrowserSpeechHandler.vue
 * @description Vue 3 Composition API component for handling browser-based SpeechRecognition (Web Speech API).
 * Manages two recognizer instances for VAD wake-word and main speech capture.
 * Handles complex state transitions, error recovery, and exposes a consistent API.
 *
 * @component BrowserSpeechHandler
 * @version 4.4.0 - Improved VAD command capture, Firefox continuous mode robustness,
 * and clearer state management regarding parentIsProcessingLLM.
 */
<template>
  <!-- Minimal template to satisfy Vue compiler for setup-only component -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, nextTick, readonly } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import type { SttHandlerInstance } from '../composables/useSttHandlerManager';

// --- Ambient Type Declarations for Web Speech API ---
interface CustomSpeechRecognitionEventMap extends EventListenerObject { audiostart: Event; audioend: Event; end: Event; error: CustomSpeechRecognitionErrorEvent; nomatch: CustomSpeechRecognitionEvent; result: CustomSpeechRecognitionEvent; soundstart: Event; soundend: Event; speechstart: Event; speechend: Event; start: Event; }
interface CustomSpeechRecognition extends EventTarget { grammars: CustomSpeechGrammarList; lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; serviceURI?: string; start(): void; stop(): void; abort(): void; onaudiostart: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onaudioend: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onend: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onerror: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionErrorEvent) => any) | null; onnomatch: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEvent) => any) | null; onresult: ((this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEvent) => any) | null; onsoundstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onsoundend: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onspeechstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onspeechend: ((this: CustomSpeechRecognition, ev: Event) => any) | null; onstart: ((this: CustomSpeechRecognition, ev: Event) => any) | null; addEventListener<K extends keyof CustomSpeechRecognitionEventMap>( type: K, listener: (this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions ): void; removeEventListener<K extends keyof CustomSpeechRecognitionEventMap>( type: K, listener: (this: CustomSpeechRecognition, ev: CustomSpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions ): void; }
interface CustomSpeechRecognitionStatic { prototype: CustomSpeechRecognition; new (): CustomSpeechRecognition; }
const WindowSpeechRecognition: CustomSpeechRecognitionStatic | undefined = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;
interface CustomSpeechGrammar { src: string; weight?: number; }
interface CustomSpeechGrammarList { readonly length: number; addFromString(string: string, weight?: number): void; addFromURI(src: string, weight?: number): void; item(index: number): CustomSpeechGrammar; [index: number]: CustomSpeechGrammar; }
interface CustomSpeechRecognitionAlternative { readonly transcript: string; readonly confidence: number; }
interface CustomSpeechRecognitionResult { readonly isFinal: boolean; readonly length: number; item(index: number): CustomSpeechRecognitionAlternative; [index: number]: CustomSpeechRecognitionAlternative; }
interface CustomSpeechRecognitionResultList { readonly length: number; item(index: number): CustomSpeechRecognitionResult; [index: number]: CustomSpeechRecognitionResult; }
interface CustomSpeechRecognitionEvent extends Event { readonly resultIndex: number; readonly results: CustomSpeechRecognitionResultList; readonly emma: Document | null; readonly interpretation: any; }
type CustomSpeechRecognitionErrorCode = "no-speech" | "aborted" | "audio-capture" | "network" | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";
interface CustomSpeechRecognitionErrorEvent extends Event { readonly error: CustomSpeechRecognitionErrorCode; readonly message: string; }
// --- END: Ambient Type Declarations ---

const props = defineProps<{
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean; // Critical for deciding STT behavior
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

type RecognitionState = | 'IDLE' | 'STARTING_MAIN' | 'MAIN_ACTIVE' | 'STARTING_VAD_WAKE' | 'VAD_WAKE_LISTENING' | 'TRANSITIONING_VAD_TO_MAIN' | 'STOPPING';
const state = ref<RecognitionState>('IDLE');
const mainRecognizer = ref<CustomSpeechRecognition | null>(null);
const vadRecognizer = ref<CustomSpeechRecognition | null>(null);
const isVadStoppingForTransitionIntent = ref(false);
const activeStopReason = ref<string | null>(null);

const isActive = ref(false); // True if mainRecognizer is active (capturing command/dictation)
const isListeningForWakeWord = ref(false); // True if vadRecognizer is active

const pendingContinuousTranscript = ref(''); // Used for interim results for UI
const hasPendingTranscript = computed<boolean>(() => !!pendingContinuousTranscript.value.trim());

let recognizerStartTime = 0;
let lastTranscriptionEmitTime = 0;
let continuousTranscriptBuffer = ''; // For accumulating final segments in continuous mode
let finalTranscriptPTT = ''; // For PTT mode final transcript
let vadCommandSilenceTimer: number | null = null;
let restartDebounceTimer: number | null = null;
let continuousEmitDebounceTimer: number | null = null;

const RESTART_DEBOUNCE_MS = 1500; // Adjusted for potentially faster recovery if appropriate
const WARM_UP_PERIOD_MS = 250;
const MIN_TRANSCRIPT_LENGTH_FOR_EMIT = 1;
const CONTINUOUS_EMIT_DEBOUNCE_MS = 200;
const VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT = 3000;

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');

function detachEventHandlers(recognizer: CustomSpeechRecognition | null): void { if (recognizer) { recognizer.onstart = null; recognizer.onresult = null; recognizer.onerror = null; recognizer.onend = null; recognizer.onaudiostart = null; recognizer.onaudioend = null; recognizer.onsoundstart = null; recognizer.onsoundend = null; recognizer.onspeechstart = null; recognizer.onspeechend = null; recognizer.onnomatch = null; } }

function createRecognizer(forWakeWord: boolean = false): CustomSpeechRecognition | null {
  if (!SpeechRecognitionAPIConstructor.value) {
    console.error('[BSH] SpeechRecognition API constructor not available.');
    emit('error', { type: 'init', message: 'Web Speech API not supported.', code: 'api-not-supported' });
    return null;
  }
  try {
    const recognizer = new SpeechRecognitionAPIConstructor.value();
    recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
    if (forWakeWord) {
      recognizer.continuous = true; // VAD wake needs to be continuous
      recognizer.interimResults = false; // No interim for VAD wake
    } else {
      // For main recognizer:
      // PTT: continuous=false, interim=true (want results as you speak, one final on release)
      // Continuous: continuous=true, interim=true
      // VAD Command: continuous=false, interim=true (single command phrase)
      recognizer.continuous = isContinuousMode.value;
      recognizer.interimResults = true;
    }
    recognizer.maxAlternatives = 1;
    console.log(`[BSH] Created recognizer (forWakeWord: ${forWakeWord}). Lang: ${recognizer.lang}, Continuous: ${recognizer.continuous}, Interim: ${recognizer.interimResults}`);
    return recognizer;
  } catch (e: any) {
    console.error("[BSH] Error constructing SpeechRecognition instance:", e.name, e.message);
    emit('error', { type: 'init', message: `Failed to create SpeechRecognition: ${e.message}`, code: 'init-failed' });
    return null;
  }
}

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

function isValidTranscript(transcript: string): boolean { if (!transcript || transcript.trim().length < MIN_TRANSCRIPT_LENGTH_FOR_EMIT) return false; const cleaned = transcript.trim().toLowerCase(); const spuriousPatterns = ['[', ']', '(', ')', 'hmm', 'uh', 'um', '.', ',', '?', '!']; if (spuriousPatterns.some(pattern => cleaned === pattern && cleaned.length <= 3)) return false; if (/^[^\w\s]+$/.test(cleaned)) return false; return true; }

function debouncedEmitContinuousTranscript(transcript: string) {
  if (!transcript.trim()) return;
  if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer);
  continuousEmitDebounceTimer = window.setTimeout(() => {
    if (isValidTranscript(transcript)) {
      const now = Date.now();
      if (now - lastTranscriptionEmitTime > 500) {
        console.log(`[BSH] Emitting continuous transcript: "${transcript}"`);
        emit('transcription', transcript.trim());
        lastTranscriptionEmitTime = now;
        continuousTranscriptBuffer = '';
      } else {
        console.warn(`[BSH] Continuous emit skipped (rate limit). Buffered: "${transcript}"`);
      }
    }
    continuousEmitDebounceTimer = null;
  }, CONTINUOUS_EMIT_DEBOUNCE_MS);
}

function initMainRecognizer(): boolean {
  if (mainRecognizer.value) { detachEventHandlers(mainRecognizer.value); try { mainRecognizer.value.abort(); } catch(e){} mainRecognizer.value = null; }
  const recognizer = createRecognizer(false);
  if (!recognizer) { state.value = 'IDLE'; _updateReactiveStates(state.value); return false; }

  recognizer.onstart = () => {
    if (mainRecognizer.value !== recognizer || (state.value !== 'STARTING_MAIN' && state.value !== 'TRANSITIONING_VAD_TO_MAIN')) {
      console.warn(`[BSH] Main onstart: Mismatch/unexpected state. Current: ${state.value}, Expected STARTING_MAIN or TRANSITIONING_VAD_TO_MAIN.`);
      return;
    }
    console.log('[BSH] Main recognizer started.');
    state.value = 'MAIN_ACTIVE';
    _updateReactiveStates(state.value);
    pendingContinuousTranscript.value = '';
    continuousTranscriptBuffer = '';
    recognizerStartTime = Date.now();
    if (isPttMode.value) finalTranscriptPTT = '';
  };

  recognizer.onresult = (event: CustomSpeechRecognitionEvent) => {
    if (mainRecognizer.value !== recognizer || state.value !== 'MAIN_ACTIVE') return;
    const timeSinceStart = Date.now() - recognizerStartTime;
    if (timeSinceStart < WARM_UP_PERIOD_MS && !event.results[event.results.length - 1].isFinal) {
      // console.log(`[BSH] Main onresult: Ignoring interim during warm-up.`);
      return;
    }
    // If LLM is busy, and this is NOT VAD command capture, ignore.
    // VAD command capture should proceed to get the command out.
    if (props.parentIsProcessingLLM && !(isVoiceActivationMode.value && state.value === 'MAIN_ACTIVE')) {
      console.log('[BSH] Main onresult: LLM busy, ignoring for non-VAD-command. Aborting main.');
       _stopListeningInternal(true, 'main', 'llm_busy_main_non_vad');
      return;
    }

    let currentInterim = '';
    let currentFinal = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) currentFinal += event.results[i][0].transcript;
      else currentInterim += event.results[i][0].transcript;
    }

    if (isContinuousMode.value) {
      if (currentInterim.trim()) pendingContinuousTranscript.value = currentInterim;
      if (currentFinal.trim()) {
        const seg = currentFinal.trim();
        continuousTranscriptBuffer += (continuousTranscriptBuffer ? ' ' : '') + seg;
        debouncedEmitContinuousTranscript(continuousTranscriptBuffer);
        pendingContinuousTranscript.value = pendingContinuousTranscript.value.replace(seg, '').trim() || '';
      }
    } else { // PTT or VAD Command Mode
      if (currentFinal.trim()) {
        const final = currentFinal.trim();
        if (isPttMode.value) {
          finalTranscriptPTT += (finalTranscriptPTT ? ' ' : '') + final;
          pendingContinuousTranscript.value = finalTranscriptPTT;
        } else if (isVoiceActivationMode.value && isValidTranscript(final)) {
          console.log(`[BSH] VAD Command captured: "${final}"`);
          emit('transcription', final);
          // VAD command successfully captured, stop this main recognition.
          // Its onend will handle transitioning back to VAD wake listening.
          _stopListeningInternal(false, 'main', 'vad_command_captured_final');
        }
      } else if (currentInterim.trim()) {
        pendingContinuousTranscript.value = (isPttMode.value ? finalTranscriptPTT : '') + ((isPttMode.value && finalTranscriptPTT) ? ' ' : '') + currentInterim;
      }
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

    if (!wasThisInstance && mainRecognizer.value !== null) { console.log('[BSH] Main onend: Stale.'); return; }
    if (wasThisInstance) { detachEventHandlers(recognizer); mainRecognizer.value = null; }

    if (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN') {
      if (isActive.value) { // Ensure reactive state is updated if it was active
        isActive.value = false;
        console.log(`[BSH] Main onend: Emitting processing-audio: false.`);
        emit('processing-audio', false);
      }
    }
    // Only transition to IDLE if not part of a VAD transition or stopping sequence
    if (state.value !== 'STARTING_VAD_WAKE' && state.value !== 'VAD_WAKE_LISTENING' && state.value !== 'STOPPING' && state.value !== 'TRANSITIONING_VAD_TO_MAIN') {
      if (state.value !== 'IDLE') state.value = 'IDLE';
    }

    if (isPttMode.value && finalTranscriptPTT.trim() && isValidTranscript(finalTranscriptPTT)) {
      emit('transcription', finalTranscriptPTT.trim());
    }
    if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer);
    if (isContinuousMode.value && continuousTranscriptBuffer.trim() && isValidTranscript(continuousTranscriptBuffer) && reason !== 'api_stop_all_command' && reason !== 'api_reinitialize_command' && !reason?.startsWith('error_handling_')) {
      emit('transcription', continuousTranscriptBuffer.trim());
    }
    finalTranscriptPTT = ''; pendingContinuousTranscript.value = ''; continuousTranscriptBuffer = '';

    // Auto-restart logic:
    // This must not fight with the manager's reinitialization logic.
    // If manager is stopping us due to LLM state, we should not auto-restart.
    const shouldHandlerAttemptRestart = reason === null || // Natural end of speech segment
                                         (reason === 'vad_command_captured_final' && isVoiceActivationMode.value) || // VAD command done, restart VAD wake
                                         (reason?.startsWith('no_speech_recovery_') && !props.parentIsProcessingLLM); // Recover from no-speech if LLM idle

    if (shouldHandlerAttemptRestart && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value && (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN')) {
        console.log("[BSH] Main onend: Continuous mode, scheduling restart.");
        scheduleRestart('main_continuous_natural_end');
      } else if (isVoiceActivationMode.value && (prevState === 'MAIN_ACTIVE' || prevState === 'STARTING_MAIN' || prevState === 'TRANSITIONING_VAD_TO_MAIN' || reason === 'vad_command_captured_final')) {
        console.log("[BSH] Main onend: VAD mode (after command or main ended), scheduling VAD wake restart.");
        scheduleRestart('vad_wake_after_command_main_ended'); // This will start VAD wake listening
      }
    } else {
      console.log(`[BSH] Main onend: No auto-restart by handler. Reason: ${reason}, State: ${state.value}, LLMBusy: ${props.parentIsProcessingLLM}`);
    }
    _updateReactiveStates(state.value);
  };
  mainRecognizer.value = recognizer;
  return true;
}

function initVadRecognizer(): boolean {
  if (vadRecognizer.value) { detachEventHandlers(vadRecognizer.value); try { vadRecognizer.value.abort(); } catch(e){} vadRecognizer.value = null; }
  const recognizer = createRecognizer(true);
  if (!recognizer) { state.value = 'IDLE'; _updateReactiveStates(state.value); return false; }

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
    if (timeSinceStart < WARM_UP_PERIOD_MS) { /* console.log(`[BSH] VAD onresult: Ignoring during warm-up.`); */ return; }

    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) transcript += event.results[i][0].transcript;
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
      emit('wake-word-detected'); // Inform manager
      // Manager will call startListening(true) which will handle stopping VAD and starting MAIN
      // For now, just stop VAD cleanly here to allow transition.
       _stopListeningInternal(true, 'vad', 'wake_word_detected_transition');
    }
  };

  recognizer.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
    if (vadRecognizer.value !== recognizer && vadRecognizer.value !== null) { console.warn('[BSH] VAD onerror: Stale event.'); return; }
    const wasIntentional = event.error === 'aborted' && isVadStoppingForTransitionIntent.value;
    if (vadRecognizer.value === recognizer) isVadStoppingForTransitionIntent.value = false; // Reset flag after checking
    console.error(`[BSH] VAD error: ${event.error}, Intentional: ${wasIntentional}, State: ${state.value}`);
    if (wasIntentional) {
      console.log('[BSH] VAD aborted as expected for transition.');
      if (vadRecognizer.value === recognizer) { detachEventHandlers(recognizer); vadRecognizer.value = null; }
      // `onend` will be called, which should lead to starting the main recognizer via manager's `startListening(true)` call path.
      return;
    }
    handleError(event.error, 'vad', event.message);
  };

  recognizer.onend = () => {
    console.log(`[BSH] VAD onend. State: ${state.value}, StopReason: ${activeStopReason.value}, IntentionalTransitionFlag: ${isVadStoppingForTransitionIntent.value}`);
    const wasIntentionalTrans = isVadStoppingForTransitionIntent.value;
    if (vadRecognizer.value === recognizer || !vadRecognizer.value) isVadStoppingForTransitionIntent.value = false;

    const wasThisInstance = vadRecognizer.value === recognizer;
    const prevState = state.value;
    const reason = activeStopReason.value;
    activeStopReason.value = null;

    if (!wasThisInstance && vadRecognizer.value !== null) { console.log('[BSH] VAD onend: Stale event.'); return; }
    if (wasThisInstance) { detachEventHandlers(recognizer); vadRecognizer.value = null; }

    if (isListeningForWakeWord.value) {
      isListeningForWakeWord.value = false;
      console.log(`[BSH] VAD onend: Emitting is-listening-for-wake-word: false.`);
      emit('is-listening-for-wake-word', false);
    }

    if (prevState === 'TRANSITIONING_VAD_TO_MAIN' || wasIntentionalTrans) {
      console.log('[BSH] VAD onend: Post wake word. Manager should handle starting main STT if not already.');
      // state should ideally become STARTING_MAIN or MAIN_ACTIVE due to manager call. If not, reset.
      if (state.value !== 'STARTING_MAIN' && state.value !== 'MAIN_ACTIVE' && state.value !== 'STOPPING' && state.value !== 'IDLE') {
        state.value = 'IDLE';
      }
      // If main didn't start (e.g. LLM busy), and we are now IDLE, schedule VAD restart.
      if (state.value === 'IDLE' && isVoiceActivationMode.value && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
        scheduleRestart('vad_wake_after_failed_main_start');
      }
    } else if ((reason === null || reason.startsWith('no_speech_recovery_')) && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && isVoiceActivationMode.value) {
      if(state.value !== 'IDLE') state.value = 'IDLE';
      scheduleRestart('vad_wake_natural_end_or_no_speech_v2');
    } else {
      console.log(`[BSH] VAD onend: No auto-restart by handler. Reason: ${reason}, State: ${state.value}`);
      if(state.value !== 'IDLE' && state.value !== 'STOPPING') state.value = 'IDLE';
    }
    _updateReactiveStates(state.value);
  };
  vadRecognizer.value = recognizer;
  return true;
}

function clearAllTimers(): void { if (vadCommandSilenceTimer) clearTimeout(vadCommandSilenceTimer); vadCommandSilenceTimer = null; if (restartDebounceTimer) clearTimeout(restartDebounceTimer); restartDebounceTimer = null; if (continuousEmitDebounceTimer) clearTimeout(continuousEmitDebounceTimer); continuousEmitDebounceTimer = null; }
function clearAllTranscripts(): void { finalTranscriptPTT = ''; pendingContinuousTranscript.value = ''; continuousTranscriptBuffer = ''; }
function clearRestartDebounceTimer(): void { if (restartDebounceTimer) { clearTimeout(restartDebounceTimer); restartDebounceTimer = null; } }

async function startListening(forVadCommandCapture: boolean = false): Promise<void | boolean> {
  console.log(`[BSH] API startListening called. VADCommandCapture: ${forVadCommandCapture}, CurrentState: ${state.value}, Mode: ${props.audioInputMode}, LLMBusy: ${props.parentIsProcessingLLM}`);
  if (!SpeechRecognitionAPIConstructor.value) {
    emit('error', { type: 'init', message: 'Web Speech API not available to start.', code: 'api-not-available-start' });
    return false;
  }
  activeStopReason.value = null;
  clearRestartDebounceTimer();

  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: 'Mic permission not granted for startListening.', code: 'mic-permission-denied' });
    return false;
  }

  // If LLM is busy, only allow VAD WAKE listening to start/continue.
  // VAD COMMAND capture should also be allowed to start if LLM just became busy due to ITS OWN wake word.
  // This nuance is handled by useSttHandlerManager's `isAwaitingVadCommandResult` flag.
  // Here, we simplify: if LLM is busy and we're not trying to start VAD WAKE, block.
  if (props.parentIsProcessingLLM && !forVadCommandCapture && !isVoiceActivationMode.value) {
      console.log(`[BSH] startListening blocked: LLM busy and not starting VAD wake.`);
      return false;
  }
  if (props.parentIsProcessingLLM && forVadCommandCapture) {
      console.log(`[BSH] startListening for VAD command: LLM busy, proceeding as this is likely the command causing LLM to be busy.`);
  }


  // Stop conflicting activity
  const currentRecState = state.value;
  if (forVadCommandCapture) { // Trying to start MAIN for command
    if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') {
      console.log("[BSH] startListening(true): Stopping VAD to start MAIN for command.");
      await _stopListeningInternal(true, 'vad', 'switch_vad_to_main_cmd_v3');
    } else if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') return true;
  } else if (isVoiceActivationMode.value) { // Trying to start VAD_WAKE
    if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') {
      console.log("[BSH] startListening(false, VAD mode): Stopping MAIN to start VAD_WAKE.");
      await _stopListeningInternal(true, 'main', 'switch_main_to_vad_wake_v3');
    } else if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') return true;
  } else { // Trying to start MAIN for PTT/Continuous
    if (currentRecState === 'VAD_WAKE_LISTENING' || currentRecState === 'STARTING_VAD_WAKE') {
      console.log(`[BSH] startListening(false, ${props.audioInputMode} mode): Stopping VAD to start MAIN.`);
      await _stopListeningInternal(true, 'vad', 'switch_vad_to_main_other_v3');
    } else if (currentRecState === 'MAIN_ACTIVE' || currentRecState === 'STARTING_MAIN') return true;
  }

  if (state.value !== 'IDLE') { // Ensure we are IDLE before starting a new recognizer
    console.log(`[BSH] startListening: State ${state.value} not IDLE after stopping conflicts. Forcing stopAll.`);
    await _stopAllInternal(true, "force_idle_before_start_v5");
    // @ts-ignore
    if (state.value !== 'IDLE') {
        console.error(`[BSH] CRITICAL: State still ${state.value} after stopAll. Forcing IDLE.`);
        state.value = 'IDLE';
    }
  }
  _updateReactiveStates(state.value); // Reflect IDLE state if changed
  clearAllTimers();
  let success = false;

  if (isVoiceActivationMode.value && !forVadCommandCapture) {
    state.value = 'STARTING_VAD_WAKE';
    _updateReactiveStates(state.value);
    if (initVadRecognizer() && vadRecognizer.value) {
      try { vadRecognizer.value.start(); success = true; console.log('[BSH] VAD wake recognizer.start() OK.'); }
      catch (e: any) { console.error('[BSH] Err start VAD wake:', e); handleError(e.name === 'InvalidStateError' ? 'aborted' : (e.error || 'start_error'), 'vad', e.message); }
    } else { console.error('[BSH] VAD init failed.'); state.value = 'IDLE'; _updateReactiveStates(state.value); }
  } else { // MAIN Recognizer (PTT, Continuous, or VAD Command)
    state.value = 'STARTING_MAIN';
    _updateReactiveStates(state.value);
    if (initMainRecognizer() && mainRecognizer.value) {
      try { mainRecognizer.value.start(); success = true; console.log('[BSH] Main recognizer.start() OK.'); }
      catch (e: any) { console.error('[BSH] Err start MAIN:', e); handleError(e.name === 'InvalidStateError' ? 'aborted' : (e.error || 'start_error'), 'main', e.message); }
      if (forVadCommandCapture && isVoiceActivationMode.value && success) {
        clearVadCommandSilenceTimer();
        vadCommandSilenceTimer = window.setTimeout(() => {
          if (state.value === 'MAIN_ACTIVE' && mainRecognizer.value) {
            console.log('[BSH] VAD command silence timeout. Stopping main recognizer.');
            _stopListeningInternal(false, 'main', 'vad_cmd_silence_timeout_v2');
          }
        }, props.settings.vadSilenceTimeoutMs || VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT);
      }
    } else { console.error('[BSH] Main init failed.'); state.value = 'IDLE'; _updateReactiveStates(state.value); }
  }
  return success;
}

function clearVadCommandSilenceTimer(): void { if (vadCommandSilenceTimer) { clearTimeout(vadCommandSilenceTimer); vadCommandSilenceTimer = null; } }

async function _stopListeningInternal(abort: boolean = false, recognizerType: 'main' | 'vad', reason: string = "unknown"): Promise<void> { activeStopReason.value = reason; const recognizerRef = recognizerType === 'main' ? mainRecognizer : vadRecognizer; const currentRecognizerInstance = recognizerRef.value; if (!currentRecognizerInstance || (state.value === 'IDLE' && !isActive.value && !isListeningForWakeWord.value)) { activeStopReason.value = null; return; } console.log(`[BSH] _stopListeningInternal (${recognizerType}, ${reason}). Abort: ${abort}. State: ${state.value}`); if (state.value !== 'STOPPING') { state.value = 'STOPPING'; } try { if (abort) currentRecognizerInstance.abort(); else currentRecognizerInstance.stop(); console.log(`[BSH] ${recognizerType} ${abort ? 'abort()' : 'stop()'} called.`); } catch (e: any) { console.warn(`[BSH] Err during ${recognizerType} stop/abort:`, e); if (recognizerRef.value === currentRecognizerInstance) { detachEventHandlers(currentRecognizerInstance); recognizerRef.value = null; if (recognizerType === 'main' && isActive.value) { isActive.value = false; emit('processing-audio', false); } if (recognizerType === 'vad' && isListeningForWakeWord.value) { isListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); } } if (!mainRecognizer.value && !vadRecognizer.value && state.value === 'STOPPING') { state.value = 'IDLE'; _updateReactiveStates(state.value); } } }
async function _stopAllInternal(abort: boolean = true, reason: string = "unknown"): Promise<void> { console.log(`[BSH] _stopAllInternal. Abort: ${abort}, Reason: ${reason}, State: ${state.value}`); activeStopReason.value = reason; const initialHandlerState = state.value; if (initialHandlerState === 'IDLE' && !mainRecognizer.value && !vadRecognizer.value && !isActive.value && !isListeningForWakeWord.value) { _updateReactiveStates('IDLE'); activeStopReason.value = null; return; } state.value = 'STOPPING'; clearAllTimers(); const mainRec = mainRecognizer.value; const vadRec = vadRecognizer.value; if (mainRec) { detachEventHandlers(mainRec); mainRecognizer.value = null; try { if (abort) mainRec.abort(); else mainRec.stop(); } catch (e) { console.warn('[BSH] Err stopping mainRec in stopAll:', e); } } if (vadRec) { detachEventHandlers(vadRec); vadRecognizer.value = null; try { if (abort) vadRec.abort(); else vadRec.stop(); } catch (e) { console.warn('[BSH] Err stopping vadRec in stopAll:', e); } } state.value = 'IDLE'; _updateReactiveStates(state.value); clearAllTranscripts(); console.log(`[BSH] _stopAllInternal COMPLETED (Reason: ${reason}, FromState: ${initialHandlerState}). Handler forced IDLE.`); activeStopReason.value = null; }

async function stopListeningAPI(abort: boolean = false): Promise<void> { await _stopAllInternal(abort, 'api_stop_listening_v3'); }
async function reinitialize(): Promise<void> { console.log('[BSH] API reinitialize called.'); await _stopAllInternal(true, 'api_reinitialize_command_v3'); await nextTick(); }
async function stopAllAPI(abort: boolean = true): Promise<void> { await _stopAllInternal(abort, 'api_stop_all_command_v3'); }
function clearPendingTranscript(): void { pendingContinuousTranscript.value = ''; }

function scheduleRestart(reason: string): void {
  clearRestartDebounceTimer();
  // Add extra check: if LLM is busy, generally don't schedule restart unless specific VAD scenario.
  // This is a safeguard, as the manager also checks this.
  if (props.parentIsProcessingLLM && !reason.includes('vad_wake')) {
      console.log(`[BSH] scheduleRestart for "${reason}" blocked: LLM is processing.`);
      return;
  }
  console.log(`[BSH] Scheduling restart: ${reason}. Debounce: ${RESTART_DEBOUNCE_MS}. Current State: ${state.value}`);
  restartDebounceTimer = window.setTimeout(async () => { // Make callback async
    console.log(`[BSH] Debounced restart for: ${reason}. State before attempt: ${state.value}`);
    if (state.value === 'IDLE' && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value) {
        console.log('[BSH] Debounced restart: Continuous mode.');
        await startListening(false);
      } else if (isVoiceActivationMode.value) {
        console.log('[BSH] Debounced restart: VAD mode (starting wake listening).');
        await startListening(false); // This starts VAD wake listening
      } else { /* PTT does not auto-restart */ }
    } else {
      console.log(`[BSH] Debounced restart ABORTED for "${reason}". Conditions not met. State: ${state.value}, Mic: ${props.currentMicPermission}, LLM: ${props.parentIsProcessingLLM}`);
    }
  }, RESTART_DEBOUNCE_MS);
}

function handleError(errorCode: CustomSpeechRecognitionErrorCode, recognizerType: 'main' | 'vad', message?: string): void { const stateWhenError = state.value; console.error(`[BSH] handleError: ${recognizerType} code: ${errorCode}, msg: ${message || 'N/A'}, StateOnError: ${stateWhenError}`); activeStopReason.value = `error_${recognizerType}_${errorCode}`; clearRestartDebounceTimer(); if (errorCode === 'no-speech') { console.log(`[BSH] 'no-speech' error (${recognizerType}). Allowing onend or scheduling recovery.`); emit('error', { type: 'speech_recognition', message: `STT Info (${recognizerType}): ${errorCode} - ${message || ''}`, code: errorCode }); if (recognizerType === 'main' && isActive.value) { isActive.value = false; emit('processing-audio', false); } if (recognizerType === 'vad' && isListeningForWakeWord.value) { isListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); } if (state.value === 'MAIN_ACTIVE' || state.value === 'VAD_WAKE_LISTENING' || state.value === 'STARTING_MAIN' || state.value === 'STARTING_VAD_WAKE') { state.value = 'IDLE'; } _updateReactiveStates(state.value); if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) { if ((isContinuousMode.value && recognizerType === 'main') || (isVoiceActivationMode.value)) { scheduleRestart(`no_speech_recovery_v3_${recognizerType}`); } } return; } _stopAllInternal(true, `error_handling_critical_${recognizerType}_${errorCode}_v5`); emit('error', { type: 'speech_recognition', message: `STT Error (${recognizerType}): ${errorCode} - ${message || ''}`, code: errorCode }); if (['audio-capture', 'network', 'not-allowed', 'service-not-allowed'].includes(errorCode)) { toast?.add({ type: 'error', title: `Mic/Service Error (${errorCode})`, message: `STT failed. Check mic/permissions.`, duration: 7000 }); } if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) { if (errorCode !== 'not-allowed' && errorCode !== 'service-not-allowed' && errorCode !== 'aborted') { if (isContinuousMode.value || isVoiceActivationMode.value) { scheduleRestart(`critical_error_recovery_v3_${recognizerType}_${errorCode}`); } } } }

// --- Watchers ---
watch(() => props.audioInputMode, async (newMode, oldMode) => { if (newMode === oldMode || !SpeechRecognitionAPIConstructor.value) return; console.log(`[BSH] audioInputMode changed: ${oldMode} -> ${newMode}. Reinitializing.`); await reinitialize(); });
watch(() => props.parentIsProcessingLLM, async (isProcessing) => { if (!SpeechRecognitionAPIConstructor.value) return; console.log(`[BSH] parentIsProcessingLLM -> ${isProcessing}. State: ${state.value}`); clearRestartDebounceTimer(); if (isProcessing) { if (state.value !== 'VAD_WAKE_LISTENING' && state.value !== 'STARTING_VAD_WAKE' && state.value !== 'IDLE') { await _stopAllInternal(true, 'llm_processing_started_v4'); } } else { if (state.value === 'IDLE' && (isContinuousMode.value || isVoiceActivationMode.value) && props.currentMicPermission === 'granted') { scheduleRestart('llm_processing_finished_v4'); } } });
watch(() => props.currentMicPermission, async (newPerm, oldPerm) => { if (newPerm === oldPerm || !SpeechRecognitionAPIConstructor.value) return; console.log(`[BSH] MicPerm changed: ${oldPerm} -> ${newPerm}. State: ${state.value}`); clearRestartDebounceTimer(); if (newPerm !== 'granted') { if (state.value !== 'IDLE' && state.value !== 'STOPPING') { await _stopAllInternal(true, 'mic_perm_lost_v4'); } } else { if (state.value === 'IDLE' && (isContinuousMode.value || isVoiceActivationMode.value) && !props.parentIsProcessingLLM) { scheduleRestart('mic_perm_granted_v4'); } } });
watch(() => props.settings.speechLanguage, async (newLang, oldLang) => { if (newLang && oldLang && newLang !== oldLang && SpeechRecognitionAPIConstructor.value) { console.log(`[BSH] speechLang changed. Reinitializing.`); await reinitialize(); } });
watch(() => [props.settings.vadWakeWordsBrowserSTT, props.settings.vadSilenceTimeoutMs], async () => { if (!SpeechRecognitionAPIConstructor.value) return; if (isVoiceActivationMode.value && state.value !== 'IDLE' && state.value !== 'STOPPING') { console.log('[BSH] VAD settings changed. Reinitializing.'); await reinitialize(); } }, { deep: true });

// --- Lifecycle Hooks ---
onMounted(() => {
  SpeechRecognitionAPIConstructor.value = WindowSpeechRecognition || null;
  if (!SpeechRecognitionAPIConstructor.value) {
    console.warn("[BSH] Web Speech API not found on mount.");
    emit('error', { type: 'init', message: 'Web Speech API not supported by this browser.', code: 'api-not-found-mount' });
  }
  const apiExposed: SttHandlerInstance = { startListening, stopListening: stopListeningAPI, reinitialize, stopAll: stopAllAPI, isActive: readonly(isActive), isListeningForWakeWord: readonly(isListeningForWakeWord), hasPendingTranscript: readonly(hasPendingTranscript), pendingTranscript: readonly(pendingContinuousTranscript), clearPendingTranscript, };
  emit('handler-api-ready', apiExposed);
  console.log(`[BSH] Mounted. Initial state: ${state.value}. Web Speech API available: ${!!SpeechRecognitionAPIConstructor.value}`);
});
onBeforeUnmount(async () => { console.log('[BSH] Unmounting.'); clearAllTimers(); await _stopAllInternal(true, 'component_unmount_v5'); mainRecognizer.value = null; vadRecognizer.value = null; emit('unmounted'); });

</script>