// File: frontend/src/components/VoiceInput.vue
/**
  * @file VoiceInput.vue
  * @description Handles voice input, transcription (Whisper/WebSpeech),
  * audio mode management (PTT, Continuous, VAD), and local transcription history.
  * Consumes global voice settings from VoiceSettingsService.
  * @version 2.0.2 - Completed template with live transcription feedback and styled elements.
  */

<template>
   <div class="voice-input-panel-holographic" :aria-busy="props.isProcessing || isMicrophoneActive">
      <div class="input-area-holographic">
     <textarea
      ref="textareaRef"
      v-model="textInput"
      @input="handleTextInput"
      @keyup.enter.exact="!isMicrophoneActive && handleTextSubmit()"
      class="voice-textarea-holographic"
      :placeholder="getPlaceholderText()"
      :disabled="isMicrophoneActive || props.isProcessing"
      aria-label="Text input for chat"
      rows="1"
     ></textarea>

        <div
      v-if="isMicrophoneActive && (interimTranscriptWebSpeech || liveTranscriptWebSpeech || pendingTranscriptWebSpeech || (sttPreference === 'whisper_api' && isRecording))"
      class="live-transcript-display-holographic"
      aria-live="polite"
     >
      <p v-if="interimTranscriptWebSpeech && sttPreference === 'browser_webspeech_api'" class="interim-transcript-holographic" aria-label="Interim transcription">
       {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-holographic">▋</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="live-web-speech-transcript-holographic" aria-label="Live transcription">
       {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-holographic">▋</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="pending-transcript-holographic" aria-label="Pending transcription">
       <span class="font-semibold">Pending:</span> {{ pendingTranscriptWebSpeech }}
      </p>
      <div v-if="sttPreference === 'whisper_api' && isRecording" class="whisper-recording-status-holographic" aria-label="Recording for Whisper API">
       Recording audio for Whisper... ({{ formatDuration(recordingSeconds) }})
      </div>
     </div>

     <button
      @click="handleTextSubmit"
      :disabled="!textInput.trim() || isMicrophoneActive || props.isProcessing"
      class="send-button-holographic btn btn-icon btn-primary"
      aria-label="Send text message"
      title="Send Text Message"
     >
      <SendIcon class="icon-base" />
     </button>
    </div>

      <div class="controls-main-row-holographic">
     <button
      @mousedown="isPttMode && !props.isProcessing ? startAudioCapture() : null"
      @mouseup="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
      @keydown.space.prevent="isPttMode && !props.isProcessing && !isMicrophoneActive ? startAudioCapture() : null"
      @keyup.space.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
      @touchstart.prevent="isPttMode && !props.isProcessing ? startAudioCapture() : null"
      @touchend.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
      @click="!isPttMode && !props.isProcessing ? toggleRecording() : null"
      :class="['mic-button-holographic', {
       'active': isMicrophoneActive,
       'disabled error': permissionStatus === 'denied' || permissionStatus === 'error',
       'processing': props.isProcessing
      }]"
      :title="getButtonTitle()"
      :aria-pressed="isMicrophoneActive.toString()"
      :disabled="props.isProcessing || (!micAccessInitiallyChecked && permissionStatus !== 'granted' && permissionStatus !== 'prompt')"
      aria-live="polite"
     >
      <MicrophoneIcon class="icon-lg" />
     </button>
     
     <div class="status-display-holographic">
      <div class="mode-indicator-wrapper-holographic">
       <span :class="['mode-dot-holographic', getModeIndicatorClass()]"></span>
       <span class="mode-text-holographic" :title="`Current mode: ${getModeDisplayText()}`">{{ getIdleStatusText() }}</span>
      </div>
      <div class="transcription-status-text-holographic" aria-live="assertive">
       {{ getRecordingStatusText() }}
       <span v-if="isContinuousMode && pauseDetectedWebSpeech && sttPreference === 'browser_webspeech_api'" class="text-xs text-amber-400"> ({{ Math.max(0, pauseCountdownWebSpeech / 1000).toFixed(1) }}s)</span>
      </div>
      <div v-if="permissionStatus !== 'granted' && permissionMessage" :class="['permission-text-holographic', getPermissionStatusClass()]" role="alert">
       {{ permissionMessage }}
      </div>
     </div>

     <div class="secondary-controls-holographic">
      <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="control-btn-holographic" title="Transcription History">
       <HistoryIcon class="icon-sm"/>
      </button>
      <button v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && pendingTranscriptWebSpeech.trim()" @click="editPendingTranscription" class="control-btn-holographic" title="Edit pending transcript">
       <EditIcon class="icon-sm"/>
      </button>
      <button v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && pendingTranscriptWebSpeech.trim()" @click="clearPendingWebSpeechTranscription" class="control-btn-holographic" title="Clear pending transcript">
       <ClearIcon class="icon-sm"/>
      </button>
      <button v-if="isMicrophoneActive && (isContinuousMode || isVoiceActivationMode)" @click="() => stopAudioCapture(true)" class="control-btn-holographic stop-btn-holographic" title="Stop Listening/Recording">
       <StopCircleIcon class="icon-sm"/>
      </button>
     </div>
    </div>
    
      <canvas 
     v-if="isVoiceActivationMode && isMicrophoneActive && permissionStatus === 'granted' && sttPreference === 'whisper_api'" 
     ref="vadCanvasRef" 
     class="vad-canvas-holographic" 
     width="300" 
     height="40"
     aria-label="Voice activity visualization"
    ></canvas>
    <div v-if="isVoiceActivationMode && sttPreference === 'browser_webspeech_api' && isMicrophoneActive" class="web-speech-vad-active-indicator">
     WebSpeech VAD Active
    </div>


      <Transition name="modal-fade-holographic">
     <div v-if="showTranscriptionHistory" class="modal-overlay-holographic" @click.self="showTranscriptionHistory = false">
      <div class="modal-content-holographic glass-pane" role="dialog" aria-modal="true" aria-labelledby="history-title">
       <div class="modal-header-holographic">
        <h3 id="history-title" class="modal-title-holographic">Transcription History</h3>
        <button @click="showTranscriptionHistory = false" class="modal-close-button-holographic" aria-label="Close history">
         <CloseIcon class="icon-base"/>
        </button>
       </div>
       <div class="modal-body-holographic custom-scrollbar-thin">
        <ul v-if="transcriptionHistory.length > 0" class="history-list-holographic">
         <li v-for="item in transcriptionHistory" :key="item.id" class="history-item-holographic">
          <div class="history-item-text-holographic">{{ item.text }}</div>
          <div class="history-item-meta-holographic">
           <span class="timestamp-holographic">{{ formatTime(item.timestamp) }}</span>
           <button @click="resendTranscription(item)" class="resend-btn-holographic" title="Resend this transcription">
            Resend
           </button>
          </div>
         </li>
        </ul>
        <p v-else class="text-neutral-text-muted italic text-center p-4">No transcription history yet.</p>
       </div>
      </div>
     </div>
    </Transition>

      <Transition name="modal-fade-holographic">
     <div v-if="showEditModal" class="modal-overlay-holographic" @click.self="cancelEdit">
      <div class="modal-content-holographic glass-pane w-full max-w-lg" role="dialog" aria-modal="true" aria-labelledby="edit-title">
       <div class="modal-header-holographic">
        <h3 id="edit-title" class="modal-title-holographic">Edit Transcription</h3>
        <button @click="cancelEdit" class="modal-close-button-holographic" aria-label="Cancel edit">
         <CloseIcon class="icon-base"/>
        </button>
       </div>
       <div class="modal-body-holographic p-4">
        <textarea
         ref="editModalTextareaRef"
         v-model="editingTranscription"
         class="form-textarea w-full min-h-[100px] text-sm"
         aria-label="Edit transcription text"
        ></textarea>
       </div>
       <div class="modal-footer-holographic">
        <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
        <button @click="saveEdit" class="btn btn-primary btn-sm">Save & Send</button>
       </div>
      </div>
     </div>
    </Transition>

   </div>
