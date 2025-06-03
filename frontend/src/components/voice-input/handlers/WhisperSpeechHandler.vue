// File: frontend/src/components/voice-input/handlers/WhisperSpeechHandler.vue
/**
 * @file WhisperSpeechHandler.vue
 * @description Component to handle OpenAI Whisper API interactions for Speech-to-Text (STT).
 * Supports Push-to-Talk and Continuous mode with silence detection.
 * This version is refactored for use with `useSttHandlerManager` and emits lifecycle events.
 *
 * @component WhisperSpeechHandler
 * @props {VoiceApplicationSettings} settings - Reactive voice application settings.
 * @props {AudioInputMode} audioInputMode - Current audio input mode (PTT, Continuous, VAD).
 * @props {MediaStream | null} activeStream - The active microphone media stream.
 * @props {AnalyserNode | null} analyser - Analyser node for silence detection in continuous mode.
 * @props {boolean} parentIsProcessingLLM - Indicates if the parent component (LLM) is busy.
 * @props {'prompt'|'granted'|'denied'|'error'|''} initialPermissionStatus - Initial microphone permission status.
 *
 * @emits mounted - Emitted when the component is mounted and ready.
 * @emits unmounted - Emitted when the component is about to unmount.
 * @emits transcription - Emits the transcribed text from Whisper.
 * @emits processing-audio - Emits true when recording/transcribing, false otherwise.
 * @emits error - Emits error objects for recorder, API, init, or permission issues.
 *
 * @version 3.0.1 - Refactored for
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
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import {
  type AudioInputMode,
  type VoiceApplicationSettings,
} from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import type { AxiosResponse } from 'axios';

// Constants
const MIN_AUDIO_BLOB_SIZE_BYTES = 200;
const PREFERRED_MIME_TYPE_BASE = 'audio/webm';

interface WhisperProps {
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  activeStream: MediaStream | null;
  analyser: AnalyserNode | null;
  parentIsProcessingLLM: boolean;
  initialPermissionStatus: 'prompt' | 'granted' | 'denied' | 'error' | '';
}

const props = withDefaults(defineProps<WhisperProps>(), {
  activeStream: null,
  analyser: null,
  parentIsProcessingLLM: false,
});

const emit = defineEmits<{
  (e: 'mounted'): void;
  (e: 'unmounted'): void;
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (
    e: 'error',
    payload: {
      type: 'recorder' | 'api' | 'init' | 'permission';
      message: string;
      code?: string;
    }
  ): void;
}>();

const toast = inject<ToastService>('toast');

/** Indicates if the MediaRecorder is currently active. */
const isMediaRecorderActive: Ref<boolean> = ref(false);
/** Indicates if a segment is currently being transcribed by the Whisper API. */
const isTranscribingCurrentSegment: Ref<boolean> = ref(false);
/** Duration of the current recording segment in seconds. */
const recordingSegmentSeconds: Ref<number> = ref(0);
/** Array to store audio chunks from MediaRecorder. */
const audioChunks: Ref<Blob[]> = ref([]);
/** Current microphone permission status. */
const permissionStatus: Ref<string> = ref(props.initialPermissionStatus);

/** Flag indicating if speech was detected in the current segment (for continuous mode). */
const speechOccurredInCurrentSegment: Ref<boolean> = ref(false);
/** Flag indicating if a pause has been detected in continuous mode (Whisper). */
const isWhisperPauseDetected: Ref<boolean> = ref(false);
/** Countdown in milliseconds for sending transcript after pause in continuous mode. */
const whisperPauseCountdown: Ref<number> = ref(0);
/** Flag to indicate if stopAll is an abort operation. */
const isAborting: Ref<boolean> = ref(false);

let mediaRecorder: MediaRecorder | null = null;
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null =
  null;
let whisperPauseCountdownTimerId: ReturnType<typeof setTimeout> | null = null;

const isPttMode = computed<boolean>(
  () => props.audioInputMode === 'push-to-talk'
);
const isContinuousMode = computed<boolean>(
  () => props.audioInputMode === 'continuous'
);

/**
 * Determines the preferred MIME type for MediaRecorder, trying opus or pcm codecs with webm.
 */
