<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Component to handle Browser Web Speech API interactions.
 * @version 2.2.5 (Adds operation lock to prevent concurrent starts, refined state management, integrated logic from v2.2.4)
 */
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
  nextTick,
  type PropType,
  type Ref
} from 'vue';
import { type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import { SparklesIcon } from '@heroicons/vue/24/outline';

declare global {
  interface SpeechRecognitionErrorEvent extends Event { readonly error: SpeechRecognitionErrorCode; readonly message: string; }
  interface SpeechRecognitionEvent extends Event { readonly resultIndex: number; readonly results: SpeechRecognitionResultList; }
  interface SpeechGrammar { src: string; weight?: number; }
  var SpeechGrammar: { prototype: SpeechGrammar; new(): SpeechGrammar; };
  interface SpeechGrammarList { readonly length: number; item(index: number): SpeechGrammar; addFromString(string: string, weight?: number): void; addFromURI(src: string, weight?: number): void; }
  var SpeechGrammarList: { prototype: SpeechGrammarList; new(): SpeechGrammarList; };
  var webkitSpeechGrammarList: { prototype: SpeechGrammarList; new(): SpeechGrammarList; };
  interface Window { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition; SpeechGrammarList?: typeof SpeechGrammarList; webkitSpeechGrammarList?: typeof SpeechGrammarList; }
  var SpeechRecognition: { prototype: SpeechRecognition; new(): SpeechRecognition; };
  var webkitSpeechRecognition: { prototype: SpeechRecognition; new(): SpeechRecognition; };
  interface SpeechRecognition extends EventTarget { grammars: SpeechGrammarList; lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; serviceURI?: string; onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null; onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null; onend: ((this: SpeechRecognition, ev: Event) => any) | null; onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null; onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null; onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null; onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null; onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null; onstart: ((this: SpeechRecognition, ev: Event) => any) | null; abort(): void; start(): void; stop(): void; }
}
type SpeechRecognitionErrorCode = 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';

const props = defineProps({
  settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
  audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
  parentIsProcessingLLM: { type: Boolean, default: false },
  currentMicPermission: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: { type: 'speech' | 'permission' | 'init', message: string, code?: SpeechRecognitionErrorCode | string }): void;
  (e: 'request-edit-pending-transcript', pendingText: string): void;
  (e: 'wake-word-detected'): void;
}>();

const toast = inject<ToastService>('toast');

// --- Core State ---
const isBrowserWebSpeechActive: Ref<boolean> = ref(false); // For main STT
const isVADListeningForWakeWord: Ref<boolean> = ref(false); // For VAD wake word detection
const operationLock = ref(false); // Prevents concurrent start/stop operations

// --- Transcript State ---
const interimTranscriptWebSpeech: Ref<string> = ref('');
const finalTranscriptWebSpeech: Ref<string> = ref('');
const liveTranscriptWebSpeech: Ref<string> = ref('');
const pendingTranscriptWebSpeech: Ref<string> = ref('');

// --- Timers ---
let vadCommandBrowserSTTFinalizationTimer: number | null = null;
const VAD_COMMAND_FALLBACK_TIMEOUT_MS = 2500;
const pauseDetectedWebSpeech: Ref<boolean> = ref(false);
const pauseCountdownWebSpeech: Ref<number> = ref(0);
let pauseTimerIdWebSpeech: number | null = null;

// --- Speech Recognition Instances ---
let webSpeechRecognition: SpeechRecognition | null = null;
let vadWakeWordDetectionRecognition: SpeechRecognition | null = null;
let isVADStartAttemptPending = false; // More specific than isVADRestartPending from v2.2.4

// --- Computed Properties ---
const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');
const continuousModeAutoSend = computed<boolean>(() => props.settings.continuousModeAutoSend);
const browserContinuousSilenceTimeoutMs = computed<number>(() => props.settings.continuousModePauseTimeoutMs || 3000);
const browserContinuousSendUIDelayMs = computed<number>(() => props.settings.continuousModeSilenceSendDelayMs || 1500);
const vadCommandEffectiveTimeoutMs = computed<number>(() => (props.settings.vadSilenceTimeoutMs || VAD_COMMAND_FALLBACK_TIMEOUT_MS) + (props.settings.vadCommandRecognizedPauseMs || 2000));

// --- Helper Functions (from v2.2.4, adapted for v2.2.5 context) ---
const _stopBrowserWebSpeechRecognitionInternalStates = () => {
    if (isBrowserWebSpeechActive.value) emit('processing-audio', false);
    isBrowserWebSpeechActive.value = false;
    clearPauseTimerForWebSpeech();
    if (vadCommandBrowserSTTFinalizationTimer) { clearTimeout(vadCommandBrowserSTTFinalizationTimer); vadCommandBrowserSTTFinalizationTimer = null; }
};

const _cleanUpAfterWebSpeechTranscription = () => {
    interimTranscriptWebSpeech.value='';
    finalTranscriptWebSpeech.value='';
    // liveTranscriptWebSpeech and pendingTranscriptWebSpeech are typically for continuous mode, managed by its own logic.
    // For PTT/VAD command, they are reset before starting.
};

const _sendPendingWebSpeechTranscriptionAndClear = () => {
    if (pendingTranscriptWebSpeech.value.trim()) {
        emit('transcription', pendingTranscriptWebSpeech.value.trim());
    }
    pendingTranscriptWebSpeech.value = ''; // Use the exposed clearPendingTranscript for full reset
    liveTranscriptWebSpeech.value = '';
    clearPauseTimerForWebSpeech();
};

const clearPauseTimerForWebSpeech = () => {
    if(pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech);
    pauseTimerIdWebSpeech = null;
    pauseDetectedWebSpeech.value = false;
    pauseCountdownWebSpeech.value = 0;
};

const resetPauseDetectionForWebSpeech = () => {
  clearPauseTimerForWebSpeech();

  if (isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value) {
    const silenceBeforeCountdownUI = browserContinuousSilenceTimeoutMs.value;
    const uiCountdownDuration = browserContinuousSendUIDelayMs.value;

    pauseTimerIdWebSpeech = window.setTimeout(() => {
      if (pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value && isContinuousMode.value) {
        console.log(`[BSH Continuous] Silence detected for ${silenceBeforeCountdownUI}ms. Starting ${uiCountdownDuration}ms 'Sending in...' UI countdown.`);
        pauseDetectedWebSpeech.value = true;
        pauseCountdownWebSpeech.value = uiCountdownDuration;

        window.setTimeout(() => {
            if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
                console.log("[BSH Continuous] 'Sending in...' UI countdown finished. Sending transcript.");
                _sendPendingWebSpeechTranscriptionAndClear();
            }
            pauseDetectedWebSpeech.value = false;
            pauseCountdownWebSpeech.value = 0;
        }, uiCountdownDuration);
      }
    }, silenceBeforeCountdownUI);
  }
};