</template>

<script lang="ts">
// File: frontend/src/components/VoiceInput.vue
/**
  * @file VoiceInput.vue
  * @description Handles voice input, transcription (Whisper/WebSpeech),
  * audio mode management (PTT, Continuous, VAD), and local transcription history.
  * Consumes global voice settings from VoiceSettingsService.
  * @version 2.0.2
  */

import {
   ref,
   computed,
   onMounted,
   onBeforeUnmount,
   watch,
   inject,
   defineComponent,
   nextTick,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import type { AxiosResponse } from 'axios';

// Heroicons (ensure these match your template usage)
import {
   ClockIcon as HistoryIcon,
   XMarkIcon as CloseIcon,
   PaperAirplaneIcon as SendIcon,
   ComputerDesktopIcon as BrowserSpeechIcon,
   CloudIcon as WhisperSpeechIcon,
   SpeakerWaveIcon as ContinuousModeIcon,
   ArrowsPointingOutIcon as VADModeIcon, 
   HandRaisedIcon as PTTModeIcon,
   PencilIcon as EditIcon,
   TrashIcon as ClearIcon,
   StopCircleIcon as StopRecordingIcon,
   MicrophoneIcon,
} from '@heroicons/vue/24/outline';


// Global type declarations (as provided by user)
declare global {
   interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
   }
   interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
   }
   interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string; 
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

interface TranscriptionHistoryItem {
   id: string;
   text: string;
   timestamp: number;
   sent: boolean;
}

