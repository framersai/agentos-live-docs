<template>
  <div class="voice-input-wrapper">
    <!-- Transcription History Overlay -->
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

    <!-- Main Input Container -->
    <div class="input-container glass-morphism">
      <div class="input-header">
        <div class="mode-indicator">
          <div class="mode-dot" :class="getModeIndicatorClass()"></div>
          <span class="mode-text">{{ getModeDisplayText() }}</span>
        </div>
        <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="history-toggle" title="Show history">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
              'recording': isMicrophoneActive, 
              'processing': props.isProcessing, 
              'disabled': !micAccessInitiallyChecked || permissionStatus === 'denied'
            }]"
            :title="getButtonTitle()"
            :disabled="props.isProcessing || !micAccessInitiallyChecked || permissionStatus === 'denied'"
          >
            <div class="button-content">
              <!-- Processing State -->
              <div v-if="props.isProcessing" class="processing-state">
                <div class="processing-spinner">
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                  <div class="spinner-blade"></div>
                </div>
              </div>
              
              <!-- Recording State -->
              <div v-else-if="isMicrophoneActive" class="recording-state">
                <svg class="icon-recording" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                <div class="pulse-rings">
                  <div class="pulse-ring"></div>
                  <div class="pulse-ring pulse-ring-2"></div>
                  <div class="pulse-ring pulse-ring-3"></div>
                </div>
              </div>
              
              <!-- Idle State -->
              <div v-else class="idle-state">
                <svg class="icon-microphone" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
          </button>

          <div class="mode-controls">
            <button @click="cycleAudioMode" class="mode-button" :title="`Audio Mode: ${getAudioModeDisplay(currentAudioMode)}`">
              <component :is="getAudioModeIcon()" class="mode-icon" />
            </button>
            <button @click="toggleSpeechMethod" class="mode-button" :title="`STT: ${getTranscriptionMethodDisplay()}`">
              <svg v-if="speechPreference === 'webspeech'" class="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else class="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-section">
          <transition name="status-fade" mode="out-in">
            <div v-if="permissionStatus !== 'granted' && permissionStatus !== ''" 
                 :key="permissionStatus"
                 :class="['status-item', getPermissionStatusClass()]">
              <div class="status-icon">
                <svg v-if="permissionStatus === 'denied'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <span class="status-text">{{ permissionMessage }}</span>
              <button v-if="permissionStatus === 'denied'" @click="requestMicrophonePermissionsAndGetStream" class="retry-button">
                Retry
              </button>
            </div>

            <div v-else-if="isMicrophoneActive" :key="'recording'" class="status-item status-recording">
              <div class="recording-indicator">
                <div class="recording-dot"></div>
              </div>
              <span class="status-text">{{ getRecordingStatusText() }}</span>
              <span class="recording-timer">{{ formatDuration(recordingSeconds) }}</span>
            </div>

            <div v-else :key="'idle'" class="status-item status-idle">
              <span class="status-text">{{ getIdleStatusText() }}</span>
            </div>
          </transition>
        </div>

        <div v-if="audioLevelDisplay > 0" class="audio-level-indicator">
          <div class="audio-bars">
            <div v-for="i in 5" :key="i" 
                 class="audio-bar" 
                 :class="{ 'active': audioLevelDisplay >= i * 20 }"
                 :style="{ height: `${Math.min(100, audioLevelDisplay)}%` }">
            </div>
          </div>
        </div>
      </div>

      <!-- Continuous Mode Transcription Preview -->
      <transition name="slide-fade">
        <div v-if="isContinuousMode && speechPreference === 'webspeech' && (liveTranscriptWebSpeech || pendingTranscriptWebSpeech)" 
             class="continuous-preview">
          <div class="preview-header">
            <span class="preview-label">Live Transcription</span>
            <div class="preview-actions">
              <button @click="editPendingTranscription" class="preview-btn" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="clearPendingWebSpeechTranscription" class="preview-btn" title="Clear">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button @click="sendPendingWebSpeechTranscription" class="preview-btn preview-btn-send" title="Send">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <div class="preview-content">
            <span class="preview-text pending">{{ pendingTranscriptWebSpeech }}</span>
            <span class="preview-text live">{{ liveTranscriptWebSpeech }}</span>
          </div>
          <div v-if="pauseDetectedWebSpeech && autoSendOnPauseWebSpeech" class="pause-indicator">
            <div class="pause-progress" :style="{ width: `${(pauseCountdownWebSpeech / pauseTimeoutContinuousWebSpeech) * 100}%` }"></div>
            <span class="pause-text">Auto-sending in {{ Math.ceil(pauseCountdownWebSpeech / 1000) }}s...</span>
          </div>
        </div>
      </transition>

      <!-- Voice Activation Visualization -->
      <transition name="fade">
        <div v-if="isVoiceActivationMode && isWebSpeechListening" class="vad-visualization">
          <canvas ref="vadCanvasRef" width="200" height="50"></canvas>
          <div class="vad-threshold-line" :style="{ bottom: `${voiceActivationThreshold * 100}%` }"></div>
        </div>
      </transition>
    </div>

    <!-- Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
        <div class="modal-content glass-morphism">
          <div class="modal-header">
            <h3 class="modal-title">Edit Transcription</h3>
            <button @click="cancelEdit" class="modal-close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea 
            v-model="editingTranscription" 
            class="modal-textarea"
            placeholder="Edit your transcription here..."
            @keydown.ctrl.enter="saveEdit"
            @keydown.meta.enter="saveEdit"
          ></textarea>
          <div class="modal-footer">
            <button @click="cancelEdit" class="btn-secondary">Cancel</button>
            <button @click="saveEdit" class="btn-primary">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, defineComponent, nextTick } from 'vue';
