<script setup lang="ts">
/**
 * @file VoiceInput.vue
 * @description Core component for handling voice and text input. Orchestrates STT handlers.
 * @version 5.0.9 (Refined permission handling and STT start logic)
 */
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
  type Ref,
  readonly
} from 'vue';
import {
  voiceSettingsManager,
  type AudioInputMode,
  type VoiceApplicationSettings,
  type STTPreference
} from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';

import BrowserSpeechHandler from './BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './WhisperSpeechHandler.vue';
import { useMicrophone } from './useMicrophone';

import {
  ClockIcon, XMarkIcon, PaperAirplaneIcon,
  SpeakerWaveIcon as ContinuousModeIcon,
  ChevronDownIcon,
  HandRaisedIcon as PTTModeIcon,
  CpuChipIcon,
  PencilIcon, StopCircleIcon, MicrophoneIcon,
} from '@heroicons/vue/24/outline';
import { CheckIcon as SolidCheckIcon } from '@heroicons/vue/24/solid';

const VADModeIcon = CpuChipIcon;

interface TranscriptionHistoryItem { id: string; text: string; timestamp: number; sent: boolean; }
interface AudioModeOption { label: string; value: AudioInputMode; icon: VueComponentType; description: string; }

const props = defineProps({
  isProcessing: { type: Boolean as PropType<boolean>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'permission-update', status: 'granted' | 'denied' | 'prompt' | 'error'): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');
const settingsFromManager: VoiceApplicationSettings = voiceSettingsManager.settings;
const settingsRefForComposable: Ref<VoiceApplicationSettings> = ref(settingsFromManager);

const {
  activeStream,
  analyser,
  permissionStatus: micPermissionStatus, // This is the reactive source of truth from useMicrophone
  permissionMessage: micPermissionMessage,
  micAccessInitiallyChecked,
  ensureMicrophoneAccessAndStream, // Call this to ensure permission and get stream
  releaseAllMicrophoneResources
} = useMicrophone({
  settings: settingsRefForComposable,
  toast,
  onPermissionUpdateGlobally: (status) => { // This callback updates VoiceInput's parent
    emit('permission-update', status);
  }
});

const browserSpeechHandlerRef = ref<InstanceType<typeof BrowserSpeechHandler> | null>(null);
const whisperSpeechHandlerRef: Ref<InstanceType<typeof WhisperSpeechHandler> | null> = ref(null);

const textInput: Ref<string> = ref('');
const textareaRef: Ref<HTMLTextAreaElement | null> = ref(null);
const editModalTextareaRef: Ref<HTMLTextAreaElement | null> = ref(null);
const isChildSttProcessingAudio: Ref<boolean> = ref(false);
const isChildListeningForWakeWord: Ref<boolean> = ref(false);
const transcriptionHistory: Ref<TranscriptionHistoryItem[]> = ref(
  JSON.parse(localStorage.getItem('vca-transcriptionHistory-v3.1') || '[]')
);
const showTranscriptionHistory: Ref<boolean> = ref(false);
const showAudioModeDropdown: Ref<boolean> = ref(false);
const audioModeDropdownRef: Ref<HTMLElement | null> = ref(null);
const showEditModal: Ref<boolean> = ref(false);
const editingTranscription: Ref<string> = ref('');
const pendingBrowserTranscriptForEdit: Ref<string> = ref('');

const sttPreference = computed<STTPreference>(() => settingsFromManager.sttPreference);
const currentAudioMode = computed<AudioInputMode>(() => settingsFromManager.audioInputMode);
const isSelfProcessingAudio = computed<boolean>(() => isChildSttProcessingAudio.value || isChildListeningForWakeWord.value);
const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'PTT (Click Toggle)', value: 'push-to-talk', icon: PTTModeIcon, description: "Click mic to start. Click again to stop." },
  { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon, description: "Mic listens, sends on pause." },
  { label: 'Voice Activate ("V")', value: 'voice-activation', icon: VADModeIcon, description: "Say 'V' to activate, then speak command." },
]);
const currentAudioModeDetails = computed(() => audioModeOptions.value.find(m => m.value === currentAudioMode.value));
const currentAudioModeLabel = computed<string>(() => currentAudioModeDetails.value?.label || 'Mode');
const currentAudioModeIcon = computed<VueComponentType>(() => currentAudioModeDetails.value?.icon || MicrophoneIcon);

const currentPanelStateClasses = computed(() => ({
  'processing-llm': props.isProcessing && !isSelfProcessingAudio.value,
  'processing-stt': isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value,
  'microphone-error': micPermissionStatus.value === 'error',
  'microphone-denied': micPermissionStatus.value === 'denied',
  'mic-active': isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value,
  'vad-wake-word-listening': isVoiceActivationMode.value && isChildListeningForWakeWord.value && !props.isProcessing,
}));
const textInputProminenceClass = computed<string>(() => {
  if (isContinuousMode.value && isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value) return 'input-prominence-subtle';
  if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return 'input-prominence-focused-wake';
  return 'input-prominence-default';
});

