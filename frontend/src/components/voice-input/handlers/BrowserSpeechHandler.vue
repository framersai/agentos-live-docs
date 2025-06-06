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
 * @version 7.3.3
 * @updated 2025-06-05 - Fixed VAD command accumulation bug and continuous mode immediate stop issue
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

  // Minimal SpeechGrammarList for completeness
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
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
const isRecognizerAPISupported = ref(true);
const _isRecognizerActiveInternal = ref(false);

type ListeningMode = 'idle' | 'vad-wake' | 'vad-command' | 'main';
const currentListeningMode = ref<ListeningMode>('idle');

// Public reactive state exposed via the API
const isActive = ref(false);
const isListeningForWakeWord = ref(false);
const pendingTranscript = ref('');
const hasPendingTranscriptInternal = computed(() => !!pendingTranscript.value.trim());

// Internal state variables
let recognizerStartTimeMs = 0;
let accumulatedTranscriptForPtt = '';
let lastKnownVadCommandTranscript = ''; // FIXED: Track the last known full transcript
let vadCommandPauseTimerId: number | null = null;
let vadCommandMaxDurationTimerId: number | null = null;
let autoRestartTimerId: number | null = null;
let continuousModeStartDelayTimer: number | null = null; // NEW: Delay timer for continuous mode
let isTransitioningStates = false;
let consecutiveErrorCount = 0;
let lastErrorTimestamp = 0;
let speechDetectedInVadCommandPhase = false;

const wakeWordDetectionBuffer: Array<{ text: string; timestamp: number }> = [];

// Configuration constants
const RESTART_DELAY_MS = 250;
const CONTINUOUS_MODE_START_DELAY_MS = 300; // NEW: Delay before starting continuous mode
const WARM_UP_PERIOD_MS = 300;
const MIN_TRANSCRIPT_LENGTH_FOR_EMIT = 1;
const WAKE_WORD_BUFFER_MAX_AGE_MS = 2500;
const MAX_CONSECUTIVE_ERRORS_ALLOWED = 5;
const ERROR_COUNT_RESET_WINDOW_MS = 10000;

