// File: frontend/src/components/voice-input/handlers/WhisperSpeechHandler.vue
/**
 * @file WhisperSpeechHandler.vue
 * @description Component to handle OpenAI Whisper API interactions for Speech-to-Text (STT).
 * Supports Push-to-Talk (PTT) and Continuous mode (segments by silence).
 * This component implements the STT Handler interface.
 *
 * @component WhisperSpeechHandler
 * @props {VoiceApplicationSettings} settings - Reactive voice application settings.
 * @props {AudioInputMode} audioInputMode - Current audio input mode (PTT, Continuous, VAD).
 * Note: True VAD (wake word) is not natively supported; VAD mode behaves like Continuous.
 * @props {MediaStream | null} activeStream - The active microphone media stream.
 * @props {AnalyserNode | null} analyser - Analyser node for silence detection in continuous mode.
 * @props {boolean} parentIsProcessingLLM - Indicates if the parent component (LLM) is busy.
 * @props {MicPermissionStatusType} currentMicPermission - Current microphone permission status from parent.
 *
 * @emits handler-api-ready - Emits the handler's API object once ready.
 * @emits unmounted - Emitted when the component is about to unmount.
 * @emits transcription - Emits TranscriptionData (text, isFinal) from Whisper API.
 * @emits processing-audio - Emits true when recording or transcribing, false otherwise.
 * @emits is-listening-for-wake-word - Emits status of wake word listening (always false).
 * @emits wake-word-detected - Never emitted by this handler.
 * @emits error - Emits SttHandlerErrorPayload for issues.
 *
 * @version 3.2.0 - Aligned with SttHandlerInstance, types.ts event payloads, reactive props.
 */
<template>
  </template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  inject,
  nextTick,
  onMounted,
  onBeforeUnmount,
  type Ref,
  readonly,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api'; // Ensure this path is correct
import {
  type AudioInputMode,
  type VoiceApplicationSettings,
} from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import type { AxiosResponse } from 'axios';
// Import types from the shared types file
import type {
  SttHandlerInstance,
  MicPermissionStatusType,
  TranscriptionData,
  SttHandlerErrorPayload
} from '../types';

// Constants
const MIN_AUDIO_BLOB_SIZE_BYTES = 200;
const PREFERRED_MIME_TYPE_BASE = 'audio/webm';

/**
 * @interface WhisperProps
 * @description Props definition for the WhisperSpeechHandler component.
 */
interface WhisperProps {
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  activeStream: MediaStream | null;
  analyser: AnalyserNode | null;
  parentIsProcessingLLM: boolean;
  /** Current microphone permission status, reactive from parent. */
  currentMicPermission: MicPermissionStatusType;
}

const props = withDefaults(defineProps<WhisperProps>(), {
  activeStream: null,
  analyser: null,
  parentIsProcessingLLM: false,
});

/**
 * @typedef WhisperSpeechHandlerEmits
 * @description Defines the events emitted by the WhisperSpeechHandler component.
 */
const emit = defineEmits<{
  (e: 'handler-api-ready', api: SttHandlerInstance): void;
  (e: 'unmounted'): void;
  (e: 'transcription', data: TranscriptionData): void; // Changed to TranscriptionData
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'wake-word-detected'): void; // Still defined, though never emitted
  (e: 'error', payload: SttHandlerErrorPayload): void; // Changed to SttHandlerErrorPayload
}>();

const toast = inject<ToastService>('toast');

const isMediaRecorderActive = ref(false);
const isTranscribingCurrentSegment = ref(false);
const recordingSegmentSeconds = ref(0);
const audioChunks: Ref<Blob[]> = ref([]);
const localPermissionStatus = ref<MicPermissionStatusType>(props.currentMicPermission); // Local copy, synced via watch

const speechOccurredInCurrentSegment = ref(false);
const isWhisperPauseDetected = ref(false);
const whisperPauseCountdown = ref(0);
const isAborting = ref(false);

let mediaRecorder: MediaRecorder | null = null;
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
let whisperPauseCountdownTimerId: ReturnType<typeof setTimeout> | null = null;

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isEffectiveContinuousMode = computed<boolean>(
  () => props.audioInputMode === 'continuous' || props.audioInputMode === 'voice-activation'
);

