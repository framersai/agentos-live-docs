// File: frontend/src/components/BrowserSpeechHandler.vue
<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Component to handle all Browser Web Speech API interactions,
 * including Push-to-Talk, Continuous mode, and VAD (Wake Word detection + VAD Command Capture if STT is Browser).
 * Emits transcriptions, processing states, and wake word detection events.
 * @version 2.1.0
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

// Using SparklesIcon for VAD wake word UI indication
import { SparklesIcon } from '@heroicons/vue/24/outline';

// Ambient Type Declarations for Web Speech API (should ideally be in a global .d.ts file)
declare global {
  interface SpeechRecognitionErrorEvent extends Event { readonly error: SpeechRecognitionErrorCode; readonly message: string; }
  interface SpeechRecognitionEvent extends Event { readonly resultIndex: number; readonly results: SpeechRecognitionResultList; readonly interpretation?: any; readonly emma?: Document; }
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
  /** Voice application settings from the global settings manager. */
  settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
  /** Current audio input mode (ptt, continuous, vad). */
  audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
  /** Flag indicating if the parent LLM is processing. */
  parentIsProcessingLLM: { type: Boolean, default: false },
  /** Initial microphone permission status from the parent. */
  initialPermissionStatus: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
});

const emit = defineEmits<{
  /** Emitted with the final transcription text. */
  (e: 'transcription', value: string): void;
  /** Emitted when this handler starts/stops actively processing audio (recording/recognizing). */
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  /** Emitted when the VAD wake word listener starts/stops. */
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  /** Emitted on errors related to speech, permissions, or initialization. */
  (e: 'error', payload: { type: 'speech' | 'permission' | 'init', message: string, code?: SpeechRecognitionErrorCode | string }): void;
  /** Emitted when a user requests to edit a pending transcript (for continuous mode). */
  (e: 'request-edit-pending-transcript', pendingText: string): void;
  /** Emitted when the VAD wake word is detected. Parent handles handoff to correct STT for command. */
  (e: 'wake-word-detected'): void;
}>();

const toast = inject<ToastService>('toast');

// --- Reactive State ---
/** True if the main browser speech recognition (not VAD wake word) is active. */
const isBrowserWebSpeechActive: Ref<boolean> = ref(false);
/** True if the VAD wake word listener is active. */
const isVADListeningForWakeWord: Ref<boolean> = ref(false);

/** Interim transcript from Web Speech API (for PTT and VAD command). */
const interimTranscriptWebSpeech: Ref<string> = ref('');
/** Accumulated final transcript for PTT and VAD command before sending. */
const finalTranscriptWebSpeech: Ref<string> = ref('');
/** Live, non-finalized transcript parts for Continuous mode. */
const liveTranscriptWebSpeech: Ref<string> = ref('');
/** Accumulated final transcript parts for Continuous mode before sending on pause. */
const pendingTranscriptWebSpeech: Ref<string> = ref('');

/** Timer for finalizing VAD command capture after a period of silence (Browser STT). */
let vadCommandBrowserSTTFinalizationTimer: ReturnType<typeof setTimeout> | null = null;
const VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS = 2500; // Time of silence to finalize VAD command

/** True if a pause is detected in Continuous mode (Browser STT). */
const pauseDetectedWebSpeech: Ref<boolean> = ref(false);
/** Countdown in ms for sending pending transcript in Continuous mode after pause. */
const pauseCountdownWebSpeech: Ref<number> = ref(0);
let pauseTimerIdWebSpeech: ReturnType<typeof setTimeout> | null = null;

/** Main SpeechRecognition instance for PTT, Continuous, VAD Command. */
let webSpeechRecognition: SpeechRecognition | null = null;
/** Dedicated SpeechRecognition instance for VAD wake word detection. */
let vadWakeWordDetectionRecognition: SpeechRecognition | null = null;
/** Flag to prevent race conditions with VAD restart logic. */
let isVADRestartPending = false;

/** Local copy of permission status, updated by prop. */
const permissionStatus = ref(props.initialPermissionStatus);
watch(() => props.initialPermissionStatus, (newVal) => permissionStatus.value = newVal);

