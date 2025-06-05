// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
/**
 * @file BrowserSpeechHandler.vue
 * @module BrowserSpeechHandler
 * @description Implements an STT (Speech-to-Text) handler using the browser's native
 * Web Speech API (SpeechRecognition). It supports various audio input modes like
 * Push-to-Talk, Continuous listening, and Voice Activity Detection (VAD) for wake words.
 * This component conforms to the SttHandlerInstance interface for integration with SttManager.
 *
 * @version 7.2.2
 * @updated 2025-06-05 - Corrected SpeechRecognition type references.
 * - Fixed typo isRecognizerAPISupportED.
 * - Ensured hasPendingTranscript in API object is a ComputedRef.
 */
<template>
  </template>

<script setup lang="ts">
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
  // @ts-ignore
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
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
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
    readonly error: string;
    readonly message: string;
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


const recognizer = ref<SpeechRecognition | null>(null); // Uses the global SpeechRecognition type
const isRecognizerAPISupported = ref(true);
const _isRecognizerActiveInternal = ref(false);

type ListeningMode = 'idle' | 'vad-wake' | 'vad-command' | 'main';
const currentListeningMode = ref<ListeningMode>('idle');

const isActive = ref(false);
const isListeningForWakeWord = ref(false);
const pendingTranscript = ref('');
const hasPendingTranscriptInternal = computed(() => !!pendingTranscript.value.trim());


let recognizerStartTimeMs = 0;
let accumulatedTranscriptForPtt = '';
let vadCommandSilenceTimerId: number | null = null;
let autoRestartTimerId: number | null = null;
let isTransitioningStates = false;
let consecutiveErrorCount = 0;
let lastErrorTimestamp = 0;

const wakeWordDetectionBuffer: Array<{ text: string; timestamp: number }> = [];


const RESTART_DELAY_MS = 250;
const WARM_UP_PERIOD_MS = 300;
const VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT = 3000;
const MIN_TRANSCRIPT_LENGTH_FOR_EMIT = 1;
const WAKE_WORD_BUFFER_MAX_AGE_MS = 2500;
const MAX_CONSECUTIVE_ERRORS_ALLOWED = 5;
const ERROR_COUNT_RESET_WINDOW_MS = 10000;

const SpeechRecognitionAPIConstructor = computed(() => {
    if (typeof window !== 'undefined') {
        // Ensure that SpeechRecognition or webkitSpeechRecognition are actual constructors
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (typeof SR === 'function') { // Check if it's a constructor
            return SR;
        }
    }
    return null;
});


function _clearAllTimers(): void {
  if (vadCommandSilenceTimerId) clearTimeout(vadCommandSilenceTimerId);
  vadCommandSilenceTimerId = null;
  if (autoRestartTimerId) clearTimeout(autoRestartTimerId);
  autoRestartTimerId = null;
}

