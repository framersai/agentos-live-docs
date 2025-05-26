<template>
  <!-- The UI elements for the VoiceInput component go here -->
</template>

<script lang="ts">
// File: frontend/src/components/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Handles voice input, transcription (Whisper/WebSpeech),
 * audio mode management (PTT, Continuous, VAD), and local transcription history.
 * Consumes global voice settings from VoiceSettingsService.
 * @version 2.0.1 - Fixed TypeScript errors, removed unused imports, improved timer and stream management.
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
import { speechAPI, type TranscriptionResponse } from '@/utils/api';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import type { AxiosResponse } from 'axios'; // Moved here

// Heroicons
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

// Global type declarations
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
    readonly error: string; // Standard is SpeechRecognitionErrorCode
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

interface TranscriptionHistoryItem {
  id: string;
  text: string;
  timestamp: number;
  sent: boolean;
}

export default defineComponent({
  name: 'VoiceInput',
  components: {
    HistoryIcon,
    CloseIcon,
    SendIcon,
    BrowserSpeechIcon,
    WhisperSpeechIcon,
    ContinuousModeIcon,
    VADModeIcon,
    PTTModeIcon,
    EditIcon,
    ClearIcon,
    StopRecordingIcon,
    MicrophoneIcon,
  },
  props: {
    isProcessing: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    transcription: (value: string) => typeof value === 'string',
    'permission-update': (status: 'granted' | 'denied' | 'prompt' | 'error') =>
      ['granted', 'denied', 'prompt', 'error'].includes(status),
  },
  setup(props, { emit }) {
    const toast = inject<ToastService>('toast');

    // Core State
    const textInput = ref('');
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const editModalTextareaRef = ref<HTMLTextAreaElement | null>(null);
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
    let vadSilenceTimerId: number | null = null;

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
    const settings = voiceSettingsManager.settings;

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

    // --- Audio Processing & VAD ---
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
        rawAudioLevel.value = 0;
        audioLevelDisplay.value = 0;
        return;
      }
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);

      audioMonitoringInterval = window.setInterval(() => {
        if (!analyser || !activeStream || !activeStream.active) {
          stopAudioLevelMonitoring();
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const average = dataArray.length > 0 ? sum / dataArray.length : 0;
        rawAudioLevel.value = average / 128;
        audioLevelDisplay.value = Math.min(100, rawAudioLevel.value * 100);

        if (isVoiceActivationMode.value && vadCanvasRef.value && analyser) drawVADVisualization(dataArray);

        if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isWebSpeechListening.value) {
          if (rawAudioLevel.value > vadThreshold.value) {
            if (!isRecording.value) {
              console.log('VAD: Voice detected for Whisper, starting MediaRecorder');
              stopWebSpeechRecognition();
              startWhisperMediaRecorder();
            }
            if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId);
            vadSilenceTimerId = window.setTimeout(() => {
              if (isRecording.value) {
                console.log('VAD: Silence detected for Whisper, stopping MediaRecorder');
                stopWhisperMediaRecorder();
                if (!isWebSpeechListening.value && permissionStatus.value === 'granted' && isMicrophoneActive.value) {
                  console.log('VAD: Restarting WebSpeech VAD post-silence.');
                  startWebSpeechRecognition();
                }
              }
            }, vadSilenceTimeoutMs.value);
          }
        }
      }, 50);
    };

    const stopAudioLevelMonitoring = () => {
      if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
      audioMonitoringInterval = null;
      audioLevelDisplay.value = 0;
      rawAudioLevel.value = 0;
      if (vadCanvasRef.value) {
        const ctx = vadCanvasRef.value.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
      }
    };

    const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
      permissionMessage.value = 'Requesting microphone access...';
      permissionStatus.value = 'prompt';
      emit('permission-update', 'prompt');
      try {
        if (activeStream) {
          activeStream.getTracks().forEach((track) => track.stop());
          activeStream = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
          await audioContext.close();
          audioContext = null;
        }

        const constraints: MediaStreamConstraints = {
          audio: selectedAudioDeviceId.value
            ? { deviceId: { exact: selectedAudioDeviceId.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = stream;
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphoneSourceNode = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;
        microphoneSourceNode.connect(analyser);

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
          permissionMessage.value = 'Microphone access denied.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          permissionStatus.value = 'error';
          permissionMessage.value = 'No microphone found.';
        } else {
          permissionStatus.value = 'error';
          permissionMessage.value = `Mic error: ${err.message || err.name}`;
        }
        emit('permission-update', permissionStatus.value as 'denied' | 'error');
        micAccessInitiallyChecked.value = true;
        activeStream = null;
        return null;
      }
    };

    // --- WebSpeech & MediaRecorder Logic ---
    const initializeWebSpeech = (): boolean => {
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        if (sttPreference.value === 'browser_webspeech_api') {
          permissionMessage.value = 'Web Speech API not supported in this browser.';
          permissionStatus.value = 'error';
          toast?.add({ type: 'error', title: 'Browser Not Supported', message: permissionMessage.value });
        }
        return false;
      }
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (recognition) return true;

      recognition = new SpeechRecognitionAPI();
      recognition.lang = settings.speechLanguage || 'en-US';

      recognition.onstart = () => {
        isWebSpeechListening.value = true;
        console.log('WebSpeech: Started listening');
        if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) {
          isRecording.value = true;
          startRecordingTimer();
        }
        startAudioLevelMonitoring();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalPart = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalPart += transcript + ' ';
          else interim += transcript;
        }
        if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
          liveTranscriptWebSpeech.value = interim;
          if (finalPart.trim()) {
            pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart.trim()).trim();
            liveTranscriptWebSpeech.value = '';
            resetPauseDetectionWebSpeech();
          }
        } else {
          interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
          if (finalPart.trim()) finalTranscriptWebSpeech.value += finalPart.trim() + ' ';
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('WebSpeech Error:', event.error, event.message);
        isWebSpeechListening.value = false;
        isRecording.value = false;
        clearRecordingTimer();
        stopAudioLevelMonitoring();

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          permissionStatus.value = 'denied';
          permissionMessage.value = 'Microphone access denied for speech recognition.';
        } else if (event.error === 'no-speech') {
          permissionMessage.value = 'No speech detected.';
          if (isPttMode.value) toast?.add({ type: 'info', title: 'No Speech', message: permissionMessage.value });
        } else if (event.error === 'network') {
          permissionMessage.value = 'Network error during speech recognition.';
        } else if (event.error === 'aborted') {
          permissionMessage.value = 'Speech input aborted.';
        } else {
          permissionStatus.value = 'error';
          permissionMessage.value = `Speech error: ${event.error}. ${event.message || ''}`.trim();
        }
        if (event.error !== 'no-speech' && event.error !== 'aborted' && event.error !== 'not-allowed') {
          toast?.add({ type: 'error', title: 'Speech Error', message: permissionMessage.value });
        }

        if (
          (isContinuousMode.value || isVoiceActivationMode.value) &&
          event.error !== 'not-allowed' &&
          event.error !== 'service-not-allowed' &&
          permissionStatus.value === 'granted' &&
          isMicrophoneActive.value
        ) {
          console.log('WebSpeech error, attempting restart for continuous/VAD.');
          setTimeout(() => {
            if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) {
              startWebSpeechRecognition();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('WebSpeech: Ended');
        isWebSpeechListening.value = false;
        stopAudioLevelMonitoring();

        if (isPttMode.value && sttPreference.value === 'browser_webspeech_api') {
          if (finalTranscriptWebSpeech.value.trim()) {
            sendTranscription(finalTranscriptWebSpeech.value.trim());
          }
          isRecording.value = false;
          clearRecordingTimer();
          cleanUpAfterTranscription();
        } else if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'browser_webspeech_api') {
          if (permissionStatus.value === 'granted' && !props.isProcessing && isMicrophoneActive.value) {
            setTimeout(() => {
              if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) {
                console.log('WebSpeech: Restarting for continuous/VAD from onend.');
                startWebSpeechRecognition();
              }
            }, 250);
          } else {
            isRecording.value = false;
            clearRecordingTimer();
          }
        } else {
          isRecording.value = false;
          clearRecordingTimer();
        }
      };

      recognition.onspeechstart = () => {
        console.log('WebSpeech: Speech detected');
        if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId);

        if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && !isRecording.value) {
          console.log('WebSpeech VAD (for Whisper) detected speech, starting MediaRecorder.');
          startWhisperMediaRecorder();
        }
      };

      recognition.onspeechend = () => {
        console.log('WebSpeech: Speech ended');
        if ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' && isRecording.value) {
          console.log('WebSpeech VAD (for Whisper) detected speech end, stopping MediaRecorder.');
          stopWhisperMediaRecorder();
        }
        if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') {
          console.log('WebSpeech VAD: Speech ended. Recognition will process.');
        }
      };
      return true;
    };

    const startWebSpeechRecognition = async (): Promise<boolean> => {
      if (!recognition && !initializeWebSpeech()) return false;
      if (isWebSpeechListening.value) {
        console.log('WebSpeech: Already listening.');
        return true;
      }

      if (permissionStatus.value !== 'granted') {
        if (!(await requestMicrophonePermissionsAndGetStream())) return false;
      }
      if (!activeStream && permissionStatus.value === 'granted') {
        if (!(await requestMicrophonePermissionsAndGetStream())) return false;
      }

      finalTranscriptWebSpeech.value = '';
      interimTranscriptWebSpeech.value = '';
      recognition!.lang = settings.speechLanguage || 'en-US';
      recognition!.continuous =
        (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') ||
        (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') ||
        ((isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api');
      recognition!.interimResults = true;

      try {
        recognition!.start();
        return true;
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          console.warn('WebSpeech: InvalidStateError on start, likely already started.');
          isWebSpeechListening.value = true;
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
          console.warn('Error during WebSpeech stop/abort:', e);
          isWebSpeechListening.value = false;
        }
      }
    };

    const startWhisperMediaRecorder = async (): Promise<boolean> => {
      if (isRecording.value) {
        console.log('MediaRecorder: Already recording.');
        return true;
      }
      if (!activeStream || !activeStream.active) {
        if (!(await requestMicrophonePermissionsAndGetStream())) return false;
      }
      if (!activeStream) return false;

      audioChunks = [];
      const options = { mimeType: 'audio/webm;codecs=opus' };
      try {
        mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType)
          ? new MediaRecorder(activeStream, options)
          : new MediaRecorder(activeStream);
      } catch (e) {
        console.error('Failed to create MediaRecorder:', e);
        toast?.add({ type: 'error', title: 'Recording Error', message: 'Failed to initialize audio recorder.' });
        return false;
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
        audioChunks = [];

        if (audioBlob.size > 1000) {
          await transcribeWithWhisper(audioBlob);
        } else {
          console.warn('Whisper: Audio too small or empty, not sending.');
          if (isPttMode.value) {
            toast?.add({ type: 'warning', title: 'No Audio', message: 'No significant audio was recorded.' });
          }
        }
        isRecording.value = false;
        clearRecordingTimer();

        if (
          (isContinuousMode.value || isVoiceActivationMode.value) &&
          sttPreference.value === 'whisper_api' &&
          !isWebSpeechListening.value &&
          isMicrophoneActive.value
        ) {
          console.log('MediaRecorder stopped. Restarting WebSpeech VAD for Whisper hybrid mode.');
          startWebSpeechRecognition();
        } else if (!isMicrophoneActive.value) {
          stopWebSpeechRecognition(true);
        }
      };

      mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        toast?.add({ type: 'error', title: 'Recording Error', message: 'MediaRecorder failed.' });
        isRecording.value = false;
        clearRecordingTimer();
      };

      mediaRecorder.start(isContinuousMode.value || isVoiceActivationMode.value ? 10000 : undefined);
      isRecording.value = true;
      startRecordingTimer();
      startAudioLevelMonitoring();
      console.log('MediaRecorder started');
      return true;
    };

    const stopWhisperMediaRecorder = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log('MediaRecorder stopping...');
      } else {
        isRecording.value = false;
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
        if (settings.speechLanguage) {
          formData.append('language', settings.speechLanguage.substring(0, 2));
        }

        const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponse & { message?: string }>;
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
          message: error.response?.data?.message || error.message || 'Failed to transcribe audio with Whisper.',
        });
      }
    };

    // --- Main Control Functions ---
    const startAudioCapture = async () => {
      if (props.isProcessing || isMicrophoneActive.value) return;
      if (permissionStatus.value !== 'granted') {
        if (!(await requestMicrophonePermissionsAndGetStream())) return;
      }

      if (sttPreference.value === 'browser_webspeech_api') {
        await startWebSpeechRecognition();
      } else {
        // 'whisper_api'
        if (isContinuousMode.value || isVoiceActivationMode.value) {
          await startWebSpeechRecognition(); // WebSpeech for VAD
        } else {
          // PTT Whisper
          await startWhisperMediaRecorder();
        }
      }
    };

    const stopAudioCapture = (abortWebSpeech = false) => {
      console.log('Stopping audio capture...');
      if (sttPreference.value === 'browser_webspeech_api') {
        stopWebSpeechRecognition(abortWebSpeech);
      } else {
        if (isRecording.value) stopWhisperMediaRecorder();
        if (isWebSpeechListening.value) stopWebSpeechRecognition(abortWebSpeech);
      }
      clearRecordingTimer();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      stopAudioLevelMonitoring();

      if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim()) {
        sendPendingWebSpeechTranscription();
      }
    };

    const toggleRecording = async () => {
      if (props.isProcessing) return;
      if (isMicrophoneActive.value) {
        stopAudioCapture(true);
      } else {
        if (permissionStatus.value !== 'granted') {
          const stream = await requestMicrophonePermissionsAndGetStream();
          if (!stream) {
            toast?.add({ type: 'error', title: 'Microphone Access', message: permissionMessage.value || 'Could not access microphone.' });
            return;
          }
        }
        await startAudioCapture();
      }
    };

    // --- Text Input & Transcription History ---
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

    const sendTranscription = (text: string) => {
      if (text.trim()) {
        emit('transcription', text.trim());
        const newHistoryItem: TranscriptionHistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          text: text.trim(),
          timestamp: Date.now(),
          sent: true,
        };
        const updatedHistory = [newHistoryItem, ...transcriptionHistory.value];
        transcriptionHistory.value = updatedHistory.slice(0, 10);
      }
    };

    const resendTranscription = (item: TranscriptionHistoryItem) => {
      sendTranscription(item.text);
      const index = transcriptionHistory.value.findIndex((h) => h.id === item.id);
      if (index > -1) {
        transcriptionHistory.value[index].sent = true;
      }
    };

    const sendPendingWebSpeechTranscription = () => {
      if (pendingTranscriptWebSpeech.value.trim()) {
        sendTranscription(pendingTranscriptWebSpeech.value.trim());
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
      if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
        editingTranscription.value = pendingTranscriptWebSpeech.value;
        showEditModal.value = true;
        nextTick(() => editModalTextareaRef.value?.focus());
      }
    };

    const saveEdit = () => {
      if (editingTranscription.value.trim()) {
        pendingTranscriptWebSpeech.value = editingTranscription.value.trim();
        sendPendingWebSpeechTranscription();
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
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;
      if (
        isContinuousMode.value &&
        sttPreference.value === 'browser_webspeech_api' &&
        pendingTranscriptWebSpeech.value.trim() &&
        isWebSpeechListening.value &&
        continuousModeAutoSend.value
      ) {
        pauseTimerIdWebSpeech = window.setTimeout(() => {
          if (
            pendingTranscriptWebSpeech.value.trim() &&
            isWebSpeechListening.value &&
            continuousModeAutoSend.value &&
            isContinuousMode.value
          ) {
            pauseDetectedWebSpeech.value = true;
            pauseCountdownWebSpeech.value = continuousModePauseTimeoutMs.value;
            const countdownInterval = setInterval(() => {
              if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isWebSpeechListening.value) {
                clearInterval(countdownInterval);
                pauseDetectedWebSpeech.value = false;
                return;
              }
              pauseCountdownWebSpeech.value -= 100;
              if (pauseCountdownWebSpeech.value <= 0) {
                clearInterval(countdownInterval);
                if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
                  sendPendingWebSpeechTranscription();
                }
                pauseDetectedWebSpeech.value = false;
              }
            }, 100);
          }
        }, 500);
      }
    };

    const startRecordingTimer = () => {
      clearRecordingTimer();
      recordingSeconds.value = 0;
      recordingTimerId = window.setInterval(() => {
        recordingSeconds.value += 0.1;
        if (
          (isPttMode.value || isVoiceActivationMode.value) &&
          isRecording.value &&
          recordingSeconds.value >= 60
        ) {
          toast?.add({ type: 'info', title: 'Recording Limit', message: 'Max recording time (60s) reached.' });
          stopAudioCapture(sttPreference.value === 'browser_webspeech_api');
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
      interimTranscriptWebSpeech.value = '';
      finalTranscriptWebSpeech.value = '';
      audioChunks = [];
      clearRecordingTimer();
    };

    const stopAllAudioProcessing = (abortWebSpeech = true) => {
      console.log('Stopping all audio processing...');
      if (recognition) {
        try {
          if (isWebSpeechListening.value) {
            if (abortWebSpeech) recognition.abort();
            else recognition.stop();
          }
        } catch (e) {
          console.warn('Error stopping/aborting WebSpeech:', e);
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

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = null;
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch((e) => console.warn('Error closing AudioContext:', e));
        audioContext = null;
      }
      microphoneSourceNode = null;
      analyser = null;

      stopAudioLevelMonitoring();
      cleanUpAfterTranscription();
      clearPauseTimerWebSpeech();
      pauseDetectedWebSpeech.value = false;
      pauseCountdownWebSpeech.value = 0;
    };

    // Lifecycle Hooks
    onMounted(async () => {
      if (typeof window !== 'undefined') initializeWebSpeech();
      if (navigator.permissions) {
        try {
          const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          permissionStatus.value = perm.state;
          if (perm.state === 'granted') {
            permissionMessage.value = '';
            emit('permission-update', 'granted');
            if (isContinuousMode.value || isVoiceActivationMode.value) await startAudioCapture();
          } else if (perm.state === 'prompt') {
            permissionMessage.value = 'Click the microphone to grant access.';
            emit('permission-update', 'prompt');
          } else {
            permissionMessage.value = 'Microphone access denied in browser settings.';
            emit('permission-update', 'denied');
          }
          perm.onchange = () => {
            permissionStatus.value = perm.state;
            emit('permission-update', perm.state);

            if (perm.state === 'granted') {
              permissionMessage.value = 'Microphone ready.';
              if ((isContinuousMode.value || isVoiceActivationMode.value) && !isMicrophoneActive.value) {
                startAudioCapture();
              }
            } else if (perm.state === 'denied') {
              permissionMessage.value = 'Microphone access denied.';
              if (isMicrophoneActive.value) stopAllAudioProcessing();
            } else {
              permissionMessage.value = 'Microphone access requires your action.';
              if (isMicrophoneActive.value) stopAllAudioProcessing();
            }
          };
        } catch (e) {
          console.warn('Permissions API query error:', e);
          permissionStatus.value = 'error';
          permissionMessage.value = 'Cannot query mic permission.';
          emit('permission-update', 'error');
        } finally {
          micAccessInitiallyChecked.value = true;
        }
      } else {
        micAccessInitiallyChecked.value = true;
        permissionMessage.value = 'Permissions API not supported. Click mic to request.';
      }
    });

    onBeforeUnmount(() => {
      stopAllAudioProcessing();
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: 'microphone' as PermissionName })
          .then((perm) => {
            perm.onchange = null;
          })
          .catch((e) => console.warn('Error removing permission listener:', e));
      }
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
    });

    // Watchers for global settings changes
    watch(audioInputMode, (newMode, oldMode) => {
      if (newMode === oldMode) return;
      console.log(`VoiceInput: audioInputMode changed externally from ${oldMode} to ${newMode}.`);
      stopAllAudioProcessing(true);
      liveTranscriptWebSpeech.value = '';
      pendingTranscriptWebSpeech.value = '';
      finalTranscriptWebSpeech.value = '';
      interimTranscriptWebSpeech.value = '';

      if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
        nextTick(() => {
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
        initializeWebSpeech();
      }
      if ((audioInputMode.value === 'continuous' || audioInputMode.value === 'voice-activation') && permissionStatus.value === 'granted') {
        nextTick(() => {
          if (sttPreference.value === newPref && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
            startAudioCapture();
          }
        });
      }
    });

    watch(selectedAudioDeviceId, (newVal, oldVal) => {
      if (newVal !== oldVal && isMicrophoneActive.value) {
        console.log('VoiceInput: Audio device changed. Restarting capture.');
        stopAllAudioProcessing(true);
        nextTick(() => {
          if (permissionStatus.value === 'granted') {
            startAudioCapture();
          }
        });
      } else if (
        newVal !== oldVal &&
        !isMicrophoneActive.value &&
        permissionStatus.value === 'granted' &&
        (isContinuousMode.value || isVoiceActivationMode.value)
      ) {
        console.log('VoiceInput: Audio device changed while inactive in auto-start mode. Re-evaluating start.');
      }
    });

    watch(
      () => settings.speechLanguage,
      (newLang, oldLang) => {
        if (newLang === oldLang) return;
        console.log(`VoiceInput: Speech language changed from ${oldLang} to ${newLang}.`);
        if (recognition) {
          recognition.lang = newLang || 'en-US';
          if (isWebSpeechListening.value) {
            console.log('Restarting WebSpeech to apply new language.');
            stopWebSpeechRecognition(true);
            nextTick(() => {
              if (
                isMicrophoneActive.value &&
                permissionStatus.value === 'granted' &&
                (isContinuousMode.value || isVoiceActivationMode.value || isPttMode.value)
              ) {
                startWebSpeechRecognition();
              }
            });
          }
        }
      }
    );

    return {
      props,
      textInput,
      textareaRef,
      vadCanvasRef,
      editModalTextareaRef,
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
      settings,
      isMicrophoneActive,
      isPttMode,
      isContinuousMode,
      isVoiceActivationMode,
      getButtonTitle,
      getPlaceholderText,
      getModeDisplayText,
      getModeIndicatorClass,
      getRecordingStatusText,
      getIdleStatusText,
      getPermissionStatusClass,
      getTranscriptionMethodDisplay,
      formatTime,
      formatDuration,
      toggleRecording,
      handleTextInput,
      handleTextSubmit,
      sendPendingWebSpeechTranscription,
      clearPendingWebSpeechTranscription,
      editPendingTranscription,
      saveEdit,
      cancelEdit,
      resendTranscription,
      requestMicrophonePermissionsAndGetStream,
      HistoryIcon,
      CloseIcon,
      SendIcon,
      BrowserSpeechIcon,
      WhisperSpeechIcon,
      ContinuousModeIcon,
      VADModeIcon,
      PTTModeIcon,
      EditIcon,
      ClearIcon,
      StopRecordingIcon,
      MicrophoneIcon,
    };
  },
});
</script>