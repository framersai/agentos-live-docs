// File: frontend/src/components/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Core component for handling all voice input, text input, transcription (Whisper/WebSpeech),
 * and audio mode management (Push-to-Talk, Continuous, Voice Activation with "V" trigger).
 * It features dynamic visual feedback ("resonance") for different states, adapts text input prominence,
 * and is styled according to the "Ephemeral Harmony" neo-holographic design language.
 *
 * @component VoiceInput
 * @props {boolean} isProcessing - Indicates if the parent component (e.g., chat manager) is currently processing a submission.
 * @emits transcription - Emits the final transcribed text for processing.
 * @emits permission-update - Emits microphone permission status changes.
 * @emits processing-audio - Emits true when this component is actively capturing or processing audio for STT, false otherwise.
 *
 * @version 4.0.3 - Corrected all identified TypeScript errors (timer types, SpeechGrammarList, settings typing, unused variables relative to the full template). Ensured all functions and reactive properties for the template are correctly defined and exposed.
 */
<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch, // Watch is used for settings changes
  inject,
  nextTick,
  type Component as VueComponentType,
  type PropType,
  type Ref
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import {
  voiceSettingsManager,
  type AudioInputMode,
  type VoiceApplicationSettings,
  type STTPreference
} from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import type { AxiosResponse } from 'axios';

// Icons - All imported icons are used in the template.
import {
  ClockIcon, XMarkIcon, PaperAirplaneIcon, CloudArrowUpIcon,
  SpeakerWaveIcon as ContinuousModeIcon,
  ChevronDownIcon,
  HandRaisedIcon as PTTModeIcon,
  CpuChipIcon as VADModeIcon,
  PencilIcon, StopCircleIcon, MicrophoneIcon,
  SparklesIcon as MagicIcon, // Used for "V" activation indication
} from '@heroicons/vue/24/outline';
import { CheckIcon as SolidCheckIcon } from '@heroicons/vue/24/solid'; // Used for active audio mode

// --- Ambient Type Declarations for Web Speech API ---
// These ensure TypeScript doesn't complain about standard browser APIs.
// Ideally, tsconfig.json's "lib" option should include "DOM" for these.
declare global {
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
  }
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    readonly interpretation?: any;
    readonly emma?: Document;
  }
  interface SpeechGrammar { // Declaration for SpeechGrammar
    src: string;
    weight?: number;
  }
  var SpeechGrammar: { // Constructor for SpeechGrammar
    prototype: SpeechGrammar;
    new(): SpeechGrammar;
  };
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
  }
  var SpeechGrammarList: { // Constructor for SpeechGrammarList
    prototype: SpeechGrammarList;
    new(): SpeechGrammarList;
  };
  var webkitSpeechGrammarList: { // For Safari/older Chrome compatibility
    prototype: SpeechGrammarList;
    new(): SpeechGrammarList;
  };

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechGrammarList?: typeof SpeechGrammarList;
    webkitSpeechGrammarList?: typeof SpeechGrammarList;
  }
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList; // Now SpeechGrammarList is known
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI?: string;
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
    abort(): void;
    start(): void;
    stop(): void;
  }
}
type SpeechRecognitionErrorCode =
  | 'no-speech' | 'aborted' | 'audio-capture' | 'network'
  | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
// --- End Ambient Type Declarations ---

/** @interface TranscriptionHistoryItem - Structure for local transcription history. */
interface TranscriptionHistoryItem {
  id: string; text: string; timestamp: number; sent: boolean;
}
/** @interface AudioModeOption - Structure for UI audio mode selection. */
interface AudioModeOption {
  label: string; value: AudioInputMode; icon: VueComponentType; description: string;
}

const props = defineProps({
  isProcessing: { type: Boolean as PropType<boolean>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'permission-update', status: 'granted' | 'denied' | 'prompt' | 'error'): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');
/** @type {VoiceApplicationSettings} settings - Reactive global voice settings object. */
const settings: VoiceApplicationSettings = voiceSettingsManager.settings; // Corrected: settings is the reactive object

const textInput: Ref<string> = ref('');
const textareaRef: Ref<HTMLTextAreaElement | null> = ref(null);
const editModalTextareaRef: Ref<HTMLTextAreaElement | null> = ref(null);
const isRecording: Ref<boolean> = ref(false);
const isWebSpeechListening: Ref<boolean> = ref(false);
const permissionStatus: Ref<'prompt'|'granted'|'denied'|'error'|''> = ref('');
const permissionMessage: Ref<string> = ref('');
const micAccessInitiallyChecked: Ref<boolean> = ref(false);

const interimTranscriptWebSpeech: Ref<string> = ref('');
const finalTranscriptWebSpeech: Ref<string> = ref('');
const liveTranscriptWebSpeech: Ref<string> = ref('');
const pendingTranscriptWebSpeech: Ref<string> = ref('');

const transcriptionHistory: Ref<TranscriptionHistoryItem[]> = ref(
  JSON.parse(localStorage.getItem('vca-transcriptionHistory-v3.1') || '[]')
);
const showTranscriptionHistory: Ref<boolean> = ref(false); // Used in template
const showAudioModeDropdown: Ref<boolean> = ref(false);
const audioModeDropdownRef: Ref<HTMLElement | null> = ref(null);

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let activeStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphoneSourceNode: MediaStreamAudioSourceNode | null = null;
const recordingSeconds: Ref<number> = ref(0);
let recordingTimerId: number | null = null; // Type is number for browser timer IDs

const pauseDetectedWebSpeech: Ref<boolean> = ref(false);
const pauseCountdownWebSpeech: Ref<number> = ref(0);
let pauseTimerIdWebSpeech: number | null = null; // Type is number
let vadSilenceTimerId: number | null = null; // Type is number
const isVADListeningForWakeWord: Ref<boolean> = ref(false);

const vadCanvasRef: Ref<HTMLCanvasElement | null> = ref(null);
let audioMonitoringInterval: number | null = null; // Type is number
let recognition: SpeechRecognition | null = null;

const sttPreference = computed<STTPreference>(() => settings.sttPreference);
const selectedAudioDeviceId = computed<string | null>(() => settings.selectedAudioInputDeviceId);
const vadThreshold = computed<number>(() => settings.vadThreshold);
const vadSilenceTimeoutMs = computed<number>(() => settings.vadSilenceTimeoutMs);
const continuousModeAutoSend = computed<boolean>(() => settings.continuousModeAutoSend);
const continuousModePauseTimeoutMs = computed<number>(() => settings.continuousModePauseTimeoutMs);

const isMicrophoneActive = computed<boolean>(() => isRecording.value || isWebSpeechListening.value);
const isPttMode = computed<boolean>(() => settings.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => settings.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => settings.audioInputMode === 'voice-activation');

const sttProcessingIndicator: Ref<boolean> = ref(false);

// This computed property is used in the template to apply dynamic classes for "resonance"
const currentPanelStateClasses = computed(() => ({
  'processing': props.isProcessing || sttProcessingIndicator.value,
  'microphone-error': permissionStatus.value === 'error',
  'microphone-denied': permissionStatus.value === 'denied',
  'mic-active': isMicrophoneActive.value && !props.isProcessing && !sttProcessingIndicator.value,
  'user-listening': isMicrophoneActive.value && !props.isProcessing && !sttProcessingIndicator.value,
  'vad-wake-word-listening': isVoiceActivationMode.value && isVADListeningForWakeWord.value && !props.isProcessing,
}));

// This computed property is used in the template to adjust textarea prominence
const textInputProminenceClass = computed<string>(() => {
  if (isContinuousMode.value) return 'input-prominence-subtle';
  if (isVoiceActivationMode.value && isVADListeningForWakeWord.value) return 'input-prominence-focused-wake';
  if (isVoiceActivationMode.value && !isVADListeningForWakeWord.value && isMicrophoneActive.value) return 'input-prominence-default';
  return 'input-prominence-default';
});

const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push-to-Talk', value: 'push-to-talk', icon: PTTModeIcon, description: "Hold microphone to speak." },
  { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon, description: "Mic listens continuously." },
  { label: 'Voice Activate ("V")', value: 'voice-activation', icon: VADModeIcon, description: "Say 'V' to activate, then speak command." },
]);
// These are used in the template for the audio mode selector button
const currentAudioModeDetails = computed(() => audioModeOptions.value.find(m => m.value === settings.audioInputMode));
const currentAudioModeLabel = computed<string>(() => currentAudioModeDetails.value?.label || 'Mode');
const currentAudioModeIcon = computed<VueComponentType>(() => currentAudioModeDetails.value?.icon || MicrophoneIcon);