export default defineComponent({
   name: 'VoiceInput',
   components: {
    HistoryIcon, CloseIcon, SendIcon, BrowserSpeechIcon, WhisperSpeechIcon,
    ContinuousModeIcon, VADModeIcon, PTTModeIcon, EditIcon, ClearIcon,
    StopRecordingIcon, MicrophoneIcon,
   },
   props: {
    isProcessing: { type: Boolean, required: true },
   },
   emits: {
    transcription: (value: string) => typeof value === 'string',
    'permission-update': (status: 'granted' | 'denied' | 'prompt' | 'error') =>
     ['granted', 'denied', 'prompt', 'error'].includes(status),
   },
   setup(props, { emit }) {
    const toast = inject<ToastService>('toast');
    const textInput = ref('');
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const editModalTextareaRef = ref<HTMLTextAreaElement | null>(null);
    const isRecording = ref(false);
    const isWebSpeechListening = ref(false);
    const permissionStatus = ref<'prompt' | 'granted' | 'denied' | 'error' | ''>('');
    const permissionMessage = ref('');
    const micAccessInitiallyChecked = ref(false);
    const interimTranscriptWebSpeech = ref('');
    const finalTranscriptWebSpeech = ref('');
    const liveTranscriptWebSpeech = ref('');
    const pendingTranscriptWebSpeech = ref('');
    const transcriptionHistory = ref<TranscriptionHistoryItem[]>(
     JSON.parse(localStorage.getItem('vca-transcriptionHistory') || '[]')
    );
    const showTranscriptionHistory = ref(false);

    watch(
     transcriptionHistory,
     (newHistory) => {
      localStorage.setItem('vca-transcriptionHistory', JSON.stringify(newHistory));
     },
     { deep: true }
    );

    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let activeStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphoneSourceNode: MediaStreamAudioSourceNode | null = null;
    const recordingSeconds = ref(0);
    let recordingTimerId: number | null = null;
    const pauseDetectedWebSpeech = ref(false);
    const pauseCountdownWebSpeech = ref(0);
    let pauseTimerIdWebSpeech: number | null = null;
    let vadSilenceTimerId: number | null = null;
    const audioLevelDisplay = ref(0);
    const rawAudioLevel = ref(0);
    let audioMonitoringInterval: number | null = null;
    const showEditModal = ref(false);
    const editingTranscription = ref('');
    const vadCanvasRef = ref<HTMLCanvasElement | null>(null);
    const settings = voiceSettingsManager.settings;
    let recognition: SpeechRecognition | null = null;

    const sttPreference = computed(() => settings.sttPreference);
    const audioInputMode = computed(() => settings.audioInputMode);
    const selectedAudioDeviceId = computed(() => settings.selectedAudioInputDeviceId);
    const vadThreshold = computed(() => settings.vadThreshold);
    const vadSilenceTimeoutMs = computed(() => settings.vadSilenceTimeoutMs);
    const continuousModeAutoSend = computed(() => settings.continuousModeAutoSend);
    const continuousModePauseTimeoutMs = computed(() => settings.continuousModePauseTimeoutMs);
    const isMicrophoneActive = computed(() => isRecording.value || isWebSpeechListening.value);
    const isPttMode = computed(() => audioInputMode.value === 'push-to-talk');
    const isContinuousMode = computed(() => audioInputMode.value === 'continuous');
    const isVoiceActivationMode = computed(() => audioInputMode.value === 'voice-activation');

    const getButtonTitle = (): string => {
     if (props.isProcessing) return 'Assistant is processing...';
     if (!micAccessInitiallyChecked.value) return 'Initializing microphone...';
     if (permissionStatus.value === 'denied') return 'Microphone access denied';
     if (permissionStatus.value === 'error') return `Microphone error: ${permissionMessage.value || 'Unknown error'}`;
     if (isMicrophoneActive.value) {
      if (isContinuousMode.value) return 'Stop continuous listening';
      if (isVoiceActivationMode.value) return 'Stop voice activation';
      return 'Release to stop recording'; // PTT
     }
     if (isContinuousMode.value) return 'Start continuous listening';
     if (isVoiceActivationMode.value) return 'Start voice activation';
     return 'Hold to record'; // PTT
    };
    const getPlaceholderText = (): string => {
     if (isMicrophoneActive.value) {
      if (isPttMode.value) return 'Recording... release to send.';
      if (isContinuousMode.value) return 'Listening continuously...';
      if (isVoiceActivationMode.value) return 'Listening for voice...';
     }
     if (isContinuousMode.value) return `Type or click mic (${getTranscriptionMethodDisplay()})...`;
     if (isVoiceActivationMode.value) return `Type or click mic for VAD (${getTranscriptionMethodDisplay()})...`;
     return `Type or hold mic to record (${getTranscriptionMethodDisplay()})...`;
    };
    const getModeDisplayText = (): string => {
     const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser';
     if (isContinuousMode.value) return `Continuous (${method})`;
     if (isVoiceActivationMode.value) return `Voice Activate (${method})`;
     return `Push to Talk (${method})`;
    };
    const getModeIndicatorClass = (): string => {
     if (props.isProcessing) return 'mode-dot-standby';
     if (isMicrophoneActive.value) return 'mode-dot-active';
     if ((isContinuousMode.value || isVoiceActivationMode.value) && permissionStatus.value === 'granted') return 'mode-dot-standby';
     return 'mode-dot-idle';
    };
    const getRecordingStatusText = (): string => {
     if (props.isProcessing) return 'Assistant is processing...';
     const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser';
     if (isPttMode.value && isMicrophoneActive.value) return `Recording (${method})...`;
     if (isContinuousMode.value) {
      if (pauseDetectedWebSpeech.value && sttPreference.value === 'browser_webspeech_api') return 'Pause detected, auto-sending soon...';
      if (isRecording.value && sttPreference.value === 'whisper_api') return `Recording audio segment (Whisper)...`;
      return isWebSpeechListening.value ? `Listening continuously (${method})...` : `Continuous mode ready (${method})`;
     }
     if (isVoiceActivationMode.value) {
      if (isRecording.value) return `Voice detected, recording (${method})...`;
      return isWebSpeechListening.value ? `Listening for voice (${method})...` : `Voice activation ready (${method})`;
     }
     return 'Ready';
    };
    const getIdleStatusText = (): string => {
     if (props.isProcessing) return 'Assistant is processing...';
     if (permissionStatus.value === 'granted') {
      return getModeDisplayText() + ' ready';
     }
     return 'Mic not ready or permission needed';
    };
    const getPermissionStatusClass = (): string => {
     if (permissionStatus.value === 'granted') return 'status-success';
     if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return 'status-error';
     if (permissionStatus.value === 'prompt') return 'status-warning';
     return '';
    };
    const getTranscriptionMethodDisplay = (): string =>
     sttPreference.value === 'whisper_api' ? 'Whisper API' : 'Browser Speech';
    const formatTime = (timestamp: number): string =>
     new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDuration = (seconds: number): string => {
     const mins = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const drawVADVisualization = (dataArray: Uint8Array) => {
     const canvas = vadCanvasRef.value;
     if (!canvas || !analyser) return;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
     const width = canvas.width;
     const height = canvas.height;
     ctx.fillStyle = 'rgba(30, 41, 59, 0.5)'; 
     ctx.fillRect(0, 0, width, height);
     const barWidth = (width / analyser.frequencyBinCount) * 2.5;
     let x = 0;
     for (let i = 0; i < analyser.frequencyBinCount; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      const hue = (i / analyser.frequencyBinCount) * 120 + 200; 
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
     }
    };
    const startAudioLevelMonitoring = () => {
     if (!analyser || !activeStream || activeStream.getAudioTracks().length === 0 || !activeStream.getAudioTracks()[0].enabled) {
      rawAudioLevel.value = 0; audioLevelDisplay.value = 0; return;
     }
     const dataArray = new Uint8Array(analyser.frequencyBinCount);
     if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
     audioMonitoringInterval = window.setInterval(() => {
      if (!analyser || !activeStream || !activeStream.active) { stopAudioLevelMonitoring(); return; }
      analyser.getByteFrequencyData(dataArray);
      let sum = 0; dataArray.forEach(value => sum += value);
      const average = dataArray.length > 0 ? sum / dataArray.length : 0;
      rawAudioLevel.value = average / 128; audioLevelDisplay.value = Math.min(100, rawAudioLevel.value * 100);
      if (isVoiceActivationMode.value && vadCanvasRef.value && analyser) drawVADVisualization(dataArray);
      if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isWebSpeechListening.value) {
       if (rawAudioLevel.value > vadThreshold.value) {
        if (!isRecording.value) { stopWebSpeechRecognition(); startWhisperMediaRecorder(); }
        if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId);
        vadSilenceTimerId = window.setTimeout(() => {
         if (isRecording.value) { stopWhisperMediaRecorder(); if (!isWebSpeechListening.value && permissionStatus.value === 'granted' && isMicrophoneActive.value) startWebSpeechRecognition(); }
        }, vadSilenceTimeoutMs.value);
       }
      }
     }, 50);
    };
    const stopAudioLevelMonitoring = () => {
     if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
     audioMonitoringInterval = null; audioLevelDisplay.value = 0; rawAudioLevel.value = 0;
     if (vadCanvasRef.value) { const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height); }
    };
    const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
     permissionMessage.value = 'Requesting microphone access...'; permissionStatus.value = 'prompt'; emit('permission-update', 'prompt');
     try {
      if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
      if (audioContext && audioContext.state !== 'closed') { await audioContext.close(); audioContext = null; }
      const constraints: MediaStreamConstraints = { audio: selectedAudioDeviceId.value ? { deviceId: { exact: selectedAudioDeviceId.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true } : { echoCancellation: true, noiseSuppression: true, autoGainControl: true } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeStream = stream; audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); analyser = audioContext.createAnalyser(); microphoneSourceNode = audioContext.createMediaStreamSource(stream); analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.5; microphoneSourceNode.connect(analyser);
      permissionStatus.value = 'granted'; permissionMessage.value = 'Microphone ready'; emit('permission-update', 'granted'); setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 3000); micAccessInitiallyChecked.value = true; return stream;
     } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { permissionStatus.value = 'denied'; permissionMessage.value = 'Microphone access denied.'; }
      else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') { permissionStatus.value = 'error'; permissionMessage.value = 'No microphone found.'; }
      else { permissionStatus.value = 'error'; permissionMessage.value = `Mic error: ${err.message || err.name}`; }
      emit('permission-update', permissionStatus.value as 'denied' | 'error'); micAccessInitiallyChecked.value = true; activeStream = null; return null;
     }
    };

    const initializeWebSpeech = (): boolean => {
     if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) { if (sttPreference.value === 'browser_webspeech_api') { permissionMessage.value = 'Web Speech API not supported.'; permissionStatus.value = 'error'; toast?.add({ type: 'error', title: 'Not Supported', message: permissionMessage.value }); } return false; }
     const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition; if (recognition) return true;
     recognition = new SpeechRecognitionAPI(); recognition.lang = settings.speechLanguage || 'en-US';
     recognition.onstart = () => { isWebSpeechListening.value = true; if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) { isRecording.value = true; startRecordingTimer(); } startAudioLevelMonitoring(); };
     recognition.onresult = (event: SpeechRecognitionEvent) => { let interim = ''; let finalPart = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { const transcript = event.results[i][0].transcript; if (event.results[i].isFinal) finalPart += transcript + ' '; else interim += transcript; } if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') { liveTranscriptWebSpeech.value = interim; if (finalPart.trim()) { pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart.trim()).trim(); liveTranscriptWebSpeech.value = ''; resetPauseDetectionWebSpeech(); } } else { interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim; if (finalPart.trim()) finalTranscriptWebSpeech.value += finalPart.trim() + ' '; } };
     recognition.onerror = (event: SpeechRecognitionErrorEvent) => { isWebSpeechListening.value = false; isRecording.value = false; clearRecordingTimer(); stopAudioLevelMonitoring(); if (event.error === 'not-allowed' || event.error === 'service-not-allowed') { permissionStatus.value = 'denied'; permissionMessage.value = 'Mic access denied.'; } else if (event.error === 'no-speech') { permissionMessage.value = 'No speech detected.'; if (isPttMode.value) toast?.add({ type: 'info', title: 'No Speech', message: permissionMessage.value }); } else if (event.error === 'network') { permissionMessage.value = 'Network error for speech.'; } else if (event.error === 'aborted') { permissionMessage.value = 'Speech input aborted.'; } else { permissionStatus.value = 'error'; permissionMessage.value = `Speech error: ${event.error}.`; } if (event.error !== 'no-speech' && event.error !== 'aborted' && event.error !== 'not-allowed') toast?.add({ type: 'error', title: 'Speech Error', message: permissionMessage.value }); if ((isContinuousMode.value || isVoiceActivationMode.value) && event.error !== 'not-allowed' && event.error !== 'service-not-allowed' && permissionStatus.value === 'granted' && isMicrophoneActive.value) { setTimeout(() => { if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) startWebSpeechRecognition(); }, 1000); } };
     recognition.onend = () => { isWebSpeechListening.value = false; stopAudioLevelMonitoring(); if (isPttMode.value && sttPreference.value === 'browser_webspeech_api') { if (finalTranscriptWebSpeech.value.trim()) sendTranscription(finalTranscriptWebSpeech.value.trim()); isRecording.value = false; clearRecordingTimer(); cleanUpAfterTranscription(); } else if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'browser_webspeech_api') { if (permissionStatus.value === 'granted' && !props.isProcessing && isMicrophoneActive.value) { setTimeout(() => { if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) startWebSpeechRecognition(); }, 250); } else { isRecording.value = false; clearRecordingTimer(); } } else { isRecording.value = false; clearRecordingTimer(); } };
     recognition.onspeechstart = () => { if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId); if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && !isRecording.value) startWhisperMediaRecorder(); };
     recognition.onspeechend = () => { if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && isRecording.value) stopWhisperMediaRecorder(); };
     return true;
    };
    const startWebSpeechRecognition = async (): Promise<boolean> => { if (!recognition && !initializeWebSpeech()) return false; if (isWebSpeechListening.value) return true; if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return false; if (!activeStream && permissionStatus.value === 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return false; finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; recognition!.lang = settings.speechLanguage || 'en-US'; recognition!.continuous = (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') || ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api'); recognition!.interimResults = true; try { recognition!.start(); return true; } catch (e: any) { if (e.name === 'InvalidStateError') { isWebSpeechListening.value = true; return true; } permissionMessage.value = `Could not start speech: ${e.message || e.name}`; permissionStatus.value = 'error'; isWebSpeechListening.value = false; return false; } };
    const stopWebSpeechRecognition = (abort = false) => { if (recognition && isWebSpeechListening.value) { try { if (abort) recognition.abort(); else recognition.stop(); } catch (e) { isWebSpeechListening.value = false; } } };
    const startWhisperMediaRecorder = async (): Promise<boolean> => { if (isRecording.value) return true; if ((!activeStream || !activeStream.active) && !(await requestMicrophonePermissionsAndGetStream())) return false; if(!activeStream) return false; audioChunks = []; const options = { mimeType: 'audio/webm;codecs=opus' }; try { mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType) ? new MediaRecorder(activeStream, options) : new MediaRecorder(activeStream); } catch (e) { toast?.add({ type: 'error', title: 'Recording Error', message: 'Failed to init audio recorder.' }); return false; } mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunks.push(event.data); }; mediaRecorder.onstop = async () => { const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' }); audioChunks = []; if (audioBlob.size > 1000) { await transcribeWithWhisper(audioBlob); } else if (isPttMode.value) { toast?.add({ type: 'warning', title: 'No Audio', message: 'No audio recorded.' }); } isRecording.value = false; clearRecordingTimer(); if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && !isWebSpeechListening.value && isMicrophoneActive.value) startWebSpeechRecognition(); else if (!isMicrophoneActive.value) stopWebSpeechRecognition(true); }; mediaRecorder.onerror = (event: Event) => { toast?.add({ type: 'error', title: 'Recording Error', message: 'MediaRecorder failed.' }); isRecording.value = false; clearRecordingTimer(); }; mediaRecorder.start(isContinuousMode.value || isVoiceActivationMode.value ? 10000 : undefined); isRecording.value = true; startRecordingTimer(); startAudioLevelMonitoring(); return true; };
    const stopWhisperMediaRecorder = () => { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); else isRecording.value = false; };
    const transcribeWithWhisper = async (audioBlob: Blob) => { if (props.isProcessing) { toast?.add({ type: 'info', title: 'Busy', message: 'Assistant is busy.' }); return; } try { const formData = new FormData(); formData.append('audio', audioBlob, `audio-${Date.now()}.webm`); if (settings.speechLanguage) formData.append('language', settings.speechLanguage.substring(0, 2)); const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>; if (response.data.transcription) sendTranscription(response.data.transcription); else throw new Error(response.data.message || 'Empty transcription.'); } catch (error: any) { toast?.add({ type: 'error', title: 'Transcription Error', message: error.response?.data?.message || error.message || 'Whisper error.' }); } };

    const startAudioCapture = async () => { if (props.isProcessing || isMicrophoneActive.value) return; if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return; if (sttPreference.value === 'browser_webspeech_api') await startWebSpeechRecognition(); else if (isContinuousMode.value || isVoiceActivationMode.value) await startWebSpeechRecognition(); else await startWhisperMediaRecorder(); };
    const stopAudioCapture = (abortWebSpeech = false) => { if (sttPreference.value === 'browser_webspeech_api') stopWebSpeechRecognition(abortWebSpeech); else { if (isRecording.value) stopWhisperMediaRecorder(); if (isWebSpeechListening.value) stopWebSpeechRecognition(abortWebSpeech); } clearRecordingTimer(); clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; stopAudioLevelMonitoring(); if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim()) sendPendingWebSpeechTranscription(); };
    const toggleRecording = async () => { if (props.isProcessing) return; if (isMicrophoneActive.value) stopAudioCapture(true); else { if (permissionStatus.value !== 'granted') { const stream = await requestMicrophonePermissionsAndGetStream(); if (!stream) { toast?.add({ type: 'error', title: 'Mic Access', message: permissionMessage.value || 'Could not access mic.' }); return; } } await startAudioCapture(); } };

    const handleTextInput = () => { if (textareaRef.value) { textareaRef.value.style.height = 'auto'; textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`; } };
    const handleTextSubmit = () => { if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) { sendTranscription(textInput.value.trim()); textInput.value = ''; nextTick(() => handleTextInput()); } };
    const sendTranscription = (text: string) => { if (text.trim()) { emit('transcription', text.trim()); const newHistoryItem: TranscriptionHistoryItem = { id: `${Date.now()}-${Math.random().toString(36).substring(7)}`, text: text.trim(), timestamp: Date.now(), sent: true, }; const updatedHistory = [newHistoryItem, ...transcriptionHistory.value]; transcriptionHistory.value = updatedHistory.slice(0, 10); } };
    const resendTranscription = (item: TranscriptionHistoryItem) => { sendTranscription(item.text); const index = transcriptionHistory.value.findIndex((h) => h.id === item.id); if (index > -1) transcriptionHistory.value[index].sent = true; };
    const sendPendingWebSpeechTranscription = () => { if (pendingTranscriptWebSpeech.value.trim()) sendTranscription(pendingTranscriptWebSpeech.value.trim()); clearPendingWebSpeechTranscription(); };
    const clearPendingWebSpeechTranscription = () => { pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = ''; clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0; };
    const editPendingTranscription = () => { if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) { editingTranscription.value = pendingTranscriptWebSpeech.value; showEditModal.value = true; nextTick(() => editModalTextareaRef.value?.focus()); } };
    const saveEdit = () => { if (editingTranscription.value.trim()) { pendingTranscriptWebSpeech.value = editingTranscription.value.trim(); sendPendingWebSpeechTranscription(); } showEditModal.value = false; editingTranscription.value = ''; };
    const cancelEdit = () => { showEditModal.value = false; editingTranscription.value = ''; };

    const resetPauseDetectionWebSpeech = () => { clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0; if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && continuousModeAutoSend.value) { pauseTimerIdWebSpeech = window.setTimeout(() => { if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && continuousModeAutoSend.value && isContinuousMode.value) { pauseDetectedWebSpeech.value = true; pauseCountdownWebSpeech.value = continuousModePauseTimeoutMs.value; const countdownInterval = setInterval(() => { if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isWebSpeechListening.value) { clearInterval(countdownInterval); pauseDetectedWebSpeech.value = false; return; } pauseCountdownWebSpeech.value -= 100; if (pauseCountdownWebSpeech.value <= 0) { clearInterval(countdownInterval); if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) sendPendingWebSpeechTranscription(); pauseDetectedWebSpeech.value = false; } }, 100); } }, 500); } };
    const startRecordingTimer = () => { clearRecordingTimer(); recordingSeconds.value = 0; recordingTimerId = window.setInterval(() => { recordingSeconds.value += 0.1; if ((isPttMode.value || isVoiceActivationMode.value) && isRecording.value && recordingSeconds.value >= 60) { toast?.add({ type: 'info', title: 'Recording Limit', message: 'Max recording time (60s) reached.' }); stopAudioCapture(sttPreference.value === 'browser_webspeech_api'); } }, 100); };
    const clearRecordingTimer = () => { if (recordingTimerId !== null) clearInterval(recordingTimerId); recordingTimerId = null; recordingSeconds.value = 0; };
    const clearPauseTimerWebSpeech = () => { if (pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech); pauseTimerIdWebSpeech = null; };
    const cleanUpAfterTranscription = () => { interimTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = ''; audioChunks = []; clearRecordingTimer(); };
    const stopAllAudioProcessing = (abortWebSpeech = true) => { if (recognition) { try { if (isWebSpeechListening.value) { if (abortWebSpeech) recognition.abort(); else recognition.stop(); } } catch (e) { console.warn('Error stopping WebSpeech:', e); } } isWebSpeechListening.value = false; if (mediaRecorder && mediaRecorder.state === 'recording') { try { mediaRecorder.stop(); } catch (e) { console.warn('Error stopping MediaRecorder:', e); } } isRecording.value = false; if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; } if (audioContext && audioContext.state !== 'closed') { audioContext.close().catch(e => console.warn('Error closing AudioContext:', e)); audioContext = null; } microphoneSourceNode = null; analyser = null; stopAudioLevelMonitoring(); cleanUpAfterTranscription(); clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0; };

    onMounted(async () => { if (typeof window !== 'undefined') initializeWebSpeech(); if (navigator.permissions) { try { const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName }); permissionStatus.value = perm.state; if (perm.state === 'granted') { permissionMessage.value = ''; emit('permission-update', 'granted'); if (isContinuousMode.value || isVoiceActivationMode.value) await startAudioCapture(); } else if (perm.state === 'prompt') { permissionMessage.value = 'Click mic to grant access.'; emit('permission-update', 'prompt'); } else { permissionMessage.value = 'Mic access denied in browser settings.'; emit('permission-update', 'denied'); } perm.onchange = () => { permissionStatus.value = perm.state; emit('permission-update', perm.state); if (perm.state === 'granted') { permissionMessage.value = 'Mic ready.'; if ((isContinuousMode.value || isVoiceActivationMode.value) && !isMicrophoneActive.value) startAudioCapture(); } else if (perm.state === 'denied') { permissionMessage.value = 'Mic access denied.'; if (isMicrophoneActive.value) stopAllAudioProcessing(); } else { permissionMessage.value = 'Mic access requires action.'; if (isMicrophoneActive.value) stopAllAudioProcessing(); } }; } catch (e) { permissionStatus.value = 'error'; permissionMessage.value = 'Cannot query mic permission.'; emit('permission-update', 'error'); } finally { micAccessInitiallyChecked.value = true; } } else { micAccessInitiallyChecked.value = true; permissionMessage.value = 'Permissions API not supported.'; } });
    onBeforeUnmount(() => { stopAllAudioProcessing(); if (navigator.permissions) { navigator.permissions.query({ name: 'microphone' as PermissionName }).then(perm => { perm.onchange = null; }).catch(e => console.warn('Error removing listener:', e)); } if (recognition) { recognition.onstart = null; recognition.onresult = null; recognition.onerror = null; recognition.onend = null; recognition.onspeechstart = null; recognition.onspeechend = null; recognition = null; } if (mediaRecorder) { mediaRecorder.ondataavailable = null; mediaRecorder.onstop = null; mediaRecorder.onerror = null; mediaRecorder = null; } });

    watch(audioInputMode, (newMode, oldMode) => { if (newMode === oldMode) return; stopAllAudioProcessing(true); liveTranscriptWebSpeech.value = ''; pendingTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') { nextTick(() => { if (audioInputMode.value === newMode && !isMicrophoneActive.value && permissionStatus.value === 'granted') startAudioCapture(); }); } });
    watch(sttPreference, (newPref, oldPref) => { if (newPref === oldPref) return; stopAllAudioProcessing(true); if (newPref === 'browser_webspeech_api' && typeof window !== 'undefined' && !recognition) initializeWebSpeech(); if ((audioInputMode.value === 'continuous' || audioInputMode.value === 'voice-activation') && permissionStatus.value === 'granted') { nextTick(() => { if (sttPreference.value === newPref && !isMicrophoneActive.value && permissionStatus.value === 'granted') startAudioCapture(); }); } });
    watch(selectedAudioDeviceId, (newVal, oldVal) => { if (newVal !== oldVal && isMicrophoneActive.value) { stopAllAudioProcessing(true); nextTick(() => { if (permissionStatus.value === 'granted') startAudioCapture(); }); } });
    watch(() => settings.speechLanguage, (newLang, oldLang) => { if (newLang === oldLang) return; if (recognition) { recognition.lang = newLang || 'en-US'; if (isWebSpeechListening.value) { stopWebSpeechRecognition(true); nextTick(() => { if (isMicrophoneActive.value && permissionStatus.value === 'granted' && (isContinuousMode.value || isVoiceActivationMode.value || isPttMode.value)) startWebSpeechRecognition(); }); } } });

    return {
     props, textInput, textareaRef, vadCanvasRef, editModalTextareaRef, isRecording, isWebSpeechListening, permissionStatus,
     permissionMessage, micAccessInitiallyChecked, interimTranscriptWebSpeech, liveTranscriptWebSpeech, pendingTranscriptWebSpeech,
     transcriptionHistory, showTranscriptionHistory, recordingSeconds, pauseDetectedWebSpeech, pauseCountdownWebSpeech,
     audioLevelDisplay, showEditModal, editingTranscription, settings, isMicrophoneActive, isPttMode, isContinuousMode,
     isVoiceActivationMode, getButtonTitle, getPlaceholderText, getModeDisplayText, getModeIndicatorClass, getRecordingStatusText,
     getIdleStatusText, getPermissionStatusClass, getTranscriptionMethodDisplay, formatTime, formatDuration, toggleRecording,
     handleTextInput, handleTextSubmit, sendPendingWebSpeechTranscription, clearPendingWebSpeechTranscription,
     editPendingTranscription, saveEdit, cancelEdit, resendTranscription, requestMicrophonePermissionsAndGetStream,
      startAudioCapture, stopAudioCapture,
    };
   },
});
</script>

<style scoped lang="postcss">
/* Styles for VoiceInput.vue - Holographic Analog Theme */

.voice-input-panel-holographic {
   @apply p-3 sm:p-4 rounded-xl border transition-all duration-300 ease-out;
   background: var(--glass-bg);
   backdrop-filter: blur(var(--glass-blur)) saturate(130%);
   -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(130%);
   border-color: var(--glass-border);
   box-shadow: var(--glass-shadow), var(--tw-shadow-analog-inset);
}
.voice-input-panel-holographic.processing { 
   border-color: hsl(var(--accent-focus-hsl) / 0.5);
   box-shadow: var(--tw-shadow-holo-md), var(--tw-shadow-analog-inset);
}

.input-area-holographic {
   @apply flex items-end gap-2 mb-2.5;
}

.voice-textarea-holographic {
   @apply form-input flex-grow resize-none py-2.5 px-3.5 text-sm leading-relaxed;
   min-height: 44px; 
   max-height: 120px;
}
.voice-textarea-holographic:disabled {
   @apply bg-neutral-bg-subtle/50 cursor-not-allowed;
}

.send-button-holographic {
   @apply shrink-0 self-end !p-2.5; 
}
.send-button-holographic:disabled {
   @apply bg-neutral-border-dark opacity-50;
}

.live-transcript-display-holographic {
   @apply text-xs p-2 my-1.5 rounded-md border;
   background-color: hsl(var(--bg-subtle-hsl) / 0.7);
   border-color: hsl(var(--primary-focus-hsl) / 0.2);
   color: hsl(var(--text-secondary-hsl));
   min-height: 2.5rem;
  line-height: 1.4;
}
.live-transcript-display-holographic p { @apply mb-0.5 last:mb-0; }
.interim-transcript-holographic { @apply text-neutral-text-muted italic; }
.live-web-speech-transcript-holographic { color: hsl(var(--accent-light-hsl)); }
.pending-transcript-holographic { color: hsl(var(--text-secondary-hsl)); }
.whisper-recording-status-holographic { color: hsl(var(--holo-purple-hsl) / 0.9); } /* This uses hsl() correctly */
.streaming-cursor-holographic { 
  @apply inline-block animate-blink; /* Ensure .animate-blink is defined in main.css or tailwind.config.js */
}

.controls-main-row-holographic {
   @apply flex items-center gap-2 sm:gap-3;
}

.mic-button-holographic {
   @apply btn btn-icon p-3 sm:p-3.5 rounded-full transition-all duration-200 ease-out relative overflow-visible;
   background-image: linear-gradient(145deg, hsl(var(--neutral-bg-surface)), hsl(var(--neutral-bg-elevated)));
   border: 2px solid hsl(var(--neutral-border-light));
   color: hsl(var(--neutral-text-secondary));
   box-shadow: var(--tw-shadow-analog-outset), 0 0 0 0px hsl(var(--primary-focus-hsl)/0);
}
.dark .mic-button-holographic {
   background-image: linear-gradient(145deg, hsl(var(--neutral-bg-elevated-dark)), hsl(var(--neutral-bg-subtle-dark)));
   border-color: hsl(var(--neutral-border-dark));
   color: hsl(var(--neutral-text-muted-dark));
}

.mic-button-holographic.active {
   @apply border-transparent text-white;
   background-image: linear-gradient(145deg, hsl(var(--primary-color-hsl)), hsl(var(--primary-dark-hsl)));
   box-shadow: var(--tw-shadow-holo-md), 0 0 0 4px hsl(var(--primary-focus-hsl)/0.3);
   animation: micPulseActive 1.5s infinite; /* Ensure micPulseActive is defined */
}
.dark .mic-button-holographic.active {
   background-image: linear-gradient(145deg, hsl(var(--primary-light-hsl)), hsl(var(--primary-color-hsl)));
   box-shadow: var(--tw-shadow-holo-md), 0 0 0 4px hsl(var(--primary-focus-hsl)/0.4);
}
@keyframes micPulseActive { /* Local definition if not global */
   0%, 100% { transform: scale(1); /* Base shadow from @apply */ }
   50% { transform: scale(1.05); box-shadow: var(--tw-shadow-holo-lg), 0 0 0 8px hsl(var(--primary-focus-hsl)/0.15); }
}

.mic-button-holographic.processing,
.mic-button-holographic.disabled.error {
   @apply bg-neutral-border-dark text-neutral-text-muted cursor-not-allowed opacity-60;
   box-shadow: var(--tw-shadow-analog-inset);
}
.mic-button-holographic.disabled.error {
  background-image: linear-gradient(145deg, hsl(var(--error-dark)), hsl(var(--error-hue) var(--error-saturation) calc(var(--error-lightness) - 20%)));
  color: hsl(var(--error-lightness) 20% 80%);
  border-color: hsl(var(--error-hue) var(--error-saturation) calc(var(--error-lightness) - 15%));
}

.status-display-holographic {
   @apply flex-grow flex flex-col justify-center items-start text-left pl-2 min-w-0; 
}

.mode-indicator-wrapper-holographic { @apply flex items-center gap-1.5 mb-0.5; }
.mode-dot-holographic {
   @apply w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm;
}
.mode-dot-holographic.mode-dot-active {
   background-color: hsl(var(--holo-green-hsl)); /* Direct HSL usage */
   box-shadow: 0 0 6px 1px hsl(var(--holo-green-hsl)/0.7);
   animation: pulseStatus 1.5s infinite; /* Ensure pulseStatus is defined (likely in main.css or tailwind.config.js) */
}
.mode-dot-holographic.mode-dot-standby {
   background-color: hsl(var(--warning-color-hsl)); /* Direct HSL usage */
   box-shadow: 0 0 6px 1px hsl(var(--warning-color-hsl)/0.5);
}
.mode-dot-holographic.mode-dot-idle {
   background-color: hsl(var(--neutral-text-muted) / 0.7); /* Direct HSL usage */
}
.mode-text-holographic { @apply text-xs font-medium text-neutral-text-secondary truncate; }

.transcription-status-text-holographic {
   @apply text-xs text-neutral-text-muted truncate;
   min-height: 1.25rem; 
}
.permission-text-holographic { @apply text-xxs mt-0.5; } 
.permission-text-holographic.status-error { color: hsl(var(--error-color-hsl)); } /* Direct HSL */
.permission-text-holographic.status-warning { color: hsl(var(--warning-color-hsl)); } /* Direct HSL */
.permission-text-holographic.status-success { color: hsl(var(--success-color-hsl)); } /* Direct HSL */

.secondary-controls-holographic { @apply flex items-center gap-1.5 ml-auto; }
.control-btn-holographic {
   @apply btn btn-icon btn-ghost !p-2 text-neutral-text-muted hover:text-primary-focus dark:hover:text-primary-light;
}
.control-btn-holographic.stop-btn-holographic {
   @apply text-error-500 hover:bg-error-500/10 hover:text-error-700 dark:text-error-light dark:hover:bg-error-light/10 dark:hover:text-error-light;
}

.vad-canvas-holographic {
   @apply w-full h-[40px] mt-2.5 rounded-md opacity-80;
   border: 1px solid hsl(var(--primary-focus-hsl) / 0.2);
   background: linear-gradient(to bottom, hsl(var(--bg-base-hsl)/0.1), hsl(var(--bg-subtle-hsl)/0.2));
}
.web-speech-vad-active-indicator {
  /* Corrected to use Tailwind generated class from CSS variable */
  @apply text-center text-xs text-holo-green py-1 rounded bg-holo-green/10 border border-holo-green/20 mt-2;
}

/* Modal Styles - Holographic */
.modal-overlay-holographic {
   @apply fixed inset-0 z-50 flex items-center justify-center p-4;
   background-color: hsl(var(--bg-base-hsl) / 0.7);
   backdrop-filter: blur(10px) saturate(120%);
}
.modal-content-holographic {
   @apply w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden;
   border-color: hsl(var(--primary-focus-hsl) / 0.4);
}
.modal-header-holographic {
   @apply flex items-center justify-between p-4 border-b;
   border-bottom-color: hsl(var(--primary-focus-hsl) / 0.2);
}
.modal-title-holographic {
   @apply text-lg font-semibold text-glow-primary; /* Uses utility from Tailwind config */
   color: hsl(var(--primary-light-hsl)); /* Base color for the glow */
}
.modal-close-button-holographic {
   @apply p-1.5 rounded-full text-neutral-text-muted hover:text-primary-focus hover:bg-primary-500/10 transition-colors;
}
.modal-body-holographic {
   @apply p-4 flex-grow overflow-y-auto; 
}
.modal-footer-holographic {
   @apply flex justify-end gap-3 p-4 border-t;
   border-top-color: hsl(var(--primary-focus-hsl) / 0.2);
}

.history-list-holographic { @apply space-y-2.5; }
.history-item-holographic {
   @apply p-2.5 rounded-md transition-colors;
   border: 1px solid hsl(var(--border-color-hsl) / 0.5);
   background-color: hsl(var(--bg-surface-hsl) / 0.5);
}
.history-item-holographic:hover {
   background-color: hsl(var(--bg-elevated-hsl) / 0.7);
   border-color: hsl(var(--primary-focus-hsl) / 0.3);
}
.history-item-text-holographic { @apply text-sm text-neutral-text mb-1; }
.history-item-meta-holographic { @apply flex justify-between items-center; }
.timestamp-holographic { @apply text-xxs text-neutral-text-muted; }
.resend-btn-holographic {
   @apply text-xs text-primary-focus hover:underline hover:text-primary-light;
}

.modal-fade-holographic-enter-active,
.modal-fade-holographic-leave-active {
   transition: opacity 0.3s var(--ease-out-quad), transform 0.3s var(--ease-out-quad);
}
.modal-fade-holographic-enter-from,
.modal-fade-holographic-leave-to {
   opacity: 0;
   transform: translateY(20px) scale(0.97);
}

.custom-scrollbar-thin { 
   scrollbar-width: thin;
   scrollbar-color: hsl(var(--scrollbar-thumb-bg)) hsl(var(--scrollbar-track-bg));
}
.custom-scrollbar-thin::-webkit-scrollbar { @apply w-1.5 h-1.5; }
.custom-scrollbar-thin::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: hsl(var(--scrollbar-thumb-bg)); @apply rounded-full; }
.custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: hsl(var(--scrollbar-thumb-hover-bg)); }

.text-xxs { 
  font-size: 0.65rem; 
  line-height: 0.9rem; 
}
</style>