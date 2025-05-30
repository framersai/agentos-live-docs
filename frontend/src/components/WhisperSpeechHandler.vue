// File: frontend/src/components/WhisperSpeechHandler.vue
<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
  nextTick,
  type PropType,
  type Ref,
  type Component as VueComponentType,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api'; // Adjusted path if necessary
import { type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service'; // Adjusted path
import type { ToastService } from '../services/services'; // Adjusted path
import type { AxiosResponse } from 'axios';

// Icons (Only if specific to this handler's template parts)
import { CloudArrowUpIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
  audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
  activeStream: { type: Object as PropType<MediaStream | null>, required: true },
  analyser: { type: Object as PropType<AnalyserNode | null>, required: true }, // Crucial for silence detection
  parentIsProcessingLLM: { type: Boolean, default: false },
  initialPermissionStatus: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void; // True when recording or transcribing
  (e: 'error', payload: { type: 'recorder' | 'api' | 'permission', message: string }): void;
}>();

const toast = inject<ToastService>('toast');

const isMediaRecorderActive: Ref<boolean> = ref(false);
const isTranscribingCurrentSegment: Ref<boolean> = ref(false);

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

const recordingSegmentSeconds: Ref<number> = ref(0);
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;

// Silence/VAD detection constants from original VoiceInput.vue
const MAX_SEGMENT_DURATION_S = 30; // For continuous Whisper
const MIN_WHISPER_SEGMENT_DURATION_S = 0.75; // Min duration to send for transcription
const SILENCE_DBFS_THRESHOLD = -45; // dBFS for silence detection

// Continuous mode Whisper silence detection
const vadSilenceDetectedDuration: Ref<number> = ref(0); // Not directly displayed, but used in logic
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;

// VAD Command Whisper silence detection
const VAD_COMMAND_SILENCE_AFTER_SPEECH_MS = 2500;
const VAD_COMMAND_INITIAL_NO_SPEECH_TIMEOUT_MS = 7000;
let vadCommandSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
let vadCommandInitialNoSpeechTimeoutId: ReturnType<typeof setTimeout> | null = null;
const hasSpeechOccurredInVADCommand: Ref<boolean> = ref(false);

const vadCanvasRef: Ref<HTMLCanvasElement | null> = ref(null);
let audioVisualisationIntervalId: ReturnType<typeof setInterval> | null = null;

const permissionStatus = ref(props.initialPermissionStatus);
watch(() => props.initialPermissionStatus, (newVal) => permissionStatus.value = newVal);

const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => props.audioInputMode === 'voice-activation');
const minSilenceDurationForContinuousSegmentEndMs = computed<number>(() => props.settings.continuousModePauseTimeoutMs);