const preferredMimeType = computed<string>(() => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return `${PREFERRED_MIME_TYPE_BASE}`; // Fallback if API not available (e.g. SSR)
  }
  const codecs = MediaRecorder.isTypeSupported(
    `${PREFERRED_MIME_TYPE_BASE};codecs=opus`
  )
    ? ';codecs=opus'
    : MediaRecorder.isTypeSupported(
        `${PREFERRED_MIME_TYPE_BASE};codecs=pcm`
      )
      ? ';codecs=pcm'
      : '';
  return `${PREFERRED_MIME_TYPE_BASE}${codecs}`;
});

/** Clears the timer that tracks the duration of the recording segment. */
const _clearRecordingSegmentTimer = (): void => {
  if (recordingSegmentTimerId !== null) clearInterval(recordingSegmentTimerId);
  recordingSegmentTimerId = null;
  recordingSegmentSeconds.value = 0;
};

/** Stops the silence monitor used in continuous mode. */
const _stopContinuousWhisperSilenceMonitor = (): void => {
  if (continuousSilenceMonitorIntervalId !== null)
    clearInterval(continuousSilenceMonitorIntervalId);
  continuousSilenceMonitorIntervalId = null;
  if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
  whisperPauseCountdownTimerId = null;
  isWhisperPauseDetected.value = false;
  whisperPauseCountdown.value = 0;
};