const sendTranscriptionToParent = (text: string) => {
  if (text.trim()) {
    emit('transcription', text.trim());
    const newHistoryItem: TranscriptionHistoryItem = { id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, text: text.trim(), timestamp: Date.now(), sent: true };
    transcriptionHistory.value = [newHistoryItem, ...transcriptionHistory.value].slice(0, 20);
  }
};

const onChildTranscription = (text: string) => { sendTranscriptionToParent(text); };
const onChildProcessingAudio = (isProcessing: boolean) => { isChildSttProcessingAudio.value = isProcessing; };
const onChildListeningForWakeWord = (isListening: boolean) => { isChildListeningForWakeWord.value = isListening; };
const onChildError = (payload: { type: string; message: string; code?: string }) => {
  console.error(`[VoiceInput] Error from child STT handler (${payload.type}): ${payload.message} ${payload.code || ''}`);
  // micPermissionStatus is primarily managed by useMicrophone, but child can report specific errors
  if (payload.type === 'permission') {
    toast?.add({ type: 'error', title: 'Mic Permission Issue', message: payload.message });
    // useMicrophone's onPermissionUpdateGlobally should have already emitted the status change
  } else if (['init', 'recorder', 'api', 'speech'].includes(payload.type)) {
      toast?.add({type: 'error', title: `STT Error (${payload.type})`, message: payload.message});
  }
};

const _triggerPttStart = async () => {
    const pttHandler = sttPreference.value === 'browser_webspeech_api'
                          ? browserSpeechHandlerRef.value
                          : whisperSpeechHandlerRef.value;
    if (pttHandler) {
        console.log(`[VoiceInput] Triggering PTT start with ${sttPreference.value}`);
        pttHandler.startListening(false);
    } else {
        toast?.add({ type: 'error', title: 'Handler Error', message: `PTT handler (${sttPreference.value}) not ready.` });
    }
};

const _triggerSttHandlerStart = async (forVADCommand: boolean = false) => {
    await nextTick(); // Ensure refs are available
    if (micPermissionStatus.value !== 'granted') {
        console.warn(`[VoiceInput] Attempted to start STT but permission not granted. Status: ${micPermissionStatus.value}`);
        // Optionally, try to re-request if appropriate, or rely on user clicking PTT button
        // if (micPermissionStatus.value === 'prompt') { await ensureMicrophoneAccessAndStream(); }
        return;
    }

    if (currentAudioMode.value === 'continuous' || (currentAudioMode.value === 'voice-activation' && forVADCommand)) {
        const handler = sttPreference.value === 'browser_webspeech_api'
                            ? browserSpeechHandlerRef.value
                            : whisperSpeechHandlerRef.value;
        if (handler) {
            console.log(`[VoiceInput] Starting STT Handler (${sttPreference.value}) for mode: ${currentAudioMode.value}, VADCmd: ${forVADCommand}`);
            handler.startListening(forVADCommand);
        } else {
            console.warn(`[VoiceInput] No STT handler found for ${sttPreference.value} in mode ${currentAudioMode.value}`);
        }
    } else if (currentAudioMode.value === 'voice-activation' && !forVADCommand) { // Start VAD wake word
        if (browserSpeechHandlerRef.value) {
            browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
        } else {
             console.warn(`[VoiceInput] VAD mode selected but BrowserSpeechHandler not found for wake word.`);
        }
    }
};


const onWakeWordDetectedInVoiceInput = async () => {
    console.log("[VoiceInput] Wake word detected!");
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM is processing. Command ignored.' });
        if (browserSpeechHandlerRef.value && !isChildListeningForWakeWord.value && micPermissionStatus.value === 'granted') {
            browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
        }
        return;
    }
    // Permission should be granted if wake word was detected.
    // Stream should also be active.
    _triggerSttHandlerStart(true); // true for VADCommand
};

const stopAllAudioProcessing = async (releaseMic: boolean = true) => {
  console.log(`[VoiceInput] Stopping all audio processing. Release Mic: ${releaseMic}`);
  if (browserSpeechHandlerRef.value) await browserSpeechHandlerRef.value.stopAll(true);
  if (whisperSpeechHandlerRef.value) await whisperSpeechHandlerRef.value.stopAll();
  isChildSttProcessingAudio.value = false;
  isChildListeningForWakeWord.value = false;
  if (releaseMic) {
    await releaseAllMicrophoneResources(); // From useMicrophone
  }
};

const handleTextareaInput = () => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        const maxHeight = 150;
        textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
    }
};