const overallProcessingAudio = computed(() => isMediaRecorderActive.value || isTranscribingCurrentSegment.value);
watch(overallProcessingAudio, (val) => {
    emit('processing-audio', val);
});

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// --- MediaRecorder Logic ---
const startWhisperMediaRecorder = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (isMediaRecorderActive.value) {
    console.warn("[WSH] MediaRecorder already active.");
    return true;
  }
  if (permissionStatus.value !== 'granted' || !props.activeStream || !props.analyser) {
    const msg = "Microphone access not granted or stream/analyser unavailable for Whisper.";
    console.error("[WSH]", msg);
    emit('error', { type: 'permission', message: msg });
    toast?.add({type: 'error', title: 'Mic Error', message: 'Mic not ready for Whisper.'});
    return false;
  }

  audioChunks = [];
  if (forVADCommand) {
    hasSpeechOccurredInVADCommand.value = false;
  }

  const options = { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/ogg;codecs=opus' };
  try {
    mediaRecorder = new MediaRecorder(props.activeStream, options);
  } catch (e: any) {
    console.error("[WSH] MediaRecorder initialization failed:", e.message, e);
    const msg = `Could not start audio recorder: ${e.message}`;
    emit('error', { type: 'recorder', message: msg });
    toast?.add({ type: 'error', title: 'Recorder Init Error', message: msg });
    return false;
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const wasRecording = isMediaRecorderActive.value; // Capture before reset
    const endedSegmentDuration = recordingSegmentSeconds.value;
    // Heuristic: was it for VAD command? (Parent tells this handler via `startListening(true)`)
    // We'll use a local `currentCaptureIsForVAD` flag set in `startListening`.
    // For now, assume `isVoiceActivationMode.value` combined with STT pref implies VAD context if not wake word phase.
    const wasForVADCommandContext = isVoiceActivationMode.value;


    isMediaRecorderActive.value = false; // processing-audio emit will be triggered by computed
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    _stopVADCommandWhisperSilenceMonitor();
    if (wasForVADCommandContext) _stopAudioVisualisation();

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || options.mimeType });
      audioChunks = [];

      if (audioBlob.size > 200 && endedSegmentDuration >= MIN_WHISPER_SEGMENT_DURATION_S) {
        await transcribeWithWhisper(audioBlob);
      } else {
        console.log(`[WSH] Whisper: Segment too short or minimal audio (size: ${audioBlob.size}, duration: ${endedSegmentDuration.toFixed(2)}s). Not transcribing.`);
        if (isPttMode.value) { // Only toast for PTT if too short and not sending
             toast?.add({ type: 'info', title: 'Minimal Audio', message: `Very little audio captured.`, duration: 2500 });
        }
        isTranscribingCurrentSegment.value = false; // Ensure this is reset
      }
    } else {
      isTranscribingCurrentSegment.value = false; // Ensure this is reset
    }

    // Post-transcription logic / restart logic
    if (isContinuousMode.value && wasRecording && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      if (!isTranscribingCurrentSegment.value) {
        console.log("[WSH] Continuous Whisper: Restarting MediaRecorder for next segment (onstop).");
        startWhisperMediaRecorder(false);
      } else {
        console.log("[WSH] Continuous Whisper: Transcription in progress, will restart from transcribeWithWhisper's finally block.");
      }
    } else if (wasForVADCommandContext && permissionStatus.value === 'granted') {
      // VAD command (Whisper) finished. Parent (VoiceInput.vue) is responsible for restarting wake word listener.
      console.log("[WSH] VAD Command (Whisper) MediaRecorder stopped. Parent should handle VAD wake word restart.");
    }
  };

  mediaRecorder.onerror = (event: Event) => {
    console.error('[WSH] MediaRecorder error:', (event as any).error || event);
    const msg = 'An error occurred with the audio recorder.';
    emit('error', {type: 'recorder', message: msg});
    toast?.add({ type: 'error', title: 'Recorder Error', message: msg });
    isMediaRecorderActive.value = false;
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    _stopVADCommandWhisperSilenceMonitor();
    _stopAudioVisualisation();
    isTranscribingCurrentSegment.value = false;

    if(isVoiceActivationMode.value) {
        // Parent should handle VAD wake word restart
    }
  };

  mediaRecorder.start(isContinuousMode.value ? 1000 : undefined); // Timeslice for continuous, not for PTT/VAD
  isMediaRecorderActive.value = true;
  _startRecordingSegmentTimer();

  if (isContinuousMode.value && !forVADCommand) {
    _startContinuousWhisperSilenceMonitor();
  } else if (isVoiceActivationMode.value && forVADCommand) {
    _startAudioVisualisation();
    _startVADCommandWhisperSilenceMonitor();
  }
  console.log(`[WSH] MediaRecorder started for Whisper. Mode: ${props.audioInputMode}, VAD Cmd: ${forVADCommand}`);
  return true;
};

const stopWhisperMediaRecorder = () => {
  if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
    console.log("[WSH] MediaRecorder.stop() called.");
    mediaRecorder.stop(); // This will trigger ondataavailable then onstop
  } else {
    isMediaRecorderActive.value = false;
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    _stopVADCommandWhisperSilenceMonitor();
    _stopAudioVisualisation();
  }
};

const transcribeWithWhisper = async (audioBlob: Blob) => {
  if (isTranscribingCurrentSegment.value) {
    toast?.add({ type: 'info', title: 'STT Busy', message: 'Current audio segment is still being transcribed.' });
    return;
  }
  // ParentIsProcessingLLM check should be done by parent before calling startListening generally
  // if (props.parentIsProcessingLLM && !isContinuousMode.value && !isVoiceActivationMode.value) { ... }

  isTranscribingCurrentSegment.value = true;
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);
    if (props.settings.speechLanguage) formData.append('language', props.settings.speechLanguage.substring(0, 2));
    if (props.settings.sttOptions?.prompt) formData.append('prompt', props.settings.sttOptions.prompt);

    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;

    if (response.data.transcription?.trim()) {
      emit('transcription', response.data.transcription.trim());
    } else if (response.data.transcription === "") {
      console.log("[WSH] Whisper: Empty transcription received.");
      if (isPttMode.value) { // Only toast for PTT if empty
        toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper: Empty transcription detected.', duration: 3000 });
      }
    } else {
      throw new Error(response.data.message || 'Whisper API returned invalid or no transcription.');
    }
  } catch (error: any) {
    console.error("[WSH] Whisper API Error:", error);
    const msg = error.response?.data?.message || error.message || "Transcription failed.";
    emit('error', { type: 'api', message: msg });
    toast?.add({ type: 'error', title: 'Whisper STT Failed', message: msg });
  } finally {
    isTranscribingCurrentSegment.value = false;
    if (isContinuousMode.value && !isMediaRecorderActive.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      console.log("[WSH] Continuous Whisper: Transcription finished, restarting MediaRecorder (transcribeWithWhisper finally).");
      startWhisperMediaRecorder(false);
    }
  }
};

