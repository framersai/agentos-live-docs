// File: frontend/src/components/voice-input/handlers/WhisperSpeechHandler.vue
/**
 * @file WhisperSpeechHandler.vue
 * @description Component to handle OpenAI Whisper API interactions for Speech-to-Text (STT).
 * Supports Push-to-Talk (PTT) and Continuous mode (segments by silence).
 * This component implements the STT Handler interface expected by `useSttHandlerManager`.
 *
 * @component WhisperSpeechHandler
 * @props {VoiceApplicationSettings} settings - Reactive voice application settings.
 * @props {AudioInputMode} audioInputMode - Current audio input mode (PTT, Continuous, VAD).
 * Note: True VAD (wake word) is not natively supported by this Whisper handler; VAD mode will behave like Continuous.
 * @props {MediaStream | null} activeStream - The active microphone media stream, required for recording.
 * @props {AnalyserNode | null} analyser - Analyser node for silence detection in continuous mode.
 * @props {boolean} parentIsProcessingLLM - Indicates if the parent component (LLM) is busy, to prevent STT conflicts.
 * @props {'prompt'|'granted'|'denied'|'error'|''} initialPermissionStatus - Initial microphone permission status from parent.
 *
 * @emits handler-api-ready - Emits the handler's API object once ready.
 * @emits unmounted - Emitted when the component is about to unmount.
 * @emits transcription - Emits the transcribed text from Whisper API.
 * @emits processing-audio - Emits true when recording audio or waiting for transcription, false otherwise.
 * @emits is-listening-for-wake-word - Emits status of wake word listening (always false for this handler).
 * @emits wake-word-detected - Emits when a wake word is detected (never emitted by this handler).
 * @emits error - Emits error objects for recorder, API, initialization, or permission issues.
 *
 * @version 3.1.0 - Added comprehensive JSDoc, aligned exposed API with STT Handler interface.
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
  readonly, // For readonly refs in exposed API
} from 'vue';
import { speechAPI, type TranscriptionResponseFE } from '@/utils/api';
import {
  type AudioInputMode,
  type VoiceApplicationSettings,
} from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import type { AxiosResponse } from 'axios';
import type { SttHandlerInstance } from '../composables/useSttHandlerManager'; // For API consistency

// Constants
const MIN_AUDIO_BLOB_SIZE_BYTES = 200;
const PREFERRED_MIME_TYPE_BASE = 'audio/webm'; // Opus is generally preferred with webm for size/quality.

/**
 * @interface WhisperProps
 * @description Props definition for the WhisperSpeechHandler component.
 */