const _createAndConfigureRecognizer = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) { console.error("[BSH] Web Speech API not supported."); return null; }
  const recognizer = new SpeechRecognitionAPI();
  recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
  recognizer.maxAlternatives = 1;
  if (isForWakeWord) {
    recognizer.continuous = true; recognizer.interimResults = false;
  } else {
    recognizer.interimResults = true;
    recognizer.continuous = (isPttMode.value || isContinuousMode.value || (isVoiceActivationMode.value && !isVADListeningForWakeWord.value));
  }
  return recognizer;
};

const _safelyStopRecognizer = (recognizer: SpeechRecognition | null, instanceName: string) => {
    if (recognizer) {
        recognizer.onstart = null; recognizer.onresult = null; recognizer.onerror = null; recognizer.onend = null;
        try {
            recognizer.abort();
            console.log(`[BSH] Aborted ${instanceName} recognizer.`);
        } catch (e) {
            console.warn(`[BSH] Error aborting ${instanceName} recognizer:`, e);
        }
    }
};

const initializeWebSpeechRecognition = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  if (isForWakeWord) {
    _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'VAD');
    vadWakeWordDetectionRecognition = null;
  } else {
    _safelyStopRecognizer(webSpeechRecognition, 'main');
    webSpeechRecognition = null;
  }

  const newRecognizer = _createAndConfigureRecognizer(isForWakeWord);
  if (!newRecognizer) {
    emit('error', { type: 'init', message: 'Failed to create SpeechRecognition (API not supported).' });
    if (!isForWakeWord) toast?.add({ type: 'error', title: 'STT Init Failed', message: 'Browser Speech API not available.'});
    return null;
  }

  if (isForWakeWord) {
    vadWakeWordDetectionRecognition = newRecognizer;
    newRecognizer.onstart = () => {
      operationLock.value = false; // Release lock on successful start
      if (props.audioInputMode === 'voice-activation' && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
        isVADListeningForWakeWord.value = true; emit('is-listening-for-wake-word', true); isVADStartAttemptPending = false;
        console.log("[BSH] VAD wake word listener started.");
      } else {
        console.log("[BSH] VAD start conditions not met on onstart, stopping.");
        // stopVADWakeWordRecognition will acquire its own lock
        nextTick(() => stopVADWakeWordRecognition(true));
      }
    };
    newRecognizer.onresult = (event: SpeechRecognitionEvent) => {
      if (!isVADListeningForWakeWord.value) return; // Guard
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      const wakeWordCandidate = transcript.toLowerCase().trim();
      const wakeWords = (props.settings.vadWakeWordsBrowserSTT?.length ? props.settings.vadWakeWordsBrowserSTT : ["v", "vee", "hey V", "hey Vee"]); // Example wake words
      let detected = wakeWords.some(word => wakeWordCandidate.includes(word.toLowerCase()));

      if (detected) {
        console.log(`[BSH] VAD Wake word detected: "${wakeWordCandidate}"`);
        toast?.add({ type: 'info', title: `"${wakeWords[0]}" Activated!`, message: 'Listening for command...', duration: 2000 });
        // stopVADWakeWordRecognition will acquire its own lock
        // The `false` argument means try to stop gracefully, though abort is often used.
        // Let's be consistent with v2.2.4's direct call for this specific path.
        _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'VAD wake word detected'); // Uses abort
        if (isVADListeningForWakeWord.value) {
            isVADListeningForWakeWord.value = false;
            emit('is-listening-for-wake-word', false);
        }
        emit('wake-word-detected');
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      operationLock.value = false;
      isVADStartAttemptPending = false; // VAD start attempt failed
      if (isVADListeningForWakeWord.value) { // Only if it was supposed to be listening
        isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false);
      }
      console.error(`[BSH] VAD Wake Word Error: ${event.error}`, event.message);
      // Don't emit generic error for 'no-speech' or 'aborted' if it's VAD, as it might be normal
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        emit('error', { type: 'speech', message: `VAD Error: ${event.error}`, code: event.error });
      }
      // onend will handle restart logic if appropriate
    };
    newRecognizer.onend = () => {
      const wasListening = isVADListeningForWakeWord.value; // Capture state before reset by lock release
      operationLock.value = false; // Release lock now that this instance ended

      if (isVADListeningForWakeWord.value) { // If it was still marked as listening (e.g. abrupt end)
          isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false);
      }
      console.log("[BSH] VAD wake word 'onend'.");

      // Try to restart VAD if it was listening, is still in VAD mode, mic is good, not busy, and no start attempt is already pending
      if (wasListening && props.audioInputMode === 'voice-activation' && props.currentMicPermission === 'granted' &&
          !isBrowserWebSpeechActive.value && !isVADStartAttemptPending && !props.parentIsProcessingLLM) {
        setTimeout(async () => { // Use async for await inside if needed for startVADWakeWordRecognition
          // Re-check critical conditions as state might have changed during timeout
          if (props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value &&
              !isBrowserWebSpeechActive.value && props.currentMicPermission === 'granted' &&
              !props.parentIsProcessingLLM && !operationLock.value /* ensure lock is free */ ) {
              await startVADWakeWordRecognition(); // This function handles its own operationLock and isVADStartAttemptPending
          }
        }, 250); // Brief delay
      }
    };
  } else { // Main STT recognizer
    webSpeechRecognition = newRecognizer;
    newRecognizer.onstart = () => {
      operationLock.value = false; // Release lock
      console.log("[BSH] Main STT started."); isBrowserWebSpeechActive.value = true; emit('processing-audio', true);
    };
    newRecognizer.onresult = (event: SpeechRecognitionEvent) => {
      if (!isBrowserWebSpeechActive.value) return;
      clearPauseTimerForWebSpeech();

      let interim = ''; let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) { final += transcriptPart; }
        else { interim += transcriptPart; }
      }
      interimTranscriptWebSpeech.value = interim;

      if (final.trim()) {
        if (isPttMode.value || (isVoiceActivationMode.value && !isVADListeningForWakeWord.value)) { // true when STT is for command
          finalTranscriptWebSpeech.value = (finalTranscriptWebSpeech.value + " " + final.trim()).trim();
        } else if (isContinuousMode.value) {
          pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + " " + final.trim()).trim();
          liveTranscriptWebSpeech.value = ''; // Clear live part as it's now in pending
        }
      }

      if (isContinuousMode.value) {
        liveTranscriptWebSpeech.value = interim; // Update live transcript with current interim
        if (final.trim() || interim.trim()) resetPauseDetectionForWebSpeech();
      }

      // VAD Command finalization timer logic
      if (props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value && isBrowserWebSpeechActive.value) {
        if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
        vadCommandBrowserSTTFinalizationTimer = window.setTimeout(() => {
          console.log("[BSH] VAD Command: STT Finalization Timer fired.");
          if (isBrowserWebSpeechActive.value) { // Check if still active before finalizing
            const combined = (finalTranscriptWebSpeech.value + " " + interimTranscriptWebSpeech.value).trim();
            if (combined) emit('transcription', combined);
            _cleanUpAfterWebSpeechTranscription();
            // stopListening will acquire its own lock
            nextTick(() => stopListening(true)); // true for abort
          }
          // The onend of this STT instance will handle restarting VAD wake word detection.
        }, vadCommandEffectiveTimeoutMs.value);
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      operationLock.value = false; // Release lock
      console.error(`[BSH] Main STT Error: ${event.error}`, event.message);
      emit('error', { type: 'speech', message: `Browser STT Error: ${event.error}`, code: event.error });
      toast?.add({ type: 'error', title: `STT Error: ${event.error}`, message: event.message || "Speech recognition failed.", duration: 5000 });
      // _stopBrowserWebSpeechRecognitionInternalStates() is typically called by onend or an explicit stopListening call.
      // If an error occurs that doesn't trigger onend, STT might be left in an inconsistent state.
      // However, calling it here might interfere with onend logic if onend is also triggered.
      // For now, rely on onend or explicit stop for full cleanup.
      if(isBrowserWebSpeechActive.value) _stopBrowserWebSpeechRecognitionInternalStates(); // ensure flags are reset on error
    };
    newRecognizer.onend = () => {
      const wasPtt = isPttMode.value && isBrowserWebSpeechActive.value;
      const wasVadCmd = isVoiceActivationMode.value && !isVADListeningForWakeWord.value && isBrowserWebSpeechActive.value; // STT for command
      const wasCont = isContinuousMode.value && isBrowserWebSpeechActive.value;
      operationLock.value = false; // Release lock as this instance ended

      console.log("[BSH] Main STT ended.");
      _stopBrowserWebSpeechRecognitionInternalStates(); // Resets active flag, emits processing:false, clears timers

      if (wasPtt) {
        const transcriptToSend = (finalTranscriptWebSpeech.value + " " + interimTranscriptWebSpeech.value).trim();
        if (transcriptToSend) emit('transcription', transcriptToSend);
        _cleanUpAfterWebSpeechTranscription();
      } else if (wasVadCmd) {
        if (vadCommandBrowserSTTFinalizationTimer) { clearTimeout(vadCommandBrowserSTTFinalizationTimer); vadCommandBrowserSTTFinalizationTimer = null; }
        const transcriptToSend = (finalTranscriptWebSpeech.value + " " + interimTranscriptWebSpeech.value).trim();
        if (transcriptToSend) emit('transcription', transcriptToSend);
        _cleanUpAfterWebSpeechTranscription();

        // After VAD command is processed, try to restart wake word detection
        if(props.audioInputMode === 'voice-activation' && props.currentMicPermission === 'granted' && !isVADListeningForWakeWord.value && !props.parentIsProcessingLLM && !operationLock.value) {
          console.log("[BSH] VAD command STT ended, attempting to restart wake word listener.");
          // Ensure lock is free before attempting restart. startVADWakeWordRecognition will acquire it.
          nextTick(() => startVADWakeWordRecognition());
        }
      } else if (wasCont) {
        if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value && !pauseDetectedWebSpeech.value /* Check if not already sent by pause timer */) {
           _sendPendingWebSpeechTranscriptionAndClear();
        }
        // Attempt to restart continuous listening if conditions are met
        if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value && !operationLock.value) {
          setTimeout(async () => {
            if (props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value && !props.parentIsProcessingLLM && props.currentMicPermission === 'granted' && !operationLock.value) {
              await startListening(false);
            }
          }, 100); // Small delay
        }
      }
    };
  }
  return newRecognizer;
};