function _resetTranscriptStates(): void {
  accumulatedTranscriptForPtt = '';
  pendingTranscript.value = '';
  wakeWordDetectionBuffer.length = 0;
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
    try { recognizer.value.abort(); } catch(e) { /* ignore */ }
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
      recognizer.value.continuous = false;
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
    _resetTranscriptStates();
    if (consecutiveErrorCount > 0) {
        console.log('[BSH] Recognizer started successfully, resetting consecutive error count.');
        consecutiveErrorCount = 0;
    }
  };

  recognizer.value.onresult = (event: SpeechRecognitionEvent) => {
    if (!_isRecognizerActiveInternal.value) return;

    const timeSinceStart = Date.now() - recognizerStartTimeMs;
    if (currentListeningMode.value === 'vad-wake' && timeSinceStart < WARM_UP_PERIOD_MS) {
      return;
    }

    let fullTranscriptThisEvent = '';
    let isFinalForThisEvent = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      fullTranscriptThisEvent += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isFinalForThisEvent = true;
      }
    }
    pendingTranscript.value = fullTranscriptThisEvent;

    switch (currentListeningMode.value) {
      case 'vad-wake':
        _handleVadWakeResult(fullTranscriptThisEvent /*, _isFinal - parameter removed */);
        break;
      case 'vad-command':
        _handleVadCommandResult(fullTranscriptThisEvent, isFinalForThisEvent);
        break;
      case 'main':
        _handleMainResult(fullTranscriptThisEvent, isFinalForThisEvent);
        break;
    }
  };

  recognizer.value.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error(`[BSH] SpeechRecognition error: ${event.error}, Message: ${event.message}. Mode: ${currentListeningMode.value}`);
    _isRecognizerActiveInternal.value = false;

    const now = Date.now();
    if (now - lastErrorTimestamp > ERROR_COUNT_RESET_WINDOW_MS) {
      consecutiveErrorCount = 0;
    }
    consecutiveErrorCount++;
    lastErrorTimestamp = now;

    if (event.error === 'aborted' && isTransitioningStates) {
      console.log('[BSH] Expected "aborted" error during state transition.');
      return;
    }
    if (event.error === 'no-speech' && (currentListeningMode.value === 'vad-wake')) {
      console.log('[BSH] "no-speech" error in VAD wake mode, continuing to listen if appropriate.');
      return;
    }
     if (event.error === 'no-speech' && currentListeningMode.value === 'vad-command') {
      console.log('[BSH] "no-speech" error in VAD command mode. This signifies command timeout.');
      emit('error', {
        type: 'recognition',
        message: 'No command speech detected after wake word.',
        code: 'vad-command-timeout',
        fatal: false
      });
      return;
    }
    _handleGenericRecognitionError(event.error, event.message);
  };

  recognizer.value.onend = () => {
    console.log(`[BSH] SpeechRecognition ended. Mode was: ${currentListeningMode.value}, Transitioning: ${isTransitioningStates}`);
    _isRecognizerActiveInternal.value = false;

    if (currentListeningMode.value === 'main' && props.audioInputMode === 'push-to-talk') {
      if (accumulatedTranscriptForPtt && _isValidTranscript(accumulatedTranscriptForPtt)) {
        console.log(`[BSH] Final PTT transcript from onend: "${accumulatedTranscriptForPtt}"`);
        emit('transcription', { text: accumulatedTranscriptForPtt.trim(), isFinal: true, timestamp: Date.now() });
      }
      _resetTranscriptStates();
      currentListeningMode.value = 'idle';
      _updatePublicStates();
      return;
    }

    if (!isTransitioningStates && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if ( (currentListeningMode.value === 'vad-wake' && props.audioInputMode === 'voice-activation') ||
           (currentListeningMode.value === 'main' && props.audioInputMode === 'continuous') )
      {
        if (consecutiveErrorCount < MAX_CONSECUTIVE_ERRORS_ALLOWED) {
          console.log(`[BSH] Scheduling auto-restart for continuous mode: ${currentListeningMode.value}`);
          _scheduleAutoRestart();
        } else {
          console.error(`[BSH] Max consecutive errors (${consecutiveErrorCount}) reached. Halting auto-restart.`);
          emit('error', { type: 'recognition', message: 'Speech recognition stopped due to repeated errors.', code: 'max-errors-reached', fatal: true });
          currentListeningMode.value = 'idle';
          _updatePublicStates();
        }
      } else {
        currentListeningMode.value = 'idle';
        _updatePublicStates();
      }
    } else if (isTransitioningStates) {
        console.log('[BSH] OnEnd during transition, new state will be handled by control flow.');
    } else {
        currentListeningMode.value = 'idle';
        _updatePublicStates();
    }
  };
}


function _handleVadWakeResult(transcript: string, _isFinalIgnored?: boolean): void { // _isFinal marked as unused
  const detectedWakeWord = _checkForWakeWord(transcript);
  if (detectedWakeWord) {
    console.log(`[BSH] Wake word "${detectedWakeWord}" confirmed! Emitting event.`);
    emit('wake-word-detected');
  }
}

