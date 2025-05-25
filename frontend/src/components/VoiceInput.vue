<template>
  <div class="voice-input-wrapper">
    <p class="text-center text-gray-500 dark:text-gray-400 p-4">
      [Template Content for VoiceInput.vue is Missing]
      <br />
    </p>

    <div class="input-container">
      <div class="text-input-wrapper">
        <textarea
          v-model="textInput"
          class="text-input"
          placeholder="Or type your message here..."
          @keyup.enter="handleTextSubmit"
          :disabled="isMicrophoneActive || props.isProcessing"
        ></textarea>
      </div>
      <div class="voice-controls">
        <button
          @click="toggleRecording"
          :class="['voice-button', { recording: isMicrophoneActive, processing: props.isProcessing, disabled: !micAccessInitiallyChecked || permissionStatus === 'denied' || permissionStatus === 'error' }]"
          :title="getButtonTitle()"
          :disabled="props.isProcessing || !micAccessInitiallyChecked || permissionStatus === 'denied' || permissionStatus === 'error'"
        >
          <div class="button-content">
            <span v-if="props.isProcessing" class="processing-spinner">
              <svg class="icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </span>
            <span v-else-if="isMicrophoneActive" class="recording-indicator">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg>
              <div class="pulse-animation">
                <div class="pulse-ring"></div>
                <div class="pulse-ring pulse-ring-2"></div>
              </div>
            </span>
            <span v-else>
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a2 2 0 002-2V6a2 2 0 00-4 0v6a2 2 0 002 2zM10 6a4 4 0 118 0v6a4 4 0 11-8 0V6zm10 6a1 1 0 00-2 0v1.07A7.001 7.001 0 015 13.07V12a1 1 0 10-2 0v1.07C3 17.49 6.16 20.485 10 20.93V23a1 1 0 102 0v-2.07c3.84-.445 7-3.44 7-7.36V12z"></path></svg>
            </span>
          </div>
        </button>
         <button @click="cycleAudioMode" class="mode-toggle" :title="`Cycle Audio Mode (Current: ${getAudioModeDisplay(currentAudioMode)})`">
            <svg class="mode-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.566.379-1.566 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.54.886.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.566 2.6 1.566 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.566-.379 1.566-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.54-.886-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
        </button>
      </div>
    </div>

    <div class="status-section">
        <div v-if="permissionMessage || permissionStatus === 'prompt'" :class="['status-indicator', getPermissionStatusClass()]">
            <span v-if="permissionStatus === 'granted'" class="status-dot"></span>
            <span class="status-text">{{ permissionMessage }}</span>
            <button v-if="permissionStatus === 'denied' || permissionStatus === 'error'" @click="requestMicrophonePermissionsAndGetStream" class="help-link text-xs">Retry</button>
        </div>

        <div :class="['status-indicator', isMicrophoneActive ? 'recording-status' : 'detection-status']">
            <span v-if="isMicrophoneActive && !props.isProcessing" :class="pauseDetectedWebSpeech ? 'pause-dot' : 'status-dot'"></span>
            <span class="status-text">{{ getRecordingStatusText() }}</span>
            <span v-if="isRecording || (isVoiceActivationMode && isRecording)" class="timer">{{ recordingSeconds.toFixed(1) }}s</span>
             <div v-if="isContinuousMode && speechPreference === 'webspeech' && pendingTranscriptWebSpeech" class="continuous-controls">
                <button @click="sendPendingWebSpeechTranscription" class="control-btn send-btn">Send</button>
                <button @click="editPendingTranscription" class="control-btn clear-btn">Edit</button>
                <button @click="clearPendingWebSpeechTranscription" class="control-btn clear-btn">Clear</button>
            </div>
        </div>

        <div v-if="isContinuousMode && speechPreference === 'webspeech' && (liveTranscriptWebSpeech || pendingTranscriptWebSpeech)" class="transcription-preview">
            <div class="preview-header">
                <span class="preview-label">WebSpeech Continuous Preview:</span>
            </div>
            <div class="preview-content">
                <span class="pending-text">{{ pendingTranscriptWebSpeech }}</span>
                <span class="live-text">{{ liveTranscriptWebSpeech }}</span>
            </div>
        </div>
        <div v-else-if="interimTranscriptWebSpeech && (isPttMode || (isVoiceActivationMode && speechPreference === 'webspeech'))" class="interim-transcript">
            <span class="interim-label">WebSpeech Interim:</span>
            <span class="interim-text">{{ interimTranscriptWebSpeech }}</span>
        </div>
    </div>
     <div class="method-info">
        <span>Mode: <strong class="method-text">{{ getAudioModeDisplay(currentAudioMode) }}</strong></span>
        <span>STT: <strong class="method-text">{{ getTranscriptionMethodDisplay() }}</strong></span>
        <button @click="toggleSpeechMethod" class="method-toggle text-xs">(Switch to {{ speechPreference === 'webspeech' ? 'Whisper' : 'WebSpeech' }})</button>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Edit Transcription</h3>
          <button @click="cancelEdit" class="modal-close">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <textarea v-model="editingTranscription" class="modal-textarea"></textarea>
        <div class="modal-actions">
          <button @click="cancelEdit" class="btn-secondary">Cancel</button>
          <button @click="saveEdit" class="btn-primary">Save & Send</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
