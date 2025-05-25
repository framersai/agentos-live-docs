<template>
  <div class="voice-input-wrapper">
    <transition name="slide-up">
      <div v-if="showTranscriptionHistory && transcriptionHistory.length > 0" class="transcription-history-overlay">
        <div class="history-header">
          <h4 class="history-title">Recent Transcriptions</h4>
          <button @click="showTranscriptionHistory = false" class="history-close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="history-content">
          <div v-for="item in transcriptionHistory" :key="item.id"
               class="history-item"
               :class="{ 'history-item-sent': item.sent }">
            <span class="history-time">{{ formatTime(item.timestamp) }}</span>
            <p class="history-text">{{ item.text }}</p>
            <button v-if="!item.sent" @click="resendTranscription(item)" class="history-resend">
              Send
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="input-container glass-morphism">
      <div class="input-header">
        <div class="mode-indicator">
          <div class="mode-dot" :class="getModeIndicatorClass()"></div>
          <span class="mode-text">{{ getModeDisplayText() }}</span>
        </div>
        <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="history-toggle" title="Show history">
          <HistoryIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="input-controls">
        <div class="text-input-wrapper">
          <textarea
            v-model="textInput"
            class="text-input"
            :placeholder="getPlaceholderText()"
            @keydown.enter.prevent="handleTextSubmit"
            @input="handleTextInput"
            :disabled="isMicrophoneActive || props.isProcessing"
            ref="textareaRef"
          ></textarea>
          <transition name="fade">
            <div v-if="textInput.length > 0" class="char-counter">
              {{ textInput.length }} / 4000
            </div>
          </transition>
        </div>

        <div class="voice-controls">
          <button
            @click="toggleRecording"
            :class="['voice-button', {
              'recording': isMicrophoneActive && !props.isProcessing,
              'processing': props.isProcessing,
              'disabled': !micAccessInitiallyChecked || permissionStatus === 'denied' || permissionStatus === 'error'
            }]"
            :title="getButtonTitle()"
            :disabled="props.isProcessing || !micAccessInitiallyChecked || permissionStatus === 'denied' || permissionStatus === 'error'"
          >
            <div class="button-content">
              <div v-if="props.isProcessing" class="processing-state">
                <div class="processing-spinner">
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                </div>
              </div>

              <div v-else-if="isMicrophoneActive" class="recording-state">
                <StopRecordingIcon class="icon-recording" />
                <div class="pulse-rings">
                  <div class="pulse-ring"></div>
                  <div class="pulse-ring pulse-ring-2"></div>
                  <div class="pulse-ring pulse-ring-3"></div>
                </div>
              </div>

              <div v-else class="idle-state">
                <MicrophoneIcon class="icon-microphone" />
              </div>
            </div>
          </button>

          <div class="mode-controls">
            </div>
        </div>
      </div>

      <div class="status-bar">
        <div class="status-section">
          <transition name="status-fade" mode="out-in">
            <div v-if="permissionStatus !== 'granted' && permissionStatus !== '' && micAccessInitiallyChecked"
                 :key="permissionStatus"
                 :class="['status-item', getPermissionStatusClass()]">
              <div class="status-icon">
                <CloseIcon v-if="permissionStatus === 'denied' || permissionStatus === 'error'" class="w-4 h-4" />
                <svg v-else-if="permissionStatus === 'prompt'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <span class="status-text">{{ permissionMessage }}</span>
              <button v-if="permissionStatus === 'denied' || permissionStatus === 'error'" @click="requestMicrophonePermissionsAndGetStream" class="retry-button">
                Retry
              </button>
            </div>

            <div v-else-if="isMicrophoneActive && !props.isProcessing" :key="'recording'" class="status-item status-recording">
              <div class="recording-indicator">
                <div class="recording-dot"></div>
              </div>
              <span class="status-text">{{ getRecordingStatusText() }}</span>
              <span v-if="isRecording || (isWebSpeechListening && (isPttMode || isVoiceActivationMode))" class="recording-timer">{{ formatDuration(recordingSeconds) }}</span>
            </div>
             <div v-else-if="props.isProcessing" :key="'processing'" class="status-item status-processing">
                 <span class="status-text">Assistant is processing...</span>
             </div>
            <div v-else :key="'idle'" class="status-item status-idle">
              <span class="status-text">{{ getIdleStatusText() }}</span>
            </div>
          </transition>
        </div>

        <div v-if="audioLevelDisplay > 0 && isMicrophoneActive" class="audio-level-indicator">
          <div class="audio-bars">
            <div v-for="i in 5" :key="i"
                 class="audio-bar"
                 :class="{ 'active': audioLevelDisplay >= i * 20 }"
                 :style="{ height: `${Math.min(100, audioLevelDisplay)}%` }">
            </div>
          </div>
        </div>
      </div>

      <transition name="slide-fade">
        <div v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && (liveTranscriptWebSpeech || pendingTranscriptWebSpeech)"
             class="continuous-preview">
          <div class="preview-header">
            <span class="preview-label">Live Transcription</span>
            <div class="preview-actions">
              <button @click="editPendingTranscription" class="preview-btn" title="Edit">
                <EditIcon class="w-4 h-4" />
              </button>
              <button @click="clearPendingWebSpeechTranscription" class="preview-btn" title="Clear">
                <ClearIcon class="w-4 h-4" />
              </button>
              <button @click="sendPendingWebSpeechTranscription" class="preview-btn preview-btn-send" title="Send">
                <SendIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="preview-content">
            <span class="preview-text pending">{{ pendingTranscriptWebSpeech }}</span>
            <span class="preview-text live">{{ liveTranscriptWebSpeech }}</span>
          </div>
          <div v-if="pauseDetectedWebSpeech && settings.continuousModeAutoSend" class="pause-indicator">
            <div class="pause-progress" :style="{ width: `${(pauseCountdownWebSpeech / settings.continuousModePauseTimeoutMs) * 100}%` }"></div>
            <span class="pause-text">Auto-sending in {{ Math.ceil(pauseCountdownWebSpeech / 1000) }}s...</span>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="isVoiceActivationMode && (isWebSpeechListening || isRecording) && vadCanvasRef" class="vad-visualization">
          <canvas ref="vadCanvasRef" width="200" height="50"></canvas>
          <div class="vad-threshold-line" :style="{ bottom: `${settings.vadThreshold * 100}%` }"></div>
        </div>
      </transition>
    </div>

    <transition name="modal-fade">
      <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
        <div class="modal-content glass-morphism">
          <div class="modal-header">
            <h3 class="modal-title">Edit Transcription</h3>
            <button @click="cancelEdit" class="modal-close">
              <CloseIcon class="w-5 h-5" />
            </button>
          </div>
          <textarea
            v-model="editingTranscription"
            class="modal-textarea"
            placeholder="Edit your transcription here..."
            @keydown.ctrl.enter="saveEdit"
            @keydown.meta.enter="saveEdit"
            ref="editModalTextareaRef"
          ></textarea>
          <div class="modal-footer">
            <button @click="cancelEdit" class="btn-secondary">Cancel</button>
            <button @click="saveEdit" class="btn-primary">
              <SendIcon class="w-4 h-4 mr-1" />
              Send
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
// File: src/components/voice/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Handles voice input, transcription (Whisper/WebSpeech),
 * audio mode management (PTT, Continuous, VAD), and local transcription history.
 * Consumes global voice settings from VoiceSettingsService.
 * @version 2.0.0
 */