function _handleVadCommandResult(transcript: string, isFinal: boolean): void {
  _clearAllTimers();

  if (transcript) {
    pendingTranscript.value = transcript;

    if (isFinal && _isValidTranscript(transcript)) {
      console.log(`[BSH] VAD command captured (final): "${transcript}"`);
      emit('transcription', { text: transcript.trim(), isFinal: true, timestamp: Date.now() });
      _stopListeningInternal(false);
      return;
    } else if (isFinal && !_isValidTranscript(transcript)) {
      console.log(`[BSH] VAD command (final) was not valid: "${transcript}"`);
       emit('error', {
        type: 'recognition',
        message: 'No valid command speech detected after wake word.',
        code: 'vad-command-no-valid-speech',
        fatal: false
      });
      _stopListeningInternal(false);
      return;
    }

    const vadSilenceTimeout = props.settings.vadSilenceTimeoutMs || VAD_COMMAND_SILENCE_TIMEOUT_MS_DEFAULT;
    vadCommandSilenceTimerId = window.setTimeout(() => {
      console.log(`[BSH] VAD command silence timeout after interim result. Finalizing current transcript: "${pendingTranscript.value}"`);
      const currentCommand = pendingTranscript.value;
      if (_isValidTranscript(currentCommand)) {
        emit('transcription', { text: currentCommand.trim(), isFinal: true, timestamp: Date.now() });
      } else {
         emit('error', {
            type: 'recognition',
            message: 'No command speech detected after wake word (timeout).',
            code: 'vad-command-timeout',
            fatal: false
        });
      }
      _stopListeningInternal(false);
    }, vadSilenceTimeout);
  }
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
    case 'language-not-supported': // Corrected error name
      type = 'recognition'; // Or 'init' if language is set at init time
      fatal = true;
      break;
    case 'aborted':
      if (!isTransitioningStates) type = 'unknown'; else return;
      break;
  }

  if (!fatal && consecutiveErrorCount >= MAX_CONSECUTIVE_ERRORS_ALLOWED) {
    console.warn(`[BSH] Max consecutive errors (${consecutiveErrorCount}) for '${errorName}'. Promoting to fatal.`);
    fatal = true;
    errorMessage = `Speech recognition failed repeatedly: ${errorMessage}`;
  }

  emit('error', { type, message: `${errorName}: ${errorMessage}`, code: errorName, fatal });

  if (fatal) {
    currentListeningMode.value = 'idle';
    _updatePublicStates();
  }
}

function _scheduleAutoRestart(): void {
  _clearAllTimers();
  console.log(`[BSH] Scheduling auto-restart of recognizer in ${RESTART_DELAY_MS}ms.`);
  autoRestartTimerId = window.setTimeout(() => {
    if (isTransitioningStates) {
      console.log("[BSH] Auto-restart cancelled: state transition in progress.");
      return;
    }
    if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      console.log('[BSH] Auto-restarting listener now.');
      _startListeningInternal(false);
    } else {
      console.log('[BSH] Auto-restart conditions no longer met. Staying idle.');
      currentListeningMode.value = 'idle';
      _updatePublicStates();
    }
  }, RESTART_DELAY_MS);
}

async function _stopRecognizerInstance(): Promise<void> {
  if (recognizer.value && _isRecognizerActiveInternal.value) {
    console.log('[BSH] Attempting to stop active SpeechRecognition instance...');
    try {
      recognizer.value.abort();
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('[BSH] SpeechRecognition instance aborted.');
    } catch (e: any) {
      console.warn('[BSH] Error while trying to abort recognizer:', e.message);
      recognizer.value = null;
    }
  }
  _isRecognizerActiveInternal.value = false;
}

async function _stopListeningInternal(abort: boolean = false): Promise<void> {
  if (currentListeningMode.value === 'idle' && !isTransitioningStates && !_isRecognizerActiveInternal.value) {
    console.log('[BSH] _stopListeningInternal called but already idle and not active.');
    return;
  }

  isTransitioningStates = true;
  console.log(`[BSH] Stopping listening. Abort: ${abort}. Current mode: ${currentListeningMode.value}`);
  _clearAllTimers();

  await _stopRecognizerInstance();

  if (props.audioInputMode === 'push-to-talk' && accumulatedTranscriptForPtt && currentListeningMode.value === 'main') {
      if (_isValidTranscript(accumulatedTranscriptForPtt)) {
        console.log(`[BSH] PTT transcript from explicit stop: "${accumulatedTranscriptForPtt}"`);
        emit('transcription', { text: accumulatedTranscriptForPtt.trim(), isFinal: true, timestamp: Date.now() });
      }
  }

  _resetTranscriptStates();
  currentListeningMode.value = 'idle';
  _updatePublicStates();
  isTransitioningStates = false;
  console.log('[BSH] Listening stopped, transitioned to idle.');
}