// --- Silence Detection & Timers ---
const _startRecordingSegmentTimer = () => {
  _clearRecordingSegmentTimer();
  recordingSegmentSeconds.value = 0;
  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1;
    const currentDuration = recordingSegmentSeconds.value;

    if (isMediaRecorderActive.value) { // Check if still active
      if (isContinuousMode.value && currentDuration >= MAX_SEGMENT_DURATION_S) {
        console.log(`[WSH] Continuous Whisper: Max segment duration (${MAX_SEGMENT_DURATION_S}s) reached.`);
        stopWhisperMediaRecorder();
      } else if (isPttMode.value && currentDuration >= 120) { // PTT Max 2 mins
        toast?.add({type:'info', title:'Recording Limit', message:'Max PTT recording (120s) reached.'});
        stopWhisperMediaRecorder();
      } else if (isVoiceActivationMode.value && currentDuration >= 60) { // VAD Command Max 1 min
        toast?.add({type:'info', title:'VAD Command Limit', message:'Max VAD command recording (60s) reached.'});
        stopWhisperMediaRecorder();
      }
    } else {
        _clearRecordingSegmentTimer(); // Stop timer if recorder is no longer active
    }
  }, 100);
};
const _clearRecordingSegmentTimer = () => { if(recordingSegmentTimerId !== null) clearInterval(recordingSegmentTimerId); recordingSegmentTimerId = null; recordingSegmentSeconds.value = 0;};

const _startContinuousWhisperSilenceMonitor = () => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isContinuousMode.value) return;
  _stopContinuousWhisperSilenceMonitor();

  let silenceStartTime: number | null = null;
  let speechOccurredInSegment = false;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);
  console.log("[WSH] Starting continuous Whisper silence monitor.");

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isContinuousMode.value) {
      _stopContinuousWhisperSilenceMonitor(); return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    let sum = 0; dataArray.forEach(v => sum += v);
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    // This dB conversion might need calibration or use raw byte average
    const levelInDb = props.analyser.minDecibels + (avgByte / 255) * (props.analyser.maxDecibels - props.analyser.minDecibels);

    if (levelInDb >= SILENCE_DBFS_THRESHOLD) { // Speech detected
      speechOccurredInSegment = true;
      silenceStartTime = null;
      vadSilenceDetectedDuration.value = 0;
    } else { // Silence detected
      if (speechOccurredInSegment) {
        if (silenceStartTime === null) silenceStartTime = Date.now();
        vadSilenceDetectedDuration.value = Date.now() - (silenceStartTime || Date.now());
        if (vadSilenceDetectedDuration.value >= minSilenceDurationForContinuousSegmentEndMs.value) {
          console.log(`[WSH] Continuous Whisper: Silence after speech for ${minSilenceDurationForContinuousSegmentEndMs.value}ms. Stopping segment.`);
          stopWhisperMediaRecorder(); // This will trigger onstop, then transcription and restart
        }
      }
    }
  }, 250);
};
const _stopContinuousWhisperSilenceMonitor = () => { if (continuousSilenceMonitorIntervalId !== null) clearInterval(continuousSilenceMonitorIntervalId); continuousSilenceMonitorIntervalId = null; vadSilenceDetectedDuration.value = 0;};

