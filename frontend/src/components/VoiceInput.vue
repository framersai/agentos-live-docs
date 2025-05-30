// File: frontend/src/components/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Core component for handling all voice input, text input, transcription (Whisper/WebSpeech),
 * and audio mode management (Push-to-Talk, Continuous, Voice Activation with "V" trigger).
 * Features dynamic visual feedback, adapts text input prominence, and manages complex state
 * for audio capture and transcription processing.
 *
 * @component VoiceInput
 * @props {boolean} isProcessing - Indicates if the parent component (e.g., chat manager for LLM call) is currently processing a submission.
 * @emits transcription - Emits the final transcribed text for processing by the parent.
 * @emits permission-update - Emits microphone permission status changes ('granted', 'denied', 'prompt', 'error').
 * @emits processing-audio - Emits true when this component is actively involved in audio capture or STT, false otherwise. This is for external UI cues.
 *
 * @version 4.1.2
 * @description
 * - Fixed TypeScript errors related to 'sttOptions'.
 * - Correctly called 'startAudioVisualisation' for VAD Whisper command recording.
 * - Removed internal placeholder comments from already implemented functions.
 * - Complete implementation based on refined requirements.
 * - Major refactor for continuous Whisper mode:
 * - Implemented client-side audio segmentation using silence detection (via AnalyserNode) or max segment duration.
 * - Decoupled internal STT processing state (`isTranscribingCurrentSegment`) from parent's LLM processing state (`props.isProcessing`)
 * to prevent continuous recording blockage.
 * - MediaRecorder immediately restarts for the next segment in continuous Whisper mode.
 * - Enhanced UI feedback for different recording and transcription states.
 * - Solidified VAD mode's hybrid approach (WebSpeech for wake-word, MediaRecorder for Whisper command).
 * - Comprehensive JSDoc, error handling, and state management clarity.
 * - All functions and reactive properties are fully defined for template use.
 */
<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
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

// Icons
import {
  ClockIcon, XMarkIcon, PaperAirplaneIcon, CloudArrowUpIcon,
  SpeakerWaveIcon as ContinuousModeIcon,
  ChevronDownIcon,
  HandRaisedIcon as PTTModeIcon,
  CpuChipIcon as VADModeIcon,
  PencilIcon, StopCircleIcon, MicrophoneIcon,
  SparklesIcon as MagicIcon,
} from '@heroicons/vue/24/outline';
import { CheckIcon as SolidCheckIcon } from '@heroicons/vue/24/solid';

// Ambient Type Declarations for Web Speech API (Ensure these are in a global .d.ts or tsconfig "lib": ["DOM"])
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
// End Ambient Type Declarations

/** @interface TranscriptionHistoryItem - Structure for local transcription history. */
interface TranscriptionHistoryItem { id: string; text: string; timestamp: number; sent: boolean; }
/** @interface AudioModeOption - Structure for UI audio mode selection. */
interface AudioModeOption { label: string; value: AudioInputMode; icon: VueComponentType; description: string; }

const props = defineProps({
  /** Indicates if the parent component (e.g., chat manager for LLM call) is currently processing a submission. */
  isProcessing: { type: Boolean as PropType<boolean>, required: true },
});

const emit = defineEmits<{
  /** Emitted with the final transcribed text. */
  (e: 'transcription', value: string): void;
  /** Emitted when microphone permission status changes. */
  (e: 'permission-update', status: 'granted' | 'denied' | 'prompt' | 'error'): void;
  /** Emitted to indicate if this component is actively involved in audio capture or STT. */
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');
/** Reactive global voice settings object from VoiceSettingsManager. */
const settings: VoiceApplicationSettings = voiceSettingsManager.settings;

// --- Component State Refs ---
const textInput: Ref<string> = ref('');
const textareaRef: Ref<HTMLTextAreaElement | null> = ref(null);
const editModalTextareaRef: Ref<HTMLTextAreaElement | null> = ref(null);

// Core recording/listening states
const isBrowserWebSpeechActive: Ref<boolean> = ref(false);
const isMediaRecorderActive: Ref<boolean> = ref(false);
const isTranscribingCurrentSegment: Ref<boolean> = ref(false); // Internal STT processing lock

// Permission states
const permissionStatus: Ref<'prompt'|'granted'|'denied'|'error'|''> = ref('');
const permissionMessage: Ref<string> = ref('');
const micAccessInitiallyChecked: Ref<boolean> = ref(false);

// WebSpeech specific transcripts
const interimTranscriptWebSpeech: Ref<string> = ref('');
const finalTranscriptWebSpeech: Ref<string> = ref('');
const liveTranscriptWebSpeech: Ref<string> = ref('');
const pendingTranscriptWebSpeech: Ref<string> = ref('');

// UI state for history and mode selection
const transcriptionHistory: Ref<TranscriptionHistoryItem[]> = ref(
  JSON.parse(localStorage.getItem('vca-transcriptionHistory-v3.1') || '[]')
);
const showTranscriptionHistory: Ref<boolean> = ref(false);
const showAudioModeDropdown: Ref<boolean> = ref(false);
const audioModeDropdownRef: Ref<HTMLElement | null> = ref(null);

// Media & AudioContext resources
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let activeStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphoneSourceNode: MediaStreamAudioSourceNode | null = null;

const recordingSegmentSeconds: Ref<number> = ref(0);
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;

// Silence/VAD detection
const vadSilenceDetectedDuration: Ref<number> = ref(0); // ms
let vadSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
const MAX_SEGMENT_DURATION_S = 30; // Max duration for a continuous Whisper segment
const SILENCE_ANALYSER_FFT_SIZE = 256; // Smaller FFT for faster VAD response
const SILENCE_ANALYSER_SMOOTHING = 0.2; // Faster smoothing
// Silence level: -50dBFS is a common threshold for silence. Adjust based on typical noise.
const SILENCE_DBFS_THRESHOLD = -50;

// WebSpeech specific timers/states (for continuous mode pause detection)
const pauseDetectedWebSpeech: Ref<boolean> = ref(false);
const pauseCountdownWebSpeech: Ref<number> = ref(0);
let pauseTimerIdWebSpeech: ReturnType<typeof setTimeout> | null = null;

// VAD (Voice Activation Mode) specific
const isVADListeningForWakeWord: Ref<boolean> = ref(false);
let vadWakeWordDetectionRecognition: SpeechRecognition | null = null;

const vadCanvasRef: Ref<HTMLCanvasElement | null> = ref(null);
let audioVisualisationIntervalId: ReturnType<typeof setInterval> | null = null;
let webSpeechRecognition: SpeechRecognition | null = null; // Main instance for Browser STT

// --- Computed Properties ---
const sttPreference = computed<STTPreference>(() => settings.sttPreference);
const selectedAudioDeviceId = computed<string | null>(() => settings.selectedAudioInputDeviceId);
const continuousModeAutoSend = computed<boolean>(() => settings.continuousModeAutoSend);
const minSilenceDurationForSegmentEndMs = computed<number>(() => settings.continuousModePauseTimeoutMs);

/** True if any internal audio processing (recording, STT) is active. */
const isSelfProcessingAudio = computed<boolean>(() =>
  isBrowserWebSpeechActive.value || isMediaRecorderActive.value || isTranscribingCurrentSegment.value
);

const isPttMode = computed<boolean>(() => settings.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => settings.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => settings.audioInputMode === 'voice-activation');

/** Dynamic classes for panel visual feedback based on current states. */
const currentPanelStateClasses = computed(() => ({
  'processing-llm': props.isProcessing && !isSelfProcessingAudio.value, // Parent is busy, self is idle
  'processing-stt': isTranscribingCurrentSegment.value,                  // Self is busy with STT
  'microphone-error': permissionStatus.value === 'error',
  'microphone-denied': permissionStatus.value === 'denied',
  'mic-active': isMediaRecorderActive.value || (isBrowserWebSpeechActive.value && !isVADListeningForWakeWord.value),
  'vad-wake-word-listening': isVoiceActivationMode.value && isVADListeningForWakeWord.value && !props.isProcessing,
}));

/** Dynamic class for textarea prominence based on current mode. */
const textInputProminenceClass = computed<string>(() => {
  if (isContinuousMode.value && (isMediaRecorderActive.value || isBrowserWebSpeechActive.value)) return 'input-prominence-subtle';
  if (isVoiceActivationMode.value && isVADListeningForWakeWord.value) return 'input-prominence-focused-wake';
  return 'input-prominence-default';
});

/** Details for the current audio input mode for UI display. */
const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push-to-Talk', value: 'push-to-talk', icon: PTTModeIcon, description: "Hold microphone to speak." },
  { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon, description: "Mic listens, sends on pause." },
  { label: 'Voice Activate ("Vee")', value: 'voice-activation', icon: VADModeIcon, description: "Say 'Vee' to activate, then speak." },
]);
const currentAudioModeDetails = computed(() => audioModeOptions.value.find(m => m.value === settings.audioInputMode));
const currentAudioModeLabel = computed<string>(() => currentAudioModeDetails.value?.label || 'Mode');
const currentAudioModeIcon = computed<VueComponentType>(() => currentAudioModeDetails.value?.icon || MicrophoneIcon);