/** Starts the silence monitor for continuous mode. */
const _startContinuousWhisperSilenceMonitor = (): void => {
  if (
    !props.analyser ||
    !props.activeStream?.active ||
    !isMediaRecorderActive.value ||
    !isContinuousMode.value
  ) {
    return;
  }
  _stopContinuousWhisperSilenceMonitor();

  speechOccurredInCurrentSegment.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);

  console.log('[WSH] Starting continuous Whisper silence monitor.');

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (
      !props.analyser ||
      !isMediaRecorderActive.value ||
      !isContinuousMode.value
    ) {
      _stopContinuousWhisperSilenceMonitor();
      return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    dataArray.forEach((v) => (sum += v));
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    const levelInDb =
      props.analyser.minDecibels +
      (avgByte / 255) *
        (props.analyser.maxDecibels - props.analyser.minDecibels);

    if (levelInDb >= (props.settings.vadSensitivityDb ?? -45)) {
      speechOccurredInCurrentSegment.value = true;
      silenceStartTime = null;
      if (isWhisperPauseDetected.value) {
        if (whisperPauseCountdownTimerId)
          clearTimeout(whisperPauseCountdownTimerId);
        whisperPauseCountdownTimerId = null;
        isWhisperPauseDetected.value = false;
        whisperPauseCountdown.value = 0;
        console.log(
          '[WSH Continuous] Speech resumed during pause countdown. Countdown cancelled.'
        );
      }
    } else {
      if (speechOccurredInCurrentSegment.value && !isWhisperPauseDetected.value) {
        if (silenceStartTime === null) silenceStartTime = Date.now();
        if (
          Date.now() - silenceStartTime >=
          (props.settings.continuousModePauseTimeoutMs || 3000)
        ) {
          const sendDelay =
            props.settings.continuousModeSilenceSendDelayMs ?? 1000;
          console.log(
            `[WSH Continuous] Silence threshold met. Starting ${sendDelay}ms 'Sending in...' countdown.`
          );
          isWhisperPauseDetected.value = true;
          whisperPauseCountdown.value = sendDelay;

          if (whisperPauseCountdownTimerId)
            clearTimeout(whisperPauseCountdownTimerId);
          whisperPauseCountdownTimerId = setTimeout(() => {
            if (isWhisperPauseDetected.value) {
              console.log(
                "[WSH Continuous] 'Sending in...' countdown finished. Stopping segment."
              );
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

/** Stops the MediaRecorder and triggers processing of the recorded segment. */
const _stopMediaRecorderAndFinalizeSegment = (): void => {
  if (mediaRecorder && isMediaRecorderActive.value) {
    console.log(
      '[WSH] _stopMediaRecorderAndFinalizeSegment called. Stopping MediaRecorder.'
    );
    mediaRecorder.stop(); // This will trigger mediaRecorder.onstop
  } else {
    console.log(
      '[WSH] _stopMediaRecorderAndFinalizeSegment called, but MediaRecorder not active or already stopped.'
    );
    if (isContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
    _clearRecordingSegmentTimer();
  }
};

/** Processes the audio chunks collected by MediaRecorder. */
const _processRecordedSegment = async (): Promise<void> => {
  if (isAborting.value) {
    isAborting.value = false; // Reset flag
    console.log("[WSH] Aborted stop. Processing of final segment skipped.");
    isMediaRecorderActive.value = false;
    emit('processing-audio', false);
    audioChunks.value = [];
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    return;
  }

  const wasContinuousRecording = isContinuousMode.value;
  const localSpeechOccurred = speechOccurredInCurrentSegment.value;
  const endedSegmentDuration = recordingSegmentSeconds.value;

  const wasMediaRecorderActivePrior = isMediaRecorderActive.value;
  isMediaRecorderActive.value = false;
  if (wasMediaRecorderActivePrior) emit('processing-audio', false);

  _clearRecordingSegmentTimer();
  if (wasContinuousRecording) _stopContinuousWhisperSilenceMonitor();

  const currentAudioChunks = [...audioChunks.value];
  audioChunks.value = [];

  if (currentAudioChunks.length > 0) {
    const audioBlob = new Blob(currentAudioChunks, {
      type: mediaRecorder?.mimeType || preferredMimeType.value,
    });
    const minDuration = props.settings.minWhisperSegmentDurationS ?? 0.75;

    if (
      localSpeechOccurred &&
      audioBlob.size > MIN_AUDIO_BLOB_SIZE_BYTES &&
      endedSegmentDuration >= minDuration
    ) {
      isTranscribingCurrentSegment.value = true;
      emit('processing-audio', true);
      await transcribeWithWhisper(audioBlob);
    } else {
      console.log(
        `[WSH] Whisper: Segment not transcribed (Size: ${audioBlob.size}, Duration: ${endedSegmentDuration.toFixed(2)}s, Speech Detected: ${localSpeechOccurred}, MinDuration: ${minDuration}s).`
      );
      isTranscribingCurrentSegment.value = false;
    }
  } else {
    console.log('[WSH] Whisper: No audio chunks captured.');
    isTranscribingCurrentSegment.value = false;
  }

  if (wasContinuousRecording && permissionStatus.value === 'granted') {
    if (props.parentIsProcessingLLM) {
      console.log(
        '[WSH Continuous] Parent is processing LLM. Deferring MediaRecorder restart.'
      );
    } else if (!isTranscribingCurrentSegment.value && !isMediaRecorderActive.value) {
      console.log(
        '[WSH Continuous] Restarting MediaRecorder (from _processRecordedSegment).'
      );
      await nextTick();
      startListening();
    } else if (isTranscribingCurrentSegment.value) {
        console.log("[WSH Continuous] Transcription in progress. Restart will be handled by transcribeWithWhisper's finally block.");
    }
  } else if (wasContinuousRecording && permissionStatus.value !== 'granted') {
      console.warn("[WSH Continuous] Cannot restart, microphone permission not granted.");
  }
};

/** Starts the MediaRecorder to capture audio. */
const startListening = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forVADCommand: boolean = false // Parameter kept for interface consistency if used by a manager
): Promise<boolean> => {
  if (isMediaRecorderActive.value) {
    console.warn('[WSH] MediaRecorder already active.');
    return true;
  }
  if (permissionStatus.value !== 'granted' || !props.activeStream) {
    const msg =
      permissionStatus.value !== 'granted'
        ? 'Mic permission not granted.'
        : 'No active audio stream.';
    emit('error', { type: 'permission', message: msg });
    toast?.add({ type: 'error', title: 'Mic Error', message: msg });
    return false;
  }
  if (props.parentIsProcessingLLM && !isContinuousMode.value) {
    toast?.add({
      type: 'info',
      title: 'Assistant Busy',
      message: 'LLM processing. Please wait.',
    });
    return false;
  }

  audioChunks.value = [];
  speechOccurredInCurrentSegment.value = false;

  try {
    const options = { mimeType: preferredMimeType.value };
    if (!props.activeStream) { // Should be caught by earlier check but good to be safe
        throw new Error("Active stream is null.");
    }
    mediaRecorder = new MediaRecorder(props.activeStream, options);
  } catch (e: any) {
    console.error('[WSH] MediaRecorder initialization failed:', e.message, e);
    emit('error', {
      type: 'init',
      message: `Recorder init error: ${e.message}`,
    });
    return false;
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) audioChunks.value.push(event.data);
  };

  mediaRecorder.onstop = _processRecordedSegment;

  mediaRecorder.onerror = (event: Event) => {
    const errorDetail = (event as any).error || new Error('Unknown MediaRecorder error');
    console.error('[WSH] MediaRecorder error:', errorDetail.name, errorDetail.message);
    emit('error', {
      type: 'recorder',
      message: `Recorder error: ${errorDetail.name || 'UnknownError'} - ${errorDetail.message || 'N/A'}`,
    });
    isMediaRecorderActive.value = false;
    emit('processing-audio', false);
    _clearRecordingSegmentTimer();
    if (isContinuousMode.value) _stopContinuousWhisperSilenceMonitor();

    if (isContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
        console.warn("[WSH] Attempting to restart continuous listening after recorder error.");
        nextTick(() => startListening());
    }
  };

  mediaRecorder.start(isContinuousMode.value ? 250 : undefined);
  isMediaRecorderActive.value = true;
  emit('processing-audio', true);
  _startRecordingSegmentTimer();

  if (isContinuousMode.value) {
    _startContinuousWhisperSilenceMonitor();
  }
  console.log(
    `[WSH] MediaRecorder started for Whisper. Mode: ${props.audioInputMode}`
  );
  return true;
};

/** Stops the MediaRecorder. */
const stopListening = async (): Promise<void> => {
  console.log('[WSH] stopListening called (will trigger MediaRecorder.stop).');
  _stopMediaRecorderAndFinalizeSegment();
};

/** Sends the audio blob to the backend for transcription using Whisper API. */
const transcribeWithWhisper = async (audioBlob: Blob): Promise<void> => {
  console.log(`[WSH] Transcribing with Whisper. Blob size: ${audioBlob.size}`);

  if (props.parentIsProcessingLLM) {
    console.log("[WSH] Parent is processing LLM. Transcription via Whisper API skipped.");
    isTranscribingCurrentSegment.value = false;
    emit('processing-audio', false);

    if (isContinuousMode.value && permissionStatus.value === 'granted' && !isMediaRecorderActive.value) {
        console.log("[WSH Continuous] (transcribeWithWhisper) LLM was busy. Restarting MediaRecorder.");
        await nextTick();
        startListening();
    }
    return;
  }

  try {
    const formData = new FormData();
    formData.append(
      'audio',
      audioBlob,
      `audio-${Date.now()}.${preferredMimeType.value.split('/')[1]?.split(';')[0] || 'webm'}`
    );
    if (props.settings.speechLanguage)
      formData.append(
        'language',
        props.settings.speechLanguage.substring(0, 2)
      );
    if (props.settings.sttOptions?.prompt)
      formData.append('prompt', props.settings.sttOptions.prompt);

    const response = (await speechAPI.transcribe(
      formData
    )) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;

    if (response.data.transcription?.trim()) {
      emit('transcription', response.data.transcription.trim());
    } else if (response.data.transcription === '') {
      console.log('[WSH] Whisper: Empty transcription received.');
      if (isPttMode.value)
        toast?.add({
          type: 'info',
          title: 'No Speech',
          message: 'Whisper: Empty transcription.',
          duration: 3000,
        });
    } else {
      throw new Error(
        response.data.message ||
          'Whisper API returned invalid or no transcription.'
      );
    }
  } catch (error: any) {
    console.error('[WSH] Whisper API Error:', error);
    emit('error', {
      type: 'api',
      message:
        error.response?.data?.message ||
        error.message ||
        'Transcription failed.',
    });
  } finally {
    const wasTranscribing = isTranscribingCurrentSegment.value;
    isTranscribingCurrentSegment.value = false;
    if (wasTranscribing && !isMediaRecorderActive.value) {
      emit('processing-audio', false);
    }

    if (isContinuousMode.value && permissionStatus.value === 'granted') {
      if (props.parentIsProcessingLLM) {
        console.log(
          '[WSH Continuous] (finally) Parent is processing LLM. Deferring MediaRecorder restart.'
        );
      } else if (!isMediaRecorderActive.value) {
        console.log(
          '[WSH Continuous] (finally) Restarting MediaRecorder after transcription attempt.'
        );
        await nextTick();
        startListening();
      }
    }
  }
};

/** Starts a timer to track recording segment duration and enforce maximum durations. */
const _startRecordingSegmentTimer = (): void => {
  _clearRecordingSegmentTimer();
  recordingSegmentSeconds.value = 0;
  const maxDurationContinuous = props.settings.maxSegmentDurationS ?? 30;
  const maxDurationPtt = 120;

  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1;
    const currentDuration = recordingSegmentSeconds.value;

    if (isMediaRecorderActive.value) {
      if (isContinuousMode.value && currentDuration >= maxDurationContinuous) {
        console.log(
          `[WSH] Continuous Whisper: Max segment duration (${maxDurationContinuous}s) reached.`
        );
        _stopMediaRecorderAndFinalizeSegment();
      } else if (isPttMode.value && currentDuration >= maxDurationPtt) {
        toast?.add({
          type: 'info',
          title: 'Recording Limit',
          message: `Max PTT recording (${maxDurationPtt}s) reached.`,
        });
        _stopMediaRecorderAndFinalizeSegment();
      }
    } else {
      _clearRecordingSegmentTimer();
    }
  }, 100);
};

/** Reinitializes the Whisper handler. */
const reinitialize = async (): Promise<void> => {
  console.log('[WSH] Reinitializing WhisperSpeechHandler.');
  await stopAll(true); // Abort current activities
};

/** Stops all MediaRecorder activities and clears timers. */
const stopAll = async (abort: boolean = true): Promise<void> => {
  console.log('[WSH] Stopping all WhisperSpeech activities. Abort:', abort);

  if (abort) {
    isAborting.value = true;
  }

  if (mediaRecorder && isMediaRecorderActive.value) {
    mediaRecorder.stop(); // onstop (_processRecordedSegment) will check isAborting
  } else if (isAborting.value) {
    // If no active recorder but abort was called, ensure flag is reset
    isAborting.value = false;
  }

  _clearRecordingSegmentTimer();
  _stopContinuousWhisperSilenceMonitor();

  // Reset states if not handled by onstop (e.g., recorder wasn't active or aborted early)
  if (!isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    emit('processing-audio', false);
  }
  // If aborting, ensure audioChunks are cleared, _processRecordedSegment will handle this if it runs.
  // If mediaRecorder was not active, this ensures chunks are cleared.
  if (isAborting.value || !isMediaRecorderActive.value) {
      audioChunks.value = [];
  }
};

// Watchers
watch(
  () => props.initialPermissionStatus,
  (newVal) => {
    permissionStatus.value = newVal;
  }
);

watch(
  () => props.parentIsProcessingLLM,
  async (isProcessing) => {
    if (
      !isProcessing &&
      isContinuousMode.value &&
      permissionStatus.value === 'granted' &&
      !isMediaRecorderActive.value &&
      !isTranscribingCurrentSegment.value
    ) {
      console.log(
        '[WSH Continuous] Parent LLM processing finished. Conditions met to restart listening.'
      );
      await nextTick();
      startListening();
    } else if (isProcessing && (isMediaRecorderActive.value || isTranscribingCurrentSegment.value)) {
        // If LLM starts processing and we are in PTT mode and actively recording/transcribing, stop it.
        // For continuous mode, it will record but not send to API if parentIsProcessingLLM is true (handled in transcribeWithWhisper).
        // However, if we want continuous to also stop recording when LLM processes, that's a change here.
        // Current logic: continuous continues recording, PTT stops if user hasn't manually stopped.
        if (isPttMode.value && isMediaRecorderActive.value) {
            console.log('[WSH PTT] Parent LLM processing started. Stopping active PTT recording.');
            await stopListening(); // This will call mediaRecorder.stop and process segment.
        }
    }
  }
);

// Lifecycle Hooks
onMounted(() => {
  emit('mounted');
  if (isContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    startListening();
  }
});

onBeforeUnmount(async () => {
  await stopAll(true);
  mediaRecorder = null;
  emit('unmounted');
});

// Expose methods
defineExpose({
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  isActive: isMediaRecorderActive,
  isTranscribingCurrentSegment,
});
</script>