async function _startListeningInternal(forVadCommandCapture: boolean = false): Promise<boolean> {
  if (isTransitioningStates) {
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

  await _stopRecognizerInstance();
  _clearAllTimers();
  _resetTranscriptStates();

  currentListeningMode.value = targetMode;
  _updatePublicStates();

  if (!_createAndConfigureRecognizer(targetMode)) {
    console.error('[BSH] Failed to create or configure recognizer.');
    currentListeningMode.value = 'idle';
    _updatePublicStates();
    isTransitioningStates = false;
    return false;
  }

  try {
    console.log(`[BSH] Calling recognizer.start() for mode: ${targetMode}`);
    recognizer.value!.start();
  } catch (e: any) {
    console.error(`[BSH] Error calling recognizer.start(): ${e.name} - ${e.message}`);
    if (e.name === 'InvalidStateError') {
      console.warn('[BSH] InvalidStateError on start. Recognizer might be busy. Will attempt to recover.');
      if (_isRecognizerActiveInternal.value) {
        console.log('[BSH] InvalidStateError but recognizer claims active. Proceeding cautiously.');
        isTransitioningStates = false;
        return true;
      }
      await _stopRecognizerInstance();
      await new Promise(resolve => setTimeout(resolve, 100));
      if (_createAndConfigureRecognizer(targetMode)) {
        try {
          recognizer.value!.start();
        } catch (retryError: any) {
           _handleGenericRecognitionError(retryError.name || 'start-error-retry', retryError.message || 'Failed to start on retry.');
           currentListeningMode.value = 'idle'; _updatePublicStates(); isTransitioningStates = false; return false;
        }
      } else {
         currentListeningMode.value = 'idle'; _updatePublicStates(); isTransitioningStates = false; return false;
      }
    } else {
      _handleGenericRecognitionError(e.name || 'start-error', e.message || 'Unknown error during start.');
      currentListeningMode.value = 'idle';
      _updatePublicStates();
      isTransitioningStates = false;
      return false;
    }
  }

  isTransitioningStates = false;
  console.log(`[BSH] Listening should start for mode: ${targetMode}`);
  return true;
}


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

    recognizer.value = null;
    _isRecognizerActiveInternal.value = false;

    consecutiveErrorCount = 0;
    lastErrorTimestamp = 0;
    wakeWordDetectionBuffer.length = 0;

    isTransitioningStates = false;
    console.log('[BSH] Reinitialization complete. Ready to start.');
  },
  stopAll: async (abort: boolean = true) => {
    console.log(`[BSH] stopAll called. Abort: ${abort}`);
    isTransitioningStates = true;
    await _stopListeningInternal(abort);
    isTransitioningStates = false;
  },
  isActive: readonly(isActive),
  isListeningForWakeWord: readonly(isListeningForWakeWord),
  hasPendingTranscript: hasPendingTranscriptInternal, // Directly assign the computed ref
  pendingTranscript: readonly(pendingTranscript),
  clearPendingTranscript: () => {
    pendingTranscript.value = '';
  },
};

onMounted(() => {
  if (!SpeechRecognitionAPIConstructor.value) {
    console.error('[BSH] Web Speech API (SpeechRecognition) is not available on mount.');
    isRecognizerAPISupported.value = false; // Corrected typo here
    emit('error', { type: 'init', message: 'Web Speech API not supported.', code: 'api-not-found-on-mount', fatal: true });
  } else {
    isRecognizerAPISupported.value = true; // Corrected typo here
  }
  emit('handler-ready', 'browser', api);
  console.log('[BSH] BrowserSpeechHandler mounted and API emitted.');
});

onBeforeUnmount(async () => {
  console.log('[BSH] BrowserSpeechHandler unmounting. Stopping all activity.');
  await api.stopAll(true);
  recognizer.value = null;
  emit('handler-unmounted', 'browser');
});

watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang) {
    console.log(`[BSH] Speech language changed from ${oldLang} to ${newLang}. Reinitializing recognizer.`);
    await api.reinitialize();
  }
});

watch(() => props.settings.vadWakeWordsBrowserSTT, () => {
    console.log('[BSH] VAD wake words changed. Clearing detection buffer.');
    wakeWordDetectionBuffer.length = 0;
}, { deep: true });

</script>