// --- Watchers ---
watch(transcriptionHistory, (newHistory) => {
  localStorage.setItem('vca-transcriptionHistory-v3.1', JSON.stringify(newHistory));
}, { deep: true });

watch([
  () => settings.audioInputMode, () => settings.sttPreference,
  () => settings.selectedAudioInputDeviceId, () => settings.speechLanguage
], async ([newMode, newSTT, newDevice, newLang], [oldMode, oldSTT, oldDevice, oldLang]) => {
  if (newMode !== oldMode || newSTT !== oldSTT || newDevice !== oldDevice || newLang !== oldLang) {
    console.log(`[VoiceInput] Settings changed. Mode: ${oldMode}->${newMode}, STT: ${oldSTT}->${newSTT}`);
    await stopAllAudioProcessing(true);
    
    webSpeechRecognition = null; // Force re-init of main WebSpeech instance
    vadWakeWordDetectionRecognition = null; // Force re-init of VAD wake word instance

    // Re-initialize WebSpeech if it's the STT preference OR if it's used for VAD wake word
    if (newSTT === 'browser_webspeech_api') {
      initializeWebSpeechRecognition();
    }
    if (newMode === 'voice-activation') {
      initializeAndStartVADWakeWordRecognition(); // Initialize VAD listener specific instance
    }

    if ((newMode === 'continuous' || newMode === 'voice-activation') && permissionStatus.value === 'granted') {
      await nextTick();
      // Only auto-start if not already processing an LLM response and not self-processing
      if (settings.audioInputMode === newMode && !isSelfProcessingAudio.value && !props.isProcessing) {
        await startAudioCapture();
      }
    }
  }
}, { immediate: false });

watch(isSelfProcessingAudio, (newValue) => {
  emit('processing-audio', newValue);
});

// --- Utility Functions ---
/** Formats seconds into MM:SS string. */
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/** Formats a timestamp into a locale time string. */
const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Adjusts textarea height dynamically. */
const handleTextareaInput = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    const maxHeight = 150;
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
  }
};

// --- Audio Mode Selection ---
/** Toggles the audio mode selection dropdown. */
const toggleAudioModeDropdown = () => { showAudioModeDropdown.value = !showAudioModeDropdown.value; };

/** Sets the selected audio input mode. */
const selectAudioMode = (mode: AudioInputMode) => {
  voiceSettingsManager.updateSetting('audioInputMode', mode);
  showAudioModeDropdown.value = false; // Also closes dropdown
};

/** Handles clicks outside the audio mode dropdown to close it. */
const handleClickOutsideAudioModeDropdown = (event: MouseEvent) => {
  if (audioModeDropdownRef.value && !audioModeDropdownRef.value.contains(event.target as Node)) {
    showAudioModeDropdown.value = false;
  }
};

// --- Microphone & Audio Processing ---
/**
 * Requests microphone permissions and initializes the MediaStream and AudioContext if not already active.
 * @returns {Promise<boolean>} True if permission is granted and stream is ready, false otherwise.
 */
const ensureMicrophoneAccessAndStream = async (): Promise<boolean> => {
  if (permissionStatus.value === 'granted' && activeStream && activeStream.active) {
    // Verify if the device ID matches the selected one, re-acquire if different
    const currentTrackSettings = activeStream.getAudioTracks()[0]?.getSettings();
    if (currentTrackSettings?.deviceId === selectedAudioDeviceId.value || (!selectedAudioDeviceId.value && !currentTrackSettings?.deviceId) ) {
        return true; // Stream is active with the correct (or default) device
    }
    console.log("[VoiceInput] Microphone device changed, re-acquiring stream.");
    await stopAllAudioProcessing(true); // Stop existing stream and processors
  }
  
  const stream = await requestMicrophonePermissionsAndGetStream();
  return !!(stream && stream.active);
};


/**
 * Central function to request microphone permissions and set up the audio stream and analyser.
 * This is called by ensureMicrophoneAccessAndStream if a new stream is needed.
 * @returns {Promise<MediaStream | null>} The active MediaStream or null if failed.
 */
