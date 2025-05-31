// File: frontend/src/components/BrowserSpeechHandler.vue
<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Component to handle Browser Web Speech API interactions.
 * @version 2.2.0 (Respects parentIsProcessingLLM for starting new sessions and VAD wake word)
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

// Ambient Type Declarations for Web Speech API
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
  initialPermissionStatus: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
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

const isBrowserWebSpeechActive: Ref<boolean> = ref(false);
const isVADListeningForWakeWord: Ref<boolean> = ref(false);
const interimTranscriptWebSpeech: Ref<string> = ref('');
const finalTranscriptWebSpeech: Ref<string> = ref('');
const liveTranscriptWebSpeech: Ref<string> = ref('');
const pendingTranscriptWebSpeech: Ref<string> = ref('');
let vadCommandBrowserSTTFinalizationTimer: number | null = null; // Use number for browser setTimeout
const VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS = 2500;
const pauseDetectedWebSpeech: Ref<boolean> = ref(false);
const pauseCountdownWebSpeech: Ref<number> = ref(0);
let pauseTimerIdWebSpeech: number | null = null; // Use number for browser setTimeout
let webSpeechRecognition: SpeechRecognition | null = null;
let vadWakeWordDetectionRecognition: SpeechRecognition | null = null;
let isVADRestartPending = false;
const permissionStatus = ref(props.initialPermissionStatus);

watch(() => props.initialPermissionStatus, (newVal) => permissionStatus.value = newVal);

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');
const continuousModeAutoSend = computed<boolean>(() => props.settings.continuousModeAutoSend);
const minSilenceDurationForContinuousSegmentEndMs = computed<number>(() => props.settings.continuousModePauseTimeoutMs);

const _createAndConfigureRecognizer = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    console.error("[BSH] Web Speech API not supported.");
    return null;
  }
  const recognizer = new SpeechRecognitionAPI();
  recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
  if (isForWakeWord) {
    recognizer.continuous = true;
    recognizer.interimResults = false;
  } else {
    recognizer.interimResults = true;
    // .continuous is set in startListening
  }
  return recognizer;
};