interface WhisperProps {
  /** Reactive voice application settings. */
  settings: VoiceApplicationSettings;
  /** Current audio input mode (PTT, Continuous, VAD). */
  audioInputMode: AudioInputMode;
  /** The active microphone media stream. If null, recording cannot start. */
  activeStream: MediaStream | null;
  /** Analyser node for silence detection in continuous mode. */
  analyser: AnalyserNode | null;
  /** Indicates if the parent component (e.g., an LLM) is busy. */
  parentIsProcessingLLM: boolean;
  /** Initial microphone permission status passed from the parent. */
  initialPermissionStatus: 'prompt' | 'granted' | 'denied' | 'error' | '';
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
  /** Emitted when the handler API is ready to be used by the manager.
   * @event handler-api-ready
   * @type {SttHandlerInstance}
   */
  (e: 'handler-api-ready', api: SttHandlerInstance): void;
  /** Emitted when the component is unmounted.
   * @event unmounted
   */
  (e: 'unmounted'): void;
  /** Emitted with the final transcribed text.
   * @event transcription
   * @type {string}
   */
  (e: 'transcription', value: string): void;
  /** Emitted when the handler starts/stops processing audio (recording or sending to API).
   * @event processing-audio
   * @type {boolean}
   */
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  /** Emitted to indicate wake word listening state. (Always false for Whisper)
   * @event is-listening-for-wake-word
   * @type {boolean}
   */
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
   /** Emitted when a wake word is detected. (Never emitted for Whisper)
   * @event wake-word-detected
   */
  (e: 'wake-word-detected'): void;
  /** Emitted on any error during operation.
   * @event error
   * @type {object}
   * @property {'recorder' | 'api' | 'init' | 'permission'} type - The type of error.
   * @property {string} message - A descriptive error message.
   * @property {string} [code] - An optional error code.
   */
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

/** @type {Ref<boolean>} Indicates if the MediaRecorder is currently active (recording). */
const isMediaRecorderActive: Ref<boolean> = ref(false);
/** @type {Ref<boolean>} Indicates if a segment is currently being transcribed by the Whisper API. */
const isTranscribingCurrentSegment: Ref<boolean> = ref(false);
/** @type {Ref<number>} Duration of the current recording segment in seconds. */
const recordingSegmentSeconds: Ref<number> = ref(0);
/** @type {Ref<Blob[]>} Array to store audio chunks from MediaRecorder. */
const audioChunks: Ref<Blob[]> = ref([]);
/** @type {Ref<string>} Current microphone permission status, initialized from props. */
const permissionStatus: Ref<string> = ref(props.initialPermissionStatus);

/** @type {Ref<boolean>} Flag indicating if speech was detected in the current segment (for continuous mode's silence detection). */
const speechOccurredInCurrentSegment: Ref<boolean> = ref(false);
/** @type {Ref<boolean>} Flag indicating if a significant pause has been detected in continuous mode. */
const isWhisperPauseDetected: Ref<boolean> = ref(false);
/** @type {Ref<number>} Countdown in milliseconds for sending transcript after pause in continuous mode. */
const whisperPauseCountdown: Ref<number> = ref(0);
/** @type {Ref<boolean>} Flag to indicate if `stopAll` was called with an intent to abort current processing. */
const isAborting: Ref<boolean> = ref(false);

/** @type {MediaRecorder | null} Instance of the MediaRecorder. */
let mediaRecorder: MediaRecorder | null = null;
/** @type {ReturnType<typeof setInterval> | null} Timer ID for tracking recording segment duration. */
let recordingSegmentTimerId: ReturnType<typeof setInterval> | null = null;
/** @type {ReturnType<typeof setInterval> | null} Timer ID for the continuous mode silence monitor. */
let continuousSilenceMonitorIntervalId: ReturnType<typeof setInterval> | null = null;
/** @type {ReturnType<typeof setTimeout> | null} Timer ID for the pause countdown in continuous mode before sending. */
let whisperPauseCountdownTimerId: ReturnType<typeof setTimeout> | null = null;

/** @type {ComputedRef<boolean>} Computed property true if current audio input mode is 'push-to-talk'. */
const isPttMode = computed<boolean>(() => props.audioInputMode === 'push-to-talk');
/** @type {ComputedRef<boolean>} Computed property true if current audio input mode is 'continuous'. */
const isContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous');
/** @type {ComputedRef<boolean>} Whisper handler currently treats VAD mode similar to Continuous. */
const isEffectiveContinuousMode = computed<boolean>(() => props.audioInputMode === 'continuous' || props.audioInputMode === 'voice-activation');


/**
 * @private
 * @type {ComputedRef<string>}
 * @description Determines the preferred MIME type for MediaRecorder, trying 'audio/webm;codecs=opus' first, then 'audio/webm;codecs=pcm', then 'audio/webm'.
 */
const preferredMimeType = computed<string>(() => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return `${PREFERRED_MIME_TYPE_BASE}`; // Fallback if API not available (e.g. SSR)
  }
  if (MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=opus`)) {
    return `${PREFERRED_MIME_TYPE_BASE};codecs=opus`;
  }
  if (MediaRecorder.isTypeSupported(`${PREFERRED_MIME_TYPE_BASE};codecs=pcm`)) {
    return `${PREFERRED_MIME_TYPE_BASE};codecs=pcm`;
  }
  return `${PREFERRED_MIME_TYPE_BASE}`; // Basic webm
});

/**
 * @private
 * @function _clearRecordingSegmentTimer
 * @description Clears the timer that tracks the duration of the current recording segment and resets the duration.
 */
const _clearRecordingSegmentTimer = (): void => {
  if (recordingSegmentTimerId !== null) clearInterval(recordingSegmentTimerId);
  recordingSegmentTimerId = null;
  recordingSegmentSeconds.value = 0;
};

/**
 * @private
 * @function _stopContinuousWhisperSilenceMonitor
 * @description Stops the silence monitor interval and related pause countdown timer used in continuous mode.
 */
const _stopContinuousWhisperSilenceMonitor = (): void => {
  if (continuousSilenceMonitorIntervalId !== null) clearInterval(continuousSilenceMonitorIntervalId);
  continuousSilenceMonitorIntervalId = null;
  if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
  whisperPauseCountdownTimerId = null;
  isWhisperPauseDetected.value = false;
  whisperPauseCountdown.value = 0;
};

/**
 * @private
 * @function _startContinuousWhisperSilenceMonitor
 * @description Starts the silence monitor for continuous mode. This uses the AnalyserNode to detect periods of silence
 * after speech has occurred, triggering segment finalization if configured.
 */
const _startContinuousWhisperSilenceMonitor = (): void => {
  if (!props.analyser || !props.activeStream?.active || !isMediaRecorderActive.value || !isEffectiveContinuousMode.value) {
    console.warn('[WSH] Conditions not met to start silence monitor.');
    return;
  }
  _stopContinuousWhisperSilenceMonitor(); // Ensure any existing monitor is stopped

  speechOccurredInCurrentSegment.value = false;
  let silenceStartTime: number | null = null;
  const dataArray = new Uint8Array(props.analyser.frequencyBinCount);

  console.log('[WSH] Starting continuous Whisper silence monitor.');

  continuousSilenceMonitorIntervalId = setInterval(() => {
    if (!props.analyser || !isMediaRecorderActive.value || !isEffectiveContinuousMode.value) {
      _stopContinuousWhisperSilenceMonitor();
      return;
    }
    props.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    dataArray.forEach((v) => (sum += v));
    const avgByte = dataArray.length > 0 ? sum / dataArray.length : 0;
    // Convert average byte value to dBFS (approximate)
    const levelInDb = props.analyser.minDecibels + (avgByte / 255) * (props.analyser.maxDecibels - props.analyser.minDecibels);

    if (levelInDb >= (props.settings.vadSensitivityDb ?? -45)) { // Speech detected
      speechOccurredInCurrentSegment.value = true;
      silenceStartTime = null; // Reset silence timer
      if (isWhisperPauseDetected.value) { // If speech resumes during pause countdown
        if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
        whisperPauseCountdownTimerId = null;
        isWhisperPauseDetected.value = false;
        whisperPauseCountdown.value = 0;
        console.log('[WSH Continuous] Speech resumed during pause countdown. Countdown cancelled.');
      }
    } else { // Silence detected
      if (speechOccurredInCurrentSegment.value && !isWhisperPauseDetected.value) { // Only start pause logic if speech has occurred in this segment
        if (silenceStartTime === null) silenceStartTime = Date.now();
        
        if (Date.now() - silenceStartTime >= (props.settings.continuousModePauseTimeoutMs || 3000)) {
          const sendDelay = props.settings.continuousModeSilenceSendDelayMs ?? 1000;
          console.log(`[WSH Continuous] Silence threshold met. Starting ${sendDelay}ms 'Sending in...' countdown.`);
          isWhisperPauseDetected.value = true;
          whisperPauseCountdown.value = sendDelay;

          if (whisperPauseCountdownTimerId) clearTimeout(whisperPauseCountdownTimerId);
          whisperPauseCountdownTimerId = setTimeout(() => {
            if (isWhisperPauseDetected.value) { // Check if still in pause detected state (speech didn't resume)
              console.log("[WSH Continuous] 'Sending in...' countdown finished. Stopping current recording segment.");
              _stopMediaRecorderAndFinalizeSegment(); // Finalize the segment for transcription
            }
            // Reset pause detection state regardless of whether segment was finalized
            isWhisperPauseDetected.value = false;
            whisperPauseCountdown.value = 0;
            whisperPauseCountdownTimerId = null;
          }, sendDelay);
        }
      }
    }
  }, 250); // Check for silence every 250ms
};

/**
 * @private
 * @function _stopMediaRecorderAndFinalizeSegment
 * @description Stops the MediaRecorder if it's active. This will trigger the `onstop` event,
 * which in turn calls `_processRecordedSegment`.
 */
const _stopMediaRecorderAndFinalizeSegment = (): void => {
  if (mediaRecorder && isMediaRecorderActive.value) {
    console.log('[WSH] Requesting MediaRecorder to stop. onstop will process segment.');
    mediaRecorder.stop(); // This is asynchronous; onstop event handles the rest.
  } else {
    // console.log('[WSH] _stopMediaRecorderAndFinalizeSegment: MediaRecorder not active or already stopped.');
    if (isEffectiveContinuousMode.value) _stopContinuousWhisperSilenceMonitor();
    _clearRecordingSegmentTimer();
  }
};

/**
 * @private
 * @async
 * @function _processRecordedSegment
 * @description Called when MediaRecorder stops. Collects audio chunks, creates a Blob,
 * and sends it for transcription if conditions are met. Restarts recording in continuous mode.
 */
const _processRecordedSegment = async (): Promise<void> => {
  const wasMediaRecorderActiveWhenStopped = isMediaRecorderActive.value; // Capture state before reset
  isMediaRecorderActive.value = false; // Mark as no longer recording immediately
  
  if (isAborting.value) {
    isAborting.value = false; // Reset abort flag
    console.log("[WSH] Aborted. Processing of recorded segment skipped.");
    if (wasMediaRecorderActiveWhenStopped) emit('processing-audio', false);
    audioChunks.value = [];
    _clearRecordingSegmentTimer();
    _stopContinuousWhisperSilenceMonitor();
    return;
  }

  if (wasMediaRecorderActiveWhenStopped) {
    emit('processing-audio', false); // Emit false as recording part is done. Transcription might follow.
  }

  const wasEffectiveContinuous = isEffectiveContinuousMode.value; // Capture mode at time of processing
  const localSpeechOccurred = speechOccurredInCurrentSegment.value;
  const endedSegmentDuration = recordingSegmentSeconds.value;

  _clearRecordingSegmentTimer(); // Clear timer now that segment has ended
  if (wasEffectiveContinuous) _stopContinuousWhisperSilenceMonitor(); // Stop monitor

  const currentAudioChunks = [...audioChunks.value]; // Copy chunks for processing
  audioChunks.value = []; // Clear original chunks immediately

  if (currentAudioChunks.length > 0) {
    const audioBlob = new Blob(currentAudioChunks, { type: mediaRecorder?.mimeType || preferredMimeType.value });
    const minDuration = props.settings.minWhisperSegmentDurationS ?? 0.75;

    if (localSpeechOccurred && audioBlob.size > MIN_AUDIO_BLOB_SIZE_BYTES && endedSegmentDuration >= minDuration) {
      isTranscribingCurrentSegment.value = true;
      emit('processing-audio', true); // Now indicate transcription processing
      await transcribeWithWhisper(audioBlob);
    } else {
      console.log(`[WSH] Segment not transcribed (Size: ${audioBlob.size}, Duration: ${endedSegmentDuration.toFixed(2)}s, Speech Detected: ${localSpeechOccurred}, MinDuration: ${minDuration}s).`);
      isTranscribingCurrentSegment.value = false;
      // If not transcribing, ensure processing-audio is false if it was set true by a quick previous emit
      if (!isMediaRecorderActive.value) emit('processing-audio', false);
    }
  } else {
    console.log('[WSH] No audio chunks captured in the last segment.');
    isTranscribingCurrentSegment.value = false;
    if (!isMediaRecorderActive.value) emit('processing-audio', false);
  }

  // Handle restart for continuous mode
  if (wasEffectiveContinuous && permissionStatus.value === 'granted') {
    if (props.parentIsProcessingLLM) {
      console.log('[WSH Continuous] Parent is processing LLM. Deferring MediaRecorder restart.');
    } else if (!isTranscribingCurrentSegment.value && !isMediaRecorderActive.value) { // Only restart if not currently transcribing AND recorder is truly stopped
      console.log('[WSH Continuous] Restarting MediaRecorder (from _processRecordedSegment completion).');
      await nextTick(); // Allow Vue to settle
      startListening(false); // Restart listening for continuous mode
    } else if (isTranscribingCurrentSegment.value) {
      console.log("[WSH Continuous] Transcription in progress. Restart for continuous will be handled by transcribeWithWhisper's finally block.");
    }
  } else if (wasEffectiveContinuous && permissionStatus.value !== 'granted') {
    console.warn("[WSH Continuous] Cannot restart continuous mode, microphone permission not granted.");
  }
};

/**
 * @public
 * @async
 * @function startListening
 * @description Starts the MediaRecorder to capture audio.
 * Checks for permissions and active stream before starting.
 * Manages different behaviors for PTT and Continuous modes.
 * @param {boolean} [forVADCommand=false] - Kept for SttHandlerInstance interface consistency. Whisper handler does not use it.
 * @returns {Promise<boolean>} True if recording started successfully, false otherwise.
 */
const startListening = async (forVADCommand: boolean = false): Promise<boolean> => {
  console.log(`[WSH] Attempting to start listening. Mode: ${props.audioInputMode}, MediaRecorderActive: ${isMediaRecorderActive.value}, VADCommand: ${forVADCommand}`);
  if (isMediaRecorderActive.value) {
    console.warn('[WSH] startListening called but MediaRecorder is already active.');
    return true; // Already active
  }
  if (permissionStatus.value !== 'granted' || !props.activeStream) {
    const msg = permissionStatus.value !== 'granted' ? 'Microphone permission not granted.' : 'No active audio stream available.';
    emit('error', { type: 'permission', message: msg });
    if (permissionStatus.value !== 'granted') { // Avoid duplicate toasts if already handled by useMicrophone
        toast?.add({ type: 'warning', title: 'Microphone Required', message: msg });
    }
    return false;
  }
  // For PTT, allow starting even if LLM processing (user might want to record next query).
  // For Continuous, if LLM is processing, it will record but `transcribeWithWhisper` will skip API call.
  if (props.parentIsProcessingLLM && isPttMode.value /* consider if continuous should also be blocked here */) {
    console.log('[WSH] LLM is processing. PTT start allowed, but transcription might be queued or affected.');
    // toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Recording started, but assistant is responding.' });
  }


  audioChunks.value = []; // Clear any stale chunks
  speechOccurredInCurrentSegment.value = false; // Reset speech detection for the new segment

  try {
    const options = { mimeType: preferredMimeType.value };
    if (!props.activeStream) { // Redundant check, but good for type safety before use
        throw new Error("Assertion failed: props.activeStream is null when it should be available.");
    }
    mediaRecorder = new MediaRecorder(props.activeStream, options);
    console.log(`[WSH] MediaRecorder created with options: ${JSON.stringify(options)}`);
  } catch (e: any) {
    console.error('[WSH] MediaRecorder initialization failed:', e.message, e);
    emit('error', { type: 'init', message: `Recorder initialization error: ${e.message}. Please ensure your browser supports ${preferredMimeType.value}.`});
    return false;
  }

  mediaRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunks.value.push(event.data);
    }
  };

  mediaRecorder.onstop = async () => { // Make onstop async to await _processRecordedSegment
    console.log('[WSH] MediaRecorder.onstop triggered.');
    await _processRecordedSegment();
  };

  mediaRecorder.onerror = (event: Event) => { // MediaRecorderErrorEvent is better but Event is safer
    const errorEvent = event as any; // Cast to access potential error details
    const errorDetail = errorEvent.error || new Error('Unknown MediaRecorder error');
    console.error('[WSH] MediaRecorder error:', errorDetail.name, errorDetail.message);
    emit('error', {
      type: 'recorder',
      message: `MediaRecorder error: ${errorDetail.name || 'UnknownError'} - ${errorDetail.message || 'N/A'}`,
      code: errorDetail.name,
    });
    isMediaRecorderActive.value = false; // Ensure state is reset
    emit('processing-audio', false);
    _clearRecordingSegmentTimer();
    if (isEffectiveContinuousMode.value) _stopContinuousWhisperSilenceMonitor();

    // Attempt to restart in continuous mode if error wasn't fatal for the stream
    if (isEffectiveContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
      if (errorDetail.name !== 'SecurityError' && errorDetail.name !== 'NotAllowedError') { // Don't restart on permission/security errors
        console.warn("[WSH] Attempting to restart continuous listening after non-fatal recorder error.");
        nextTick(() => startListening(false));
      }
    }
  };
  
  // Start recording. For continuous, use a timeslice to get periodic data.
  // For PTT, record as one segment until stopListening() is called.
  mediaRecorder.start(isEffectiveContinuousMode.value ? 250 : undefined); // timeslice in ms for continuous
  isMediaRecorderActive.value = true;
  emit('processing-audio', true); // Indicate that we are now actively recording
  _startRecordingSegmentTimer();

  if (isEffectiveContinuousMode.value) {
    _startContinuousWhisperSilenceMonitor();
  }
  console.log(`[WSH] MediaRecorder started. Mode: ${props.audioInputMode}, Effective Continuous: ${isEffectiveContinuousMode.value}`);
  return true;
};

/**
 * @public
 * @async
 * @function stopListening
 * @description Stops the MediaRecorder. The actual processing and transcription happen in `onstop`.
 * @param {boolean} [abort=false] - If true, attempts to prevent processing of the current segment. (Currently advisory, actual abort logic in _processRecordedSegment)
 * @returns {Promise<void>}
 */
const stopListening = async (abort: boolean = false): Promise<void> => {
  console.log(`[WSH] Public stopListening called. Abort intention: ${abort}`);
  if (abort) {
    isAborting.value = true; // Set abort flag for _processRecordedSegment to check
  }
  _stopMediaRecorderAndFinalizeSegment(); // This will trigger onstop event
};

/**
 * @private
 * @async
 * @function transcribeWithWhisper
 * @description Sends the recorded audio blob to the backend for transcription using the Whisper API.
 * Emits 'transcription' on success, or 'error' on failure.
 * Manages `isTranscribingCurrentSegment` and `processing-audio` states.
 * @param {Blob} audioBlob - The audio data to transcribe.
 */
const transcribeWithWhisper = async (audioBlob: Blob): Promise<void> => {
  console.log(`[WSH] Preparing to transcribe with Whisper. Blob size: ${audioBlob.size}`);

  if (props.parentIsProcessingLLM) {
    console.log("[WSH] Parent is processing LLM. Transcription via Whisper API skipped for this segment.");
    isTranscribingCurrentSegment.value = false; // Ensure flag is reset
    // If media recorder is also stopped, ensure overall processing is false
    if (!isMediaRecorderActive.value) emit('processing-audio', false);
    
    // If in continuous mode and LLM was busy, ensure recorder restarts if conditions met
    if (isEffectiveContinuousMode.value && permissionStatus.value === 'granted' && !isMediaRecorderActive.value) {
      console.log("[WSH Continuous] (transcribeWithWhisper) LLM was busy. Restarting MediaRecorder.");
      await nextTick();
      startListening(false);
    }
    return;
  }

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio-${Date.now()}.${preferredMimeType.value.split('/')[1]?.split(';')[0] || 'webm'}`);
    if (props.settings.speechLanguage) {
      formData.append('language', props.settings.speechLanguage.substring(0, 2)); // API expects 2-letter code
    }
    if (props.settings.sttOptions?.prompt) {
      formData.append('prompt', props.settings.sttOptions.prompt);
    }
    // Add other Whisper params like temperature if needed, from props.settings.sttOptions