// --- Computed Properties ---
const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');
const continuousModeAutoSend = computed<boolean>(() => props.settings.continuousModeAutoSend);
const minSilenceDurationForContinuousSegmentEndMs = computed<number>(() => props.settings.continuousModePauseTimeoutMs);

/**
 * Creates and configures a new SpeechRecognition instance.
 * @param isForWakeWord - If true, configures for wake word detection (continuous, no interim).
 * @returns The configured SpeechRecognition instance or null if API is not supported.
 */
const _createAndConfigureRecognizer = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    console.error("[BSH] Web Speech API not supported in this browser.");
    return null;
  }
  const recognizer = new SpeechRecognitionAPI();
  recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
  if (isForWakeWord) {
    recognizer.continuous = true; // Keep listening for wake word
    recognizer.interimResults = false; // Final results are sufficient for wake word
  } else { // Main STT for transcription
    recognizer.interimResults = true; // Show interim results
    // `recognizer.continuous` will be set to true in `startListening` before starting.
  }
  return recognizer;
};

/**
 * Initializes or re-initializes a SpeechRecognition instance (main or VAD wake word),
 * assigns it to the module-level variable, and sets up its event handlers.
 * @param isForWakeWord - True if initializing for VAD wake word detection.
 * @returns The new SpeechRecognition instance or null on failure.
 */
