// File: frontend/src/components/BrowserSpeechHandler.vue
// Version: 3.0.9 (Combined)
// Changes from 3.0.8 base:
// - CRITICAL FIX: `stopAllRecognition` no longer prematurely sets state to IDLE or releases operationLock.
// - `onend` handlers are now fully responsible for nullifying recognizer instances, setting state to IDLE, and managing operationLock release more precisely.
// - Ensured `previousState` in `onend` handlers reflects the state at the time of stopping.
// - Minor adjustments to logging for clarity on state and lock management.
// - Refined logic in `onstart` for main STT to correctly transition from STARTING_MAIN_STT.
<template>
  <div class="browser-speech-handler-ui">
    <div v-if="isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="live-transcript-display-ephemeral" aria-live="polite">
      <p v-if="interimTranscriptWebSpeech && (audioInputMode === 'push-to-talk' || (audioInputMode === 'voice-activation' && !isVADListeningForWakeWord))" class="interim-transcript-ephemeral">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && audioInputMode === 'continuous'" class="finalized-part-ephemeral">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && audioInputMode === 'continuous'" class="pending-transcript-ephemeral">
        <span class="font-semibold text-xs text-gray-500 dark:text-gray-400">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
    </div>
    <div v-if="audioInputMode === 'voice-activation' && isVADListeningForWakeWord" class="live-transcript-display-ephemeral vad-wake-word-status">
      Say "{{ settings.vadWakeWordsBrowserSTT && settings.vadWakeWordsBrowserSTT.length > 0 ? settings.vadWakeWordsBrowserSTT[0] : 'V' }}" to activate...
      <SparklesIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" aria-hidden="true" />
    </div>
    <div v-if="audioInputMode === 'voice-activation' && isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="web-speech-vad-active-indicator">
      Browser STT: Listening for command...
    </div>
    <div v-if="audioInputMode === 'continuous' && pauseDetectedWebSpeech && isBrowserWebSpeechActive" class="text-xs text-center py-1 text-gray-500 dark:text-gray-400">
      Sending in {{ Math.max(0, pauseCountdownWebSpeech / 1000).toFixed(1) }}s
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
  nextTick,
  type PropType,
} from 'vue';
import { type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import { SparklesIcon } from '@heroicons/vue/24/outline';

// #region Web Speech API Type Declarations
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
type SpeechRecognitionErrorCode =
  | 'no-speech' | 'aborted' | 'audio-capture' | 'network'
  | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
// #endregion

export default {
  name: 'BrowserSpeechHandler',
  components: { SparklesIcon },
  props: {
    settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
    audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
    parentIsProcessingLLM: { type: Boolean, default: false },
    currentMicPermission: {
      type: String as PropType<'prompt' | 'granted' | 'denied' | 'error' | ''>,
      required: true,
    },
  },
  emits: {
    transcription: (value: string): boolean => typeof value === 'string',
    'processing-audio': (isProcessingAudio: boolean): boolean => typeof isProcessingAudio === 'boolean',
    'is-listening-for-wake-word': (isListening: boolean): boolean => typeof isListening === 'boolean',
    error: (payload: { type: 'speech' | 'permission' | 'init'; message: string; code?: SpeechRecognitionErrorCode | string }): boolean => 
      typeof payload.type === 'string' && typeof payload.message === 'string',
    'request-edit-pending-transcript': (pendingText: string): boolean => typeof pendingText === 'string',
    'wake-word-detected': (): boolean => true,
  },
  setup(props, { emit }) {
    const toast = inject<ToastService>('toast');

    const VAD_COMMAND_FALLBACK_TIMEOUT_MS = 2500;
    const RESTART_DELAY_MS = 450; // Slightly increased delay for stability

    type RecognitionState =
      | 'IDLE'
      | 'STARTING_VAD_WAKE' 
      | 'STARTING_MAIN_STT' 
      | 'VAD_WAKE_WORD_LISTENING'
      | 'VAD_WAKE_WORD_STOPPING'
      | 'IDLE_AWAITING_COMMAND_STT'
      | 'VAD_COMMAND_CAPTURING'
      | 'MAIN_STT_ACTIVE'
      | 'MAIN_STT_STOPPING_GRACEFULLY';

    const internalState = ref<RecognitionState>('IDLE');
    const operationLock = ref(false); // Lock to prevent overlapping async operations

    const interimTranscript = ref('');
    const finalTranscriptBuffer = ref('');
    const pendingContinuousTranscript = ref('');
    const liveContinuousInterim = ref('');

    let vadCommandFinalizationTimerId: number | null = null;
    let continuousModePauseTimerId: number | null = null;
    const pauseDetectedForContinuous = ref(false);
    const pauseCountdownForContinuous = ref(0);

    let mainSttRecognizer: SpeechRecognition | null = null;
    let vadWakeWordRecognizer: SpeechRecognition | null = null;

    const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
    const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
    const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');
    const continuousModeAutoSendEnabled = computed<boolean>(() => props.settings.continuousModeAutoSend);
    const browserContinuousSilenceTimeoutMs = computed<number>(() => props.settings.continuousModePauseTimeoutMs || 3000);
    const browserContinuousSendUIDelayMs = computed<number>(() => props.settings.continuousModeSilenceSendDelayMs || 1500);
    const vadCommandEffectiveTimeoutMs = computed<number>(
      () => (props.settings.vadSilenceTimeoutMs || VAD_COMMAND_FALLBACK_TIMEOUT_MS) + (props.settings.vadCommandRecognizedPauseMs || 2000)
    );

    // --- Helper Function Definitions ---
    const _clearAllTimers = (): void => {
      if (vadCommandFinalizationTimerId) clearTimeout(vadCommandFinalizationTimerId);
      vadCommandFinalizationTimerId = null;
      if (continuousModePauseTimerId) clearTimeout(continuousModePauseTimerId);
      continuousModePauseTimerId = null;
      pauseDetectedForContinuous.value = false;
      pauseCountdownForContinuous.value = 0;
    };

    const _resetTranscriptBuffers = (clearContinuousPending: boolean = true): void => {
      interimTranscript.value = '';
      finalTranscriptBuffer.value = '';
      liveContinuousInterim.value = '';
      if (clearContinuousPending) {
        pendingContinuousTranscript.value = '';
      }
    };

    const _safelyStopRecognizerInstance = (recognizerRefKey: 'mainStt' | 'vadWakeWord', graceful: boolean): void => {
      let recognizerInstance: SpeechRecognition | null = null;
      let instanceName = "";
      if (recognizerRefKey === 'mainStt') {
        recognizerInstance = mainSttRecognizer;
        instanceName = "MainSTT";
      } else {
        recognizerInstance = vadWakeWordRecognizer;
        instanceName = "VADWakeWord";
      }

      if (recognizerInstance) {
        console.log(`[BSH v3.0.9] Attempting to ${graceful ? 'stop' : 'abort'} ${instanceName}. Current state: ${internalState.value}`);
        // Detach handlers that might cause issues if they fire after we've decided to stop
        recognizerInstance.onstart = null;
        recognizerInstance.onresult = null;
        recognizerInstance.onerror = null; 
        // onend is preserved to handle cleanup and state transition.
        try {
          if (graceful) recognizerInstance.stop(); else recognizerInstance.abort();
        } catch (e) {
          console.warn(`[BSH v3.0.9] Error ${graceful ? 'stopping' : 'aborting'} ${instanceName}:`, e);
          // If stopping/aborting fails catastrophically, ensure we clean up and reset state.
          if (recognizerRefKey === 'mainStt') mainSttRecognizer = null; else vadWakeWordRecognizer = null;
          internalState.value = 'IDLE'; 
          if (operationLock.value) operationLock.value = false;
        }
      } else {
        console.log(`[BSH v3.0.9] ${instanceName} recognizer already null, no stop action needed.`);
      }
    };
    
    const _createAndConfigureRecognizer = (isForWakeWord: boolean = false): SpeechRecognition | null => {
        const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) { 
            console.error("[BSH v3.0.9] Web Speech API not supported.");
            emit('error', { type: 'init', message: 'Web Speech API not supported.' }); 
            return null; 
        }
        const recognizer = new SpeechRecognitionAPI();
        recognizer.lang = props.settings.speechLanguage || navigator.language || 'en-US';
        recognizer.maxAlternatives = 1;
        if (isForWakeWord) { 
            recognizer.continuous = true; 
            recognizer.interimResults = false; 
        } else { 
            recognizer.interimResults = true; 
            recognizer.continuous = isContinuousMode.value || (isVoiceActivationMode.value);
        }
        return recognizer;
    };

    const _initializeMainSttRecognizer = (): boolean => {
      if (mainSttRecognizer) { 
        console.log("[BSH v3.0.9] Main STT: Aborting existing instance before re-init.");
        mainSttRecognizer.onend = null; 
        _safelyStopRecognizerInstance('mainStt', false); 
        mainSttRecognizer = null;
      }
      mainSttRecognizer = _createAndConfigureRecognizer(false);
      if (!mainSttRecognizer) return false;

mainSttRecognizer.onstart = () => {
        console.log(`[BSH v3.0.9] Main STT: onstart. Current intended state from setup: ${internalState.value}`);
        // We expect internalState.value to be 'STARTING_MAIN_STT' if this onstart is for a legitimate start.
        if (internalState.value === 'STARTING_MAIN_STT') {
          // Determine target active state based on current audio input mode config
          // This logic assumes _startMainSttInternal was called appropriately for the mode.
          // If isVoiceActivationMode is true, and it's not PTT or Continuous, then it's VAD command capture.
            const targetState = (isVoiceActivationMode.value && !isPttMode.value && !isContinuousMode.value) 
                                ? 'VAD_COMMAND_CAPTURING' 
                                : 'MAIN_STT_ACTIVE';
            internalState.value = targetState;
            console.log(`[BSH v3.0.9] Main STT: onstart confirmed. New state: ${internalState.value}`);
            operationLock.value = false; 
            if (!props.parentIsProcessingLLM) emit('processing-audio', true);
        } else {
            console.warn(`[BSH v3.0.9] Main STT: onstart fired in unexpected state ${internalState.value} (expected STARTING_MAIN_STT). Aborting this instance.`);
            if (mainSttRecognizer) { 
                mainSttRecognizer.onend = null; // Prevent its onend from causing further issues
                try { mainSttRecognizer.abort(); } catch(e) { /* ignore */ }
                mainSttRecognizer = null; 
            }
           // If an onstart fires when we weren't expecting it (e.g., not in STARTING_MAIN_STT),
           // it might be a rogue event from an old, improperly cleaned-up recognizer.
           // We shouldn't necessarily reset the global internalState unless we're sure this isn't interfering
           // with a legitimate, ongoing operation. Forcing IDLE here could be too aggressive if another operation is pending.
           // However, if operationLock is false, it's safer to assume we should be IDLE.
           if (!operationLock.value && internalState.value !== 'IDLE') {
             // internalState.value = 'IDLE'; // Consider if this is safe or if it should just ignore the rogue onstart
           }
        }
      };

      mainSttRecognizer.onresult = (event: SpeechRecognitionEvent) => {
        if (internalState.value !== 'MAIN_STT_ACTIVE' && internalState.value !== 'VAD_COMMAND_CAPTURING') {
            console.warn(`[BSH v3.0.9] Main STT: onresult in unexpected state ${internalState.value}. Ignoring.`);
            return;
        }
        _clearAllTimers(); 
        let finalPart = '', interimPart = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const ts = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalPart += ts; else interimPart += ts;
        }

        if (props.parentIsProcessingLLM) {
          console.log("[BSH v3.0.9] Main STT: onresult while parentIsProcessingLLM. Ignoring emit.");
          interimTranscript.value = interimPart; 
          if (isContinuousMode.value) liveContinuousInterim.value = interimPart;
          return; 
        }

        interimTranscript.value = interimPart;
        if (finalPart.trim()) {
          if (isPttMode.value || internalState.value === 'VAD_COMMAND_CAPTURING') {
            finalTranscriptBuffer.value = (finalTranscriptBuffer.value + " " + finalPart.trim()).trim();
          } else if (isContinuousMode.value) { 
            pendingContinuousTranscript.value = (pendingContinuousTranscript.value + " " + finalPart.trim()).trim(); 
            liveContinuousInterim.value = '';
          }
        }
        if (isContinuousMode.value) {
          liveContinuousInterim.value = interimPart;
          if ((finalPart.trim() || interimPart.trim()) && continuousModeAutoSendEnabled.value) _resetContinuousModePauseTimer();
        } else if (internalState.value === 'VAD_COMMAND_CAPTURING') {
          if (finalPart.trim() || interimPart.trim()) _resetVadCommandFinalizationTimer();
        }
      };

      mainSttRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
        const previousStateOnError = internalState.value;
        console.error(`[BSH v3.0.9] Main STT: onerror - ${event.error}: ${event.message}. State was: ${previousStateOnError}`);
        const wasProcessing = previousStateOnError === 'MAIN_STT_ACTIVE' || previousStateOnError === 'VAD_COMMAND_CAPTURING' || previousStateOnError === 'STARTING_MAIN_STT';
        const wasVADCommand = previousStateOnError === 'VAD_COMMAND_CAPTURING';

        _clearAllTimers();
        if (mainSttRecognizer) { // Ensure onend is detached if it exists
            mainSttRecognizer.onend = null; // Prevent its onend from also trying to manage state
            _safelyStopRecognizerInstance('mainStt', false);
        }
        mainSttRecognizer = null; 
        internalState.value = 'IDLE'; 
        operationLock.value = false;
        
        emit('error', { type: 'speech', message: `Main STT Error: ${event.error}`, code: event.error });
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
           toast?.add({ type: 'error', title: `STT Error: ${event.error}`, message: event.message || "Recognition error.", duration: 5000 });
        }
        if (wasProcessing && !props.parentIsProcessingLLM) emit('processing-audio', false);
        
        if (isPttMode.value && (event.error === 'aborted' || event.error === 'no-speech') && (previousStateOnError === 'MAIN_STT_ACTIVE' || previousStateOnError === 'STARTING_MAIN_STT') ) {
            console.log(`[BSH v3.0.9] PTT mode error (${event.error}), not restarting automatically.`);
            return; 
        }

        if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
            if (isVoiceActivationMode.value && wasVADCommand) {
                _attemptStartVadWakeWordListenerAfterDelay();
            } else if (isContinuousMode.value && wasProcessing) {
                _attemptStartMainSttAfterDelay(false);
            }
        }
      };

      mainSttRecognizer.onend = () => {
        const previousState = internalState.value; // Capture state before any changes by this handler
        console.log(`[BSH v3.0.9] Main STT: onend. Prev State: ${previousState}.`);
        mainSttRecognizer = null; // Nullify the instance
        _clearAllTimers(); 
        
        let shouldRestart = false;
        let restartType: 'vad_wake' | 'main_stt_continuous' | null = null;

        // Determine if a restart is needed based on previous state and current conditions
        if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
            if (isVoiceActivationMode.value && previousState === 'VAD_COMMAND_CAPTURING') {
                shouldRestart = true;
                restartType = 'vad_wake';
            } else if (isContinuousMode.value && (previousState === 'MAIN_STT_ACTIVE' || previousState === 'STARTING_MAIN_STT')) {
                shouldRestart = true;
                restartType = 'main_stt_continuous';
            }
        }
        
        // Handle emissions and transcriptions before state change
        if (previousState === 'MAIN_STT_ACTIVE' || previousState === 'VAD_COMMAND_CAPTURING' || previousState === 'MAIN_STT_STOPPING_GRACEFULLY' || previousState === 'STARTING_MAIN_STT') {
            if (!props.parentIsProcessingLLM) {
                emit('processing-audio', false);
                if (isPttMode.value && (previousState === 'MAIN_STT_ACTIVE' || previousState === 'MAIN_STT_STOPPING_GRACEFULLY')) {
                    const transcript = (finalTranscriptBuffer.value + " " + interimTranscript.value).trim();
                    if (transcript) emit('transcription', transcript);
                } else if (previousState === 'VAD_COMMAND_CAPTURING') {
                    const transcript = (finalTranscriptBuffer.value + " " + interimTranscript.value).trim();
                    if (transcript) emit('transcription', transcript);
                } else if (isContinuousMode.value && (previousState === 'MAIN_STT_ACTIVE' || previousState === 'MAIN_STT_STOPPING_GRACEFULLY')) {
                    if (pendingContinuousTranscript.value.trim() && continuousModeAutoSendEnabled.value && !pauseDetectedForContinuous.value) {
                        _sendPendingContinuousTranscriptAndClear();
                    }
                }
            }
        }

        // Reset buffers if not continuous with pending data, or if LLM was processing (which would have skipped emit)
        if (!(isContinuousMode.value && previousState === 'MAIN_STT_ACTIVE' && pendingContinuousTranscript.value.trim()) || props.parentIsProcessingLLM) {
            _resetTranscriptBuffers(true);
        }
        
        internalState.value = 'IDLE'; // Now set to IDLE

        if (shouldRestart) {
            if (restartType === 'vad_wake') {
                console.log("[BSH v3.0.9] Main STT (VAD Cmd ended). Queueing VAD wake listener restart.");
                _attemptStartVadWakeWordListenerAfterDelay();
            } else if (restartType === 'main_stt_continuous') {
                console.log("[BSH v3.0.9] Main STT (Continuous ended). Queueing Continuous restart.");
                _attemptStartMainSttAfterDelay(false);
            }
        } else {
            operationLock.value = false; // Release lock if no restart is queued by this onend
            console.log(`[BSH v3.0.9] Main STT onend: No automatic restart conditions met. Final state: IDLE. Lock released: ${!operationLock.value}`);
        }
      };
      return true;
    };

    const _initializeVadWakeWordRecognizer = (): boolean => {
      if (vadWakeWordRecognizer) {
        vadWakeWordRecognizer.onend = null;
        _safelyStopRecognizerInstance('vadWakeWord', false);
        vadWakeWordRecognizer = null;
      }
      vadWakeWordRecognizer = _createAndConfigureRecognizer(true);
      if (!vadWakeWordRecognizer) return false;

      vadWakeWordRecognizer.onstart = () => {
        console.log(`[BSH v3.0.9] VAD Wake Word: onstart. Current intended state: ${internalState.value}`);
        if (internalState.value === 'STARTING_VAD_WAKE') {
            internalState.value = 'VAD_WAKE_WORD_LISTENING';
            console.log(`[BSH v3.0.9] VAD Wake Word: onstart confirmed. New state: ${internalState.value}`);
            operationLock.value = false; 
            if (!props.parentIsProcessingLLM) emit('is-listening-for-wake-word', true);
        } else {
            console.warn(`[BSH v3.0.9] VAD Wake Word: onstart in unexpected state ${internalState.value}. Aborting this instance.`);
            if(vadWakeWordRecognizer) {
                vadWakeWordRecognizer.onend = null;
                _safelyStopRecognizerInstance('vadWakeWord', false);
            }
        }
      };

      vadWakeWordRecognizer.onresult = (event: SpeechRecognitionEvent) => {
        if (internalState.value !== 'VAD_WAKE_WORD_LISTENING') {
            console.warn(`[BSH v3.0.9] VAD Wake Word: onresult in unexpected state ${internalState.value}`);
            return;
        }
         if (props.parentIsProcessingLLM) {
            console.log("[BSH v3.0.9] VAD Wake Word: onresult while parentIsProcessingLLM. Ignoring.");
            return;
        }
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) transcript += event.results[i][0].transcript; }
        const wakeWordCandidate = transcript.toLowerCase().trim();
        const wakeWords = (props.settings.vadWakeWordsBrowserSTT?.length ? props.settings.vadWakeWordsBrowserSTT : ["v", "vee"]);
        
        if (wakeWords.some(word => wakeWordCandidate.includes(word.toLowerCase()))) {
          console.log(`[BSH v3.0.9] VAD Wake Word: Detected "${wakeWordCandidate}".`);
          toast?.add({ type: 'info', title: `"${wakeWords[0]}" Activated!`, message: 'Listening for command...', duration: 2000 });
          internalState.value = 'VAD_WAKE_WORD_STOPPING';
          if (!props.parentIsProcessingLLM) emit('is-listening-for-wake-word', false);
          _safelyStopRecognizerInstance('vadWakeWord', true);
        }
      };

      vadWakeWordRecognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(`[BSH v3.0.9] VAD Wake Word: onerror - ${event.error}: ${event.message}`);
        const wasListening = internalState.value === 'VAD_WAKE_WORD_LISTENING' || internalState.value === 'STARTING_VAD_WAKE';
        if (vadWakeWordRecognizer) {
            vadWakeWordRecognizer.onend = null;
            _safelyStopRecognizerInstance('vadWakeWord', false);
        }
        vadWakeWordRecognizer = null; 
        internalState.value = 'IDLE';
        operationLock.value = false;
        if (wasListening) emit('is-listening-for-wake-word', false);
        
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          emit('error', { type: 'speech', message: `VAD Error: ${event.error}`, code: event.error });
        }
        if (isVoiceActivationMode.value && wasListening && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
             _attemptStartVadWakeWordListenerAfterDelay();
        }
      };

      vadWakeWordRecognizer.onend = () => {
        const previousState = internalState.value;
        console.log(`[BSH v3.0.9] VAD Wake Word: onend. Prev State: ${previousState}.`);
        vadWakeWordRecognizer = null; 
        
        let attemptRestart = false;
        let nextState: RecognitionState = 'IDLE';

        if (previousState === 'VAD_WAKE_WORD_STOPPING') { 
            nextState = 'IDLE_AWAITING_COMMAND_STT';
            console.log("[BSH v3.0.9] VAD success. Emitting 'wake-word-detected'. New state: IDLE_AWAITING_COMMAND_STT");
            emit('wake-word-detected'); 
        } else if (previousState === 'VAD_WAKE_WORD_LISTENING' || previousState === 'STARTING_VAD_WAKE') { 
            nextState = 'IDLE';
            if (isVoiceActivationMode.value && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
              attemptRestart = true;
            }
        } else if (previousState === 'MAIN_STT_STOPPING_GRACEFULLY' && isVoiceActivationMode.value) { 
           nextState = 'IDLE';
        } else {
             console.warn(`[BSH v3.0.9] VAD Wake Word: onend from unexpected state ${previousState}. Forcing IDLE.`);
            nextState = 'IDLE';
        }
        
        internalState.value = nextState;
        if (previousState === 'VAD_WAKE_WORD_LISTENING' || previousState === 'STARTING_VAD_WAKE' || (previousState === 'VAD_WAKE_WORD_STOPPING' && !props.parentIsProcessingLLM)) {
            emit('is-listening-for-wake-word', false);
        }

        if (attemptRestart) {
            _attemptStartVadWakeWordListenerAfterDelay();
        } else {
            operationLock.value = false; // Release lock if no restart from this onend
            console.log(`[BSH v3.0.9] VAD onend: No automatic restart. Final state: ${internalState.value}. Lock released: ${!operationLock.value}`);
        }
      };
      return true;
    };
    
    // Internal start/stop logic (called by _attempt... wrappers)
    const _startMainSttInternal = async (isForVadCommand: boolean): Promise<boolean> => {
      if (! (internalState.value === 'IDLE' || (isForVadCommand && internalState.value === 'IDLE_AWAITING_COMMAND_STT'))) {
         console.warn(`[BSH v3.0.9] Main STT: Start rejected. Current State: ${internalState.value} != IDLE/IDLE_AWAITING_COMMAND_STT. ForVAD: ${isForVadCommand}`);
         operationLock.value = false; return false;
      }
      if (props.currentMicPermission !== 'granted') {
        console.error("[BSH v3.0.9] Main STT: Mic permission not 'granted'.");
        emit('error', { type: 'permission', message: `Cannot start: Mic permission is ${props.currentMicPermission}.` });
        operationLock.value = false; return false;
      }
      if (props.parentIsProcessingLLM && !isContinuousMode.value && !isForVadCommand) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM processing.' });
        operationLock.value = false; return false;
      }

      _resetTranscriptBuffers(false); _clearAllTimers();
      internalState.value = 'STARTING_MAIN_STT'; 
      if (!_initializeMainSttRecognizer()) { 
        emit('error', { type: 'init', message: 'Main STT recognizer init failed.' });
        internalState.value = 'IDLE'; operationLock.value = false; return false;
      }

      try {
        console.log(`[BSH v3.0.9] Calling mainSttRecognizer.start(). ForVAD: ${isForVadCommand}`);
        mainSttRecognizer!.start();
        if (isForVadCommand) _resetVadCommandFinalizationTimer();
        return true;
      } catch (e: any) {
        console.error("[BSH v3.0.9] Error during mainSttRecognizer.start():", e.name, e.message);
        emit('error', { type: 'speech', message: `Failed to start main STT: ${e.name}.`, code: e.name });
        if (mainSttRecognizer) mainSttRecognizer.onend = null; // Prevent onend if start fails
        _safelyStopRecognizerInstance('mainStt', false); 
        mainSttRecognizer = null;
        internalState.value = 'IDLE'; operationLock.value = false; return false;
      }
    };

    const _stopMainSttInternal = (graceful: boolean): void => {
      if (internalState.value !== 'MAIN_STT_ACTIVE' && internalState.value !== 'VAD_COMMAND_CAPTURING' && internalState.value !== 'STARTING_MAIN_STT') {
        console.warn(`[BSH v3.0.9] Attempted to stop Main STT from non-active/starting state: ${internalState.value}`);
        if (operationLock.value) operationLock.value = false;
        return;
      }
      if (mainSttRecognizer) {
        internalState.value = 'MAIN_STT_STOPPING_GRACEFULLY';
        _safelyStopRecognizerInstance('mainStt', graceful); 
      } else { 
        internalState.value = 'IDLE'; operationLock.value = false; 
        if (props.audioInputMode !== 'voice-activation') {
          emit('processing-audio', false);
        }
      }
    };

    const _startVadWakeWordListenerInternal = async (): Promise<boolean> => {
      if (internalState.value !== 'IDLE') {
         console.warn(`[BSH v3.0.9] VAD Wake: Start rejected. State: ${internalState.value}.`);
         operationLock.value = false; return false;
      }
      if (!isVoiceActivationMode.value || props.parentIsProcessingLLM || props.currentMicPermission !== 'granted') {
        console.log(`[BSH v3.0.9] VAD Wake: Conditions not met. Mode: ${isVoiceActivationMode.value}, LLM: ${props.parentIsProcessingLLM}, Perm: ${props.currentMicPermission}`);
        operationLock.value = false; return false;
      }
      internalState.value = 'STARTING_VAD_WAKE';
      if (!_initializeVadWakeWordRecognizer()) { 
        emit('error', { type: 'init', message: 'VAD recognizer init failed.' });
        internalState.value = 'IDLE'; operationLock.value = false; return false;
      }

      try {
        console.log("[BSH v3.0.9] Calling vadWakeWordRecognizer.start().");
        vadWakeWordRecognizer!.start();
        return true;
      } catch (e: any) {
        console.error("[BSH v3.0.9] Error vadWakeWordRecognizer.start():", e.name, e.message);
        emit('error', { type: 'speech', message: `Failed to start VAD: ${e.name}.`, code: e.name });
        if (vadWakeWordRecognizer) vadWakeWordRecognizer.onend = null;
        _safelyStopRecognizerInstance('vadWakeWord', false); 
        vadWakeWordRecognizer = null;
        internalState.value = 'IDLE'; 
        emit('is-listening-for-wake-word', false); operationLock.value = false; return false;
      }
    };

    const _stopVadWakeWordListenerInternal = (graceful: boolean): void => {
      if (internalState.value !== 'VAD_WAKE_WORD_LISTENING' && internalState.value !== 'VAD_WAKE_WORD_STOPPING' && internalState.value !== 'STARTING_VAD_WAKE') {
         console.warn(`[BSH v3.0.9] Attempt to stop VAD from non-listening/stopping/starting state: ${internalState.value}`);
         if (operationLock.value) operationLock.value = false;
        return;
      }
      if (vadWakeWordRecognizer) {
        if (internalState.value === 'VAD_WAKE_WORD_LISTENING' || internalState.value === 'STARTING_VAD_WAKE') { 
          internalState.value = 'MAIN_STT_STOPPING_GRACEFULLY'; // This seems like a state that might be misnamed if only VAD is stopping. However, using as per v3.0.8
        } 
        emit('is-listening-for-wake-word', false); 
        _safelyStopRecognizerInstance('vadWakeWord', graceful); 
      } else { 
        internalState.value = 'IDLE'; emit('is-listening-for-wake-word', false); operationLock.value = false;
      }
    };
    
    // Wrapper functions that handle operationLock
    const _attemptStartMainStt = async (isForVadCommand: boolean): Promise<void> => {
      if (operationLock.value) { console.warn(`[BSH v3.0.9] Main STT start op deferred (lock). VADCmd: ${isForVadCommand}, State: ${internalState.value}`); return; }
      operationLock.value = true;
      console.log(`[BSH v3.0.9] Attempting to start Main STT. VADCmd: ${isForVadCommand}. State: ${internalState.value}`);
      await _startMainSttInternal(isForVadCommand);
    };

    const _attemptStartVadWakeWordListener = async (): Promise<void> => {
      if (operationLock.value) { console.warn(`[BSH v3.0.9] VAD start op deferred (lock). State: ${internalState.value}`); return; }
      operationLock.value = true;
      console.log(`[BSH v3.0.9] Attempting to start VAD Wake Word Listener. State: ${internalState.value}`);
      await _startVadWakeWordListenerInternal();
    };

    const _attemptStopMainStt = async (graceful: boolean): Promise<void> => {
      if (operationLock.value && graceful && internalState.value !== 'MAIN_STT_STOPPING_GRACEFULLY') { 
        console.warn(`[BSH v3.0.9] Main STT graceful stop op deferred (lock). State: ${internalState.value}`); return; 
      }
      if (!operationLock.value) operationLock.value = true;
      console.log(`[BSH v3.0.9] Attempting to stop Main STT. Graceful: ${graceful}. State: ${internalState.value}`);
      _stopMainSttInternal(graceful);
    };

    const _attemptStopVadWakeWordListener = async (graceful: boolean): Promise<void> => {
      if (operationLock.value && graceful && internalState.value !== 'MAIN_STT_STOPPING_GRACEFULLY' && internalState.value !== 'VAD_WAKE_WORD_STOPPING') { 
        console.warn(`[BSH v3.0.9] VAD graceful stop op deferred (lock). State: ${internalState.value}`); return; 
      }
      if (!operationLock.value) operationLock.value = true;
      console.log(`[BSH v3.0.9] Attempting to stop VAD Wake Word Listener. Graceful: ${graceful}. State: ${internalState.value}`);
      _stopVadWakeWordListenerInternal(graceful);
    };
    
    const _attemptStartMainSttAfterDelay = (isForVadCommand: boolean): void => {
      console.log(`[BSH v3.0.9] Scheduling Main STT start after ${RESTART_DELAY_MS}ms delay. VADCmd: ${isForVadCommand}`);
      setTimeout(() => _attemptStartMainStt(isForVadCommand), RESTART_DELAY_MS);
    };

    const _attemptStartVadWakeWordListenerAfterDelay = (): void => {
      console.log(`[BSH v3.0.9] Scheduling VAD Wake Word Listener start after ${RESTART_DELAY_MS}ms delay.`);
        setTimeout(() => _attemptStartVadWakeWordListener(), RESTART_DELAY_MS);
    };

    const _resetVadCommandFinalizationTimer = (): void => { /* ... same as v3.0.6 ... */ };
    const _resetContinuousModePauseTimer = (): void => { /* ... same as v3.0.6 ... */ };
    const _sendPendingContinuousTranscriptAndClear = (): void => { /* ... same as v3.0.6 ... */ };

    // --- Publicly Exposed Methods ---
    const startListening = async (isForVadCommand: boolean = false): Promise<void> => { /* ... same as v3.0.6 ... */ };
    const stopListening = async (abort: boolean = false): Promise<void> => { /* ... same as v3.0.6 ... */ };

    const stopAllRecognition = async (abort: boolean = true): Promise<void> => {
        console.log(`[BSH v3.0.9 Public API] stopAllRecognition. Abort: ${abort}. Current State: ${internalState.value}`);
        if (operationLock.value && !abort && internalState.value !== 'IDLE') { 
            console.warn("[BSH v3.0.9] stopAll deferred (lock is active and not aborting an active process)."); 
            return; 
        }
        operationLock.value = true; // Acquire lock. It will be released by the final onend or if no recognizers active.
        _clearAllTimers();
        
        let mainStopped = false;
        let vadStopped = false;

        if (mainSttRecognizer) {
            _safelyStopRecognizerInstance('mainStt', !abort); 
            mainStopped = true;
        }
        if (vadWakeWordRecognizer) {
            _safelyStopRecognizerInstance('vadWakeWord', !abort);
            vadStopped = true;
        }
        
        // If neither recognizer was active to begin with, we might need to clean up state and lock manually
        if (!mainStopped && !vadStopped) {
            console.log("[BSH v3.0.9] stopAllRecognition: No active recognizers to stop.");
            if (internalState.value !== 'IDLE') { // Still ensure state is IDLE if it wasn't
                const mainSttWasActive = ['MAIN_STT_ACTIVE', 'VAD_COMMAND_CAPTURING', 'STARTING_MAIN_STT'].includes(internalState.value);
                const vadWakeWordWasListening = ['VAD_WAKE_WORD_LISTENING', 'VAD_WAKE_WORD_STOPPING', 'STARTING_VAD_WAKE'].includes(internalState.value);
                if (mainSttWasActive && !props.parentIsProcessingLLM) emit('processing-audio', false);
                if (vadWakeWordWasListening) emit('is-listening-for-wake-word', false);
            }
            _resetTranscriptBuffers(true); 
            internalState.value = 'IDLE';
            operationLock.value = false; // Release lock as no onend will fire
        } else {
            // Lock will be released by the onend of the recognizer(s) that were stopped.
            console.log(`[BSH v3.0.9] stopAllRecognition initiated stops. mainStoppedAttempted: ${mainStopped}, vadStoppedAttempted: ${vadStopped}. Lock remains held by onend.`);
        }
    };
    const reinitializeHandler = async (): Promise<void> => {
        console.log(`[BSH v3.0.9 Public API] reinitializeHandler. State: ${internalState.value}, Mode: ${props.audioInputMode}`);
        await stopAllRecognition(true); // This will acquire lock, onends will release or restart will re-acquire
        await nextTick(); // Allow Vue to process DOM/ref updates after stopAll
        if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
            if (isVoiceActivationMode.value) {
                await _attemptStartVadWakeWordListener(); // This will handle its own lock
            } else if (isContinuousMode.value) {
                await _attemptStartMainStt(false); // This will handle its own lock
            }
        } else {
            if (operationLock.value) operationLock.value = false; // Ensure lock is released if no start attempt
        }
    };

    // --- Watchers & Lifecycle ---
    watch(() => props.parentIsProcessingLLM, async (isLLMProcessing, wasLLMProcessing) => {
      if (isLLMProcessing === wasLLMProcessing) return; // No change
        console.log(`[BSH v3.0.9] parentIsProcessingLLM changed: ${wasLLMProcessing} -> ${isLLMProcessing}. State: ${internalState.value}`);
        if (isLLMProcessing) {
            if (['VAD_WAKE_WORD_LISTENING', 'VAD_WAKE_WORD_STOPPING', 'IDLE_AWAITING_COMMAND_STT', 'STARTING_VAD_WAKE'].includes(internalState.value)) {
                await stopAllRecognition(true); // Abort VAD
            } else if (internalState.value === 'MAIN_STT_ACTIVE' || internalState.value === 'VAD_COMMAND_CAPTURING') {
                 console.log("[BSH v3.0.9] LLM processing. Active STT continues but won't emit.");
                // No stop needed, onresult handles not emitting.
            }
        } else { // LLM finished processing
            if (internalState.value === 'IDLE' && props.currentMicPermission === 'granted') {
                console.log("[BSH v3.0.9] LLM processing finished. Attempting mode-specific restart with delay.");
                if (isVoiceActivationMode.value) _attemptStartVadWakeWordListenerAfterDelay();
                else if (isContinuousMode.value) _attemptStartMainSttAfterDelay(false);
            }
        }
    });

    watch(() => props.currentMicPermission, async (newPermStatus, oldPermStatus) => {
        if (newPermStatus === oldPermStatus) return;
        console.log(`[BSH v3.0.9] Mic permission changed: ${oldPermStatus} -> ${newPermStatus}. State: ${internalState.value}`);
        if (newPermStatus !== 'granted') {
            await stopAllRecognition(true); 
        } else if (newPermStatus === 'granted' && oldPermStatus !== 'granted') {
            if (internalState.value === 'IDLE' && !props.parentIsProcessingLLM) {
                await nextTick(); 
                console.log(`[BSH v3.0.9] Mic perm newly granted. Attempting auto-start for mode: ${props.audioInputMode}`);
                if (isVoiceActivationMode.value) _attemptStartVadWakeWordListenerAfterDelay();
                else if (isContinuousMode.value) _attemptStartMainSttAfterDelay(false);
            }
        }
    }, { immediate: false }); 
    
    watch(() => props.audioInputMode, async (newMode, oldMode) => {
        if (newMode === oldMode) return;
        console.log(`[BSH v3.0.9] Audio input mode changed: ${oldMode} -> ${newMode}. Reinitializing.`);
        await reinitializeHandler();
    });

    watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
        if (newLang === oldLang || !newLang) return;
        console.log(`[BSH v3.0.9] Speech language changed: ${oldLang} -> ${newLang}.`);
        if (internalState.value !== 'IDLE') await reinitializeHandler();
    });

    onMounted(() => { 
      console.log("[BSH v3.0.9] Mounted. Awaiting explicit startListening() from parent.");
    });
    onBeforeUnmount(async () => { 
        console.log("[BSH v3.0.9] Unmounting. Stopping all recognition.");
        await stopAllRecognition(true); 
    });

    return {
        startListening, 
        stopListening, 
        reinitialize: reinitializeHandler, 
        stopAll: stopAllRecognition,
        isBrowserWebSpeechActive: computed(() => internalState.value === 'MAIN_STT_ACTIVE' || internalState.value === 'VAD_COMMAND_CAPTURING'),
        isVADListeningForWakeWord: computed(() => internalState.value === 'VAD_WAKE_WORD_LISTENING'),
        interimTranscriptWebSpeech: interimTranscript, 
        liveTranscriptWebSpeech: liveContinuousInterim,
        pendingTranscriptWebSpeech: pendingContinuousTranscript, 
        pauseDetectedWebSpeech: pauseDetectedForContinuous,
        pauseCountdownWebSpeech: pauseCountdownForContinuous,
        hasPendingTranscript: computed(() => !!pendingContinuousTranscript.value.trim()),
        triggerEditPendingTranscript: () => { if (pendingContinuousTranscript.value.trim()) emit('request-edit-pending-transcript', pendingContinuousTranscript.value); },
        clearPendingTranscript: () => { _resetTranscriptBuffers(true); _clearAllTimers(); },
    };
  },
};
</script>

<style scoped>
/* Styles from v3.0.1/v2.2.5 are compatible and self-contained */
  .streaming-cursor-ephemeral { animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .vad-wake-word-status, .web-speech-vad-active-indicator { font-size: 0.875rem; text-align: center; font-style: italic; padding: .25rem 0; }
  .live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; font-size: 0.8rem; }
  .inline.h-3.w-3 { height: 0.75rem; width: 0.75rem; display: inline-block; vertical-align: middle; }
  .text-gray-500 { color: #6b7280; } 
  .dark .text-gray-400 { color: #9ca3af; }
  .font-semibold { font-weight: 600; } 
  .text-xs { font-size: 0.75rem; line-height: 1rem; } 
  .text-center { text-align: center; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; } 
  .ml-1 { margin-left: 0.25rem; }
  .opacity-70 { opacity: 0.7; } 
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
</style>