/**
 * @file VoiceInput.vue
 * @description Component for handling voice input. Supports Push-to-Talk, Continuous WebSpeech,
 * and a hybrid Continuous Whisper mode (WebSpeech for VAD, MediaRecorder + Whisper API for transcription).
 * Manages microphone permissions, recording states, and provides visual feedback.
 * @version 1.2.0 - Implemented hybrid continuous Whisper mode and refined state management.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, defineComponent } from 'vue';
import { useStorage } from '@vueuse/core';
import { speechAPI } from '../utils/api'; // For Whisper API calls

// Define SpeechRecognition types if not globally available
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event { // Changed from SpeechRecognitionError
    readonly error: string; // Standard is string, e.g., 'not-allowed', 'no-speech'
    readonly message: string;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
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
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}


export default defineComponent({
  name: 'VoiceInput',
  props: {
    /** Indicates if the parent component is currently processing an AI request. */
    isProcessing: {
      type: Boolean,
      required: true,
    },
    /** The current audio input mode ('push-to-talk', 'continuous', 'voice-activation'). */
    audioMode: {
      type: String,
      required: true,
    }
  },
  emits: {
    /** Emitted when a final transcription is ready. */
    transcription: (value: string) => typeof value === 'string',
    /** Emitted when the audio mode is changed by the user. */
    'update:audio-mode': (value: string) => typeof value === 'string',
    /** Emitted when microphone permissions are updated. */
    'permission-update': (status: 'granted' | 'denied' | 'prompt') =>
      ['granted', 'denied', 'prompt'].includes(status),
  },
  setup(props, { emit }) {
    const toast = inject('toast') as any;

    // --- Core State Refs ---
    const textInput = ref(''); // For manual text input
    const isRecording = ref(false); // True if PTT or Whisper MediaRecorder is active
    const isWebSpeechListening = ref(false); // True if WebSpeech is actively listening (continuous or VAD)
    const permissionStatus = ref<'prompt' | 'granted' | 'denied' | 'error' | ''>(''); // Mic permission status
    const permissionMessage = ref(''); // User-facing message related to permissions
    const micAccessInitiallyChecked = ref(false); // To prevent premature UI disabling

    // --- WebSpeech API Specific State ---
    const interimTranscriptWebSpeech = ref(''); // Interim results from WebSpeech
    const finalTranscriptWebSpeech = ref(''); // Accumulated final results for WebSpeech PTT/VAD
    const liveTranscriptWebSpeech = ref(''); // Live updates for WebSpeech continuous (visual only if hybrid Whisper)
    const pendingTranscriptWebSpeech = ref(''); // Accumulated final parts for WebSpeech continuous, before sending or being replaced by Whisper

    // --- Whisper API / MediaRecorder Specific State ---
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let activeWhisperStream: MediaStream | null = null; // Stream used by MediaRecorder

    // --- Timers and Detection ---
    const recordingSeconds = ref(0);
    let recordingTimerId: number | null = null;
    const pauseDetectedWebSpeech = ref(false); // For WebSpeech continuous auto-send
    const pauseCountdownWebSpeech = ref(0);
    let pauseTimerIdWebSpeech: number | null = null;

    // --- Editing Modal State ---
    const showEditModal = ref(false);
    const editingTranscription = ref('');

    // --- Settings from useStorage ---
    const speechPreference = useStorage<'webspeech' | 'whisper'>('speechPreference', 'webspeech');
    const selectedAudioDevice = useStorage<string>('selectedAudioDevice', '');
    const currentAudioMode = useStorage<string>('audioMode', props.audioMode); // Synced with prop
    const voiceActivationThreshold = useStorage<number>('voiceActivationThreshold', 0.05); // Not fully implemented in this snippet for VAD logic
    const silenceTimeoutVAD = useStorage<number>('silenceTimeoutMsVAD', 2000); // For VAD mode
    const autoSendOnPauseWebSpeech = useStorage<boolean>('autoSendOnPauseWebSpeech', true);
    const pauseTimeoutContinuousWebSpeech = useStorage<number>('pauseTimeoutMsContinuousWebSpeech', 3000);

    // --- Web Speech API Instance ---
    let recognition: SpeechRecognition | null = null;

    // --- Computed Properties ---
    /** True if any form of recording or listening is active. */
    const isMicrophoneActive = computed(() => isRecording.value || isWebSpeechListening.value);
    const isPttMode = computed(() => currentAudioMode.value === 'push-to-talk');
    const isContinuousMode = computed(() => currentAudioMode.value === 'continuous');
    const isVoiceActivationMode = computed(() => currentAudioMode.value === 'voice-activation');

    // --- Helper Methods ---
    const getButtonTitle = (): string => {
      if (props.isProcessing) return 'Assistant is processing...';
      if (!micAccessInitiallyChecked.value) return 'Initializing microphone...';
      if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return `Mic Error: ${permissionMessage.value || 'Check permissions'}`;

      if (isMicrophoneActive.value) {
        if (isContinuousMode.value) return speechPreference.value === 'whisper' ? 'Stop Whisper Recording' : 'Stop Continuous WebSpeech';
        return 'Stop Recording';
      }
      if (isContinuousMode.value) return speechPreference.value === 'whisper' ? 'Start Continuous Whisper' : 'Start Continuous WebSpeech';
      if (isVoiceActivationMode.value) return 'Start Voice Activation';
      return 'Start Recording (Push-to-Talk)';
    };

    const getRecordingStatusText = (): string => {
      if (props.isProcessing) return 'Assistant processing...';
      if (isPttMode.value) return isRecording.value ? 'Recording (PTT)...' : 'PTT Idle.';
      if (isContinuousMode.value) {
        if (speechPreference.value === 'webspeech') {
          if (pauseDetectedWebSpeech.value && autoSendOnPauseWebSpeech.value) return `Pause (WebSpeech) - Auto-sending in ${Math.ceil(pauseCountdownWebSpeech.value / 1000)}s`;
          if (liveTranscriptWebSpeech.value) return 'Listening (WebSpeech)...';
          if (pendingTranscriptWebSpeech.value) return 'Paused (WebSpeech). Ready to send or continue.';
          return isWebSpeechListening.value ? 'Listening continuously (WebSpeech)...' : 'Continuous WebSpeech idle.';
        } else { // Continuous Whisper (Hybrid)
          if (isRecording.value) return 'Recording for Whisper...'; // MediaRecorder is active
          return isWebSpeechListening.value ? 'Listening for speech (VAD for Whisper)...' : 'Continuous Whisper idle.';
        }
      }
      if(isVoiceActivationMode.value) return isRecording.value ? 'Voice activated recording...' : 'Waiting for voice (VAD)...';
      return 'Ready';
    };

    const getPermissionStatusClass = (): string => {
      if (permissionStatus.value === 'granted') return 'status-success';
      if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return 'status-error';
      if (permissionStatus.value === 'prompt') return 'status-warning';
      return '';
    };

    const getTranscriptionMethodDisplay = (): string => speechPreference.value === 'whisper' ? 'Whisper API' : 'Web Speech';
    const getAudioModeDisplay = (mode: string): string => ({
        'push-to-talk': 'Push-to-Talk',
        'continuous': 'Continuous',
        'voice-activation': 'Voice Activation',
      }[mode] || 'Unknown');


    // --- Microphone Permission Management ---
    const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
      permissionMessage.value = 'Requesting microphone access...';
      permissionStatus.value = 'prompt';
      emit('permission-update', 'prompt');

      try {
        const constraints: MediaStreamConstraints = {
          audio: selectedAudioDevice.value
            ? { deviceId: { exact: selectedAudioDevice.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        permissionStatus.value = 'granted';
        permissionMessage.value = 'Microphone access granted ✓';
        emit('permission-update', 'granted');
        setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 3000);
        micAccessInitiallyChecked.value = true;
        return stream;
      } catch (err: any) {
        console.error('Microphone permission error:', err.name, err.message);
        permissionStatus.value = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' ? 'denied' : 'error';
        permissionMessage.value = permissionStatus.value === 'denied' ? 'Mic access denied by user.' : `Mic Error: ${err.name}`;
        emit('permission-update', permissionStatus.value as 'denied' | 'prompt'); // Cast because 'error' is not in emit type
        micAccessInitiallyChecked.value = true;
        return null;
      }
    };

    // --- WebSpeech API Logic ---
    const initializeWebSpeech = (): boolean => {
      if (recognition) return true;
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        if (speechPreference.value === 'webspeech') {
          permissionMessage.value = 'Web Speech API not supported by this browser.';
          toast?.add({type: 'error', title: 'Browser Not Supported', message: 'Web Speech API is unavailable.'});
        }
        return false;
      }
      recognition = new SpeechRecognitionAPI();
      recognition.continuous = isContinuousMode.value || isVoiceActivationMode.value; // VAD also needs continuous listening
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // TODO: Make configurable

      recognition.onstart = () => {
        isWebSpeechListening.value = true;
        console.log('WebSpeech: Listening started.');
        if (isVoiceActivationMode.value && !isRecording.value) {
            isRecording.value = true; 
            startRecordingTimer();
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalPart = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalPart += transcript + ' ';
          else interim += transcript;
        }

        if (isContinuousMode.value && speechPreference.value === 'webspeech') {
          liveTranscriptWebSpeech.value = interim;
          if (finalPart.trim()) {
            pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + finalPart).trim();
            liveTranscriptWebSpeech.value = '';
            resetPauseDetectionWebSpeech();
          }
        } else if (isContinuousMode.value && speechPreference.value === 'whisper') {
          liveTranscriptWebSpeech.value = interim;
          // VAD logic for hybrid whisper handled in onspeechstart/onspeechend
        } else { // PTT or VAD (WebSpeech only for VAD)
          interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
          if (finalPart.trim()) finalTranscriptWebSpeech.value += finalPart;
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('WebSpeech Error:', event.error, event.message);
        stopAllAudioProcessing(); 
        permissionStatus.value = 'error';
        permissionMessage.value = `WebSpeech Error: ${event.error}. Try switching STT method or browser.`;
        if (event.error === 'not-allowed') {
            permissionStatus.value = 'denied';
            permissionMessage.value = 'Microphone access denied for WebSpeech.';
            emit('permission-update', 'denied');
        }
        toast?.add({type: 'error', title: 'WebSpeech Error', message: permissionMessage.value});
      };

      recognition.onend = () => {
        console.log('WebSpeech: onend fired.');
        const wasListeningContinuously = isContinuousMode.value && isWebSpeechListening.value && speechPreference.value === 'webspeech';
        const wasVADActive = isVoiceActivationMode.value && isWebSpeechListening.value;

        isWebSpeechListening.value = false;

        if ((wasListeningContinuously || wasVADActive) && !props.isProcessing && permissionStatus.value === 'granted') {
          if (currentAudioMode.value === 'continuous' || currentAudioMode.value === 'voice-activation') {
            console.log('WebSpeech: Attempting to restart continuous/VAD listening.');
            setTimeout(() => { 
              if ((currentAudioMode.value === 'continuous' || currentAudioMode.value === 'voice-activation') && permissionStatus.value === 'granted' && !isWebSpeechListening.value) {
                  startWebSpeechRecognition();
              }
            }, 100);
          }
        } else if (isPttMode.value || (isVoiceActivationMode.value && isRecording.value)) {
          if (finalTranscriptWebSpeech.value.trim()) {
            emit('transcription', finalTranscriptWebSpeech.value.trim());
          }
          cleanUpAfterTranscription();
        }
          if (isVoiceActivationMode.value && isRecording.value) {
          isRecording.value = false; 
          clearRecordingTimer();
        }
      };

      recognition.onspeechstart = () => {
        console.log('WebSpeech: Speech start detected.');
        if (isVoiceActivationMode.value && !isRecording.value) {
          isRecording.value = true; 
          startRecordingTimer();
        }
        if (isContinuousMode.value && speechPreference.value === 'whisper' && !isRecording.value) {
          startWhisperMediaRecorder(); 
        }
      };

      recognition.onspeechend = () => {
        console.log('WebSpeech: Speech end detected.');
        if (isContinuousMode.value && speechPreference.value === 'whisper' && isRecording.value) { 
          stopWhisperMediaRecorder(); 
        }
      };
      return true;
    };

    const startWebSpeechRecognition = async (): Promise<boolean> => {
      if (!recognition && !initializeWebSpeech()) return false;
      if (permissionStatus.value !== 'granted') {
        const stream = await requestMicrophonePermissionsAndGetStream();
        if (!stream) return false;
      }

      finalTranscriptWebSpeech.value = '';
      interimTranscriptWebSpeech.value = '';
      try {
        if (recognition!.continuous !== (isContinuousMode.value || isVoiceActivationMode.value)) {
            recognition!.continuous = isContinuousMode.value || isVoiceActivationMode.value;
        }
        recognition!.start();
        return true;
      } catch (e: any) {
        if (e.name === 'InvalidStateError' && isWebSpeechListening.value) return true; // Already started
        console.error('Error starting WebSpeech:', e);
        permissionMessage.value = `Could not start WebSpeech: ${e.message || e.name || 'Unknown error'}`;
        permissionStatus.value = 'error';
        isWebSpeechListening.value = false; // Ensure it's marked as not listening
        return false;
      }
    };

    const stopWebSpeechRecognition = () => {
      if (recognition && isWebSpeechListening.value) {
        recognition.stop(); 
      }
    };

    // --- MediaRecorder Logic for Whisper ---
    const startWhisperMediaRecorder = async (): Promise<boolean> => {
      const stream = await requestMicrophonePermissionsAndGetStream();
      if (!stream) return false;

      activeWhisperStream = stream; 
      audioChunks = [];
      const options = { mimeType: 'audio/webm;codecs=opus' };
      try {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn(`${options.mimeType} not supported, trying default.`);
            mediaRecorder = new MediaRecorder(activeWhisperStream); 
        } else {
            mediaRecorder = new MediaRecorder(activeWhisperStream, options);
        }
      } catch (e) {
          console.error("Failed to create MediaRecorder:", e);
          toast?.add({type: 'error', title: 'Recording Error', message: 'Failed to initialize audio recorder.'});
          activeWhisperStream.getTracks().forEach(track => track.stop());
          activeWhisperStream = null;
          return false;
      }

      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

      mediaRecorder.onstop = async () => {
        if(activeWhisperStream) activeWhisperStream.getTracks().forEach(track => track.stop());
        activeWhisperStream = null;

        const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
        audioChunks = [];
        if (audioBlob.size > 1000) { 
          await transcribeWithWhisper(audioBlob);
        } else {
          console.warn("Whisper: Recorded audio too small or empty.", audioBlob.size);
          if (!isContinuousMode.value) { 
            toast?.add({ type: 'warning', title: 'Empty Audio', message: 'No significant audio recorded for Whisper.' });
          }
        }
        isRecording.value = false; 
        clearRecordingTimer();

        if (isContinuousMode.value && speechPreference.value === 'whisper' && !isWebSpeechListening.value && permissionStatus.value === 'granted') {
            console.log("Hybrid Whisper: Restarting WebSpeech VAD after MediaRecorder stop.");
            startWebSpeechRecognition();
        }
      };
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast?.add({ type: 'error', title: 'Recording Error', message: `MediaRecorder failed: ${(event as any).error?.name || 'Unknown error'}` });
        if(activeWhisperStream) activeWhisperStream.getTracks().forEach(track => track.stop());
        activeWhisperStream = null;
        isRecording.value = false;
        clearRecordingTimer();
      };

      mediaRecorder.start();
      isRecording.value = true; 
      console.log('MediaRecorder for Whisper started.');
      return true;
    };

    const stopWhisperMediaRecorder = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop(); 
        console.log('MediaRecorder for Whisper stopped.');
      } else {
        if(activeWhisperStream) activeWhisperStream.getTracks().forEach(track => track.stop());
        activeWhisperStream = null;
        isRecording.value = false; 
      }
    };

    const transcribeWithWhisper = async (audioBlob: Blob) => {
      if (props.isProcessing) {
          toast?.add({type:'info', title:'Busy', message: 'Assistant is busy, please wait.'});
          return;
      }
      toast?.add({type: 'info', title: 'Whisper Processing', message: 'Sending audio to Whisper...'});

      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, `whisper-audio-${Date.now()}.webm`);
        // formData.append('language', 'en'); 

        const response = await speechAPI.transcribe(formData); 
        if (response.data.transcription) {
          emit('transcription', response.data.transcription);
        } else {
          throw new Error(response.data.message || 'Empty transcription from Whisper.');
        }
      } catch (error: any) {
        console.error('Error transcribing with Whisper API:', error);
        toast?.add({ type: 'error', title: 'Whisper Error', message: error.response?.data?.message || error.message || 'Whisper transcription failed.'});
      }
    };


    // --- Combined Start/Stop Logic ---
    const startAudioCapture = async () => {
      if (props.isProcessing) return;

      let success = false;
      if (speechPreference.value === 'webspeech') {
        success = await startWebSpeechRecognition();
        if (success) {
            if (isPttMode.value || isVoiceActivationMode.value) isRecording.value = true; 
            else if (isContinuousMode.value) isWebSpeechListening.value = true;
        }
      } else { // Whisper
        if (isContinuousMode.value) { // Hybrid: WebSpeech for VAD, MediaRecorder for capture
            success = await startWebSpeechRecognition(); // Start VAD
            if (success) isWebSpeechListening.value = true; // Indicates VAD is active
        } else { // PTT or VAD for Whisper (VAD implies direct Whisper recording)
            success = await startWhisperMediaRecorder();
            if (success) isRecording.value = true;
        }
      }

      if (success && (isPttMode.value || (isVoiceActivationMode.value && speechPreference.value === 'whisper'))) {
        startRecordingTimer(); 
      } else if (!success) {
        isRecording.value = false;
        isWebSpeechListening.value = false;
      }
    };

    const stopAudioCapture = () => {
      if (speechPreference.value === 'webspeech') {
        stopWebSpeechRecognition(); 
      } else { // Whisper
        if (isRecording.value) { 
            stopWhisperMediaRecorder();
        }
        if (isWebSpeechListening.value) { // If WebSpeech VAD for hybrid Whisper was active
            stopWebSpeechRecognition(); // Stop the VAD
        }
      }
      clearRecordingTimer();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;

      if (isContinuousMode.value && speechPreference.value === 'webspeech' && pendingTranscriptWebSpeech.value.trim()) {
        sendPendingWebSpeechTranscription();
      }
    };

    const toggleRecording = async () => {
      if (props.isProcessing) return;
      if (!micAccessInitiallyChecked.value || permissionStatus.value === 'prompt') {
          const stream = await requestMicrophonePermissionsAndGetStream();
          if (!stream && permissionStatus.value !== 'granted') return; 
      }
      if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') {
          toast?.add({ type: 'error', title: 'Microphone Issue', message: permissionMessage.value || 'Cannot access microphone.' });
          requestMicrophonePermissionsAndGetStream(); 
          return;
      }

      if (isMicrophoneActive.value) {
        stopAudioCapture();
      } else {
        await startAudioCapture();
      }
    };

    // --- Mode & Preference Switching ---
    const cycleAudioMode = () => {
      stopAudioCapture(); 
      const modes = ['push-to-talk', 'continuous', 'voice-activation'];
      const currentIndex = modes.indexOf(currentAudioMode.value);
      currentAudioMode.value = modes[(currentIndex + 1) % modes.length]; 
      toast?.add({ type: 'info', title: 'Audio Mode', message: `Switched to ${getAudioModeDisplay(currentAudioMode.value)}`});
      emit('update:audio-mode', currentAudioMode.value);
    };

    const toggleSpeechMethod = () => {
      stopAudioCapture();
      speechPreference.value = speechPreference.value === 'webspeech' ? 'whisper' : 'webspeech';
      toast?.add({ type: 'info', title: 'STT Method Switched', message: `Using ${getTranscriptionMethodDisplay()}`});
    };

    // --- Text Input & Manual Submission ---
    const handleTextSubmit = () => {
      if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) {
        emit('transcription', textInput.value.trim());
        textInput.value = '';
      }
    };

    // --- WebSpeech Continuous Mode Specific Logic (Pause Detection, Editing) ---
    const sendPendingWebSpeechTranscription = () => {
      if (pendingTranscriptWebSpeech.value.trim()) {
        emit('transcription', pendingTranscriptWebSpeech.value.trim());
      }
      clearPendingWebSpeechTranscription();
    };

    const clearPendingWebSpeechTranscription = () => {
      pendingTranscriptWebSpeech.value = '';
      liveTranscriptWebSpeech.value = '';
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;
    };

    const editPendingTranscription = () => {
      if (speechPreference.value === 'webspeech' && isContinuousMode.value) { // Only for webspeech continuous
        editingTranscription.value = pendingTranscriptWebSpeech.value;
        showEditModal.value = true;
      } else {
        toast?.add({type:'info', title: 'Edit Not Available', message:'Editing is for WebSpeech continuous mode.'});
      }
    };
    const saveEdit = () => { 
      pendingTranscriptWebSpeech.value = editingTranscription.value;
      showEditModal.value = false;
      sendPendingWebSpeechTranscription();
    };
    const cancelEdit = () => {
      showEditModal.value = false;
      editingTranscription.value = '';
    };

    const resetPauseDetectionWebSpeech = () => {
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;

      if (isContinuousMode.value && speechPreference.value === 'webspeech' && pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && autoSendOnPauseWebSpeech.value) {
        pauseTimerIdWebSpeech = window.setTimeout(() => {
          if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && autoSendOnPauseWebSpeech.value && isContinuousMode.value) { // check mode again
            pauseDetectedWebSpeech.value = true;
            pauseCountdownWebSpeech.value = pauseTimeoutContinuousWebSpeech.value;
            const cdInterval = setInterval(() => {
              if (!pauseDetectedWebSpeech.value || !isContinuousMode.value) { clearInterval(cdInterval); return; }
              pauseCountdownWebSpeech.value -= 100;
              if (pauseCountdownWebSpeech.value <= 0) {
                clearInterval(cdInterval);
                if(pauseDetectedWebSpeech.value && isContinuousMode.value) sendPendingWebSpeechTranscription();
              }
            }, 100);
          }
        }, 500); // Short delay before initiating pause detection
      }
    };

    // --- Timers & Cleanup ---
    const startRecordingTimer = () => {
      clearRecordingTimer();
      recordingSeconds.value = 0;
      recordingTimerId = window.setInterval(() => {
        recordingSeconds.value += 0.1;
        if ((isPttMode.value || (isVoiceActivationMode.value && speechPreference.value === 'whisper')) && isRecording.value && recordingSeconds.value >= 60) {
          toast?.add({type: 'info', title:'Recording Limit', message: 'Recording stopped after 60s.'});
          stopAudioCapture();
        } else if (isVoiceActivationMode.value && speechPreference.value === 'webspeech' && isRecording.value) {
          // VAD WebSpeech silence detection is primarily handled by onspeechend and onend
          // This timer could be a fallback or for other VAD types if implemented
        }
      }, 100);
    };
    const clearRecordingTimer = () => {
      if (recordingTimerId !== null) clearInterval(recordingTimerId);
      recordingTimerId = null;
      recordingSeconds.value = 0;
    };
    const clearPauseTimerWebSpeech = () => {
      if (pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech);
      pauseTimerIdWebSpeech = null;
    };

    const cleanUpAfterTranscription = () => {
        isRecording.value = false;
        isWebSpeechListening.value = false;
        interimTranscriptWebSpeech.value = '';
        finalTranscriptWebSpeech.value = '';
        liveTranscriptWebSpeech.value = '';
        // pendingTranscriptWebSpeech is cleared by its own logic (send/clear)
        audioChunks = [];
        clearRecordingTimer();
        // clearPauseTimerWebSpeech is handled by its own logic too
        // pauseDetectedWebSpeech.value = false; // also handled by its logic
    };

    const stopAllAudioProcessing = () => {
        if (recognition) {
            try {
                if (isWebSpeechListening.value) recognition.abort();
                else recognition.stop();
            } catch (e) { console.warn("Error stopping/aborting WebSpeech:", e); }
        }
        isWebSpeechListening.value = false; // ensure this is set

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            try { mediaRecorder.stop(); } catch (e) { console.warn("Error stopping MediaRecorder:", e); }
        }
        isRecording.value = false; // ensure this is set

        if (activeWhisperStream) {
            activeWhisperStream.getTracks().forEach(track => track.stop());
            activeWhisperStream = null;
        }
        cleanUpAfterTranscription(); // General cleanup
        clearPauseTimerWebSpeech(); // Specific cleanup
        pauseDetectedWebSpeech.value = false;
        pauseCountdownWebSpeech.value = 0;
    };

    // --- Lifecycle Hooks & Watchers ---
    watch(() => props.audioMode, (newMode, oldMode) => {
      if (newMode !== oldMode) {
        stopAllAudioProcessing();
        currentAudioMode.value = newMode; 
        if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
          setTimeout(() => { 
            if(currentAudioMode.value === newMode) startAudioCapture();
          }, 100);
        }
      }
    }, { immediate: false });

    watch(speechPreference, (newPref, oldPref) => {
      if (newPref !== oldPref) {
        stopAllAudioProcessing();
        if (newPref === 'webspeech' && typeof window !== 'undefined') initializeWebSpeech(); 
        if ((currentAudioMode.value === 'continuous' || currentAudioMode.value === 'voice-activation') && permissionStatus.value === 'granted') {
            setTimeout(() => {
                if(currentAudioMode.value === 'continuous' || currentAudioMode.value === 'voice-activation') startAudioCapture();
            },100);
        }
      }
    });

    watch(currentAudioMode, (newMode) => {
        // Update WebSpeech 'continuous' property if it's initialized
        if (recognition) {
            const needsContinuous = newMode === 'continuous' || newMode === 'voice-activation';
            if (recognition.continuous !== needsContinuous) {
                // If recognition is active, it needs to be stopped and restarted to change this property.
                // This is handled by mode switching logic already (stopAllAudioProcessing then startAudioCapture)
                console.log(`WebSpeech 'continuous' property will be set to ${needsContinuous} on next start.`);
            }
        }
    });


    onMounted(async () => {
      currentAudioMode.value = props.audioMode; 
      if (speechPreference.value === 'webspeech' && typeof window !== 'undefined') {
        initializeWebSpeech();
      }
      // Initial permission check without auto-starting, let user initiate for PTT.
      // For continuous/VAD, if permission already granted, it can auto-start.
      if (navigator.permissions) {
        try {
            const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            permissionStatus.value = perm.state;
            if (perm.state === 'granted') {
                permissionMessage.value = 'Microphone access previously granted.';
                emit('permission-update', 'granted');
                if (isContinuousMode.value || isVoiceActivationMode.value) {
                    startAudioCapture();
                }
            } else if (perm.state === 'prompt') {
                permissionMessage.value = 'Microphone access needs to be granted.';
                emit('permission-update', 'prompt');
            } else { // denied
                permissionMessage.value = 'Microphone access previously denied. Please enable in browser settings.';
                emit('permission-update', 'denied');
            }
        } catch (e) {
            console.warn("Permissions API not fully supported or error querying:", e);
            // Fallback to direct request if query fails or not supported
            await requestMicrophonePermissionsAndGetStream().then(stream => {
              if (stream) {
                if (isContinuousMode.value || isVoiceActivationMode.value) {
                    startAudioCapture();
                }
                stream.getTracks().forEach(track => track.stop()); 
              }
            });
        } finally {
            micAccessInitiallyChecked.value = true;
        }
      } else { // Fallback for browsers without Permissions API
          await requestMicrophonePermissionsAndGetStream().then(stream => {
            micAccessInitiallyChecked.value = true;
            if (stream) { 
              if (isContinuousMode.value || isVoiceActivationMode.value) {
                  startAudioCapture();
              }
              stream.getTracks().forEach(track => track.stop()); 
            }
          });
      }
    });

    onBeforeUnmount(() => {
      stopAllAudioProcessing();
      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.onspeechstart = null;
        recognition.onspeechend = null;
        // Keep reference to null out in case of Vue HMR
        recognition = null;
      }
      if (mediaRecorder) {
        mediaRecorder.ondataavailable = null;
        mediaRecorder.onstop = null;
        mediaRecorder.onerror = null;
        mediaRecorder = null;
      }
      clearRecordingTimer();
      clearPauseTimerWebSpeech();
    });

    return {
      props, // make props available in template if not using <script setup>
      textInput,
      isRecording,
      isWebSpeechListening,
      permissionStatus,
      permissionMessage,
      micAccessInitiallyChecked,
      interimTranscriptWebSpeech,
      liveTranscriptWebSpeech,
      pendingTranscriptWebSpeech,
      recordingSeconds,
      pauseDetectedWebSpeech,
      pauseCountdownWebSpeech,
      showEditModal,
      editingTranscription,
      speechPreference,
      currentAudioMode,
      isMicrophoneActive,
      getButtonTitle,
      getRecordingStatusText,
      getPermissionStatusClass,
      getTranscriptionMethodDisplay,
      getAudioModeDisplay,
      toggleRecording,
      cycleAudioMode,
      toggleSpeechMethod,
      handleTextSubmit,
      sendPendingWebSpeechTranscription,
      clearPendingWebSpeechTranscription,
      editPendingTranscription,
      saveEdit,
      cancelEdit,
      requestMicrophonePermissionsAndGetStream // exposing for retry button if needed
    };
  }
});
</script>

