// File: frontend/src/components/useMicrophone.ts
import { ref, computed, shallowRef, type Ref, type ShallowRef } from 'vue';
import type { ToastService } from '../services/services'; // Adjust path as necessary
import type { VoiceApplicationSettings } from '@/services/voice.settings.service'; // Adjust path

/**
 * @file useMicrophone.ts
 * @description Composable for managing microphone access, MediaStream, AudioContext, and AnalyserNode.
 * @version 1.0.0
 */

// Ambient Type Declarations (consider moving to a global d.ts file if not already)
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

/**
 * Options for initializing the microphone manager.
 */
export interface UseMicrophoneOptions {
  settings: Readonly<Ref<VoiceApplicationSettings>>; // Make settings reactive and readonly from parent
  toast?: ToastService;
  onPermissionUpdateGlobally: (status: 'granted' | 'denied' | 'prompt' | 'error') => void;
}

/**
 * Manages microphone access, the audio stream, and associated audio processing nodes.
 * @param {UseMicrophoneOptions} options - Configuration options.
 * @returns The microphone manager API.
 */
export function useMicrophone(options: UseMicrophoneOptions) {
  const { settings, toast, onPermissionUpdateGlobally } = options;

  const activeStream: ShallowRef<MediaStream | null> = shallowRef(null);
  const audioContext: ShallowRef<AudioContext | null> = shallowRef(null);
  const analyser: ShallowRef<AnalyserNode | null> = shallowRef(null);
  const microphoneSourceNode: ShallowRef<MediaStreamAudioSourceNode | null> = shallowRef(null);

  const permissionStatus: Ref<'prompt' | 'granted' | 'denied' | 'error' | ''> = ref('');
  const permissionMessage: Ref<string> = ref('');
  const micAccessInitiallyChecked: Ref<boolean> = ref(false);

  const selectedAudioDeviceId = computed(() => settings.value.selectedAudioInputDeviceId);

  // Constants for AnalyserNode (can be made configurable if needed)
  const SILENCE_ANALYSER_FFT_SIZE = 256;
  const SILENCE_ANALYSER_SMOOTHING = 0.6;

  /**
   * Closes existing audio resources like MediaStream tracks, AudioContext, etc.
   * @async
   */
  const _closeExistingAudioResources = async (): Promise<void> => {
    if (activeStream.value) {
      activeStream.value.getTracks().forEach(track => track.stop());
      activeStream.value = null;
    }
    if (microphoneSourceNode.value) {
      try { microphoneSourceNode.value.disconnect(); } catch(e) { console.warn("[useMicrophone] Error disconnecting source node:", e); }
      microphoneSourceNode.value = null;
    }
    if (analyser.value) {
      try { analyser.value.disconnect(); } catch(e) { console.warn("[useMicrophone] Error disconnecting analyser node:", e); }
      analyser.value = null;
    }
    if (audioContext.value && audioContext.value.state !== 'closed') {
      try {
        await audioContext.value.close();
      } catch (e) {
        console.warn("[useMicrophone] Error closing previous AudioContext:", e);
      }
      audioContext.value = null;
    }
    console.log("[useMicrophone] Audio resources closed.");
  };

  /**
   * Requests microphone permission and initializes the audio stream and nodes.
   * @param {boolean} [attemptCloseExisting=true] - Whether to close existing resources before requesting.
   * @returns {Promise<MediaStream | null>} The acquired MediaStream or null if failed.
   */
  const requestMicrophonePermissionsAndGetStream = async (attemptCloseExisting: boolean = true): Promise<MediaStream | null> => {
    permissionMessage.value = 'Requesting microphone access...';
    permissionStatus.value = 'prompt';
    onPermissionUpdateGlobally('prompt'); // Notify parent component

    if (attemptCloseExisting) {
      await _closeExistingAudioResources();
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioDeviceId.value
          ? { deviceId: { exact: selectedAudioDeviceId.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeStream.value = stream;

      const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.value = newAudioContext;

      microphoneSourceNode.value = newAudioContext.createMediaStreamSource(stream);
      
      const newAnalyser = newAudioContext.createAnalyser();
      newAnalyser.fftSize = SILENCE_ANALYSER_FFT_SIZE;
      newAnalyser.smoothingTimeConstant = SILENCE_ANALYSER_SMOOTHING;
      newAnalyser.minDecibels = -100; // Standard min
      newAnalyser.maxDecibels = -0;   // Standard max (0 dBFS is max signal)
      analyser.value = newAnalyser;

      microphoneSourceNode.value.connect(analyser.value);
      // Do NOT connect analyser.value to audioContext.value.destination unless you want to hear the mic input.

      permissionStatus.value = 'granted';
      permissionMessage.value = 'Microphone ready.';
      onPermissionUpdateGlobally('granted');
      setTimeout(() => { if (permissionStatus.value === 'granted') permissionMessage.value = ''; }, 2500);
      micAccessInitiallyChecked.value = true;
      console.log("[useMicrophone] Microphone access granted and stream initialized.");
      return stream;
    } catch (err: any) {
      console.error("[useMicrophone] getUserMedia error:", err.name, err.message, err);
      let specificError: 'denied' | 'error' = 'error';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        permissionMessage.value = 'Microphone access denied.'; specificError = 'denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        permissionMessage.value = 'No microphone found.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        permissionMessage.value = 'Microphone is busy or cannot be read.';
      } else {
        permissionMessage.value = `Mic error: ${err.name || 'Unknown'}.`;
      }
      permissionStatus.value = specificError;
      toast?.add({ type: 'error', title: 'Mic Access Failed', message: permissionMessage.value, duration: 7000 });
      onPermissionUpdateGlobally(specificError);
      micAccessInitiallyChecked.value = true;
      activeStream.value = null; audioContext.value = null; analyser.value = null; microphoneSourceNode.value = null;
      return null;
    }
  };

  /**
   * Ensures microphone access is granted and the stream is active, re-acquiring if necessary.
   * This expects that any higher-level audio processing (STT handlers) will be stopped by the caller *before* calling this,
   * especially if it might lead to `_closeExistingAudioResources`.
   * @returns {Promise<boolean>} True if access is granted and stream is active.
   */
  const ensureMicrophoneAccessAndStream = async (): Promise<boolean> => {
    if (permissionStatus.value === 'granted' && activeStream.value?.active) {
      const currentTrackSettings = activeStream.value.getAudioTracks()[0]?.getSettings();
      if (currentTrackSettings?.deviceId === selectedAudioDeviceId.value || 
         (!selectedAudioDeviceId.value && !currentTrackSettings?.deviceId) ) { // No specific device ID selected, and current is default
        return true;
      }
      console.log("[useMicrophone] Microphone device changed or stream invalid, re-acquiring stream. Caller should have stopped STT handlers.");
      // Resources will be closed by requestMicrophonePermissionsAndGetStream via attemptCloseExisting=true
      // It's crucial that STT handlers using the old stream/context are fully stopped before this.
    }
    const stream = await requestMicrophonePermissionsAndGetStream(true); // Attempt to close and re-acquire
    return !!(stream && stream.active);
  };

  /**
   * Releases all microphone and audio context resources.
   * @async
   */
  const releaseAllMicrophoneResources = async (): Promise<void> => {
    await _closeExistingAudioResources();
    // Do not reset permissionStatus here as it reflects the actual OS/browser permission state.
    // Resetting micAccessInitiallyChecked might be considered if it influences UI to re-prompt.
  };

  return {
    activeStream,
    audioContext,
    analyser,
    // microphoneSourceNode, // Not typically needed directly by parent
    permissionStatus,
    permissionMessage,
    micAccessInitiallyChecked,
    requestMicrophonePermissionsAndGetStream,
    ensureMicrophoneAccessAndStream,
    releaseAllMicrophoneResources,
  };
}