const handleTextSubmit = () => {
  if (props.isProcessing) {
    toast?.add({type: 'info', title: 'Assistant Busy', message: 'Please wait for response.'});
    return;
  }
  if (textInput.value.trim() && !isSelfProcessingAudio.value) {
    sendTranscriptionToParent(textInput.value.trim());
    textInput.value = '';
    nextTick(() => handleTextareaInput());
  }
};
const handleMicButtonInteraction = async () => {
  if (!isPttMode.value) return;
  if (props.isProcessing && !((sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) || (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive))) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot start PTT while assistant is responding.' });
    return;
  }

  const pttHandler = sttPreference.value === 'browser_webspeech_api'
                      ? browserSpeechHandlerRef.value
                      : whisperSpeechHandlerRef.value;
  if (!pttHandler) {
      toast?.add({ type: 'error', title: 'Handler Error', message: `PTT handler (${sttPreference.value}) not ready.` });
      return;
  }
  let isPttCurrentlyRecording = (sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) ||
                                (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive);

  if (isPttCurrentlyRecording) {
    pttHandler.stopListening(false);
  } else {
    const micReady = await ensureMicrophoneAccessAndStream(); // This will try to get permission if 'prompt'
    if (micReady && micPermissionStatus.value === 'granted') { // Check status *after* attempt
        _triggerPttStart();
    } else {
        // micPermissionMessage from useMicrophone should already be set
        if (micPermissionStatus.value !== 'prompt') { // Don't toast if it's just prompting
             toast?.add({ type: 'error', title: 'Mic Access Denied', message: micPermissionMessage.value || 'Microphone not granted.' });
        }
    }
  }
};

const handleManualStopFromSecondaryButton = async () => {
  console.log(`[VoiceInput] Manual stop: Mode: ${currentAudioMode.value}, STT: ${sttPreference.value}`);
  let stoppedSomething = false;
  if (currentAudioMode.value === 'voice-activation') {
    if (browserSpeechHandlerRef.value) { await browserSpeechHandlerRef.value.stopAll(true); stoppedSomething = true; }
    if (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive) {
      await whisperSpeechHandlerRef.value.stopAll(); stoppedSomething = true;
    }
    if (stoppedSomething && browserSpeechHandlerRef.value && micPermissionStatus.value === 'granted' && !props.isProcessing) {
        await nextTick();
        if (!isChildListeningForWakeWord.value && !isChildSttProcessingAudio.value) {
             browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
        }
    }
  } else if (currentAudioMode.value === 'continuous') {
    const handler = sttPreference.value === 'browser_webspeech_api' ? browserSpeechHandlerRef.value : whisperSpeechHandlerRef.value;
    if (handler) await handler.stopAll(true);
  }
};

const handleEditBrowserPending = (pendingText: string) => {
    if (sttPreference.value === 'browser_webspeech_api' && isContinuousMode.value) {
        editingTranscription.value = pendingText;
        pendingBrowserTranscriptForEdit.value = pendingText;
        showEditModal.value = true;
        nextTick(() => editModalTextareaRef.value?.focus());
    }
};
const saveEdit = () => { /* ... same as before ... */ };
const cancelEdit = () => { /* ... same as before ... */ };
const resendTranscription = (item: TranscriptionHistoryItem) => { /* ... same as before, ensure :disabled="props.isProcessing" on button ... */ };
const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const toggleAudioModeDropdown = () => {
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot change mode now.' }); return;
    }
    showAudioModeDropdown.value = !showAudioModeDropdown.value;
};
const selectAudioMode = (mode: AudioInputMode) => {
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot change mode now.' });
        showAudioModeDropdown.value = false; return;
    }
    voiceSettingsManager.updateSetting('audioInputMode', mode);
    showAudioModeDropdown.value = false;
};
const handleClickOutsideAudioModeDropdown = (event: MouseEvent) => { if (audioModeDropdownRef.value && !audioModeDropdownRef.value.contains(event.target as Node)) { showAudioModeDropdown.value = false; } };
const getButtonTitle = (): string => { /* ... (update to use micPermissionStatus directly) ... */
    if (props.isProcessing && currentAudioMode.value === 'push-to-talk' && !((sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) || (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive))) {
      return 'Assistant is processing... PTT start disabled.';
    }
    if (!isPttMode.value) return 'Microphone button is for PTT mode only.';

    if (micPermissionStatus.value === 'prompt') return 'Click to grant microphone access for PTT.';
    if (micPermissionStatus.value === 'denied') return 'Microphone access denied.';
    if (micPermissionStatus.value === 'error') return `Microphone error: ${micPermissionMessage.value || 'Unknown'}.`;
    if (micPermissionStatus.value !== 'granted' && !micAccessInitiallyChecked.value) return 'Initializing microphone...'; // Before first check

    let pttIsActive = (sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) ||
                      (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive);
    return pttIsActive ? 'Click to stop PTT recording' : 'Click to start PTT recording';
};
// --- UI Helper Getters ---

/**
 * @function getPlaceholderText
 * @description Determines the placeholder text for the textarea based on the current state.
 * @returns {string} The placeholder text.
 */