const initializeWebSpeechRecognition = (isForWakeWord: boolean = false): SpeechRecognition | null => {
  let existingRecognizer: SpeechRecognition | null = isForWakeWord ? vadWakeWordDetectionRecognition : webSpeechRecognition;
  if (existingRecognizer) {
    try { existingRecognizer.abort(); } catch (e) { /* quiet */ }
    existingRecognizer.onstart = null; existingRecognizer.onresult = null;
    existingRecognizer.onerror = null; existingRecognizer.onend = null;
  }
  const newRecognizer = _createAndConfigureRecognizer(isForWakeWord);
  if (!newRecognizer) {
    emit('error', { type: 'init', message: 'Failed to create SpeechRecognition instance.' });
    if (!isForWakeWord && toast) toast.add({ type: 'error', title: 'STT Init Failed', message: 'Browser Speech API not available.'});
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
        isVADRestartPending = false;
      } else {
        stopVADWakeWordRecognition(true);
      }
    };
    newRecognizer.onresult = (event: SpeechRecognitionEvent) => {
      if (!isVADListeningForWakeWord.value) return;
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      const wakeWordCandidate = transcript.toLowerCase().trim();
      const wakeWords = ["v", "vee"]; // Adjusted to "V" from prompt.
      let detected = wakeWords.some(word => wakeWordCandidate === word || (word === "v" && (wakeWordCandidate.startsWith("v ") || wakeWordCandidate.endsWith(" v"))) || wakeWordCandidate.includes(word));
      if (detected) {
        toast?.add({ type: 'info', title: 'V Activated!', message: 'Listening for command...', duration: 2000 });
        stopVADWakeWordRecognition(false);
        emit('wake-word-detected');
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn(`[BSH] VAD error: ${event.error} - ${event.message}`);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
       emit('error', { type: 'speech', message: `VAD listener error: ${event.error}`, code: event.error });
       if (event.error !== 'not-allowed' && event.error !== 'audio-capture') {
         toast?.add({type: 'warning', title: 'VAD Listener Error', message: `Error: ${event.error}`, duration: 3000});
       }
      }
    };
    newRecognizer.onend = () => {
      const wasListening = isVADListeningForWakeWord.value;
      isVADListeningForWakeWord.value = false;
      emit('is-listening-for-wake-word', false);
      console.log("[BSH] VAD wake word listener 'onend'.");
      if (wasListening && props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted' &&
          !isBrowserWebSpeechActive.value && !isVADRestartPending && !props.parentIsProcessingLLM) {
        console.log("[BSH] VAD wake word listener auto-restarting.");
        isVADRestartPending = true;
        setTimeout(() => {
          if (props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value &&
              !isBrowserWebSpeechActive.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) { // Re-check conditions
            startVADWakeWordRecognition();
          } else { isVADRestartPending = false; }
        }, 250);
      } else { isVADRestartPending = false; }
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
        const tr = event.results[i][0].transcript;
        if (event.results[i].isFinal) { finalPart += tr.trim() + ' '; } else { interim += tr; }
      }
      interim = interim.trim(); finalPart = finalPart.trim();
      if (isContinuousMode.value) {
        liveTranscriptWebSpeech.value = interim;
        if (finalPart) {
          pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart).trim();
          liveTranscriptWebSpeech.value = '';
          resetPauseDetectionForWebSpeech();
        }
      } else if (isPttMode.value || (isVoiceActivationMode.value && !isVADListeningForWakeWord.value)) {
        interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + (finalTranscriptWebSpeech.value && interim ? ' ' : '') + interim;
        if (finalPart) {
          finalTranscriptWebSpeech.value += finalPart + ' ';
          if (isVoiceActivationMode.value && !isVADListeningForWakeWord.value) { // VAD Command Specific
            if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
            vadCommandBrowserSTTFinalizationTimer = window.setTimeout(() => { // Use window.setTimeout for number return type
              if(webSpeechRecognition && isBrowserWebSpeechActive.value && isVoiceActivationMode.value && !isVADListeningForWakeWord.value){
                console.log("[BSH] VAD Command (Browser STT) silence/inactivity. Stopping.");
                stopListening(false);
              }
            }, VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS);
          }
        }
      }
    };
    newRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errCode = event.error;
      console.error("[BSH] Main STT error:", errCode, event.message);
      let userMsg = `Browser speech error: ${errCode}.`;
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        userMsg = 'Mic access denied for WebSpeech.';
        emit('error', { type: 'permission', message: userMsg, code: errCode });
        permissionStatus.value = 'denied';
      } else { emit('error', { type: 'speech', message: userMsg, code: errCode }); }
      if (errCode !== 'aborted' && errCode !== 'no-speech') toast?.add({ type: 'error', title: 'Speech Error', message: userMsg });
    };
    newRecognizer.onend = () => {
      console.log("[BSH] Main STT ended.");
      const wasPtt = isPttMode.value && isBrowserWebSpeechActive.value;
      const wasVadCmd = isVoiceActivationMode.value && !isVADListeningForWakeWord.value && isBrowserWebSpeechActive.value;
      const wasCont = isContinuousMode.value && isBrowserWebSpeechActive.value;
      _stopBrowserWebSpeechRecognitionInternalStates();
      if (wasPtt) {
        if (finalTranscriptWebSpeech.value.trim()) emit('transcription', finalTranscriptWebSpeech.value.trim());
        _cleanUpAfterWebSpeechTranscription();
      } else if (wasVadCmd) {
        if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
        vadCommandBrowserSTTFinalizationTimer = null;
        if (finalTranscriptWebSpeech.value.trim()) emit('transcription', finalTranscriptWebSpeech.value.trim());
        _cleanUpAfterWebSpeechTranscription();
        if(props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted' && !isVADListeningForWakeWord.value && !props.parentIsProcessingLLM) {
          startVADWakeWordRecognition(); // Return to wake word
        }
      } else if (wasCont) {
        if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) _sendPendingWebSpeechTranscriptionAndClear();
        if (permissionStatus.value === 'granted' && !props.parentIsProcessingLLM && props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value) {
          setTimeout(() => { if (props.audioInputMode === 'continuous' && !isBrowserWebSpeechActive.value) startListening(); }, 100);
        }
      }
    };
  }
  return newRecognizer;
};