    const response = (await speechAPI.transcribe(formData)) as AxiosResponse<TranscriptionResponseFE & { message?: string }>;

    if (response.data && typeof response.data.transcription === 'string') {
      if (response.data.transcription.trim()) {
        emit('transcription', response.data.transcription.trim());
      } else {
        console.log('[WSH] Whisper API: Empty transcription received (all silence or no speech).');
        // Optionally toast for PTT mode if no speech detected by Whisper
        if (isPttMode.value) {
          toast?.add({ type: 'info', title: 'No Speech Detected', message: 'Whisper found no speech in the audio.', duration: 3000 });
        }
      }
    } else {
      // This case handles if response.data or response.data.transcription is missing/null
      throw new Error(response.data?.message || 'Whisper API returned invalid or no transcription data.');
    }
  } catch (error: any) {
    console.error('[WSH] Whisper API Error:', error.response?.data || error.message || error);
    emit('error', {
      type: 'api',
      message: error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Transcription failed due to API error.',
      code: error.response?.status?.toString() || error.code || 'API_ERROR',
    });
  } finally {
    const wasTranscribing = isTranscribingCurrentSegment.value;
    isTranscribingCurrentSegment.value = false;
    // Only set overall processing to false if media recorder is also stopped
    if (wasTranscribing && !isMediaRecorderActive.value) {
      emit('processing-audio', false);
    }

    // Handle restart for continuous mode if appropriate
    if (isEffectiveContinuousMode.value && permissionStatus.value === 'granted') {
      if (props.parentIsProcessingLLM) {
        console.log('[WSH Continuous] (transcribe finally) Parent is processing LLM. Deferring MediaRecorder restart.');
      } else if (!isMediaRecorderActive.value) { // Ensure recorder is not already running (e.g. due to quick succession)
        console.log('[WSH Continuous] (transcribe finally) Restarting MediaRecorder after transcription attempt.');
        await nextTick();
        startListening(false);
      }
    }
  }
};