watch(transcriptionHistory, (newHistory) => {
  localStorage.setItem('vca-transcriptionHistory-v3.1', JSON.stringify(newHistory));
}, { deep: true });

watch([
  () => settings.audioInputMode, () => settings.sttPreference,
  () => settings.selectedAudioInputDeviceId, () => settings.speechLanguage
], ([newMode, newSTT, newDevice, newLang], [oldMode, oldSTT, oldDevice, oldLang]) => {
  if (newMode !== oldMode || newSTT !== oldSTT || newDevice !== oldDevice || newLang !== oldLang) {
    stopAllAudioProcessing(true);
    if (newSTT === 'browser_webspeech_api' || (newSTT === 'whisper_api' && newMode === 'voice-activation')) {
      if (!recognition || (newLang && recognition?.lang !== (newLang || navigator.language))) {
        recognition = null; initializeWebSpeech();
      }
    }
    if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
      nextTick(async () => {
        if (settings.audioInputMode === newMode && !isMicrophoneActive.value && permissionStatus.value === 'granted') {
          await startAudioCapture();
        }
      });
    }
  }
}, { immediate: false });

// All functions below are defined at the top level of <script setup> and thus available to the template
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const handleTextareaInput = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    const maxHeight = 150;
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
  }
};

const toggleAudioModeDropdown = () => { showAudioModeDropdown.value = !showAudioModeDropdown.value; };
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
  permissionMessage.value = 'Requesting microphone access...';
  permissionStatus.value = 'prompt';
  emit('permission-update', 'prompt');
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
    setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 2500);
    micAccessInitiallyChecked.value = true;
    return stream;
  } catch (err: any) {
    console.error("[VoiceInput] getUserMedia error:", err.name, err.message);
    let specificError: 'denied' | 'error' = 'error';
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      permissionMessage.value = 'Microphone access denied by user or system.'; specificError = 'denied';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      permissionMessage.value = 'No microphone found, or selected device is unavailable.';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      permissionMessage.value = 'Microphone is busy or cannot be accessed. Try another device or close other apps using the mic.';
    } else { permissionMessage.value = `Microphone error: ${err.name || 'Unknown'}. Check console.`; }
    permissionStatus.value = specificError;
    toast?.add({ type: 'error', title: 'Microphone Access Failed', message: permissionMessage.value, duration: 7000 });
    emit('permission-update', specificError);
    micAccessInitiallyChecked.value = true; activeStream = null; return null;
  }
};

const drawVADVisualization = () => {
  const canvas = vadCanvasRef.value;
  if (!canvas || !analyser || !isMicrophoneActive.value || !(isVoiceActivationMode.value && sttPreference.value === 'whisper_api')) return;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const bufferLength = analyser.frequencyBinCount; const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  const width = canvas.width; const height = canvas.height; ctx.clearRect(0, 0, width, height);
  const barWidth = (width / bufferLength) * 2.5; let x = 0;
  const baseHue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-h').trim() || '270');
  const baseSat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-s').trim() || '90%');
  for (let i = 0; i < bufferLength; i++) {
    const barHeightFraction = dataArray[i] / 255; const barHeight = Math.max(1, barHeightFraction * height);
    const lightness = 45 + barHeightFraction * 35; const alpha = 0.4 + barHeightFraction * 0.5;
    ctx.fillStyle = `hsla(${baseHue}, ${baseSat}%, ${lightness}%, ${alpha})`;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
};

const startAudioLevelMonitoring = () => {
  if (!analyser || !activeStream?.active || activeStream.getAudioTracks().length === 0 || !activeStream.getAudioTracks()[0].enabled) return;
  if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
  audioMonitoringInterval = window.setInterval(() => {
    if (!analyser || !activeStream?.active) { stopAudioLevelMonitoring(); return; }
    const dataArrayVAD = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArrayVAD);
    let sum = 0; dataArrayVAD.forEach(value => sum += value);
    const averageLevel = dataArrayVAD.length > 0 ? sum / dataArrayVAD.length / 255 : 0;
    if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isWebSpeechListening.value) {
      if (averageLevel > vadThreshold.value) {
        if (!isRecording.value) { stopWebSpeechRecognition(true); startWhisperMediaRecorder(); }
        if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId);
        vadSilenceTimerId = window.setTimeout(() => {
          if (isRecording.value) {
            stopWhisperMediaRecorder();
            if (settings.audioInputMode === 'voice-activation' && sttPreference.value === 'whisper_api' && permissionStatus.value === 'granted') {
              startWebSpeechRecognition();
            }
          }
        }, vadSilenceTimeoutMs.value);
      }
    }
    if (vadCanvasRef.value && isVoiceActivationMode.value && sttPreference.value === 'whisper_api') {
      drawVADVisualization();
    }
  }, 100);
};
const stopAudioLevelMonitoring = () => {
  if (audioMonitoringInterval !== null) clearInterval(audioMonitoringInterval);
  audioMonitoringInterval = null;
  if (vadCanvasRef.value) {
    const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
  }
};