const initializeWebSpeechRecognition = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  let existingRecognizer: SpeechRecognition | null = isForWakeWord ? vadWakeWordDetectionRecognition : webSpeechRecognition;
  
  // Abort and clear handlers of any existing instance of the same type
  if (existingRecognizer) {
    try { existingRecognizer.abort(); } catch (e) { console.warn(`[BSH] Error aborting existing ${isForWakeWord ? 'VAD' : 'main'} recognizer:`, e); }
    existingRecognizer.onstart = null; existingRecognizer.onresult = null;
    existingRecognizer.onerror = null; existingRecognizer.onend = null;
  }
  
  const newRecognizer = _createAndConfigureRecognizer(isForWakeWord);
  if (!newRecognizer) {
    emit('error', { type: 'init', message: 'Failed to create SpeechRecognition instance. API may not be supported.' });
    // Toast only for main STT init failure to avoid spam if VAD also fails due to no API
    if (!isForWakeWord && toast) {
        toast.add({ type: 'error', title: 'STT Init Failed', message: 'Browser Speech API not available.'});
    }
    // Ensure module variables are nulled out
    if (isForWakeWord) { vadWakeWordDetectionRecognition = null; } else { webSpeechRecognition = null; }
    return null;
  }

  if (isForWakeWord) {
    vadWakeWordDetectionRecognition = newRecognizer;
    newRecognizer.onstart = () => { 
      if (props.audioInputMode === 'voice-activation') {
        console.log("[BSH] VAD wake word listener started.");
        isVADListeningForWakeWord.value = true;
        emit('is-listening-for-wake-word', true);
        isVADRestartPending = false; // VAD has successfully started, reset pending flag
      } else { // Mode changed while VAD was attempting to start
        console.log("[BSH] VAD start aborted, mode changed from voice-activation.");
        stopVADWakeWordRecognition(true); // Abort this instance
      }
    };
    newRecognizer.onresult = (event: SpeechRecognitionEvent) => { 
      if (!isVADListeningForWakeWord.value) return; // Ignore if not actively listening for wake word
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      const wakeWordCandidate = transcript.toLowerCase().trim();
      console.log(`[BSH_VAD_DEBUG] Raw VAD Transcript: '${transcript}', Candidate for matching: '${wakeWordCandidate}'`);
      const wakeWords = ["v", "vee"]; // Focus on "v", "vee" as robust phonetic
      
      let detected = false;
      for (const word of wakeWords) {
        // More robust matching for single letters or short phrases
        if (wakeWordCandidate === word || 
            (word === "v" && (wakeWordCandidate.startsWith("v ") || wakeWordCandidate.endsWith(" v"))) ||
            wakeWordCandidate.includes(word)) { // .includes() as a fallback
          detected = true;
          console.log(`[BSH] VAD Wake word candidate "${wakeWordCandidate}" matched with "${word}".`);
          break;
        }
      }

      if (detected) {
        toast?.add({ type: 'info', title: 'V Activated!', message: 'Listening for your command...', duration: 2000 });
        stopVADWakeWordRecognition(false); // Gracefully stop VAD wake word listening
        emit('wake-word-detected');      // Signal parent to handle STT handoff for command
      } else if (wakeWordCandidate) { // Log if there was a candidate but no match
        console.log(`[BSH_VAD_DEBUG] No wake word match for candidate: '${wakeWordCandidate}'`);
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => { 
      console.warn(`[BSH] VAD wake word listener error: ${event.error} - ${event.message}`);
      // Note: 'onend' will always fire after 'onerror', so state resets (like isVADListeningForWakeWord=false)
      // and restart logic are primarily handled in 'onend'.
      if (event.error !== 'no-speech' && event.error !== 'aborted') { // Don't emit/toast for common non-errors
         emit('error', { type: 'speech', message: `VAD listener error: ${event.error}`, code: event.error });
         // Avoid toasting for permission issues ('not-allowed', 'audio-capture') as parent handles these via micPermissionStatus
         if (event.error !== 'not-allowed' && event.error !== 'audio-capture') {
            toast?.add({type: 'warning', title: 'VAD Listener Error', message: `Error: ${event.error}`, duration: 3000});
         }
      }
    };
    newRecognizer.onend = () => { 
      const wasListening = isVADListeningForWakeWord.value; // Capture state before reset
      isVADListeningForWakeWord.value = false; 
      emit('is-listening-for-wake-word', false);
      console.log("[BSH] VAD wake word listener 'onend' fired.");
      
      // Auto-restart logic: only if it was actively listening, in VAD mode, permission granted,
      // not busy with main STT or LLM, and no restart is already pending.
      if (wasListening && props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted' &&
          !isBrowserWebSpeechActive.value && !isVADRestartPending && !props.parentIsProcessingLLM) {
        console.log("[BSH] VAD wake word listener auto-restarting from onend.");
        isVADRestartPending = true; // Set flag to prevent immediate re-entry from other watchers/calls
        setTimeout(() => { 
          // Double check conditions before actual restart attempt
          if (props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value && 
              !isBrowserWebSpeechActive.value && permissionStatus.value === 'granted') {
            startVADWakeWordRecognition(); // This will set isVADRestartPending to false in its onstart
          } else {
            isVADRestartPending = false; // Reset if conditions no longer met
          }
        }, 250); // Short delay to allow states to settle
      } else if (isVADRestartPending && !wasListening) {
          // If a restart was pending but onEnd fired likely due to an external stop before it could start
          isVADRestartPending = false;
      }
    };
  } else { // Main STT recognizer
    webSpeechRecognition = newRecognizer;
    newRecognizer.onstart = () => { 
        console.log("[BSH] Main WebSpeechRecognition started.");
        isBrowserWebSpeechActive.value = true;
        emit('processing-audio', true);
    };
    newRecognizer.onresult = (event: SpeechRecognitionEvent) => { 
      let interim = ''; let finalPart = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptResult = event.results[i][0].transcript;
        if (event.results[i].isFinal) { finalPart += transcriptResult.trim() + ' '; } else { interim += transcriptResult; }
      }
      interim = interim.trim(); finalPart = finalPart.trim();

      if (isContinuousMode.value) {
        liveTranscriptWebSpeech.value = interim;
        if (finalPart) {
          pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart).trim();
          liveTranscriptWebSpeech.value = '';
          resetPauseDetectionForWebSpeech();
        }
      } else if (isPttMode.value) {
        interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + (finalTranscriptWebSpeech.value && interim ? ' ' : '') + interim;
        if (finalPart) { finalTranscriptWebSpeech.value += finalPart + ' '; }
      } else if (isVoiceActivationMode.value && !isVADListeningForWakeWord.value) { // VAD Command phase for Browser STT
        interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + (finalTranscriptWebSpeech.value && interim ? ' ' : '') + interim;
        if (finalPart) {
          finalTranscriptWebSpeech.value += finalPart + ' ';
          if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
          vadCommandBrowserSTTFinalizationTimer = setTimeout(() => {
            if(webSpeechRecognition && isBrowserWebSpeechActive.value && isVoiceActivationMode.value && !isVADListeningForWakeWord.value){
              console.log("[BSH] VAD Command (Browser STT) silence/inactivity detected. Stopping STT.");
              stopListening(false); 
            }
          }, VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS);
        }
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => { 
      const errCode = event.error;
      console.error("[BSH] Main WebSpeechRecognition error:", errCode, event.message);
      // isBrowserWebSpeechActive will be set to false by onend which follows error.
      let userMessage = `Browser speech error: ${errCode}. ${event.message || ''}`;
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        userMessage = 'Mic access denied for WebSpeech.';
        emit('error', { type: 'permission', message: userMessage, code: errCode });
        permissionStatus.value = 'denied'; // Reflect locally
      } else { // For other speech errors, emit generic speech error
          emit('error', { type: 'speech', message: userMessage, code: errCode });
      }
      // Toast only for significant errors, not for 'no-speech' or 'aborted'
      if (errCode !== 'aborted' && errCode !== 'no-speech') {
          toast?.add({ type: 'error', title: 'Speech Error', message: userMessage });
      }
    };
    newRecognizer.onend = () => { 
      console.log("[BSH] Main WebSpeechRecognition ended.");
      const wasPttActive = isPttMode.value && isBrowserWebSpeechActive.value; 
      const wasVadCommandActive = isVoiceActivationMode.value && !isVADListeningForWakeWord.value && isBrowserWebSpeechActive.value;
      const wasContinuousActive = isContinuousMode.value && isBrowserWebSpeechActive.value;
      
      _stopBrowserWebSpeechRecognitionInternalStates(); // This sets isBrowserWebSpeechActive to false & emits processing-audio:false

      if (wasPttActive) {
        if (finalTranscriptWebSpeech.value.trim()) emit('transcription', finalTranscriptWebSpeech.value.trim());
        _cleanUpAfterWebSpeechTranscription();
      } else if (wasVadCommandActive) { // This was Browser STT for VAD command
        if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
        vadCommandBrowserSTTFinalizationTimer = null;
        if (finalTranscriptWebSpeech.value.trim()) emit('transcription', finalTranscriptWebSpeech.value.trim());
        _cleanUpAfterWebSpeechTranscription();
        console.log("[BSH] VAD Command (Browser STT) processing complete. Attempting to return to wake word listener.");
        // If VAD command (using this main recognizer) ends, restart VAD wake word listener
        if(props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted' && !isVADListeningForWakeWord.value) {
            startVADWakeWordRecognition();
        }
      } else if (wasContinuousActive) {
        if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) _sendPendingWebSpeechTranscriptionAndClear();
        // Auto-restart continuous listening if conditions met
        if (permissionStatus.value === 'granted' && !props.parentIsProcessingLLM && 
            props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value) {
          setTimeout(() => { if (props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value) startListening(); }, 100);
        }
      }
    };
  }
  return newRecognizer;
};