/**
 * @private
 * @function _startRecordingSegmentTimer
 * @description Starts a timer to track the duration of the current recording segment.
 * Enforces maximum recording durations based on the audio input mode.
 */
const _startRecordingSegmentTimer = (): void => {
  _clearRecordingSegmentTimer(); // Clear any existing timer
  recordingSegmentSeconds.value = 0;
  const maxDurationContinuous = props.settings.maxSegmentDurationS ?? 28; // Use a specific max for continuous segments
  const maxDurationPtt = 120; // Longer max for PTT

  recordingSegmentTimerId = setInterval(() => {
    recordingSegmentSeconds.value += 0.1; // Increment every 100ms
    const currentDuration = recordingSegmentSeconds.value;

    if (isMediaRecorderActive.value) { // Only check if still recording
      if (isEffectiveContinuousMode.value && currentDuration >= maxDurationContinuous) {
        console.log(`[WSH] Continuous Whisper: Max segment duration (${maxDurationContinuous}s) reached. Finalizing segment.`);
        _stopMediaRecorderAndFinalizeSegment();
      } else if (isPttMode.value && currentDuration >= maxDurationPtt) {
        toast?.add({ type: 'info', title: 'Recording Limit Reached', message: `Max PTT recording duration (${maxDurationPtt}s) met.`, duration: 4000});
        _stopMediaRecorderAndFinalizeSegment();
      }
    } else { // If recorder stopped externally, clear timer
      _clearRecordingSegmentTimer();
    }
  }, 100);
};