const requestMicrophonePermissionsAndGetStream = async (): Promise<MediaStream | null> => {
  permissionMessage.value = 'Requesting microphone access...';
  permissionStatus.value = 'prompt';
  emit('permission-update', 'prompt');

  try {
    // Ensure any previous resources are cleanly released
    if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
    if (microphoneSourceNode) { microphoneSourceNode.disconnect(); microphoneSourceNode = null; }
    if (analyser) { analyser.disconnect(); analyser = null; }
    if (audioContext && audioContext.state !== 'closed') { await audioContext.close().catch(e => console.warn("Error closing previous AudioContext:", e)); audioContext = null; }

    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDeviceId.value
        ? { deviceId: { exact: selectedAudioDeviceId.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    activeStream = stream;

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    microphoneSourceNode = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = SILENCE_ANALYSER_FFT_SIZE;
    analyser.smoothingTimeConstant = SILENCE_ANALYSER_SMOOTHING;
    analyser.minDecibels = -100; // Capture a wide range for analysis
    analyser.maxDecibels = -0;   // Default max
    microphoneSourceNode.connect(analyser);
    
    permissionStatus.value = 'granted';
    permissionMessage.value = 'Microphone ready.';
    emit('permission-update', 'granted');
    setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 2500);
    micAccessInitiallyChecked.value = true;
    return stream;
  } catch (err: any) {
    console.error("[VoiceInput] getUserMedia error:", err.name, err.message, err);
    let specificError: 'denied' | 'error' = 'error';
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') { permissionMessage.value = 'Microphone access denied.'; specificError = 'denied';}
    else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') { permissionMessage.value = 'No microphone found.';}
    else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') { permissionMessage.value = 'Microphone is busy or cannot be read.';}
    else { permissionMessage.value = `Mic error: ${err.name || 'Unknown'}.`; }
    permissionStatus.value = specificError;
    toast?.add({ type: 'error', title: 'Mic Access Failed', message: permissionMessage.value, duration: 7000 });
    emit('permission-update', specificError);
    micAccessInitiallyChecked.value = true; activeStream = null; audioContext = null; analyser = null; microphoneSourceNode = null;
    return null;
  }
};

/** Initializes the main SpeechRecognition instance for Browser STT. */
const initializeWebSpeechRecognition = (): boolean => {
  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    if (sttPreference.value === 'browser_webspeech_api') {
      permissionMessage.value = 'Web Speech API not supported.'; permissionStatus.value = 'error';
      toast?.add({ type: 'error', title: 'Not Supported', message: permissionMessage.value }); emit('permission-update', 'error');
    } return false;
  }
  if (webSpeechRecognition && webSpeechRecognition.lang === (settings.speechLanguage || navigator.language || 'en-US')) return true;
  
  if (webSpeechRecognition) { // Clean up previous instance before creating new
      try { webSpeechRecognition.abort(); } catch(e){}
      webSpeechRecognition.onstart = null; webSpeechRecognition.onresult = null; webSpeechRecognition.onerror = null; webSpeechRecognition.onend = null;
  }

  webSpeechRecognition = new SpeechRecognitionAPI();
  webSpeechRecognition.lang = settings.speechLanguage || navigator.language || 'en-US';
  webSpeechRecognition.continuous = isContinuousMode.value && sttPreference.value === 'browser_webspeech_api';
  webSpeechRecognition.interimResults = true;

  webSpeechRecognition.onstart = () => {
    console.log("[VoiceInput] Main WebSpeechRecognition started.");
    isBrowserWebSpeechActive.value = true;
    // In PTT or continuous browser STT, this means user is actively providing speech.
  };
  webSpeechRecognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = ''; let finalPart = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) { finalPart += transcript.trim() + ' '; } else { interim += transcript; }
    }
    interim = interim.trim(); finalPart = finalPart.trim();

    if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api') {
      liveTranscriptWebSpeech.value = interim;
      if (finalPart) { 
        pendingTranscriptWebSpeech.value = (pendingTranscriptWebSpeech.value + ' ' + finalPart).trim();
        liveTranscriptWebSpeech.value = ''; 
        resetPauseDetectionForWebSpeech(); // This will check if it's time to send
      }
    } else if (isPttMode.value && sttPreference.value === 'browser_webspeech_api') {
      interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim; // Show accumulating transcript
      if (finalPart) { finalTranscriptWebSpeech.value += finalPart + ' '; }
    }
    // VAD command capture for browser STT is handled here too if this instance is used
    else if (isVoiceActivationMode.value && sttPreference.value === 'browser_webspeech_api' && !isVADListeningForWakeWord.value) {
        interimTranscriptWebSpeech.value = finalTranscriptWebSpeech.value + interim;
        if (finalPart) { finalTranscriptWebSpeech.value += finalPart + ' '; }
    }
  };
  webSpeechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    const errCode = event.error; 
    console.error("[VoiceInput] Main WebSpeechRecognition error:", errCode, event.message);
    stopBrowserWebSpeechRecognitionInternalStates();
    let userMessage = `Browser speech error: ${errCode}. ${event.message || ''}`;
    if (errCode === 'not-allowed' || errCode === 'service-not-allowed') { permissionStatus.value = 'denied'; userMessage = 'Mic access denied.'; emit('permission-update', 'denied');}
    else if (errCode === 'no-speech' && isPttMode.value ) { userMessage = 'No speech detected.'; } // Only relevant for PTT
    else if (errCode === 'network') { userMessage = 'Network error for browser speech.'; }
    else if (errCode === 'aborted') { userMessage = 'Browser speech input aborted.'; }
    else { permissionStatus.value = 'error'; emit('permission-update', 'error');}
    
    permissionMessage.value = userMessage;
    if (errCode !== 'no-speech' && errCode !== 'aborted') { toast?.add({ type: 'error', title: 'Speech Error', message: userMessage }); }

    if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && permissionStatus.value === 'granted' && !props.isProcessing && errCode !== 'not-allowed') {
      setTimeout(() => { if (!isBrowserWebSpeechActive.value) startBrowserWebSpeechRecognition(); }, 750);
    }
  };
  webSpeechRecognition.onend = () => {
    console.log("[VoiceInput] Main WebSpeechRecognition ended.");
    const wasActive = isBrowserWebSpeechActive.value;
    stopBrowserWebSpeechRecognitionInternalStates();

    if (sttPreference.value === 'browser_webspeech_api') {
      if (isPttMode.value || (isVoiceActivationMode.value && !isVADListeningForWakeWord.value /* implies command was captured */)) {
        if (finalTranscriptWebSpeech.value.trim()) {
          sendTranscriptionToParent(finalTranscriptWebSpeech.value.trim());
        }
        cleanUpAfterWebSpeechTranscription();
      } else if (isContinuousMode.value) {
        // If continuous mode was active and auto-send is enabled, and there's pending text.
        // The onresult + pause detection handles sending during active listening.
        // This onend might catch a final segment if recognition stops unexpectedly.
        if (pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value) {
          sendPendingWebSpeechTranscriptionAndClear();
        }
        // Auto-restart for continuous mode if it ended naturally and wasn't manually stopped
        if (wasActive && permissionStatus.value === 'granted' && !props.isProcessing) {
          setTimeout(() => startBrowserWebSpeechRecognition(), 100);
        }
      }
    }
  };
  return true;
};

/** Starts the main browser SpeechRecognition service. */
const startBrowserWebSpeechRecognition = async (): Promise<boolean> => {
  if (isBrowserWebSpeechActive.value) return true;
  if (!webSpeechRecognition && !initializeWebSpeechRecognition()) return false;
  if (!(await ensureMicrophoneAccessAndStream())) return false;
  if (!webSpeechRecognition) return false; // Should be initialized by now

  finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; liveTranscriptWebSpeech.value = ''; // Clear previous
  webSpeechRecognition.continuous = isContinuousMode.value && sttPreference.value === 'browser_webspeech_api';

  try {
    webSpeechRecognition.start();
    return true;
  } catch (e: any) {
    if (e.name === 'InvalidStateError' && isBrowserWebSpeechActive.value) { console.warn("[VoiceInput] WebSpeech already started."); return true; }
    console.error("[VoiceInput] Error starting main WebSpeechRecognition:", e);
    permissionMessage.value = `Failed to start browser STT: ${e.name}`; permissionStatus.value = 'error';
    isBrowserWebSpeechActive.value = false;
    return false;
  }
};

/** Stops the main browser SpeechRecognition service. */
const stopBrowserWebSpeechRecognition = (abort: boolean = false) => {
  if (webSpeechRecognition && isBrowserWebSpeechActive.value) {
    try {
      if (abort) webSpeechRecognition.abort(); else webSpeechRecognition.stop();
      console.log(`[VoiceInput] Main WebSpeechRecognition ${abort ? 'aborted' : 'stopped'}.`);
    } catch (e) { console.warn("[VoiceInput] Error stopping/aborting main WebSpeech:", e); }
  }
  stopBrowserWebSpeechRecognitionInternalStates(); // Ensure states are reset even if stop fails
};

/** Resets internal states related to browser SpeechRecognition. */
const stopBrowserWebSpeechRecognitionInternalStates = () => {
  isBrowserWebSpeechActive.value = false;
  // Don't reset VADListeningForWakeWord here, it's managed by its own lifecycle
  clearPauseTimerForWebSpeech();
};

/** Initializes and starts the dedicated SpeechRecognition for VAD wake word detection. */
const initializeAndStartVADWakeWordRecognition = async (): Promise<boolean> => {
  if (isVADListeningForWakeWord.value && vadWakeWordDetectionRecognition) return true;
  if (!(await ensureMicrophoneAccessAndStream())) return false;

  const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    toast?.add({ type: 'error', title: 'VAD Error', message: 'Browser Speech API not supported for wake word.' });
    return false;
  }

  if (vadWakeWordDetectionRecognition) { // Cleanup old instance
    try { vadWakeWordDetectionRecognition.abort(); } catch (e) {}
    vadWakeWordDetectionRecognition.onstart = null; vadWakeWordDetectionRecognition.onresult = null;
    vadWakeWordDetectionRecognition.onerror = null; vadWakeWordDetectionRecognition.onend = null;
  }
  
  vadWakeWordDetectionRecognition = new SpeechRecognitionAPI();
  vadWakeWordDetectionRecognition.lang = settings.speechLanguage || navigator.language || 'en-US'; // Use main speech language
  vadWakeWordDetectionRecognition.continuous = false; // Listen for a short phrase
  vadWakeWordDetectionRecognition.interimResults = true; // Get results fast

  vadWakeWordDetectionRecognition.onstart = () => {
    isVADListeningForWakeWord.value = true;
    console.log("[VoiceInput] VAD wake word listener started.");
  };

  vadWakeWordDetectionRecognition.onresult = (event: SpeechRecognitionEvent) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    const wakeWordCandidate = transcript.toLowerCase().trim();
    // Simple wake word detection (e.g., "Vee" or "activate")
    if (wakeWordCandidate.includes('v') || wakeWordCandidate.includes('activate') || wakeWordCandidate.includes('hey assistant')) {
      console.log(`[VoiceInput] VAD Wake word candidate "${wakeWordCandidate}" detected!`);
      toast?.add({ type: 'info', title: 'Vee Activated!', message: 'Listening for your command...', duration: 2000 });
      stopVADWakeWordRecognition(false); // Stop this listener
      isVADListeningForWakeWord.value = false; // Transition out of wake word listening state
      
      // Start main capture for the command itself
      if (sttPreference.value === 'browser_webspeech_api') {
        if (!webSpeechRecognition) initializeWebSpeechRecognition();
        if (webSpeechRecognition) {
            finalTranscriptWebSpeech.value = ''; interimTranscriptWebSpeech.value = ''; // Clear for command
            webSpeechRecognition.continuous = false; // Command is usually not continuous
            try { webSpeechRecognition.start(); } catch(e){console.error("Error starting main WebSpeech for VAD command", e)}
        }
      } else if (sttPreference.value === 'whisper_api') {
        startWhisperMediaRecorder(true); // Start MediaRecorder for the command
      }
    }
  };

  vadWakeWordDetectionRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.warn("[VoiceInput] VAD wake word listener error:", event.error, event.message);
    isVADListeningForWakeWord.value = false;
    // Avoid aggressive restarting for wake word listener to prevent loops on persistent errors
    if (event.error !== 'no-speech' && event.error !== 'aborted' && permissionStatus.value === 'granted' && isVoiceActivationMode.value) {
        // Briefly pause then try to restart if it wasn't a user abort or lack of speech
        setTimeout(() => { if(isVoiceActivationMode.value && !isVADListeningForWakeWord.value) initializeAndStartVADWakeWordRecognition(); }, 1000);
    }
  };

  vadWakeWordDetectionRecognition.onend = () => {
    const wasListeningForWakeWord = isVADListeningForWakeWord.value;
    isVADListeningForWakeWord.value = false; 
    console.log("[VoiceInput] VAD wake word listener ended.");
    // If it ended and wake word was not detected, and VAD mode is still active, restart listening
    if (wasListeningForWakeWord && isVoiceActivationMode.value && permissionStatus.value === 'granted' && !isSelfProcessingAudio.value) {
      setTimeout(() => { if(isVoiceActivationMode.value && !isVADListeningForWakeWord.value && !isSelfProcessingAudio.value) initializeAndStartVADWakeWordRecognition(); }, 250);
    }
  };

  try {
    vadWakeWordDetectionRecognition.start();
    return true;
  } catch (e: any) {
    console.error("[VoiceInput] Error starting VAD wake word listener:", e);
    isVADListeningForWakeWord.value = false;
    return false;
  }
};