const _stopBrowserWebSpeechRecognitionInternalStates = () => { 
    if (isBrowserWebSpeechActive.value) { // Only emit if it was active
        emit('processing-audio', false);
    }
    isBrowserWebSpeechActive.value = false;
    clearPauseTimerForWebSpeech();
    if (vadCommandBrowserSTTFinalizationTimer) {
        clearTimeout(vadCommandBrowserSTTFinalizationTimer);
        vadCommandBrowserSTTFinalizationTimer = null;
    }
};
const _cleanUpAfterWebSpeechTranscription = () => { 
    interimTranscriptWebSpeech.value='';
    finalTranscriptWebSpeech.value='';
};
const _sendPendingWebSpeechTranscriptionAndClear = () => { 
    if (pendingTranscriptWebSpeech.value.trim()) {
        emit('transcription', pendingTranscriptWebSpeech.value.trim());
    }
    clearPendingTranscript();
};
const resetPauseDetectionForWebSpeech = () => { /* ... (same as before) ... */ 
  clearPauseTimerForWebSpeech();
  pauseDetectedWebSpeech.value = false;
  pauseCountdownWebSpeech.value = 0;
  if (isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value) {
    const timeoutMs = minSilenceDurationForContinuousSegmentEndMs.value || 3000;
    pauseTimerIdWebSpeech = setTimeout(() => {
      if (pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value && isContinuousMode.value) {
        pauseDetectedWebSpeech.value = true;
        pauseCountdownWebSpeech.value = timeoutMs;
        const countdownInterval = setInterval(() => {
          if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isBrowserWebSpeechActive.value) {
            clearInterval(countdownInterval);
            pauseDetectedWebSpeech.value = false; return;
          }
          pauseCountdownWebSpeech.value -= 100;
          if (pauseCountdownWebSpeech.value <= 0) {
            clearInterval(countdownInterval);
            if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
              _sendPendingWebSpeechTranscriptionAndClear();
            }
            pauseDetectedWebSpeech.value = false;
          }
        }, 100);
      }
    }, 750); 
  }
};
const clearPauseTimerForWebSpeech = () => { if(pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech); pauseTimerIdWebSpeech = null;};