const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (operationLock.value) { console.warn("[BSH] StartListening operation already in progress."); return false; }
  operationLock.value = true;

  console.log(`[BSH] Attempting startListening. VADCmd: ${forVADCommand}, ParentLLM: ${props.parentIsProcessingLLM}, MicPerm: ${props.currentMicPermission}`);

  if (props.parentIsProcessingLLM && (isPttMode.value || (isVoiceActivationMode.value && forVADCommand))) {
      toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM is processing. Please wait.' });
      operationLock.value = false; return false;
  }
  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: `Cannot start Browser STT: Mic permission is ${props.currentMicPermission}.` });
    operationLock.value = false; return false;
  }

  if (props.audioInputMode === 'voice-activation' && !forVADCommand && !isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value) {
    operationLock.value = false; // Release lock before calling another locked operation
    return await startVADWakeWordRecognition();
  }

  if (isVADListeningForWakeWord.value && forVADCommand) {
    operationLock.value = false; // Temporarily release for stopVAD
    await stopVADWakeWordRecognition(true); // stopVAD... will acquire its own lock
    await nextTick();
    if (operationLock.value) { console.warn("[BSH] Re-locking for startListening failed after stopVAD."); return false; } // Should not happen if stopVAD releases lock
    operationLock.value = true; // Re-acquire lock
  }
  else if (isVADListeningForWakeWord.value && props.audioInputMode !== 'voice-activation') { // e.g. switching from VAD to continuous
    operationLock.value = false;
    await stopVADWakeWordRecognition(true);
    await nextTick();
    if (operationLock.value) { console.warn("[BSH] Re-locking for startListening failed after stopVAD (mode switch)."); return false; }
    operationLock.value = true;
  }


  if (isBrowserWebSpeechActive.value && webSpeechRecognition) {
    console.log("[BSH] Main STT active, stopping before restart.");
    // _safelyStopRecognizer is synchronous, onEnd is asynchronous.
    // We need to ensure the previous instance is fully stopped and its onEnd has run.
    const currentRecognizer = webSpeechRecognition;
    webSpeechRecognition = null; // Prevent re-entry or use by other functions
    _safelyStopRecognizer(currentRecognizer, 'main pre-restart');
    await nextTick(); // Allow onEnd to process fully (it should release its lock)
    _stopBrowserWebSpeechRecognitionInternalStates(); // Ensure flags are reset if onEnd didn't fully run or was bypassed
  }

  if (!webSpeechRecognition) {
    webSpeechRecognition = initializeWebSpeechRecognition(false); // This function handles its own internal locking for creation if any, but startListening holds the primary lock.
    if (!webSpeechRecognition) {
        emit('error', { type: 'init', message: 'Browser STT failed to initialize.' });
        operationLock.value = false; return false;
    }
  }
  const recognizer: SpeechRecognition = webSpeechRecognition;
  // Set continuous based on current context at start time
  recognizer.continuous = (isPttMode.value || isContinuousMode.value || (isVoiceActivationMode.value && forVADCommand));

  if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
  vadCommandBrowserSTTFinalizationTimer = null;

  if (isPttMode.value || (props.audioInputMode === 'voice-activation' && forVADCommand)) {
    finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';
  }
  liveTranscriptWebSpeech.value = ''; // Always clear live transcript before new session

  console.log(`[BSH] Executing recognizer.start(). Mode: ${props.audioInputMode}, VAD Cmd: ${forVADCommand}, Continuous: ${recognizer.continuous}`);
  try {
    recognizer.start(); // onstart handler will set isBrowserWebSpeechActive and release operationLock
    return true;
  } catch (e: any) {
    console.error("[BSH] Error on recognizer.start():", e.name, e.message);
    let recovered = false;
    if (e.name === 'InvalidStateError') {
      console.warn("[BSH] Attempting recovery from InvalidStateError for main STT.");
      await nextTick();
      _safelyStopRecognizer(webSpeechRecognition, 'main invalid state'); webSpeechRecognition = null;
      const newRec = initializeWebSpeechRecognition(false);
      if (newRec) {
        webSpeechRecognition = newRec;
        newRec.continuous = (isPttMode.value || isContinuousMode.value || (isVoiceActivationMode.value && forVADCommand));
        try { newRec.start(); console.log("[BSH] Recovery: Main STT re-started."); recovered = true; /* Lock released by newRec.onstart */ }
        catch (e2: any) { console.error("[BSH] Error on main STT recovery start:", e2.name); }
      } else { console.error("[BSH] Main STT recovery failed: Could not re-init recognizer."); }
    }

    if (!recovered) { // If not recovered or different error
        emit('error', {type: 'speech', message: `Failed to start: ${e.name || 'Unknown Error'}.`, code: e.name});
        _stopBrowserWebSpeechRecognitionInternalStates();
        _safelyStopRecognizer(webSpeechRecognition, 'main start error'); webSpeechRecognition = null;
        operationLock.value = false; // Release lock if start failed and not recovered
    }
    return recovered; // Will be false if not recovered
  }
};