/** Stops the VAD wake word recognition service. */
const stopVADWakeWordRecognition = (abort: boolean = true) => {
  if (vadWakeWordDetectionRecognition) {
    try { if (abort) vadWakeWordDetectionRecognition.abort(); else vadWakeWordDetectionRecognition.stop(); }
    catch (e) { console.warn("[VoiceInput] Error stopping/aborting VAD wake word listener:", e); }
  }
  isVADListeningForWakeWord.value = false;
};

/**
 * Starts MediaRecorder for Whisper STT.
 * @param {boolean} forVADCommand - True if starting for a VAD command after wake word.
 * @returns {Promise<boolean>} True if started successfully.
 */
const startWhisperMediaRecorder = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (isMediaRecorderActive.value) {
    console.warn("[VoiceInput] MediaRecorder already active.");
    return true;
  }
  if (!(await ensureMicrophoneAccessAndStream())) {
    toast?.add({type: 'error', title: 'Mic Error', message: 'Microphone access required for Whisper.'});
    return false;
  }
  if (!activeStream) { // Should be guaranteed by ensureMicrophoneAccessAndStream
    console.error("[VoiceInput] Cannot start MediaRecorder: No active audio stream.");
    return false;
  }

  audioChunks = [];
  const options = { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' };
  try {
    mediaRecorder = new MediaRecorder(activeStream, options);
  } catch (e: any) {
    console.error("[VoiceInput] MediaRecorder initialization failed:", e.message, e);
    toast?.add({ type: 'error', title: 'Recorder Init Error', message: `Could not start audio recorder: ${e.message}` });
    return false;
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const wasRecording = isMediaRecorderActive.value; // Capture state before reset
    isMediaRecorderActive.value = false;
    clearRecordingSegmentTimer();
    stopAudioLevelMonitoringForSilence(); // Stop silence monitor
    stopAudioVisualisation(); // Ensure VAD visualization is also stopped

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || options.mimeType });
      audioChunks = []; // Clear for next recording

      if (audioBlob.size > 500) { // Minimum reasonable size for transcription
        await transcribeWithWhisper(audioBlob); // This sets isTranscribingCurrentSegment
      } else if (settings.audioInputMode !== 'continuous') { // Don't toast for tiny continuous chunks
        toast?.add({ type: 'info', title: 'Minimal Audio', message: 'Very little audio captured for Whisper.', duration: 2500 });
        isTranscribingCurrentSegment.value = false; // Ensure this is false if not transcribing
      } else {
         isTranscribingCurrentSegment.value = false; // No transcription for tiny continuous chunk
      }
    } else {
        isTranscribingCurrentSegment.value = false; // No data, so not transcribing
    }

    // Post-transcription logic based on mode
    if (isContinuousMode.value && sttPreference.value === 'whisper_api' && wasRecording && permissionStatus.value === 'granted') {
        // Immediately restart for the next segment in continuous mode,
        // regardless of props.isProcessing (LLM state). Blocked only by its own STT op.
        if (!isTranscribingCurrentSegment.value) { // Only restart if the previous send isn't blocking THIS component
            startWhisperMediaRecorder(); 
        } else {
            console.log("[VoiceInput] Continuous Whisper: Waiting for current segment STT to finish before restarting MediaRecorder.");
            // A watcher on isTranscribingCurrentSegment could also trigger restart if it becomes false.
        }
    } else if (isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && permissionStatus.value === 'granted') {
        // After VAD command (Whisper), return to listening for wake word
        if (!isVADListeningForWakeWord.value) initializeAndStartVADWakeWordRecognition();
    }
  };

  mediaRecorder.onerror = (event: Event) => {
    console.error('[VoiceInput] MediaRecorder error:', event);
    toast?.add({ type: 'error', title: 'Recorder Error', message: 'An error occurred with the audio recorder.' });
    isMediaRecorderActive.value = false;
    clearRecordingSegmentTimer();
    stopAudioLevelMonitoringForSilence();
    stopAudioVisualisation();
    isTranscribingCurrentSegment.value = false; // Ensure this is reset
  };

  // For continuous Whisper, don't use a timeslice for MediaRecorder.stop().
  // Rely on silence detection or max duration to call .stop()
  mediaRecorder.start(); 
  isMediaRecorderActive.value = true;
  startRecordingSegmentTimer();
  
  if (sttPreference.value === 'whisper_api') {
    if (isContinuousMode.value) {
      startAudioLevelMonitoringForSilence(); // For continuous Whisper segments
    } else if (isVoiceActivationMode.value && forVADCommand) {
      // This is when MediaRecorder is used for the VAD command after wake word.
      startAudioVisualisation(); // Start visualization for the VAD command recording.
    }
  }
  console.log(`[VoiceInput] MediaRecorder started for Whisper. Continuous: ${isContinuousMode.value}, VAD Cmd: ${forVADCommand}`);
  return true;
};

/** Stops the MediaRecorder. */
const stopWhisperMediaRecorder = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop(); // onstop handler will manage follow-up
    console.log("[VoiceInput] MediaRecorder.stop() called.");
  } else { // If not recording, just ensure states are clean
    isMediaRecorderActive.value = false;
    clearRecordingSegmentTimer();
    stopAudioLevelMonitoringForSilence();
    stopAudioVisualisation(); // Ensure VAD visualization is also stopped
  }
};

/**
 * Transcribes audio using Whisper API via backend.
 * @param {Blob} audioBlob - The audio data to transcribe.
 */