const getPlaceholderText = (): string => {
  const sttMethod = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';

  if (props.isProcessing) return "Assistant is responding, please wait...";

  // Reflecting states from child handlers
  const isBrowserActive = browserSpeechHandlerRef.value?.isBrowserWebSpeechActive ?? false;
  const isWhisperRecording = whisperSpeechHandlerRef.value?.isMediaRecorderActive ?? false;
  const isActivelyRecording = (sttPreference.value === 'browser_webspeech_api' && isBrowserActive) ||
                              (sttPreference.value === 'whisper_api' && isWhisperRecording);

  if (isActivelyRecording && !isChildListeningForWakeWord.value) {
    if (isPttMode.value) return `Recording (PTT ${sttMethod})... click PTT mic to stop.`;
    if (isContinuousMode.value) return `Listening continuously (${sttMethod})... Or type here.`;
    if (isVoiceActivationMode.value) return `Voice active, listening for command (${sttMethod})... or type.`;
  }

  if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) {
    return `Say "V" to activate command input (${sttMethod}), or type here...`;
  }

  // Idle states or permission issues
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') {
    return `Mic ${micPermissionStatus.value}. Text input only.`;
  }
  if (micPermissionStatus.value === 'prompt') {
    return "Awaiting microphone permission. Click PTT mic to grant, or type...";
  }
  if (!micAccessInitiallyChecked.value && micPermissionStatus.value === '') {
    return "Initializing audio...";
  }

  const modeLabel = currentAudioModeDetails.value?.label || currentAudioMode.value;
  if (isPttMode.value) return `Click PTT mic to record with ${sttMethod}, or type...`;
  if (isContinuousMode.value) return `Continuous mode (${sttMethod}) ready. Type or use mode controls.`;
  if (isVoiceActivationMode.value) return `Voice Activation (${sttMethod}) ready. Say "V" or use mode controls.`;

  return `Type a message, or select an audio mode (${sttMethod}).`;
};

/**
 * @function getModeIndicatorClass
 * @description Determines the CSS class for the mode indicator dot.
 * @returns {string} The CSS class string.
 */
const getModeIndicatorClass = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'processing-llm'; // LLM is busy

  // Specific STT processing states
  if (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isTranscribingCurrentSegment) return 'processing-stt';
  if (isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value) return 'active'; // General recording/STT activity

  if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return 'vad-standby'; // VAD actively listening for wake word

  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return 'mic-error';

  // Standby for modes that are enabled but not actively capturing command/dictation speech
  if ((isContinuousMode.value || isVoiceActivationMode.value) && micPermissionStatus.value === 'granted') return 'standby';

  return 'idle'; // Default idle, PTT ready, or mic not yet initialized with permission
};

/**
 * @function getRecordingStatusText
 * @description Provides text indicating the current voice recording or processing status.
 * @returns {string} The status text.
 */
const getRecordingStatusText = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant processing...';

  const sttMethod = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';

  // Browser STT States
  if (sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value) {
    if (browserSpeechHandlerRef.value.isBrowserWebSpeechActive && !isChildListeningForWakeWord.value) { // Main STT (not VAD wake word)
      if (isPttMode.value) return `Recording (PTT ${sttMethod})...`;
      if (isContinuousMode.value) {
        return browserSpeechHandlerRef.value.pauseDetectedWebSpeech
          ? `Sending in ${Math.max(0, (browserSpeechHandlerRef.value.pauseCountdownWebSpeech || 0) / 1000).toFixed(1)}s (Browser)`
          : `Listening continuously (${sttMethod})...`;
      }
      if (isVoiceActivationMode.value) return `Voice active, recording command (${sttMethod})...`;
    }
  }
  // Whisper STT States
  else if (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value) {
    if (whisperSpeechHandlerRef.value.isTranscribingCurrentSegment) return `Whisper processing audio segment...`;
    if (whisperSpeechHandlerRef.value.isMediaRecorderActive) {
      const duration = whisperSpeechHandlerRef.value.recordingSegmentSeconds;
      // Ensure formatDuration is available or use a simple MM:SS format
      const durationStr = ` (${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')})`;

      if (isContinuousMode.value && whisperSpeechHandlerRef.value.isWhisperPauseDetected) {
        return `Sending in ${(whisperSpeechHandlerRef.value.whisperPauseCountdown / 1000).toFixed(1)}s (Whisper)`;
      }
      if (isPttMode.value) return `Recording (PTT ${sttMethod})${durationStr}`;
      if (isContinuousMode.value) return `Listening continuously (${sttMethod})${durationStr}`;
      if (isVoiceActivationMode.value && !isChildListeningForWakeWord.value) return `Voice active, recording command (${sttMethod})${durationStr}`;
    }
  }

  // VAD Wake Word Listening (handled by BrowserSpeechHandler)
  if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) {
    return `Awaiting wake word "V"...`;
  }

  // If STT is processing but not fitting above categories (e.g. whisper transcribing when recorder is off)
  if (isChildSttProcessingAudio.value) return `${sttMethod} processing...`;


  return ""; // Default: No specific recording status text if idle or only VAD wake word listening
};