const stopListening = async (abort: boolean = false) => {
  if (operationLock.value && !abort) { console.warn("[BSH] StopListening deferred: operation in progress."); return; }
  operationLock.value = true;
  console.log(`[BSH] stopListening called. Abort: ${abort}`);
  _safelyStopRecognizer(webSpeechRecognition, 'main');
  _stopBrowserWebSpeechRecognitionInternalStates();
  if (abort && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
      _sendPendingWebSpeechTranscriptionAndClear();
  }
  operationLock.value = false;
};

const startVADWakeWordRecognition = async (): Promise<boolean> => {
  if (operationLock.value) { console.warn("[BSH] StartVADWakeWord operation already in progress."); return false; }

  if (props.audioInputMode !== 'voice-activation' || props.currentMicPermission !== 'granted' || props.parentIsProcessingLLM) {
    if(isVADListeningForWakeWord.value) { isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); }
    if(props.parentIsProcessingLLM) console.log("[BSH] VAD start blocked: LLM processing.");
    else if(props.currentMicPermission !== 'granted') console.log(`[BSH] VAD start blocked: Mic permission not '${props.currentMicPermission}'.`);
    else if(props.audioInputMode !== 'voice-activation') console.log(`[BSH] VAD start blocked: Not in voice-activation mode.`);
    return false;
  }
  if (isVADListeningForWakeWord.value && vadWakeWordDetectionRecognition) { return true; /* Already running */ }
  if (isBrowserWebSpeechActive.value) { console.log("[BSH] Main STT active, VAD wake word not starting."); return false; }
  if (isVADStartAttemptPending) { console.log("[BSH] VAD start attempt already pending."); return false; }

  operationLock.value = true;
  isVADStartAttemptPending = true;

  if (!vadWakeWordDetectionRecognition) {
    vadWakeWordDetectionRecognition = initializeWebSpeechRecognition(true); // This handles its own internal locking for creation
    if(!vadWakeWordDetectionRecognition) {
        isVADStartAttemptPending = false; operationLock.value = false; return false;
    }
  }
  const recognizer: SpeechRecognition = vadWakeWordDetectionRecognition;
  try {
    console.log("[BSH] Executing VAD.start()");
    recognizer.start(); // onstart handler releases operationLock and sets isVADStartAttemptPending=false
    return true;
  } catch (e: any) {
    console.error("[BSH] Error starting VAD instance:", e.name, e.message);
    let recovered = false;
    if (e.name === 'InvalidStateError') {
      console.warn("[BSH] Attempting recovery from InvalidStateError for VAD.");
      await nextTick();
      _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'VAD invalid state'); vadWakeWordDetectionRecognition = null;
      isVADStartAttemptPending = false; // Reset before attempting re-init
      const newRec = initializeWebSpeechRecognition(true);
      if (newRec) {
        vadWakeWordDetectionRecognition = newRec;
        isVADStartAttemptPending = true; // Set for the new attempt
        try { newRec.start(); console.log("[BSH] Recovery: VAD re-started."); recovered = true; /* Lock released by newRec.onstart */ }
        catch (e3: any) { isVADStartAttemptPending = false; console.error("[BSH] Error VAD recovery start:", e3.name); }
      } else { console.error("[BSH] VAD recovery failed: Could not re-init recognizer."); }
    }

    if (!recovered) {
        isVADStartAttemptPending = false;
        if (isVADListeningForWakeWord.value) { isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); }
        _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'vad start error'); vadWakeWordDetectionRecognition = null;
        operationLock.value = false; // Release lock if start failed and not recovered
    }
    return recovered;
  }
};

