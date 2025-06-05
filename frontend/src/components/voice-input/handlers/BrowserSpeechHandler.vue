// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
<template>
  <!-- This component does not render any DOM elements itself. -->
  <!-- Its purpose is to manage the browser's SpeechRecognition API -->
  <!-- and communicate with its parent via events and the exposed API. -->
</template>

<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @module BrowserSpeechHandler
 * @description Implements an STT (Speech-to-Text) handler using the browser's native
 * Web Speech API (SpeechRecognition). It supports various audio input modes like
 * Push-to-Talk, Continuous listening, and Voice Activity Detection (VAD) for wake words.
 * This component conforms to the SttHandlerInstance interface for integration with SttManager.
 *
 * @version 7.3.2 (Combined from 7.3.1 and 7.2.2)
 * @updated 2025-06-05 - Merged two versions, prioritizing 7.3.1's VAD command logic and
 * 7.2.2's SpeechRecognition type declarations.
 * Ensured robust pause detection and max duration for vad-command.
 * Corrected onstart, onerror, and onend handler implementations.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, readonly } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type {
  SttHandlerInstance,
  MicPermissionStatusType,
  TranscriptionData,
  SttHandlerErrorPayload
} from '../types';

// TypeScript: declare SpeechRecognition types if not present (for browser compatibility)
// These are more comprehensive and aligned with standard Web Speech API.
declare global {
  // @ts-ignore - Allow redefining existing window properties if necessary for global types
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  // @ts-ignore
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI?: string;

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
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly emma?: Document | null;
    readonly interpretation?: any;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string; // e.g., 'no-speech', 'audio-capture', 'not-allowed'
    readonly message: string;
  }

  // Minimal SpeechGrammarList for completeness, though not actively used in this handler
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    [index: number]: SpeechGrammar;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }
}


interface BrowserSpeechHandlerProps {
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean;
  currentMicPermission: MicPermissionStatusType;
}

const props = defineProps<BrowserSpeechHandlerProps>();