/**
 * @function getIdleStatusText
 * @description Provides general status text, especially for idle or permission states.
 * @returns {string} The idle status text.
 */
const getIdleStatusText = (): string => {
  if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant Processing...';

  // More specific active states are covered by getRecordingStatusText,
  // this focuses on truly idle states or permission messages.
  if (isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value) return 'Transcribing Audio...'; // Though getRecordingStatusText might be more detailed
  if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return 'VAD Listening for "V"';

  // Permission-related messages take precedence if mic isn't granted
  if (micPermissionStatus.value === 'denied') return "Mic Access Denied";
  if (micPermissionStatus.value === 'error') return `Mic Error: ${micPermissionMessage.value || 'Unknown'}`;
  if (micPermissionStatus.value === 'prompt') return "Awaiting Mic Permission...";
  if (!micAccessInitiallyChecked.value && micPermissionStatus.value === '') return "Initializing Audio...";

  // If permission is granted and no active processing:
  if (micPermissionStatus.value === 'granted') {
    const modeDetails = currentAudioModeDetails.value;
    if (isVoiceActivationMode.value && !isChildListeningForWakeWord.value && !isChildSttProcessingAudio.value) {
      // VAD mode selected, but wake word isn't active (e.g., after command or manual stop)
      return 'Voice Activate Ready';
    }
    if (isContinuousMode.value && !isChildSttProcessingAudio.value) {
        return 'Continuous Mode Ready';
    }
    if (isPttMode.value && !isChildSttProcessingAudio.value) {
        return 'PTT Ready';
    }
    return modeDetails ? `${modeDetails.label} Ready` : 'Ready for Input';
  }

  return 'Mic Inactive'; // Generic fallback if no other state fits
};

// --- Watchers & Lifecycle ---
watch([
  () => settingsFromManager.audioInputMode, () => settingsFromManager.sttPreference,
  () => settingsFromManager.selectedAudioInputDeviceId, () => settingsFromManager.speechLanguage
], async ([newMode, newSTT, newDevice, newLang], [oldMode, oldSTT, oldDevice, oldLang]) => {
  if (props.isProcessing) {
      console.warn("[VoiceInput] Settings change ignored: LLM is processing.");
      voiceSettingsManager.updateSetting('audioInputMode', oldMode); // Attempt to revert UI if possible
      return;
  }
  console.log(`[VoiceInput] Settings changed. Mode: ${oldMode}->${newMode}, STT: ${oldSTT}->${newSTT}`);
  const deviceChanged = newDevice !== oldDevice;
  const sttOrLangChanged = newSTT !== oldSTT || newLang !== oldLang;

  await stopAllAudioProcessing(false); // Keep mic resources if only lang/mode changed

  if (deviceChanged) {
    await releaseAllMicrophoneResources();
    if (!(await ensureMicrophoneAccessAndStream())) {
        toast?.add({ type: 'error', title: 'Mic Error', message: 'Failed to access new microphone.' });
        return; // Critical failure if mic can't be accessed
    }
  }
  await nextTick(); // Wait for refs to potentially update if children re-render

  // Reinitialize handlers if their relevant settings changed
  // Browser handler is sensitive to STT pref, VAD mode, lang, and device
  if (browserSpeechHandlerRef.value && (newSTT === 'browser_webspeech_api' || newMode === 'voice-activation')) {
    if (deviceChanged || sttOrLangChanged || newMode !== oldMode) { // Re-init more broadly
        console.log("[VoiceInput] Reinitializing BrowserSpeechHandler.");
        await browserSpeechHandlerRef.value.reinitialize();
    }
  }
  // Whisper handler is sensitive to STT pref, device (for stream), and lang (for prompt)
  if (whisperSpeechHandlerRef.value && newSTT === 'whisper_api') {
     if (deviceChanged || sttOrLangChanged || newMode !== oldMode) {
        console.log("[VoiceInput] Reinitializing WhisperSpeechHandler.");
        await whisperSpeechHandlerRef.value.reinitialize();
    }
  }

  // Auto-start based on new mode if conditions are met
  if (micPermissionStatus.value === 'granted' && !isSelfProcessingAudio.value && !props.isProcessing) {
    if (newMode === 'continuous') {
        const handler = newSTT === 'browser_webspeech_api' ? browserSpeechHandlerRef.value : whisperSpeechHandlerRef.value;
        if (handler) { handler.startListening(false); }
        else { console.warn(`[VoiceInput] Continuous mode selected but no ${newSTT} handler found.`);}
    } else if (newMode === 'voice-activation') {
        if (browserSpeechHandlerRef.value) { browserSpeechHandlerRef.value.startVADWakeWordRecognition?.(); }
        else { console.warn(`[VoiceInput] VAD mode selected but BrowserSpeechHandler not found for wake word.`); }
    }
  }
}, { deep: false });

