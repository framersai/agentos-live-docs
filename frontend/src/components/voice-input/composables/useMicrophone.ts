// File: frontend/src/components/useMicrophone.ts
/**
 * @file useMicrophone.ts
 * @description Composable for managing microphone access, MediaStream, AudioContext,
 * and a basic AnalyserNode for activity detection.
 * It handles permissions, device selection, and resource cleanup.
 *
 * @module composables/useMicrophone
 * @version 1.1.0 - Improved JSDoc, error handling, and resource management.
 * Clarified analyser node purpose.
 */

import { ref, computed, shallowRef, type Ref, type ShallowRef, readonly } from 'vue';
import type { ToastService } from '../../../services/services'; // Adjusted path assuming services.ts is in ../services
import type { VoiceApplicationSettings } from '@/services/voice.settings.service';

// Ambient Type Declarations for older browser compatibility (e.g., Safari)
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

/**
 * Options for initializing the microphone manager.
 */
export interface UseMicrophoneOptions {
  /** Reactive reference to the application's voice settings. Must be Readonly<Ref<...>> or compatible. */
  settings: Readonly<Ref<VoiceApplicationSettings>>;
  /** Optional toast service for displaying notifications. */
  toast?: ToastService;
  /** Callback function to globally update microphone permission status. */
  onPermissionUpdateGlobally: (
    status: 'prompt' | 'granted' | 'denied' | 'error'
  ) => void;
}

/**
 * Provides a structured return type for the `useMicrophone` composable.
 */
export interface UseMicrophoneReturn {
  /** The active MediaStream from the microphone, or null if not active/granted. Uses shallowRef for performance. */
  activeStream: Readonly<ShallowRef<MediaStream | null>>;
  /** The global AudioContext instance associated with the active stream. Uses shallowRef. */
  audioContext: Readonly<ShallowRef<AudioContext | null>>;
  /** An AnalyserNode connected to the microphone source, useful for basic audio analysis (e.g., silence detection, VAD). Uses shallowRef. */
  analyser: Readonly<ShallowRef<AnalyserNode | null>>;
  /** Current status of microphone permission ('prompt', 'granted', 'denied', 'error', or empty string if not yet determined). */
  permissionStatus: Readonly<Ref<'prompt' | 'granted' | 'denied' | 'error' | ''>>;
  /** A user-friendly message related to the current permission status or errors. */
  permissionMessage: Readonly<Ref<string>>; // Kept for potential direct UI use or debugging
  /** Flag indicating if microphone access has been checked at least once during the session. */
  micAccessInitiallyChecked: Readonly<Ref<boolean>>;
  /** Function to request microphone permissions and initialize the audio stream and nodes. */
  requestMicrophonePermissionsAndGetStream: (attemptCloseExisting?: boolean) => Promise<MediaStream | null>;
  /** Function to ensure microphone access is granted and stream is active, re-acquiring if necessary. */
  ensureMicrophoneAccessAndStream: () => Promise<boolean>;
  /** Function to release all microphone and audio context resources. */
  releaseAllMicrophoneResources: () => Promise<void>;
}


// Constants for the AnalyserNode used for basic activity/silence detection.
// These are not for detailed visualization, which would use its own analyser config.
const ACTIVITY_ANALYSER_FFT_SIZE = 256; // Smaller FFT for quick activity checks
const ACTIVITY_ANALYSER_SMOOTHING = 0.7; // Moderate smoothing

/**
 * Composable hook for managing microphone access, the audio stream,
 * and an associated AudioContext with an AnalyserNode.
 *
 * @param {UseMicrophoneOptions} options - Configuration options for the microphone manager.
 * @returns {UseMicrophoneReturn} The microphone manager API.
 */