const emit = defineEmits<{
  (e: 'handler-ready', handlerId: 'browser', api: SttHandlerInstance): void;
  (e: 'handler-unmounted', handlerId: 'browser'): void;
  (e: 'transcription', data: TranscriptionData): void;
  (e: 'processing-audio', isProcessing: boolean): void;
  (e: 'listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: SttHandlerErrorPayload): void;
  (e: 'wake-word-detected'): void;
}>();

const recognizer = ref<SpeechRecognition | null>(null);
const isRecognizerAPISupported = ref(true); // Assume true initially, verify on mount/creation
const _isRecognizerActiveInternal = ref(false); // Tracks if recognizer.start() was called and onstart fired

type ListeningMode = 'idle' | 'vad-wake' | 'vad-command' | 'main';
const currentListeningMode = ref<ListeningMode>('idle');

// Public reactive state exposed via the API
const isActive = ref(false); // True if actively capturing for 'main' or 'vad-command'
const isListeningForWakeWord = ref(false); // True if in 'vad-wake' mode
const pendingTranscript = ref(''); // Current interim or unconfirmed final transcript
const hasPendingTranscriptInternal = computed(() => !!pendingTranscript.value.trim());

// Internal state variables
let recognizerStartTimeMs = 0;
let accumulatedTranscriptForPtt = '';
let accumulatedTranscriptForVadCommand = '';
let vadCommandPauseTimerId: number | null = null;
let vadCommandMaxDurationTimerId: number | null = null;
let autoRestartTimerId: number | null = null;
let isTransitioningStates = false; // Prevents concurrent start/stop operations
let consecutiveErrorCount = 0;
let lastErrorTimestamp = 0;
let speechDetectedInVadCommandPhase = false;

const wakeWordDetectionBuffer: Array<{ text: string; timestamp: number }> = [];

// Configuration constants
const RESTART_DELAY_MS = 250;
const WARM_UP_PERIOD_MS = 300; // Ignore results in VAD wake mode for this duration after start
const MIN_TRANSCRIPT_LENGTH_FOR_EMIT = 1; // Minimum characters for a valid transcript
const WAKE_WORD_BUFFER_MAX_AGE_MS = 2500; // How long to keep text in buffer for wake word detection
const MAX_CONSECUTIVE_ERRORS_ALLOWED = 5;
const ERROR_COUNT_RESET_WINDOW_MS = 10000; // Reset error count if no errors for this duration

const SpeechRecognitionAPIConstructor = computed(() => {
    if (typeof window !== 'undefined') {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (typeof SR === 'function') return SR; // Check if it's a constructor
    }
    return null;
});

function _clearAllTimers(): void {
  if (vadCommandPauseTimerId) clearTimeout(vadCommandPauseTimerId);
  vadCommandPauseTimerId = null;
  if (vadCommandMaxDurationTimerId) clearTimeout(vadCommandMaxDurationTimerId);
  vadCommandMaxDurationTimerId = null;
  if (autoRestartTimerId) clearTimeout(autoRestartTimerId);
  autoRestartTimerId = null;
}

function _resetTranscriptStates(): void {
  accumulatedTranscriptForPtt = '';
  accumulatedTranscriptForVadCommand = '';
  pendingTranscript.value = '';
  wakeWordDetectionBuffer.length = 0;
  speechDetectedInVadCommandPhase = false;
}

function _updatePublicStates(): void {
  const newIsActiveState = currentListeningMode.value === 'main' || currentListeningMode.value === 'vad-command';
  const newIsListeningForWakeWordState = currentListeningMode.value === 'vad-wake';

  if (isActive.value !== newIsActiveState) {
    isActive.value = newIsActiveState;
    console.log(`[BSH] Public isActive state changed to: ${newIsActiveState} (Mode: ${currentListeningMode.value})`);
    emit('processing-audio', newIsActiveState);
  }

  if (isListeningForWakeWord.value !== newIsListeningForWakeWordState) {
    isListeningForWakeWord.value = newIsListeningForWakeWordState;
    console.log(`[BSH] Public isListeningForWakeWord state changed to: ${newIsListeningForWakeWordState}`);
    emit('listening-for-wake-word', newIsListeningForWakeWordState);
  }
}

function _isValidTranscript(text: string): boolean {
  if (!text || text.trim().length < MIN_TRANSCRIPT_LENGTH_FOR_EMIT) return false;
  const cleanedText = text.trim().toLowerCase();
  // Filter out common speech recognition noise or very short, non-word utterances
  const commonNoisePatterns = ['[ __ ]', 'hmm', 'uh', 'um', 'uhh', 'umm', 'huh'];
  return !commonNoisePatterns.some(noise => cleanedText.includes(noise)) && !/^[^\w\s]+$/.test(cleanedText);
}

function _checkForWakeWord(transcriptPart: string): string | null {
  if (!transcriptPart && wakeWordDetectionBuffer.length === 0) return null;

  const wakeWords = props.settings.vadWakeWordsBrowserSTT?.map(w => w.toLowerCase().trim()).filter(w => w) || [];
  if (wakeWords.length === 0) return null;

  const currentTime = Date.now();

  if (transcriptPart.trim()) {
    wakeWordDetectionBuffer.push({ text: transcriptPart.toLowerCase(), timestamp: currentTime });
  }

  // Prune old entries from buffer
  while (wakeWordDetectionBuffer.length > 0 && currentTime - wakeWordDetectionBuffer[0].timestamp > WAKE_WORD_BUFFER_MAX_AGE_MS) {
    wakeWordDetectionBuffer.shift();
  }

  const combinedRecentText = wakeWordDetectionBuffer.map(entry => entry.text).join(' ');

  for (const wakeWord of wakeWords) {
    // Using regex for whole word matching, case insensitive
    const wakeWordRegex = new RegExp(`\\b${wakeWord}\\b`, 'i');
    if (wakeWordRegex.test(combinedRecentText)) {
      console.log(`[BSH] Wake word "${wakeWord}" detected in buffered text: "${combinedRecentText}"`);
      wakeWordDetectionBuffer.length = 0; // Clear buffer after detection
      return wakeWord;
    }
  }
  return null;
}

function _createAndConfigureRecognizer(modeToConfigureFor: ListeningMode): boolean {
  const Constructor = SpeechRecognitionAPIConstructor.value;
  if (!Constructor) {
    if (isRecognizerAPISupported.value) { // Only emit error once
      console.error('[BSH] Web Speech API (SpeechRecognition) is not available in this browser.');
      emit('error', {
        type: 'init',
        message: 'Web Speech API is not supported by this browser. Try Chrome, Edge, or Safari.',
        code: 'api-not-available',
        fatal: true
      });
      isRecognizerAPISupported.value = false;
    }
    return false;
  }
  isRecognizerAPISupported.value = true; // API is available

  // If an active recognizer exists, abort it before creating a new one
  if (recognizer.value && _isRecognizerActiveInternal.value) {
    console.warn('[BSH] Attempted to create recognizer while one is already active. Aborting old one first.');
    try { recognizer.value.abort(); } catch(e) { /* ignore if abort fails */ }
    // _isRecognizerActiveInternal will be set to false in its onend/onerror handler
  }

  try {
    recognizer.value = new Constructor();
  } catch (e: any) {
    console.error('[BSH] Failed to instantiate SpeechRecognition:', e.message);
    emit('error', { type: 'init', message: `Failed to create speech recognizer: ${e.message}`, code: 'init-failed', fatal: true });
    return false;
  }

  recognizer.value.lang = props.settings.speechLanguage || navigator.language || 'en-US';
  recognizer.value.maxAlternatives = 1;

  switch (modeToConfigureFor) {
    case 'vad-wake':
      recognizer.value.continuous = true;
      recognizer.value.interimResults = true; // Interim results are needed for faster wake word detection
      break;
    case 'vad-command':
      recognizer.value.continuous = true; // CRITICAL: Must be true to capture multi-word commands and manage pause detection
      recognizer.value.interimResults = true;
      break;
    case 'main':
      recognizer.value.continuous = props.audioInputMode === 'continuous';
      recognizer.value.interimResults = true; // Generally useful for live feedback
      break;
    default: // Should ideally not happen, but as a fallback for 'idle' or unknown
      recognizer.value.continuous = false;
      recognizer.value.interimResults = false;
  }
  console.log(`[BSH] Recognizer configured for mode '${modeToConfigureFor}': continuous=${recognizer.value.continuous}, interimResults=${recognizer.value.interimResults}, lang=${recognizer.value.lang}`);

  _setupRecognizerEventHandlers();
  return true;
}

function _setupRecognizerEventHandlers(): void {
  if (!recognizer.value) return;

  recognizer.value.onstart = () => {
    console.log(`[BSH] SpeechRecognition started. Current mode: ${currentListeningMode.value}`);
    _isRecognizerActiveInternal.value = true;
    recognizerStartTimeMs = Date.now();
    if (currentListeningMode.value !== 'vad-command') {
        _resetTranscriptStates(); // Reset for PTT, Continuous, new VAD Wake. Preserve for VAD Command restarts.
    }
    // Reset error count on successful start
    if (consecutiveErrorCount > 0) {
        console.log('[BSH] Recognizer started successfully, resetting consecutive error count.');
        consecutiveErrorCount = 0;
    }
    // isTransitioningStates should be false by now if start was successful
    isTransitioningStates = false;
  };

  recognizer.value.onresult = (event: SpeechRecognitionEvent) => {
    if (!_isRecognizerActiveInternal.value) return; // Ignore results if not internally active

    // For VAD wake word, ignore initial noisy results for a brief period
    const timeSinceStart = Date.now() - recognizerStartTimeMs;
    if (currentListeningMode.value === 'vad-wake' && timeSinceStart < WARM_UP_PERIOD_MS) {
      return;
    }

    let fullTranscriptThisEvent = '';
    let isChunkFinalByRecognizer = false; // If the recognizer itself flags this segment as final

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      fullTranscriptThisEvent += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isChunkFinalByRecognizer = true;
      }
    }
    // For VAD command, append to its buffer, for others, pendingTranscript is just the current event's text.
    if (currentListeningMode.value !== 'vad-command') {
        pendingTranscript.value = fullTranscriptThisEvent.trim();
    }


    switch (currentListeningMode.value) {
      case 'vad-wake':
        _handleVadWakeResult(fullTranscriptThisEvent); // isChunkFinalByRecognizer is not directly used here
        break;
      case 'vad-command':
        _handleVadCommandResult(fullTranscriptThisEvent, isChunkFinalByRecognizer);
        break;
      case 'main':
        _handleMainResult(fullTranscriptThisEvent, isChunkFinalByRecognizer);
        break;
    }
  };

  recognizer.value.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error(`[BSH] SpeechRecognition error: ${event.error}, Message: ${event.message}. Mode: ${currentListeningMode.value}`);
    const wasActiveInternal = _isRecognizerActiveInternal.value;
    _isRecognizerActiveInternal.value = false; // Mark as inactive on error

    const now = Date.now();
    if (now - lastErrorTimestamp > ERROR_COUNT_RESET_WINDOW_MS) {
      consecutiveErrorCount = 0; // Reset if error-free period passed
    }
    consecutiveErrorCount++;
    lastErrorTimestamp = now;

    // Handle specific errors or pass to generic handler
    if (event.error === 'aborted' && isTransitioningStates) {
      console.log('[BSH] Expected "aborted" error during state transition. Ignoring.');
      // onend will handle cleanup if needed
      return;
    }
    if (event.error === 'no-speech') {
      if (currentListeningMode.value === 'vad-wake') {
        console.log('[BSH] "no-speech" error in VAD wake mode. Usually auto-restarts.');
        // onend will typically handle restart for continuous modes like vad-wake
        return; // Don't treat as a fatal error for VAD wake, let onend handle restart
      } else if (currentListeningMode.value === 'vad-command') {
         console.log('[BSH] "no-speech" error in VAD command mode. This signifies command timeout or no input.');
         emit('error', {
            type: 'recognition',
            message: 'No command speech detected after wake word (no-speech error).',
            code: 'vad-command-no-speech', // More specific than timeout
            fatal: false
         });
         // onend will be called, which should transition to idle.
         return;
      }
      // For other modes, 'no-speech' might be a legitimate end or error.
    }
    _handleGenericRecognitionError(event.error, event.message);
    // onend is expected to fire after onerror, which handles state cleanup/restart.
  };

  recognizer.value.onend = () => {
    console.log(`[BSH] SpeechRecognition ended. Mode was: ${currentListeningMode.value}, Internally Active: ${_isRecognizerActiveInternal.value}, Transitioning: ${isTransitioningStates}`);
    _isRecognizerActiveInternal.value = false; // Ensure marked inactive

    // Finalize PTT transcript if applicable
    if (currentListeningMode.value === 'main' && props.audioInputMode === 'push-to-talk') {
      if (accumulatedTranscriptForPtt && _isValidTranscript(accumulatedTranscriptForPtt)) {
        console.log(`[BSH] Final PTT transcript from onend: "${accumulatedTranscriptForPtt}"`);
        emit('transcription', { text: accumulatedTranscriptForPtt.trim(), isFinal: true, timestamp: Date.now() });
      }
      _resetTranscriptStates(); // Clear PTT buffer
    }
    // For VAD command, finalization happens in _finalizeVadCommand before stop is called.
    // For continuous, onend is often part of a restart cycle or an error.

    if (isTransitioningStates) {
      console.log('[BSH] OnEnd during transition, assuming new state will be handled by control flow.');
      // If we were stopping, isTransitioningStates might be true, but we want to ensure it becomes false.
      // If we are restarting, isTransitioningStates might be true from the error path and then reset by start.
      // The key is that `_startListeningInternal` or `_stopListeningInternal` will reset it appropriately.
    } else if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      // If not transitioning and conditions allow, consider auto-restart for continuous modes
      const shouldAutoRestart =
        (currentListeningMode.value === 'vad-wake' && props.audioInputMode === 'voice-activation') ||
        (currentListeningMode.value === 'main' && props.audioInputMode === 'continuous');

      if (shouldAutoRestart) {
        if (consecutiveErrorCount < MAX_CONSECUTIVE_ERRORS_ALLOWED) {
          console.log(`[BSH] Scheduling auto-restart for continuous mode: ${currentListeningMode.value}`);
          _scheduleAutoRestart();
        } else {
          console.error(`[BSH] Max consecutive errors (${consecutiveErrorCount}) reached. Halting auto-restart for ${currentListeningMode.value}.`);
          emit('error', { type: 'recognition', message: 'Speech recognition stopped due to repeated errors.', code: 'max-errors-reached', fatal: true });
          currentListeningMode.value = 'idle';
          _updatePublicStates();
        }
      } else {
        // If not auto-restarting, transition to idle.
        currentListeningMode.value = 'idle';
        _updatePublicStates();
      }
    } else {
      // Conditions not met for restart (e.g., permission denied, LLM busy, or was explicit stop)
      currentListeningMode.value = 'idle';
      _updatePublicStates();
    }
  };
}


