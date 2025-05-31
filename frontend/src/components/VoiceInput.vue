// File: frontend/src/components/VoiceInput.vue
<script setup lang="ts">
/**
 * @file VoiceInput.vue
 * @description Core component for handling voice and text input. Orchestrates STT handlers.
 * @version 5.0.7 (Disables mode switching and ensures STT handlers respect LLM processing state)
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
  CpuChipIcon as VADModeIcon,
  PencilIcon, StopCircleIcon, MicrophoneIcon,
} from '@heroicons/vue/24/outline';
import { CheckIcon as SolidCheckIcon } from '@heroicons/vue/24/solid';

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
  permissionStatus: micPermissionStatus,
  permissionMessage: micPermissionMessage,
  micAccessInitiallyChecked,
  ensureMicrophoneAccessAndStream,
  releaseAllMicrophoneResources
} = useMicrophone({
  settings: readonly(settingsRefForComposable),
  toast,
  onPermissionUpdateGlobally: (status) => { emit('permission-update', status); }
});

const browserSpeechHandlerRef = ref<InstanceType<typeof BrowserSpeechHandler> | null>(null);
const whisperSpeechHandlerRef = ref<InstanceType<typeof WhisperSpeechHandler> | null>(null);

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
  if (payload.type === 'permission' || payload.code === 'not-allowed' || payload.code === 'service-not-allowed') {
    micPermissionStatus.value = 'denied';
    micPermissionMessage.value = payload.message;
    emit('permission-update', 'denied');
  } else if (['init', 'recorder', 'api', 'speech'].includes(payload.type)) {
      toast?.add({type: 'error', title: `STT Error (${payload.type})`, message: payload.message});
  }
};

const onWakeWordDetectedInVoiceInput = async () => {
    console.log("[VoiceInput] Wake word detected! Determining STT for command capture.");
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM is processing. Command ignored.' });
        // Optionally, restart VAD wake word listening immediately if it was stopped by detection
        if (browserSpeechHandlerRef.value && !isChildListeningForWakeWord.value && micPermissionStatus.value === 'granted') {
            browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
        }
        return;
    }
    await nextTick();
    const forVADCommand = true;
    if (sttPreference.value === 'browser_webspeech_api') {
        if (browserSpeechHandlerRef.value) {
            console.log("[VoiceInput] Starting Browser STT for VAD command.");
            browserSpeechHandlerRef.value.startListening(forVADCommand);
        } else {
            console.error("[VoiceInput] BrowserSpeechHandler not ready for VAD command.");
            toast?.add({ type: 'error', title: 'VAD Error', message: 'Browser STT handler not ready.'});
        }
    } else if (sttPreference.value === 'whisper_api') {
        if (whisperSpeechHandlerRef.value) {
            console.log("[VoiceInput] Starting Whisper STT for VAD command.");
            if (!(await ensureMicrophoneAccessAndStream())) {
                toast?.add({ type: 'error', title: 'Mic Required', message: micPermissionMessage.value || 'Mic needed for Whisper VAD.' });
                if (browserSpeechHandlerRef.value && micPermissionStatus.value === 'granted') {
                    browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
                }
                return;
            }
            whisperSpeechHandlerRef.value.startListening(forVADCommand);
        } else {
            console.error("[VoiceInput] WhisperSpeechHandler not ready for VAD command.");
            toast?.add({ type: 'error', title: 'VAD Error', message: 'Whisper STT handler not ready.'});
        }
    }
};

const stopAllAudioProcessing = async (releaseMic: boolean = true) => {
  console.log(`[VoiceInput] Stopping all audio processing. Release Mic: ${releaseMic}`);
  if (browserSpeechHandlerRef.value) await browserSpeechHandlerRef.value.stopAll(true);
  if (whisperSpeechHandlerRef.value) await whisperSpeechHandlerRef.value.stopAll();
  isChildSttProcessingAudio.value = false;
  isChildListeningForWakeWord.value = false;
  if (releaseMic) {
    await releaseAllMicrophoneResources();
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
  if (textInput.value.trim() && !isSelfProcessingAudio.value && !props.isProcessing) {
    sendTranscriptionToParent(textInput.value.trim());
    textInput.value = '';
    nextTick(() => handleTextareaInput());
  }
};

const handleMicButtonInteraction = async () => {
  if (!isPttMode.value) return; // Button is PTT only
  await nextTick();

  const pttSTTPreference = sttPreference.value;
  const pttHandler = pttSTTPreference === 'browser_webspeech_api'
                      ? browserSpeechHandlerRef.value
                      : whisperSpeechHandlerRef.value;
  if (!pttHandler) {
      toast?.add({ type: 'error', title: 'Handler Error', message: `PTT handler (${pttSTTPreference}) not ready.` });
      return;
  }

  let isPttCurrentlyRecording = (pttSTTPreference === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) ||
                                (pttSTTPreference === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive);

  if (isPttCurrentlyRecording) {
    pttHandler.stopListening(false);
  } else {
    if (props.isProcessing) { // Prevent starting new PTT if LLM is busy
      toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.' });
      return;
    }
    if (!(await ensureMicrophoneAccessAndStream())) {
      toast?.add({ type: 'error', title: 'Mic Required', message: micPermissionMessage.value || 'Mic access required.' });
      return;
    }
    pttHandler.startListening(false);
  }
};

const handleManualStopFromSecondaryButton = async () => {
  console.log(`[VoiceInput] Manual stop: Mode: ${currentAudioMode.value}, STT: ${sttPreference.value}`);
  if (currentAudioMode.value === 'voice-activation') {
    if (browserSpeechHandlerRef.value) await browserSpeechHandlerRef.value.stopAll(true);
    if (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive) {
      await whisperSpeechHandlerRef.value.stopAll();
    }
     // After stopping VAD, ensure VAD wake word listener restarts if appropriate
    if (browserSpeechHandlerRef.value && micPermissionStatus.value === 'granted' && !props.isProcessing) {
        await nextTick(); // allow stopAll to complete
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
const saveEdit = () => {
  if(editingTranscription.value.trim()){
    sendTranscriptionToParent(editingTranscription.value.trim());
    if (browserSpeechHandlerRef.value) browserSpeechHandlerRef.value.clearPendingTranscript();
  }
  showEditModal.value = false; editingTranscription.value = ''; pendingBrowserTranscriptForEdit.value = '';
};
const cancelEdit = () => {
  showEditModal.value = false; editingTranscription.value = ''; pendingBrowserTranscriptForEdit.value = '';
};
const resendTranscription = (item: TranscriptionHistoryItem) => {
  if (props.isProcessing || isSelfProcessingAudio.value) {
      toast?.add({type: 'info', title: 'Busy', message: 'Cannot resend while processing.'});
      return;
  }
  sendTranscriptionToParent(item.text);
  toast?.add({ type: 'info', title: 'Resent', message: `Resent: "${item.text.substring(0,30)}..."`, duration: 2000});
};

const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const toggleAudioModeDropdown = () => {
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot change mode while processing.' });
        return;
    }
    showAudioModeDropdown.value = !showAudioModeDropdown.value;
};
const selectAudioMode = (mode: AudioInputMode) => {
    if (props.isProcessing) {
        toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Cannot change mode while processing.' });
        showAudioModeDropdown.value = false; // Close dropdown
        return;
    }
    voiceSettingsManager.updateSetting('audioInputMode', mode);
    showAudioModeDropdown.value = false;
};
const handleClickOutsideAudioModeDropdown = (event: MouseEvent) => { if (audioModeDropdownRef.value && !audioModeDropdownRef.value.contains(event.target as Node)) { showAudioModeDropdown.value = false; } };

const getButtonTitle = (): string => {
  if (!isPttMode.value) return 'Microphone button is for PTT mode only.';
  let pttIsActive = (sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) ||
                    (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value?.isMediaRecorderActive);
  if (props.isProcessing && !pttIsActive) return 'Assistant is processing... PTT start disabled.';
  if (!micAccessInitiallyChecked.value && micPermissionStatus.value === '') return 'Initializing microphone...';
  if (micPermissionStatus.value === 'denied') return 'Microphone access denied.';
  if (micPermissionStatus.value === 'error') return `Microphone error: ${micPermissionMessage.value || 'Unknown'}.`;
  return pttIsActive ? 'Click to stop PTT recording' : 'Click to start PTT recording';
};
const getPlaceholderText = (): string => {
    const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';
    let isChildSTTActuallyProcessing = isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value;
    if (isChildSTTActuallyProcessing) {
        if (isPttMode.value) return `Recording (PTT ${method})... click mic to stop.`;
        if (isContinuousMode.value) return `Listening continuously (${method})... Or type here.`;
        if (isVoiceActivationMode.value) return `Voice active, listening for command (${method})... or type.`;
    }
    if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return `Say "V" to activate command input (${method}), or type here...`;
    const modeLabel = currentAudioModeLabel.value || currentAudioMode.value;
    if (isPttMode.value) return `Click mic for PTT (${method}), or type...`;
    return `Type message, or use ${modeLabel.toLowerCase()} (${method}). Mic button is for PTT.`;
};
const getModeIndicatorClass = (): string => {
    if (props.isProcessing && !isSelfProcessingAudio.value) return 'processing-llm';
    if (isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value) return 'processing-stt';
    if (isChildListeningForWakeWord.value) return 'vad-standby';
    if ((isContinuousMode.value || isVoiceActivationMode.value) && micPermissionStatus.value === 'granted') return 'standby';
    if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return 'mic-error';
    return 'idle';
};
const getRecordingStatusText = (): string => {
    if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant processing...';
    const method = sttPreference.value === 'whisper_api' ? 'Whisper' : 'Browser STT';
    if (sttPreference.value === 'browser_webspeech_api' && browserSpeechHandlerRef.value?.isBrowserWebSpeechActive) {
        if (isPttMode.value) return `Recording (PTT ${method})...`;
        if (isContinuousMode.value) return browserSpeechHandlerRef.value.pauseDetectedWebSpeech ? `Sending in ${Math.max(0, (browserSpeechHandlerRef.value.pauseCountdownWebSpeech || 0) / 1000).toFixed(1)}s` : `Listening continuously (${method})...`;
        if (isVoiceActivationMode.value && !isChildListeningForWakeWord.value) return `Voice active, command (${method})...`;
    } else if (sttPreference.value === 'whisper_api' && whisperSpeechHandlerRef.value) {
        if (whisperSpeechHandlerRef.value.isTranscribingCurrentSegment) return 'Whisper processing audio...';
        if (whisperSpeechHandlerRef.value.isMediaRecorderActive) {
            const duration = whisperSpeechHandlerRef.value.recordingSegmentSeconds;
            const durationStr = ` (${new Date(duration * 1000).toISOString().substr(14, 5)})`;
            if (isContinuousMode.value && whisperSpeechHandlerRef.value.isWhisperPauseDetected) return `Sending in ${ (whisperSpeechHandlerRef.value.whisperPauseCountdown / 1000).toFixed(1) }s... (Whisper)`;
            if (isPttMode.value) return `Recording (PTT ${method})${durationStr}`;
            if (isContinuousMode.value) return `Listening continuously (${method})${durationStr}`;
            if (isVoiceActivationMode.value && !isChildListeningForWakeWord.value) return `Voice active, command (${method})${durationStr}`;
        }
    }
    if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return `Awaiting wake word "V"...`;
    return '';
};
const getIdleStatusText = (): string => {
    if (props.isProcessing && !isSelfProcessingAudio.value) return 'Assistant Processing...';
    if (isChildSttProcessingAudio.value && !isChildListeningForWakeWord.value) return 'Transcribing Audio...';
    if (isVoiceActivationMode.value && isChildListeningForWakeWord.value) return 'VAD Listening for "V"';
    if (micPermissionStatus.value === 'granted') {
        const modeOpt = audioModeOptions.value.find(m => m.value === currentAudioMode.value);
        if (isVoiceActivationMode.value && !isChildListeningForWakeWord.value && !isChildSttProcessingAudio.value) return 'Voice Activate Ready';
        return `${modeOpt ? modeOpt.label : 'Audio Input'} Ready`;
    }
    if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return "Microphone Inactive/Error";
    if (micPermissionStatus.value === 'prompt') return "Awaiting Mic Permission...";
    return 'Initializing Audio...';
};

watch([
  () => settingsFromManager.audioInputMode, () => settingsFromManager.sttPreference,
  () => settingsFromManager.selectedAudioInputDeviceId, () => settingsFromManager.speechLanguage
], async ([newMode, newSTT, newDevice, newLang], [oldMode, oldSTT, oldDevice, oldLang]) => {
  if (props.isProcessing) {
      console.warn("[VoiceInput] Settings change ignored: LLM is processing.");
      // Revert UI optimistic update if settings manager is reactive and directly bound
      // This depends on how settingsManager.updateSetting works with the reactive `settingsFromManager`
      voiceSettingsManager.updateSetting('audioInputMode', oldMode);
      voiceSettingsManager.updateSetting('sttPreference', oldSTT);
      // etc. for other settings if they were optimistically updated
      return;
  }

  console.log(`[VoiceInput] Settings changed. Mode: ${oldMode}->${newMode}, STT: ${oldSTT}->${newSTT}`);
  const deviceChanged = newDevice !== oldDevice;
  const sttOrLangChanged = newSTT !== oldSTT || newLang !== oldLang;

  await stopAllAudioProcessing(false);

  if (deviceChanged) {
    await releaseAllMicrophoneResources();
    if (!(await ensureMicrophoneAccessAndStream())) {
        toast?.add({ type: 'error', title: 'Mic Error', message: 'Failed to access new microphone.' });
        return;
    }
  }
  await nextTick();

  if (browserSpeechHandlerRef.value && (newSTT === 'browser_webspeech_api' || newMode === 'voice-activation')) {
    if (deviceChanged || sttOrLangChanged || newMode !== oldMode) await browserSpeechHandlerRef.value.reinitialize();
  }
  if (whisperSpeechHandlerRef.value && newSTT === 'whisper_api') {
     if (deviceChanged || sttOrLangChanged || newMode !== oldMode) await whisperSpeechHandlerRef.value.reinitialize();
  }

  if (micPermissionStatus.value === 'granted' && !isSelfProcessingAudio.value && !props.isProcessing) {
    if (newMode === 'continuous') {
        const handler = newSTT === 'browser_webspeech_api' ? browserSpeechHandlerRef.value : whisperSpeechHandlerRef.value;
        if (handler) handler.startListening(false);
    } else if (newMode === 'voice-activation') {
        if (browserSpeechHandlerRef.value) browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
    }
  }
}, { deep: false });

watch(isSelfProcessingAudio, (newValue) => { emit('processing-audio', newValue); });
watch(micPermissionStatus, (newStatus) => { emit('permission-update', newStatus); }); // Forward mic status changes

onMounted(async () => {
  document.addEventListener('click', handleClickOutsideAudioModeDropdown, true);
  // Initial permission check and auto-start logic moved to useMicrophone and settings watcher
  // This simplifies onMounted, primary role is event listeners and initial UI setup.
  await voiceSettingsManager.initialize(); // Ensure settings service is initialized
  await nextTick(); // Ensure child components are mounted if rendered by v-if based on initial settings

  // Auto-start based on initial settings if permissions are already granted
  if (micPermissionStatus.value === 'granted' && !isSelfProcessingAudio.value && !props.isProcessing) {
    if (currentAudioMode.value === 'continuous') {
      const handler = sttPreference.value === 'browser_webspeech_api' ? browserSpeechHandlerRef.value : whisperSpeechHandlerRef.value;
      if (handler) handler.startListening(false);
    } else if (currentAudioMode.value === 'voice-activation') {
      if (browserSpeechHandlerRef.value) browserSpeechHandlerRef.value.startVADWakeWordRecognition?.();
    }
  }
  nextTick(() => handleTextareaInput());
});
onBeforeUnmount(async () => {
  document.removeEventListener('click', handleClickOutsideAudioModeDropdown, true);
  await stopAllAudioProcessing(true);
});
watch(transcriptionHistory, (newHistory) => { localStorage.setItem('vca-transcriptionHistory-v3.1', JSON.stringify(newHistory)); }, { deep: true });
</script>

<template>
  <div class="voice-input-panel-ephemeral" :class="currentPanelStateClasses" :aria-busy="props.isProcessing || isSelfProcessingAudio">
    <BrowserSpeechHandler
      v-if="sttPreference === 'browser_webspeech_api' || currentAudioMode === 'voice-activation' || (currentAudioMode === 'push-to-talk' && sttPreference === 'browser_webspeech_api')"
      ref="browserSpeechHandlerRef"
      :settings="settingsFromManager"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessing"
      :initial-permission-status="micPermissionStatus"
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
          props.isProcessing || /* General disable if LLM is processing for PTT start */
          currentAudioMode !== 'push-to-talk' ||
          (!micAccessInitiallyChecked && micPermissionStatus !== 'granted' && micPermissionStatus !== 'prompt')
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
                :disabled="props.isProcessing"> <component :is="currentAudioModeIcon" class="icon-sm" aria-hidden="true"/>
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
          title="Stop Current Listening/Recording"> {/* This stop should generally be allowed */}
          <StopCircleIcon class="icon-base" aria-hidden="true"/>
        </button>
      </div>
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
                  <button @click="resendTranscription(item)" class="resend-btn-ephemeral btn btn-link-ephemeral btn-xs-ephemeral" title="Resend this transcription" :disabled="props.isProcessing || isSelfProcessingAudio">
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

.browser-speech-handler-ui, .whisper-speech-handler-ui { /* If these have their own UI, style them here or in their own files */
  .live-transcript-display-ephemeral { min-height: 20px; padding-block: 0.25rem; font-size: 0.8rem; }
  .vad-wake-word-status, .web-speech-vad-active-indicator { font-style: italic; }
  .streaming-cursor-ephemeral { animation: blink 1s step-end infinite; }
}
@keyframes blink { 50% { opacity: 0; } }
</style>