const SpeechRecognitionAPIConstructor = computed(() => {
    if (typeof window !== 'undefined') {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (typeof SR === 'function') return SR;
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
  if (continuousModeStartDelayTimer) clearTimeout(continuousModeStartDelayTimer);
  continuousModeStartDelayTimer = null;
}

function _resetTranscriptStates(): void {
  accumulatedTranscriptForPtt = '';
  lastKnownVadCommandTranscript = ''; // FIXED: Reset VAD command tracking
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
    const wakeWordRegex = new RegExp(`\\b${wakeWord}\\b`, 'i');
    if (wakeWordRegex.test(combinedRecentText)) {
      console.log(`[BSH] Wake word "${wakeWord}" detected in buffered text: "${combinedRecentText}"`);
      wakeWordDetectionBuffer.length = 0;
      return wakeWord;
    }
  }
  return null;
}

function _createAndConfigureRecognizer(modeToConfigureFor: ListeningMode): boolean {
  const Constructor = SpeechRecognitionAPIConstructor.value;
  if (!Constructor) {
    if (isRecognizerAPISupported.value) {
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
  isRecognizerAPISupported.value = true;

  if (recognizer.value && _isRecognizerActiveInternal.value) {
    console.warn('[BSH] Attempted to create recognizer while one is already active. Aborting old one first.');
    try { recognizer.value.abort(); } catch(e) { /* ignore if abort fails */ }
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
      recognizer.value.interimResults = true;
      break;
    case 'vad-command':
      recognizer.value.continuous = true;
      recognizer.value.interimResults = true;
      break;
    case 'main':
      recognizer.value.continuous = props.audioInputMode === 'continuous';
      recognizer.value.interimResults = true;
      break;
    default:
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
        _resetTranscriptStates();
    }
    if (consecutiveErrorCount > 0) {
        console.log('[BSH] Recognizer started successfully, resetting consecutive error count.');
        consecutiveErrorCount = 0;
    }
    isTransitioningStates = false;
  };

  recognizer.value.onresult = (event: SpeechRecognitionEvent) => {
    if (!_isRecognizerActiveInternal.value) return;

    const timeSinceStart = Date.now() - recognizerStartTimeMs;
    if (currentListeningMode.value === 'vad-wake' && timeSinceStart < WARM_UP_PERIOD_MS) {
      return;
    }

    let fullTranscriptThisEvent = '';
    let isChunkFinalByRecognizer = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      fullTranscriptThisEvent += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isChunkFinalByRecognizer = true;
      }
    }

    // FIXED: For non-VAD-command modes, update pending transcript normally
    if (currentListeningMode.value !== 'vad-command') {
        pendingTranscript.value = fullTranscriptThisEvent.trim();
    }

    switch (currentListeningMode.value) {
      case 'vad-wake':
        _handleVadWakeResult(fullTranscriptThisEvent);
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
    _isRecognizerActiveInternal.value = false;

    const now = Date.now();
    if (now - lastErrorTimestamp > ERROR_COUNT_RESET_WINDOW_MS) {
      consecutiveErrorCount = 0;
    }
    consecutiveErrorCount++;
    lastErrorTimestamp = now;

    if (event.error === 'aborted' && isTransitioningStates) {
      console.log('[BSH] Expected "aborted" error during state transition. Ignoring.');
      return;
    }
    if (event.error === 'no-speech') {
      if (currentListeningMode.value === 'vad-wake') {
        console.log('[BSH] "no-speech" error in VAD wake mode. Usually auto-restarts.');
        return;
      } else if (currentListeningMode.value === 'vad-command') {
         console.log('[BSH] "no-speech" error in VAD command mode. This signifies command timeout or no input.');
         emit('error', {
            type: 'recognition',
            message: 'No command speech detected after wake word (no-speech error).',
            code: 'vad-command-no-speech',
            fatal: false
         });
         return;
      }
    }
    _handleGenericRecognitionError(event.error, event.message);
  };

  recognizer.value.onend = () => {
    console.log(`[BSH] SpeechRecognition ended. Mode was: ${currentListeningMode.value}, Internally Active: ${_isRecognizerActiveInternal.value}, Transitioning: ${isTransitioningStates}`);
    _isRecognizerActiveInternal.value = false;

    // Finalize PTT transcript if applicable
    if (currentListeningMode.value === 'main' && props.audioInputMode === 'push-to-talk') {
      if (accumulatedTranscriptForPtt && _isValidTranscript(accumulatedTranscriptForPtt)) {
        console.log(`[BSH] Final PTT transcript from onend: "${accumulatedTranscriptForPtt}"`);
        emit('transcription', { text: accumulatedTranscriptForPtt.trim(), isFinal: true, timestamp: Date.now() });
      }
      _resetTranscriptStates();
    }

    if (isTransitioningStates) {
      console.log('[BSH] OnEnd during transition, assuming new state will be handled by control flow.');
    } else if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
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
        currentListeningMode.value = 'idle';
        _updatePublicStates();
      }
    } else {
      currentListeningMode.value = 'idle';
      _updatePublicStates();
    }
  };
}

function _handleVadWakeResult(transcript: string): void {
  const detectedWakeWord = _checkForWakeWord(transcript);
  if (detectedWakeWord) {
    console.log(`[BSH] Wake word "${detectedWakeWord}" confirmed by _handleVadWakeResult! Emitting event.`);
    emit('wake-word-detected');
  }
}

function _handleVadCommandResult(transcriptChunk: string, isChunkFinalByRecognizer: boolean): void {
  // FIXED: The transcript chunk contains the FULL transcript up to this point
  // NOT just the incremental part. So we should replace, not append.
  
  if (transcriptChunk.trim()) {
    // Update to the latest full transcript
    lastKnownVadCommandTranscript = transcriptChunk.trim();
    speechDetectedInVadCommandPhase = true;
    pendingTranscript.value = lastKnownVadCommandTranscript;
    
    console.log(`[BSH-VADCmd] Updated transcript: "${lastKnownVadCommandTranscript}" (FinalByRec: ${isChunkFinalByRecognizer})`);
  }

  if (speechDetectedInVadCommandPhase) {
    _clearAllTimers();
    vadCommandPauseTimerId = window.setTimeout(() => {
      console.log('[BSH-VADCmd] Pause detected after speech. Finalizing VAD command from pause timer.');
      _finalizeVadCommand('pause_detected');
    }, props.settings.vadCommandRecognizedPauseMs ?? 1500);
  }

  if (isChunkFinalByRecognizer && _isValidTranscript(lastKnownVadCommandTranscript)) {
    console.log('[BSH-VADCmd] Recognizer marked chunk as final and transcript is valid. Finalizing.');
    _finalizeVadCommand('chunk_final_and_valid');
  } else if (isChunkFinalByRecognizer && !lastKnownVadCommandTranscript.trim()) {
    console.log('[BSH-VADCmd] Recognizer marked chunk as final but no valid command accumulated.');
  }
}