function _handleVadWakeResult(transcript: string): void {
  const detectedWakeWord = _checkForWakeWord(transcript);
  if (detectedWakeWord) {
    console.log(`[BSH] Wake word "${detectedWakeWord}" confirmed by _handleVadWakeResult! Emitting event.`);
    emit('wake-word-detected'); // This will trigger SttModeManager to switch to vad-command
  }
}

function _handleVadCommandResult(transcriptChunk: string, isChunkFinalByRecognizer: boolean): void {
  if (!transcriptChunk.trim() && !isChunkFinalByRecognizer) return; // Nothing useful in this chunk

  if (transcriptChunk.trim()) {
      if (accumulatedTranscriptForVadCommand.length > 0 && !accumulatedTranscriptForVadCommand.endsWith(' ')) {
          accumulatedTranscriptForVadCommand += ' ';
      }
      accumulatedTranscriptForVadCommand += transcriptChunk.trim();
      speechDetectedInVadCommandPhase = true;
      pendingTranscript.value = accumulatedTranscriptForVadCommand; // Update UI for interim feedback
      console.log(`[BSH-VADCmd] Accumulated: "${accumulatedTranscriptForVadCommand}" (Chunk: "${transcriptChunk}", FinalByRec: ${isChunkFinalByRecognizer})`);
  }

  if (speechDetectedInVadCommandPhase) {
    _clearAllTimers(); // Clear previous pause timer, restart it
    vadCommandPauseTimerId = window.setTimeout(() => {
      console.log('[BSH-VADCmd] Pause detected after speech. Finalizing VAD command from pause timer.');
      _finalizeVadCommand('pause_detected');
    }, props.settings.vadCommandRecognizedPauseMs ?? 1500); // Configurable pause
  }

  // If recognizer itself says this chunk is final (e.g. user paused long enough for recognizer)
  if (isChunkFinalByRecognizer && _isValidTranscript(accumulatedTranscriptForVadCommand)) {
    console.log('[BSH-VADCmd] Recognizer marked chunk as final and accumulated transcript is valid. Finalizing.');
    _finalizeVadCommand('chunk_final_and_valid');
  } else if (isChunkFinalByRecognizer && !accumulatedTranscriptForVadCommand.trim()) {
    // Recognizer finished but nothing useful was captured.
    console.log('[BSH-VADCmd] Recognizer marked chunk as final but no valid command accumulated.');
    // Don't emit error here, let max_duration or onend handle if nothing valid comes.
    // This state could be due to a quick abort or a genuine 'no-speech' after wake word.
    // The 'onend' after this, if no valid speech was captured, might lead to an error emission from there or by timeout.
  }
}