/**
 * Starts the main speech recognition for PTT, Continuous, or VAD Command (if STT is Browser).
 * @param forVADCommand - True if this is to capture a command after VAD wake word detection (for Browser STT command capture).
 */
const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (permissionStatus.value !== 'granted') {
    emit('error', { type: 'permission', message: 'Microphone permission not granted.' });
    toast?.add({ type: 'error', title: 'Mic Permission', message: 'Microphone access is required.' });
    return false;
  }

  // If in VAD mode, and this call is NOT for command capture, and wake word isn't already listening,
  // it means we should start the VAD wake word listener.
  if (props.audioInputMode === 'voice-activation' && !forVADCommand && !isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value) {
    return await startVADWakeWordRecognition();
  }

  // If VAD wake word listener is active AND this call is for capturing a VAD command, stop wake word first.
  if (isVADListeningForWakeWord.value && forVADCommand) {
    stopVADWakeWordRecognition(true); // Abort wake word
    await nextTick(); // Allow VAD stop/onEnd to complete
  } 
  // If VAD wake word was active but mode changed away from VAD, also stop it.
  else if (isVADListeningForWakeWord.value && props.audioInputMode !== 'voice-activation') {
    stopVADWakeWordRecognition(true);
    await nextTick();
  }
  
  // If main STT is already active, stop it cleanly before restart, especially if reconfiguring.
  if (isBrowserWebSpeechActive.value && webSpeechRecognition) {
    console.log("[BSH] Main STT active, stopping before potential restart for new session/config.");
    try { webSpeechRecognition.abort(); } catch(e) {/* It will call onEnd */}
    // _stopBrowserWebSpeechRecognitionInternalStates(); // onEnd handles this.
    await nextTick(); // Allow onEnd handlers to complete and reset state.
    webSpeechRecognition = null; // Ensure re-initialization if it was aborted.
  }

  // Initialize or re-initialize if instance is null or language changed.
  if (!webSpeechRecognition || webSpeechRecognition.lang !== (props.settings.speechLanguage || navigator.language || 'en-US')) {
    webSpeechRecognition = initializeWebSpeechRecognition(false); // false = not for wake word
  }

  if (!webSpeechRecognition) {
    console.error("[BSH] CRITICAL: Failed to get or initialize main SpeechRecognition instance for startListening.");
    return false;
  }

  const recognizer: SpeechRecognition = webSpeechRecognition; 

  if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
  vadCommandBrowserSTTFinalizationTimer = null;

  if (isPttMode.value || (props.audioInputMode === 'voice-activation' && forVADCommand)) {
    finalTranscriptWebSpeech.value = '';
    interimTranscriptWebSpeech.value = '';
  }
  liveTranscriptWebSpeech.value = '';
  recognizer.continuous = true; 

  console.log(`[BSH] Starting Main WebSpeech. Mode: ${props.audioInputMode}, VAD Cmd: ${forVADCommand}, Continuous: ${recognizer.continuous}`);
  try {
    recognizer.start();
    if (props.audioInputMode === 'voice-activation' && forVADCommand) {
      vadCommandBrowserSTTFinalizationTimer = setTimeout(() => {
        if(webSpeechRecognition && isBrowserWebSpeechActive.value && props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value){
          console.log("[BSH] VAD Command (Browser STT) overall timeout. Stopping STT.");
          stopListening(false); 
        }
      }, VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS + 5000);
    }
    return true;
  } catch (e: any) { 
    console.error("[BSH] Error starting main WebSpeech:", e.name, e.message);
    if (e.name === 'InvalidStateError') { 
      console.warn("[BSH] WebSpeech InvalidStateError on start. Attempting to recover.");
      try { recognizer.abort(); } catch(errAbort) { console.warn("[BSH] Error aborting during InvalidStateError recovery:", errAbort); }
      await nextTick();
      webSpeechRecognition = null; 
      const newRecInstance = initializeWebSpeechRecognition(false);
      if (newRecInstance) {
          webSpeechRecognition = newRecInstance; 
          const recoveredRecognizer = newRecInstance as SpeechRecognition;
          recoveredRecognizer.continuous = true; 
          try {
            recoveredRecognizer.start();
            console.log("[BSH] Recovery: WebSpeech re-started successfully.");
            return true;
          } catch (e2: any) {
            console.error("[BSH] Error starting main WebSpeech (2nd recovery attempt):", e2.name, e2.message);
          }
      } else {
          console.error("[BSH] Recovery: Failed to re-initialize main SpeechRecognition instance.");
      }
    }
    emit('error', {type: 'speech', message: `Failed to start browser STT: ${e.name || 'Unknown Error'}. ${e.message || ''}`, code: e.name});
    _stopBrowserWebSpeechRecognitionInternalStates();
    return false;
  }
};