const _startVADCommandWhisperSilenceMonitor = () => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isVoiceActivationMode.value) return;
  _stopVADCommandWhisperSilenceMonitor();

  hasSpeechOccurredInVADCommand.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);
  console.log("[WSH] Starting VAD command Whisper silence monitor.");

  vadCommandInitialNoSpeechTimeoutId = setTimeout(() => {
    if (isMediaRecorderActive.value && !hasSpeechOccurredInVADCommand.value && isVoiceActivationMode.value) {
      console.log(`[WSH] VAD Command (Whisper): Initial no speech timeout.`);
      toast?.add({ type: 'info', title: 'VAD Timeout', message: 'No speech detected for command.', duration: 3000 });
      stopWhisperMediaRecorder(); // Triggers onstop, parent handles VAD wake word restart
    }
  }, VAD_COMMAND_INITIAL_NO_SPEECH_TIMEOUT_MS);

  vadCommandSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isVoiceActivationMode.value) {
      _stopVADCommandWhisperSilenceMonitor(); return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    let sum = 0; dataArray.forEach(v => sum += v);
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    const levelInDb = props.analyser.minDecibels + (avgByte / 255) * (props.analyser.maxDecibels - props.analyser.minDecibels);

    if (levelInDb >= SILENCE_DBFS_THRESHOLD) { // Speech
      if (!hasSpeechOccurredInVADCommand.value) {
        hasSpeechOccurredInVADCommand.value = true;
        console.log("[WSH] VAD Command (Whisper): Speech detected.");
        if (vadCommandInitialNoSpeechTimeoutId) clearTimeout(vadCommandInitialNoSpeechTimeoutId);
        vadCommandInitialNoSpeechTimeoutId = null;
      }
      silenceStartTime = null;
    } else { // Silence
      if (hasSpeechOccurredInVADCommand.value) {
        if (silenceStartTime === null) silenceStartTime = Date.now();
        if (Date.now() - (silenceStartTime || Date.now()) >= VAD_COMMAND_SILENCE_AFTER_SPEECH_MS) {
          console.log(`[WSH] VAD Command (Whisper): Silence after speech for ${VAD_COMMAND_SILENCE_AFTER_SPEECH_MS}ms. Finalizing.`);
          stopWhisperMediaRecorder();
        }
      }
    }
  }, 250);
};
const _stopVADCommandWhisperSilenceMonitor = () => {
  if (vadCommandSilenceMonitorIntervalId !== null) clearInterval(vadCommandSilenceMonitorIntervalId);
  vadCommandSilenceMonitorIntervalId = null;
  if (vadCommandInitialNoSpeechTimeoutId !== null) clearTimeout(vadCommandInitialNoSpeechTimeoutId);
  vadCommandInitialNoSpeechTimeoutId = null;
};

// --- Audio Visualization ---
const _startAudioVisualisation = () => {
  if (!props.analyser || !props.activeStream?.active || !vadCanvasRef.value) return;
  _stopAudioVisualisation(); // Ensure any previous is stopped

  audioVisualisationIntervalId = setInterval(() => {
    if (!props.analyser || !props.activeStream?.active || !vadCanvasRef.value ||
        !(isVoiceActivationMode.value && isMediaRecorderActive.value) ) { // Condition for VAD Whisper command recording
      if (vadCanvasRef.value) {
        const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
      }
      _stopAudioVisualisation();
      return;
    }
    _drawVADVisualization();
  }, 100);
};
const _stopAudioVisualisation = () => {
  if (audioVisualisationIntervalId !== null) clearInterval(audioVisualisationIntervalId);
  audioVisualisationIntervalId = null;
  if (vadCanvasRef.value) {
    const ctx = vadCanvasRef.value.getContext('2d'); if (ctx) ctx.clearRect(0, 0, vadCanvasRef.value.width, vadCanvasRef.value.height);
  }
};
const _drawVADVisualization = () => {
  const canvas = vadCanvasRef.value;
  if (!canvas || !props.analyser || !isMediaRecorderActive.value) return; // Ensure recorder is active for this vis
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  
  const bufferLength = props.analyser.frequencyBinCount; 
  const dataArray = new Uint8Array(bufferLength);
  props.analyser.getByteFrequencyData(dataArray);

  const width = canvas.width; const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const barWidth = (width / bufferLength) * 2.5;
  let x = 0;
  const baseHue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-h').trim() || '270');
  const baseSat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-s').trim() || '90%');

  for (let i = 0; i < bufferLength; i++) {
    const barHeightFraction = dataArray[i] / 255;
    const barHeight = Math.max(1, barHeightFraction * height);
    const lightness = 40 + barHeightFraction * 40; 
    const alpha = 0.3 + barHeightFraction * 0.6;  
    ctx.fillStyle = `hsla(${baseHue}, ${baseSat}, ${lightness}%, ${alpha})`;
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
};


// --- Public methods ---
let currentCaptureIsForVAD = false; // Internal flag for startListening context

const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  if (permissionStatus.value !== 'granted') {
    const msg = "Cannot start Whisper: Microphone permission not granted.";
    emit('error', { type: 'permission', message: msg});
    toast?.add({ type: 'error', title: 'Mic Permission', message: msg });
    return false;
  }
  if (!props.activeStream || !props.analyser) {
    const msg = "Cannot start Whisper: Active stream or analyser not available.";
    emit('error', {type: 'recorder', message: msg });
    toast?.add({ type: 'error', title: 'Mic Error', message: msg });
    return false;
  }
  // If VAD mode, this function is only for command capture, not wake word.
  // Parent VoiceInput.vue handles wake word (which uses BrowserSpeechHandler).
  currentCaptureIsForVAD = forVADCommand;
  return startWhisperMediaRecorder(forVADCommand);
};