function _finalizeVadCommand(reason: string): void {
  if (currentListeningMode.value !== 'vad-command') {
    // console.warn(`[BSH-VADCmd] Attempted to finalize VAD command but not in vad-command mode. Mode: ${currentListeningMode.value}. Reason: ${reason}`);
    return;
  }
  _clearAllTimers(); // Crucial: stop pause and max duration timers

  const finalCommand = accumulatedTranscriptForVadCommand.trim();
  console.log(`[BSH-VADCmd] Finalizing command: "${finalCommand}". Reason: ${reason}`);

  if (_isValidTranscript(finalCommand)) {
    emit('transcription', { text: finalCommand, isFinal: true, timestamp: Date.now() });
  } else {
    // Only emit error if the reason for finalization isn't already an error case that emits (like max_duration_timeout)
    // 'no-speech' from onerror or a simple empty result from 'chunk_final_and_valid' without valid text
    // would also count as no valid speech.
    if (reason !== 'max_duration_timeout') { // max_duration_timeout already emits specific error
         emit('error', {
            type: 'recognition',
            message: `No valid command speech detected after wake word. (Reason: ${reason})`,
            code: 'vad-command-no-valid-speech',
            fatal: false
         });
    }
  }
  // Stop listening internally, which will trigger onend and transition to idle
  _stopListeningInternal(false);
}