/** Stops the main speech recognition. */
const stopListening = (abort: boolean = false) => { 
    const currentRecognizer = webSpeechRecognition;
    if (currentRecognizer && isBrowserWebSpeechActive.value) { // Check if it's actually active
        try {
            console.log(`[BSH] Requesting Main WebSpeechRecognition to ${abort ? 'abort' : 'stop'}.`);
            if (abort) currentRecognizer.abort(); else currentRecognizer.stop();
            // onEnd will handle actual state changes like isBrowserWebSpeechActive = false
        } catch (e) {
            console.warn("[BSH] Error on WebSpeech stop/abort:", e);
            _stopBrowserWebSpeechRecognitionInternalStates(); // Force reset if error during stop
        }
    } else if (currentRecognizer) { // Instance exists but not active, still ensure it's stopped if requested
        try { if(abort) currentRecognizer.abort(); else currentRecognizer.stop(); } catch(e) {/* ignore */}
        _stopBrowserWebSpeechRecognitionInternalStates(); // Ensure states are clean
    } else {
         _stopBrowserWebSpeechRecognitionInternalStates(); // No instance, just ensure states are clean
    }

    if (abort && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
        _sendPendingWebSpeechTranscriptionAndClear();
    }
    // VAD restart logic is primarily in the onEnd of the main recognizer if it was a VAD command capture session,
    // or in the onEnd of the VAD wake word recognizer for its own lifecycle.
};