/**
 * @computed isOverallProcessing
 * @description Combined state indicating if the handler is recording or transcribing.
 */
const isOverallProcessing = computed<boolean>(
  () => isMediaRecorderActive.value || isTranscribingCurrentSegment.value
);

// Watch the combined processing state to emit 'processing-audio'
watch(isOverallProcessing, (newValue) => {
  emit('processing-audio', newValue);
});


const preferredMimeType = computed<string>(() => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return PREFERRED_MIME_TYPE_BASE;
  }
  if (MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=opus`)) return `${PREFERRED_MIME_TYPE_BASE};codecs=opus`;
  if (MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=pcm`)) return `${PREFERRED_MIME_TYPE_BASE};codecs=pcm`;
  return PREFERRED_MIME_TYPE_BASE;
});

const _clearRecordingSegmentTimer = (): void => {
  if (recordingSegmentTimerId) clearInterval(recordingSegmentTimerId);
  recordingSegmentTimerId = null;
  recordingSegmentSeconds.value = 0;
};

const _stopContinuousWhisperSilenceMonitor = (): void => {
  if (continuousSilenceMonitorIntervalId) clearInterval(continuousSilenceMonitorIntervalId);
  continuousSilenceMonitorIntervalId = null;
  if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
  whisperPauseCountdownTimerId = null;
  isWhisperPauseDetected.value = false;
  whisperPauseCountdown.value = 0;
};

const _startContinuousWhisperSilenceMonitor = (): void => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isEffectiveContinuousMode.value) {
    return;
  }
  _stopContinuousWhisperSilenceMonitor();
  speechOccurredInCurrentSegment.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isEffectiveContinuousMode.value) {
      _stopContinuousWhisperSilenceMonitor();
      return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((acc, v) => acc + v, 0);
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    const levelInDb = props.analyser.minDecibels + (avgByte / 255) * (props.analyser.maxDecibels - props.analyser.minDecibels);

    if (levelInDb >= (props.settings.vadSensitivityDb ?? -45)) {
      speechOccurredInCurrentSegment.value = true;
      silenceStartTime = null;
      if (isWhisperPauseDetected.value) {
        if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
        whisperPauseCountdownTimerId = null;
        isWhisperPauseDetected.value = false;
        whisperPauseCountdown.value = 0;
      }
    } else {
      if (speechOccurredInCurrentSegment.value && !isWhisperPauseDetected.value) {
        if (silenceStartTime === null) silenceStartTime = Date.now();
        if (Date.now() - silenceStartTime >= (props.settings.continuousModePauseTimeoutMs || 3000)) {
          const sendDelay = props.settings.continuousModeSilenceSendDelayMs ?? 1000;
          isWhisperPauseDetected.value = true;
          whisperPauseCountdown.value = sendDelay;
          if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
          whisperPauseCountdownTimerId = setTimeout(() => {
            if (isWhisperPauseDetected.value) {
              _stopMediaRecorderAndFinalizeSegment();
            }
            isWhisperPauseDetected.value = false;
            whisperPauseCountdown.value = 0;
            whisperPauseCountdownTimerId = null;
          }, sendDelay);
        }
      }
    }
  }, 250);
};