function _handleMainResult(transcript: string, isFinal: boolean): void {
  pendingTranscript.value = transcript; // Update UI with current transcript

  if (props.audioInputMode === 'continuous') {
    if (isFinal && _isValidTranscript(transcript)) {
      console.log(`[BSH] Continuous mode transcript (final): "${transcript}"`);
      emit('transcription', { text: transcript.trim(), isFinal: true, timestamp: Date.now() });
      pendingTranscript.value = ''; // Clear pending after final emit for continuous
    }
    // Interim results are handled by pendingTranscript.value updating the UI
  } else if (props.audioInputMode === 'push-to-talk') {
    // For PTT, accumulate all results. Final emission happens in onend or explicit stop.
    if (transcript) { // Could be empty if it's just a final flag for previous interim
        accumulatedTranscriptForPtt = transcript; // Overwrite with the latest, potentially more complete segment
        pendingTranscript.value = accumulatedTranscriptForPtt;
    }
    if (isFinal && _isValidTranscript(accumulatedTranscriptForPtt)) {
        // Some browsers might give a final result before stop() is called.
        // We'll rely on stopListeningInternal or onend to emit the PTT result to ensure it's the absolute final.
        // However, we update the accumulated one here.
        console.log(`[BSH] PTT received a final segment: "${accumulatedTranscriptForPtt}"`);
    }
  }
}