<style scoped>
/* Basic styles from previous version, ensure they are comprehensive */
.voice-input-wrapper { @apply w-full max-w-3xl mx-auto text-sm; }
.input-container { @apply flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg; }
.text-input-wrapper { @apply flex-1; }
.text-input { @apply w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow; }
.text-input:focus { @apply shadow-md; }
.voice-controls { @apply flex items-center gap-2; }
.voice-button { @apply relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800; background: linear-gradient(145deg, #4f8ff7, #2563eb); box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1); }
.voice-button:hover:not(.disabled) { @apply scale-105 shadow-xl; background: linear-gradient(145deg, #60a5fa, #3b82f6); }
.voice-button:active:not(.disabled) { @apply scale-95 shadow-md; }
.voice-button.recording { background: linear-gradient(145deg, #f87171, #ef4444); box-shadow: 0 0 15px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0,0,0,0.1); }
.voice-button.processing { @apply opacity-70 cursor-wait bg-gray-400 dark:bg-gray-600; }
.voice-button.disabled { @apply opacity-60 cursor-not-allowed bg-gray-300 dark:bg-gray-700 shadow-none; }
.button-content { @apply relative w-full h-full flex items-center justify-center; }
.icon { @apply w-5 h-5 sm:w-6 sm:h-6 text-white; }
.recording-indicator { @apply relative flex items-center justify-center w-full h-full; }
.pulse-animation { @apply absolute inset-0; }
.pulse-ring { @apply absolute inset-0 rounded-full border-2 border-white/50; animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.pulse-ring.pulse-ring-2 { animation-delay: 0.5s; }
@keyframes pulse { 0% { transform: scale(0.8); opacity: 0.7; } 70% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(0.8); opacity: 0; } }
.processing-spinner .icon { @apply w-5 h-5 sm:w-5 sm:h-5; } /* Ensure spinner icon size is controlled */
.mode-toggle { @apply w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500; }
.mode-icon { @apply w-4 h-4 sm:w-5 sm:h-5; }
.status-section { @apply mt-2.5 space-y-1.5 text-xs sm:text-sm; }
.status-indicator { @apply flex items-center gap-2 px-3 py-1.5 rounded-lg border; }
.recording-status { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50; }
.status-success { @apply bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50; }
.status-error { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50; }
.status-warning { @apply bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50; }
.detection-status { @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50; }
.status-dot { @apply w-2 h-2 bg-current rounded-full animate-pulse; }
.pause-dot { @apply w-2 h-2 bg-current rounded-full; animation: pulse 1.5s ease-in-out infinite; } /* Different animation for pause or static */
.status-text { @apply font-medium flex-1; }
.timer { @apply ml-auto font-mono text-gray-500 dark:text-gray-400; }
.help-link { @apply ml-auto underline hover:no-underline cursor-pointer text-blue-600 dark:text-blue-400; }
.continuous-controls { @apply flex items-center gap-2 ml-auto; }
.control-btn { @apply px-2.5 py-1 text-xs rounded-md border font-medium transition-colors shadow-sm; }
.send-btn { @apply bg-blue-500 text-white border-blue-600 hover:bg-blue-600; }
.clear-btn { @apply bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500; }
.transcription-preview { @apply mt-2.5 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50 shadow-sm; }
.preview-header { @apply flex items-center justify-between mb-1.5; }
.preview-label { @apply text-xs font-semibold text-blue-700 dark:text-blue-300; }
.edit-btn { @apply text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium; }
.preview-content { @apply text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap break-words; }
.live-text { @apply italic opacity-80; }
.pending-text { @apply font-normal; }
.interim-transcript { @apply mt-2.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600/50 shadow-sm; }
.interim-label { @apply text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2; }
.interim-text { @apply text-sm text-gray-800 dark:text-gray-200 italic; }
.method-info { @apply mt-2.5 flex items-center justify-center sm:justify-end text-xs text-gray-500 dark:text-gray-400 gap-2 flex-wrap; }
.method-text { @apply font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full; }
.method-toggle { @apply text-blue-600 dark:text-blue-400 hover:underline cursor-pointer; }
.modal-overlay { @apply fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4; }
.modal-content { @apply bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg mx-auto; }
.modal-header { @apply flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700; }
.modal-title { @apply text-lg font-semibold text-gray-900 dark:text-white; }
.modal-close { @apply p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700; }
.modal-textarea { @apply w-full my-0 mx-auto p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; display: block; } /* Changed w-auto m-4 to w-full */
.modal-actions { @apply flex justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700; }
.btn-secondary { @apply px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm; }
.btn-primary { @apply px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm; }
@media (max-width: 640px) {
  .input-container { @apply flex-col gap-2.5 sm:gap-3; }
  .text-input-wrapper { @apply w-full; }
  .voice-controls { @apply w-full justify-center; }
}
</style>