const stopVADWakeWordRecognition = async (abort: boolean = true) => {
  if (operationLock.value && !abort) { console.warn("[BSH] StopVAD deferred: operation in progress."); return; }
  operationLock.value = true;
  console.log(`[BSH] stopVADWakeWordRecognition called. Abort: ${abort}`);
  isVADStartAttemptPending = false;
  _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'vad');
  if (isVADListeningForWakeWord.value) {
      isVADListeningForWakeWord.value = false;
      emit('is-listening-for-wake-word', false);
  }
  operationLock.value = false;
};

const reinitialize = async () => {
  if (operationLock.value) { console.warn("[BSH] Reinitialize deferred: operation in progress."); return; }
  operationLock.value = true;
  console.log("[BSH] Reinitializing Handler.");
  // Pass lock status to stopAll, though stopAll will acquire its own if not passed.
  await stopAll(true);
  await nextTick();

  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
      if (props.audioInputMode === 'voice-activation') {
          await startVADWakeWordRecognition(); // This will handle its own lock if this one is released
      } else if (props.audioInputMode === 'continuous') {
          await startListening(false); // This will handle its own lock
      }
  }
  // Release lock only if sub-calls didn't take it or have released it.
  // If startVAD or startListening started successfully, they released the lock via their onstart.
  // If they failed to start, they should have released the lock.
  // If they didn't even attempt (e.g. conditions not met), then this reinitialize owns the lock.
  if (operationLock.value) operationLock.value = false;
};