import { useStorage } from '@vueuse/core';
import { speechAPI } from '../utils/api';

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
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
  props: {
    isProcessing: {
      type: Boolean,
      required: true,
    },
    audioMode: {
      type: String,
      required: true,
    }
  },
  emits: {
    transcription: (value: string) => typeof value === 'string',
    'update:audio-mode': (value: string) => typeof value === 'string',
    'permission-update': (status: 'granted' | 'denied' | 'prompt') =>
      ['granted', 'denied', 'prompt'].includes(status),
  },
  setup(props, { emit }) {
    const toast = inject('toast') as any;

    // Core State
    const textInput = ref('');
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const isRecording = ref(false);
    const isWebSpeechListening = ref(false);
    const permissionStatus = ref<'prompt' | 'granted' | 'denied' | 'error' | ''>('');
    const permissionMessage = ref('');
    const micAccessInitiallyChecked = ref(false);

    // Transcription State
    const interimTranscriptWebSpeech = ref('');
    const finalTranscriptWebSpeech = ref('');
    const liveTranscriptWebSpeech = ref('');
    const pendingTranscriptWebSpeech = ref('');
    const transcriptionHistory = ref<TranscriptionHistoryItem[]>([]);
    const showTranscriptionHistory = ref(false);

    // Recording State
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let activeWhisperStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;

    // Timers
    const recordingSeconds = ref(0);
    let recordingTimerId: number | null = null;
    const pauseDetectedWebSpeech = ref(false);
    const pauseCountdownWebSpeech = ref(0);
    let pauseTimerIdWebSpeech: number | null = null;

    // Audio Level Monitoring
    const audioLevelDisplay = ref(0);
    let audioMonitoringInterval: number | null = null;

    // Edit Modal
    const showEditModal = ref(false);
    const editingTranscription = ref('');

    // Canvas for VAD
    const vadCanvasRef = ref<HTMLCanvasElement | null>(null);

    // Settings
    const speechPreference = useStorage<'webspeech' | 'whisper'>('speechPreference', 'webspeech');
    const selectedAudioDevice = useStorage<string>('selectedAudioDevice', '');
    const currentAudioMode = useStorage<string>('vca-audioMode', props.audioMode);
    const voiceActivationThreshold = useStorage<number>('voiceActivationThreshold', 0.05);
    const silenceTimeoutVAD = useStorage<number>('silenceTimeoutMsVAD', 2000);
    const autoSendOnPauseWebSpeech = useStorage<boolean>('autoSendOnPauseWebSpeech', true);
    const pauseTimeoutContinuousWebSpeech = useStorage<number>('pauseTimeoutMsContinuousWebSpeech', 3000);

    // Speech Recognition Instance
    let recognition: SpeechRecognition | null = null;

    // Computed Properties
    const isMicrophoneActive = computed(() => isRecording.value || isWebSpeechListening.value);
    const isPttMode = computed(() => currentAudioMode.value === 'push-to-talk');
    const isContinuousMode = computed(() => currentAudioMode.value === 'continuous');
    const isVoiceActivationMode = computed(() => currentAudioMode.value === 'voice-activation');

    // Icon Components
    const PushToTalkIcon = {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`
    };
    
    const ContinuousIcon = {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    };
    
    const VoiceActivationIcon = {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>`
    };

    // Helper Methods
    const getButtonTitle = (): string => {
      if (props.isProcessing) return 'Assistant is processing...';
      if (!micAccessInitiallyChecked.value) return 'Initializing microphone...';
      if (permissionStatus.value === 'denied') return 'Microphone access denied';
      if (permissionStatus.value === 'error') return `Microphone error: ${permissionMessage.value}`;

      if (isMicrophoneActive.value) {
        if (isContinuousMode.value) return 'Stop continuous listening';
        if (isVoiceActivationMode.value) return 'Stop voice activation';
        return 'Release to stop recording';
      }

      if (isContinuousMode.value) return 'Start continuous listening';
      if (isVoiceActivationMode.value) return 'Start voice activation';
      return 'Hold to record';
    };

    const getPlaceholderText = (): string => {
      if (isContinuousMode.value) return 'Or type your message... (Continuous mode active)';
      if (isVoiceActivationMode.value) return 'Or type your message... (Voice activation active)';
      return 'Or type your message here...';
    };

    const getModeDisplayText = (): string => {
      if (isContinuousMode.value) return 'Continuous Mode';
      if (isVoiceActivationMode.value) return 'Voice Activation';
      return 'Push to Talk';
    };

    const getModeIndicatorClass = (): string => {
      if (isMicrophoneActive.value) return 'mode-dot-active';
      if (isContinuousMode.value || isVoiceActivationMode.value) return 'mode-dot-standby';
      return 'mode-dot-idle';
    };

    const getRecordingStatusText = (): string => {
      if (props.isProcessing) return 'Processing...';
      if (isPttMode.value) return 'Recording...';
      if (isContinuousMode.value) {
        if (speechPreference.value === 'webspeech') {
          if (pauseDetectedWebSpeech.value) return 'Pause detected';
          return 'Listening continuously...';
        } else {
          return 'Recording for Whisper...';
        }
      }
      if (isVoiceActivationMode.value) return 'Voice detected, recording...';
      return 'Ready';
    };

    const getIdleStatusText = (): string => {
      if (isContinuousMode.value) return 'Continuous mode ready';
      if (isVoiceActivationMode.value) return 'Listening for voice...';
      return 'Ready to record';
    };

    const getPermissionStatusClass = (): string => {
      if (permissionStatus.value === 'granted') return 'status-success';
      if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return 'status-error';
      if (permissionStatus.value === 'prompt') return 'status-warning';
      return '';
    };

    const getTranscriptionMethodDisplay = (): string => {
      return speechPreference.value === 'whisper' ? 'Whisper API' : 'Browser Speech';
    };

    const getAudioModeDisplay = (mode: string): string => {
      const modes: Record<string, string> = {
        'push-to-talk': 'Push to Talk',
        'continuous': 'Continuous',
        'voice-activation': 'Voice Activation',
      };
      return modes[mode] || 'Unknown';
    };

    const getAudioModeIcon = () => {
      if (isContinuousMode.value) return ContinuousIcon;
      if (isVoiceActivationMode.value) return VoiceActivationIcon;
      return PushToTalkIcon;
    };

    const formatTime = (timestamp: number): string => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDuration = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Audio Level Monitoring
    const startAudioLevelMonitoring = () => {
      if (!analyser) return;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      audioMonitoringInterval = window.setInterval(() => {
        if (!analyser) return;
        
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        audioLevelDisplay.value = Math.min(100, (average / 128) * 100);
        
        // Draw VAD visualization if in voice activation mode
        if (isVoiceActivationMode.value && vadCanvasRef.value) {
          drawVADVisualization(dataArray);
        }
      }, 50);
    };

    const stopAudioLevelMonitoring = () => {
      if (audioMonitoringInterval) {
        clearInterval(audioMonitoringInterval);
        audioMonitoringInterval = null;
      }
      audioLevelDisplay.value = 0;
    };

    const drawVADVisualization = (dataArray: Uint8Array) => {
      const canvas = vadCanvasRef.value;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.fillRect(0, 0, width, height);
      
      const barWidth = width / dataArray.length * 2.5;
      let x = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        
        const hue = (i / dataArray.length) * 120 + 200;
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
        
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    // Microphone Permission Management
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
        
        // Set up audio context for level monitoring
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        permissionStatus.value = 'granted';
        permissionMessage.value = 'Microphone ready';
        emit('permission-update', 'granted');
        
        setTimeout(() => {
          if (permissionStatus.value === 'granted') permissionMessage.value = '';
        }, 3000);
        
        micAccessInitiallyChecked.value = true;
        return stream;
      } catch (err: any) {
        console.error('Microphone permission error:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          permissionStatus.value = 'denied';
          permissionMessage.value = 'Microphone access denied';
        } else if (err.name === 'NotFoundError') {
          permissionStatus.value = 'error';
          permissionMessage.value = 'No microphone found';
        } else {
          permissionStatus.value = 'error';
          permissionMessage.value = `Error: ${err.message}`;
        }
        
        emit('permission-update', permissionStatus.value as 'denied' | 'prompt');
        micAccessInitiallyChecked.value = true;
        return null;
      }
    };

    // WebSpeech API Logic
    const initializeWebSpeech = (): boolean => {
      if (recognition) return true;
      
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        if (speechPreference.value === 'webspeech') {
          permissionMessage.value = 'Web Speech API not supported';
          toast?.add({
            type: 'error',
            title: 'Browser Not Supported',
            message: 'Web Speech API is not available in this browser.'
          });
        }
        return false;
      }
      
      recognition = new SpeechRecognitionAPI();
      recognition.continuous = isContinuousMode.value || isVoiceActivationMode.value;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isWebSpeechListening.value = true;
        console.log('WebSpeech: Started listening');
        startAudioLevelMonitoring();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalPart = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalPart += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (isContinuousMode.value && speechPreference.value === 'webspeech') {
          liveTranscriptWebSpeech.value = interim;
          if (finalPart.trim()) {
            pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart).trim();
            liveTranscriptWebSpeech.value = '';
            resetPauseDetectionWebSpeech();
          }
        } else if (isContinuousMode.value && speechPreference.value === 'whisper') {
          // Hybrid mode: use WebSpeech for VAD
          liveTranscriptWebSpeech.value = interim;
        } else {
          // PTT or VAD mode
          interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
          if (finalPart.trim()) {
            finalTranscriptWebSpeech.value += finalPart;
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('WebSpeech Error:', event.error);
        stopAllAudioProcessing();
        
        if (event.error === 'not-allowed') {
          permissionStatus.value = 'denied';
          permissionMessage.value = 'Microphone access denied';
          emit('permission-update', 'denied');
        } else {
          permissionStatus.value = 'error';
          permissionMessage.value = `Speech error: ${event.error}`;
        }
        
        toast?.add({
          type: 'error',
          title: 'Speech Recognition Error',
          message: permissionMessage.value
        });
      };

      recognition.onend = () => {
        console.log('WebSpeech: Ended');
        isWebSpeechListening.value = false;
        stopAudioLevelMonitoring();

        // Handle different modes
        if (isContinuousMode.value || isVoiceActivationMode.value) {
          if (!props.isProcessing && permissionStatus.value === 'granted') {
            // Restart continuous listening
            setTimeout(() => {
              if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value) {
                startWebSpeechRecognition();
              }
            }, 100);
          }
        } else if (isPttMode.value && finalTranscriptWebSpeech.value.trim()) {
          // Send PTT transcription
          sendTranscription(finalTranscriptWebSpeech.value.trim());
          cleanUpAfterTranscription();
        }
      };

      recognition.onspeechstart = () => {
        console.log('WebSpeech: Speech detected');
        if (isVoiceActivationMode.value && !isRecording.value) {
          isRecording.value = true;
          startRecordingTimer();
        }
        if (isContinuousMode.value && speechPreference.value === 'whisper' && !isRecording.value) {
          startWhisperMediaRecorder();
        }
      };

      recognition.onspeechend = () => {
        console.log('WebSpeech: Speech ended');
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
        if (e.name === 'InvalidStateError' && isWebSpeechListening.value) {
          return true; // Already started
        }
        console.error('Error starting WebSpeech:', e);
        permissionMessage.value = `Could not start speech recognition: ${e.message}`;
        permissionStatus.value = 'error';
        isWebSpeechListening.value = false;
        return false;
      }
    };

    const stopWebSpeechRecognition = () => {
      if (recognition && isWebSpeechListening.value) {
        recognition.stop();
      }
    };

    // Whisper MediaRecorder Logic
    const startWhisperMediaRecorder = async (): Promise<boolean> => {
      const stream = await requestMicrophonePermissionsAndGetStream();
      if (!stream) return false;

      activeWhisperStream = stream;
      audioChunks = [];
      
      const options = { mimeType: 'audio/webm;codecs=opus' };
      
      try {
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} not supported, using default`);
          mediaRecorder = new MediaRecorder(activeWhisperStream);
        } else {
          mediaRecorder = new MediaRecorder(activeWhisperStream, options);
        }
      } catch (e) {
        console.error('Failed to create MediaRecorder:', e);
        toast?.add({
          type: 'error',
          title: 'Recording Error',
          message: 'Failed to initialize audio recorder'
        });
        activeWhisperStream.getTracks().forEach(track => track.stop());
        activeWhisperStream = null;
        return false;
      }

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (activeWhisperStream) {
          activeWhisperStream.getTracks().forEach(track => track.stop());
        }
        activeWhisperStream = null;

        const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
        audioChunks = [];
        
        if (audioBlob.size > 1000) {
          await transcribeWithWhisper(audioBlob);
        } else {
          console.warn('Whisper: Audio too small or empty');
          if (!isContinuousMode.value) {
            toast?.add({
              type: 'warning',
              title: 'No Audio',
              message: 'No audio was recorded'
            });
          }
        }
        
        isRecording.value = false;
        clearRecordingTimer();

        // Restart WebSpeech VAD for hybrid continuous mode
        if (isContinuousMode.value && speechPreference.value === 'whisper' && !isWebSpeechListening.value) {
          console.log('Restarting WebSpeech VAD');
          startWebSpeechRecognition();
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast?.add({
          type: 'error',
          title: 'Recording Error',
          message: 'Failed to record audio'
        });
        if (activeWhisperStream) {
          activeWhisperStream.getTracks().forEach(track => track.stop());
        }
        activeWhisperStream = null;
        isRecording.value = false;
        clearRecordingTimer();
      };

      mediaRecorder.start();
      isRecording.value = true;
      startRecordingTimer();
      startAudioLevelMonitoring();
      console.log('MediaRecorder started');
      return true;
    };

    const stopWhisperMediaRecorder = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log('MediaRecorder stopped');
      } else {
        if (activeWhisperStream) {
          activeWhisperStream.getTracks().forEach(track => track.stop());
        }
        activeWhisperStream = null;
        isRecording.value = false;
      }
      stopAudioLevelMonitoring();
    };

    const transcribeWithWhisper = async (audioBlob: Blob) => {
      if (props.isProcessing) {
        toast?.add({
          type: 'info',
          title: 'Busy',
          message: 'Assistant is busy, please wait'
        });
        return;
      }

      toast?.add({
        type: 'info',
        title: 'Processing',
        message: 'Sending audio to Whisper...'
      });

      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);

        const response = await speechAPI.transcribe(formData);
        if (response.data.transcription) {
          sendTranscription(response.data.transcription);
        } else {
          throw new Error(response.data.message || 'Empty transcription');
        }
      } catch (error: any) {
        console.error('Whisper transcription error:', error);
        toast?.add({
          type: 'error',
          title: 'Transcription Error',
          message: error.response?.data?.message || error.message || 'Failed to transcribe audio'
        });
      }
    };

    // Main Control Functions
    const startAudioCapture = async () => {
      if (props.isProcessing) return;

      let success = false;
      
      if (speechPreference.value === 'webspeech') {
        success = await startWebSpeechRecognition();
        if (success && (isPttMode.value || isVoiceActivationMode.value)) {
          isRecording.value = true;
        }
      } else {
        // Whisper mode
        if (isContinuousMode.value) {
          // Hybrid mode: WebSpeech for VAD
          success = await startWebSpeechRecognition();
        } else {
          // Direct Whisper recording
          success = await startWhisperMediaRecorder();
        }
      }

      if (success && isPttMode.value) {
        startRecordingTimer();
      }
    };

    const stopAudioCapture = () => {
      if (speechPreference.value === 'webspeech') {
        stopWebSpeechRecognition();
      } else {
        if (isRecording.value) {
          stopWhisperMediaRecorder();
        }
        if (isWebSpeechListening.value) {
          stopWebSpeechRecognition();
        }
      }
      
      clearRecordingTimer();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;

      // Send pending continuous transcription
      if (isContinuousMode.value && speechPreference.value === 'webspeech' && pendingTranscriptWebSpeech.value.trim()) {
        sendPendingWebSpeechTranscription();
      }
    };

    const toggleRecording = async () => {
      if (props.isProcessing) return;
      
      if (!micAccessInitiallyChecked.value || permissionStatus.value === 'prompt') {
        const stream = await requestMicrophonePermissionsAndGetStream();
        if (!stream) return;
      }
      
      if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') {
        toast?.add({
          type: 'error',
          title: 'Microphone Error',
          message: permissionMessage.value
        });
        return;
      }

      if (isMicrophoneActive.value) {
        stopAudioCapture();
      } else {
        await startAudioCapture();
      }
    };

    // Mode Switching
    const cycleAudioMode = () => {
      stopAudioCapture();
      const modes = ['push-to-talk', 'continuous', 'voice-activation'];
      const currentIndex = modes.indexOf(currentAudioMode.value);
      currentAudioMode.value = modes[(currentIndex + 1) % modes.length];
      
      toast?.add({
        type: 'info',
        title: 'Audio Mode',
        message: `Switched to ${getAudioModeDisplay(currentAudioMode.value)}`
      });
      
      emit('update:audio-mode', currentAudioMode.value);
    };

    const toggleSpeechMethod = () => {
      stopAudioCapture();
      speechPreference.value = speechPreference.value === 'webspeech' ? 'whisper' : 'webspeech';
      
      toast?.add({
        type: 'info',
        title: 'STT Method',
        message: `Using ${getTranscriptionMethodDisplay()}`
      });
    };

    // Text Input Handling
    const handleTextInput = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`;
      }
    };

    const handleTextSubmit = () => {
      if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) {
        sendTranscription(textInput.value.trim());
        textInput.value = '';
        nextTick(() => handleTextInput());
      }
    };

    // Transcription Management
    const sendTranscription = (text: string) => {
      if (text.trim()) {
        emit('transcription', text.trim());
        
        // Add to history
        transcriptionHistory.value.unshift({
          id: `${Date.now()}-${Math.random()}`,
          text: text.trim(),
          timestamp: Date.now(),
          sent: true
        });
        
        // Keep only last 10 items
        if (transcriptionHistory.value.length > 10) {
          transcriptionHistory.value = transcriptionHistory.value.slice(0, 10);
        }
      }
    };

    const sendPendingWebSpeechTranscription = () => {
      if (pendingTranscriptWebSpeech.value.trim()) {
        sendTranscription(pendingTranscriptWebSpeech.value.trim());
        clearPendingWebSpeechTranscription();
      }
    };

    const clearPendingWebSpeechTranscription = () => {
      pendingTranscriptWebSpeech.value = '';
      liveTranscriptWebSpeech.value = '';
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;
    };

    const editPendingTranscription = () => {
      if (speechPreference.value === 'webspeech' && isContinuousMode.value) {
        editingTranscription.value = pendingTranscriptWebSpeech.value;
        showEditModal.value = true;
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

    const resendTranscription = (item: TranscriptionHistoryItem) => {
      sendTranscription(item.text);
      item.sent = true;
    };

    // Pause Detection for Continuous Mode
    const resetPauseDetectionWebSpeech = () => {
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;

      if (isContinuousMode.value && speechPreference.value === 'webspeech' && 
          pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && 
          autoSendOnPauseWebSpeech.value) {
        
        pauseTimerIdWebSpeech = window.setTimeout(() => {
          if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && 
              autoSendOnPauseWebSpeech.value && isContinuousMode.value) {
            
            pauseDetectedWebSpeech.value = true;
            pauseCountdownWebSpeech.value = pauseTimeoutContinuousWebSpeech.value;
            
            const countdownInterval = setInterval(() => {
              if (!pauseDetectedWebSpeech.value || !isContinuousMode.value) {
                clearInterval(countdownInterval);
                return;
              }
              
              pauseCountdownWebSpeech.value -= 100;
              if (pauseCountdownWebSpeech.value <= 0) {
                clearInterval(countdownInterval);
                if (pauseDetectedWebSpeech.value && isContinuousMode.value) {
                  sendPendingWebSpeechTranscription();
                }
              }
            }, 100);
          }
        }, 500);
      }
    };

    // Timers
    const startRecordingTimer = () => {
      clearRecordingTimer();
      recordingSeconds.value = 0;
      
      recordingTimerId = window.setInterval(() => {
        recordingSeconds.value += 0.1;
        
        // Max recording time check
        if ((isPttMode.value || (isVoiceActivationMode.value && speechPreference.value === 'whisper')) && 
            isRecording.value && recordingSeconds.value >= 60) {
          toast?.add({
            type: 'info',
            title: 'Recording Limit',
            message: 'Recording stopped after 60 seconds'
          });
          stopAudioCapture();
        }
      }, 100);
    };

    const clearRecordingTimer = () => {
      if (recordingTimerId !== null) {
        clearInterval(recordingTimerId);
        recordingTimerId = null;
      }
      recordingSeconds.value = 0;
    };

    const clearPauseTimerWebSpeech = () => {
      if (pauseTimerIdWebSpeech !== null) {
        clearTimeout(pauseTimerIdWebSpeech);
        pauseTimerIdWebSpeech = null;
      }
    };

    // Cleanup
    const cleanUpAfterTranscription = () => {
      isRecording.value = false;
      isWebSpeechListening.value = false;
      interimTranscriptWebSpeech.value = '';
      finalTranscriptWebSpeech.value = '';
      liveTranscriptWebSpeech.value = '';
      audioChunks = [];
      clearRecordingTimer();
    };

    const stopAllAudioProcessing = () => {
      if (recognition) {
        try {
          if (isWebSpeechListening.value) {
            recognition.abort();
          } else {
            recognition.stop();
          }
        } catch (e) {
          console.warn('Error stopping WebSpeech:', e);
        }
      }
      isWebSpeechListening.value = false;

      if (mediaRecorder && mediaRecorder.state === 'recording') {
        try {
          mediaRecorder.stop();
        } catch (e) {
          console.warn('Error stopping MediaRecorder:', e);
        }
      }
      isRecording.value = false;

      if (activeWhisperStream) {
        activeWhisperStream.getTracks().forEach(track => track.stop());
        activeWhisperStream = null;
      }

      stopAudioLevelMonitoring();
      cleanUpAfterTranscription();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;
    };

    // Lifecycle Hooks
    onMounted(async () => {
      currentAudioMode.value = props.audioMode;
      
      if (speechPreference.value === 'webspeech' && typeof window !== 'undefined') {
        initializeWebSpeech();
      }

      // Check microphone permissions
      if (navigator.permissions) {
        try {
          const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          permissionStatus.value = perm.state;
          
          if (perm.state === 'granted') {
            permissionMessage.value = '';
            emit('permission-update', 'granted');
            
            if (isContinuousMode.value || isVoiceActivationMode.value) {
              startAudioCapture();
            }
          } else if (perm.state === 'prompt') {
            permissionMessage.value = 'Click the microphone to grant access';
            emit('permission-update', 'prompt');
          } else {
            permissionMessage.value = 'Microphone access denied in browser settings';
            emit('permission-update', 'denied');
          }
        } catch (e) {
          console.warn('Permissions API error:', e);
          // Fallback
          const stream = await requestMicrophonePermissionsAndGetStream();
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            if (isContinuousMode.value || isVoiceActivationMode.value) {
              startAudioCapture();
            }
          }
        } finally {
          micAccessInitiallyChecked.value = true;
        }
      } else {
        // No Permissions API
        micAccessInitiallyChecked.value = true;
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
        recognition = null;
      }
      
      if (mediaRecorder) {
        mediaRecorder.ondataavailable = null;
        mediaRecorder.onstop = null;
        mediaRecorder.onerror = null;
        mediaRecorder = null;
      }
      
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
      }
      
      clearRecordingTimer();
      clearPauseTimerWebSpeech();
      stopAudioLevelMonitoring();
    });

    // Watchers
    watch(() => props.audioMode, (newMode) => {
      if (newMode !== currentAudioMode.value) {
        stopAllAudioProcessing();
        currentAudioMode.value = newMode;
        
        if ((newMode === 'continuous' || newMode === 'voice-activation') && 
            permissionStatus.value === 'granted') {
          setTimeout(() => {
            if (currentAudioMode.value === newMode) {
              startAudioCapture();
            }
          }, 100);
        }
      }
    });

    watch(speechPreference, (newPref, oldPref) => {
      if (newPref !== oldPref) {
        stopAllAudioProcessing();
        
        if (newPref === 'webspeech' && typeof window !== 'undefined') {
          initializeWebSpeech();
        }
        
        if ((currentAudioMode.value === 'continuous' || currentAudioMode.value === 'voice-activation') && 
            permissionStatus.value === 'granted') {
          setTimeout(() => {
            startAudioCapture();
          }, 100);
        }
      }
    });

    watch(currentAudioMode, (newMode) => {
      if (recognition) {
        const needsContinuous = newMode === 'continuous' || newMode === 'voice-activation';
        if (recognition.continuous !== needsContinuous) {
          console.log(`WebSpeech continuous will be ${needsContinuous} on next start`);
        }
      }
    });

    // Return all reactive properties and methods
    return {
      // Template refs
      textInput,
      textareaRef,
      vadCanvasRef,
      
      // State
      isRecording,
      isWebSpeechListening,
      permissionStatus,
      permissionMessage,
      micAccessInitiallyChecked,
      interimTranscriptWebSpeech,
      liveTranscriptWebSpeech,
      pendingTranscriptWebSpeech,
      transcriptionHistory,
      showTranscriptionHistory,
      recordingSeconds,
      pauseDetectedWebSpeech,
      pauseCountdownWebSpeech,
      audioLevelDisplay,
      showEditModal,
      editingTranscription,
      
      // Settings
      speechPreference,
      currentAudioMode,
      voiceActivationThreshold,
      autoSendOnPauseWebSpeech,
      pauseTimeoutContinuousWebSpeech,
      
      // Computed
      isMicrophoneActive,
      isPttMode,
      isContinuousMode,
      isVoiceActivationMode,
      
      // Methods
      getButtonTitle,
      getPlaceholderText,
      getModeDisplayText,
      getModeIndicatorClass,
      getRecordingStatusText,
      getIdleStatusText,
      getPermissionStatusClass,
      getTranscriptionMethodDisplay,
      getAudioModeDisplay,
      getAudioModeIcon,
      formatTime,
      formatDuration,
      toggleRecording,
      cycleAudioMode,
      toggleSpeechMethod,
      handleTextInput,
      handleTextSubmit,
      sendPendingWebSpeechTranscription,
      clearPendingWebSpeechTranscription,
      editPendingTranscription,
      saveEdit,
      cancelEdit,
      resendTranscription,
      requestMicrophonePermissionsAndGetStream,
      
      // Components
      PushToTalkIcon,
      ContinuousIcon,
      VoiceActivationIcon,
    };
  }
});
</script>