const transcribeWithWhisper = async (audioBlob: Blob) => {
  if (isTranscribingCurrentSegment.value) {
    toast?.add({ type: 'info', title: 'STT Busy', message: 'Current audio segment is still being transcribed.' });
    return;
  }
  if (props.isProcessing && !isContinuousMode.value) { // Allow continuous mode to send even if LLM is busy
      toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM is processing previous request.' });
      return;
  }

  isTranscribingCurrentSegment.value = true;
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio-${Date.now()}.webm`); // Filename helps backend/Whisper
    if (settings.speechLanguage) formData.append('language', settings.speechLanguage.substring(0, 2)); // e.g., "en"
    if (settings.sttOptions?.prompt) formData.append('prompt', settings.sttOptions.prompt);
    // Temperature can also be a setting:
    // if (settings.sttOptions?.temperature && typeof settings.sttOptions.temperature === 'number') {
    //   formData.append('temperature', settings.sttOptions.temperature.toString());
    // }


    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;
    
    if (response.data.transcription?.trim()) {
      sendTranscriptionToParent(response.data.transcription.trim());
    } else if (response.data.transcription === "" && settings.audioInputMode !== 'continuous') { // Avoid toast for empty continuous segments
      toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper: Empty transcription detected.', duration: 3000 });
    } else if (response.data.transcription === "") {
        console.log("[VoiceInput] Whisper: Empty transcription for continuous segment.");
    } else {
      throw new Error(response.data.message || 'Whisper API returned invalid transcription.');
    }
  } catch (error: any) {
    console.error("[VoiceInput] Whisper API Error:", error);
    toast?.add({ type: 'error', title: 'Whisper STT Failed', message: error.response?.data?.message || error.message || "Transcription failed." });
  } finally {
    isTranscribingCurrentSegment.value = false;
    // If in continuous Whisper mode and MediaRecorder isn't active (meaning it stopped and this transcription is done), restart it.
    if (isContinuousMode.value && sttPreference.value === 'whisper_api' && !isMediaRecorderActive.value && permissionStatus.value === 'granted') {
        console.log("[VoiceInput] Continuous Whisper: Transcription finished, restarting MediaRecorder for next segment.");
        startWhisperMediaRecorder();
    }
  }
};

// --- Audio Capture Control (Main Entry Points) ---
/** Starts audio capture based on current mode and STT preference. */
const startAudioCapture = async () => {
  if (props.isProcessing && !isContinuousMode.value && !isVoiceActivationMode.value /* allow continuous/VAD to start even if LLM busy */) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.' });
    return;
  }
  if (isSelfProcessingAudio.value) { // Already recording or transcribing a chunk
    console.warn("[VoiceInput] startAudioCapture called while already self-processing audio.");
    return;
  }
  if (!(await ensureMicrophoneAccessAndStream())) {
    toast?.add({ type: 'error', title: 'Mic Required', message: permissionMessage.value || 'Microphone access is required.' });
    return;
  }

  console.log(`[VoiceInput] Attempting to start audio capture. Mode: ${settings.audioInputMode}, STT: ${sttPreference.value}`);

  if (isPttMode.value) {
    if (sttPreference.value === 'browser_webspeech_api') await startBrowserWebSpeechRecognition();
    else await startWhisperMediaRecorder();
  } else if (isContinuousMode.value) {
    if (sttPreference.value === 'browser_webspeech_api') await startBrowserWebSpeechRecognition();
    else await startWhisperMediaRecorder(); // Segmentation handled by silence/duration detection
  } else if (isVoiceActivationMode.value) {
    // VAD always starts by listening for wake word (using dedicated WebSpeech instance)
    await initializeAndStartVADWakeWordRecognition();
  }
};

/** Stops all active audio capture and processing. */
const stopAudioCapture = (abortWebSpeechIfContinuousOrVAD = false) => {
  console.log(`[VoiceInput] stopAudioCapture called. Abort: ${abortWebSpeechIfContinuousOrVAD}`);
  if (sttPreference.value === 'browser_webspeech_api') {
    stopBrowserWebSpeechRecognition(isContinuousMode.value || isVoiceActivationMode.value ? abortWebSpeechIfContinuousOrVAD : false);
  } else if (sttPreference.value === 'whisper_api') {
    if (isMediaRecorderActive.value) stopWhisperMediaRecorder();
  }
  
  stopVADWakeWordRecognition(true); // Always abort VAD wake word listener if active

  // Cleanup for Browser WebSpeech continuous mode if it was active and has pending text
  if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && continuousModeAutoSend.value && abortWebSpeechIfContinuousOrVAD) {
    sendPendingWebSpeechTranscriptionAndClear();
  }
  
  // General cleanup
  clearRecordingSegmentTimer();
  clearPauseTimerForWebSpeech();
  stopAudioLevelMonitoringForSilence();
  stopAudioVisualisation();
  pauseDetectedWebSpeech.value = false;
};

/** Master cleanup function for all audio processes. */
const stopAllAudioProcessing = async (abortAll: boolean = true) => {
  console.log(`[VoiceInput] Stopping all audio processing. Abort: ${abortAll}`);
  
  // Stop WebSpeech instances
  if (webSpeechRecognition && isBrowserWebSpeechActive.value) {
    try { if (abortAll) webSpeechRecognition.abort(); else webSpeechRecognition.stop(); } catch (e) { console.warn('[VoiceInput] Error stopping main WebSpeech:', e); }
  }
  stopBrowserWebSpeechRecognitionInternalStates();
  stopVADWakeWordRecognition(abortAll);

  // Stop MediaRecorder
  if (mediaRecorder && isMediaRecorderActive.value) {
    try { mediaRecorder.stop(); } catch (e) { console.warn('[VoiceInput] Error stopping MediaRecorder:', e); }
  }
  isMediaRecorderActive.value = false;

  // Release MediaStream and AudioContext
  if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); activeStream = null; }
  if (microphoneSourceNode) { microphoneSourceNode.disconnect(); microphoneSourceNode = null; }
  if (analyser) { analyser.disconnect(); analyser = null; }
  if (audioContext && audioContext.state !== 'closed') { await audioContext.close().catch(e => console.warn('[VoiceInput] Error closing AudioContext:', e)); audioContext = null; }
  
  // Clear timers and intervals
  stopAudioLevelMonitoringForSilence();
  stopAudioVisualisation();
  clearRecordingSegmentTimer();
  clearPauseTimerForWebSpeech();
  if (vadSilenceMonitorIntervalId) { clearInterval(vadSilenceMonitorIntervalId); vadSilenceMonitorIntervalId = null; }


  // Reset states
  interimTranscriptWebSpeech.value = ''; finalTranscriptWebSpeech.value = '';
  liveTranscriptWebSpeech.value = ''; pendingTranscriptWebSpeech.value = '';
  pauseDetectedWebSpeech.value = false; pauseCountdownWebSpeech.value = 0;
  isTranscribingCurrentSegment.value = false; // Ensure this is reset
  audioChunks = []; // Clear any pending audio chunks
};


// --- UI Event Handlers & Logic ---
/** Handles main microphone button click/press/release. */
const handleMicButtonInteraction = async (eventType: 'down' | 'up' | 'click') => {
  if (props.isProcessing && !isContinuousMode.value && !isVoiceActivationMode.value) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.' });
    return;
  }
   // If STT is busy for the current chunk, don't allow new PTT/click actions until it's done
  if (isTranscribingCurrentSegment.value && (isPttMode.value || eventType === 'click')) {
    toast?.add({ type: 'info', title: 'Processing Audio', message: 'Please wait for current audio to finish transcribing.' });
    return;
  }


  if (isPttMode.value) {
    if (eventType === 'down') {
      if (!isSelfProcessingAudio.value) await startAudioCapture();
    } else if (eventType === 'up') {
      if (isSelfProcessingAudio.value) stopAudioCapture();
    }
  } else { // Click for continuous or VAD
    if (eventType === 'click') {
      if (isSelfProcessingAudio.value || isVADListeningForWakeWord.value) {
        await stopAudioCapture(true); // Force stop for continuous/VAD
      } else {
        await startAudioCapture();
      }
    }
  }
};

/** Handles text input submission. */
const handleTextSubmit = () => {
  if (textInput.value.trim() && !isSelfProcessingAudio.value && !props.isProcessing) {
    sendTranscriptionToParent(textInput.value.trim());
    textInput.value = '';
    nextTick(() => handleTextareaInput());
  }
};

/** Emits transcription to parent component and updates history. */
const sendTranscriptionToParent = (text: string) => {
  if (text.trim()) {
    emit('transcription', text.trim());
    const newHistoryItem: TranscriptionHistoryItem = { id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, text: text.trim(), timestamp: Date.now(), sent: true };
    transcriptionHistory.value = [newHistoryItem, ...transcriptionHistory.value].slice(0, 20); // Keep last 20
  }
};
/** Resends a transcription from history. */
const resendTranscription = (item: TranscriptionHistoryItem) => {
  sendTranscriptionToParent(item.text);
  toast?.add({ type: 'info', title: 'Resent', message: `Resent: "${item.text.substring(0,30)}..."`, duration: 2000});
};


// --- Continuous Mode WebSpeech: Pause Detection & Sending ---
/** Sends pending WebSpeech transcription and clears related states. */
const sendPendingWebSpeechTranscriptionAndClear = () => {
  if (pendingTranscriptWebSpeech.value.trim()) {
    sendTranscriptionToParent(pendingTranscriptWebSpeech.value.trim());
  }
  clearPendingWebSpeechTranscriptionStates();
};
/** Clears states related to pending WebSpeech transcription. */
const clearPendingWebSpeechTranscriptionStates = () => {
  pendingTranscriptWebSpeech.value = '';
  liveTranscriptWebSpeech.value = '';
  interimTranscriptWebSpeech.value = ''; // Clear this too, as it might hold partials
  clearPauseTimerForWebSpeech();
  pauseDetectedWebSpeech.value = false;
  pauseCountdownWebSpeech.value = 0;
};
/** Resets or starts the pause detection mechanism for continuous WebSpeech. */
const resetPauseDetectionForWebSpeech = () => {
  clearPauseTimerForWebSpeech();
  pauseDetectedWebSpeech.value = false;
  pauseCountdownWebSpeech.value = 0;

  if (isContinuousMode.value && sttPreference.value === 'browser_webspeech_api' && pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value) {
    const timeoutMs = settings.continuousModePauseTimeoutMs || 3000;
    pauseTimerIdWebSpeech = setTimeout(() => {
      if (pendingTranscriptWebSpeech.value.trim() && isBrowserWebSpeechActive.value && continuousModeAutoSend.value && isContinuousMode.value) {
        pauseDetectedWebSpeech.value = true;
        pauseCountdownWebSpeech.value = timeoutMs; // Set initial countdown
        
        const countdownInterval = setInterval(() => {
          if (!pauseDetectedWebSpeech.value || !isContinuousMode.value || !isBrowserWebSpeechActive.value) {
            clearInterval(countdownInterval);
            pauseDetectedWebSpeech.value = false; // Ensure reset if state changes
            return;
          }
          pauseCountdownWebSpeech.value -= 100;
          if (pauseCountdownWebSpeech.value <= 0) {
            clearInterval(countdownInterval);
            if (pauseDetectedWebSpeech.value && isContinuousMode.value && pendingTranscriptWebSpeech.value.trim()) {
              sendPendingWebSpeechTranscriptionAndClear();
            }
            pauseDetectedWebSpeech.value = false; // Reset after send
          }
        }, 100);
      }
    }, 1000); // Initial delay before starting pause countdown logic
  }
};
/** Clears the WebSpeech pause detection timer. */
const clearPauseTimerForWebSpeech = () => { if(pauseTimerIdWebSpeech !== null) clearTimeout(pauseTimerIdWebSpeech); pauseTimerIdWebSpeech = null;};

// --- Edit Modal Logic (for pending WebSpeech transcription) ---
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
    pendingTranscriptWebSpeech.value = editingTranscription.value.trim(); sendPendingWebSpeechTranscriptionAndClear();
  }
  showEditModal.value = false; editingTranscription.value = '';
};
const cancelEdit = () => {
  showEditModal.value = false; editingTranscription.value = '';
};

// --- Timers for Recording Segment ---
/** Starts the timer for MediaRecorder segment duration. */
const startRecordingSegmentTimer = () => {
  clearRecordingSegmentTimer();
  recordingSegmentSeconds.value = 0;
  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1;
    // For continuous Whisper, check max segment duration
    if (isContinuousMode.value && sttPreference.value === 'whisper_api' && isMediaRecorderActive.value && recordingSegmentSeconds.value >= MAX_SEGMENT_DURATION_S) {
      console.log(`[VoiceInput] Continuous Whisper: Max segment duration (${MAX_SEGMENT_DURATION_S}s) reached. Stopping current segment.`);
      stopWhisperMediaRecorder(); // This will trigger onstop, which sends the chunk and restarts
    }
    // For PTT Whisper, also apply a max duration (e.g. 60s)
    else if (isPttMode.value && sttPreference.value === 'whisper_api' && isMediaRecorderActive.value && recordingSegmentSeconds.value >= 60) {
        toast?.add({type:'info', title:'Recording Limit', message:'Max PTT recording (60s) reached.'});
        stopWhisperMediaRecorder();
    }
  }, 100);
};
/** Clears the MediaRecorder segment timer. */
const clearRecordingSegmentTimer = () => { if(recordingSegmentTimerId !== null) clearInterval(recordingSegmentTimerId); recordingSegmentTimerId = null; recordingSegmentSeconds.value = 0;};

/** Cleans up WebSpeech specific transcript states. */
const cleanUpAfterWebSpeechTranscription = () => { interimTranscriptWebSpeech.value=''; finalTranscriptWebSpeech.value=''; liveTranscriptWebSpeech.value='';};

// --- Silence Detection for Continuous Whisper ---
/** Starts monitoring audio levels for silence detection or max duration. */
const startAudioLevelMonitoringForSilence = () => {
  if (!analyser || !activeStream?.active || !isMediaRecorderActive.value) return;
  if (vadSilenceMonitorIntervalId !== null) clearInterval(vadSilenceMonitorIntervalId);
  
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  vadSilenceMonitorIntervalId = setInterval(() => {
    if (!analyser || !isMediaRecorderActive.value) { // Stop if recorder stops or analyser gone
      stopAudioLevelMonitoringForSilence();
      return;
    }
    analyser.getByteFrequencyData(dataArray); // More responsive for VAD
    // A more robust VAD would analyze frequency data more deeply.
    // For simplicity, check if average level is below a threshold.
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const averageByteFreq = dataArray.length > 0 ? sum / dataArray.length : 0;
    // Convert byte value (0-255) to dBFS-like range. AnalyserNode's getByteFrequencyData returns values in dB,
    // but typically scaled. If minDecibels is -100 and maxDecibels is 0, 0 byte value means -100dB, 255 means 0dB.
    // This is a simplified mapping; a proper dBFS calculation needs calibration.
    const levelInDb = analyser.minDecibels + (averageByteFreq / 255) * (analyser.maxDecibels - analyser.minDecibels);

    if (levelInDb < SILENCE_DBFS_THRESHOLD) { // Potentially silent
      if (silenceStartTime === null) {
        silenceStartTime = Date.now();
      }
      vadSilenceDetectedDuration.value = Date.now() - silenceStartTime;
      if (vadSilenceDetectedDuration.value >= minSilenceDurationForSegmentEndMs.value) {
        console.log(`[VoiceInput] Continuous Whisper: Silence detected for ${minSilenceDurationForSegmentEndMs.value}ms. Stopping current segment.`);
        stopWhisperMediaRecorder(); // This will trigger onstop, send chunk, and restart recorder
        silenceStartTime = null; // Reset for next segment
        vadSilenceDetectedDuration.value = 0;
      }
    } else { // Speech detected
      silenceStartTime = null;
      vadSilenceDetectedDuration.value = 0;
    }
  }, 250); // Check for silence every 250ms
};
/** Stops monitoring audio levels for silence. */
const stopAudioLevelMonitoringForSilence = () => {
  if (vadSilenceMonitorIntervalId !== null) clearInterval(vadSilenceMonitorIntervalId);
  vadSilenceMonitorIntervalId = null;
  vadSilenceDetectedDuration.value = 0;
};

// --- VAD Visualization (Canvas) ---
/** Starts the VAD visualization rendering loop. */
const startAudioVisualisation = () => {
  if (!analyser || !activeStream?.active) return;
  if (audioVisualisationIntervalId !== null) clearInterval(audioVisualisationIntervalId);
  
  audioVisualisationIntervalId = setInterval(() => {
    if (!analyser || !activeStream?.active || !vadCanvasRef.value || 
        !(isVoiceActivationMode.value && sttPreference.value === 'whisper_api' && isMediaRecorderActive.value && !isVADListeningForWakeWord.value) ) {
      // Condition changed: VAD canvas is only for (isVoiceActivationMode && sttPreference === 'whisper_api' && isMediaRecorderActive && !isVADListeningForWakeWord)
      // So, the interval should only try to draw if these conditions are met.
      if (vadCanvasRef.value) { // Clear canvas if not applicable
        const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
      }
      stopAudioVisualisation(); // Stop interval if conditions no longer met
      return;
    }
    drawVADVisualization();
  }, 100); // Draw ~10fps
};
/** Stops the VAD visualization. */
const stopAudioVisualisation = () => {
  if (audioVisualisationIntervalId !== null) clearInterval(audioVisualisationIntervalId);
  audioVisualisationIntervalId = null;
  if (vadCanvasRef.value) { // Clear canvas on stop
    const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
  }
};
/** Draws the VAD visualization on the canvas. */
const drawVADVisualization = () => {
  const canvas = vadCanvasRef.value;
  if (!canvas || !analyser || !isMediaRecorderActive.value) return;
  
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const bufferLength = analyser.frequencyBinCount; const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray); // Use frequency data for more visual appeal

  const width = canvas.width; const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  
  const barWidth = (width / bufferLength) * 2.0; // Slightly narrower bars
  let x = 0;
  // Use theme variables for color
  const baseHue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-h').trim() || '270');
  const baseSat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-s').trim() || '90%');

  for (let i = 0; i < bufferLength; i++) {
    const barHeightFraction = dataArray[i] / 255;
    const barHeight = Math.max(1, barHeightFraction * height); // Ensure min height of 1px
    
    const lightness = 40 + barHeightFraction * 40; // Adjust lightness range for better visibility
    const alpha = 0.3 + barHeightFraction * 0.6; // Adjust alpha range
    
    ctx.fillStyle = `hsla(${baseHue}, ${baseSat}%, ${lightness}%, ${alpha})`;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1; // Bar width + 1px spacing
  }
};


// --- Computed UI Text & Titles ---
/** Gets the title for the main microphone button based on current state. */
const getButtonTitle = (): string => {
  if (props.isProcessing && !isContinuousMode.value && !isVoiceActivationMode.value) return 'Assistant is processing... Input temporarily disabled.';
  if (isTranscribingCurrentSegment.value) return 'Transcribing current audio segment...';

  if (!micAccessInitiallyChecked.value && permissionStatus.value === '') return 'Initializing microphone...';
  if (permissionStatus.value === 'denied') return 'Microphone access denied. Please check browser/OS settings.';
  if (permissionStatus.value === 'error') return `Microphone error: ${permissionMessage.value || 'Unknown error'}.`;

  if (isMediaRecorderActive.value || (isBrowserWebSpeechActive.value && !isVADListeningForWakeWord.value)) { // Actively recording user command/speech
    if (isContinuousMode.value) return 'Stop continuous listening';
    if (isVoiceActivationMode.value && !isVADListeningForWakeWord.value) return 'Stop VAD command recording';
    return 'Release to stop recording (PTT)';
  }
  if (isVoiceActivationMode.value && isVADListeningForWakeWord.value) {
    return 'Listening for wake word "Vee"... (Click microphone to stop VAD mode)';
  }

  const currentMode = audioModeOptions.value.find(m => m.value === settings.audioInputMode);
  if (currentMode) return currentMode.value === 'push-to-talk' ? `Hold for ${currentMode.label}` : `Click to start ${currentMode.label}`;
  return 'Activate Microphone';
};

/** Gets placeholder text for the textarea based on current state. */
const getPlaceholderText = (): string => {
  const method = sttPreference.value === 'whisper_api' ? 'Whisper API' : 'Browser STT';
  if (isMediaRecorderActive.value || (isBrowserWebSpeechActive.value && !isVADListeningForWakeWord.value)) { // Actively recording user command/speech
    if (isPttMode.value) return `Recording (${method})... release to send.`;
    if (isContinuousMode.value) return `Listening continuously (${method})... segment will send on pause. Or type here.`;
    if (isVoiceActivationMode.value && !isVADListeningForWakeWord.value) return `Voice active, listening for command (${method})... or type.`;
  }
  if (isVoiceActivationMode.value && isVADListeningForWakeWord.value) {
    return `Say "Vee" to activate (${method}), or type here...`;
  }
  if (isContinuousMode.value) return `Continuous mode (${method}) ready. Click mic to start, or type...`;
  return `Type message, or ${ isPttMode.value ? 'hold mic for PTT' : 'click mic to start ' + currentAudioModeLabel.value.toLowerCase() } (${method})...`;
};

/** Gets class for the mode indicator dot based on current state. */
const getModeIndicatorClass = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'processing-llm'; // Distinct color for LLM processing
  if (isTranscribingCurrentSegment.value) return 'processing-stt';
  if (isMediaRecorderActive.value || (isBrowserWebSpeechActive.value && !isVADListeningForWakeWord.value)) return 'active'; // General active recording
  if ((isContinuousMode.value || (isVoiceActivationMode.value && isVADListeningForWakeWord.value)) && permissionStatus.value === 'granted') return 'standby'; // Ready and waiting
  return 'idle';
};

/** Gets text for the main recording status display area. */
const getRecordingStatusText = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant processing previous input...';
  if (isTranscribingCurrentSegment.value) return sttPreference.value === 'whisper_api' ? 'Whisper processing audio segment...' : 'Finalizing browser transcription...';
  
  const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';

  if (isPttMode.value && (isMediaRecorderActive.value || isBrowserWebSpeechActive.value)) return `Recording (PTT ${method})... ${formatDuration(recordingSegmentSeconds.value)}`;
  
  if (isContinuousMode.value) {
    if (sttPreference.value === 'browser_webspeech_api') {
      if (pauseDetectedWebSpeech.value) return 'Pause detected, auto-sending...';
      return isBrowserWebSpeechActive.value ? `Listening continuously (${method})...` : `Continuous mode ready (${method}).`;
    } else { // Whisper continuous
      return isMediaRecorderActive.value ? `Listening continuously (Whisper)... Segment: ${formatDuration(recordingSegmentSeconds.value)}` : `Continuous Whisper ready.`;
    }
  }
  
  if (isVoiceActivationMode.value) {
    if (isVADListeningForWakeWord.value) return `Awaiting wake word "Vee" (${sttPreference.value === 'whisper_api' ? 'WebSpeech for VAD' : method})...`;
    if (isMediaRecorderActive.value || isBrowserWebSpeechActive.value) return `Voice active, recording command (${method})... ${formatDuration(recordingSegmentSeconds.value)}`;
    return `VAD mode ready (${method}).`;
  }
  return 'Ready for your input.';
};

/** Gets text for the idle status display area (when not actively recording). */
const getIdleStatusText = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant Processing...';
  if (isTranscribingCurrentSegment.value) return 'Transcribing Audio...';
  if (permissionStatus.value === 'granted') {
    const modeOpt = audioModeOptions.value.find(m => m.value === settings.audioInputMode);
    return `${modeOpt ? modeOpt.label : 'Audio Input'} Ready`;
  }
  if (permissionStatus.value === 'denied' || permissionStatus.value === 'error') return "Microphone Inactive/Error";
  if (permissionStatus.value === 'prompt') return "Awaiting Microphone Permission...";
  return 'Initializing Audio...';
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  document.addEventListener('click', handleClickOutsideAudioModeDropdown, true);
  if (typeof window !== 'undefined') {
    initializeWebSpeechRecognition(); // Main instance for Browser STT
    if (settings.audioInputMode === 'voice-activation') {
        initializeAndStartVADWakeWordRecognition(); // Instance for VAD wake word
    }
  }

  if (navigator.permissions) {
    try {
      const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      permissionStatus.value = perm.state; 
      emit('permission-update', perm.state);
      if (perm.state === 'granted') {
        permissionMessage.value = '';
        // If continuous or VAD mode is default, and permissions are granted, try to start capture
        if ((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isSelfProcessingAudio.value && !props.isProcessing) {
          await startAudioCapture();
        }
      } else if (perm.state === 'prompt') { permissionMessage.value = 'Click microphone icon to grant access.'; }
      else { permissionMessage.value = 'Microphone access denied. Check browser/OS settings.'; }
      micAccessInitiallyChecked.value = true;

      perm.onchange = async () => { // Handle dynamic permission changes
        const newState = perm.state;
        console.log("[VoiceInput] Microphone permission changed to:", newState);
        permissionStatus.value = newState; 
        emit('permission-update', newState);
        if(newState === 'granted'){ 
            permissionMessage.value = 'Microphone ready.'; 
            if((settings.audioInputMode === 'continuous' || settings.audioInputMode === 'voice-activation') && !isSelfProcessingAudio.value && !props.isProcessing) {
                await startAudioCapture();
            }
        } else if (newState === 'denied'){ 
            permissionMessage.value = 'Microphone access denied by user or system.'; 
            if(isSelfProcessingAudio.value || isVADListeningForWakeWord.value) await stopAllAudioProcessing(true); 
        } else { // prompt
            permissionMessage.value = 'Microphone access requires user action.'; 
            if(isSelfProcessingAudio.value || isVADListeningForWakeWord.value) await stopAllAudioProcessing(true); 
        }
      };
    } catch (e) {
      console.warn("[VoiceInput] Error querying microphone permission state:", e);
      permissionStatus.value = 'error'; permissionMessage.value = 'Could not query microphone permission.';
      emit('permission-update', 'error'); micAccessInitiallyChecked.value = true;
    }
  } else { // navigator.permissions not supported
    micAccessInitiallyChecked.value = true; 
    permissionMessage.value = 'Browser does not support dynamic permission queries. Click mic to attempt access.';
    // Manual attempt might be needed or rely on first getUserMedia call.
  }
  nextTick(() => handleTextareaInput()); // Adjust textarea on mount
});

onBeforeUnmount(async () => {
  document.removeEventListener('click', handleClickOutsideAudioModeDropdown, true);
  await stopAllAudioProcessing(true); // Ensure all resources are released

  // Clean up permission change listener
  if (navigator.permissions && navigator.permissions.query) {
    try {
        const permStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        permStatus.onchange = null;
    } catch (e) { console.warn("[VoiceInput] Error removing permission listener:", e); }
  }
  // Nullify SpeechRecognition instances to help GC
  if (webSpeechRecognition) { webSpeechRecognition.onstart = null; webSpeechRecognition.onresult = null; webSpeechRecognition.onerror = null; webSpeechRecognition.onend = null; webSpeechRecognition = null; }
  if (vadWakeWordDetectionRecognition) { vadWakeWordDetectionRecognition.onstart = null; vadWakeWordDetectionRecognition.onresult = null; vadWakeWordDetectionRecognition.onerror = null; vadWakeWordDetectionRecognition.onend = null; vadWakeWordDetectionRecognition = null;}
  if (mediaRecorder) { mediaRecorder.ondataavailable = null; mediaRecorder.onstop = null; mediaRecorder.onerror = null; mediaRecorder = null; }
});
</script>

<template>
  <div class="voice-input-panel-ephemeral" :class="currentPanelStateClasses" :aria-busy="props.isProcessing || isSelfProcessingAudio">
    <div
      v-if="isSelfProcessingAudio && (interimTranscriptWebSpeech || liveTranscriptWebSpeech || pendingTranscriptWebSpeech || (sttPreference === 'whisper_api' && isMediaRecorderActive))"
      class="live-transcript-display-ephemeral"
      aria-live="polite"
    >
      <p v-if="interimTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && (isPttMode || (isVoiceActivationMode && !isVADListeningForWakeWord))" class="interim-transcript-ephemeral" aria-label="Interim transcription">
        {{ interimTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="liveTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="finalized-part-ephemeral" aria-label="Live transcription">
        {{ liveTranscriptWebSpeech }}<span class="streaming-cursor-ephemeral">|</span>
      </p>
      <p v-if="pendingTranscriptWebSpeech && sttPreference === 'browser_webspeech_api' && isContinuousMode" class="pending-transcript-ephemeral" aria-label="Pending transcription">
        <span class="font-semibold text-xs text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]">Pending: </span> {{ pendingTranscriptWebSpeech }}
      </p>
      <div v-if="sttPreference === 'whisper_api' && isMediaRecorderActive && !isVADListeningForWakeWord" class="whisper-status-ephemeral flex items-center justify-center text-xs" aria-label="Recording for Whisper API">
              <CloudArrowUpIcon class="icon-xs inline mr-1.5 animate-pulse" /> Recording for Whisper ({{ formatDuration(recordingSegmentSeconds) }})
      </div>
      <div v-if="isVoiceActivationMode && isVADListeningForWakeWord" class="vad-wake-word-status text-xs text-center italic py-1 text-[hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l))]">
        Say "Vee" to activate... <MagicIcon class="inline h-3 w-3 ml-1 opacity-70 animate-pulse" />
      </div>
    </div>

    <div class="input-area-ephemeral" :class="textInputProminenceClass">
      <textarea
        ref="textareaRef"
        v-model="textInput"
        @input="handleTextareaInput"
        @keyup.enter.exact.prevent="!isSelfProcessingAudio && textInput.trim() && !props.isProcessing && handleTextSubmit()"
        @keydown.enter.shift.exact.prevent="textInput += '\n'; nextTick(handleTextareaInput)"
        class="voice-textarea-ephemeral"
        :placeholder="getPlaceholderText()"
        :disabled="isSelfProcessingAudio || props.isProcessing"
        aria-label="Text input for chat"
        rows="1"
      ></textarea>
      <button
        @click="handleTextSubmit"
        :disabled="!textInput.trim() || isSelfProcessingAudio || props.isProcessing"
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
        @mousedown="handleMicButtonInteraction('down')"
        @mouseup="handleMicButtonInteraction('up')"
        @mouseleave="isPttMode && (isBrowserWebSpeechActive || isMediaRecorderActive) ? handleMicButtonInteraction('up') : null"
        @keydown.space.prevent="isPttMode && !props.isProcessing && !isTranscribingCurrentSegment && !isBrowserWebSpeechActive && !isMediaRecorderActive ? handleMicButtonInteraction('down') : null"
        @keyup.space.prevent="isPttMode && (isBrowserWebSpeechActive || isMediaRecorderActive) ? handleMicButtonInteraction('up') : null"
        @touchstart.prevent="handleMicButtonInteraction('down')"
        @touchend.prevent="handleMicButtonInteraction('up')"
        @click="!isPttMode ? handleMicButtonInteraction('click') : null"
        class="mic-button-ephemeral"
        :class="{
          'listening': (isMediaRecorderActive || (isBrowserWebSpeechActive && !isVADListeningForWakeWord)) && !isTranscribingCurrentSegment,
          'processing-stt': isTranscribingCurrentSegment,
          'processing-llm': props.isProcessing && !isSelfProcessingAudio,
          'mic-error': permissionStatus === 'error',
          'mic-denied': permissionStatus === 'denied'
        }"
        :title="getButtonTitle()"
        :aria-pressed="isMediaRecorderActive || isBrowserWebSpeechActive"
        :disabled="(props.isProcessing && !isContinuousMode && !isVoiceActivationMode) || (isTranscribingCurrentSegment && !isContinuousMode) || (!micAccessInitiallyChecked && permissionStatus !== 'granted' && permissionStatus !== 'prompt')"
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
         <button v-if="(isContinuousMode || isVoiceActivationMode) && (isSelfProcessingAudio || isVADListeningForWakeWord)" @click="() => stopAudioCapture(true)" class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral stop-btn-ephemeral" title="Stop Current Listening/Recording">
          <StopCircleIcon class="icon-base" aria-hidden="true"/>
        </button>
      </div>
    </div>

    <canvas
      v-if="isVoiceActivationMode && sttPreference === 'whisper_api' && isMediaRecorderActive && !isVADListeningForWakeWord"
      ref="vadCanvasRef"
      class="vad-canvas-ephemeral"
      width="300" height="30"
      aria-label="Voice activity visualization during VAD command recording for Whisper">
    </canvas>
    <div v-if="isVoiceActivationMode && sttPreference === 'browser_webspeech_api' && isBrowserWebSpeechActive && !isVADListeningForWakeWord" class="web-speech-vad-active-indicator">
      Browser STT: Listening for command...
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
              <h3 id="edit-title" class="modal-title-ephemeral">Edit Pending Transcription</h3>
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
// Styles for VoiceInput are primarily in frontend/src/styles/components/_voice-input.scss
// and other global SCSS files (e.g., _animations.scss for 'blink').

.streaming-cursor-ephemeral {
  animation: blink 1s step-end infinite;
}
// Ensure blink animation is defined:
// @keyframes blink { 50% { opacity: 0; } }
</style>