/**
 * @public
 * @async
 * @function reinitialize
 * @description Reinitializes the Whisper handler. Stops any current activity and prepares for new input.
 * If in continuous/VAD mode and conditions allow, it may auto-start listening.
 * @returns {Promise<void>}
 */
const reinitialize = async (): Promise<void> => {
  console.log('[WSH] Reinitializing WhisperSpeechHandler...');
  await stopAll(true); // Force abort current activities
  await nextTick(); // Allow Vue to process state changes

  // After stopping, if mode is continuous/VAD and conditions are right, auto-start.
  if (isEffectiveContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM && !isMediaRecorderActive.value) {
    console.log('[WSH] Reinitialize: Conditions met for auto-starting in continuous/VAD mode.');
    startListening(false);
  } else {
    console.log('[WSH] Reinitialize: Not auto-starting. Conditions:',
      `EffectiveContinuous: ${isEffectiveContinuousMode.value}`,
      `Permission: ${permissionStatus.value}`,
      `LLM Processing: ${props.parentIsProcessingLLM}`,
      `Recorder Active: ${isMediaRecorderActive.value}`);
  }
};

/**
 * @public
 * @async
 * @function stopAll
 * @description Stops all MediaRecorder activities, clears timers, and optionally aborts processing of the current segment.
 * @param {boolean} [abort=true] - If true, sets a flag to try and prevent processing of the currently recorded audio.
 * @returns {Promise<void>}
 */