const stopAll = async (abort: boolean = true) => {
  if (operationLock.value && !abort) { console.warn("[BSH] stopAll deferred: operation in progress."); return; }
  operationLock.value = true;
  console.log("[BSH] Stopping all BrowserSpeech activities (abort:", abort,")");
  isVADStartAttemptPending = false;

  _safelyStopRecognizer(webSpeechRecognition, 'main');
  _safelyStopRecognizer(vadWakeWordDetectionRecognition, 'vad');

  _stopBrowserWebSpeechRecognitionInternalStates();
  if (isVADListeningForWakeWord.value) {
      isVADListeningForWakeWord.value = false;
      emit('is-listening-for-wake-word', false);
  }
  _cleanUpAfterWebSpeechTranscription();
  pendingTranscriptWebSpeech.value = '';
  liveTranscriptWebSpeech.value = '';
  operationLock.value = false;
};

// --- Watchers ---
watch(() => props.parentIsProcessingLLM, async (isLLMProcessing) => {
    if (props.audioInputMode === 'voice-activation') {
        if (isLLMProcessing) {
            if (isVADListeningForWakeWord.value) await stopVADWakeWordRecognition(true);
        } else { // Not processing LLM anymore
            if (!isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value && props.currentMicPermission === 'granted' && !operationLock.value) {
                await startVADWakeWordRecognition();
            }
        }
    }
});