const initializeWebSpeech = (): boolean => {
  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    if (sttPreference.value === 'browser_webspeech_api') {
      permissionMessage.value = 'Web Speech API not supported.'; permissionStatus.value = 'error';
      toast?.add({ type: 'error', title: 'Not Supported', message: permissionMessage.value }); emit('permission-update', 'error');
    } return false;
  }
  if (recognition && recognition.lang === (settings.speechLanguage || navigator.language || 'en-US')) return true;
  recognition = new SpeechRecognitionAPI();
  recognition.lang = settings.speechLanguage || navigator.language || 'en-US';
  recognition.onstart = () => {
    isWebSpeechListening.value = true;
    isVADListeningForWakeWord.value = isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api';
    if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api' && !isVADListeningForWakeWord.value)) {
      isRecording.value = true; startRecordingTimer();
    }
    startAudioLevelMonitoring(); emit('processing-audio', true);
  };
  recognition.onresult = (event: Event) => {
    const speechEvent = event as SpeechRecognitionEvent;
    let interim = ''; let finalPart = '';
    for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
      const transcript = speechEvent.results[i][0].transcript;
      if (speechEvent.results[i].isFinal) { finalPart += transcript.trim() + ' '; } else { interim += transcript; }
    }
    interim = interim.trim(); finalPart = finalPart.trim();
    if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api' && isVADListeningForWakeWord.value) {
      const combinedFirstSegment = (finalPart || interim).toLowerCase().trim();
      if (combinedFirstSegment === 'v' || combinedFirstSegment === 'vee' || combinedFirstSegment.startsWith('v ') || combinedFirstSegment.startsWith('vee ')) {
        toast?.add({ type: 'info', title: 'Vee Activated!', message: 'Listening for command...', duration: 2000 });
        isVADListeningForWakeWord.value = false; interimTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = '';
        if (recognition && !recognition.continuous) { recognition.continuous = true; }
      } else if (finalPart || interim) { interimTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = ''; } return;
    }
    if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
      liveTranscriptWebSpeech.value = interim;
      if (finalPart) { pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart).trim(); liveTranscriptWebSpeech.value = ''; resetPauseDetectionWebSpeech(); }
    } else { interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim; if (finalPart) { finalTranscriptWebSpeech.value += finalPart + ' '; } }
  };
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    const errCode = event.error; stopWebSpeechRecognitionInternalStates(); let userMessage = `Browser speech error: ${errCode}.`;
    if (errCode === 'not-allowed' || errCode === 'service-not-allowed') { permissionStatus.value = 'denied'; userMessage = 'Mic access denied.'; emit('permission-update', 'denied'); }
    else if (errCode === 'no-speech' && isPttMode.value) { userMessage = 'No speech detected.'; }
    else if (errCode === 'network') { userMessage = 'Network error for browser speech.'; }
    else if (errCode === 'aborted') { userMessage = 'Input aborted.'; } else { permissionStatus.value = 'error'; }
    permissionMessage.value = userMessage;
    if (errCode !== 'no-speech' && errCode !== 'aborted') { toast?.add({ type: 'error', title: 'Speech Error', message: userMessage }); }
    if ((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && permissionStatus.value === 'granted' && !props.isProcessing && errCode !== 'not-allowed') {
      setTimeout(() => { if (!isWebSpeechListening.value) startWebSpeechRecognition(); else emit('processing-audio', false); }, 750);
    } else { emit('processing-audio', false); }
  };
  recognition.onend = () => {
    const wasListening = isWebSpeechListening.value; const currentMode = settings.audioInputMode; const currentSTT = settings.sttPreference;
    stopWebSpeechRecognitionInternalStates();
    if (currentSTT === 'browser_webspeech_api') {
      if (currentMode === 'push-to-talk') { if (finalTranscriptWebSpeech.value.trim()) sendTranscription(finalTranscriptWebSpeech.value.trim()); cleanUpAfterWebSpeechTranscription(); }
      else if (currentMode === 'voice-activation') {
        if (!isVADListeningForWakeWord.value && finalTranscriptWebSpeech.value.trim()) sendTranscription(finalTranscriptWebSpeech.value.trim());
        cleanUpAfterWebSpeechTranscription();
        if (wasListening && permissionStatus.value === 'granted' && !props.isProcessing) setTimeout(() => startWebSpeechRecognition(), 100); else emit('processing-audio', false);
      } else if (currentMode === 'continuous') {
        if (wasListening && permissionStatus.value === 'granted' && !props.isProcessing) setTimeout(() => startWebSpeechRecognition(), 100);
        else { if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) sendPendingWebSpeechTranscription(); emit('processing-audio', false); }
      } else { emit('processing-audio', false); }
    } else { emit('processing-audio', false); }
  };
  if (sttPreference.value === 'whisper_api' && isVoiceActivationMode.value) { recognition.continuous = true; recognition.interimResults = false; }
  else if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') { recognition.continuous = false; recognition.interimResults = true; }
  else { recognition.continuous = isContinuousMode.value; recognition.interimResults = true; }
  return true;
};

