// File: src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related settings including STT, TTS, audio input modes,
 * and VAD parameters. Persists settings and provides reactive access.
 * @version 1.1.0
 */

import { reactive, watch, onMounted, computed, ref, ComputedRef } from 'vue'; // Added ComputedRef, removed nextTick
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService } from './tts.service'; // Your browser TTS service

/**
 * Represents an available voice option for TTS.
 */
export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  provider: 'browser' | 'openai'; // 'openai' is conceptual for now
  isDefault?: boolean;
}

/**
 * Defines the structure for all voice-related settings.
 */
export interface VoiceApplicationSettings {
  // STT (Speech-to-Text) Settings
  sttPreference: 'browser_webspeech_api' | 'whisper_api';
  selectedAudioInputDeviceId: string | null;

  // Audio Input Mode Settings
  audioInputMode: 'push-to-talk' | 'continuous' | 'voice-activation';
  vadThreshold: number; // Voice Activity Detection sensitivity (e.g., 0.05 to 0.3)
  vadSilenceTimeoutMs: number; // Timeout for VAD stop (e.g., 1000-5000ms)
  continuousModePauseTimeoutMs: number; // Timeout for auto-send in continuous mode (WebSpeech)
  continuousModeAutoSend: boolean; // Auto-send on pause in continuous WebSpeech

  // TTS (Text-to-Speech) Settings
  ttsProvider: 'browser_tts' | 'openai_tts'; // 'openai_tts' is conceptual
  selectedTtsVoiceId: string | null;
  ttsVolume: number;
  ttsRate: number;
  ttsPitch: number;
  autoPlayTts: boolean;
}

const defaultSettings: VoiceApplicationSettings = {
    sttPreference: 'browser_webspeech_api',
    selectedAudioInputDeviceId: null,
    audioInputMode: 'push-to-talk',
    vadThreshold: 0.1,
    vadSilenceTimeoutMs: 2000,
    continuousModePauseTimeoutMs: 3000,
    continuousModeAutoSend: true,
    ttsProvider: 'browser_tts',
    selectedTtsVoiceId: null,
    ttsVolume: 0.5, // Directly use the default value, VoiceSettingsManager.DEFAULT_TTS_VOLUME will be defined later
    ttsRate: 1.0,
    ttsPitch: 1.0,
    autoPlayTts: true,
};

/**
 * @class VoiceSettingsManager
 * @description Centralized management for all voice-related settings.
 */