function _finalizeVadCommand(reason: string): void {
  if (currentListeningMode.value !== 'vad-command') {
    return;
  }
  _clearAllTimers();

  const finalCommand = lastKnownVadCommandTranscript.trim();
  console.log(`[BSH-VADCmd] Finalizing command: "${finalCommand}". Reason: ${reason}`);

  if (_isValidTranscript(finalCommand)) {
    emit('transcription', { text: finalCommand, isFinal: true, timestamp: Date.now() });
  } else {
    if (reason !== 'max_duration_timeout') {
         emit('error', {
            type: 'recognition',
            message: `No valid command speech detected after wake word. (Reason: ${reason})`,
            code: 'vad-command-no-valid-speech',
            fatal: false
         });
    }
  }
  _stopListeningInternal(false);
}

function _handleMainResult(transcript: string, isFinal: boolean): void {
  pendingTranscript.value = transcript;

  if (props.audioInputMode === 'continuous') {
    if (isFinal && _isValidTranscript(transcript)) {
      console.log(`[BSH] Continuous mode transcript (final): "${transcript}"`);
      emit('transcription', { text: transcript.trim(), isFinal: true, timestamp: Date.now() });
      pendingTranscript.value = '';
    }
  } else if (props.audioInputMode === 'push-to-talk') {
    if (transcript) {
        accumulatedTranscriptForPtt = transcript;
        pendingTranscript.value = accumulatedTranscriptForPtt;
    }
    if (isFinal && _isValidTranscript(accumulatedTranscriptForPtt)) {
        console.log(`[BSH] PTT received a final segment: "${accumulatedTranscriptForPtt}"`);
    }
  }
}

function _handleGenericRecognitionError(errorName: string, errorMessage: string): void {
  let type: SttHandlerErrorPayload['type'] = 'recognition';
  let fatal = false;

  switch (errorName) {
    case 'not-allowed':
    case 'service-not-allowed':
      type = 'permission';
      fatal = true;
      break;
    case 'network':
      type = 'network';
      fatal = false;
      break;
    case 'audio-capture':
      type = 'recorder';
      fatal = true;
      break;
    case 'language-not-supported':
      type = 'init';
      fatal = true;
      break;
    case 'aborted':
      if (!isTransitioningStates) {
        type = 'unknown';
        console.warn('[BSH] Recognition aborted unexpectedly.');
      } else {
        return;
      }
      break;
    case 'no-speech':
      type = 'recognition';
      fatal = false;
      break;
    default:
      type = 'unknown';
      console.warn(`[BSH] Unhandled error type: ${errorName}`);
  }

  if (!fatal && consecutiveErrorCount >= MAX_CONSECUTIVE_ERRORS_ALLOWED) {
    console.warn(`[BSH] Max consecutive non-fatal errors (${consecutiveErrorCount}) for '${errorName}'. Promoting to fatal.`);
    fatal = true;
    errorMessage = `Speech recognition failed repeatedly: ${errorMessage || errorName}`;
  }

  emit('error', { type, message: `${errorName}: ${errorMessage}`, code: errorName, fatal });

  if (fatal) {
    currentListeningMode.value = 'idle';
    _updatePublicStates();
    _clearAllTimers();
  }
}

function _scheduleAutoRestart(): void {
  _clearAllTimers();
  console.log(`[BSH] Scheduling auto-restart of recognizer in ${RESTART_DELAY_MS}ms for mode ${currentListeningMode.value}.`);
  isTransitioningStates = true;
  autoRestartTimerId = window.setTimeout(() => {
    if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      console.log('[BSH] Auto-restarting listener now.');
      // Restart in the appropriate mode
      if (currentListeningMode.value === 'vad-wake' || props.audioInputMode === 'voice-activation') {
        _startListeningInternal(false); // VAD wake mode
      } else if (props.audioInputMode === 'continuous') {
        _startListeningInternal(false); // Continuous mode
      }
    } else {
      console.log('[BSH] Auto-restart conditions no longer met. Staying idle.');
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
      recognizer.value.abort();
      console.log('[BSH] SpeechRecognition instance abort() called.');
    } catch (e: any) {
      console.warn('[BSH] Error while trying to abort recognizer:', e.message);
      recognizer.value = null;
    }
  }
}