const _stopMediaRecorderAndFinalizeSegment = (): void => {
  if (mediaRecorder && isMediaRecorderActive.value) {
    mediaRecorder.stop();
  } else {
    if (isEffectiveContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
    _clearRecordingSegmentTimer();
  }
};

const _processRecordedSegment = async (): Promise<void> => {
  const wasMediaRecorderActiveWhenStopped = isMediaRecorderActive.value;
  isMediaRecorderActive.value = false; // Recording part is done

  if (isAborting.value) {
    isAborting.value = false;
    audioChunks.value = [];
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    // isOverallProcessing computed will handle emitting processing-audio: false
    return;
  }

  const localSpeechOccurred = speechOccurredInCurrentSegment.value;
  const endedSegmentDuration = recordingSegmentSeconds.value;
  _clearRecordingSegmentTimer();
  if (isEffectiveContinuousMode.value) _stopContinuousWhisperSilenceMonitor();

  const currentAudioChunks = [...audioChunks.value];
  audioChunks.value = [];

  if (currentAudioChunks.length > 0) {
    const audioBlob = new Blob(currentAudioChunks, { type: mediaRecorder?.mimeType || preferredMimeType.value });
    const minDuration = props.settings.minWhisperSegmentDurationS ?? 0.75;

    if (localSpeechOccurred && audioBlob.size > MIN_AUDIO_BLOB_SIZE_BYTES && endedSegmentDuration >= minDuration) {
      isTranscribingCurrentSegment.value = true; // This will trigger isOverallProcessing to true
      await transcribeWithWhisper(audioBlob);
    } else {
      isTranscribingCurrentSegment.value = false;
    }
  } else {
    isTranscribingCurrentSegment.value = false;
  }

  // Handle restart for continuous mode only if not currently starting another transcription
  if (isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !props.parentIsProcessingLLM && !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    await nextTick();
    startListening(false);
  } else if (isEffectiveContinuousMode.value && localPermissionStatus.value !== 'granted') {
    console.warn("[WSH Continuous] Cannot restart continuous mode, microphone permission not granted.");
  }
};

const startListening = async (forVADCommandIgnored: boolean = false): Promise<boolean> => {
  if (isMediaRecorderActive.value) return true;
  if (localPermissionStatus.value !== 'granted' || !props.activeStream) {
    const msg = localPermissionStatus.value !== 'granted' ? 'Microphone permission not granted.' : 'No active audio stream.';
    emit('error', { type: 'permission', message: msg, fatal: true }); // Mark as fatal
    return false;
  }

  audioChunks.value = [];
  speechOccurredInCurrentSegment.value = false;

  try {
    mediaRecorder = new MediaRecorder(props.activeStream, { mimeType: preferredMimeType.value });
  } catch (e: any) {
    emit('error', { type: 'init', message: `Recorder init error: ${e.message}. MimeType: ${preferredMimeType.value}`, fatal: true });
    return false;
  }

  mediaRecorder.ondataavailable = (event: BlobEvent) => { if (event.data.size > 0) audioChunks.value.push(event.data); };
  mediaRecorder.onstop = _processRecordedSegment; // Removed async here, _processRecordedSegment is async
  mediaRecorder.onerror = (event: Event) => {
    const error = (event as any).error || new Error('Unknown MediaRecorderError');
    emit('error', { type: 'recorder', message: `Recorder error: ${error.name} - ${error.message}`, code: error.name, fatal: true });
    isMediaRecorderActive.value = false;
    _clearRecordingSegmentTimer();
    if (isEffectiveContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
  };

  mediaRecorder.start(isEffectiveContinuousMode.value ? 250 : undefined);
  isMediaRecorderActive.value = true; // This will trigger isOverallProcessing to true
  _startRecordingSegmentTimer();
  if (isEffectiveContinuousMode.value) _startContinuousWhisperSilenceMonitor();
  return true;
};

const stopListening = async (abort: boolean = false): Promise<void> => {
  if (abort) isAborting.value = true;
  _stopMediaRecorderAndFinalizeSegment();
};

const transcribeWithWhisper = async (audioBlob: Blob): Promise<void> => {
  if (props.parentIsProcessingLLM) {
    isTranscribingCurrentSegment.value = false;
    // Restart continuous if applicable and all conditions met
    if (isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !isMediaRecorderActive.value) {
      await nextTick(); startListening(false);
    }
    return;
  }

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio-${Date.now()}.${preferredMimeType.value.split('/')[1]?.split(';')[0] || 'webm'}`);
    if (props.settings.speechLanguage) formData.append('language', props.settings.speechLanguage.substring(0, 2));
    if (props.settings.sttOptions?.prompt) formData.append('prompt', props.settings.sttOptions.prompt);

    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;

    if (response.data && typeof response.data.transcription === 'string') {
      if (response.data.transcription.trim()) {
        // Emit TranscriptionData object
        emit('transcription', { text: response.data.transcription.trim(), isFinal: true });
      } else if (isPttMode.value) {
        toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper found no speech.', duration: 3000 });
      }
    } else {
      throw new Error(response.data?.message || 'Whisper API returned invalid data.');
    }
  } catch (error: any) {
    emit('error', {
      type: 'api',
      message: error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Transcription API error.',
      code: error.response?.status?.toString() || error.code || 'API_ERROR',
      fatal: false, // API errors might be transient
    });
  } finally {
    isTranscribingCurrentSegment.value = false; // This will trigger isOverallProcessing to update
    // Restart continuous if applicable and all conditions met (also done in _processRecordedSegment)
    if (isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !props.parentIsProcessingLLM && !isMediaRecorderActive.value) {
      await nextTick(); startListening(false);
    }
  }
};

const _startRecordingSegmentTimer = (): void => {
  _clearRecordingSegmentTimer();
  recordingSegmentSeconds.value = 0;
  const maxDurationContinuous = props.settings.maxSegmentDurationS ?? 28;
  const maxDurationPtt = 120;

  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1;
    const currentDuration = recordingSegmentSeconds.value;
    if (isMediaRecorderActive.value) {
      if (isEffectiveContinuousMode.value && currentDuration >= maxDurationContinuous) {
        _stopMediaRecorderAndFinalizeSegment();
      } else if (isPttMode.value && currentDuration >= maxDurationPtt) {
        toast?.add({ type: 'info', title: 'Max Recording Time', message: `PTT limit (${maxDurationPtt}s) reached.` });
        _stopMediaRecorderAndFinalizeSegment();
      }
    } else {
      _clearRecordingSegmentTimer();
    }
  }, 100);
};

const reinitialize = async (): Promise<void> => {
  await stopAll(true);
  await nextTick();
  if (isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !props.parentIsProcessingLLM && !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    startListening(false);
  }
};

const stopAll = async (abort: boolean = true): Promise<void> => {
  if (abort) isAborting.value = true;
  if (mediaRecorder && isMediaRecorderActive.value) {
    mediaRecorder.stop(); // Will trigger onstop -> _processRecordedSegment
  } else {
    // If not recording, but possibly transcribing or aborting a pending transcription
    if (isAborting.value) {
        audioChunks.value = [];
        isAborting.value = false; // Reset flag
    }
    // isOverallProcessing computed will handle emitting processing-audio: false if both flags are false
  }
  _clearRecordingSegmentTimer();
  _stopContinuousWhisperSilenceMonitor();
};

// Watchers
watch(() => props.currentMicPermission, (newVal) => { // Watch the reactive prop
  if (localPermissionStatus.value !== newVal) {
    localPermissionStatus.value = newVal;
    // If permission granted and continuous mode was waiting
    if (newVal === 'granted' && isEffectiveContinuousMode.value && !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value && !props.parentIsProcessingLLM) {
        startListening(false);
    } else if (newVal === 'denied' || newVal === 'error') {
        stopAll(true); // Stop if permission lost
    }
  }
});

watch(() => props.parentIsProcessingLLM, async (isLLMProcessing) => {
  if (!isLLMProcessing && isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    await nextTick(); startListening(false);
  } else if (isLLMProcessing && isPttMode.value && isMediaRecorderActive.value) {
    await stopListening(false);
  }
});

watch(() => props.activeStream, async (newStream) => {
  await stopAll(true);
  if (newStream?.active && localPermissionStatus.value === 'granted' && isEffectiveContinuousMode.value && !props.parentIsProcessingLLM) {
    await nextTick(); startListening(false);
  }
}, { immediate: false }); // Don't run immediately, let mount handle initial setup

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) await reinitialize();
});

// API to be exposed
const handlerApi: SttHandlerInstance = {
  isActive: readonly(isOverallProcessing), // Use the combined processing state
  isListeningForWakeWord: readonly(ref(false)),
  hasPendingTranscript: computed(() => false),
  pendingTranscript: readonly(ref('')),
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  clearPendingTranscript: () => { /* no-op */ },
};

onMounted(() => {
  localPermissionStatus.value = props.currentMicPermission; // Sync on mount
  emit('handler-api-ready', handlerApi);
  emit('is-listening-for-wake-word', false); // Explicitly set on mount

  if (isEffectiveContinuousMode.value && localPermissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    startListening(false);
  }
});

onBeforeUnmount(async () => {
  await stopAll(true);
  mediaRecorder = null;
  emit('unmounted');
});

</script>