watch(isSelfProcessingAudio, (newValue) => { emit('processing-audio', newValue); });
watch(micPermissionStatus, async (newStatus, oldStatus) => {
    console.log(`[VoiceInput] micPermissionStatus (from useMicrophone) changed from ${oldStatus} to ${newStatus}`);
    if (['granted', 'denied', 'prompt', 'error'].includes(newStatus)) {
        emit('permission-update', newStatus as 'granted' | 'denied' | 'prompt' | 'error'); // Forward to parent view
    }
    if (newStatus === 'denied' || newStatus === 'error') {
        await stopAllAudioProcessing(true);
    } else if (newStatus === 'granted' && oldStatus !== 'granted') {
        // Permission just became granted (e.g., after a prompt)
        // Attempt to auto-start current mode if applicable and not busy
        if (!isSelfProcessingAudio.value && !props.isProcessing) {
            console.log("[VoiceInput] Mic permission newly granted, attempting auto-start for current mode.");
            _triggerSttHandlerStart(false); // Will start VAD wake word or Continuous based on currentAudioMode
        }
    }
});

onMounted(async () => {
  document.addEventListener('click', handleClickOutsideAudioModeDropdown, true);
  await voiceSettingsManager.initialize();
  await nextTick();

  // Attempt to get mic stream and permission on mount
  // This will set initial micPermissionStatus via useMicrophone's onPermissionUpdateGlobally and local watcher
  const streamReady = await ensureMicrophoneAccessAndStream();

  if (streamReady && micPermissionStatus.value === 'granted' && !isSelfProcessingAudio.value && !props.isProcessing) {
    console.log("[VoiceInput] onMounted: Mic ready, attempting auto-start for current mode.");
    _triggerSttHandlerStart(false);
  } else if (!streamReady) {
    console.warn("[VoiceInput] onMounted: Mic not ready or permission not granted initially.");
    // micPermissionMessage should be set by useMicrophone
  }
  nextTick(() => handleTextareaInput());
});


// --- Watchers & Lifecycle Hooks ---

/**
 * Watches the transcriptionHistory ref and persists it to localStorage on change.
 * @param {TranscriptionHistoryItem[]} newHistory - The new state of the transcription history.
 */
watch(transcriptionHistory, (newHistory) => {
  try {
    localStorage.setItem('vca-transcriptionHistory-v3.1', JSON.stringify(newHistory));
  } catch (error) {
    console.error("[VoiceInput] Error saving transcription history to localStorage:", error);
    // Optionally, notify the user or implement a more robust storage solution if localStorage fails (e.g., due to quota)
  }
}, { deep: true });

/**
 * Lifecycle hook called just before the component instance is unmounted.
 * Responsible for cleaning up resources and event listeners.
 */
onBeforeUnmount(async () => {
  console.log("[VoiceInput] Unmounting component. Cleaning up...");

  // 1. Remove global event listeners specific to this component
  document.removeEventListener('click', handleClickOutsideAudioModeDropdown, true);
  console.log("[VoiceInput] Removed click-outside listener for audio mode dropdown.");

  // 2. Stop all audio processing and release microphone resources.
  // The `true` argument typically signals to release the microphone stream.
  // This should propagate to useMicrophone.releaseAllMicrophoneResources().
  await stopAllAudioProcessing(true);
  console.log("[VoiceInput] All audio processing stopped and microphone resources requested to be released.");

  // 3. Clean up any other component-specific resources or listeners if they exist.
  // For example, if VoiceInput.vue itself directly set up a navigator.permissions.onchange listener
  // (though this is better handled within useMicrophone.ts), it would be cleaned here.
  // Assuming useMicrophone handles its own internal listeners cleanup on its scope disposal if applicable.

  console.log("[VoiceInput] Cleanup complete.");
});

// Make sure the other functions referenced are also present in your <script setup>
// For example:
// const handleClickOutsideAudioModeDropdown = (event: MouseEvent) => {
//   if (audioModeDropdownRef.value && !audioModeDropdownRef.value.contains(event.target as Node)) {
//     showAudioModeDropdown.value = false;
//   }
// };

// const stopAllAudioProcessing = async (releaseMic: boolean = true) => {
//   console.log(`[VoiceInput] Stopping all audio processing. Release Mic: ${releaseMic}`);
//   if (browserSpeechHandlerRef.value) await browserSpeechHandlerRef.value.stopAll(true);
//   if (whisperSpeechHandlerRef.value) await whisperSpeechHandlerRef.value.stopAll();
//   isChildSttProcessingAudio.value = false;
//   isChildListeningForWakeWord.value = false;
//   if (releaseMic && typeof releaseAllMicrophoneResources === 'function') { // Check if function exists
//     await releaseAllMicrophoneResources(); // From useMicrophone
//   } else if (releaseMic) {
//     console.warn("[VoiceInput] releaseAllMicrophoneResources function not available from useMicrophone.");
//   }
// };