export function useMicrophone(options: UseMicrophoneOptions): UseMicrophoneReturn {
  const { settings, toast, onPermissionUpdateGlobally } = options;

  const _activeStream = shallowRef<MediaStream | null>(null);
  const _audioContext = shallowRef<AudioContext | null>(null);
  const _analyser = shallowRef<AnalyserNode | null>(null);
  const _microphoneSourceNode = shallowRef<MediaStreamAudioSourceNode | null>(null);

  const _permissionStatus = ref<'prompt' | 'granted' | 'denied' | 'error' | ''>('');
  const _permissionMessage = ref<string>('');
  const _micAccessInitiallyChecked = ref<boolean>(false);

  const selectedAudioDeviceId = computed<string | null>(() => settings.value.selectedAudioInputDeviceId);

  /**
   * Closes all existing audio resources including MediaStream tracks,
   * AudioContext, and disconnects audio nodes.
   * @private
   * @async
   * @returns {Promise<void>}
   */
  const _closeExistingAudioResources = async (): Promise<void> => {
    console.log('[useMicrophone] Closing existing audio resources...');
    if (_activeStream.value) {
      _activeStream.value.getTracks().forEach(track => {
        track.stop();
        console.log(`[useMicrophone] Stopped track: ${track.label} (ID: ${track.id})`);
      });
      _activeStream.value = null;
    }
    if (_microphoneSourceNode.value) {
      try {
        _microphoneSourceNode.value.disconnect();
      } catch (e) {
        console.warn('[useMicrophone] Error disconnecting microphone source node:', e);
      }
      _microphoneSourceNode.value = null;
    }
    if (_analyser.value) {
      try {
        _analyser.value.disconnect();
      } catch (e) {
        console.warn('[useMicrophone] Error disconnecting analyser node:', e);
      }
      _analyser.value = null;
    }
    if (_audioContext.value && _audioContext.value.state !== 'closed') {
      try {
        await _audioContext.value.close();
        console.log('[useMicrophone] AudioContext closed.');
      } catch (e) {
        console.warn('[useMicrophone] Error closing previous AudioContext:', e);
      }
      _audioContext.value = null;
    }
    console.log('[useMicrophone] All audio resources closed.');
  };

  /**
   * Requests microphone permission from the user and, if granted,
   * initializes the MediaStream, AudioContext, and AnalyserNode.
   *
   * @public
   * @param {boolean} [attemptCloseExisting=true] - Whether to close existing audio resources before making a new request.
   * @returns {Promise<MediaStream | null>} The acquired MediaStream if successful, otherwise null.
   */
  const requestMicrophonePermissionsAndGetStream = async (
    attemptCloseExisting: boolean = true
  ): Promise<MediaStream | null> => {
    _permissionMessage.value = 'Requesting microphone access...';
    _permissionStatus.value = 'prompt';
    onPermissionUpdateGlobally('prompt');

    if (attemptCloseExisting) {
      await _closeExistingAudioResources();
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        console.error("[useMicrophone] navigator.mediaDevices.getUserMedia is not available.");
        _permissionMessage.value = 'Media devices API not supported by this browser.';
        _permissionStatus.value = 'error';
        toast?.add({ type: 'error', title: 'Browser Incompatible', message: _permissionMessage.value });
        onPermissionUpdateGlobally('error');
        _micAccessInitiallyChecked.value = true;
        return null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioDeviceId.value
          ? {
              deviceId: { exact: selectedAudioDeviceId.value },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : { // Default device
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
      };
      console.log('[useMicrophone] Requesting user media with constraints:', constraints.audio);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      _activeStream.value = stream;

      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
          throw new Error("AudioContext is not supported in this browser.");
      }
      const newAudioContext = new AudioContextConstructor();
      _audioContext.value = newAudioContext;

      _microphoneSourceNode.value = newAudioContext.createMediaStreamSource(stream);
      
      const newAnalyser = newAudioContext.createAnalyser();
      newAnalyser.fftSize = ACTIVITY_ANALYSER_FFT_SIZE;
      newAnalyser.smoothingTimeConstant = ACTIVITY_ANALYSER_SMOOTHING;
      // Standard decibel range for analysis. Max is 0 dBFS (digital full scale).
      newAnalyser.minDecibels = -100;
      newAnalyser.maxDecibels = 0;
      _analyser.value = newAnalyser;

      _microphoneSourceNode.value.connect(_analyser.value);
      // IMPORTANT: The analyser node is NOT connected to audioContext.destination here,
      // to prevent direct playback of microphone input (feedback loop/echo).
      // STT handlers or visualization will consume data from this analyser or the stream directly.

      _permissionStatus.value = 'granted';
      _permissionMessage.value = 'Microphone access granted and ready.';
      onPermissionUpdateGlobally('granted');
      console.log('[useMicrophone] Microphone access granted. Stream and audio nodes initialized.');
      toast?.add({ type: 'success', title: 'Microphone Ready', message: 'Audio input connected.', duration: 3000 });

      // Clear message after a short delay if permission is granted
      setTimeout(() => { if (_permissionStatus.value === 'granted') _permissionMessage.value = ''; }, 2500);

    } catch (err: any) {
      console.error('[useMicrophone] getUserMedia error:', err.name, err.message, err);
      let specificErrorType: 'denied' | 'error' = 'error';
      let userMessage = `Mic error: ${err.name || 'Unknown'}.`;

      switch(err.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          userMessage = 'Microphone access was denied. Please enable it in your browser settings.';
          specificErrorType = 'denied';
          break;
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          userMessage = 'No microphone found. Please connect an audio input device.';
          break;
        case 'NotReadableError':
        case 'TrackStartError':
          userMessage = 'Microphone is busy or cannot be read. Another app might be using it, or check hardware.';
          break;
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
          userMessage = `Selected microphone doesn't support requested settings. Try default device.`;
          // This might happen if a specific deviceId can't be used with default constraints.
          break;
        case 'TypeError': // e.g. if constraints are malformed, less likely with current setup
            userMessage = 'Error with microphone configuration. Please report this issue.';
            break;
        default:
            userMessage = `An unexpected microphone error occurred: ${err.name || 'Unknown error'}.`;
      }
      _permissionMessage.value = userMessage;
      _permissionStatus.value = specificErrorType;
      toast?.add({ type: 'error', title: 'Microphone Access Failed', message: userMessage, duration: 7000 });
      onPermissionUpdateGlobally(specificErrorType);
      
      // Ensure resources are cleaned up on error
      await _closeExistingAudioResources();
      return null; // Explicitly return null on failure
    } finally {
        _micAccessInitiallyChecked.value = true;
    }
    return _activeStream.value;
  };

  /**
   * Ensures that microphone access is granted and the stream is active.
   * If the selected device has changed or the stream is inactive, it will attempt
   * to re-acquire the stream. Callers should ensure any processes using the
   * old stream (like STT handlers) are stopped before calling this.
   *
   * @public
   * @returns {Promise<boolean>} True if access is granted and stream is active, false otherwise.
   */
  const ensureMicrophoneAccessAndStream = async (): Promise<boolean> => {
    if (_permissionStatus.value === 'granted' && _activeStream.value?.active) {
      const currentTrackSettings = _activeStream.value.getAudioTracks()[0]?.getSettings();
      const currentDeviceId = currentTrackSettings?.deviceId;
      const targetDeviceId = selectedAudioDeviceId.value;

      // Check if the currently active track matches the selected device ID.
      // If targetDeviceId is null/empty, it means default device is selected.
      // If currentDeviceId is null/empty, it's likely the default device.
      const deviceMatches = targetDeviceId 
                            ? currentDeviceId === targetDeviceId
                            : !currentDeviceId; // If target is default, current should also be (or be unset)

      if (deviceMatches) {
        console.log('[useMicrophone] Access and stream already active and correct device selected.');
        return true; // Already good
      }
      console.log(`[useMicrophone] Device mismatch or stream state issue. Current: ${currentDeviceId}, Target: ${targetDeviceId}. Re-acquiring stream.`);
      // Fall through to re-acquire
    } else if (_permissionStatus.value === 'denied' || _permissionStatus.value === 'error') {
        console.warn(`[useMicrophone] Cannot ensure stream, permission is ${_permissionStatus.value}`);
        return false;
    }
    // If not granted or stream inactive/mismatched, attempt to request/re-acquire.
    // requestMicrophonePermissionsAndGetStream internally calls _closeExistingAudioResources.
    const stream = await requestMicrophonePermissionsAndGetStream(true);
    return !!(stream && stream.active);
  };

  /**
   * Releases all microphone and audio context resources.
   * Call this when microphone input is no longer needed (e.g., component unmount).
   * @public
   * @async
   * @returns {Promise<void>}
   */
  const releaseAllMicrophoneResources = async (): Promise<void> => {
    await _closeExistingAudioResources();
    // Note: permissionStatus is not reset here as it reflects the browser/OS level permission.
    // _micAccessInitiallyChecked could be reset if the component is truly "resetting" its entire lifecycle.
    // For now, let it persist for the session.
    console.log('[useMicrophone] All microphone resources released on demand.');
  };

  return {
    activeStream: readonly(_activeStream),
    audioContext: readonly(_audioContext),
    analyser: readonly(_analyser),
    permissionStatus: readonly(_permissionStatus),
    permissionMessage: readonly(_permissionMessage),
    micAccessInitiallyChecked: readonly(_micAccessInitiallyChecked),
    requestMicrophonePermissionsAndGetStream,
    ensureMicrophoneAccessAndStream,
    releaseAllMicrophoneResources,
  };
}