watch(() => props.currentMicPermission, async (newPermStatus, oldPermStatus) => {
    console.log(`[BSH] Mic permission prop updated: ${oldPermStatus} -> ${newPermStatus}.`);
    if (newPermStatus !== 'granted') {
        await stopAll(true); // Stop all if permission lost
    } else if (newPermStatus === 'granted' && oldPermStatus !== 'granted') { // Just granted
        if (!props.parentIsProcessingLLM && !operationLock.value) {
            console.log("[BSH] Permission newly granted, attempting auto-start for current mode.");
            if (props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value) {
                await startVADWakeWordRecognition();
            } else if (props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value) {
                await startListening(false);
            }
        }
    }
});

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) {
    console.log(`[BSH] Audio input mode changed: ${oldMode} -> ${newMode}. Reinitializing.`);
    await reinitialize();
  }
});
watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
    if (newLang !== oldLang && newLang && (webSpeechRecognition || vadWakeWordDetectionRecognition)) {
        console.log(`[BSH] Speech language changed. Reinitializing.`);
        await reinitialize();
    }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  console.log("[BSH] Mounted. Initial Mic Perm:", props.currentMicPermission, "Mode:", props.audioInputMode);
  await nextTick();
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && !operationLock.value) {
      if (props.audioInputMode === 'voice-activation') {
          await startVADWakeWordRecognition();
      } else if (props.audioInputMode === 'continuous') {
          await startListening(false);
      }
  }
});
onBeforeUnmount(async () => { await stopAll(true); });