const stopAll = async (abort: boolean = true): Promise<void> => {
  console.log(`[WSH] stopAll called. Abort intention: ${abort}`);

  if (abort) {
    isAborting.value = true; // Signal to _processRecordedSegment to skip transcription
  }

  if (mediaRecorder && isMediaRecorderActive.value) {
    console.log('[WSH] stopAll: MediaRecorder active, calling stop().');
    mediaRecorder.stop(); // This will trigger onstop, which respects isAborting.value
  } else if (isAborting.value) {
    // If no active recorder but abort was called, ensure flag is reset and states cleaned.
    isAborting.value = false;
    audioChunks.value = [];
    if (!isTranscribingCurrentSegment.value) { // If not even transcribing, ensure overall processing is false
         emit('processing-audio', false);
    }
  }
  
  // Clear all timers irrespective of recorder state
  _clearRecordingSegmentTimer();
  _stopContinuousWhisperSilenceMonitor();

  // If not recording and not transcribing, ensure processing-audio is false.
  // This handles cases where stopAll is called when idle or only transcribing.
  if (!isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    emit('processing-audio', false);
  }
};

// --- Watchers ---

/**
 * @watch props.initialPermissionStatus
 * @description Updates the internal permission status when the prop changes.
 */
watch(() => props.initialPermissionStatus, (newVal) => {
  if (permissionStatus.value !== newVal) {
    console.log(`[WSH] Initial permission status prop changed to: ${newVal}`);
    permissionStatus.value = newVal;
  }
});