const stopListening = () => {
  // For Whisper, stopping MediaRecorder is the main action.
  // It will trigger onstop, which handles transcription and potential restarts.
  stopWhisperMediaRecorder();
};

const reinitialize = async () => {
    console.log("[WSH] Reinitializing due to settings change (e.g., STT preference switch away from Whisper).");
    await stopAll(); // Stop everything this handler controls
    // No specific re-init needed beyond stopping, as parent will unmount/stop using this.
};

const stopAll = async () => {
    console.log("[WSH] Stopping all Whisper activities.");
    if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
        try { mediaRecorder.stop(); } catch (e) { console.warn('[WSH] Error stopping MediaRecorder:', e); }
    }
    isMediaRecorderActive.value = false;
    isTranscribingCurrentSegment.value = false; // Important

    _stopContinuousWhisperSilenceMonitor();
    _stopVADCommandWhisperSilenceMonitor();
    _stopAudioVisualisation();
    _clearRecordingSegmentTimer();
    audioChunks = [];
};


defineExpose({
  startListening,
  stopListening,
  reinitialize, // For parent to call if STT pref changes away from Whisper
  stopAll,      // For parent to call on unmount or major reset
  isMediaRecorderActive, // for parent to know state
  isTranscribingCurrentSegment, // for parent to know state,
  recordingSegmentSeconds,
});

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) {
    console.log(`[WSH] audioInputMode changed from ${oldMode} to ${newMode}`);
    await stopAll(); // Stop current Whisper activity
    await nextTick();
    // Parent (VoiceInput.vue) is responsible for calling startListening based on new mode
    // If newMode is continuous, and STT is Whisper, parent might auto-call startListening.
    if (newMode === 'continuous' && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      startListening(false);
    }
    // PTT will be started by parent via mic click calling startListening().
    // VAD command will be started by parent after wake word detection by BrowserSpeechHandler.
  }
});

// No need to watch speechLanguage for Whisper here unless passing to API changes behavior server-side
// Prompt changes in settings.sttOptions.prompt are handled during transcribeWithWhisper

onMounted(() => {
  // Auto-start for continuous mode if this handler is active
  if (isContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    startListening(false);
  }
});

onBeforeUnmount(async () => {
  await stopAll();
  mediaRecorder = null;
});

</script>

<template>
  <div class="whisper-speech-handler-ui">
    <div 
        v-if="isMediaRecorderActive || isTranscribingCurrentSegment"
        class="live-transcript-display-ephemeral" 
        aria-live="polite"
    >
      <div v-if="isMediaRecorderActive && !isTranscribingCurrentSegment" class="whisper-status-ephemeral flex items-center justify-center text-xs" aria-label="Recording for Whisper API">
        <CloudArrowUpIcon class="icon-xs inline mr-1.5 animate-pulse" /> Recording for Whisper ({{ formatDuration(recordingSegmentSeconds) }})
      </div>
      <div v-if="isTranscribingCurrentSegment" class="whisper-status-ephemeral flex items-center justify-center text-xs" aria-label="Transcribing with Whisper API">
        <CloudArrowUpIcon class="icon-xs inline mr-1.5 text-yellow-500" /> Transcribing with Whisper...
      </div>
    </div>

    <canvas
      v-if="isVoiceActivationMode && isMediaRecorderActive && currentCaptureIsForVAD"
      ref="vadCanvasRef"
      class="vad-canvas-ephemeral"
      width="300" height="30"
      aria-label="Voice activity visualization during VAD command recording for Whisper">
    </canvas>
  </div>
</template>

<style scoped lang="scss">
// Styles specific to the UI elements rendered by this handler
.whisper-status-ephemeral {
  /* styles from original file */
  min-height: 20px; /* Example */
}
.vad-canvas-ephemeral {
  width: 100%; 
  height: 30px;
  background-color: hsla(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l), 0.1);
  border-radius: var(--rounded-md);
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}
.live-transcript-display-ephemeral {
    /* styles from original file */
    min-height: 20px; /* Example to ensure space is occupied */
}
</style>