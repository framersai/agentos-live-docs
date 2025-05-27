// File: frontend/src/components/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Handles voice input, transcription, audio mode management,
 * and local transcription history with "Ephemeral Harmony" styling.
 * @version 2.1.0 - Ephemeral Harmony redesign with new features.
 */

<template>
  <div class="voice-input-panel-ephemeral"
       :class="{
         'processing': props.isProcessing,
         'microphone-error': permissionStatus === 'error',
         'microphone-denied': permissionStatus === 'denied'
       }"
       :aria-busy="props.isProcessing || isMicrophoneActive">

    <div v-if="isMicrophoneActive && (interimTranscriptWebSpeech || liveTranscriptWebSpeech || pendingTranscriptWebSpeech || (sttPreference === 'whisper_api' && isRecording))"
         class="live-transcript-display-ephemeral"
         aria-live="polite">
      <p v-if="interimTranscriptWebSpeech && sttPreference === 'browser_webspeech_api'" class="interim-transcript-ephemeral" aria-label="Interim transcription">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="finalized-part-ephemeral" aria-label="Live transcription">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="pending-transcript-ephemeral" aria-label="Pending transcription">
        <span class="font-semibold text-xs">Pending:</span> {{ pendingTranscriptWebSpeech }}
      </p>
      <div v-if="sttPreference === 'whisper_api' && isRecording" class="whisper-status-ephemeral" aria-label="Recording for Whisper API">
        <CloudArrowUpIcon class="icon-xs inline mr-1 animate-pulse-subtle"/> Recording ({{ formatDuration(recordingSeconds) }})
      </div>
    </div>

    <div class="input-area-ephemeral">
      <textarea
        ref="textareaRef"
        v-model="textInput"
        @input="handleTextareaInput"
        @keyup.enter.exact="!isMicrophoneActive && handleTextSubmit()"
        class="voice-textarea-ephemeral"
        :placeholder="getPlaceholderText()"
        :disabled="isMicrophoneActive || props.isProcessing"
        aria-label="Text input for chat"
        rows="1"
      ></textarea>
      <button
        @click="handleTextSubmit"
        :disabled="!textInput.trim() || isMicrophoneActive || props.isProcessing"
        class="send-button-ephemeral"
        aria-label="Send text message"
        title="Send Text Message">
        <PaperAirplaneIcon class="icon" />
      </button>
    </div>

    <div class="controls-main-row-ephemeral">
      <button
        @mousedown="isPttMode && !props.isProcessing ? startAudioCapture() : null"
        @mouseup="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @keydown.space.prevent="isPttMode && !props.isProcessing && !isMicrophoneActive ? startAudioCapture() : null"
        @keyup.space.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @touchstart.prevent="isPttMode && !props.isProcessing ? startAudioCapture() : null"
        @touchend.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @click="!isPttMode && !props.isProcessing ? toggleRecording() : null"
        class="mic-button-ephemeral"
        :class="{
          'listening': isMicrophoneActive && !props.isProcessing,
          'recording-whisper': isRecording && sttPreference === 'whisper_api',
          'processing': props.isProcessing,
          'mic-error': permissionStatus === 'error',
          'mic-denied': permissionStatus === 'denied'
        }"
        :title="getButtonTitle()"
        :aria-pressed="isMicrophoneActive"
        :disabled="props.isProcessing || (!micAccessInitiallyChecked && permissionStatus !== 'granted' && permissionStatus !== 'prompt')"
        aria-live="polite">
        <MicrophoneIcon class="icon" />
      </button>

      <div class="status-display-ephemeral">
        <div class="mode-indicator-wrapper-ephemeral">
          <span class="mode-dot-ephemeral" :class="getModeIndicatorClass()"></span>
          <span class="mode-text-ephemeral" :title="`Current mode: ${settings.audioInputMode}`">{{ getIdleStatusText() }}</span>
        </div>
        <div class="transcription-status-ephemeral" aria-live="assertive">
          {{ getRecordingStatusText() }}
          <span v-if="isContinuousMode && pauseDetectedWebSpeech && sttPreference === 'browser_webspeech_api'" class="countdown"> ({{ Math.max(0, pauseCountdownWebSpeech / 1000).toFixed(1) }}s)</span>
        </div>
        <div v-if="permissionMessage && permissionStatus !== 'granted'" class="permission-status-ephemeral" :class="permissionStatus" role="alert">
          {{ permissionMessage }}
        </div>
      </div>

      <div class="audio-mode-selector-wrapper" ref="audioModeDropdownRef">
        <button @click="toggleAudioModeDropdown" class="audio-mode-button" aria-haspopup="true" :aria-expanded="showAudioModeDropdown">
            <component :is="currentAudioModeIcon" class="icon" />
            <span class="hidden sm:inline">{{ currentAudioModeLabel }}</span>
            <ChevronDownIcon class="chevron-icon icon-xs" :class="{'open': showAudioModeDropdown}" />
        </button>
        <transition name="dropdown-float">
            <div v-if="showAudioModeDropdown" class="audio-mode-dropdown">
                <button v-for="mode in audioModeOptions" :key="mode.value" @click="selectAudioMode(mode.value)"
                        class="audio-mode-item" :class="{'active': settings.audioInputMode === mode.value}">
                    <component :is="mode.icon" class="icon" />
                    {{ mode.label }}
                </button>
            </div>
        </transition>
      </div>

      <div class="secondary-controls-ephemeral">
        <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="control-btn-ephemeral" title="Transcription History">
          <ClockIcon class="icon"/>
        </button>
        <button v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && pendingTranscriptWebSpeech.trim()" @click="editPendingTranscription" class="control-btn-ephemeral" title="Edit pending transcript">
          <PencilIcon class="icon"/>
        </button>
        <button v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && pendingTranscriptWebSpeech.trim()" @click="clearPendingWebSpeechTranscription" class="control-btn-ephemeral" title="Clear pending transcript">
          <TrashIcon class="icon"/>
        </button>
        <button v-if="isMicrophoneActive && (isContinuousMode || isVoiceActivationMode)" @click="() => stopAudioCapture(true)" class="control-btn-ephemeral stop-btn-ephemeral" title="Stop Listening/Recording">
          <StopCircleIcon class="icon"/>
        </button>
      </div>
    </div>

    <canvas
      v-if="isVoiceActivationMode && isMicrophoneActive && permissionStatus === 'granted' && sttPreference === 'whisper_api'"
      ref="vadCanvasRef"
      class="vad-canvas-ephemeral"
      width="300" height="30"
      aria-label="Voice activity visualization">
    </canvas>
     <div v-if="isVoiceActivationMode && sttPreference === 'browser_webspeech_api' && isMicrophoneActive" class="web-speech-vad-active-indicator text-xs text-center p-1 text-neutral-text-muted">
      WebSpeech VAD Active (Browser handles silence detection)
    </div>


    <Transition name="modal-fade-holographic">
      <div v-if="showTranscriptionHistory" class="modal-overlay-ephemeral" @click.self="showTranscriptionHistory = false">
        <div class="modal-content-ephemeral" role="dialog" aria-modal="true" aria-labelledby="history-title">
          <div class="modal-header-ephemeral">
            <h3 id="history-title" class="modal-title-ephemeral">Transcription History</h3>
            <button @click="showTranscriptionHistory = false" class="modal-close-button-ephemeral" aria-label="Close history">
              <XMarkIcon class="icon-base"/>
            </button>
          </div>
          <div class="modal-body-ephemeral custom-scrollbar-thin">
            <ul v-if="transcriptionHistory.length > 0" class="history-list-ephemeral">
              <li v-for="item in transcriptionHistory" :key="item.id" class="history-item-ephemeral">
                <div class="history-item-text-ephemeral">{{ item.text }}</div>
                <div class="history-item-meta-ephemeral">
                  <span class="timestamp-ephemeral">{{ formatTime(item.timestamp) }}</span>
                  <button @click="resendTranscription(item)" class="resend-btn-ephemeral" title="Resend this transcription">
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
        <div v-if="showEditModal" class="modal-overlay-ephemeral" @click.self="cancelEdit">
          <div class="modal-content-ephemeral sm:max-w-lg" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <div class="modal-header-ephemeral">
              <h3 id="edit-title" class="modal-title-ephemeral">Edit Transcription</h3>
              <button @click="cancelEdit" class="modal-close-button-ephemeral" aria-label="Cancel edit">
                <XMarkIcon class="icon-base"/>
              </button>
            </div>
            <div class="modal-body-ephemeral p-4">
              <textarea
                ref="editModalTextareaRef"
                v-model="editingTranscription"
                class="voice-textarea-ephemeral w-full min-h-[120px]"
                aria-label="Edit transcription text"
              ></textarea>
            </div>
            <div class="modal-footer-ephemeral">
              <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
              <button @click="saveEdit" class="btn btn-primary btn-sm">Save & Send</button>
            </div>
          </div>
        </div>
      </Transition>

  </div>