const _stopBrowserWebSpeechRecognitionInternalStates = () => {
    if (isBrowserWebSpeechActive.value) emit('processing-audio', false);
    isBrowserWebSpeechActive.value = false;
    clearPauseTimerForWebSpeech();
    if (vadCommandBrowserSTTFinalizationTimer) { clearTimeout(vadCommandBrowserSTTFinalizationTimer); vadCommandBrowserSTTFinalizationTimer = null; }
};
const _cleanUpAfterWebSpeechTranscription = () => { interimTranscriptWebSpeech.value=''; finalTranscriptWebSpeech.value=''; };
const _sendPendingWebSpeechTranscriptionAndClear = () => {
    if (pendingTranscriptWebSpeech.value.trim()) emit('transcription', pendingTranscriptWebSpeech.value.trim());
    clearPendingTranscript();
};
const resetPauseDetectionForWebSpeech = () => {
  clearPauseTimerForWebSpeech();
  pauseDetectedWebSpeech.value = false;
  pauseCountdownWebSpeech.value = 0;
  if (isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value) {
    const timeoutMs = minSilenceDurationForContinuousSegmentEndMs.value || 3000;
    pauseTimerIdWebSpeech = window.setTimeout(() => { // Use window.setTimeout
      if (pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value && isContinuousMode.value) {
        pauseDetectedWebSpeech.value = true;
        pauseCountdownWebSpeech.value = timeoutMs;
        const countdownInterval = setInterval(() => {
          if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isBrowserWebSpeechActive.value) {
            clearInterval(countdownInterval); pauseDetectedWebSpeech.value = false; return;
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

const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (props.parentIsProcessingLLM && !isContinuousMode.value && !forVADCommand) { // Allow continuous to start, block PTT/VAD Command
      toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM is processing. Please wait.' });
      console.log("[BSH] StartListening blocked: Parent LLM is processing (not continuous mode).");
      return false;
  }
  if (permissionStatus.value !== 'granted') {
    emit('error', { type: 'permission', message: 'Mic permission not granted.' });
    return false;
  }
  if (props.audioInputMode === 'voice-activation' && !forVADCommand && !isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value) {
    return await startVADWakeWordRecognition();
  }
  if (isVADListeningForWakeWord.value && forVADCommand) {
    stopVADWakeWordRecognition(true); await nextTick();
  } else if (isVADListeningForWakeWord.value && props.audioInputMode !== 'voice-activation') {
    stopVADWakeWordRecognition(true); await nextTick();
  }
  if (isBrowserWebSpeechActive.value && webSpeechRecognition) {
    try { webSpeechRecognition.abort(); } catch(e) {}
    await nextTick(); webSpeechRecognition = null;
  }
  if (!webSpeechRecognition || webSpeechRecognition.lang !== (props.settings.speechLanguage || navigator.language || 'en-US')) {
    webSpeechRecognition = initializeWebSpeechRecognition(false);
  }
  if (!webSpeechRecognition) return false;
  const recognizer: SpeechRecognition = webSpeechRecognition;
  if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer);
  vadCommandBrowserSTTFinalizationTimer = null;
  if (isPttMode.value || (props.audioInputMode === 'voice-activation' && forVADCommand)) {
    finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';
  }
  liveTranscriptWebSpeech.value = '';
  // For PTT and VAD Command, 'continuous' should be true to allow pauses without stopping the session.
  // For actual 'continuous' mode, it's also true. The main difference is how onEnd/onresult behaves.
  recognizer.continuous = true;
  console.log(`[BSH] Starting Main WebSpeech. Mode: ${props.audioInputMode}, VAD Cmd: ${forVADCommand}, SpeechRec.continuous: ${recognizer.continuous}`);
  try {
    recognizer.start();
    if (props.audioInputMode === 'voice-activation' && forVADCommand) {
      vadCommandBrowserSTTFinalizationTimer = window.setTimeout(() => {
        if(webSpeechRecognition && isBrowserWebSpeechActive.value && props.audioInputMode === 'voice-activation' && !isVADListeningForWakeWord.value){
          console.log("[BSH] VAD Command (Browser STT) overall timeout. Stopping.");
          stopListening(false);
        }
      }, VAD_COMMAND_BROWSER_STT_SILENCE_TIMEOUT_MS + (props.settings.vadSilenceTimeoutMs || 2500) + 2000 ); // Extended timeout
    }
    return true;
  } catch (e: any) {
    console.error("[BSH] Error starting main WebSpeech:", e.name, e.message);
    if (e.name === 'InvalidStateError') {
      try { recognizer.abort(); } catch(errAbort) {} await nextTick(); webSpeechRecognition = null;
      const newRec = initializeWebSpeechRecognition(false);
      if (newRec) {
        webSpeechRecognition = newRec; const recRec = newRec as SpeechRecognition; recRec.continuous = true;
        try { recRec.start(); return true; } catch (e2: any) { console.error("[BSH] Error main WebSpeech (2nd attempt):", e2.name); }
      }
    }
    emit('error', {type: 'speech', message: `Failed to start browser STT: ${e.name}.`, code: e.name});
    _stopBrowserWebSpeechRecognitionInternalStates();
    return false;
  }
};

const stopListening = (abort: boolean = false) => {
    const currentRecognizer = webSpeechRecognition;
    if (currentRecognizer && isBrowserWebSpeechActive.value) {
        try {
            if (abort) currentRecognizer.abort(); else currentRecognizer.stop();
        } catch (e) { _stopBrowserWebSpeechRecognitionInternalStates(); }
    } else { _stopBrowserWebSpeechRecognitionInternalStates(); }
    if (abort && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
        _sendPendingWebSpeechTranscriptionAndClear();
    }
};

const startVADWakeWordRecognition = async (): Promise<boolean> => {
  if (props.audioInputMode !== 'voice-activation' || permissionStatus.value !== 'granted') {
    isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); return false;
  }
  if (isVADListeningForWakeWord.value && vadWakeWordDetectionRecognition) return true;
  if (isBrowserWebSpeechActive.value || props.parentIsProcessingLLM) { // Don't start VAD if main STT or LLM is busy
    console.log(`[BSH] Deferring VAD wake word listener: main STT active (${isBrowserWebSpeechActive.value}) or LLM processing (${props.parentIsProcessingLLM}).`);
    return false;
  }
  if (isVADRestartPending) return false;

  if (!vadWakeWordDetectionRecognition || vadWakeWordDetectionRecognition.lang !== (props.settings.speechLanguage || navigator.language || 'en-US')) {
    vadWakeWordDetectionRecognition = initializeWebSpeechRecognition(true);
  }
  if (!vadWakeWordDetectionRecognition) return false;
  const recognizer: SpeechRecognition = vadWakeWordDetectionRecognition;
  try {
    isVADRestartPending = true; recognizer.start(); return true;
  } catch (e: any) {
    console.error("[BSH] Error starting VAD instance:", e.name); isVADRestartPending = false; isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false);
    if (e.name === 'InvalidStateError') {
      try { recognizer.abort(); } catch(e2) {} await nextTick(); vadWakeWordDetectionRecognition = null;
      const newRec = initializeWebSpeechRecognition(true);
      if (newRec) { const recRec = newRec as SpeechRecognition; try { isVADRestartPending = true; recRec.start(); return true; } catch (e3: any) { isVADRestartPending = false; console.error("[BSH] Error VAD (2nd attempt):", e3.name); }}
    }
    return false;
  }
};

const stopVADWakeWordRecognition = (abort: boolean = true) => {
  const recognizer = vadWakeWordDetectionRecognition;
  isVADRestartPending = false;
  if (recognizer) {
    if (isVADListeningForWakeWord.value) {
        try { if (abort) recognizer.abort(); else recognizer.stop(); }
        catch (e) { isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); }
    } else { try { recognizer.abort(); } catch (e) {} }
  } else { isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); }
};

const reinitialize = async () => {
    console.log("[BSH] Reinitializing."); await stopAll(true);
    if (props.audioInputMode === 'voice-activation' && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) { // Check LLM status
        startVADWakeWordRecognition();
    }
};
const stopAll = async (abort: boolean = true) => {
    console.log("[BSH] Stopping all."); isVADRestartPending = false;
    if (webSpeechRecognition) { try { if(abort) webSpeechRecognition.abort(); else webSpeechRecognition.stop(); } catch(e){} }
    _stopBrowserWebSpeechRecognitionInternalStates();
    if (vadWakeWordDetectionRecognition) { try { if(abort) vadWakeWordDetectionRecognition.abort(); else vadWakeWordDetectionRecognition.stop(); } catch(e){} }
    if (isVADListeningForWakeWord.value) { isVADListeningForWakeWord.value = false; emit('is-listening-for-wake-word', false); }
    _cleanUpAfterWebSpeechTranscription(); pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = '';
    if (vadCommandBrowserSTTFinalizationTimer) clearTimeout(vadCommandBrowserSTTFinalizationTimer); vadCommandBrowserSTTFinalizationTimer = null;
    clearPauseTimerForWebSpeech();
};

const hasPendingTranscript = computed(() => !!pendingTranscriptWebSpeech.value.trim());
const triggerEditPendingTranscript = () => { if (hasPendingTranscript.value) emit('request-edit-pending-transcript', pendingTranscriptWebSpeech.value); };
const clearPendingTranscript = () => {
    pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = '';
    clearPauseTimerForWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
};

// Watcher to manage VAD wake word listener based on parentIsProcessingLLM
watch(() => props.parentIsProcessingLLM, (isLLMProcessing) => {
    if (props.audioInputMode === 'voice-activation') {
        if (isLLMProcessing) {
            if (isVADListeningForWakeWord.value) {
                console.log("[BSH] Parent LLM started processing, stopping VAD wake word listener.");
                stopVADWakeWordRecognition(true); // Abort
            }
        } else {
            // LLM finished. If VAD listener is not active, and no command ongoing, and permission granted, restart it.
            if (!isVADListeningForWakeWord.value && !isBrowserWebSpeechActive.value && permissionStatus.value === 'granted') {
                console.log("[BSH] Parent LLM finished processing, restarting VAD wake word listener.");
                startVADWakeWordRecognition();
            }
        }
    }
});


defineExpose({
  startListening, stopListening, startVADWakeWordRecognition, stopVADWakeWordRecognition,
  reinitialize, stopAll, isBrowserWebSpeechActive, isVADListeningForWakeWord,
  hasPendingTranscript, triggerEditPendingTranscript, clearPendingTranscript,
  pauseDetectedWebSpeech, pauseCountdownWebSpeech,
});

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) {
    console.log(`[BSH] audioInputMode changed: ${oldMode} -> ${newMode}.`);
    await stopAll(true); await nextTick();
    if (permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
        if (newMode === 'voice-activation') startVADWakeWordRecognition();
        else if (newMode === 'continuous') startListening();
    }
  }
});
watch(() => props.settings.speechLanguage, (newLang, oldLang) => {
    if (newLang !== oldLang && newLang && oldLang) { reinitialize(); }
});

onMounted(() => {
  if (permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      if (props.audioInputMode === 'voice-activation') startVADWakeWordRecognition();
      else if (props.audioInputMode === 'continuous') startListening();
  }
});
onBeforeUnmount(async () => { await stopAll(true); webSpeechRecognition = null; vadWakeWordDetectionRecognition = null; });
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
        <span class="font-semibold text-xs text-gray-500">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
    </div>
    <div v-if="isVoiceActivationMode && isVADListeningForWakeWord" class="live-transcript-display-ephemeral vad-wake-word-status">
      Say "V" to activate... <SparklesIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" />
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
  font-size: 0.75rem; /* text-xs */
  text-align: center;
  font-style: italic;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem; /* py-1 */
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}
.live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; font-size: 0.8rem; }
.pending-transcript-ephemeral { color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l)); }
</style>