/**
 * @watch props.parentIsProcessingLLM
 * @description Handles changes in the parent's LLM processing state.
 * If LLM finishes processing and conditions are right, restarts continuous listening.
 * If LLM starts processing during PTT, stops PTT recording.
 */
watch(() => props.parentIsProcessingLLM, async (isLLMProcessing) => {
  console.log(`[WSH] parentIsProcessingLLM changed to: ${isLLMProcessing}`);
  if (!isLLMProcessing && isEffectiveContinuousMode.value && permissionStatus.value === 'granted' && !isMediaRecorderActive.value && !isTranscribingCurrentSegment.value) {
    console.log('[WSH Continuous] Parent LLM processing finished. Conditions met to restart listening.');
    await nextTick();
    startListening(false);
  } else if (isLLMProcessing && isPttMode.value && isMediaRecorderActive.value) {
    console.log('[WSH PTT] Parent LLM processing started. Stopping active PTT recording.');
    await stopListening(false); // Graceful stop for PTT if LLM starts
  }
});

/**
 * @watch props.activeStream
 * @description Monitors the activeStream prop. If it becomes null or inactive, stops all recording.
 * If a new, valid stream is provided and conditions are right (e.g. continuous mode), may restart listening.
 */
watch(() => props.activeStream, async (newStream, oldStream) => {
    if (newStream === oldStream) return; // No change in stream identity

    console.log(`[WSH] activeStream prop changed. New stream active: ${newStream?.active}`);
    await stopAll(true); // Stop everything if stream changes or becomes null

    if (newStream?.active && permissionStatus.value === 'granted' && isEffectiveContinuousMode.value && !props.parentIsProcessingLLM) {
        console.log('[WSH] New active stream detected. Attempting to restart continuous listening.');
        await nextTick();
        startListening(false);
    } else if (!newStream?.active) {
        console.log('[WSH] Active stream became null or inactive.');
    }
});