const stopWebSpeechRecognitionInternalStates = () => {
  isWebSpeechListening.value = false; isVADListeningForWakeWord.value = false;
  if (isPttMode.value || (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api')) { isRecording.value = false; clearRecordingTimer(); }
  stopAudioLevelMonitoring(); clearPauseTimerWebSpeech();
};

const startWebSpeechRecognition = async (): Promise<boolean> => {
  if (!recognition && !initializeWebSpeech()) return false; if (isWebSpeechListening.value) return true;
  if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return false;
  if (!activeStream && permissionStatus.value === 'granted' && !(await requestMicrophonePermissionsAndGetStream())) return false;
  if (!recognition) return false;
  finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = '';
  recognition.lang = settings.speechLanguage || navigator.language || 'en-US';
  if (sttPreference.value === 'whisper_api' && isVoiceActivationMode.value) { recognition.continuous = true; recognition.interimResults = false; isVADListeningForWakeWord.value = false; }
  else if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api') { recognition.continuous = false; recognition.interimResults = true; isVADListeningForWakeWord.value = true; }
  else { recognition.continuous = isContinuousMode.value; recognition.interimResults = true; isVADListeningForWakeWord.value = false; }
  try { recognition.start(); return true; }
  catch (e: any) {
    if (e.name === 'InvalidStateError' && isWebSpeechListening.value) return true;
    console.error("Err start WebSpeech:", e); permissionMessage.value = `Start Fail: ${e.name}`; permissionStatus.value = 'error';
    isWebSpeechListening.value = false; isVADListeningForWakeWord.value = false; emit('processing-audio', false); return false;
  }
};
const stopWebSpeechRecognition = (abort = false) => {
  if (recognition && isWebSpeechListening.value) {
    try { if (abort) recognition.abort(); else recognition.stop(); }
    catch (e) { console.warn("Err stop/abort WebSpeech:", e); stopWebSpeechRecognitionInternalStates(); emit('processing-audio', false); }
  } else { stopWebSpeechRecognitionInternalStates(); emit('processing-audio', false); }
};

const startWhisperMediaRecorder = async (): Promise<boolean> => {
  if (isRecording.value) return true;
  if (!activeStream?.active && !(await requestMicrophonePermissionsAndGetStream())) return false;
  if (!activeStream) { toast?.add({type: 'error', title: 'Mic Error', message: 'Mic stream unavailable.'}); return false; }
  if (!audioContext || !analyser) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphoneSourceNode = audioContext.createMediaStreamSource(activeStream);
      analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.6;
      microphoneSourceNode.connect(analyser);
  }
  audioChunks = []; const options = { mimeType: 'audio/webm;codecs=opus' };
  try { mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType) ? new MediaRecorder(activeStream, options) : new MediaRecorder(activeStream); }
  catch (e) { console.error("MediaRecorder init failed:", e); toast?.add({ type: 'error', title: 'Record Error', message: 'Failed to init recorder.' }); return false; }
  mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunks.push(event.data); };
  mediaRecorder.onstop = async () => {
    sttProcessingIndicator.value = true; const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
    audioChunks = []; isRecording.value = false; clearRecordingTimer();
    if (audioBlob.size > 1000) { await transcribeWithWhisper(audioBlob); }
    else if (settings.audioInputMode !== 'continuous') { toast?.add({ type: 'info', title: 'Minimal Audio', message: 'Little audio for Whisper.', duration: 2500 }); }
    sttProcessingIndicator.value = false; emit('processing-audio', false);
    if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && permissionStatus.value === 'granted' && !isWebSpeechListening.value) { startWebSpeechRecognition(); }
  };
  mediaRecorder.onerror = (event: Event) => { console.error('MediaRec Err:', event); toast?.add({ type: 'error', title: 'Record Err', message: 'Recorder error.' }); isRecording.value = false; clearRecordingTimer(); sttProcessingIndicator.value = false; emit('processing-audio', false); };
  mediaRecorder.start((isContinuousMode.value || isVoiceActivationMode.value) ? 5000 : undefined);
  isRecording.value = true; startRecordingTimer(); startAudioLevelMonitoring(); emit('processing-audio', true); return true;
};
const stopWhisperMediaRecorder = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') { mediaRecorder.stop(); }
  else { isRecording.value = false; clearRecordingTimer(); sttProcessingIndicator.value = false; emit('processing-audio', false); }
};

const transcribeWithWhisper = async (audioBlob: Blob) => {
  if (props.isProcessing && !isRecording.value) { toast?.add({ type: 'info', title: 'Busy', message: 'Assistant busy.' }); return; }
  sttProcessingIndicator.value = true; emit('processing-audio', true);
  try {
    const formData = new FormData(); formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);
    if (settings.speechLanguage) formData.append('language', settings.speechLanguage.substring(0, 2));
    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;
    if (response.data.transcription?.trim()) { sendTranscription(response.data.transcription.trim()); }
    else if (response.data.transcription === "") { toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper: Empty transcription.', duration: 3000 }); }
    else { throw new Error(response.data.message || 'Whisper: Invalid transcription.'); }
  } catch (error: any) { console.error("Whisper API Err:", error); toast?.add({ type: 'error', title: 'Whisper Fail', message: error.response?.data?.message || error.message });}
  finally { sttProcessingIndicator.value = false; emit('processing-audio', false); }
};

const startAudioCapture = async () => {
  if (props.isProcessing || isMicrophoneActive.value) return;
  if (permissionStatus.value !== 'granted' && !(await requestMicrophonePermissionsAndGetStream())) { toast?.add({ type: 'error', title: 'Mic Required', message: permissionMessage.value }); return; }
  if (permissionStatus.value === 'granted' && !activeStream?.active && !(await requestMicrophonePermissionsAndGetStream())) { toast?.add({ type: 'error', title: 'Mic Stream Fail', message: 'Could not re-establish mic stream.' }); return; }
  emit('processing-audio', true);
  if (sttPreference.value === 'browser_webspeech_api') { await startWebSpeechRecognition(); }
  else if (sttPreference.value === 'whisper_api') {
    if (isContinuousMode.value || isVoiceActivationMode.value) { await startWebSpeechRecognition(); } else { await startWhisperMediaRecorder(); }
  }
};
const stopAudioCapture = (abortWebSpeechIfContinuousOrVAD = false) => {
  if (sttPreference.value === 'browser_webspeech_api') { stopWebSpeechRecognition((isContinuousMode.value || isVoiceActivationMode.value) ? abortWebSpeechIfContinuousOrVAD : false); }
  else { if (isRecording.value) stopWhisperMediaRecorder(); if (isWebSpeechListening.value) stopWebSpeechRecognition(true); }
  clearRecordingTimer(); clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; stopAudioLevelMonitoring();
  if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value && abortWebSpeechIfContinuousOrVAD) { sendPendingWebSpeechTranscription(); }
  if (!isMicrophoneActive.value) emit('processing-audio', false);
};