// Global type declarations (ensure these are defined, perhaps in a .d.ts file)
// For brevity, I'll assume they are correctly defined as in your provided snippet.
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
  var SpeechRecognition: { // eslint-disable-line no-var
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

import {
  ref, computed, onMounted, onBeforeUnmount, watch, inject,
  defineComponent, nextTick, Ref
} from 'vue';
// Removed useStorage for settings managed by VoiceSettingsService
import { speechAPI } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/utils/constants';
import { voiceSettingsManager } from '@/services/voice.settings.service'; // Import the service

// Heroicons (ensure you have these or replace with your icons)
import {
    ClockIcon as HistoryIcon, XMarkIcon as CloseIcon, PaperAirplaneIcon as SendIcon,
    ComputerDesktopIcon as BrowserSpeechIcon, CloudIcon as WhisperSpeechIcon,
    SpeakerWaveIcon as ContinuousModeIcon, ArrowsPointingOutIcon as VADModeIcon, HandRaisedIcon as PTTModeIcon,
    PencilIcon as EditIcon, TrashIcon as ClearIcon, StopCircleIcon as StopRecordingIcon, MicrophoneIcon
} from '@heroicons/vue/24/outline';


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
    ContinuousModeIcon, VADModeIcon, PTTModeIcon, EditIcon, ClearIcon, StopRecordingIcon, MicrophoneIcon
  },
  props: {
    isProcessing: { // Prop indicating if the main app is busy (e.g., LLM call)
      type: Boolean,
      required: true,
    },
    // audioMode prop is no longer needed as VoiceSettingsManager handles it.
    // If parent needs to know, it can subscribe to the service or have an emit from here.
  },
  emits: {
    transcription: (value: string) => typeof value === 'string',
    'permission-update': (status: 'granted' | 'denied' | 'prompt' | 'error') =>
      ['granted', 'denied', 'prompt', 'error'].includes(status),
    // 'update:audio-mode' is removed as mode is now global via service.
    // Parent can observe voiceSettingsManager.settings.audioInputMode directly.
  },
  setup(props, { emit }) {
    const toast = inject('toast') as any;

    // Core State
    const textInput = ref('');
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const editModalTextareaRef = ref<HTMLTextAreaElement | null>(null);
    const isRecording = ref(false); // MediaRecorder active (Whisper) OR WebSpeech VAD/PTT active speech phase
    const isWebSpeechListening = ref(false); // WebSpeech recognition.start() called
    const permissionStatus = ref<'prompt' | 'granted' | 'denied' | 'error' | ''>('');
    const permissionMessage = ref('');
    const micAccessInitiallyChecked = ref(false);

    // Transcription State
    const interimTranscriptWebSpeech = ref('');
    const finalTranscriptWebSpeech = ref('');
    const liveTranscriptWebSpeech = ref('');
    const pendingTranscriptWebSpeech = ref('');
    const transcriptionHistory = ref<TranscriptionHistoryItem[]>( // Not using useStorage directly here anymore for history to simplify example
      JSON.parse(localStorage.getItem('vca-transcriptionHistory') || '[]')
    );
    const showTranscriptionHistory = ref(false);

    watch(transcriptionHistory, (newHistory) => {
        localStorage.setItem('vca-transcriptionHistory', JSON.stringify(newHistory));
    }, { deep: true });


    // Recording State
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let activeStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphoneSourceNode: MediaStreamAudioSourceNode | null = null;

    // Timers
    const recordingSeconds = ref(0);
    let recordingTimerId: number | null = null;
    const pauseDetectedWebSpeech = ref(false);
    const pauseCountdownWebSpeech = ref(0);
    let pauseTimerIdWebSpeech: number | null = null;
    let vadSilenceTimer: number | null = null;

    // Audio Level Monitoring
    const audioLevelDisplay = ref(0);
    const rawAudioLevel = ref(0);
    let audioMonitoringInterval: number | null = null;

    // Edit Modal
    const showEditModal = ref(false);
    const editingTranscription = ref('');

    // Canvas for VAD
    const vadCanvasRef = ref<HTMLCanvasElement | null>(null);

    // Settings from VoiceSettingsManager (reactive)
    const settings = voiceSettingsManager.settings; // This is reactive

    // Speech Recognition Instance
    let recognition: SpeechRecognition | null = null;

    // Computed Properties reflecting global settings
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

    // --- Helper Methods ---
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
      // Not active
      if (isContinuousMode.value) return 'Start continuous listening';
      if (isVoiceActivationMode.value) return 'Start voice activation';
      return 'Hold to record'; // PTT
    };

    const getPlaceholderText = (): string => {
      if (isMicrophoneActive.value) {
            if (isPttMode.value) return "Recording... release to send.";
            if (isContinuousMode.value) return "Listening continuously...";
            if (isVoiceActivationMode.value) return "Listening for voice...";
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
            if (isRecording.value && sttPreference.value === 'whisper_api') return `Recording audio segment (Whisper)...`; // MediaRecorder for Whisper chunk
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
    const getTranscriptionMethodDisplay = (): string => sttPreference.value === 'whisper_api' ? 'Whisper API' : 'Browser Speech';
    const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Audio Processing & VAD ---
    const drawVADVisualization = (dataArray: Uint8Array) => {
        const canvas = vadCanvasRef.value;
        if (!canvas || !analyser) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)'; // Dark background for VAD, assuming dark mode or make configurable
        ctx.fillRect(0, 0, width, height);

        const barWidth = width / analyser.frequencyBinCount * 2.5; // Adjust multiplier for bar density
        let x = 0;

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            const barHeight = (dataArray[i] / 255) * height; // dataArray values are 0-255
            // Simple gradient or fixed color for bars
            const hue = (i / analyser.frequencyBinCount) * 120 + 200; // Example: Blues to Purples
            ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1; // Add 1 for spacing
        }
    };
    const startAudioLevelMonitoring = () => {
        if (!analyser || !activeStream || activeStream.getAudioTracks().length === 0 || !activeStream.getAudioTracks()[0].enabled) {
            rawAudioLevel.value = 0; audioLevelDisplay.value = 0; return;
        }
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioMonitoringInterval = window.setInterval(() => {
            if (!analyser || !activeStream || !activeStream.active) { stopAudioLevelMonitoring(); return; }
            analyser.getByteFrequencyData(dataArray);
            let sum = 0; for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const average = dataArray.length > 0 ? sum / dataArray.length : 0;
            rawAudioLevel.value = average / 128; // Normalized 0-1 (assuming 256 is max, 128 is midpoint)
            audioLevelDisplay.value = Math.min(100, rawAudioLevel.value * 100);

            if (isVoiceActivationMode.value && vadCanvasRef.value && analyser) drawVADVisualization(dataArray);

            if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isWebSpeechListening.value /* VAD listener active */) {
                if (rawAudioLevel.value > vadThreshold.value) { // Use reactive setting
                    if (!isRecording.value) { // Not already recording with MediaRecorder
                        console.log('VAD: Voice detected for Whisper, starting MediaRecorder');
                        stopWebSpeechRecognition(); // Stop VAD listener briefly
                        startWhisperMediaRecorder(); // Start actual recording
                    }
                    if (vadSilenceTimer) clearTimeout(vadSilenceTimer);
                    vadSilenceTimer = window.setTimeout(() => {
                        if (isRecording.value) { // Still recording with MediaRecorder
                            console.log('VAD: Silence detected for Whisper, stopping MediaRecorder');
                            stopWhisperMediaRecorder();
                            // Restart WebSpeech VAD listener
                            if (!isWebSpeechListening.value && permissionStatus.value === 'granted' && isMicrophoneActive.value /* main toggle still on */) {
                                console.log('VAD: Restarting WebSpeech VAD post-silence.');
                                startWebSpeechRecognition();
                            }
                        }
                    }, vadSilenceTimeoutMs.value); // Use reactive setting
                }
            }
        }, 50); // Check audio level frequently
    };
    const stopAudioLevelMonitoring = () => {
        if (audioMonitoringInterval) clearInterval(audioMonitoringInterval);
        audioMonitoringInterval = null;
        audioLevelDisplay.value = 0;
        rawAudioLevel.value = 0;
        if (vadCanvasRef.value) { // Clear VAD canvas
            const ctx = vadCanvasRef.value.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
        }
    };

    const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
      permissionMessage.value = 'Requesting microphone access...';
      permissionStatus.value = 'prompt';
      emit('permission-update', 'prompt');
      try {
        if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
        if (audioContext && audioContext.state !== 'closed') { await audioContext.close(); audioContext = null;}

        const constraints: MediaStreamConstraints = {
          audio: selectedAudioDeviceId.value
            ? { deviceId: { exact: selectedAudioDeviceId.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = stream;
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphoneSourceNode = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.5;
        microphoneSourceNode.connect(analyser);
        // Do NOT connect analyser to destination if only for monitoring.

        permissionStatus.value = 'granted'; permissionMessage.value = 'Microphone ready';
        emit('permission-update', 'granted');
        setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 3000);
        micAccessInitiallyChecked.value = true;
        return stream;
      } catch (err: any) {
        console.error('Microphone permission error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          permissionStatus.value = 'denied'; permissionMessage.value = 'Microphone access denied.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          permissionStatus.value = 'error'; permissionMessage.value = 'No microphone found.';
        } else {
          permissionStatus.value = 'error'; permissionMessage.value = `Mic error: ${err.message || err.name}`;
        }
        emit('permission-update', permissionStatus.value as 'denied' | 'error');
        micAccessInitiallyChecked.value = true;
        activeStream = null; return null;
      }
    };

    // --- WebSpeech & MediaRecorder Logic ---
    const initializeWebSpeech = (): boolean => {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
          if (sttPreference.value === 'browser_webspeech_api') { // Only show error if it's the selected method
            permissionMessage.value = 'Web Speech API not supported in this browser.';
            permissionStatus.value = 'error';
            toast?.add({ type: 'error', title: 'Browser Not Supported', message: permissionMessage.value });
          }
          return false;
        }
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (recognition) return true; // Already initialized

        recognition = new SpeechRecognitionAPI();
        recognition.lang = settings.speechLanguage || 'en-US'; // Use setting or default

        recognition.onstart = () => {
            isWebSpeechListening.value = true; console.log('WebSpeech: Started listening');
            // For WebSpeech PTT or VAD, set isRecording for visual cues
            if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) {
                isRecording.value = true; startRecordingTimer();
            }
            startAudioLevelMonitoring();
        };
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = ''; let finalPart = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalPart += transcript + ' ';
                else interim += transcript;
            }
            if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
                liveTranscriptWebSpeech.value = interim;
                if (finalPart.trim()) {
                    pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart.trim()).trim();
                    liveTranscriptWebSpeech.value = ''; // Clear live after final part
                    resetPauseDetectionWebSpeech();
                }
            } else { // PTT or VAD for WebSpeech
                interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
                if (finalPart.trim()) finalTranscriptWebSpeech.value += finalPart.trim() + ' ';
            }
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('WebSpeech Error:', event.error, event.message);
            isWebSpeechListening.value = false; isRecording.value = false; // Reset recording state for WebSpeech
            clearRecordingTimer(); stopAudioLevelMonitoring();

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                permissionStatus.value = 'denied'; permissionMessage.value = 'Microphone access denied for speech recognition.';
            } else if (event.error === 'no-speech') {
                permissionMessage.value = 'No speech detected.'; // Keep it brief
                 if (isPttMode.value) toast?.add({ type: 'info', title: 'No Speech', message: permissionMessage.value });
            } else if (event.error === 'network') {
                permissionMessage.value = 'Network error during speech recognition.';
            } else if (event.error === 'aborted') {
                permissionMessage.value = 'Speech input aborted.'; // Usually user-initiated or due to stop()
            } else {
                permissionStatus.value = 'error';
                permissionMessage.value = `Speech error: ${event.error}. ${event.message || ''}`.trim();
            }
            if (event.error !== 'no-speech' && event.error !== 'aborted' && event.error !== 'not-allowed') {
                 toast?.add({ type: 'error', title: 'Speech Error', message: permissionMessage.value });
            }

            // Attempt to restart in continuous/VAD if it wasn't a fatal error and main toggle implies it should be active
            if ((isContinuousMode.value || isVoiceActivationMode.value) &&
                event.error !== 'not-allowed' && event.error !== 'service-not-allowed' &&
                permissionStatus.value === 'granted' && isMicrophoneActive.value /* check main button state */) {
                console.log('WebSpeech error, attempting restart for continuous/VAD.');
                setTimeout(() => {
                    // Double check conditions before restarting
                    if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) {
                         startWebSpeechRecognition();
                    }
                }, 1000);
            }
        };
        recognition.onend = () => {
            console.log('WebSpeech: Ended'); const wasListening = isWebSpeechListening.value;
            isWebSpeechListening.value = false; stopAudioLevelMonitoring();

            if (isPttMode.value && sttPreference.value === 'browser_webspeech_api') {
                if (finalTranscriptWebSpeech.value.trim()) {
                    sendTranscription(finalTranscriptWebSpeech.value.trim());
                }
                isRecording.value = false; clearRecordingTimer(); cleanUpAfterTranscription();
            } else if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'browser_webspeech_api') {
                if (permissionStatus.value === 'granted' && !props.isProcessing && isMicrophoneActive.value /* Main toggle still on */ ) {
                    setTimeout(() => {
                        // Check again if still in the correct mode and main toggle on, and not already listening
                        if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) {
                            console.log('WebSpeech: Restarting for continuous/VAD from onend.');
                            startWebSpeechRecognition();
                        }
                    }, 250);
                } else { isRecording.value = false; clearRecordingTimer(); } // Ensure visual state is correct if not restarting
            } else { // Other cases, like Whisper VAD where WebSpeech just provides triggers
                isRecording.value = false; clearRecordingTimer();
            }
        };
        recognition.onspeechstart = () => {
            console.log('WebSpeech: Speech detected'); clearTimeout(vadSilenceTimer); // Clear VAD silence timer if speech starts

            // For hybrid Whisper continuous/VAD: WebSpeech detects speech, then we start MediaRecorder
            if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && !isRecording.value /* MediaRecorder not active */) {
                console.log('WebSpeech VAD (for Whisper) detected speech, starting MediaRecorder.');
                startWhisperMediaRecorder(); // This will set isRecording.value = true for MediaRecorder
            }
        };
        recognition.onspeechend = () => {
            console.log('WebSpeech: Speech ended');
            // For hybrid Whisper continuous/VAD: WebSpeech speech ends, stop MediaRecorder
            if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && isRecording.value /* MediaRecorder is active */) {
                console.log('WebSpeech VAD (for Whisper) detected speech end, stopping MediaRecorder.');
                stopWhisperMediaRecorder(); // This will handle sending, then restart WebSpeech VAD via MediaRecorder's onstop
            }
            // For WebSpeech VAD (not hybrid), onspeechend might mean stop visual recording indicator.
            // The actual recognition.stop() is usually handled by the browser or by silence detection in onend.
            if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') {
                 console.log('WebSpeech VAD: Speech ended. Recognition will process.');
                 // isRecording.value for WebSpeech VAD will be reset in its onend.
            }
        };
        return true;
    };
    const startWebSpeechRecognition = async (): Promise<boolean> => {
        if (!recognition && !initializeWebSpeech()) return false;
        if (isWebSpeechListening.value) { console.log("WebSpeech: Already listening."); return true; }

        if (permissionStatus.value !== 'granted') { if (!(await requestMicrophonePermissionsAndGetStream())) return false; }
        if (!activeStream && permissionStatus.value === 'granted') { if (!(await requestMicrophonePermissionsAndGetStream())) return false; } // Edge case

        finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; // Reset for PTT/VAD
        recognition!.lang = settings.speechLanguage || 'en-US'; // Update lang just before start
        recognition!.continuous =
            (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') || // WebSpeech continuous
            (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') || // WebSpeech VAD
            ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api'); // WebSpeech as VAD for Whisper
        recognition!.interimResults = true; // Always true for better UX

        try {
            recognition!.start();
            return true;
        } catch (e: any) {
            if (e.name === 'InvalidStateError') { // Already started or starting
                console.warn('WebSpeech: InvalidStateError on start, likely already started.');
                isWebSpeechListening.value = true; // Assume it's or will be listening
                return true;
            }
            console.error('Error starting WebSpeech:', e);
            permissionMessage.value = `Could not start speech recognition: ${e.message || e.name}`;
            permissionStatus.value = 'error';
            isWebSpeechListening.value = false;
            return false;
        }
    };
    const stopWebSpeechRecognition = (abort = false) => {
        if (recognition && isWebSpeechListening.value) {
            console.log(`WebSpeech: Stopping${abort ? ' (aborting)' : ''}...`);
            try {
                if (abort) recognition.abort();
                else recognition.stop();
            } catch (e) {
                console.warn("Error during WebSpeech stop/abort:", e);
                isWebSpeechListening.value = false; // Ensure state is reset on error too
            }
        }
        // isWebSpeechListening will be set to false in onend/onerror
    };

    const startWhisperMediaRecorder = async (): Promise<boolean> => {
        if (isRecording.value) { console.log("MediaRecorder: Already recording."); return true; }
        if (!activeStream || !activeStream.active) { if (!(await requestMicrophonePermissionsAndGetStream())) return false; }
        if (!activeStream) return false; // Should not happen

        audioChunks = []; const options = { mimeType: 'audio/webm;codecs=opus' };
        try {
            mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType) ? new MediaRecorder(activeStream, options) : new MediaRecorder(activeStream);
        } catch (e) {
            console.error('Failed to create MediaRecorder:', e);
            toast?.add({ type: 'error', title: 'Recording Error', message: 'Failed to initialize audio recorder.' });
            return false;
        }
        mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunks.push(event.data);};
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
            audioChunks = []; // Clear for next recording

            if (audioBlob.size > 1000) { // Check if there's enough audio data
                await transcribeWithWhisper(audioBlob);
            } else {
                console.warn('Whisper: Audio too small or empty, not sending.');
                if (isPttMode.value) { // Only toast for PTT if audio is too small
                     toast?.add({ type: 'warning', title: 'No Audio', message: 'No significant audio was recorded.' });
                }
            }
            isRecording.value = false; // MediaRecorder specifically
            clearRecordingTimer();

            // If in hybrid continuous/VAD Whisper mode, and main toggle still on, restart WebSpeech for VAD
            if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' &&
                !isWebSpeechListening.value && isMicrophoneActive.value /* Check main button state */) {
                console.log('MediaRecorder stopped. Restarting WebSpeech VAD for Whisper hybrid mode.');
                startWebSpeechRecognition();
            } else if (!isMicrophoneActive.value) { // If main toggle is off, ensure WebSpeech VAD is also off
                stopWebSpeechRecognition(true);
            }
        };
        mediaRecorder.onerror = (event: Event) => {
            console.error('MediaRecorder error:', event);
            toast?.add({ type: 'error', title: 'Recording Error', message: 'MediaRecorder failed.' });
            isRecording.value = false; clearRecordingTimer();
        };
        // For continuous/VAD, MediaRecorder chunks audio. For PTT, it records until stopped.
        mediaRecorder.start( (isContinuousMode.value || isVoiceActivationMode.value) ? 10000 : undefined); // e.g., 10-second chunks for continuous/VAD
        isRecording.value = true; // MediaRecorder is active
        startRecordingTimer();
        startAudioLevelMonitoring(); // Ensure monitoring is active
        console.log('MediaRecorder started');
        return true;
    };
    const stopWhisperMediaRecorder = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop(); // This will trigger onstop
            console.log('MediaRecorder stopping...');
        } else {
            isRecording.value = false; // Ensure state is correct if already stopped or never started
        }
    };
    const transcribeWithWhisper = async (audioBlob: Blob) => {
      if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Busy', message: 'Assistant is busy, please wait.' });
        return;
      }
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);
        // Add language if available in settings
        if (settings.speechLanguage) {
            formData.append('language', settings.speechLanguage.substring(0,2)); // Expects 2-letter code like 'en', 'es'
        }

        const response = await speechAPI.transcribe(formData);
        if (response.data.transcription) {
          sendTranscription(response.data.transcription);
        } else {
          throw new Error(response.data.message || 'Empty transcription from Whisper.');
        }
      } catch (error: any) {
        console.error('Whisper transcription error:', error);
        toast?.add({
          type: 'error',
          title: 'Transcription Error',
          message: error.response?.data?.message || error.message || 'Failed to transcribe audio with Whisper.'
        });
      }
    };

    // --- Main Control Functions ---
    const startAudioCapture = async () => {
        if (props.isProcessing || isMicrophoneActive.value /* Overall active state */) return;
        if (permissionStatus.value !== 'granted') { if (!(await requestMicrophonePermissionsAndGetStream())) return; }

        if (sttPreference.value === 'browser_webspeech_api') {
            await startWebSpeechRecognition();
        } else { // 'whisper_api'
            if (isContinuousMode.value || isVoiceActivationMode.value) { // Hybrid: Start WebSpeech for VAD
                await startWebSpeechRecognition();
            } else { // PTT Whisper
                await startWhisperMediaRecorder();
            }
        }
    };
    const stopAudioCapture = (abortWebSpeech = false) => {
        console.log("Stopping audio capture...");
        if (sttPreference.value === 'browser_webspeech_api') {
            stopWebSpeechRecognition(abortWebSpeech);
        } else { // 'whisper_api'
            if (isRecording.value) stopWhisperMediaRecorder(); // MediaRecorder active (PTT, or hybrid chunk)
            if (isWebSpeechListening.value) stopWebSpeechRecognition(abortWebSpeech); // WebSpeech VAD for hybrid Whisper
        }
        clearRecordingTimer();
        clearPauseTimerWebSpeech();
        pauseDetectedWebSpeech.value = false;
        stopAudioLevelMonitoring(); // Stop monitoring when explicitly stopping capture

        // Send pending continuous WebSpeech transcription if any
        if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim()) {
            sendPendingWebSpeechTranscription();
        }
    };

    /** Main button action: toggles audio capture based on current mode and preference. */
    const toggleRecording = async () => {
      if (props.isProcessing) return;
      if (isMicrophoneActive.value) {
        stopAudioCapture(true); // Abort WebSpeech if stopping manually via main button
      } else {
        if (permissionStatus.value !== 'granted') {
          const stream = await requestMicrophonePermissionsAndGetStream();
          if (!stream) { toast?.add({ type: 'error', title: 'Microphone Access', message: permissionMessage.value || 'Could not access microphone.' }); return; }
        }
        await startAudioCapture();
      }
    };

    // --- Text Input & Transcription History ---
    const handleTextInput = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`; // Max height 120px
      }
    };
    const handleTextSubmit = () => {
      if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) {
        sendTranscription(textInput.value.trim());
        textInput.value = '';
        nextTick(() => handleTextInput()); // Reset height
      }
    };
    const sendTranscription = (text: string) => {
        if (text.trim()) {
            emit('transcription', text.trim());
            const newHistoryItem: TranscriptionHistoryItem = {
                id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                text: text.trim(),
                timestamp: Date.now(),
                sent: true // Assume sent, parent could update if sending fails via an event
            };
            const updatedHistory = [newHistoryItem, ...transcriptionHistory.value];
            transcriptionHistory.value = updatedHistory.slice(0, 10); // Keep last 10
        }
    };
    const resendTranscription = (item: TranscriptionHistoryItem) => {
        sendTranscription(item.text);
        // Mark as sent again and move to top (optional, sendTranscription already adds to top)
        const index = transcriptionHistory.value.findIndex(h => h.id === item.id);
        if (index > -1) {
            transcriptionHistory.value[index].sent = true;
            // Optionally re-order:
            // const [reSentItem] = transcriptionHistory.value.splice(index, 1);
            // transcriptionHistory.value.unshift(reSentItem);
        }
    };
    const sendPendingWebSpeechTranscription = () => {
        if (pendingTranscriptWebSpeech.value.trim()) {
            sendTranscription(pendingTranscriptWebSpeech.value.trim());
        }
        clearPendingWebSpeechTranscription(); // Clear after sending
    };
    const clearPendingWebSpeechTranscription = () => {
        pendingTranscriptWebSpeech.value = '';
        liveTranscriptWebSpeech.value = ''; // Also clear live part
        clearPauseTimerWebSpeech();
        pauseDetectedWebSpeech.value = false;
        pauseCountdownWebSpeech.value = 0;
    };
    const editPendingTranscription = () => {
        if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
            editingTranscription.value = pendingTranscriptWebSpeech.value;
            showEditModal.value = true;
            nextTick(() => editModalTextareaRef.value?.focus());
        }
    };
    const saveEdit = () => {
        if (editingTranscription.value.trim()) {
            pendingTranscriptWebSpeech.value = editingTranscription.value.trim();
            sendPendingWebSpeechTranscription(); // This will also clear things
        }
        showEditModal.value = false;
        editingTranscription.value = '';
    };
    const cancelEdit = () => {
        showEditModal.value = false;
        editingTranscription.value = '';
    };

    // --- Pause Detection for Continuous WebSpeech ---
    const resetPauseDetectionWebSpeech = () => {
      clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
      if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' &&
          pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value &&
          continuousModeAutoSend.value) { // Use reactive setting from service
        pauseTimerIdWebSpeech = window.setTimeout(() => {
          if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value &&
              continuousModeAutoSend.value && isContinuousMode.value) { // Double check conditions
            pauseDetectedWebSpeech.value = true;
            pauseCountdownWebSpeech.value = continuousModePauseTimeoutMs.value; // Use reactive setting
            const countdownInterval = setInterval(() => {
              if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isWebSpeechListening.value) {
                clearInterval(countdownInterval); pauseDetectedWebSpeech.value = false; return;
              }
              pauseCountdownWebSpeech.value -= 100;
              if (pauseCountdownWebSpeech.value <= 0) {
                clearInterval(countdownInterval);
                if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
                  sendPendingWebSpeechTranscription();
                }
                pauseDetectedWebSpeech.value = false; // Reset after sending or if condition changed
              }
            }, 100);
          }
        }, 500); // Time after speech finalizes before considering it a pause
      }
    };
    const startRecordingTimer = () => {
      clearRecordingTimer();
      recordingSeconds.value = 0;
      recordingTimerId = window.setInterval(() => {
        recordingSeconds.value += 0.1; // More granular update
        // Max recording time for PTT Whisper or WebSpeech PTT/VAD
        if (((isPttMode.value || isVoiceActivationMode.value)) &&
             isRecording.value && recordingSeconds.value >= 60) { // 60s limit
            toast?.add({ type: 'info', title: 'Recording Limit', message: 'Max recording time (60s) reached.' });
            stopAudioCapture(sttPreference.value === 'browser_webspeech_api');
        }
      }, 100);
    };
    const clearRecordingTimer = () => {
      if (recordingTimerId !== null) clearInterval(recordingTimerId);
      recordingTimerId = null; recordingSeconds.value = 0;
    };
    const clearPauseTimerWebSpeech = () => {
      if (pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech);
      pauseTimerIdWebSpeech = null;
    };
    const cleanUpAfterTranscription = () => {
      interimTranscriptWebSpeech.value = '';
      finalTranscriptWebSpeech.value = '';
      // Don't clear live/pending here, they are for continuous mode
      audioChunks = []; // Cleared in MediaRecorder.onstop, but good to ensure
      clearRecordingTimer();
    };
    const stopAllAudioProcessing = (abortWebSpeech = true) => {
      console.log("Stopping all audio processing...");
      if (recognition) {
        try { if (isWebSpeechListening.value) { if (abortWebSpeech) recognition.abort(); else recognition.stop(); } }
        catch (e) { console.warn('Error stopping/aborting WebSpeech:', e); }
      }
      isWebSpeechListening.value = false; // Force state

      if (mediaRecorder && mediaRecorder.state === 'recording') {
        try { mediaRecorder.stop(); } catch (e) { console.warn('Error stopping MediaRecorder:', e); }
      }
      isRecording.value = false; // Force state

      if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(e => console.warn("Error closing AudioContext:", e));
        audioContext = null;
      }
      microphoneSourceNode = null; analyser = null;

      stopAudioLevelMonitoring();
      cleanUpAfterTranscription();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
    };


    // Lifecycle Hooks
    onMounted(async () => {
      if (typeof window !== 'undefined') initializeWebSpeech(); // Init early
      if (navigator.permissions) {
        try {
          const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          permissionStatus.value = perm.state;
          if (perm.state === 'granted') {
            permissionMessage.value = ''; emit('permission-update', 'granted');
            if ((isContinuousMode.value || isVoiceActivationMode.value)) await startAudioCapture();
          } else if (perm.state === 'prompt') {
            permissionMessage.value = 'Click the microphone to grant access.'; emit('permission-update', 'prompt');
          } else { // denied
            permissionMessage.value = 'Microphone access denied in browser settings.'; emit('permission-update', 'denied');
          }
          perm.onchange = () => { // Listener for permission changes
              const oldStatus = permissionStatus.value;
              permissionStatus.value = perm.state;
              emit('permission-update', perm.state); // Emit new status

              if (perm.state === 'granted') {
                  permissionMessage.value = 'Microphone ready.';
                  if ((isContinuousMode.value || isVoiceActivationMode.value) && !isMicrophoneActive.value) {
                      startAudioCapture();
                  }
              } else if (perm.state === 'denied') {
                  permissionMessage.value = 'Microphone access denied.';
                  if (isMicrophoneActive.value) stopAllAudioProcessing();
              } else { // prompt
                  permissionMessage.value = 'Microphone access requires your action.';
                  if (isMicrophoneActive.value) stopAllAudioProcessing();
              }
          };
        } catch (e) {
          console.warn('Permissions API query error:', e);
          permissionStatus.value = 'error'; permissionMessage.value = 'Cannot query mic permission.';
          emit('permission-update', 'error');
        } finally { micAccessInitiallyChecked.value = true; }
      } else { // No Permissions API
        micAccessInitiallyChecked.value = true;
        permissionMessage.value = 'Permissions API not supported. Click mic to request.';
        // We can't know the status, assume prompt-like behavior until user clicks
      }
    });

    onBeforeUnmount(() => {
      stopAllAudioProcessing();
      // Detach permission listener if it was set
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' as PermissionName })
          .then(perm => { perm.onchange = null; })
          .catch(e => console.warn("Error removing permission listener:", e));
      }
      if (recognition) {
        recognition.onstart = null; recognition.onresult = null; recognition.onerror = null;
        recognition.onend = null; recognition.onspeechstart = null; recognition.onspeechend = null;
        recognition = null;
      }
      if (mediaRecorder) {
        mediaRecorder.ondataavailable = null; mediaRecorder.onstop = null; mediaRecorder.onerror = null;
        mediaRecorder = null;
      }
    });

    // Watchers for global settings changes (from VoiceSettingsManager)
    watch(audioInputMode, (newMode, oldMode) => {
        if (newMode === oldMode) return;
        console.log(`VoiceInput: audioInputMode changed externally from ${oldMode} to ${newMode}.`);
        stopAllAudioProcessing(true); // Abort current operations
        // Clear transcripts related to potentially old mode's behavior
        liveTranscriptWebSpeech.value = ''; pendingTranscriptWebSpeech.value = '';
        finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';

        if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
            nextTick(() => { // Ensure DOM and other state updates from stopAllAudioProcessing have settled
                // Double check conditions before auto-starting
                if (audioInputMode.value === newMode && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
                    startAudioCapture();
                }
            });
        }
    });

    watch(sttPreference, (newPref, oldPref) => {
        if (newPref === oldPref) return;
        console.log(`VoiceInput: sttPreference changed externally from ${oldPref} to ${newPref}.`);
        stopAllAudioProcessing(true);
        if (newPref === 'browser_webspeech_api' && typeof window !== 'undefined' && !recognition) {
            initializeWebSpeech(); // Ensure WebSpeech is ready if selected
        }
        // If current mode is continuous or VAD and permission granted, auto-start with new method
        if ((audioInputMode.value === 'continuous' || audioInputMode.value === 'voice-activation') && permissionStatus.value === 'granted') {
            nextTick(() => {
                if (sttPreference.value === newPref && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
                    startAudioCapture();
                }
            });
        }
    });

    watch(selectedAudioDeviceId, (newVal, oldVal) => {
        if(newVal !== oldVal && isMicrophoneActive.value) { // If device changes while active
            console.log("VoiceInput: Audio device changed. Restarting capture.");
            stopAllAudioProcessing(true);
            nextTick(() => { // Give time for resources to release
                if (permissionStatus.value === 'granted') { // Check permission again, though it shouldn't change
                    startAudioCapture(); // Restart with the new device
                }
            });
        } else if (newVal !== oldVal && !isMicrophoneActive.value && permissionStatus.value === 'granted' && (isContinuousMode.value || isVoiceActivationMode.value)){
            // If device changes while NOT active, but it's a mode that *would* auto-start
             console.log("VoiceInput: Audio device changed while inactive in auto-start mode. Re-evaluating start.");
             // No need to stop, just ensure the next start uses the new device.
             // If it's continuous/VAD, it might attempt to start if conditions are met.
             // This is implicitly handled by startAudioCapture using the latest selectedAudioDeviceId.
        }
    });

    // Watch for changes in speechLanguage from settings
    watch(() => settings.speechLanguage, (newLang, oldLang) => {
        if (newLang === oldLang) return;
        console.log(`VoiceInput: Speech language changed from ${oldLang} to ${newLang}.`);
        if (recognition) {
            recognition.lang = newLang || 'en-US'; // Update active recognition instance
            if (isWebSpeechListening.value) { // If currently listening, restart to apply new language
                console.log("Restarting WebSpeech to apply new language.");
                stopWebSpeechRecognition(true); // Abort current
                nextTick(() => {
                    if (isMicrophoneActive.value && permissionStatus.value === 'granted' &&
                       ( (isContinuousMode.value || isVoiceActivationMode.value) || isPttMode.value /* only if PTT was active */ ) ) {
                       startWebSpeechRecognition();
                    }
                });
            }
        }
    });


    return {
      props, textInput, textareaRef, vadCanvasRef, editModalTextareaRef,
      isRecording, isWebSpeechListening, permissionStatus, permissionMessage, micAccessInitiallyChecked,
      interimTranscriptWebSpeech, liveTranscriptWebSpeech, pendingTranscriptWebSpeech,
      transcriptionHistory, showTranscriptionHistory,
      recordingSeconds, pauseDetectedWebSpeech, pauseCountdownWebSpeech,
      audioLevelDisplay, rawAudioLevel,
      showEditModal, editingTranscription,
      settings, // Expose settings for template if needed (e.g. for pauseCountdownWebSpeech timeout comparison)
      // Computed properties from global settings
      sttPreference, audioInputMode,
      // Local computed
      isMicrophoneActive, isPttMode, isContinuousMode, isVoiceActivationMode,
      // Methods
      getButtonTitle, getPlaceholderText, getModeDisplayText, getModeIndicatorClass,
      getRecordingStatusText, getIdleStatusText, getPermissionStatusClass,
      getTranscriptionMethodDisplay, formatTime, formatDuration,
      toggleRecording, // Main button action
      handleTextInput, handleTextSubmit,
      sendPendingWebSpeechTranscription, clearPendingWebSpeechTranscription, editPendingTranscription,
      saveEdit, cancelEdit, resendTranscription,
      requestMicrophonePermissionsAndGetStream,
      // Icons (ensure they are correctly imported/defined)
      HistoryIcon, CloseIcon, SendIcon, BrowserSpeechIcon, WhisperSpeechIcon,
      ContinuousModeIcon, VADModeIcon, PTTModeIcon, EditIcon, ClearIcon, StopRecordingIcon, MicrophoneIcon
    };
  }
});
</script>

<style scoped>
/* Styles from your provided VoiceInput.vue's CSS block */
/* Key point: Remove specific .mode-controls for cycling audio mode and STT if they are now global */
.voice-input-wrapper { /* Ensure this matches the root class in the template */
  @apply w-full max-w-4xl mx-auto;
}

/* Glassmorphism Effect */
.glass-morphism {
  @apply backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
.input-container {
  @apply rounded-2xl p-4 sm:p-6 transition-all duration-300;
}
.input-header {
  @apply flex items-center justify-between mb-4;
}
.mode-indicator {
  @apply flex items-center gap-2;
}
.mode-dot {
  @apply w-3 h-3 rounded-full transition-all duration-300;
}
.mode-dot-idle {
  @apply bg-gray-400 dark:bg-gray-600;
}
.mode-dot-standby {
  @apply bg-yellow-500 dark:bg-yellow-400;
  animation: pulse-gentle 2s ease-in-out infinite;
}
.mode-dot-active {
  @apply bg-green-500 dark:bg-green-400;
  animation: pulse-active 1s ease-in-out infinite;
}
.mode-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}
.history-toggle {
  @apply p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200;
}
.input-controls {
  @apply flex items-end gap-3 sm:gap-4;
}
.text-input-wrapper {
  @apply flex-1 relative;
}
.text-input {
  @apply w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base
        bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        rounded-xl text-gray-900 dark:text-white
        placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
        transition-all duration-200 resize-none;
  min-height: 52px; /* Corresponds to py-3 sm:py-4 + line height */
  max-height: 120px; /* Example max height for ~5 lines */
}
.text-input:focus {
  @apply shadow-lg;
  background: rgba(255, 255, 255, 0.9) !important; /* More opaque on focus */
}
.dark .text-input:focus {
  background: rgba(30, 41, 59, 0.9) !important; /* Dark mode focus */
}
.char-counter {
  @apply absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500;
}
.voice-controls {
  @apply flex items-center gap-2;
}
.voice-button {
  @apply relative w-14 h-14 sm:w-16 sm:h-16 rounded-full
        transition-all duration-300 ease-out transform
        focus:outline-none focus:ring-4 focus:ring-blue-500/30;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); /* Blue gradient */
  box-shadow:
    0 4px 15px rgba(59, 130, 246, 0.4), /* Softer shadow */
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.voice-button:hover:not(.disabled):not(.processing) {
  @apply scale-110; /* Slightly larger on hover */
  box-shadow:
    0 6px 20px rgba(59, 130, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.voice-button:active:not(.disabled):not(.processing) {
  @apply scale-95; /* Click effect */
}

.voice-button.recording {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); /* Red gradient for recording */
  box-shadow:
    0 4px 20px rgba(239, 68, 68, 0.6), /* Red shadow */
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: recording-pulse 1.5s ease-in-out infinite;
}
.voice-button.processing {
  @apply opacity-70 cursor-wait;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); /* Gray for processing */
}
.voice-button.disabled {
  @apply opacity-50 cursor-not-allowed;
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%); /* Muted gray for disabled */
  box-shadow: none;
}
.button-content {
  @apply w-full h-full flex items-center justify-center text-white;
}
.idle-state, .recording-state, .processing-state {
  @apply relative w-full h-full flex items-center justify-center;
}
.icon-microphone, .icon-recording {
  @apply w-6 h-6 sm:w-7 sm:h-7 z-10; /* Ensure icon is above pulse rings */
}
.processing-spinner {
  @apply relative w-8 h-8; /* Adjust size as needed */
}
.spinner-blade {
  @apply absolute w-full h-full;
  animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.spinner-blade::after {
  content: '';
  @apply absolute w-2 h-2 bg-white rounded-full; /* Spinner part */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.spinner-blade:nth-child(1) { animation-delay: -0.3s; }
.spinner-blade:nth-child(2) { animation-delay: -0.2s; }
.spinner-blade:nth-child(3) { animation-delay: -0.1s; }
.spinner-blade:nth-child(4) { animation-delay: 0s; }

.pulse-rings {
  @apply absolute inset-0;
}
.pulse-ring {
  @apply absolute inset-0 rounded-full border-2 border-white/30; /* Semi-transparent white */
  animation: pulse-expand 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.pulse-ring-2 { animation-delay: 0.5s; }
.pulse-ring-3 { animation-delay: 1s; }

/* Remove or hide .mode-controls if these are now global */
.mode-controls {
  /* @apply flex flex-col gap-2; */ /* Original style if shown */
  @apply hidden; /* Hide if controls are moved to header or another component */
}
/* .mode-button { ... } */ /* Styles for these buttons would go here if they were visible */
/* .mode-icon { ... } */

.status-bar {
  @apply mt-4 flex items-center justify-between;
}
.status-section {
  @apply flex-1; /* Takes available space */
}
.status-item {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm;
}
.status-idle { @apply bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400; }
.status-recording { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300; }
.status-processing { @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300; }
.status-success { @apply bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300; }
.status-error { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300; }
.status-warning { @apply bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300; }

.status-icon { @apply flex-shrink-0; }
.status-text { @apply flex-1 font-medium; }
.recording-indicator { @apply flex items-center gap-1.5; }
.recording-dot {
  @apply w-2 h-2 bg-red-500 rounded-full;
  animation: recording-blink 1s ease-in-out infinite;
}
.recording-timer { @apply font-mono text-xs text-gray-500 dark:text-gray-400; }
.retry-button { @apply ml-2 text-xs underline hover:no-underline cursor-pointer; }


.audio-level-indicator {
  @apply ml-4; /* Spacing from status text */
}
.audio-bars {
  @apply flex items-end gap-1 h-6; /* Adjust height as needed */
}
.audio-bar {
  @apply w-1 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-100;
  min-height: 2px; /* Ensure visibility even at low levels */
}
.audio-bar.active {
  @apply bg-blue-500 dark:bg-blue-400; /* Color for active part of bar */
}
.continuous-preview {
  @apply mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20
        border border-blue-200 dark:border-blue-700/50
        rounded-xl backdrop-blur-sm;
}
.preview-header { @apply flex items-center justify-between mb-2; }
.preview-label { @apply text-sm font-medium text-blue-700 dark:text-blue-300; }
.preview-actions { @apply flex items-center gap-1; }
.preview-btn {
    @apply p-1.5 rounded-lg text-gray-500 hover:text-gray-700
        dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-white/50 dark:hover:bg-gray-800/50
        transition-all duration-200;
}
.preview-btn-send { @apply text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300; }
.preview-content { @apply text-sm text-gray-800 dark:text-gray-200 min-h-[2rem]; }
.preview-text { @apply whitespace-pre-wrap; }
.preview-text.pending { @apply font-medium; }
.preview-text.live { @apply text-gray-500 dark:text-gray-400 italic; }

.pause-indicator { @apply mt-3 relative; }
.pause-progress {
    @apply absolute top-0 left-0 h-1 bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-100;
}
.pause-text { @apply text-xs text-blue-600 dark:text-blue-400 mt-2 block; }

.vad-visualization {
  @apply relative mt-3 p-2 bg-gray-900/80 dark:bg-black/50 rounded-lg overflow-hidden;
  min-height: 60px; /* Ensure it has some height */
}
.vad-visualization canvas {
  @apply w-full h-full block; /* Ensure canvas takes full space */
}
.vad-threshold-line {
  @apply absolute left-0 right-0 h-px bg-red-500/70 pointer-events-none;
  z-index: 1; /* Ensure it's above the canvas drawing if canvas is opaque */
}
.transcription-history-overlay {
  @apply fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96
        max-w-full max-h-96 bg-white dark:bg-gray-900
        rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
        overflow-hidden z-50; /* High z-index */
}
.history-header { @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700; }
.history-title { @apply text-lg font-semibold text-gray-900 dark:text-white; }
.history-close {
    @apply p-1 rounded-lg text-gray-500 hover:text-gray-700
        dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}
.history-content { @apply p-4 space-y-3 max-h-80 overflow-y-auto; } /* Ensure scrollability */
.history-item { @apply p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-200; }
.history-item-sent { @apply opacity-60; } /* Example: Dim sent items */
.history-time { @apply text-xs text-gray-500 dark:text-gray-400 block mb-1; }
.history-text { @apply text-sm text-gray-800 dark:text-gray-200; }
.history-resend {
    @apply mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded-md
        hover:bg-blue-600 transition-colors;
}

.modal-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center
        bg-black/60 backdrop-blur-sm p-4; /* Higher z-index than history */
}
.modal-content { @apply w-full max-w-lg rounded-2xl p-6 shadow-2xl; } /* Uses glass-morphism from template */
.modal-header { @apply flex items-center justify-between mb-4; }
.modal-title { @apply text-xl font-semibold text-gray-900 dark:text-white; }
.modal-close {
    @apply p-1 rounded-lg text-gray-500 hover:text-gray-700
        dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}
.modal-textarea {
    @apply w-full p-4 text-base border border-gray-300 dark:border-gray-600
        rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        resize-y min-h-[120px] max-h-[300px]
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
.modal-footer { @apply flex items-center justify-end gap-3 mt-4; }

.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
        hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
        transition-colors flex items-center;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium
        hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200
        dark:hover:bg-gray-600 focus:outline-none focus:ring-2
        focus:ring-gray-400/50 transition-colors;
}


/* Ensure Tailwind animations from config are usable */
@keyframes spinner-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pulse-expand {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  80%, 100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes recording-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow:
      0 4px 20px rgba(239, 68, 68, 0.6), /* Red shadow from .voice-button.recording */
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.05); /* Slightly larger */
    box-shadow:
      0 6px 30px rgba(239, 68, 68, 0.8), /* More intense shadow */
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}
@keyframes recording-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes pulse-gentle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes pulse-active {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
}


/* Transitions from old file - ensuring they are present */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px); /* Adjust if needed */
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s ease;
}
.modal-fade-enter-from .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

.status-fade-enter-active, .status-fade-leave-active {
  transition: all 0.2s ease;
}
.status-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.status-fade-leave-to {
  opacity: 0;
  transform: translateX(10px); /* Or -10px for opposite direction */
}


/* Mobile Optimizations */
@media (max-width: 640px) {
  .input-container { @apply p-3; }
  .voice-button { @apply w-12 h-12; }
  .icon-microphone, .icon-recording { @apply w-5 h-5; }
  .transcription-history-overlay {
    @apply bottom-0 left-0 right-0 rounded-t-2xl rounded-b-none; /* Full width at bottom */
  }
}

/* Dark Mode Enhancements for glass-morphism */
.dark .glass-morphism {
  background: linear-gradient(135deg,
    rgba(30, 41, 59, 0.8) 0%, /* Darker base for dark mode */
    rgba(30, 41, 59, 0.6) 100%);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.3), /* Darker shadow */
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05); /* Subtle inner highlight */
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .voice-button, .mode-button, .preview-btn, .history-item,
  .pulse-ring, .recording-dot, .spinner-blade,
  .mode-dot-standby, .mode-dot-active,
  .slide-fade-enter-active, .slide-fade-leave-active,
  .slide-up-enter-active, .slide-up-leave-active,
  .modal-fade-enter-active, .modal-fade-leave-active,
  .status-fade-enter-active, .status-fade-leave-active {
    transition: none;
    animation: none;
  }
}

@media (prefers-contrast: high) {
  .voice-button, .text-input, .mode-button {
    @apply border-2 border-current; /* Use current text color for high contrast borders */
  }
}

</style>