/** Starts the VAD wake word recognition. */
const startVADWakeWordRecognition = async (): Promise<boolean> => {
  if (props.audioInputMode !== 'voice-activation' || permissionStatus.value !== 'granted') {
    isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); return false;
  }
  if (isVADListeningForWakeWord.value && vadWakeWordDetectionRecognition) {
    console.log("[BSH] VAD wake word listener already active and instance exists.");
    return true; 
  }
  if (isBrowserWebSpeechActive.value) { 
    console.log("[BSH] Main STT active, deferring VAD wake word listener start.");
    return false; 
  }
  if (isVADRestartPending) {
      console.log("[BSH] VAD restart is already pending, skipping new startVADWakeWordRecognition call.");
      return false; // Avoid race condition if a restart is already scheduled via setTimeout
  }

  // Ensure a fresh instance if vadWakeWordDetectionRecognition is null or lang changed
  if (!vadWakeWordDetectionRecognition || vadWakeWordDetectionRecognition.lang !== (props.settings.speechLanguage || navigator.language || 'en-US')) {
    vadWakeWordDetectionRecognition = initializeWebSpeechRecognition(true); // true for wake word
  }

  if (!vadWakeWordDetectionRecognition) {
    console.error("[BSH] CRITICAL: Failed to get or initialize VAD SpeechRecognition instance.");
    return false;
  }
  
  const recognizer: SpeechRecognition = vadWakeWordDetectionRecognition; // Now correctly typed

  try {
    console.log("[BSH] Attempting to start VAD wake word listener instance.");
    isVADRestartPending = true; // Indicate an attempt to start is in progress
    recognizer.start(); 
    // onstart callback will set isVADListeningForWakeWord = true and isVADRestartPending = false
    return true;
  } catch (e: any) {
    console.error("[BSH] Error starting VAD wake word listener instance:", e.name, e.message);
    isVADRestartPending = false; // Reset pending flag on error
    isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); // Ensure state is correct
    
    if (e.name === 'InvalidStateError') {
        try { recognizer.abort(); } catch(e2) { /* ... */ }
        await nextTick();
        vadWakeWordDetectionRecognition = null; 
        const newRecInstance = initializeWebSpeechRecognition(true); // This re-assigns and sets up handlers
        if (newRecInstance) {
            // vadWakeWordDetectionRecognition is now the newRecInstance
            const recoveredRecognizer = newRecInstance as SpeechRecognition;
            try {
                isVADRestartPending = true; // Set before start
                recoveredRecognizer.start();
                console.log("[BSH] Recovery: VAD wake word listener re-started successfully.");
                return true;
            } catch (e3: any) {
                isVADRestartPending = false;
                console.error("[BSH] Error starting VAD wake word listener (2nd recovery attempt):", e3.name, e3.message);
            }
        }  else {
            console.error("[BSH] Recovery: Failed to re-initialize VAD SpeechRecognition instance.");
        }
    }
    return false;
  }
};

/** Stops the VAD wake word recognition. */
const stopVADWakeWordRecognition = (abort: boolean = true) => { 
  const recognizer = vadWakeWordDetectionRecognition;
  isVADRestartPending = false; // Always cancel any pending restart when explicitly stopping
  if (recognizer) { 
    // Check actual listening state before trying to stop
    // isVADListeningForWakeWord.value should be the source of truth, managed by onstart/onend
    if (isVADListeningForWakeWord.value) { 
        try {
            console.log(`[BSH] Requesting VAD wake word listener to ${abort ? 'abort' : 'stop'}.`);
            if (abort) recognizer.abort(); else recognizer.stop();
            // onEnd will set isVADListeningForWakeWord to false
        }
        catch (e) { 
            console.warn("[BSH] Error stopping/aborting VAD wake word listener instance:", e);
            isVADListeningForWakeWord.value = false; // Force reset state
            emit('is-listening-for-wake-word', false);
        }
    } else {
        // If not "listening" according to our flag, but an instance exists,
        // try to abort it to be safe, it might be in an intermediate state.
        try { recognizer.abort(); } catch (e) {/* This might error if not running, ignore */}
        console.log("[BSH] stopVADWakeWordRecognition called but not actively listening; ensured abort if instance exists.");
    }
  } else { // No instance, ensure flag is false
    isVADListeningForWakeWord.value = false;
    emit('is-listening-for-wake-word', false);
  }
};

/** Reinitializes Browser STT (e.g., on language change). Stops current activity and restarts VAD if in VAD mode. */
const reinitialize = async () => { 
    console.log("[BSH] Reinitializing BrowserSpeechHandler.");
    await stopAll(true); // Stop all current speech activities
    // `initializeWebSpeechRecognition` (called by startVAD or startListening) will pick up new lang.
    if (props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted') {
        startVADWakeWordRecognition();
    }
    // For other modes like PTT/Continuous, parent (VoiceInput) will decide whether to call startListening.
};