/**
 * @watch props.audioInputMode
 * @description Handles changes to the audio input mode. Stops current activities and reinitializes
 * the handler, which may auto-start listening if the new mode is continuous/VAD.
 */
watch(() => props.audioInputMode, async (newMode, oldMode) => {
    if (newMode === oldMode) return;
    console.log(`[WSH] audioInputMode changed: ${oldMode} -> ${newMode}. Reinitializing.`);
    await reinitialize(); // Reinitialize will stop current and then auto-start if appropriate
});


// --- Lifecycle Hooks ---

onMounted(() => {
  console.log('[WSH] WhisperSpeechHandler Mounted.');
  permissionStatus.value = props.initialPermissionStatus; // Ensure internal state matches initial prop

  const api: SttHandlerInstance = {
    startListening,
    stopListening,
    reinitialize,
    stopAll,
    isActive: readonly(isMediaRecorderActive), // Expose as readonly
    isListeningForWakeWord: readonly(ref(false)), // Whisper doesn't do VAD wake word listening
    // For pending transcript, Whisper finalizes per segment. No persistent interim like browser STT.
    hasPendingTranscript: readonly(ref(false)), 
    pendingTranscript: readonly(ref('')),
    clearPendingTranscript: () => { /* No-op for Whisper as it's segment-based */ },
  };
  emit('handler-api-ready', api);

  // Auto-start for continuous/VAD modes if conditions are met on mount
  if (isEffectiveContinuousMode.value && permissionStatus.value === 'granted' && !props.parentIsProcessingLLM) {
    console.log('[WSH Mounted] Conditions met for auto-start in continuous/VAD mode.');
    startListening(false);
  }
});

onBeforeUnmount(async () => {
  console.log('[WSH] WhisperSpeechHandler Unmounting. Stopping all activities.');
  await stopAll(true); // Ensure everything is aborted and cleaned up
  mediaRecorder = null; // Clear MediaRecorder instance
  emit('unmounted');
});

// Expose the API for the STT Handler Manager
// defineExpose is already handled by emitting 'handler-api-ready' with the API object.
</script>