</template>

as the previous version with "ephemeral" classes

<script lang="ts">
/**
 * @file VoiceInput.vue
 * @description Handles voice input, transcription (Whisper/WebSpeech),
 * audio mode management (PTT, Continuous, VAD), and local transcription history.
 * Consumes global voice settings from VoiceSettingsService.
 * @version 2.1.1 - Corrected TypeScript errors related to SpeechRecognition API types.
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
    type Component as VueComponentType,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import { voiceSettingsManager, type AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services'; // Adjusted path if services is in parent
import type { AxiosResponse } from 'axios';

import {
    ClockIcon, XMarkIcon, PaperAirplaneIcon, CloudArrowUpIcon,
    SpeakerWaveIcon as ContinuousModeIcon,
    ChevronDownIcon,
    HandRaisedIcon,
    HandRaisedIcon as PTTModeIconOriginal, // Using MicrophoneIcon directly for main button
    ArrowsRightLeftIcon as VADModeIcon, // Using a different icon for VAD to distinguish
    PencilIcon, TrashIcon, StopCircleIcon, MicrophoneIcon,
} from '@heroicons/vue/24/outline';


// More specific types for SpeechRecognition API if needed, or rely on lib.dom.d.ts
// These help clarify the event structures if TypeScript's default is too generic.
interface ISpeechRecognitionResult extends SpeechRecognitionResult {
    // Standard properties are usually available, this is for clarity or extension
}
interface ISpeechRecognitionResultList extends SpeechRecognitionResultList {
    // Standard properties
    item(index: number): ISpeechRecognitionResult;
}
interface ISpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: ISpeechRecognitionResultList;
    //emma?: any; // For experimental features if any
}
interface ISpeechRecognitionErrorEvent extends Event { // Changed from ErrorEvent
    readonly error: SpeechRecognitionErrorCode; // Standard error codes
    readonly message: string; // Standard message
}
// Add global SpeechRecognition type for TypeScript if missing
declare global {
    interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    }
    // Fallback SpeechRecognition type if not present
    var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
    };
    var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
    };
    interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
    }
}
// Standard SpeechRecognitionErrorCode strings
type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';


interface TranscriptionHistoryItem {
    id: string;
    text: string;
    timestamp: number;
    sent: boolean;
}

interface AudioModeOption {
    label: string;
    value: AudioInputMode;
    icon: VueComponentType;
}


export default defineComponent({
    name: 'VoiceInputEphemeral',
    components: {
        ClockIcon, XMarkIcon, PaperAirplaneIcon, CloudArrowUpIcon,
        ContinuousModeIcon, PTTModeIcon: MicrophoneIcon, VADModeIcon, ChevronDownIcon, // PTTModeIcon aliased to MicrophoneIcon for main button display
        PencilIcon, TrashIcon, StopCircleIcon, MicrophoneIcon,
    },
    props: {
        isProcessing: { type: Boolean, required: true },
    },
    emits: {
        transcription: (value: string) => typeof value === 'string',
        'permission-update': (status: 'granted' | 'denied' | 'prompt' | 'error') =>
          ['granted', 'denied', 'prompt', 'error'].includes(status),
        'processing-audio': (isProcessing: boolean) => typeof isProcessing === 'boolean',
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
        const finalTranscriptWebSpeech = ref(''); // Reinstated and used for PTT
        const liveTranscriptWebSpeech = ref('');
        const pendingTranscriptWebSpeech = ref('');

        const transcriptionHistory = ref<TranscriptionHistoryItem[]>(
            JSON.parse(localStorage.getItem('vca-transcriptionHistory-v2') || '[]')
        );
        const showTranscriptionHistory = ref(false);
        const showAudioModeDropdown = ref(false);
        const audioModeDropdownRef = ref<HTMLElement | null>(null);

        const settings = voiceSettingsManager.settings; // Reactive settings

        const audioModeOptions = computed<AudioModeOption[]>(() => [
            { label: 'Push-to-Talk', value: 'push-to-talk', icon: HandRaisedIcon }, // Using specific icon for dropdown
            { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon },
            { label: 'Voice Activate', value: 'voice-activation', icon: VADModeIcon },
        ]);
        const currentAudioModeDetails = computed(() => audioModeOptions.value.find(m => m.value === settings.audioInputMode));
        const currentAudioModeLabel = computed(() => currentAudioModeDetails.value?.label || 'Select Mode');
        const currentAudioModeIcon = computed(() => currentAudioModeDetails.value?.icon || MicrophoneIcon); // Main button uses MicrophoneIcon

        watch(
            transcriptionHistory,
            (newHistory) => {
                localStorage.setItem('vca-transcriptionHistory-v2', JSON.stringify(newHistory));
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

        const vadCanvasRef = ref<HTMLCanvasElement | null>(null);

        // Track the interval ID for audio monitoring
        let audioMonitoringInterval: number | null = null;
 
        let recognition: SpeechRecognition | null = null; // Will be `window.SpeechRecognition` or `window.webkitSpeechRecognition`

        const sttPreference = computed(() => settings.sttPreference);
        const selectedAudioDeviceId = computed(() => settings.selectedAudioInputDeviceId);
        const vadThreshold = computed(() => settings.vadThreshold);
        const vadSilenceTimeoutMs = computed(() => settings.vadSilenceTimeoutMs);
        const continuousModeAutoSend = computed(() => settings.continuousModeAutoSend);
        const continuousModePauseTimeoutMs = computed(() => settings.continuousModePauseTimeoutMs);

        const isMicrophoneActive = computed(() => isRecording.value || isWebSpeechListening.value);
        const isPttMode = computed(() => settings.audioInputMode === 'push-to-talk');
        const isContinuousMode = computed(() => settings.audioInputMode === 'continuous');
        const isVoiceActivationMode = computed(() => settings.audioInputMode === 'voice-activation');

        const getButtonTitle = (): string => {
          if (props.isProcessing) return 'Assistant is processing...';
          if (!micAccessInitiallyChecked.value && permissionStatus.value === '') return 'Initializing microphone...';
          if (permissionStatus.value === 'denied') return 'Microphone access denied. Check browser settings.';
          if (permissionStatus.value === 'error') return `Microphone error: ${permissionMessage.value || 'Unknown'}`;
          if (isMicrophoneActive.value) {
              if (isContinuousMode.value) return 'Stop continuous listening';
              if (isVoiceActivationMode.value) return 'Stop voice activation';
              return 'Release to stop recording (PTT)';
          }
          // Not active
          const currentMode = audioModeOptions.value.find(m => m.value === settings.audioInputMode);
          if (currentMode) return `Click or Hold for ${currentMode.label}`;
          return 'Activate Microphone';
        };

        const getPlaceholderText = (): string => {
            if (isMicrophoneActive.value) {
                if (isPttMode.value) return 'Recording... release to send.';
                if (isContinuousMode.value) return 'Listening continuously... say something.';
                if (isVoiceActivationMode.value) return 'Listening for voice activation...';
            }
            const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser';
            if (isContinuousMode.value) return `Type or click mic for Continuous (${method})...`;
            if (isVoiceActivationMode.value) return `Type or click mic for VAD (${method})...`;
            return `Type or hold mic for PTT (${method})...`;
        };

        const getModeIndicatorClass = (): string => {
            if (props.isProcessing) return 'standby';
            if (isMicrophoneActive.value) return 'active';
            if ((isContinuousMode.value || isVoiceActivationMode.value) && permissionStatus.value === 'granted') return 'standby';
            return 'idle';
        };

        const getRecordingStatusText = (): string => {
            if (props.isProcessing) return 'Assistant processing...'; // Changed for clarity
            const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser';
            if (isPttMode.value && isMicrophoneActive.value) return `Recording (${method})... ${formatDuration(recordingSeconds.value)}`;
            if (isContinuousMode.value) {
                if (pauseDetectedWebSpeech.value && sttPreference.value === 'browser_webspeech_api') return 'Pause detected, auto-sending soon...';
                if (isRecording.value && sttPreference.value === 'whisper_api') return `Segmenting (Whisper)... ${formatDuration(recordingSeconds.value)}`;
                return isWebSpeechListening.value ? `Listening continuously (${method})...` : `Continuous mode ready (${method})`;
            }
            if (isVoiceActivationMode.value) {
                if (isRecording.value) return `Voice detected, recording (${method})... ${formatDuration(recordingSeconds.value)}`;
                return isWebSpeechListening.value ? `Listening for voice (${method})...` : `Voice activation ready (${method})`;
            }
            return 'Ready for input.';
        };

        const getIdleStatusText = (): string => {
           if (props.isProcessing) return 'Assistant processing...';
           if (permissionStatus.value === 'granted') {
             const modeLabel = currentAudioModeLabel.value;
             return `${modeLabel} Ready`;
           }
           return 'Mic status unavailable';
        };

        const formatDuration = (seconds: number): string => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        const formatTime = (timestamp: number): string =>
            new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });


        const handleTextareaInput = () => {
            if (textareaRef.value) {
                textareaRef.value.style.height = 'auto';
                const maxHeight = 150;
                textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
            }
        };

        const toggleAudioModeDropdown = () => showAudioModeDropdown.value = !showAudioModeDropdown.value;
        const selectAudioMode = (mode: AudioInputMode) => {
            voiceSettingsManager.updateSetting('audioInputMode', mode);
            showAudioModeDropdown.value = false;
        };
        const handleClickOutsideAudioModeDropdown = (event: MouseEvent) => {
            if (audioModeDropdownRef.value && !audioModeDropdownRef.value.contains(event.target as Node)) {
                showAudioModeDropdown.value = false;
            }
        };

        const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
            permissionMessage.value = 'Requesting microphone access...'; permissionStatus.value = 'prompt'; emit('permission-update', 'prompt');
            try {
                if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
                if (audioContext && audioContext.state !== 'closed') { await audioContext.close().catch(console.warn); audioContext = null; }

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
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.6;
                microphoneSourceNode.connect(analyser);

                permissionStatus.value = 'granted';
                permissionMessage.value = 'Microphone ready.';
                emit('permission-update', 'granted');
                setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 2000);
                micAccessInitiallyChecked.value = true;
                return stream;
            } catch (err: any) {
                console.error("getUserMedia error:", err.name, err.message);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    permissionStatus.value = 'denied'; permissionMessage.value = 'Microphone access denied by user.';
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    permissionStatus.value = 'error'; permissionMessage.value = 'No microphone found.';
                } else {
                    permissionStatus.value = 'error'; permissionMessage.value = `Mic error: ${err.name || 'Unknown'}. Check console.`;
                }
                toast?.add({ type: 'error', title: 'Microphone Error', message: permissionMessage.value });
                emit('permission-update', permissionStatus.value as 'denied' | 'error');
                micAccessInitiallyChecked.value = true;
                activeStream = null;
                return null;
            }
        };

        const drawVADVisualization = (/* dataArray: Uint8Array */) => { // dataArray passed from monitor if needed
            const canvas = vadCanvasRef.value;
            if (!canvas || !analyser || !isMicrophoneActive.value) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength); // Get fresh data
            analyser.getByteFrequencyData(dataArray);


            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.0; // Wider bars for fewer bins
            let x = 0;

            const baseHue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-h') || '270');
            const baseSat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-s') || '90%');

            for (let i = 0; i < bufferLength; i++) {
                const barHeightFraction = dataArray[i] / 255;
                const barHeight = barHeightFraction * height;

                const lightness = 40 + barHeightFraction * 30; // Vary lightness
                const alpha = 0.3 + barHeightFraction * 0.6;  // Vary alpha

                ctx.fillStyle = `hsla(${baseHue}, ${baseSat}, ${lightness}%, ${alpha})`;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        const startAudioLevelMonitoring = () => {
            if (!analyser || !activeStream || !activeStream.active || activeStream.getAudioTracks().length === 0 || !activeStream.getAudioTracks()[0].enabled) {
                 return;
            }
            if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);

            audioMonitoringInterval = window.setInterval(() => {
                if (!analyser || !activeStream || !activeStream.active) {
                    stopAudioLevelMonitoring(); return;
                }

                const dataArrayVAD = new Uint8Array(analyser.frequencyBinCount); // Use frequency for VAD level check
                analyser.getByteFrequencyData(dataArrayVAD);
                let sum = 0; dataArrayVAD.forEach(value => sum += value);
                const averageLevel = dataArrayVAD.length > 0 ? sum / dataArrayVAD.length / 255 : 0; // Normalized 0-1


                if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isWebSpeechListening.value) {
                    if (averageLevel > vadThreshold.value) {
                        if (!isRecording.value) {
                            stopWebSpeechRecognition(true);
                            startWhisperMediaRecorder();
                        }
                        if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId);
                        vadSilenceTimerId = window.setTimeout(() => {
                            if (isRecording.value) {
                                stopWhisperMediaRecorder();
                                if (isVoiceActivationMode.value && !isWebSpeechListening.value && permissionStatus.value === 'granted' && isMicrophoneActive.value) { // Check user's intent
                                    startWebSpeechRecognition();
                                }
                            }
                        }, vadSilenceTimeoutMs.value);
                    }
                }
                 if (vadCanvasRef.value && isVoiceActivationMode.value) { // Draw VAD if VAD mode is active
                    drawVADVisualization(/* dataArrayVAD */); // Pass data if drawVAD needs it directly
                }

            }, 100); // Monitor frequency
        };
        const stopAudioLevelMonitoring = () => {
            if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
            audioMonitoringInterval = null;
            if (vadCanvasRef.value) {
                const ctx = vadCanvasRef.value.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
            }
        };

        const initializeWebSpeech = (): boolean => {
            const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognitionAPI) {
                if (sttPreference.value === 'browser_webspeech_api') {
                    permissionMessage.value = 'Web Speech API is not supported by your browser.';
                    permissionStatus.value = 'error';
                    toast?.add({ type: 'error', title: 'Not Supported', message: permissionMessage.value });
                }
                return false;
            }
            if (recognition) return true;

            recognition = new SpeechRecognitionAPI() as SpeechRecognition; // Cast to ensure all properties are available

            recognition.lang = settings.speechLanguage || navigator.language || 'en-US';

            recognition.onstart = () => {
                isWebSpeechListening.value = true;
                if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) {
                    isRecording.value = true;
                    startRecordingTimer();
                }
                startAudioLevelMonitoring();
                emit('processing-audio', true);
            };

            recognition.onresult = (event: Event) => {
                const speechEvent = event as ISpeechRecognitionEvent; // Cast to our more specific type
                let interim = '';
                let finalPart = '';
                for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
                    const transcript = speechEvent.results.item(i)[0].transcript;
                    if (speechEvent.results.item(i).isFinal) {
                        finalPart += transcript + ' ';
                    } else {
                        interim += transcript;
                    }
                }
                // Use finalTranscriptWebSpeech for PTT and VAD accumulation
                if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) {
                    interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
                    if (finalPart.trim()) {
                        finalTranscriptWebSpeech.value += finalPart.trim() + ' ';
                        interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value; // Sync interim display
                    }
                } else if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
                    liveTranscriptWebSpeech.value = (liveTranscriptWebSpeech.value + interim).trim(); // Show interim as it comes for continuous
                    if (finalPart.trim()) {
                        liveTranscriptWebSpeech.value = (liveTranscriptWebSpeech.value.slice(0, -interim.length) + finalPart.trim()).trim(); // Replace interim with final
                        pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart.trim()).trim();
                        resetPauseDetectionWebSpeech();
                    }
                }
            };

            recognition.onerror = (event: Event) => {
                const errorEvent = event as ISpeechRecognitionErrorEvent;
                console.error('WebSpeech Error:', errorEvent.error, errorEvent.message);
                isWebSpeechListening.value = false;
                isRecording.value = false;
                clearRecordingTimer();
                stopAudioLevelMonitoring();
                emit('processing-audio', false);

                const errCode = errorEvent.error;
                if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
                    permissionStatus.value = 'denied'; permissionMessage.value = 'Microphone access denied by browser/OS.';
                } else if (errCode === 'no-speech') {
                    permissionMessage.value = 'No speech detected by browser.';
                    if (isPttMode.value) toast?.add({ type: 'info', title: 'No Speech', message: permissionMessage.value, duration: 2000 });
                } else if (errCode === 'network') {
                    permissionMessage.value = 'Network error for browser speech service.';
                } else if (errCode === 'aborted') {
                    permissionMessage.value = 'Browser speech input aborted.';
                } else {
                    permissionStatus.value = 'error'; permissionMessage.value = `Browser speech error: ${errCode}.`;
                }

                if (errCode !== 'no-speech' && errCode !== 'aborted' && errCode !== 'not-allowed' && errCode !== 'service-not-allowed') {
                    toast?.add({ type: 'error', title: 'Browser Speech Error', message: permissionMessage.value });
                }

                if ((isContinuousMode.value || isVoiceActivationMode.value) &&
                    (errCode !== 'not-allowed' && errCode !== 'service-not-allowed') &&
                     permissionStatus.value === 'granted' && isMicrophoneActive.value) {
                    setTimeout(() => {
                        if ((isContinuousMode.value || isVoiceActivationMode.value) && !isWebSpeechListening.value && isMicrophoneActive.value) {
                           startWebSpeechRecognition();
                        }
                    }, 1000);
                }
            };

            recognition.onend = () => {
                isWebSpeechListening.value = false;
                stopAudioLevelMonitoring();
                emit('processing-audio', false);

                if (isPttMode.value && sttPreference.value === 'browser_webspeech_api') {
                    if (finalTranscriptWebSpeech.value.trim()) {
                        sendTranscription(finalTranscriptWebSpeech.value.trim());
                    }
                    isRecording.value = false; // Explicitly stop PTT recording state
                    clearRecordingTimer();
                    cleanUpAfterWebSpeechTranscription();
                } else if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') {
                    if (finalTranscriptWebSpeech.value.trim()) { // VAD also uses finalTranscriptWebSpeech
                        sendTranscription(finalTranscriptWebSpeech.value.trim());
                    }
                    // For VAD, don't set isRecording to false here unless explicitly stopped by user
                    // It might restart if conditions are met
                     if (!isMicrophoneActive.value) { // If user toggled off mic button
                        isRecording.value = false;
                        clearRecordingTimer();
                     }
                     cleanUpAfterWebSpeechTranscription(); // Still cleanup transcript vars
                } else if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
                     if (!isMicrophoneActive.value) { // User toggled off mic button
                        isRecording.value = false; // This flag is more for PTT/VAD direct capture
                        clearRecordingTimer();
                        if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
                            sendPendingWebSpeechTranscription();
                        }
                     }
                } else {
                    isRecording.value = false;
                    clearRecordingTimer();
                }
            };

            if (sttPreference.value === 'whisper_api' && isVoiceActivationMode.value) {
                recognition.continuous = true;
                recognition.interimResults = false;
            } else {
                recognition.continuous = isContinuousMode.value;
                recognition.interimResults = true;
            }
            return true;
        };

        const startWebSpeechRecognition = async (): Promise<boolean> => {
            if (!recognition && !initializeWebSpeech()) return false;
            if (isWebSpeechListening.value) return true;

            if (permissionStatus.value !== 'granted') {
                const stream = await requestMicrophonePermissionsAndGetStream();
                if (!stream) return false;
            }
             if (!activeStream && permissionStatus.value === 'granted') {
                 const stream = await requestMicrophonePermissionsAndGetStream();
                if (!stream) return false;
            }
            if (!recognition) return false; // Guard against null recognition

            finalTranscriptWebSpeech.value = '';
            interimTranscriptWebSpeech.value = '';
            // liveTranscriptWebSpeech & pendingTranscriptWebSpeech are managed by onresult for continuous

            recognition.lang = settings.speechLanguage || navigator.language || 'en-US';
            if (sttPreference.value === 'whisper_api' && isVoiceActivationMode.value) {
                recognition.continuous = true; recognition.interimResults = false;
            } else {
                recognition.continuous = isContinuousMode.value; recognition.interimResults = true;
            }

            try {
                recognition.start();
                return true;
            } catch (e: any) {
                console.error("Error starting WebSpeech:", e);
                permissionMessage.value = `Could not start speech: ${e.message || e.name}`;
                if (e.name === 'InvalidStateError' && isWebSpeechListening.value) {
                    // It's already listening, this is fine.
                    return true;
                }
                permissionStatus.value = 'error';
                isWebSpeechListening.value = false;
                return false;
            }
        };

        const stopWebSpeechRecognition = (abort = false) => {
            if (recognition && isWebSpeechListening.value) {
                try {
                    if (abort) recognition.abort(); else recognition.stop();
                } catch (e) {
                    console.warn("Error stopping/aborting WebSpeech:", e);
                    isWebSpeechListening.value = false; // Force state update
                }
            } else {
              isWebSpeechListening.value = false;
            }
        };

        const startWhisperMediaRecorder = async (): Promise<boolean> => {
            if (isRecording.value) return true; // Already recording (for Whisper)
            if ((!activeStream || !activeStream.active) && !(await requestMicrophonePermissionsAndGetStream())) return false;
            if (!activeStream) {
                toast?.add({type: 'error', title: 'Stream Error', message: 'Microphone stream not available for Whisper.'});
                return false;
            }
             if (!audioContext || !analyser) {
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphoneSourceNode = audioContext.createMediaStreamSource(activeStream);
                analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.6;
                microphoneSourceNode.connect(analyser);
            }

            audioChunks = [];
            const options = { mimeType: 'audio/webm;codecs=opus' };
            try {
                mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType)
                    ? new MediaRecorder(activeStream, options)
                    : new MediaRecorder(activeStream);
            } catch (e) {
                console.error("Failed to initialize MediaRecorder:", e);
                toast?.add({ type: 'error', title: 'Recording Error', message: 'Failed to initialize audio recorder for Whisper.' });
                return false;
            }

            mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunks.push(event.data); };
            mediaRecorder.onstop = async () => {
                emit('processing-audio', false);
                const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
                audioChunks = [];
                isRecording.value = false; // This is key for Whisper's recording state
                clearRecordingTimer();

                if (audioBlob.size > 1000) {
                    emit('processing-audio', true); // Processing the API call now
                    await transcribeWithWhisper(audioBlob);
                    emit('processing-audio', false); // Finished API call
                } else if (isPttMode.value || (isVoiceActivationMode.value && !isWebSpeechListening.value)) {
                    toast?.add({ type: 'warning', title: 'No Meaningful Audio', message: 'Little audio recorded for Whisper.', duration: 2000 });
                }

                if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' &&
                    !isWebSpeechListening.value && permissionStatus.value === 'granted' && settings.audioInputMode === 'voice-activation' /*Check intended mode*/) {
                    startWebSpeechRecognition(); // Restart VAD listener
                } else if (!isMicrophoneActive.value) { // Mic button toggled off
                     stopWebSpeechRecognition(true);
                }
            };
            mediaRecorder.onerror = (event: Event) => { /* ... (same) ... */
                console.error('MediaRecorder Error:', event);
                toast?.add({ type: 'error', title: 'Recording Error', message: 'An error occurred with the audio recorder.' });
                isRecording.value = false; clearRecordingTimer(); emit('processing-audio', false);
            };

            mediaRecorder.start( (isContinuousMode.value || isVoiceActivationMode.value) && sttPreference.value === 'whisper_api' ? 5000 : undefined ); // Chunk Whisper for Cont/VAD
            isRecording.value = true; // Whisper is now recording
            startRecordingTimer();
            startAudioLevelMonitoring();
            emit('processing-audio', true);
            return true;
        };

        const stopWhisperMediaRecorder = () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop(); // onstop will set isRecording = false
            } else {
                isRecording.value = false; // Ensure state is false
                clearRecordingTimer();
                emit('processing-audio', false);
            }
        };

        const transcribeWithWhisper = async (audioBlob: Blob) => {
            // Check props.isProcessing if it's a global lock; otherwise, local lock is isRecording
            // For now, assume props.isProcessing is the global lock
            if (props.isProcessing && !isRecording.value) {
                toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.', duration: 2000 });
                return;
            }
            try {
                const formData = new FormData();
                formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);
                if (settings.speechLanguage) formData.append('language', settings.speechLanguage.substring(0, 2));

                const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;
                if (response.data.transcription) {
                    sendTranscription(response.data.transcription);
                } else { throw new Error(response.data.message || 'Empty transcription returned from API.'); }
            } catch (error: any) {
                console.error("Whisper API Error:", error);
                toast?.add({ type: 'error', title: 'Transcription Failed', message: error.response?.data?.message || error.message || 'Whisper API error.'});
            }
        };

        const startAudioCapture = async () => {
            if (props.isProcessing || isMicrophoneActive.value) return;
            if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return;

            if (sttPreference.value === 'browser_webspeech_api') {
                await startWebSpeechRecognition();
            } else if (sttPreference.value === 'whisper_api') {
                if (isContinuousMode.value || isVoiceActivationMode.value) {
                    await startWebSpeechRecognition(); // For VAD monitoring via AnalyserNode
                } else { // PTT for Whisper
                    await startWhisperMediaRecorder();
                }
            }
        };

        const stopAudioCapture = (abortWebSpeechIfContinuousOrVAD = false) => {
            if (sttPreference.value === 'browser_webspeech_api') {
                stopWebSpeechRecognition( (isContinuousMode.value || isVoiceActivationMode.value) ? abortWebSpeechIfContinuousOrVAD : false );
            } else { // Whisper API
                if (isRecording.value) stopWhisperMediaRecorder();
                if (isWebSpeechListening.value) stopWebSpeechRecognition(true); // Always abort VAD listener
            }
            clearRecordingTimer();
            clearPauseTimerWebSpeech();
            pauseDetectedWebSpeech.value = false;
            stopAudioLevelMonitoring();

            if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
                sendPendingWebSpeechTranscription();
            }
        };

        const toggleRecording = async () => {
            if (props.isProcessing) return;
            if (isMicrophoneActive.value) {
                stopAudioCapture(true);
            } else {
                if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) {
                   toast?.add({ type: 'error', title: 'Mic Access Denied', message: permissionMessage.value || 'Could not access microphone.' });
                   return;
                }
                await startAudioCapture();
            }
        };

        const handleTextSubmit = () => {
            if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) {
                sendTranscription(textInput.value.trim());
                textInput.value = '';
                nextTick(() => handleTextareaInput());
            }
        };

        const sendTranscription = (text: string) => {
            if (text.trim()) {
                emit('transcription', text.trim());
                const newHistoryItem: TranscriptionHistoryItem = { /* ... */ id: `${Date.now()}-${Math.random()}`, text: text.trim(), timestamp: Date.now(), sent: true };
                const updatedHistory = [newHistoryItem, ...transcriptionHistory.value];
                transcriptionHistory.value = updatedHistory.slice(0, 15); // Keep more history
                // Removed toast for sent transcription, can be added back if desired
            }
        };
        const resendTranscription = (item: TranscriptionHistoryItem) => { /* ... */ sendTranscription(item.text); /* ... update history ... */ };

        const sendPendingWebSpeechTranscription = () => {
            if (pendingTranscriptWebSpeech.value.trim()) sendTranscription(pendingTranscriptWebSpeech.value.trim());
            clearPendingWebSpeechTranscription();
        };
        const clearPendingWebSpeechTranscription = () => {
            pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';
            clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
        };
        const showEditModal = ref(false);
        const editingTranscription = ref('');
        const editPendingTranscription = () => { /* ... */ if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()){ editingTranscription.value = pendingTranscriptWebSpeech.value; showEditModal.value = true; nextTick(() => editModalTextareaRef.value?.focus());}};
        const saveEdit = () => { /* ... */ if(editingTranscription.value.trim()){ pendingTranscriptWebSpeech.value = editingTranscription.value.trim(); sendPendingWebSpeechTranscription();} showEditModal.value = false; editingTranscription.value = '';};
        const cancelEdit = () => { /* ... */ showEditModal.value = false; editingTranscription.value = '';};

        const resetPauseDetectionWebSpeech = () => { /* ... (same logic, check conditions carefully) ... */
            clearPauseTimerWebSpeech();
            pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;

            if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' &&
                pendingTranscriptWebSpeech.value.trim() &&
                isWebSpeechListening.value && continuousModeAutoSend.value) {
                pauseTimerIdWebSpeech = window.setTimeout(() => {
                    if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value &&
                        continuousModeAutoSend.value && isContinuousMode.value) {
                        pauseDetectedWebSpeech.value = true;
                        pauseCountdownWebSpeech.value = continuousModePauseTimeoutMs.value;
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
                                pauseDetectedWebSpeech.value = false;
                            }
                        }, 100);
                    }
                }, 1000); // Increased delay before considering it a pause
            }
        };
        const startRecordingTimer = () => { /* ... */ clearRecordingTimer(); recordingSeconds.value = 0; recordingTimerId = window.setInterval(()=>{ recordingSeconds.value += 0.1; if((isPttMode.value || (isVoiceActivationMode.value && isRecording.value)) && recordingSeconds.value >= 60){ toast?.add({type:'info', title:'Recording Limit', message:'Max recording (60s) reached.'}); stopAudioCapture(sttPreference.value === 'browser_webspeech_api'); }}, 100);};
        const clearRecordingTimer = () => { /* ... */ if(recordingTimerId !== null) clearInterval(recordingTimerId); recordingTimerId = null; recordingSeconds.value = 0;};
        const clearPauseTimerWebSpeech = () => { /* ... */ if(pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech); pauseTimerIdWebSpeech = null;};
        const cleanUpAfterWebSpeechTranscription = () => { /* ... */ interimTranscriptWebSpeech.value=''; finalTranscriptWebSpeech.value=''; liveTranscriptWebSpeech.value=''; clearRecordingTimer();};

        const stopAllAudioProcessing = (abortWebSpeech = true) => { /* ... (more robust cleanup) ... */
            if (recognition) { try { if (isWebSpeechListening.value) { if (abortWebSpeech) recognition.abort(); else recognition.stop(); } } catch (e) { console.warn('Err stopAll/WebSpeech:', e); } }
            isWebSpeechListening.value = false;
            if (mediaRecorder && mediaRecorder.state === 'recording') { try { mediaRecorder.stop(); } catch (e) { console.warn('Err stopAll/MediaRec:', e); } }
            isRecording.value = false; // Ensure both recording flags are reset
            if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
            if (audioContext && audioContext.state !== 'closed') { audioContext.close().catch(e=>console.warn('Err stopAll/AudioCtx:',e)); audioContext = null; }
            microphoneSourceNode = null; analyser = null;
            stopAudioLevelMonitoring(); cleanUpAfterWebSpeechTranscription();
            clearPauseTimerWebSpeech(); if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId); vadSilenceTimerId = null;
            pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
            emit('processing-audio', false);
        };

        onMounted(async () => {
            document.addEventListener('click', handleClickOutsideAudioModeDropdown, true);
            if (typeof window !== 'undefined') initializeWebSpeech();

            if (navigator.permissions) {
                try {
                    const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                    permissionStatus.value = perm.state; emit('permission-update', perm.state);
                    if (perm.state === 'granted') {
                        permissionMessage.value = '';
                        if ((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isMicrophoneActive.value) {
                           await startAudioCapture();
                        }
                    } else if (perm.state === 'prompt') permissionMessage.value = 'Click mic icon for access.';
                    else permissionMessage.value = 'Mic access denied by browser.';

                    perm.onchange = () => { /* ... (same, ensure startAudioCapture called if now granted and mode requires it) ... */
                        permissionStatus.value = perm.state; emit('permission-update', perm.state);
                        if(perm.state === 'granted'){ permissionMessage.value = 'Mic ready.'; if((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isMicrophoneActive.value) startAudioCapture(); }
                        else if (perm.state === 'denied'){ permissionMessage.value = 'Mic access denied.'; if(isMicrophoneActive.value) stopAllAudioProcessing(); }
                        else { permissionMessage.value = 'Mic access requires action.'; if(isMicrophoneActive.value) stopAllAudioProcessing(); }
                    };
                } catch (e) { /* ... */ console.warn("Perm query error:", e); permissionStatus.value = 'error'; permissionMessage.value='Cannot query mic permission.'; emit('permission-update', 'error');}
                finally { micAccessInitiallyChecked.value = true; }
            } else { /* ... */ micAccessInitiallyChecked.value = true; permissionMessage.value = 'Perm API not supported.';}
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutsideAudioModeDropdown, true);
            stopAllAudioProcessing();
            if (navigator.permissions) { navigator.permissions.query({ name: 'microphone' as PermissionName }).then(p => p.onchange = null).catch(console.warn); }
            if (recognition) { recognition.onstart=null; recognition.onresult=null; recognition.onerror=null; recognition.onend=null; recognition=null; }
            if (mediaRecorder) { mediaRecorder.ondataavailable=null; mediaRecorder.onstop=null; mediaRecorder.onerror=null; mediaRecorder=null; }
        });

        // Watchers
        watch(() => settings.audioInputMode, (newMode, oldMode) => {
            if (newMode === oldMode) return;
            stopAllAudioProcessing(true);
            liveTranscriptWebSpeech.value = ''; pendingTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';
            if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
                nextTick(async () => {
                    if (settings.audioInputMode === newMode && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
                       await startAudioCapture();
                    }
                });
            }
        });
        watch(() => settings.sttPreference, (newPref, oldPref) => {
            if (newPref === oldPref) return;
            stopAllAudioProcessing(true);
            if (newPref === 'browser_webspeech_api' && typeof window !== 'undefined' && !recognition) initializeWebSpeech();
            if ((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && permissionStatus.value === 'granted') {
                 nextTick(async () => {
                    if (settings.sttPreference === newPref && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
                       await startAudioCapture();
                    }
                });
            }
        });
        watch(selectedAudioDeviceId, (newVal, oldVal) => {
            if (newVal !== oldVal && isMicrophoneActive.value) {
                stopAllAudioProcessing(true);
                nextTick(async () => {
                    if (permissionStatus.value === 'granted') await startAudioCapture();
                });
            }
        });
        watch(() => settings.speechLanguage, (newLang) => {
            if (recognition) {
                recognition.lang = newLang || navigator.language || 'en-US';
                if (isWebSpeechListening.value) {
                    stopWebSpeechRecognition(true);
                    nextTick(async () => {
                        if (isMicrophoneActive.value && permissionStatus.value === 'granted') await startWebSpeechRecognition();
                    });
                }
            }
        });


        return {
            props, textInput, textareaRef, vadCanvasRef, editModalTextareaRef,
            isRecording, isWebSpeechListening, permissionStatus, permissionMessage, micAccessInitiallyChecked,
            interimTranscriptWebSpeech, liveTranscriptWebSpeech, pendingTranscriptWebSpeech,
            transcriptionHistory, showTranscriptionHistory, recordingSeconds,
            pauseDetectedWebSpeech, pauseCountdownWebSpeech,
            showEditModal, editingTranscription, settings,
            isMicrophoneActive, isPttMode, isContinuousMode, isVoiceActivationMode,
            getButtonTitle, getPlaceholderText, getModeIndicatorClass, getRecordingStatusText, getIdleStatusText,
            formatTime, formatDuration,
            toggleRecording, handleTextareaInput, handleTextSubmit,
            sendPendingWebSpeechTranscription, clearPendingWebSpeechTranscription,
            editPendingTranscription, saveEdit, cancelEdit, resendTranscription,
            startAudioCapture, stopAudioCapture,
            sttPreference,
            showAudioModeDropdown, audioModeDropdownRef, audioModeOptions,
            toggleAudioModeDropdown, selectAudioMode,
            currentAudioModeLabel, currentAudioModeIcon,
            // Icons for template
            PaperAirplaneIcon, ClockIcon, XMarkIcon, PencilIcon, TrashIcon, StopCircleIcon, MicrophoneIcon,
            CloudArrowUpIcon,
        };
    },
});
</script>

<style lang="scss">
// No SCSS needed here if all styles are in the global _voice-input.scss
// Styles for VoiceInput are in frontend/src/styles/components/_voice-input.scss
</style>