/** Stops all speech recognition activities managed by this handler. */
const stopAll = async (abort: boolean = true) => {  
    console.log("[BSH] Stopping all BrowserSpeech activities.");
    isVADRestartPending = false; 
    if (webSpeechRecognition) {
        try { if(abort) webSpeechRecognition.abort(); else webSpeechRecognition.stop(); } catch(e){ console.warn("[BSH] Error stopping main recognizer in stopAll:", e); }
    }
    _stopBrowserWebSpeechRecognitionInternalStates(); // Ensure main STT flags are reset

    if (vadWakeWordDetectionRecognition) {
         try { if(abort) vadWakeWordDetectionRecognition.abort(); else vadWakeWordDetectionRecognition.stop(); } catch(e){ console.warn("[BSH] Error stopping VAD recognizer in stopAll:", e); }
    }
    if (isVADListeningForWakeWord.value) { // Ensure VAD flag is reset
        isVADListeningForWakeWord.value = false;
        emit('is-listening-for-wake-word', false);
    }

    _cleanUpAfterWebSpeechTranscription();
    pendingTranscriptWebSpeech.value = '';
    liveTranscriptWebSpeech.value = '';
    if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
    vadCommandBrowserSTTFinalizationTimer = null;
    clearPauseTimerForWebSpeech();
};

const hasPendingTranscript = computed(() => !!pendingTranscriptWebSpeech.value.trim());
const triggerEditPendingTranscript = () => { if (hasPendingTranscript.value) emit('request-edit-pending-transcript', pendingTranscriptWebSpeech.value); };
const clearPendingTranscript = () => { 
    pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = '';
    clearPauseTimerForWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
};

defineExpose({ 
  startListening, stopListening, startVADWakeWordRecognition, stopVADWakeWordRecognition,
  reinitialize, stopAll, isBrowserWebSpeechActive, isVADListeningForWakeWord,
  hasPendingTranscript, triggerEditPendingTranscript, clearPendingTranscript, 
});

watch(() => props.audioInputMode, async (newMode, oldMode) => { 
  if (newMode !== oldMode) {
    console.log(`[BSH] audioInputMode changed from ${oldMode} to ${newMode}.`);
    await stopAll(true); // Stop everything this handler controls first
    await nextTick(); // Allow state to settle
    // Auto-start specific modes if conditions are met
    if (newMode === 'voice-activation' && permissionStatus.value === 'granted') {
      startVADWakeWordRecognition();
    } else if (newMode === 'continuous' && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      startListening();
    }
    // PTT is user-initiated via mic button handled by parent (VoiceInput.vue)
  }
});
watch(() => props.settings.speechLanguage, (newLang, oldLang) => { 
    if (newLang !== oldLang && newLang && oldLang) { 
        console.log(`[BSH] Speech language changed from ${oldLang} to ${newLang}. Reinitializing.`);
        reinitialize();
    }
});

onMounted(() => { 
  // Initial auto-start based on mode when component mounts (if Browser STT is active STT preference)
  if (props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted') {
    startVADWakeWordRecognition();
  } else if (props.audioInputMode === 'continuous' && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    startListening();
  }
});
onBeforeUnmount(async () => { 
  await stopAll(true); 
  webSpeechRecognition = null; 
  vadWakeWordDetectionRecognition = null; 
});
</script>

<template>
  <div class="browser-speech-handler-ui">
    <div
      v-if="isBrowserWebSpeechActive && !isVADListeningForWakeWord"
      class="live-transcript-display-ephemeral"
      aria-live="polite"
    >
      <p v-if="interimTranscriptWebSpeech && (isPttMode || (isVoiceActivationMode && !isVADListeningForWakeWord))" class="interim-transcript-ephemeral" aria-label="Interim transcription">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && isContinuousMode" class="finalized-part-ephemeral" aria-label="Live transcription">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && isContinuousMode" class="pending-transcript-ephemeral" aria-label="Pending transcription">
        <span class="font-semibold text-xs text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
    </div>
    <div v-if="isVoiceActivationMode && isVADListeningForWakeWord" class="live-transcript-display-ephemeral vad-wake-word-status text-xs text-center italic py-1 text-[hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l))]" aria-live="polite">
      Say "V" to activate... <SparklesIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" />
    </div>
    <div v-if="isVoiceActivationMode && isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="web-speech-vad-active-indicator text-xs text-center py-1">
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
.vad-wake-word-status, .web-speech-vad-active-indicator { color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l)); }
.live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; }
</style>