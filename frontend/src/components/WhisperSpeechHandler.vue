// File: frontend/src/components/WhisperSpeechHandler.vue
/**
 * @file WhisperSpeechHandler.vue
 * @description Handles audio recording via MediaRecorder for OpenAI Whisper STT,
 * including silence detection for continuous mode and VAD command capture.
 * @version 2.1.1 - Improved silence detection using TimeDomainData and configurable VAD threshold.
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
  type PropType,
  type Ref,
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import { type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import type { ToastService } from '../services/services';
import type { AxiosResponse } from 'axios';

import { CloudArrowUpIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  settings: { type: Object as PropType<VoiceApplicationSettings>, required: true },
  audioInputMode: { type: String as PropType<AudioInputMode>, required: true },
  activeStream: { type: Object as PropType<MediaStream | null>, required: true },
  analyser: { type: Object as PropType<AnalyserNode | null>, required: true },
  parentIsProcessingLLM: { type: Boolean, default: false },
  initialPermissionStatus: { type: String as PropType<'prompt'|'granted'|'denied'|'error'|''>, required: true },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'error', payload: { type: 'recorder' | 'api' | 'permission', message: string }): void;
}>();

const toast = inject<ToastService>('toast');

const isMediaRecorderActive: Ref<boolean> = ref(false);
const isTranscribingCurrentSegment: Ref<boolean> = ref(false);

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

const recordingSegmentSeconds: Ref<number> = ref(0);
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;

const MAX_SEGMENT_DURATION_S = 30; // Max duration for a single Whisper segment in continuous mode
const MIN_WHISPER_SEGMENT_DURATION_S = 0.75; // Min duration of audio to send for transcription

const vadSilenceDetectedDurationMs: Ref<number> = ref(0); // How long silence has been detected (for continuous mode)
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
let speechOccurredInCurrentSegment: boolean = false; // Tracks if speech happened in the *current* recording segment

const VAD_COMMAND_SILENCE_AFTER_SPEECH_MS = 2500; // For VAD command mode: silence after speech to finalize
const VAD_COMMAND_INITIAL_NO_SPEECH_TIMEOUT_MS = 7000; // For VAD command mode: timeout if no speech starts
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

const minSilenceDurationForContinuousSegmentEndMs = computed<number>(() => {
    // Ensure there's a sensible default if the setting is somehow undefined
    return props.settings.continuousModePauseTimeoutMs ?? 3000;
});
const whisperVadEnergyThreshold = computed<number>(() => {
    // Defaulting to 4 if not set, this represents average deviation from 128 for silence.
    return props.settings.vadThresholdWhisper ?? 4;
});


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
const startWhisperMediaRecorder = async (forVADCommandCapture: boolean = false): Promise<boolean> => {
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
  speechOccurredInCurrentSegment = false; // Reset for the new segment
  vadSilenceDetectedDurationMs.value = 0; // Reset silence duration for new segment

  if (forVADCommandCapture) {
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
    const wasRecording = isMediaRecorderActive.value;
    const endedSegmentDuration = recordingSegmentSeconds.value;
    const wasForVADCommandContext = currentCaptureIsForVAD.value; // Use the internal flag

    isMediaRecorderActive.value = false;
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor(); // Ensure these are stopped
    _stopVADCommandWhisperSilenceMonitor();
    if (wasForVADCommandContext) _stopAudioVisualisation();


    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || options.mimeType });
      audioChunks = []; // Clear chunks for next recording

      // Only transcribe if actual speech occurred OR if it's PTT/VAD command mode (where user explicitly ends segment)
      if (audioBlob.size > 200 && (speechOccurredInCurrentSegment || isPttMode.value || wasForVADCommandContext) && endedSegmentDuration >= MIN_WHISPER_SEGMENT_DURATION_S) {
        await transcribeWithWhisper(audioBlob);
      } else {
        console.log(`[WSH] Whisper: Segment too short, empty, or no speech detected (size: ${audioBlob.size}, duration: ${endedSegmentDuration.toFixed(2)}s, speechInSeg: ${speechOccurredInCurrentSegment}). Not transcribing.`);
        if (isPttMode.value && endedSegmentDuration < MIN_WHISPER_SEGMENT_DURATION_S) {
            toast?.add({ type: 'info', title: 'Minimal Audio', message: `Very little audio captured.`, duration: 2500 });
        }
        isTranscribingCurrentSegment.value = false;
      }
    } else {
      isTranscribingCurrentSegment.value = false; // No chunks, so not transcribing
    }

    // Post-transcription logic / restart logic for continuous mode
    if (isContinuousMode.value && wasRecording && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM && !wasForVADCommandContext) {
      // Ensure transcription isn't ongoing from this just-stopped segment before restarting.
      // This check might need to be more robust if transcribeWithWhisper is slow to update isTranscribingCurrentSegment.
      if (!isTranscribingCurrentSegment.value) {
        console.log("[WSH] Continuous Whisper: Restarting MediaRecorder for next segment (onstop, after potential transcription).");
        startWhisperMediaRecorder(false); // Restart for a new continuous segment
      } else {
        console.log("[WSH] Continuous Whisper: Transcription in progress, will restart from transcribeWithWhisper's finally block if needed.");
      }
    } else if (wasForVADCommandContext && permissionStatus.value === 'granted') {
      console.log("[WSH] VAD Command (Whisper) MediaRecorder stopped. Parent should handle VAD wake word restart.");
      // Parent (VoiceInput.vue) is responsible for restarting wake word listener after VAD command capture.
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
  };

  mediaRecorder.start(isContinuousMode.value ? 1000 : undefined); // Timeslice for continuous chunking
  isMediaRecorderActive.value = true;
  speechOccurredInCurrentSegment = false; // Reset for this new segment
  _startRecordingSegmentTimer();

  if (isContinuousMode.value && !forVADCommandCapture) {
    _startContinuousWhisperSilenceMonitor();
  } else if (isVoiceActivationMode.value && forVADCommandCapture) {
    _startAudioVisualisation();
    _startVADCommandWhisperSilenceMonitor();
  }
  console.log(`[WSH] MediaRecorder started for Whisper. Mode: ${props.audioInputMode}, VAD Cmd Capture: ${forVADCommandCapture}`);
  return true;
};

const stopWhisperMediaRecorder = () => {
  if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
    console.log("[WSH] MediaRecorder.stop() called explicitly.");
    mediaRecorder.stop(); // This will trigger ondataavailable then onstop
  } else {
    // If not recording, ensure states are clean, but don't call stop() on null/inactive recorder.
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
  if (props.parentIsProcessingLLM && !isContinuousMode.value && !isVoiceActivationMode.value) { // Stricter check for PTT
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for assistant response before new PTT.' });
    isTranscribingCurrentSegment.value = false; // Ensure this doesn't get stuck true
    return;
  }

  isTranscribingCurrentSegment.value = true;
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `whisper-audio-${Date.now()}.${mediaRecorder?.mimeType.split('/')[1]?.split(';')[0] || 'webm'}`);
    if (props.settings.speechLanguage) formData.append('language', props.settings.speechLanguage.substring(0, 2)); // ISO 639-1
    if (props.settings.sttOptions?.prompt) formData.append('prompt', props.settings.sttOptions.prompt);
    // Temperature can be added here if desired: formData.append('temperature', props.settings.sttOptions.temperature.toString());


    console.log(`[WSH] Transcribing with Whisper. Blob size: ${audioBlob.size}`);
    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;

    if (response.data.transcription?.trim()) {
      emit('transcription', response.data.transcription.trim());
    } else if (response.data.transcription === "") {
      console.log("[WSH] Whisper: Empty transcription received (no speech detected by API).");
      if (isPttMode.value || currentCaptureIsForVAD.value) { // Only toast for explicit recordings if empty
        toast?.add({ type: 'info', title: 'No Speech', message: 'Whisper: No speech detected in audio.', duration: 3000 });
      }
    } else {
      // This case might indicate an API error structure not caught by the catch block
      throw new Error(response.data.message || 'Whisper API returned invalid or no transcription text.');
    }
  } catch (error: any) {
    console.error("[WSH] Whisper API Error:", error);
    const msg = error.response?.data?.message || error.message || "Transcription failed.";
    emit('error', { type: 'api', message: msg });
    toast?.add({ type: 'error', title: 'Whisper STT Failed', message: msg });
  } finally {
    isTranscribingCurrentSegment.value = false;
    // If continuous mode was active and this transcription finished, and recorder isn't already active, restart.
    if (isContinuousMode.value && !currentCaptureIsForVAD.value && !isMediaRecorderActive.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
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

    if (isMediaRecorderActive.value) {
      if (isContinuousMode.value && !currentCaptureIsForVAD.value && currentDuration >= MAX_SEGMENT_DURATION_S) {
        console.log(`[WSH] Continuous Whisper: Max segment duration (${MAX_SEGMENT_DURATION_S}s) reached.`);
        stopWhisperMediaRecorder(); // Will trigger onstop, transcribing and restarting continuous
      } else if (isPttMode.value && currentDuration >= 120) { // PTT Max 2 mins
        toast?.add({type:'info', title:'Recording Limit', message:'Max PTT recording (120s) reached.'});
        stopWhisperMediaRecorder();
      } else if (currentCaptureIsForVAD.value && currentDuration >= 60) { // VAD Command Max 1 min
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
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isContinuousMode.value || currentCaptureIsForVAD.value) {
    // console.log("[WSH] Conditions not met for starting continuous silence monitor.");
    return;
  }
  _stopContinuousWhisperSilenceMonitor(); // Ensure previous is stopped

  let silenceStartTime: number | null = null;
  // speechOccurredInCurrentSegment is now managed at the start/stop of MediaRecorder instance

  const dataArray = new Uint8Array(props.analyser.fftSize); // Use fftSize for time domain data length
  console.log("[WSH] Starting continuous Whisper silence monitor.");

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isContinuousMode.value || currentCaptureIsForVAD.value) {
      _stopContinuousWhisperSilenceMonitor(); return;
    }
    props.analyser.getByteTimeDomainData(dataArray); // Switched to TimeDomainData

    let energy = 0;
    for (let i = 0; i < dataArray.length; i++) {
        energy += Math.abs(dataArray[i] - 128); // Sum of deviations from silence midpoint (128 for 8-bit unsigned PCM)
    }
    const averageEnergy = dataArray.length > 0 ? energy / dataArray.length : 0;
    // console.log(`[WSH SilenceDebug Continuous] AvgEnergy: ${averageEnergy.toFixed(2)} (Threshold: ${whisperVadEnergyThreshold.value})`)

    const isCurrentlySpeaking = averageEnergy > whisperVadEnergyThreshold.value;

    if (isCurrentlySpeaking) {
      if (!speechOccurredInCurrentSegment) {
          console.log("[WSH Continuous] Speech started in segment.");
          speechOccurredInCurrentSegment = true;
      }
      silenceStartTime = null; // Reset silence timer as speech is ongoing
      vadSilenceDetectedDurationMs.value = 0;
    } else { // Currently silent
      if (speechOccurredInCurrentSegment) { // Only care about silence if speech has already occurred in this segment
        if (silenceStartTime === null) {
          // console.log("[WSH Continuous] Silence started after speech in segment.");
          silenceStartTime = Date.now();
        }
        vadSilenceDetectedDurationMs.value = Date.now() - silenceStartTime;
        if (vadSilenceDetectedDurationMs.value >= minSilenceDurationForContinuousSegmentEndMs.value) {
          console.log(`[WSH] Continuous Whisper: Silence after speech for ${minSilenceDurationForContinuousSegmentEndMs.value}ms. Stopping segment.`);
          stopWhisperMediaRecorder(); // This will trigger onstop, then transcription and potential restart
          // speechOccurredInCurrentSegment will be reset when MediaRecorder restarts
        }
      } else {
        // Still silent, and no speech has occurred yet in this segment. Do nothing, wait for speech or max duration.
        // console.log("[WSH Continuous] Continued silence, no speech yet in this segment.");
      }
    }
  }, 250); // Check every 250ms
};
const _stopContinuousWhisperSilenceMonitor = () => {
    if (continuousSilenceMonitorIntervalId !== null) clearInterval(continuousSilenceMonitorIntervalId);
    continuousSilenceMonitorIntervalId = null;
    vadSilenceDetectedDurationMs.value = 0;
    // speechOccurredInCurrentSegment is reset when MediaRecorder starts/stops
};


const _startVADCommandWhisperSilenceMonitor = () => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isVoiceActivationMode.value || !currentCaptureIsForVAD.value) return;
  _stopVADCommandWhisperSilenceMonitor();

  hasSpeechOccurredInVADCommand.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.fftSize);
  console.log("[WSH] Starting VAD command Whisper silence monitor.");

  vadCommandInitialNoSpeechTimeoutId = setTimeout(() => {
    if (isMediaRecorderActive.value && !hasSpeechOccurredInVADCommand.value && isVoiceActivationMode.value && currentCaptureIsForVAD.value) {
      console.log(`[WSH] VAD Command (Whisper): Initial no speech timeout (${VAD_COMMAND_INITIAL_NO_SPEECH_TIMEOUT_MS}ms).`);
      toast?.add({ type: 'info', title: 'VAD Timeout', message: 'No speech detected for command.', duration: 3000 });
      stopWhisperMediaRecorder();
    }
  }, VAD_COMMAND_INITIAL_NO_SPEECH_TIMEOUT_MS);

  vadCommandSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isVoiceActivationMode.value || !currentCaptureIsForVAD.value) {
      _stopVADCommandWhisperSilenceMonitor(); return;
    }
    props.analyser.getByteTimeDomainData(dataArray);
    let energy = 0; dataArray.forEach(v => energy += Math.abs(v - 128));
    const averageEnergy = dataArray.length > 0 ? energy / dataArray.length : 0;
    // console.log(`[WSH SilenceDebug VAD Command] AvgEnergy: ${averageEnergy.toFixed(2)}`)

    const isCurrentlySpeaking = averageEnergy > whisperVadEnergyThreshold.value;

    if (isCurrentlySpeaking) {
      if (!hasSpeechOccurredInVADCommand.value) {
        hasSpeechOccurredInVADCommand.value = true;
        console.log("[WSH] VAD Command (Whisper): Speech detected.");
        if (vadCommandInitialNoSpeechTimeoutId) clearTimeout(vadCommandInitialNoSpeechTimeoutId);
        vadCommandInitialNoSpeechTimeoutId = null;
      }
      silenceStartTime = null; // Reset silence timer as speech is ongoing
    } else { // Currently silent
      if (hasSpeechOccurredInVADCommand.value) { // Only care about silence if speech has already occurred
        if (silenceStartTime === null) {
          // console.log("[WSH VAD Command] Silence started after speech.");
          silenceStartTime = Date.now();
        }
        if (Date.now() - silenceStartTime >= VAD_COMMAND_SILENCE_AFTER_SPEECH_MS) {
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

const _startAudioVisualisation = () => {
  if (!props.analyser || !props.activeStream?.active || !vadCanvasRef.value) return;
  _stopAudioVisualisation();

  audioVisualisationIntervalId = setInterval(() => {
    if (!props.analyser || !props.activeStream?.active || !vadCanvasRef.value ||
        !(isVoiceActivationMode.value && isMediaRecorderActive.value && currentCaptureIsForVAD.value) ) {
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
  if (!canvas || !props.analyser || !isMediaRecorderActive.value) return;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  
  // Use TimeDomainData for a more conventional volume/waveform-like visualization
  const bufferLength = props.analyser.fftSize; // analyser.frequencyBinCount is half of fftSize
  const dataArray = new Uint8Array(bufferLength);
  props.analyser.getByteTimeDomainData(dataArray);

  const width = canvas.width; const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  // Example: Simple bar visualization based on max amplitude in the buffer
  let maxAmplitude = 0;
  for (let i = 0; i < bufferLength; i++) {
    const v = Math.abs(dataArray[i] - 128); // Deviation from midpoint
    if (v > maxAmplitude) maxAmplitude = v;
  }
  const barHeight = (maxAmplitude / 128) * height; // Scale to canvas height

  const baseHue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-h').trim() || '270');
  const baseSat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-voice-user-s').trim() || '90%');
  const lightness = 50 + (maxAmplitude / 128) * 20; // Brighter with more sound
  const alpha = 0.5 + (maxAmplitude / 128) * 0.5;

  ctx.fillStyle = `hsla(${baseHue}, ${baseSat}%, ${lightness}%, ${alpha})`;
  ctx.fillRect(0, height - barHeight, width, barHeight); // Single bar representing overall volume
};


// --- Public methods ---
let currentCaptureIsForVAD = ref(false); // Reactive ref for VAD command context

const startListening = async (forVADCommandCapture: boolean = false): Promise<boolean> => {
  console.log(`[WSH] startListening called. forVADCommandCapture: ${forVADCommandCapture}, Current Mode: ${props.audioInputMode}`);
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
  if (props.parentIsProcessingLLM && !isContinuousMode.value && !forVADCommandCapture) {
    // Stricter check for PTT: if LLM is busy, don't start new PTT.
    // For continuous/VAD, they might start recording locally but actual send is gated by parent.
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for assistant response.' });
    return false;
  }

  currentCaptureIsForVAD.value = forVADCommandCapture;
  return startWhisperMediaRecorder(forVADCommandCapture);
};

const stopListening = () => {
  console.log("[WSH] stopListening called (public method).");
  // For Whisper, stopping MediaRecorder is the main action.
  // It will trigger onstop, which handles transcription and potential restarts.
  stopWhisperMediaRecorder();
  currentCaptureIsForVAD.value = false; // Reset VAD context
};

const reinitialize = async () => {
    console.log("[WSH] Reinitializing (likely due to STT preference change or major reset).");
    await stopAll();
};

const stopAll = async () => {
    console.log("[WSH] Stopping all Whisper activities.");
    currentCaptureIsForVAD.value = false; // Reset VAD context
    if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
        try {
            // Detach event handlers before stopping to prevent onstop logic from re-triggering things
            mediaRecorder.onstop = null;
            mediaRecorder.onerror = null;
            mediaRecorder.ondataavailable = null;
            mediaRecorder.stop();
        } catch (e) { console.warn('[WSH] Error stopping MediaRecorder during stopAll:', e); }
    }
    isMediaRecorderActive.value = false;
    isTranscribingCurrentSegment.value = false;

    _stopContinuousWhisperSilenceMonitor();
    _stopVADCommandWhisperSilenceMonitor();
    _stopAudioVisualisation();
    _clearRecordingSegmentTimer();
    audioChunks = []; // Clear any pending chunks
    mediaRecorder = null; // Release the MediaRecorder instance
};


defineExpose({
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  isMediaRecorderActive: computed(() => isMediaRecorderActive.value), // Expose as computed for reactivity
  isTranscribingCurrentSegment: computed(() => isTranscribingCurrentSegment.value),
  recordingSegmentSeconds,
});

watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) {
    console.log(`[WSH] audioInputMode changed from ${oldMode} to ${newMode}. Stopping current Whisper activity.`);
    await stopAll(); // Stop any current Whisper activity fully
    await nextTick();
    
    if (props.settings.sttPreference === 'whisper_api') { // Only auto-start if Whisper is still the preference
        if (newMode === 'continuous' && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
            console.log("[WSH] Auto-starting Whisper for new continuous mode.");
            startListening(false); // forVADCommandCapture is false
        }
        // PTT is user-initiated.
        // VAD command capture is initiated by VoiceInput after wake word from BrowserSpeechHandler.
    }
  }
});

watch(() => props.settings.sttPreference, async (newPref) => {
    if (newPref !== 'whisper_api' && (isMediaRecorderActive.value || isTranscribingCurrentSegment.value)) {
        console.log("[WSH] STT preference changed away from Whisper. Stopping all Whisper activities.");
        await stopAll();
    }
});


onMounted(() => {
  // Auto-start for continuous mode if this handler is active STT preference
  if (props.settings.sttPreference === 'whisper_api' && isContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    startListening(false);
  }
});

onBeforeUnmount(async () => {
  await stopAll();
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
        <CloudArrowUpIcon class="icon-xs inline mr-1.5 text-yellow-500 motion-safe:animate-bounce" /> Transcribing with Whisper...
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
/* Styles specific to the UI elements rendered by this handler */
.whisper-status-ephemeral {
  min-height: 20px; 
  padding-block: 0.2rem; /* Match BrowserSpeechHandler if desired */
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}
.vad-canvas-ephemeral {
  width: 100%; 
  height: 30px; /* Adjust as needed */
  background-color: hsla(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l), 0.1); /* Subtle background */
  border-radius: var(--rounded-md);
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  display: block; /* Ensure it takes block space */
}
.live-transcript-display-ephemeral {
    /* Ensure consistent height or behavior with BrowserSpeechHandler's equivalent element */
    min-height: 20px; /* Example to ensure space is occupied */
}
</style>