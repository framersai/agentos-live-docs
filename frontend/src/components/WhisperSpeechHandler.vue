// File: frontend/src/components/WhisperSpeechHandler.vue
<script setup lang="ts">
/**
 * @file WhisperSpeechHandler.vue
 * @description Component to handle OpenAI Whisper API interactions for STT.
 * Supports Push-to-Talk, Continuous mode with silence detection and countdown,
 * and VAD Command Capture.
 * @version 2.2.2 (Corrects TS errors, uses new settings from VoiceApplicationSettings, fixes timer type)
 */
import {
  ref,
  computed,
  watch,
  inject,
  nextTick,
  type PropType,
  // type Ref, // Removed as it's not strictly needed for explicit typing here
  onBeforeUnmount,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import {
  type AudioInputMode,
  type VoiceApplicationSettings
} from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import type { AxiosResponse } from 'axios';

// Constants
const MIN_AUDIO_BLOB_SIZE_BYTES = 200;
const PREFERRED_MIME_TYPE_BASE = 'audio/webm'; // Base for mime type

const props = defineProps({
  settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
  audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
  activeStream: { type: Object as PropType<MediaStream | null>, default: null },
  analyser: { type: Object as PropType<AnalyserNode | null>, default: null },
  parentIsProcessingLLM: { type: Boolean, default: false },
  initialPermissionStatus: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'error', payload: { type: 'recorder' | 'api' | 'init' | 'permission', message: string, code?: string }): void;
}>();

const toast = inject<ToastService>('toast');

const isMediaRecorderActive = ref(false);
const isTranscribingCurrentSegment = ref(false);
const recordingSegmentSeconds = ref(0);
const audioChunks = ref<Blob[]>([]); // This is Ref<Blob[]>
const permissionStatus = ref(props.initialPermissionStatus);

const speechOccurredInCurrentSegment = ref(false);

const isWhisperPauseDetected = ref(false);
const whisperPauseCountdown = ref(0);

let mediaRecorder: MediaRecorder | null = null;
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
let whisperPauseCountdownTimerId: ReturnType<typeof setTimeout> | null = null; // Compatible with both browser and Node.js

const isPttMode = computed(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed(() => props.audioInputMode === 'voice-activation');

const preferredMimeType = computed(() => {
    const codecs = MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=opus`) ? ';codecs=opus' :
                   MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=pcm`) ? ';codecs=pcm' : '';
    return `${PREFERRED_MIME_TYPE_BASE}${codecs}`;
});

const _clearRecordingSegmentTimer = () => {
  if (recordingSegmentTimerId !== null) clearInterval(recordingSegmentTimerId);
  recordingSegmentTimerId = null;
  recordingSegmentSeconds.value = 0;
};

const _stopContinuousWhisperSilenceMonitor = () => {
  if (continuousSilenceMonitorIntervalId !== null) clearInterval(continuousSilenceMonitorIntervalId);
  continuousSilenceMonitorIntervalId = null;
  // speechOccurredInCurrentSegment is reset when the monitor starts for a NEW segment.
  if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
  whisperPauseCountdownTimerId = null;
  isWhisperPauseDetected.value = false;
  whisperPauseCountdown.value = 0;
};

const _startContinuousWhisperSilenceMonitor = () => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isContinuousMode.value) return;
  _stopContinuousWhisperSilenceMonitor();

  speechOccurredInCurrentSegment.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);

  console.log("[WSH] Starting continuous Whisper silence monitor.");

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isContinuousMode.value) {
      _stopContinuousWhisperSilenceMonitor();
      return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    let sum = 0; dataArray.forEach(v => sum += v);
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    const levelInDb = props.analyser.minDecibels + (avgByte / 255) * (props.analyser.maxDecibels - props.analyser.minDecibels);

    // Use vadSensitivityDb from settings, with a fallback
    if (levelInDb >= (props.settings.vadSensitivityDb ?? -45)) {
      speechOccurredInCurrentSegment.value = true;
      silenceStartTime = null;
      if (isWhisperPauseDetected.value) {
        if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
        whisperPauseCountdownTimerId = null;
        isWhisperPauseDetected.value = false;
        whisperPauseCountdown.value = 0;
        console.log("[WSH Continuous] Speech resumed during pause countdown. Countdown cancelled.");
      }
    } else {
      if (speechOccurredInCurrentSegment.value && !isWhisperPauseDetected.value) {
        if (silenceStartTime === null) silenceStartTime = Date.now();
        // Use continuousModePauseTimeoutMs for detecting end of speech utterance
        if (Date.now() - silenceStartTime >= (props.settings.continuousModePauseTimeoutMs || 3000)) {
          // Use continuousModeSilenceSendDelayMs for the "Sending in..." UI countdown
          const sendDelay = props.settings.continuousModeSilenceSendDelayMs ?? 1000;
          console.log(`[WSH Continuous] Silence threshold met. Starting ${sendDelay}ms 'Sending in...' countdown.`);
          isWhisperPauseDetected.value = true;
          whisperPauseCountdown.value = sendDelay;

          if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
          whisperPauseCountdownTimerId = setTimeout(() => {
            if (isWhisperPauseDetected.value) {
              console.log("[WSH Continuous] 'Sending in...' countdown finished. Stopping segment.");
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

const _stopMediaRecorderAndFinalizeSegment = () => {
  if (mediaRecorder && isMediaRecorderActive.value) {
    console.log("[WSH] _stopMediaRecorderAndFinalizeSegment called. Stopping MediaRecorder.");
    mediaRecorder.stop();
  } else {
    console.log("[WSH] _stopMediaRecorderAndFinalizeSegment called, but MediaRecorder not active or already stopped.");
    if (isContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
    _clearRecordingSegmentTimer();
  }
};

const _processRecordedSegment = async () => {
  const wasContinuousRecording = isContinuousMode.value;
  const localSpeechOccurred = speechOccurredInCurrentSegment.value;
  const endedSegmentDuration = recordingSegmentSeconds.value;

  const wasMediaRecorderActivePrior = isMediaRecorderActive.value;
  isMediaRecorderActive.value = false;
  if (wasMediaRecorderActivePrior) emit('processing-audio', false);

  _clearRecordingSegmentTimer();
  if (wasContinuousRecording) _stopContinuousWhisperSilenceMonitor();

  const currentAudioChunks = [...audioChunks.value]; // Access .value for Ref<Blob[]>
  audioChunks.value = []; // Reset .value for Ref<Blob[]>

  if (currentAudioChunks.length > 0) {
    const audioBlob = new Blob(currentAudioChunks, { type: mediaRecorder?.mimeType || preferredMimeType.value });
    const minDuration = props.settings.minWhisperSegmentDurationS ?? 0.75;

    if (localSpeechOccurred && audioBlob.size > MIN_AUDIO_BLOB_SIZE_BYTES && endedSegmentDuration >= minDuration) {
      isTranscribingCurrentSegment.value = true;
      emit('processing-audio', true);
      await transcribeWithWhisper(audioBlob);
    } else {
      console.log(`[WSH] Whisper: Segment not transcribed (Size: ${audioBlob.size}, Duration: ${endedSegmentDuration.toFixed(2)}s, Speech Detected: ${localSpeechOccurred}, MinDuration: ${minDuration}s).`);
      isTranscribingCurrentSegment.value = false;
    }
  } else {
    console.log("[WSH] Whisper: No audio chunks captured.");
    isTranscribingCurrentSegment.value = false;
  }

  if (wasContinuousRecording && permissionStatus.value === 'granted') {
    if (props.parentIsProcessingLLM) {
      console.log("[WSH Continuous] Parent is processing LLM. Deferring MediaRecorder restart.");
    } else if (!isTranscribingCurrentSegment.value && !isMediaRecorderActive.value) {
      console.log("[WSH Continuous] Restarting MediaRecorder (from _processRecordedSegment).");
      await nextTick();
      startListening(false);
    } else if (isTranscribingCurrentSegment.value) {
      console.log("[WSH Continuous] Transcription in progress. Restart by transcribeWithWhisper's finally block.");
    }
  } else if (wasContinuousRecording && permissionStatus.value !== 'granted') {
      console.warn("[WSH Continuous] Cannot restart, microphone permission not granted.");
  }
};

const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (isMediaRecorderActive.value) {
    console.warn("[WSH] MediaRecorder already active.");
    return true;
  }
  if (permissionStatus.value !== 'granted' || !props.activeStream) {
    const msg = permissionStatus.value !== 'granted' ? 'Mic permission not granted.' : 'No active audio stream.';
    emit('error', { type: 'permission', message: msg });
    toast?.add({ type: 'error', title: 'Mic Error', message: msg });
    return false;
  }
  if (props.parentIsProcessingLLM && !isContinuousMode.value) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'LLM processing. Please wait.' });
    return false;
  }

  audioChunks.value = [];
  speechOccurredInCurrentSegment.value = false;

  try {
    const options = { mimeType: preferredMimeType.value };
    mediaRecorder = new MediaRecorder(props.activeStream, options);
  } catch (e: any) {
    console.error("[WSH] MediaRecorder initialization failed:", e.message, e);
    emit('error', { type: 'init', message: `Recorder init error: ${e.message}`});
    return false;
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) audioChunks.value.push(event.data);
  };
  mediaRecorder.onstop = _processRecordedSegment;
  mediaRecorder.onerror = (event: Event) => {
    const error = (event as any).error || new Error('Unknown MediaRecorder error');
    console.error('[WSH] MediaRecorder error:', error.name, error.message);
    emit('error', { type: 'recorder', message: `Recorder error: ${error.name} - ${error.message}` });
    isMediaRecorderActive.value = false;
    emit('processing-audio', false);
    _clearRecordingSegmentTimer();
    if (isContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
    if (isContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
        console.warn("[WSH] Attempting to restart continuous listening after recorder error.");
        nextTick(() => startListening(false));
    }
  };

  mediaRecorder.start(isContinuousMode.value ? 250 : undefined);
  isMediaRecorderActive.value = true;
  emit('processing-audio', true);
  _startRecordingSegmentTimer();

  if (isContinuousMode.value && !forVADCommand) {
    _startContinuousWhisperSilenceMonitor();
  } else if (isVoiceActivationMode.value && forVADCommand) {
    console.log("[WSH] VAD Command capture started for Whisper.");
  }
  console.log(`[WSH] MediaRecorder started for Whisper. Mode: ${props.audioInputMode}, VAD Cmd Capture: ${forVADCommand}`);
  return true;
};

const stopListening = () => {
  console.log("[WSH] stopListening called.");
  _stopMediaRecorderAndFinalizeSegment();
};

const transcribeWithWhisper = async (audioBlob: Blob) => {
  console.log(`[WSH] Transcribing with Whisper. Blob size: ${audioBlob.size}`);
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio-${Date.now()}.${preferredMimeType.value.split('/')[1].split(';')[0]}`);
    if (props.settings.speechLanguage) formData.append('language', props.settings.speechLanguage.substring(0, 2));
    if (props.settings.sttOptions?.prompt) formData.append('prompt', props.settings.sttOptions.prompt);

    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;
    if (response.data.transcription?.trim()) {
      emit('transcription', response.data.transcription.trim());
    } else if (response.data.transcription === "") {
      console.log("[WSH] Whisper: Empty transcription received.");
      if (isPttMode.value) toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper: Empty transcription.', duration: 3000 });
    } else {
      throw new Error(response.data.message || 'Whisper API returned invalid or no transcription.');
    }
  } catch (error: any) {
    console.error("[WSH] Whisper API Error:", error);
    emit('error', { type: 'api', message: error.response?.data?.message || error.message || "Transcription failed." });
  } finally {
    const wasTranscribing = isTranscribingCurrentSegment.value;
    isTranscribingCurrentSegment.value = false;
    // Only emit processing-audio false if media recorder is not also active (e.g. already restarted)
    if (wasTranscribing && !isMediaRecorderActive.value) {
         emit('processing-audio', false);
    }

    if (isContinuousMode.value && permissionStatus.value === 'granted') {
        if (props.parentIsProcessingLLM) {
            console.log("[WSH Continuous] (finally) Parent is processing LLM. Deferring MediaRecorder restart.");
        } else if (!isMediaRecorderActive.value) {
            console.log("[WSH Continuous] (finally) Restarting MediaRecorder after transcription attempt.");
            await nextTick();
            startListening(false);
        }
    }
  }
};

const _startRecordingSegmentTimer = () => {
  _clearRecordingSegmentTimer();
  recordingSegmentSeconds.value = 0;
  const maxDuration = props.settings.maxSegmentDurationS ?? 30;

  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1;
    const currentDuration = recordingSegmentSeconds.value;

    if (isMediaRecorderActive.value) {
        if (isContinuousMode.value && currentDuration >= maxDuration) {
            console.log(`[WSH] Continuous Whisper: Max segment duration (${maxDuration}s) reached.`);
            _stopMediaRecorderAndFinalizeSegment();
        } else if (isPttMode.value && currentDuration >= 120) { // PTT Max duration
            toast?.add({type:'info', title:'Recording Limit', message:'Max PTT recording (120s) reached.'});
            _stopMediaRecorderAndFinalizeSegment();
        } else if (isVoiceActivationMode.value && /* !isVADListeningForWakeWord && */ currentDuration >= 60) { // VAD Command Max
            toast?.add({type:'info', title:'VAD Command Limit', message:'Max VAD command recording (60s) reached.'});
            _stopMediaRecorderAndFinalizeSegment();
        }
    } else {
        _clearRecordingSegmentTimer();
    }
  }, 100);
};

watch(() => props.initialPermissionStatus, (newVal) => permissionStatus.value = newVal);

watch(() => props.parentIsProcessingLLM, (isProcessing) => {
    if (!isProcessing && isContinuousMode.value && permissionStatus.value === 'granted' &&
        !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
        console.log("[WSH Continuous] Parent LLM processing finished. Conditions met to restart listening.");
        startListening(false);
    }
});

const reinitialize = async () => {
  console.log("[WSH] Reinitializing WhisperSpeechHandler.");
  await stopAll();
};

const stopAll = async () => {
  console.log("[WSH] Stopping all WhisperSpeech activities.");
  if (mediaRecorder && isMediaRecorderActive.value) {
    // Temporarily detach onstop to prevent it from running during a forced stopAll
    const originalOnStop = mediaRecorder.onstop;
    mediaRecorder.onstop = null;
    mediaRecorder.stop();
    mediaRecorder.onstop = originalOnStop; // Reattach if necessary, or let it be re-set by new MediaRecorder
  }
  _clearRecordingSegmentTimer();
  _stopContinuousWhisperSilenceMonitor();
  isMediaRecorderActive.value = false;
  isTranscribingCurrentSegment.value = false;
  audioChunks.value = [];
  // Avoid emitting processing-audio false if the component is unmounting,
  // as parent might already be unmounted or in a transitional state.
  // Check document.hasFocus() or a similar mechanism if needed.
  if (typeof document !== 'undefined' && document.hasFocus()) {
      emit('processing-audio', false);
  }
};

onBeforeUnmount(async () => {
  await stopAll();
  mediaRecorder = null;
});

defineExpose({
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  isMediaRecorderActive,
  isTranscribingCurrentSegment,
  recordingSegmentSeconds,
  isWhisperPauseDetected,
  whisperPauseCountdown,
});
</script>

<template>
  </template>

<style scoped lang="scss">
/* No specific styles needed here if all UI is in VoiceInput.vue */
</style>