async function _stopListeningInternal(abort: boolean = false): Promise<void> {
  if (currentListeningMode.value === 'idle' && !isTransitioningStates && !_isRecognizerActiveInternal.value) {
    return;
  }

  console.log(`[BSH] Stopping listening. Abort: ${abort}. Current mode: ${currentListeningMode.value}. Transitioning: ${isTransitioningStates}`);
  isTransitioningStates = true;
  _clearAllTimers();

  const modeBeforeStop = currentListeningMode.value;

  await _stopRecognizerInstance();

  _resetTranscriptStates();
  currentListeningMode.value = 'idle';
  _updatePublicStates();
  
  if (!autoRestartTimerId) {
      isTransitioningStates = false;
  }
  console.log('[BSH] Listening explicitly stopped, transitioned to idle (or awaiting restart).');
}

async function _startListeningInternal(forVadCommandCapture: boolean = false): Promise<boolean> {
  if (isTransitioningStates && !_isRecognizerActiveInternal.value) {
    console.warn('[BSH] Attempt to start listening while already transitioning states. Request ignored.');
    return false;
  }
  isTransitioningStates = true;
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
    targetMode = 'main';
  }

  if (recognizer.value && _isRecognizerActiveInternal.value) {
      console.log('[BSH] Active recognizer found before start. Stopping it first.');
      await _stopRecognizerInstance();
      await new Promise(resolve => setTimeout(resolve, 100));
  }

  _clearAllTimers();

  if (targetMode === 'vad-command') {
    lastKnownVadCommandTranscript = ''; // FIXED: Reset for new command
    speechDetectedInVadCommandPhase = false;
    console.log('[BSH] Preparing for VAD command capture.');
  } else {
    _resetTranscriptStates();
  }

  currentListeningMode.value = targetMode;
  _updatePublicStates();

  if (!_createAndConfigureRecognizer(targetMode)) {
    console.error('[BSH] Failed to create or configure recognizer for new session.');
    currentListeningMode.value = 'idle';
    _updatePublicStates();
    isTransitioningStates = false;
    return false;
  }

  // NEW: For continuous mode, add a delay to prevent immediate stop
  if (targetMode === 'main' && props.audioInputMode === 'continuous') {
    console.log('[BSH] Delaying continuous mode start to avoid immediate stop...');
    await new Promise(resolve => {
      continuousModeStartDelayTimer = window.setTimeout(resolve, CONTINUOUS_MODE_START_DELAY_MS);
    });
  }

  try {
    console.log(`[BSH] Calling recognizer.start() for mode: ${targetMode}`);
    recognizer.value!.start();

    if (targetMode === 'vad-command') {
      const maxCmdDuration = props.settings.vadCommandTimeoutMs ?? 5000;
      vadCommandMaxDurationTimerId = window.setTimeout(() => {
          console.warn(`[BSH-VADCmd] Max duration (${maxCmdDuration}ms) EXPIRED for command capture.`);
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
  return true;
}

// API exposed to parent component (SttModeManager)
const api: SttHandlerInstance = {
  startListening: async (forVadCommandCapture: boolean = false) => {
    return _startListeningInternal(forVadCommandCapture);
  },
  stopListening: async (abort: boolean = false) => {
    return _stopListeningInternal(abort);
  },
  reinitialize: async () => {
    console.log('[BSH] Reinitializing handler...');
    isTransitioningStates = true;
    await _stopListeningInternal(true);

    consecutiveErrorCount = 0;
    lastErrorTimestamp = 0;
    wakeWordDetectionBuffer.length = 0;
    _resetTranscriptStates();

    isTransitioningStates = false;
    console.log('[BSH] Reinitialization complete. Ready to (re)start if needed.');
  },
  stopAll: async (abort: boolean = true) => {
    console.log(`[BSH] stopAll called. Abort: ${abort}`);
    await _stopListeningInternal(abort);
  },
  isActive: readonly(isActive),
  isListeningForWakeWord: readonly(isListeningForWakeWord),
  hasPendingTranscript: hasPendingTranscriptInternal,
  pendingTranscript: readonly(pendingTranscript),
  clearPendingTranscript: () => {
    pendingTranscript.value = '';
    if (props.audioInputMode === 'push-to-talk') {
        accumulatedTranscriptForPtt = '';
    }
    if (currentListeningMode.value === 'vad-command') {
        lastKnownVadCommandTranscript = '';
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
  _clearAllTimers();
  await api.stopAll(true);
  recognizer.value = null;
  emit('handler-unmounted', 'browser');
});

watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang) {
    console.log(`[BSH] Speech language changed from ${oldLang} to ${newLang}. Triggering reinitialization.`);
    await api.reinitialize();
  }
});

watch(() => props.settings.vadWakeWordsBrowserSTT, () => {
    console.log('[BSH] VAD wake words changed. Clearing detection buffer.');
    wakeWordDetectionBuffer.length = 0;
}, { deep: true });

</script>