class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaAllVoiceSettings';
  private static readonly DEFAULT_TTS_VOLUME = 0.5; // Lowered default volume
  private static readonly DEFAULT_STT_PREFERENCE: VoiceApplicationSettings['sttPreference'] = 'browser_webspeech_api';
  private static readonly DEFAULT_AUDIO_INPUT_MODE: VoiceApplicationSettings['audioInputMode'] = 'push-to-talk';

  /**
   * Reactive state for all voice settings. Persisted in local storage.
   * @public
   */
  public settings = reactive<VoiceApplicationSettings>(
    useStorage(
        VoiceSettingsManager.STORAGE_KEY_SETTINGS,
        // Re-create the default settings object here to ensure correct static member access order
        {
            sttPreference: VoiceSettingsManager.DEFAULT_STT_PREFERENCE,
            selectedAudioInputDeviceId: null,
            audioInputMode: VoiceSettingsManager.DEFAULT_AUDIO_INPUT_MODE,
            vadThreshold: 0.1,
            vadSilenceTimeoutMs: 2000,
            continuousModePauseTimeoutMs: 3000,
            continuousModeAutoSend: true,
            ttsProvider: 'browser_tts',
            selectedTtsVoiceId: null,
            ttsVolume: VoiceSettingsManager.DEFAULT_TTS_VOLUME,
            ttsRate: 1.0,
            ttsPitch: 1.0,
            autoPlayTts: true,
        } as VoiceApplicationSettings, // Explicit cast to ensure type safety if inference is tricky
        undefined, // For localStorage, no specific driver needed
        { mergeDefaults: true } // Ensure defaults are merged, especially for new fields
    ).value
  );

  /** List of available TTS voices. */
  public availableTtsVoices = ref<VoiceOption[]>([]);
  /** Indicates if TTS voice loading is complete. */
  public ttsVoicesLoaded = ref<boolean>(false);

  /** List of available audio input devices (microphones). */
  public audioInputDevices = ref<MediaDeviceInfo[]>([]);
  /** Indicates if audio input device list has been populated. */
  public audioInputDevicesLoaded = ref<boolean>(false);

  // Property to access SpeechSynthesis instance for onvoiceschanged
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
    }

    onMounted(async () => {
      await this.loadAllTtsVoices();
      await this.loadAudioInputDevices();
    });

    watch(() => this.settings.ttsVolume, (newVolume) => {
      // Conceptual: browserTtsService.setGlobalVolume(newVolume);
      console.info(`VoiceSettingsManager: TTS Global volume updated to ${newVolume}`);
    }, { immediate: true });

    watch(() => this.settings.selectedAudioInputDeviceId, (newDeviceId) => {
        console.info(`VoiceSettingsManager: Preferred audio input device changed to ${newDeviceId || 'System Default'}`);
    });
  }

  /** Loads available TTS voices. */
  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: VoiceOption[] = [];

    if (browserTtsService.isSupported()) {
      try {
        await new Promise<void>((resolve, reject) => { // Added reject for error handling
            const attemptLoad = async () => {
                try {
                    const voices = await browserTtsService.getVoices(undefined); // Await the promise
                    if (voices.length > 0) {
                        voices.forEach((v: SpeechSynthesisVoice) => { // Explicitly type 'v'
                            collectedVoices.push({
                                id: v.voiceURI, name: v.name, lang: v.lang,
                                provider: 'browser', // Corrected provider value
                                isDefault: v.default,
                            });
                        });
                        resolve();
                    } else if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
                        this.synthesis.onvoiceschanged = async () => { // onvoiceschanged can be async
                            await attemptLoad(); // Retry on event
                            if (this.synthesis) this.synthesis.onvoiceschanged = null; // Clear listener
                        };
                    } else {
                        // Fallback retry if onvoiceschanged is not supported or voices aren't immediately available
                        setTimeout(attemptLoad, 250);
                    }
                } catch (error) {
                    console.error("VoiceSettingsManager: Error fetching browser TTS voices in attemptLoad:", error);
                    // Fallback retry on error, or reject if it's a persistent issue
                    setTimeout(attemptLoad, 250); // Or reject(error) after a few tries
                }
            };
            attemptLoad();
        });

      } catch (error) {
        console.error("VoiceSettingsManager: Error loading browser TTS voices:", error);
      }
    }
    // Placeholder for OpenAI TTS voices loading
    // Example: if (this.settings.ttsProvider === 'openai_tts' || /* always load both? */) { /* load openai voices */ }

    this.availableTtsVoices.value = collectedVoices;
    this.ttsVoicesLoaded.value = true;
    console.log("VoiceSettingsManager: TTS voices loaded.", this.availableTtsVoices.value);
    this.ensureDefaultTtsVoiceSelected();
  }

  /** Ensures a default TTS voice is selected. */
  private ensureDefaultTtsVoiceSelected(): void {
    if (!this.settings.selectedTtsVoiceId || !this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId)) {
      const preferredLang = typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US';
      const currentProviderMatches = (voiceProvider: 'browser' | 'openai') => {
        return (this.settings.ttsProvider === 'browser_tts' && voiceProvider === 'browser') ||
               (this.settings.ttsProvider === 'openai_tts' && voiceProvider === 'openai');
      };

      let defaultVoice = this.availableTtsVoices.value.find(v => v.lang.startsWith(preferredLang.split('-')[0]) && v.isDefault && currentProviderMatches(v.provider));
      if (!defaultVoice) defaultVoice = this.availableTtsVoices.value.find(v => v.lang.startsWith(preferredLang.split('-')[0]) && currentProviderMatches(v.provider));
      if (!defaultVoice) defaultVoice = this.availableTtsVoices.value.find(v => currentProviderMatches(v.provider)); // Match any voice from the current provider
      if (!defaultVoice && this.availableTtsVoices.value.length > 0) {
        // Fallback to any voice if no provider match (should ideally not happen if voices are loaded per provider)
        // Or, more strictly, only pick from the current provider:
        // defaultVoice = this.availableTtsVoices.value.find(v => currentProviderMatches(v.provider));
        // If still no voice, it implies no voices for the current provider.
        // For now, let's keep a broader fallback if the above is too strict.
         defaultVoice = this.availableTtsVoices.value.length > 0 ? this.availableTtsVoices.value[0] : undefined;
      }
      
      this.settings.selectedTtsVoiceId = defaultVoice ? defaultVoice.id : null;
      console.log(`VoiceSettingsManager: Default TTS voice set to ${this.settings.selectedTtsVoiceId || 'None available for current provider'}`);
    }
  }

  /** Loads available audio input devices. */
  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('VoiceSettingsManager: enumerateDevices not supported.');
      this.audioInputDevicesLoaded.value = true;
      return;
    }
    try {
        if (forcePermissionRequest) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        }

      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;
      console.log('VoiceSettingsManager: Audio input devices loaded.', this.audioInputDevices.value);
      if (this.settings.selectedAudioInputDeviceId && !this.audioInputDevices.value.find(d=>d.deviceId === this.settings.selectedAudioInputDeviceId)){
        console.warn(`VoiceSettingsManager: Previously selected audio device ${this.settings.selectedAudioInputDeviceId} not found. Resetting to default.`);
        this.settings.selectedAudioInputDeviceId = null;
      }
    } catch (error) {
      console.error('VoiceSettingsManager: Error loading audio input devices:', error);
      this.audioInputDevicesLoaded.value = true;
    }
  }

  /** Updates a specific voice setting. */
  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    this.settings[key] = value;
    if (key === 'ttsProvider') {
        // Reload or re-filter voices based on the new provider if necessary
        // For now, just ensure a default is selected for the new provider
        this.ensureDefaultTtsVoiceSelected();
    }
  }

  /** Gets the currently selected TTS voice details. */
  public getCurrentTtsVoice(): VoiceOption | null {
    if (!this.settings.selectedTtsVoiceId) return null;
    return this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId) || null;
  }

  /** Returns TTS voices filtered by the current TTS provider. */
  public get ttsVoicesForCurrentProvider(): ComputedRef<VoiceOption[]> {
    return computed(() => this.availableTtsVoices.value.filter(v =>
        (this.settings.ttsProvider === 'browser_tts' && v.provider === 'browser') ||
        (this.settings.ttsProvider === 'openai_tts' && v.provider === 'openai')
    ));
  }

  /** Speaks text using configured TTS settings. */
  public async speakText(text: string): Promise<void> {
    if (!this.settings.autoPlayTts || !text.trim()) return;

    const currentVoice = this.getCurrentTtsVoice();
    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang, voiceURI: currentVoice?.id,
          rate: this.settings.ttsRate, pitch: this.settings.ttsPitch, volume: this.settings.ttsVolume,
        });
      } catch (error) { console.error("VoiceSettingsManager: Error speaking with browser TTS:", error); }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      console.log(`VoiceSettingsManager: Speaking with OpenAI TTS (conceptual) - Voice: ${currentVoice?.name || 'default'}`);
      // TODO: Implement OpenAI TTS call via backend
    }
  }

  /** Cancels any ongoing TTS speech. */
  public cancelSpeech(): void {
    if (this.settings.ttsProvider === 'browser_tts') browserTtsService.cancel();
    // Add cancellation for OpenAI TTS if applicable
  }
}

export const voiceSettingsManager = new VoiceSettingsManager();