// --- Expose ---
defineExpose({
  startListening, stopListening, startVADWakeWordRecognition, stopVADWakeWordRecognition,
  reinitialize, stopAll, isBrowserWebSpeechActive, isVADListeningForWakeWord,
  hasPendingTranscript: computed(() => !!pendingTranscriptWebSpeech.value.trim()),
  triggerEditPendingTranscript: () => { if (pendingTranscriptWebSpeech.value.trim()) emit('request-edit-pending-transcript', pendingTranscriptWebSpeech.value); },
  clearPendingTranscript: () => {
    pendingTranscriptWebSpeech.value = '';
    liveTranscriptWebSpeech.value = '';
    clearPauseTimerForWebSpeech(); // Also resets pauseDetectedWebSpeech and pauseCountdownWebSpeech
  },
  pauseDetectedWebSpeech, pauseCountdownWebSpeech,
});
</script>

<template>
  <div class="browser-speech-handler-ui">
    <div v-if="isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="live-transcript-display-ephemeral" aria-live="polite">
      <p v-if="interimTranscriptWebSpeech && (isPttMode || (isVoiceActivationMode && !isVADListeningForWakeWord))" class="interim-transcript-ephemeral">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && isContinuousMode" class="finalized-part-ephemeral">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && isContinuousMode" class="pending-transcript-ephemeral">
        <span class="font-semibold text-xs text-gray-500 dark:text-gray-400">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
    </div>
    <div v-if="isVoiceActivationMode && isVADListeningForWakeWord" class="live-transcript-display-ephemeral vad-wake-word-status">
      Say "V" to activate... <SparklesIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" aria-hidden="true" />
    </div>
    <div v-if="isVoiceActivationMode && isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="web-speech-vad-active-indicator">
      Browser STT: Listening for command...
    </div>
    <div v-if="isContinuousMode && pauseDetectedWebSpeech && isBrowserWebSpeechActive" class="text-xs text-center py-1 text-gray-500 dark:text-gray-400">
        Sending in {{ Math.max(0, pauseCountdownWebSpeech / 1000).toFixed(1) }}s
    </div>
  </div>
</template>

<style scoped lang="scss">
.streaming-cursor-ephemeral { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
.vad-wake-word-status, .web-speech-vad-active-indicator {
  font-size: 0.875rem; /* text-sm */
  text-align: center;
  font-style: italic;
  padding: .25rem 0; /* py-1 */
  color: var(--color-text-muted, hsl(240, 4%, 46%)); /* Fallback color */
    @apply text-gray-500 dark:text-gray-400;  /* Tailwind utility for gray text */  
  }
.live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; font-size: 0.8rem; }
.pending-transcript-ephemeral {
//   .font-semibold { /* Ensure this style is available or define it */ }
//   color: var(--color-text-muted, hsl(240, 4%, 46%)); /* Fallback color */
}

/* Ensure Heroicons are sized if not globally set */
.inline.h-3.w-3 {
  height: 0.75rem; /* 12px */
  width: 0.75rem; /* 12px */
  display: inline-block; /* Or inline-flex for better alignment with text */
  vertical-align: middle; /* Adjust as needed */
}
</style>