function _handleGenericRecognitionError(errorName: string, errorMessage: string): void {
  let type: SttHandlerErrorPayload['type'] = 'recognition'; // Default to 'recognition'
  let fatal = false;

  switch (errorName) {
    case 'not-allowed':
    case 'service-not-allowed':
      type = 'permission';
      fatal = true;
      break;
    case 'network':
      type = 'network';
      fatal = false; // Network errors might be transient
      break;
    case 'audio-capture':
      type = 'recorder'; // Problem with mic hardware/access at OS level
      fatal = true;
      break;
    case 'language-not-supported':
      type = 'init'; // Config issue
      fatal = true;
      break;
    case 'aborted':
      if (!isTransitioningStates) { // Unexpected abort
        type = 'unknown'; // Or 'recognition' if preferred
        console.warn('[BSH] Recognition aborted unexpectedly.');
      } else {
        // Expected abort during state transition, usually no error emitted.
        return;
      }
      break;
    case 'no-speech': // Should be handled more specifically by calling contexts usually
      type = 'recognition';
      fatal = false; // Not necessarily fatal, depends on mode
      break;
    default:
      type = 'unknown'; // For any other errors
      console.warn(`[BSH] Unhandled error type: ${errorName}`);
  }

  if (!fatal && consecutiveErrorCount >= MAX_CONSECUTIVE_ERRORS_ALLOWED) {
    console.warn(`[BSH] Max consecutive non-fatal errors (${consecutiveErrorCount}) for '${errorName}'. Promoting to fatal.`);
    fatal = true;
    errorMessage = `Speech recognition failed repeatedly: ${errorMessage || errorName}`;
  }

  emit('error', { type, message: `${errorName}: ${errorMessage}`, code: errorName, fatal });

  if (fatal) {
    currentListeningMode.value = 'idle'; // Go idle on fatal error
    _updatePublicStates();
    _clearAllTimers(); // Ensure no timers linger
  }
  // Non-fatal errors might lead to an auto-restart via the onend handler.
}

function _scheduleAutoRestart(): void {
  _clearAllTimers(); // Clear any existing timers first
  console.log(`[BSH] Scheduling auto-restart of recognizer in ${RESTART_DELAY_MS}ms for mode ${currentListeningMode.value}.`);
  isTransitioningStates = true; // Mark that we are in a transition (to restart)
  autoRestartTimerId = window.setTimeout(() => {
    if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      console.log('[BSH] Auto-restarting listener now.');
      // The mode to restart into should be the one that just ended, if it was continuous or vad-wake
      _startListeningInternal(currentListeningMode.value === 'vad-command'); // This might need refinement
                                                                             // If it was vad-wake, it should restart in vad-wake.
                                                                             // If it was continuous, it should restart in main (continuous).
                                                                             // currentListeningMode.value at this point is the mode that *just ended*.
      // This might be more robust:
      // let restartInVadCommand = false; // default
      // if(currentListeningMode.valueBeforeOnEnd === 'vad-wake') { ... }
      // For now, this simplified logic assumes currentListeningMode has not yet changed from what it was.
      // _startListeningInternal will set isTransitioningStates to false on completion/failure
    } else {
      console.log('[BSH] Auto-restart conditions no longer met (e.g., permission lost, LLM busy). Staying idle.');
      currentListeningMode.value = 'idle';
      _updatePublicStates();
      isTransitioningStates = false;
    }
  }, RESTART_DELAY_MS);
}

async function _stopRecognizerInstance(): Promise<void> {
  if (recognizer.value && _isRecognizerActiveInternal.value) {
    console.log('[BSH] Attempting to stop/abort active SpeechRecognition instance...');
    try {
      recognizer.value.abort(); // Abort is generally safer to stop immediately
      // No need to wait, onend will fire.
      console.log('[BSH] SpeechRecognition instance abort() called.');
    } catch (e: any) {
      console.warn('[BSH] Error while trying to abort recognizer:', e.message);
      // If abort fails, nullify to prevent further use of a broken instance
      recognizer.value = null;
    }
  }
  // _isRecognizerActiveInternal will be set to false by onend or onerror
}