</script>

<template>
  <div class="voice-input-panel-ephemeral" :class="currentPanelStateClasses" :aria-busy="props.isProcessing || isSelfProcessingAudio">
    <BrowserSpeechHandler
      v-if="sttPreference === 'browser_webspeech_api' && (currentAudioMode === 'push-to-talk' || currentAudioMode === 'continuous' || currentAudioMode === 'voice-activation')"
      ref="browserSpeechHandlerRef"
      :settings="settingsFromManager"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessing"
      :initial-permission-status="micPermissionStatus"
      :current-mic-permission="micPermissionStatus"
      @transcription="onChildTranscription"
      @processing-audio="onChildProcessingAudio"
      @is-listening-for-wake-word="onChildListeningForWakeWord"
      @error="onChildError"
      @request-edit-pending-transcript="handleEditBrowserPending"
      @wake-word-detected="onWakeWordDetectedInVoiceInput"
    />
    <WhisperSpeechHandler
      v-if="sttPreference === 'whisper_api'"
      ref="whisperSpeechHandlerRef"
      :settings="settingsFromManager"
      :audio-input-mode="currentAudioMode"
      :active-stream="activeStream"
      :analyser="analyser"
      :parent-is-processing-l-l-m="props.isProcessing"
      :initial-permission-status="micPermissionStatus"
      @transcription="onChildTranscription"
      @processing-audio="onChildProcessingAudio"
      @error="onChildError"
    />

    <div class="input-area-ephemeral" :class="textInputProminenceClass">
      <textarea
        ref="textareaRef"
        v-model="textInput"
        @input="handleTextareaInput"
        @keyup.enter.exact.prevent="!isSelfProcessingAudio && textInput.trim() && !props.isProcessing && handleTextSubmit()"
        @keydown.enter.shift.exact.prevent="textInput += '\n'; nextTick(handleTextareaInput)"
        class="voice-textarea-ephemeral"
        :placeholder="getPlaceholderText()"
        :disabled="props.isProcessing || (isSelfProcessingAudio && currentAudioMode !== 'push-to-talk') ||
                    (isPttMode &&
                        ( (sttPreference === 'browser_webspeech_api' && browserSpeechHandlerRef?.isBrowserWebSpeechActive) ||
                          (sttPreference === 'whisper_api' && whisperSpeechHandlerRef?.isMediaRecorderActive)
                        ) &&
                        !isChildListeningForWakeWord
                    )"
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
        @click="handleMicButtonInteraction"
        class="mic-button-ephemeral"
        :class="{
          'listening': isPttMode && ((sttPreference === 'browser_webspeech_api' && browserSpeechHandlerRef?.isBrowserWebSpeechActive) || (sttPreference === 'whisper_api' && whisperSpeechHandlerRef?.isMediaRecorderActive)),
          'processing-llm': props.isProcessing && !isSelfProcessingAudio,
          'mic-error': micPermissionStatus === 'error' || micPermissionStatus === 'denied',
          'vad-listening-wake': isVoiceActivationMode && isChildListeningForWakeWord
        }"
        :title="getButtonTitle()"
        :aria-pressed="isPttMode && ((sttPreference === 'browser_webspeech_api' && browserSpeechHandlerRef?.isBrowserWebSpeechActive) || (sttPreference === 'whisper_api' && whisperSpeechHandlerRef?.isMediaRecorderActive))"
        :disabled="
          (isPttMode && props.isProcessing && !((sttPreference === 'browser_webspeech_api' && browserSpeechHandlerRef?.isBrowserWebSpeechActive) || (sttPreference === 'whisper_api' && whisperSpeechHandlerRef?.isMediaRecorderActive))) || // Disable STARTING PTT if LLM processing
          currentAudioMode !== 'push-to-talk' || // Enable button only for PTT mode
          micPermissionStatus === 'denied' || micPermissionStatus === 'error' ||
          (!micAccessInitiallyChecked && micPermissionStatus === '') // Disabled during initial check if status unknown
        "
        aria-live="polite"
      >
        <MicrophoneIcon class="icon" />
      </button>

      <div class="status-display-ephemeral">
        <div class="mode-indicator-wrapper-ephemeral">
            <span class="mode-dot-ephemeral" :class="getModeIndicatorClass()"></span>
            <span class="mode-text-ephemeral" :title="`Current mode: ${settingsFromManager.audioInputMode}`">{{ getIdleStatusText() }}</span>
        </div>
        <div class="transcription-status-ephemeral" aria-live="assertive">
          {{ getRecordingStatusText() }}
        </div>
        <div v-if="micPermissionMessage && micPermissionStatus !== 'granted'" class="permission-status-ephemeral" :class="String(micPermissionStatus)" role="alert">
          {{ micPermissionMessage }}
        </div>
      </div>

      <div class="audio-mode-selector-wrapper" ref="audioModeDropdownRef">
        <button @click="toggleAudioModeDropdown"
                class="audio-mode-button btn btn-ghost-ephemeral btn-sm-ephemeral"
                aria-haspopup="true" :aria-expanded="showAudioModeDropdown"
                :disabled="props.isProcessing">
            <component :is="currentAudioModeIcon" class="icon-sm" aria-hidden="true"/>
            <span class="hidden sm:inline ml-1.5">{{ currentAudioModeLabel }}</span>
            <ChevronDownIcon class="chevron-icon icon-xs ml-auto transition-transform duration-200" :class="{'rotate-180': showAudioModeDropdown}" aria-hidden="true"/>
        </button>
        <Transition name="dropdown-float-neomorphic">
            <div v-if="showAudioModeDropdown" class="audio-mode-dropdown card-neo-raised">
                <div class="dropdown-header-ephemeral !py-1.5 !px-2.5"><h3 class="dropdown-title !text-xs">Audio Input Mode</h3></div>
                <button v-for="mode in audioModeOptions" :key="mode.value" @click="selectAudioMode(mode.value)"
                        class="audio-mode-item dropdown-item-ephemeral" :class="{'active': settingsFromManager.audioInputMode === mode.value}"
                        role="menuitemradio" :aria-checked="settingsFromManager.audioInputMode === mode.value">
                    <component :is="mode.icon" class="icon-sm mr-2" aria-hidden="true"/>
                    {{ mode.label }}
                    <SolidCheckIcon v-if="settingsFromManager.audioInputMode === mode.value" class="icon-xs ml-auto text-[hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l))]" aria-hidden="true"/>
                </button>
            </div>
        </Transition>
      </div>

      <div class="secondary-controls-ephemeral">
        <button @click="showTranscriptionHistory = !showTranscriptionHistory" class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral" title="View Transcription History" :disabled="props.isProcessing">
          <ClockIcon class="icon-base" aria-hidden="true"/>
        </button>
        <button
          v-if="isContinuousMode && sttPreference === 'browser_webspeech_api' && browserSpeechHandlerRef?.hasPendingTranscript"
          @click="browserSpeechHandlerRef?.triggerEditPendingTranscript()"
          class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral"
          title="Edit pending transcription"
          :disabled="props.isProcessing">
          <PencilIcon class="icon-base" aria-hidden="true"/>
        </button>
         <button
          v-if="(isContinuousMode || isVoiceActivationMode) && (isChildSttProcessingAudio || isChildListeningForWakeWord)"
          @click="handleManualStopFromSecondaryButton"
          class="control-btn-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral stop-btn-ephemeral"
          title="Stop Current Listening/Recording">
          <StopCircleIcon class="icon-base" aria-hidden="true"/>
        </button>
      </div>
    </div>
    <Transition name="modal-holographic-translucent">
      </Transition>
    <Transition name="modal-holographic-translucent">
        </Transition>
  </div>