const toggleRecording = async () => {
  if (props.isProcessing) { toast?.add({ type: 'info', title: 'Busy', message: 'Assistant processing.' }); return; }
  if (isMicrophoneActive.value) { stopAudioCapture(true); } else { await startAudioCapture(); }
};

const handleTextSubmit = () => {
  if (textInput.value.trim() && !isMicrophoneActive.value && !props.isProcessing) {
    sendTranscription(textInput.value.trim()); textInput.value = ''; nextTick(() => handleTextareaInput());
  }
};

const sendTranscription = (text: string) => {
  if (text.trim()) {
    emit('transcription', text.trim());
    const newHistoryItem: TranscriptionHistoryItem = { id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, text: text.trim(), timestamp: Date.now(), sent: true };
    transcriptionHistory.value = [newHistoryItem, ...transcriptionHistory.value].slice(0, 20);
  }
};
const resendTranscription = (item: TranscriptionHistoryItem) => {
  sendTranscription(item.text);
  toast?.add({ type: 'info', title: 'Resent', message: `Resent: "${item.text.substring(0,30)}..."`, duration: 2000});
};

const sendPendingWebSpeechTranscription = () => {
  if (pendingTranscriptWebSpeech.value.trim()) sendTranscription(pendingTranscriptWebSpeech.value.trim());
  clearPendingWebSpeechTranscription();
};
const clearPendingWebSpeechTranscription = () => {
  pendingTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = '';
  clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
};

const showEditModal: Ref<boolean> = ref(false);
const editingTranscription: Ref<string> = ref('');
const editPendingTranscription = () => {
  if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()){
    editingTranscription.value = pendingTranscriptWebSpeech.value; showEditModal.value = true;
    nextTick(() => editModalTextareaRef.value?.focus());
  }
};
const saveEdit = () => {
  if(editingTranscription.value.trim()){
    pendingTranscriptWebSpeech.value = editingTranscription.value.trim(); sendPendingWebSpeechTranscription();
  }
  showEditModal.value = false; editingTranscription.value = '';
};
const cancelEdit = () => {
  showEditModal.value = false; editingTranscription.value = '';
};

const resetPauseDetectionWebSpeech = () => {
  clearPauseTimerWebSpeech(); pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
  if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && continuousModeAutoSend.value) {
    pauseTimerIdWebSpeech = window.setTimeout(() => {
      if (pendingTranscriptWebSpeech.value.trim() && isWebSpeechListening.value && continuousModeAutoSend.value && isContinuousMode.value) {
        pauseDetectedWebSpeech.value = true; pauseCountdownWebSpeech.value = continuousModePauseTimeoutMs.value;
        const countdownInterval = setInterval(() => {
          if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isWebSpeechListening.value) { clearInterval(countdownInterval); pauseDetectedWebSpeech.value = false; return; }
          pauseCountdownWebSpeech.value -= 100;
          if (pauseCountdownWebSpeech.value <= 0) { clearInterval(countdownInterval); if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) sendPendingWebSpeechTranscription(); pauseDetectedWebSpeech.value = false; }
        }, 100);
      }
    }, 1000);
  }
};
const startRecordingTimer = () => {
  clearRecordingTimer(); recordingSeconds.value = 0;
  recordingTimerId = window.setInterval(()=>{ // Use window.setInterval for browser environment
    recordingSeconds.value += 0.1;
    if((isPttMode.value || (isVoiceActivationMode.value && isRecording.value)) && recordingSeconds.value >= 60){
      toast?.add({type:'info', title:'Rec Limit', message:'Max recording (60s) hit.'}); stopAudioCapture(sttPreference.value === 'browser_webspeech_api');
    }}, 100);
};
const clearRecordingTimer = () => { if(recordingTimerId !== null) clearInterval(recordingTimerId); recordingTimerId = null; recordingSeconds.value = 0;};
const clearPauseTimerWebSpeech = () => { if(pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech); pauseTimerIdWebSpeech = null;};
const cleanUpAfterWebSpeechTranscription = () => { interimTranscriptWebSpeech.value=''; finalTranscriptWebSpeech.value=''; liveTranscriptWebSpeech.value=''; clearRecordingTimer();};

const stopAllAudioProcessing = (abortWebSpeech = true) => {
  if (recognition) { try { if (isWebSpeechListening.value) { if (abortWebSpeech) recognition.abort(); else recognition.stop(); } } catch (e) { console.warn('Err stopAll/WebSpeech:', e); } }
  isWebSpeechListening.value = false; isVADListeningForWakeWord.value = false;
  if (mediaRecorder && mediaRecorder.state === 'recording') { try { mediaRecorder.stop(); } catch (e) { console.warn('Err stopAll/MediaRec:', e); } }
  isRecording.value = false;
  if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
  if (audioContext && audioContext.state !== 'closed') { audioContext.close().catch(e=>console.warn('Err stopAll/AudioCtx:',e)); audioContext = null; }
  microphoneSourceNode = null; analyser = null;
  stopAudioLevelMonitoring(); cleanUpAfterWebSpeechTranscription();
  clearPauseTimerWebSpeech(); if (vadSilenceTimerId !== null) clearTimeout(vadSilenceTimerId); vadSilenceTimerId = null;
  pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
  sttProcessingIndicator.value = false; emit('processing-audio', false);
};