async function _stopListeningInternal(abort: boolean = false): Promise<void> {
  if (currentListeningMode.value === 'idle' && !isTransitioningStates && !_isRecognizerActiveInternal.value) {
    // console.log('[BSH] _stopListeningInternal called but already idle and not internally active.');
    return;
  }

  console.log(`[BSH] Stopping listening. Abort: ${abort}. Current mode: ${currentListeningMode.value}. Transitioning: ${isTransitioningStates}`);
  isTransitioningStates = true; // Mark that we are stopping
  _clearAllTimers(); // Stop any pending timers (VAD command, auto-restart)

  const modeBeforeStop = currentListeningMode.value;

  await _stopRecognizerInstance(); // This will call abort() and trigger onend

  // Handle PTT transcript emission if it was active
  // Note: onend handler also has logic for PTT, ensure no double emission.
  // This explicit check here is good if onend doesn't fire for some reason after abort.
  if (modeBeforeStop === 'main' && props.audioInputMode === 'push-to-talk' && accumulatedTranscriptForPtt) {
      if (_isValidTranscript(accumulatedTranscriptForPtt)) {
        // Emit here if onend might not have caught it or for immediate feedback on stop.
        // console.log(`[BSH] PTT transcript from explicit stop: "${accumulatedTranscriptForPtt}"`);
        // emit('transcription', { text: accumulatedTranscriptForPtt.trim(), isFinal: true, timestamp: Date.now() });
        // Let onend handle PTT for consistency.
      }
  }
  // For VAD command, _finalizeVadCommand handles emission before calling this.

  _resetTranscriptStates(); // Clear all transcript buffers
  currentListeningMode.value = 'idle';
  _updatePublicStates(); // Update isActive, isListeningForWakeWord to false
  // isTransitioningStates is typically reset by onstart of a new session, or here if truly going idle.
  // If onend schedules a restart, isTransitioningStates should remain true.
  // If onend does NOT schedule a restart, then we are truly idle.
  if (!autoRestartTimerId) { // Check if a restart was scheduled by onend
      isTransitioningStates = false;
  }
  console.log('[BSH] Listening explicitly stopped, transitioned to idle (or awaiting restart).');
}


async function _startListeningInternal(forVadCommandCapture: boolean = false): Promise<boolean> {
  if (isTransitioningStates && !_isRecognizerActiveInternal.value) { // Allow if current one is aborting for restart.
    console.warn('[BSH] Attempt to start listening while already transitioning states. Request ignored.');
    return false;
  }
  isTransitioningStates = true; // Mark start of transition
  console.log(`[BSH] Attempting to start listening. For VAD command: ${forVadCommandCapture}, Current Audio Mode: ${props.audioInputMode}`);

  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: 'Microphone permission not granted.', code: 'mic-permission-denied', fatal: true });
    isTransitioningStates = false;
    return false;
  }

  let targetMode: ListeningMode;
  if (props.audioInputMode === 'voice-activation') {
    targetMode = forVadCommandCapture ? 'vad-command' : 'vad-wake';
  } else {
    targetMode = 'main'; // Covers 'push-to-talk' and 'continuous'
  }

  // Ensure any previous instance is fully stopped and cleaned up before starting new.
  // _stopRecognizerInstance calls abort(), which should trigger onend.
  // Wait for onend to potentially clear isTransitioningStates if it goes idle.
  if (recognizer.value && _isRecognizerActiveInternal.value) {
      console.log('[BSH] Active recognizer found before start. Stopping it first.');
      await _stopRecognizerInstance(); // This calls abort()
      // Give a moment for onend to fire and potentially clear isTransitioningStates
      await new Promise(resolve => setTimeout(resolve, 100));
  }


  _clearAllTimers(); // Clear any restart or VAD timers

  if (targetMode === 'vad-command') {
    accumulatedTranscriptForVadCommand = ''; // Reset specifically for VAD command phase
    speechDetectedInVadCommandPhase = false;
    console.log('[BSH] Preparing for VAD command capture.');
  } else {
    _resetTranscriptStates(); // Full reset for other modes or fresh VAD wake listen
  }

  currentListeningMode.value = targetMode;
  _updatePublicStates(); // Update isActive, isListeningForWakeWord

  if (!_createAndConfigureRecognizer(targetMode)) {
    console.error('[BSH] Failed to create or configure recognizer for new session.');
    currentListeningMode.value = 'idle';
    _updatePublicStates();
    isTransitioningStates = false;
    return false;
  }

  try {
    console.log(`[BSH] Calling recognizer.start() for mode: ${targetMode}`);
    recognizer.value!.start(); // Should trigger onstart, which sets _isRecognizerActiveInternal and resets isTransitioningStates

    if (targetMode === 'vad-command') {
      const maxCmdDuration = props.settings.vadCommandTimeoutMs ?? 5000; // Overall timeout for command
      vadCommandMaxDurationTimerId = window.setTimeout(() => {
          console.warn(`[BSH-VADCmd] Max duration (${maxCmdDuration}ms) EXPIRED for command capture.`);
          // Emit error before finalizing, so UI can react to timeout specifically
          emit('error', {
            type: 'recognition',
            message: 'VAD Command capture timed out (max duration).',
            code: 'vad-command-max-timeout',
            fatal: false
          });
          _finalizeVadCommand('max_duration_timeout');
      }, maxCmdDuration);
    }
  } catch (e: any) {
    console.error(`[BSH] Error calling recognizer.start(): ${e.name} - ${e.message}`);
    _handleGenericRecognitionError(e.name || 'start-error', e.message || 'Unknown error during start.');
    currentListeningMode.value = 'idle';
    _updatePublicStates();
    isTransitioningStates = false;
    return false;
  }
  // isTransitioningStates will be set to false in the onstart handler upon successful start.
  return true;
}

