// File: frontend/src/components/voice-input/composables/shared/useAudioFeedback.ts
/**
 * @file useAudioFeedback.ts
 * @description Manages audio feedback (beeps) for voice input interactions.
 * Handles loading, playing, and cleanup of audio resources.
 * 
 * Features:
 * - Lazy loading of audio files
 * - Proper AudioContext management
 * - Volume control
 * - Error handling with fallbacks
 */

import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

// Import audio files
import beepInSmoothUrl from '@/assets/sounds/beep_in_smooth.mp3';
import beepOutSmoothUrl from '@/assets/sounds/beep_out_smooth.mp3';

export interface AudioFeedbackOptions {
  volume?: number;
  enabled?: boolean;
}

export interface AudioFeedbackInstance {
  beepInSound: Ref<AudioBuffer | null>;
  beepOutSound: Ref<AudioBuffer | null>;
  loadSounds: () => Promise<void>;
  playSound: (buffer: AudioBuffer | null, volume?: number) => void;
  setVolume: (volume: number) => void;
  setEnabled: (enabled: boolean) => void;
  cleanup: () => void;
}

/**
 * Creates an audio feedback manager for voice input
 */
export function useAudioFeedback(
  options: AudioFeedbackOptions = {}
): AudioFeedbackInstance {
  const { volume: initialVolume = 0.7, enabled: initialEnabled = true } = options;
  
  // State
  const audioContext = ref<AudioContext | null>(null);
  const beepInSound = ref<AudioBuffer | null>(null);
  const beepOutSound = ref<AudioBuffer | null>(null);
  const currentVolume = ref(initialVolume);
  const isEnabled = ref(initialEnabled);
  const isLoading = ref(false);
  const loadError = ref<string | null>(null);
  
  /**
   * Initialize or get the AudioContext
   */
  const getAudioContext = async (): Promise<AudioContext | null> => {
    if (typeof window === 'undefined' || !window.AudioContext) {
      console.warn('[AudioFeedback] AudioContext not supported');
      return null;
    }
    
    if (!audioContext.value || audioContext.value.state === 'closed') {
      try {
        audioContext.value = new window.AudioContext();
        console.log('[AudioFeedback] Created new AudioContext');
      } catch (e) {
        console.error('[AudioFeedback] Failed to create AudioContext:', e);
        return null;
      }
    }
    
    // Resume if suspended
    if (audioContext.value.state === 'suspended') {
      try {
        await audioContext.value.resume();
        console.log('[AudioFeedback] Resumed suspended AudioContext');
      } catch (e) {
        console.error('[AudioFeedback] Failed to resume AudioContext:', e);
      }
    }
    
    return audioContext.value;
  };
  
  /**
   * Load a single audio file
   */
  const loadSoundFile = async (
    url: string,
    name: string
  ): Promise<AudioBuffer | null> => {
    const ctx = await getAudioContext();
    if (!ctx) return null;
    
    try {
      console.log(`[AudioFeedback] Loading ${name} from ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength < 100) {
        throw new Error(`File too small (${arrayBuffer.byteLength} bytes)`);
      }
      
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      console.log(`[AudioFeedback] Successfully loaded ${name}`);
      
      return audioBuffer;
    } catch (error: any) {
      console.error(`[AudioFeedback] Error loading ${name}:`, error);
      
      // Store error for UI feedback if needed
      if (error.name === 'EncodingError') {
        loadError.value = `Could not decode ${name}. Check file format.`;
      } else {
        loadError.value = `Failed to load ${name}: ${error.message}`;
      }
      
      return null;
    }
  };
  
  /**
   * Load all audio feedback sounds
   */
  const loadSounds = async (): Promise<void> => {
    if (isLoading.value) {
      console.log('[AudioFeedback] Already loading sounds');
      return;
    }
    
    isLoading.value = true;
    loadError.value = null;
    
    try {
      // Load sounds in parallel
      const [beepIn, beepOut] = await Promise.all([
        loadSoundFile(beepInSmoothUrl, 'beep_in_smooth'),
        loadSoundFile(beepOutSmoothUrl, 'beep_out_smooth')
      ]);
      
      beepInSound.value = beepIn;
      beepOutSound.value = beepOut;
      
      if (!beepIn || !beepOut) {
        console.warn('[AudioFeedback] Some sounds failed to load');
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Play an audio buffer
   */
  const playSound = (buffer: AudioBuffer | null, volume?: number): void => {
    // Check if enabled and buffer exists
    if (!isEnabled.value || !buffer || !audioContext.value) {
      return;
    }
    
    // Check AudioContext state
    if (audioContext.value.state === 'closed') {
      console.warn('[AudioFeedback] Cannot play - AudioContext closed');
      return;
    }
    
    if (audioContext.value.state === 'suspended') {
      // Try to resume
      audioContext.value.resume().catch(e => 
        console.error('[AudioFeedback] Error resuming AudioContext:', e)
      );
    }
    
    try {
      const source = audioContext.value.createBufferSource();
      const gainNode = audioContext.value.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.value.destination);
      
      // Set volume
      gainNode.gain.value = volume ?? currentVolume.value;
      
      // Play
      source.start(0);
      
      // Cleanup after playback
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('[AudioFeedback] Error playing sound:', error);
    }
  };
  
  /**
   * Set the volume for all sounds
   */
  const setVolume = (volume: number): void => {
    currentVolume.value = Math.max(0, Math.min(1, volume));
  };
  
  /**
   * Enable or disable audio feedback
   */
  const setEnabled = (enabled: boolean): void => {
    isEnabled.value = enabled;
  };
  
  /**
   * Cleanup audio resources
   */
  const cleanup = (): void => {
    console.log('[AudioFeedback] Cleaning up');
    
    if (audioContext.value && audioContext.value.state !== 'closed') {
      try {
        audioContext.value.close();
        console.log('[AudioFeedback] AudioContext closed');
      } catch (e) {
        console.error('[AudioFeedback] Error closing AudioContext:', e);
      }
    }
    
    audioContext.value = null;
    beepInSound.value = null;
    beepOutSound.value = null;
  };
  
  // Auto cleanup on unmount
  onUnmounted(cleanup);
  
  return {
    beepInSound,
    beepOutSound,
    loadSounds,
    playSound,
    setVolume,
    setEnabled,
    cleanup
  };
}