// Exposing functions to the template (implicitly done with <script setup>)
const getButtonTitle = (): string => {
  if (props.isProcessing || sttProcessingIndicator.value) return 'Assistant is processing...';
  if (!micAccessInitiallyChecked.value && permissionStatus.value === '') return 'Initializing microphone...';
  if (permissionStatus.value === 'denied') return 'Microphone access denied. Check browser settings.';
  if (permissionStatus.value === 'error') return `Microphone error: ${permissionMessage.value || 'Unknown'}`;
  if (isMicrophoneActive.value) {
    if (isContinuousMode.value) return 'Stop continuous listening';
    if (isVoiceActivationMode.value) return isVADListeningForWakeWord.value ? 'Listening for "Vee"... (Click to Stop)' : 'Stop voice activation';
    return 'Release to stop recording (PTT)';
  }
  const currentMode = audioModeOptions.value.find(m => m.value === settings.audioInputMode);
  if (currentMode) return currentMode.value === 'push-to-talk' ? `Hold for ${currentMode.label}` : `Click for ${currentMode.label}`;
  return 'Activate Microphone';
};

const getPlaceholderText = (): string => {
  if (isMicrophoneActive.value) {
    if (isPttMode.value) return 'Recording... release to send.';
    if (isContinuousMode.value) return 'Listening continuously... say something, or type here.';
    if (isVoiceActivationMode.value) return isVADListeningForWakeWord.value ? 'Say "Vee" to activate, or type here...' : 'Listening for command... or type.';
  }
  const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';
  if (isContinuousMode.value) return `Continuous (${method}). Type or click mic...`;
  if (isVoiceActivationMode.value) return `Say "Vee" for VAD (${method}), or type...`;
  return `Type or hold mic for PTT (${method})...`;
};

const getModeIndicatorClass = (): string => {
  if (props.isProcessing || sttProcessingIndicator.value) return 'processing';
  if (isMicrophoneActive.value) return 'active';
  if ((isContinuousMode.value || isVoiceActivationMode.value) && permissionStatus.value === 'granted') return 'standby';
  return 'idle';
};

const getRecordingStatusText = (): string => {
  if (props.isProcessing) return 'Assistant processing...';
  if (sttProcessingIndicator.value) return sttPreference.value === 'whisper_api' ? 'Transcribing with Whisper...' : 'Finalizing browser transcription...';
  const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';
  if (isPttMode.value && isMicrophoneActive.value) return `Recording (PTT ${method})... ${formatDuration(recordingSeconds.value)}`;
  if (isContinuousMode.value) {
    if (pauseDetectedWebSpeech.value && sttPreference.value === 'browser_webspeech_api') return 'Pause detected, auto-sending...';
    if (isRecording.value && sttPreference.value === 'whisper_api') return `Segmenting for Whisper... ${formatDuration(recordingSeconds.value)}`;
    return isWebSpeechListening.value ? `Listening continuously (${method})...` : `Continuous mode ready (${method})`;
  }
  if (isVoiceActivationMode.value) {
    if (isVADListeningForWakeWord.value) return `Awaiting "Vee" (${method})...`;
    if (isRecording.value) return `Voice active, recording (${method})... ${formatDuration(recordingSeconds.value)}`;
    return isWebSpeechListening.value ? `Listening for voice (${method})...` : `VAD ready (${method})`;
  }
  return 'Ready for input.';
};

const getIdleStatusText = (): string => {
  if (props.isProcessing || sttProcessingIndicator.value) return 'Processing...';
  if (permissionStatus.value === 'granted') {
    const modeOpt = audioModeOptions.value.find(m => m.value === settings.audioInputMode);
    return `${modeOpt ? modeOpt.label : 'Mode'} Ready`;
  }
  if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return "Mic Inactive";
  return 'Mic status pending...';
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutsideAudioModeDropdown, true);
  if (typeof window !== 'undefined') { initializeWebSpeech(); }
  if (navigator.permissions) {
    try {
      const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      permissionStatus.value = perm.state; emit('permission-update', perm.state);
      if (perm.state === 'granted') {
        permissionMessage.value = '';
        if ((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isMicrophoneActive.value && !props.isProcessing) {
          await startAudioCapture();
        }
      } else if (perm.state === 'prompt') { permissionMessage.value = 'Click mic icon to grant access.'; }
      else { permissionMessage.value = 'Mic access denied. Check browser/system settings.'; }
      micAccessInitiallyChecked.value = true;
      perm.onchange = () => {
        const newState = perm.state; permissionStatus.value = newState; emit('permission-update', newState);
        if(newState === 'granted'){ permissionMessage.value = 'Mic ready.'; if((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isMicrophoneActive.value && !props.isProcessing) startAudioCapture(); }
        else if (newState === 'denied'){ permissionMessage.value = 'Mic access denied.'; if(isMicrophoneActive.value) stopAllAudioProcessing(true); }
        else { permissionMessage.value = 'Mic access requires action.'; if(isMicrophoneActive.value) stopAllAudioProcessing(true); }
      };
    } catch (e) {
      console.warn("[VoiceInput] Error querying microphone permission:", e); permissionStatus.value = 'error';
      permissionMessage.value = 'Could not query mic permission.'; emit('permission-update', 'error'); micAccessInitiallyChecked.value = true;
    }
  } else { micAccessInitiallyChecked.value = true; permissionMessage.value = 'Perm API not supported.';}
  nextTick(() => handleTextareaInput());
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideAudioModeDropdown, true);
  stopAllAudioProcessing(true);
  // Detach permission change listener if it was attached
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then(p => { if (p.onchange) p.onchange = null; })
      .catch(console.warn);
  }
  if (recognition) { /* Nullify all handlers */
    recognition.onstart=null; recognition.onresult=null; recognition.onerror=null; recognition.onend=null;
    recognition.onaudiostart=null; recognition.onaudioend=null; recognition.onsoundstart=null; recognition.onsoundend=null;
    recognition.onspeechstart=null; recognition.onspeechend=null; recognition.onnomatch=null;
    recognition=null;
  }
  if (mediaRecorder) { /* Nullify all handlers */
    mediaRecorder.ondataavailable=null; mediaRecorder.onstop=null; mediaRecorder.onerror=null;
    mediaRecorder=null;
  }
});
// Removed explicit return; it's not needed in <script setup> for top-level bindings
</script>