// API exposed to parent component (SttModeManager)
const api: SttHandlerInstance = {
  startListening: async (forVadCommandCapture: boolean = false) => {
    return _startListeningInternal(forVadCommandCapture);
  },
  stopListening: async (abort: boolean = false) => {
    // `abort` here is more like a hint; internal logic uses abort() on the recognizer.
    return _stopListeningInternal(abort);
  },
  reinitialize: async () => {
    console.log('[BSH] Reinitializing handler...');
    isTransitioningStates = true;
    await _stopListeningInternal(true); // Stop current, aborting

    // recognizer.value = null; // Let _createAndConfigureRecognizer handle this
    // _isRecognizerActiveInternal.value = false; // Handled by onend/stop

    // Reset error counts and buffers
    consecutiveErrorCount = 0;
    lastErrorTimestamp = 0;
    wakeWordDetectionBuffer.length = 0;
    _resetTranscriptStates();

    // No need to re-emit handler-ready as the instance is the same.
    // Parent might want to restart listening if it was active.
    isTransitioningStates = false;
    console.log('[BSH] Reinitialization complete. Ready to (re)start if needed.');
  },
  stopAll: async (abort: boolean = true) => { // Default to abort for stopAll
    console.log(`[BSH] stopAll called. Abort: ${abort}`);
    await _stopListeningInternal(abort);
  },
  // Reactive state for parent consumption
  isActive: readonly(isActive),
  isListeningForWakeWord: readonly(isListeningForWakeWord),
  hasPendingTranscript: hasPendingTranscriptInternal, // This is already a ComputedRef
  pendingTranscript: readonly(pendingTranscript),
  clearPendingTranscript: () => {
    pendingTranscript.value = '';
    // If PTT, also clear its accumulator as pendingTranscript might reflect that.
    if (props.audioInputMode === 'push-to-talk') {
        accumulatedTranscriptForPtt = '';
    }
    if (currentListeningMode.value === 'vad-command') {
        accumulatedTranscriptForVadCommand = '';
    }
  },
};

onMounted(() => {
  if (!SpeechRecognitionAPIConstructor.value) {
    console.error('[BSH] Web Speech API (SpeechRecognition) is not available on mount.');
    isRecognizerAPISupported.value = false;
    emit('error', { type: 'init', message: 'Web Speech API not supported on this browser.', code: 'api-not-found-on-mount', fatal: true });
  } else {
    isRecognizerAPISupported.value = true;
  }
  emit('handler-ready', 'browser', api);
  console.log('[BSH] BrowserSpeechHandler mounted and API emitted.');
});

onBeforeUnmount(async () => {
  console.log('[BSH] BrowserSpeechHandler unmounting. Stopping all activity.');
  _clearAllTimers(); // Ensure all timers are cleared
  await api.stopAll(true); // Ensure graceful shutdown
  recognizer.value = null; // Release recognizer instance
  emit('handler-unmounted', 'browser');
});

// Watch for settings changes that require re-configuration
watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang) {
    console.log(`[BSH] Speech language changed from ${oldLang} to ${newLang}. Triggering reinitialization.`);
    await api.reinitialize();
    // If it was active, the parent/manager might need to restart it.
    // For simplicity here, reinitialize prepares it for a new start.
  }
});

watch(() => props.settings.vadWakeWordsBrowserSTT, () => {
    console.log('[BSH] VAD wake words changed. Clearing detection buffer.');
    wakeWordDetectionBuffer.length = 0; // Clear buffer if wake words list changes
}, { deep: true });

// Watch for external triggers that might require stopping (e.g., LLM processing)
// This handler primarily reacts to start/stop commands via its API.
// The SttModeManager is responsible for calling stopListening if props.parentIsProcessingLLM changes.

</script>