<style scoped>
/* Enhanced Voice Input Styles with Glassmorphism and Modern UI */
.voice-input-wrapper {
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

/* Main Input Container */
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

/* Input Controls */
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
  min-height: 52px;
  max-height: 120px;
}

.text-input:focus {
  @apply shadow-lg;
  background: rgba(255, 255, 255, 0.9) !important;
}

.dark .text-input:focus {
  background: rgba(30, 41, 59, 0.9) !important;
}

.char-counter {
  @apply absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500;
}

/* Voice Controls */
.voice-controls {
  @apply flex items-center gap-2;
}

/* Enhanced Voice Button */
.voice-button {
  @apply relative w-14 h-14 sm:w-16 sm:h-16 rounded-full 
         transition-all duration-300 ease-out transform
         focus:outline-none focus:ring-4 focus:ring-blue-500/30;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 
    0 4px 15px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.voice-button:hover:not(.disabled):not(.processing) {
  @apply scale-110;
  box-shadow: 
    0 6px 20px rgba(59, 130, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.voice-button:active:not(.disabled):not(.processing) {
  @apply scale-95;
}

.voice-button.recording {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 
    0 4px 20px rgba(239, 68, 68, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: recording-pulse 1.5s ease-in-out infinite;
}

.voice-button.processing {
  @apply opacity-70 cursor-wait;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.voice-button.disabled {
  @apply opacity-50 cursor-not-allowed;
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  box-shadow: none;
}

.button-content {
  @apply w-full h-full flex items-center justify-center text-white;
}

/* Icon States */
.idle-state, .recording-state, .processing-state {
  @apply relative w-full h-full flex items-center justify-center;
}

.icon-microphone, .icon-recording {
  @apply w-6 h-6 sm:w-7 sm:h-7 z-10;
}

/* Processing Spinner */
.processing-spinner {
  @apply relative w-8 h-8;
}

.spinner-blade {
  @apply absolute w-full h-full;
  animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-blade::after {
  content: '';
  @apply absolute w-2 h-2 bg-white rounded-full;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.spinner-blade:nth-child(1) { animation-delay: -0.3s; }
.spinner-blade:nth-child(2) { animation-delay: -0.2s; }
.spinner-blade:nth-child(3) { animation-delay: -0.1s; }
.spinner-blade:nth-child(4) { animation-delay: 0s; }

/* Pulse Rings */
.pulse-rings {
  @apply absolute inset-0;
}

.pulse-ring {
  @apply absolute inset-0 rounded-full border-2 border-white/30;
  animation: pulse-expand 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.pulse-ring-2 { animation-delay: 0.5s; }
.pulse-ring-3 { animation-delay: 1s; }

/* Mode Controls */
.mode-controls {
  @apply flex flex-col gap-2;
}

.mode-button {
  @apply w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 
         text-gray-600 dark:text-gray-300 
         hover:bg-gray-200 dark:hover:bg-gray-700 
         transition-all duration-200 flex items-center justify-center
         focus:outline-none focus:ring-2 focus:ring-blue-500/30;
}

.mode-icon {
  @apply w-5 h-5;
}

/* Status Bar */
.status-bar {
  @apply mt-4 flex items-center justify-between;
}

.status-section {
  @apply flex-1;
}

.status-item {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm;
}

.status-idle {
  @apply bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400;
}

.status-recording {
  @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300;
}

.status-success {
  @apply bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300;
}

.status-error {
  @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300;
}

.status-warning {
  @apply bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
}

.status-icon {
  @apply flex-shrink-0;
}

.status-text {
  @apply flex-1 font-medium;
}

.recording-indicator {
  @apply flex items-center gap-1.5;
}

.recording-dot {
  @apply w-2 h-2 bg-red-500 rounded-full;
  animation: recording-blink 1s ease-in-out infinite;
}

.recording-timer {
  @apply font-mono text-xs text-gray-500 dark:text-gray-400;
}

.retry-button {
  @apply ml-2 text-xs underline hover:no-underline cursor-pointer;
}

/* Audio Level Indicator */
.audio-level-indicator {
  @apply ml-4;
}

.audio-bars {
  @apply flex items-end gap-1 h-6;
}

.audio-bar {
  @apply w-1 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-100;
  min-height: 2px;
}

.audio-bar.active {
  @apply bg-blue-500 dark:bg-blue-400;
}

/* Continuous Mode Preview */
.continuous-preview {
  @apply mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 
         border border-blue-200 dark:border-blue-700/50 
         rounded-xl backdrop-blur-sm;
}

.preview-header {
  @apply flex items-center justify-between mb-2;
}

.preview-label {
  @apply text-sm font-medium text-blue-700 dark:text-blue-300;
}

.preview-actions {
  @apply flex items-center gap-1;
}

.preview-btn {
  @apply p-1.5 rounded-lg text-gray-500 hover:text-gray-700 
         dark:text-gray-400 dark:hover:text-gray-200 
         hover:bg-white/50 dark:hover:bg-gray-800/50 
         transition-all duration-200;
}

.preview-btn-send {
  @apply text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300;
}

.preview-content {
  @apply text-sm text-gray-800 dark:text-gray-200 min-h-[2rem];
}

.preview-text {
  @apply whitespace-pre-wrap;
}

.preview-text.pending {
  @apply font-medium;
}

.preview-text.live {
  @apply text-gray-500 dark:text-gray-400 italic;
}

.pause-indicator {
  @apply mt-3 relative;
}

.pause-progress {
  @apply absolute top-0 left-0 h-1 bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-100;
}

.pause-text {
  @apply text-xs text-blue-600 dark:text-blue-400 mt-2 block;
}

/* VAD Visualization */
.vad-visualization {
  @apply relative mt-3 p-2 bg-gray-900 rounded-lg overflow-hidden;
}

.vad-visualization canvas {
  @apply w-full h-full;
}

.vad-threshold-line {
  @apply absolute left-0 right-0 h-px bg-red-500/50 pointer-events-none;
}

/* Transcription History Overlay */
.transcription-history-overlay {
  @apply fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 
         max-w-full max-h-96 bg-white dark:bg-gray-900 
         rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
         overflow-hidden z-50;
}

.history-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.history-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.history-close {
  @apply p-1 rounded-lg text-gray-500 hover:text-gray-700 
         dark:text-gray-400 dark:hover:text-gray-200 
         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}

.history-content {
  @apply p-4 space-y-3 max-h-80 overflow-y-auto;
}

.history-item {
  @apply p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-200;
}

.history-item-sent {
  @apply opacity-60;
}

.history-time {
  @apply text-xs text-gray-500 dark:text-gray-400 block mb-1;
}

.history-text {
  @apply text-sm text-gray-800 dark:text-gray-200;
}

.history-resend {
  @apply mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded-md 
         hover:bg-blue-600 transition-colors;
}

/* Edit Modal */
.modal-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center 
         bg-black/60 backdrop-blur-sm p-4;
}

.modal-content {
  @apply w-full max-w-lg rounded-2xl p-6 shadow-2xl;
}

.modal-header {
  @apply flex items-center justify-between mb-4;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

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

.modal-footer {
  @apply flex items-center justify-end gap-3 mt-4;
}

/* Buttons */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
         hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
         transition-colors flex items-center;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium
         hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 
         dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
         focus:ring-gray-400 transition-colors;
}

/* Animations */
@keyframes pulse-gentle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse-active {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
}

@keyframes recording-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 4px 20px rgba(239, 68, 68, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 
      0 6px 30px rgba(239, 68, 68, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes recording-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

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

/* Transitions */
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
  transform: translateY(-10px);
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
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
  transform: translateX(10px);
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .input-container {
    @apply p-3;
  }
  
  .voice-button {
    @apply w-12 h-12;
  }
  
  .icon-microphone, .icon-recording {
    @apply w-5 h-5;
  }
  
  .transcription-history-overlay {
    @apply bottom-0 left-0 right-0 rounded-t-2xl;
  }
}

/* Dark Mode Enhancements */
.dark .glass-morphism {
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.8) 0%, 
    rgba(30, 41, 59, 0.6) 100%);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .voice-button,
  .mode-button,
  .preview-btn,
  .history-item {
    transition: none;
  }
  
  .pulse-ring,
  .recording-dot,
  .spinner-blade,
  .mode-dot-standby,
  .mode-dot-active {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .voice-button {
    @apply border-2 border-current;
  }
  
  .text-input {
    @apply border-2 border-current;
  }
  
  .mode-button {
    @apply border-2 border-current;
  }
}
</style>