<template>
  <div class="voice-input-panel-ephemeral" :class="currentPanelStateClasses" :aria-busy="props.isProcessing || isMicrophoneActive || sttProcessingIndicator">
    <div
      v-if="isMicrophoneActive && (interimTranscriptWebSpeech || liveTranscriptWebSpeech || pendingTranscriptWebSpeech || (sttPreference === 'whisper_api' && isRecording))"
      class="live-transcript-display-ephemeral"
      aria-live="polite"
    >
      <p v-if="interimTranscriptWebSpeech && sttPreference === 'browser_webspeech_api'" class="interim-transcript-ephemeral" aria-label="Interim transcription">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="finalized-part-ephemeral" aria-label="Live transcription">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="pending-transcript-ephemeral" aria-label="Pending transcription">
        <span class="font-semibold text-xs text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
      <div v-if="sttPreference === 'whisper_api' && isRecording" class="whisper-status-ephemeral flex items-center justify-center text-xs" aria-label="Recording for Whisper API">
        <CloudArrowUpIcon class="icon-xs inline mr-1.5 animate-pulse" /> Recording for Whisper ({{ formatDuration(recordingSeconds) }})
      </div>
       <div v-if="isVoiceActivationMode && isVADListeningForWakeWord && sttPreference === 'browser_webspeech_api'" class="vad-wake-word-status text-xs text-center italic py-1 text-[hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l))]">
        Say "Vee" to activate... <MagicIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" />
      </div>
    </div>

    <div class="input-area-ephemeral" :class="textInputProminenceClass">
      <textarea
        ref="textareaRef"
        v-model="textInput"
        @input="handleTextareaInput"
        @keyup.enter.exact.prevent="!isMicrophoneActive && textInput.trim() && handleTextSubmit()"
        @keydown.enter.shift.exact.prevent="textInput += '\n'; nextTick(handleTextareaInput)"
        class="voice-textarea-ephemeral"
        :placeholder="getPlaceholderText()"
        :disabled="isMicrophoneActive || props.isProcessing || sttProcessingIndicator"
        aria-label="Text input for chat"
        rows="1"
      ></textarea>
      <button
        @click="handleTextSubmit"
        :disabled="!textInput.trim() || isMicrophoneActive || props.isProcessing || sttProcessingIndicator"
        class="send-button-ephemeral-v2"
        aria-label="Send text message"
        title="Send Text Message (Enter)"
      >
        <span class="send-icon-animated-wrapper">
          <svg class="send-icon-animated" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6127 11.0034C21.9187 11.1574 22.1287 11.4374 22.1787 11.7584C22.2287 12.0784 22.1127 12.4054 21.8757 12.6264L4.33773 29.0944C4.04373 29.3674 3.64273 29.4754 3.26373 29.3784C2.88573 29.2804 2.59173 28.9894 2.49873 28.6144L0.102732 19.8264C-0.00826806 19.4054 -0.020268 18.9604 0.071732 18.5384L2.28573 1.96543C2.37873 1.53143 2.71373 1.19143 3.14973 1.09843C3.58573 1.00543 4.03673 1.12743 4.36473 1.43143L21.6127 11.0034Z" class="send-icon-shape"/>
            <path d="M2.32178 19.0299L21.4338 11.9999L2.32178 1.96492" class="send-icon-trail send-icon-trail-1"/>
            <path d="M2.32178 19.0299L16.0978 11.9999L2.32178 1.96492" class="send-icon-trail send-icon-trail-2"/>
            <path d="M2.32178 19.0299L10.7618 11.9999L2.32178 1.96492" class="send-icon-trail send-icon-trail-3"/>
          </svg>
        </span>
      </button>
    </div>

    <div class="controls-main-row-ephemeral">
      <button
        @mousedown="isPttMode && !props.isProcessing && !sttProcessingIndicator ? startAudioCapture() : null"
        @mouseup="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @keydown.space.prevent="isPttMode && !props.isProcessing && !sttProcessingIndicator && !isMicrophoneActive ? startAudioCapture() : null"
        @keyup.space.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @touchstart.prevent="isPttMode && !props.isProcessing && !sttProcessingIndicator ? startAudioCapture() : null"
        @touchend.prevent="isPttMode && isMicrophoneActive ? stopAudioCapture() : null"
        @click="!isPttMode && !props.isProcessing && !sttProcessingIndicator ? toggleRecording() : null"
        class="mic-button-ephemeral"
        :class="{
          'listening': isMicrophoneActive && !props.isProcessing && !sttProcessingIndicator,
          'recording-whisper': isRecording && sttPreference === 'whisper_api',
          'processing': props.isProcessing || sttProcessingIndicator,
          'mic-error': permissionStatus === 'error',
          'mic-denied': permissionStatus === 'denied'
        }"
        :title="getButtonTitle()"
        :aria-pressed="isMicrophoneActive"
        :disabled="props.isProcessing || sttProcessingIndicator || (!micAccessInitiallyChecked && permissionStatus !== 'granted' && permissionStatus !== 'prompt')"
        aria-live="polite"
      >
        <MicrophoneIcon class="icon" />
      </button>

      <div class="status-display-ephemeral">
        <div class="mode-indicator-wrapper-ephemeral">
            <span class="mode-dot-ephemeral" :class="getModeIndicatorClass()"></span>
            <span class="mode-text-ephemeral" :title="`Current mode: ${settings.audioInputMode}`">{{ getIdleStatusText() }}</span>
        </div>
        <div class="transcription-status-ephemeral" aria-live="assertive">
          {{ getRecordingStatusText() }}
          <span v-if="isContinuousMode && pauseDetectedWebSpeech && sttPreference === 'browser_webspeech_api'" class="countdown-text"> ({{ Math.max(0, pauseCountdownWebSpeech / 1000).toFixed(1) }}s)</span>
        </div>
        <div v-if="permissionMessage && permissionStatus !== 'granted'" class="permission-status-ephemeral" :class="String(permissionStatus)" role="alert">
          {{ permissionMessage }}
        </div>
      </div>

      <div class="audio-mode-selector-wrapper" ref="audioModeDropdownRef">
        <button @click="toggleAudioModeDropdown" class="audio-mode-button btn btn-ghost-ephemeral btn-sm-ephemeral" aria-haspopup="true" :aria-expanded="showAudioModeDropdown">
            <component :is="currentAudioModeIcon" class="icon-sm" aria-hidden="true"/>
            <span class="hidden sm:inline ml-1.5">{{ currentAudioModeLabel }}</span>
            <ChevronDownIcon class="chevron-icon icon-xs ml-auto transition-transform duration-200" :class="{'rotate-180': showAudioModeDropdown}" aria-hidden="true"/>
        </button>
        <Transition name="dropdown-float-neomorphic">
            <div v-if="showAudioModeDropdown" class="audio-mode-dropdown card-neo-raised">
                 <div class="dropdown-header-ephemeral !py-1.5 !px-2.5"><h3 class="dropdown-title !text-xs">Audio Input Mode</h3></div>
                <button v-for="mode in audioModeOptions" :key="mode.value" @click="selectAudioMode(mode.value)"
                        class="audio-mode-item dropdown-item-ephemeral" :class="{'active': settings.audioInputMode === mode.value}"
                        role="menuitemradio" :aria-checked="settings.audioInputMode === mode.value">
                    <component :is="mode.icon" class="icon-sm mr-2" aria-hidden="true"/>
                    {{ mode.label }}
                    <SolidCheckIcon v-if="settings.audioInputMode === mode.value" class="icon-xs ml-auto text-[hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l))]" aria-hidden="true"/>
                </button>
            </div>
        </Transition>
      </div>

      <div class="secondary-controls-ephemeral">
        <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral" title="View Transcription History">
          <ClockIcon class="icon-base" aria-hidden="true"/>
        </button>
        <button v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && pendingTranscriptWebSpeech.trim()" @click="editPendingTranscription" class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral" title="Edit pending transcription">
          <PencilIcon class="icon-base" aria-hidden="true"/>
        </button>
         <button v-if="isMicrophoneActive && (isContinuousMode || isVoiceActivationMode)" @click="() => stopAudioCapture(true)" class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral stop-btn-ephemeral" title="Stop Listening/Recording">
          <StopCircleIcon class="icon-base" aria-hidden="true"/>
        </button>
      </div>
    </div>

    <canvas
      v-if="isVoiceActivationMode && isMicrophoneActive && permissionStatus === 'granted' && sttPreference === 'whisper_api'"
      ref="vadCanvasRef"
      class="vad-canvas-ephemeral"
      width="300" height="30"
      aria-label="Voice activity visualization for Whisper VAD">
    </canvas>
    <div v-if="isVoiceActivationMode && sttPreference === 'browser_webspeech_api' && isMicrophoneActive && !isVADListeningForWakeWord" class="web-speech-vad-active-indicator">
      Browser VAD Active: Listening for command...
    </div>

    <Transition name="modal-holographic-translucent">
      <div v-if="showTranscriptionHistory" class="modal-overlay-ephemeral" @mousedown.self="showTranscriptionHistory = false">
        <div class="modal-content-ephemeral card-glass-interactive max-w-lg w-full" role="dialog" aria-modal="true" aria-labelledby="history-title">
          <div class="modal-header-ephemeral">
            <h3 id="history-title" class="modal-title-ephemeral">Transcription History</h3>
            <button @click="showTranscriptionHistory = false" class="modal-close-button-ephemeral btn btn-icon-ephemeral btn-ghost-ephemeral" aria-label="Close history">
              <XMarkIcon class="icon-base"/>
            </button>
          </div>
          <div class="modal-body-ephemeral custom-scrollbar-thin">
            <ul v-if="transcriptionHistory.length > 0" class="history-list-ephemeral">
              <li v-for="item in transcriptionHistory" :key="item.id" class="history-item-ephemeral">
                <div class="history-item-text-ephemeral">{{ item.text }}</div>
                <div class="history-item-meta-ephemeral">
                  <span class="timestamp-ephemeral text-xs">{{ formatTime(item.timestamp) }}</span>
                  <button @click="resendTranscription(item)" class="resend-btn-ephemeral btn btn-link-ephemeral btn-xs-ephemeral" title="Resend this transcription">
                    Resend <PaperAirplaneIcon class="inline h-3 w-3 ml-1" />
                  </button>
                </div>
              </li>
            </ul>
            <p v-else class="text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))] italic text-center p-4">No transcription history yet.</p>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-holographic-translucent">
        <div v-if="showEditModal" class="modal-overlay-ephemeral" @mousedown.self="cancelEdit">
          <div class="modal-content-ephemeral card-glass-interactive sm:max-w-lg w-full" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <div class="modal-header-ephemeral">
              <h3 id="edit-title" class="modal-title-ephemeral">Edit Transcription</h3>
              <button @click="cancelEdit" class="modal-close-button-ephemeral btn btn-icon-ephemeral btn-ghost-ephemeral" aria-label="Cancel edit">
                <XMarkIcon class="icon-base"/>
              </button>
            </div>
            <div class="modal-body-ephemeral p-4">
              <textarea
                ref="editModalTextareaRef"
                v-model="editingTranscription"
                class="voice-textarea-ephemeral w-full min-h-[120px] !bg-[hsla(var(--color-bg-secondary-h),var(--color-bg-secondary-s),var(--color-bg-secondary-l),0.8)]"
                aria-label="Edit transcription text"
                rows="4"
              ></textarea>
            </div>
            <div class="modal-footer-ephemeral">
              <button @click="cancelEdit" class="btn btn-secondary-ephemeral btn-sm-ephemeral">Cancel</button>
              <button @click="saveEdit" class="btn btn-primary-ephemeral btn-sm-ephemeral">Save & Send</button>
            </div>
          </div>
        </div>
      </Transition>
  </div>
</template>

<style lang="scss">
// Styles for VoiceInput are primarily in frontend/src/styles/components/_voice-input.scss.
// The dynamic classes :class="currentPanelStateClasses" and :class="textInputProminenceClass"
// are applied in the template and will be targeted by the global SCSS file.

.streaming-cursor-ephemeral {
  animation: blink 1s step-end infinite;
}
// Ensure blink animation is defined in _keyframes.scss or main SCSS:
// @keyframes blink { 50% { opacity: 0; } }
</style>