</template>

<style lang="scss">
/* ... styles from previous response ... */
.permission-status-ephemeral {
  font-size: 0.7rem; padding: 0.1rem 0.3rem; border-radius: var(--rounded-sm); margin-top: 0.1rem; text-align: center;
  &.denied, &.error { color: hsl(var(--color-danger-text-h), var(--color-danger-text-s), var(--color-danger-text-l)); background-color: hsla(var(--color-danger-h), var(--color-danger-s), var(--color-danger-l), 0.15); }
  &.prompt { color: hsl(var(--color-warning-text-h), var(--color-warning-text-s), var(--color-warning-text-l)); background-color: hsla(var(--color-warning-h), var(--color-warning-s), var(--color-warning-l), 0.15); }
}
.mic-button-ephemeral.mic-error {
  background-image: linear-gradient(to right, hsla(var(--color-danger-h),var(--color-danger-s),var(--color-danger-l),0.5), hsla(var(--color-danger-h),var(--color-danger-s),calc(var(--color-danger-l) - 10%),0.6) );
  color: hsl(var(--color-danger-text-h), var(--color-danger-text-s), var(--color-danger-text-l));
  &:hover { background-image: linear-gradient(to right, hsla(var(--color-danger-h),var(--color-danger-s),calc(var(--color-danger-l) - 5%),0.6), hsla(var(--color-danger-h),var(--color-danger-s),calc(var(--color-danger-l) - 15%),0.7) ); }
}
.mode-dot-ephemeral.mic-error { background-color: hsl(var(--color-danger-h), var(--color-danger-s), var(--color-danger-l)) !important; }

.browser-speech-handler-ui, .whisper-speech-handler-ui {
  .live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; font-size: 0.8rem; }
  .vad-wake-word-status, .web-speech-vad-active-indicator { font-style: italic; }
  .streaming-cursor-ephemeral { animation: blink 1s step-end infinite; }
}
@keyframes blink { 50% { opacity: 0; } }
</style>