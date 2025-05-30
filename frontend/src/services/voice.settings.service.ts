// File: frontend/src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application operational settings.
 * This includes STT, TTS, audio input modes, VAD parameters, chat behavior preferences,
 * agent interaction toggles (like diagram generation), memory strategy, API cost limits,
 * and settings for UI elements like the Ephemeral Chat Log.
 * Persists settings to localStorage and provides reactive access.
 *
 * @role Central service for managing and persisting user-configurable voice and application settings.
 * @dependencies `vue` (for reactive, watch, computed, ref), `@vueuse/core` (for useStorage),
 * `./tts.service` (for browser TTS functionalities), `../utils/api` (for backend TTS API calls).
 * @exports voiceSettingsManager - Singleton instance of the VoiceSettingsManager class.
 * @exports VoiceOption - Interface for TTS voice options.
 * @exports AudioInputMode - Type for audio input modes.
 * @exports TutorLevel - Type for tutor difficulty levels.
 * @exports VoiceApplicationSettings - Interface for all application settings.
 * @exports STTPreference - Type for Speech-to-Text provider preference.
 * @exports TTSProvider - Type for Text-to-Speech provider preference.
 * @version 1.4.3 - Added vadThresholdWhisper.
 * @author Voice Coding Assistant Team
 */

import { reactive, watch, computed, ref, type ComputedRef, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService, type SpeakOptions as BrowserSpeakOptions } from './tts.service';
import { ttsAPI, type TTSVoiceFE, type TTSRequestPayloadFE } from '../utils/api';
import type { AgentId } from './agent.service';

/**
 * @interface VoiceOption
 * @description Represents a TTS voice option available to the user.
 */
export interface VoiceOption {
  /** @property {string} id - Globally unique ID, typically `provider_providerVoiceId`. */
  id: string;
  /** @property {string} name - User-friendly name of the voice. */
  name: string;
  /** @property {string} lang - BCP 47 language code for the voice. */
  lang: string;
  /** @property {'browser' | 'openai'} provider - The TTS provider for this voice. */
  provider: 'browser' | 'openai';
  /** @property {string} providerVoiceId - The original ID or URI used by the specific provider. */
  providerVoiceId: string;
  /** @property {boolean} [isDefault] - Optional. True if this is a default voice. */
  isDefault?: boolean;
  /** @property {string} [gender] - Optional. Gender of the voice. */
  gender?: string;
  /** @property {string} [description] - Optional. A short description of the voice. */
  description?: string;
}

/** @type AudioInputMode - Defines possible modes for audio input. */
export type AudioInputMode = 'push-to-talk' | 'continuous' | 'voice-activation';
/** @type TutorLevel - Defines possible difficulty levels for the Tutor Agent. */
export type TutorLevel = 'beginner' | 'intermediate' | 'expert';
/** @type STTPreference - Defines possible Speech-to-Text provider preferences. */
export type STTPreference = 'browser_webspeech_api' | 'whisper_api';
/** @type TTSProvider - Defines possible Text-to-Speech provider preferences. */
export type TTSProvider = 'browser_tts' | 'openai_tts';

/**
 * @interface VoiceApplicationSettings
 * @description Defines the complete structure for all user-configurable application settings.
 */
export interface VoiceApplicationSettings {
  // Agent & Interaction Settings
  currentAppMode: AgentId;
  preferredCodingLanguage: string;
  defaultMode: AgentId;
  defaultLanguage: string;
  generateDiagrams: boolean;

  // Chat Behavior & Memory
  autoClearChat: boolean;
  useAdvancedMemory: boolean;

  // Ephemeral Chat Log specific settings
  /** @property {number} ephemeralLogMaxCompact - Max messages in compact EphemeralChatLog. */
  ephemeralLogMaxCompact: number;
  /** @property {number} ephemeralLogMaxExpanded - Max messages in expanded EphemeralChatLog. */
  ephemeralLogMaxExpanded: number;

  // STT (Speech-to-Text) Settings
  sttPreference: STTPreference;
  selectedAudioInputDeviceId: string | null;
  speechLanguage: string;
  sttOptions?: { // Options for STT, e.g., Whisper prompt
    prompt?: string;
    temperature?: number;
  };

  // Audio Input & VAD Settings
  audioInputMode: AudioInputMode;
  vadThreshold: number; // For BrowserSpeechHandler VAD (if it uses it)
  vadSilenceTimeoutMs: number; // General silence timeout for VAD command phase
  continuousModePauseTimeoutMs: number; // For BrowserSpeechHandler continuous mode
  continuousModeAutoSend: boolean;
  vadCommandRecognizedPauseMs: number;

  /**
   * @property {number} [vadThresholdWhisper] - Energy threshold for Whisper VAD in continuous mode.
   * Represents average absolute deviation from silent midpoint (128 for 8-bit PCM).
   * Lower values are more sensitive to speech. Recommended range: 2-10. Default: 4.
   */
  vadThresholdWhisper?: number;

  /**
   * @property {number} vadSensitivityDb - Sensitivity threshold in dB for VAD.
   */
  vadSensitivityDb: number;

  /**
   * @property {number} continuousModeSilenceSendDelayMs - Delay in ms before sending silence in continuous mode.
   */
  continuousModeSilenceSendDelayMs: number;

  /**
   * @property {number} minWhisperSegmentDurationS - Minimum segment duration in seconds for Whisper.
   */
  minWhisperSegmentDurationS: number;

  /**
   * @property {number} maxSegmentDurationS - Maximum segment duration in seconds for continuous segments.
   */
  maxSegmentDurationS: number;

  // TTS (Text-to-Speech) Settings
  ttsProvider: TTSProvider;
  selectedTtsVoiceId: string | null;
  ttsVolume: number;
  ttsRate: number;
  ttsPitch: number;
  autoPlayTts: boolean;

  // Application Operational Settings
  costLimit: number;

  defaultTutorLevel?: TutorLevel;
}

/**
 * @const {Readonly<VoiceApplicationSettings>} initialDefaultSettings - Default values for all application settings.
 */
const initialDefaultSettings: Readonly<VoiceApplicationSettings> = {
  currentAppMode: 'general_chat' as AgentId,
  preferredCodingLanguage: 'python',
  defaultMode: 'general_chat' as AgentId,
  defaultLanguage: 'python',
  autoClearChat: false,
  generateDiagrams: true,
  useAdvancedMemory: true,
  ephemeralLogMaxCompact: 2,
  ephemeralLogMaxExpanded: 15,
  sttPreference: 'browser_webspeech_api',
  selectedAudioInputDeviceId: null,
  speechLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  sttOptions: {
    prompt: '',
    // temperature: 0.0 // Default temperature if/when used
  },
  audioInputMode: 'voice-activation',
  vadThreshold: 0.15,
  vadSilenceTimeoutMs: 2500,
  continuousModePauseTimeoutMs: 3000,
  continuousModeAutoSend: true,
  vadCommandRecognizedPauseMs: 2000,
  vadThresholdWhisper: 4, // Default VAD threshold for Whisper continuous mode
  // Add defaults for new settings:
  vadSensitivityDb: -45,
  continuousModeSilenceSendDelayMs: 1000,
  minWhisperSegmentDurationS: 0.75,
  maxSegmentDurationS: 30, // Default max duration for, e.g., continuous segments

  ttsProvider: 'browser_tts',
  selectedTtsVoiceId: null,
  ttsVolume: 0.9,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  autoPlayTts: true,
  costLimit: 10.00,
  defaultTutorLevel: 'intermediate',
};

/** @interface CollectedVoiceTemp - Temporary interface for collecting voice data. @private */
interface CollectedVoiceTemp {
  rawProviderId: string; name: string; lang: string; provider: 'browser' | 'openai';
  isDefault?: boolean; gender?: string; description?: string;
}

/**
 * @class VoiceSettingsManager
 * @description Manages voice and application settings.
 */
class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaUserAppSettings_v1.4.3'; // Version bump for new settings
  public readonly defaultSettings: Readonly<VoiceApplicationSettings> = initialDefaultSettings;
  public settings: VoiceApplicationSettings;
  public availableTtsVoices: Ref<VoiceOption[]> = ref([]);
  public ttsVoicesLoaded: Ref<boolean> = ref(false);
  public audioInputDevices: Ref<MediaDeviceInfo[]> = ref([]);
  public audioInputDevicesLoaded: Ref<boolean> = ref(false);
  private isInitialized: boolean = false;
  private activePreviewAudio: HTMLAudioElement | null = null;

  constructor() {
    const storedSettings = useStorage(
      VoiceSettingsManager.STORAGE_KEY_SETTINGS,
      { ...this.defaultSettings }, // Start with defaults
      localStorage,
      { mergeDefaults: true } // Deep merge stored settings with defaults
    );
    this.settings = reactive(storedSettings.value) as VoiceApplicationSettings;
    this.applyMissingDefaults(); // Ensure all keys from defaultSettings are present

    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (!this.isInitialized || newProvider === oldProvider) return;
      await this.loadAllTtsVoices();
    });

    watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (!this.isInitialized || newLang === oldLang) return;
      // When speech language changes, re-evaluate the default TTS voice
      await this.ensureDefaultTtsVoiceSelected();
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.applyMissingDefaults(); // Ensure all settings are initialized
    await this.loadAllTtsVoices();
    await this.loadAudioInputDevices();
    this.isInitialized = true;
  }

  private applyMissingDefaults(): void {
    let changed = false;
    for (const key in this.defaultSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (this.settings[K] === undefined) {
        (this.settings as any)[K] = this.defaultSettings[K];
        changed = true;
      }
      // Ensure nested objects like sttOptions and their properties are defaulted
      if (K === 'sttOptions' && this.defaultSettings.sttOptions) {
        if (!this.settings.sttOptions) {
          this.settings.sttOptions = { ...this.defaultSettings.sttOptions };
          changed = true;
        } else {
          if (this.settings.sttOptions.prompt === undefined) {
            this.settings.sttOptions.prompt = this.defaultSettings.sttOptions.prompt;
            changed = true;
          }
          if (this.settings.sttOptions.temperature === undefined) {
            this.settings.sttOptions.temperature = this.defaultSettings.sttOptions.temperature;
            changed = true;
          }
        }
      }
      // Ensure new settings have defaults applied if missing from localStorage
      if (K === 'vadThresholdWhisper' && this.settings.vadThresholdWhisper === undefined) {
        this.settings.vadThresholdWhisper = this.defaultSettings.vadThresholdWhisper;
        changed = true;
      }
       if (K === 'vadCommandRecognizedPauseMs' && this.settings.vadCommandRecognizedPauseMs === undefined) {
        this.settings.vadCommandRecognizedPauseMs = this.defaultSettings.vadCommandRecognizedPauseMs;
        changed = true;
      }
    }
    // if (changed) { console.log("[VoiceSettingsManager] Applied default values for new/missing settings."); }
  }

  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: CollectedVoiceTemp[] = [];

    // Load Browser Native Voices
    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices(); // This now returns SpeechSynthesisVoice[]
        browserVoicesRaw.forEach((v: SpeechSynthesisVoice) => {
          collectedVoices.push({
            rawProviderId: v.voiceURI, // voiceURI is the standard unique ID for browser voices
            name: v.name,
            lang: v.lang,
            provider: 'browser',
            isDefault: v.default,
            // Gender is not standard in SpeechSynthesisVoice, can be inferred from name if needed or omitted
          });
        });
      } catch (error) {
        console.error("[VoiceSettingsManager] Error loading browser TTS voices:", error);
      }
    }

    // Load Backend API Voices (e.g., OpenAI)
    try {
      const response = await ttsAPI.getAvailableVoices(); // Expects AxiosResponse<TTSAvailableVoicesResponseFE>
      if (response.data && Array.isArray(response.data.voices)) {
        const backendApiVoices = response.data.voices as TTSVoiceFE[]; // TTSVoiceFE from api.ts
        backendApiVoices.forEach(v_api => {
          collectedVoices.push({
            rawProviderId: v_api.id, // This is the providerVoiceId for backend (e.g., 'alloy')
            name: v_api.name,
            lang: v_api.lang || 'en', // Default to 'en' if lang not specified by API
            provider: (v_api.provider as 'openai' | 'browser') || 'openai', // Ensure type safety
            isDefault: v_api.isDefault || false,
            gender: v_api.gender,
            description: v_api.description,
          });
        });
      }
    } catch (error) {
      console.error("[VoiceSettingsManager] Error loading backend TTS voices:", error);
    }

    // Deduplicate and format
    const uniqueVoicesMap = new Map<string, VoiceOption>();
    collectedVoices.forEach(cv => {
      // Sanitize browser voice URIs if they contain problematic characters for an ID
      const sanitizedRawId = cv.provider === 'browser'
        ? cv.rawProviderId.replace(/[^a-zA-Z0-9_.:\/-]/g, '_') // Allow common URI chars
        : cv.rawProviderId;

      const uniqueId = `${cv.provider}_${sanitizedRawId}`;

      if (!uniqueVoicesMap.has(uniqueId)) {
        uniqueVoicesMap.set(uniqueId, {
          id: uniqueId, // This is the global unique ID used in settings (selectedTtsVoiceId)
          providerVoiceId: cv.rawProviderId, // This is the ID the actual provider uses
          name: cv.name,
          lang: cv.lang,
          provider: cv.provider,
          isDefault: cv.isDefault,
          gender: cv.gender,
          description: cv.description,
        });
      }
    });

    this.availableTtsVoices.value = Array.from(uniqueVoicesMap.values())
      .sort((a, b) => `${a.provider}-${a.lang}-${a.name}`.localeCompare(`${b.provider}-${b.lang}-${b.name}`));
    this.ttsVoicesLoaded.value = true;
    this.ensureDefaultTtsVoiceSelected();
  }

  private ensureDefaultTtsVoiceSelected(): void {
    const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
    const voicesForProvider = this.availableTtsVoices.value.filter(v => v.provider === currentProviderType);
    const currentSelectionIsValid = this.settings.selectedTtsVoiceId &&
                                    voicesForProvider.some(v => v.id === this.settings.selectedTtsVoiceId);

    if (!currentSelectionIsValid && voicesForProvider.length > 0) {
      const preferredLang = this.settings.speechLanguage || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
      const langShort = preferredLang.split('-')[0].toLowerCase();

      let defaultVoice = voicesForProvider.find(v => v.isDefault && v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.isDefault); // Any default for provider
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort)); // First matching language
      if (!defaultVoice) defaultVoice = voicesForProvider[0]; // Absolute fallback to first available for provider

      this.updateSetting('selectedTtsVoiceId', defaultVoice.id);
    } else if (!currentSelectionIsValid && voicesForProvider.length === 0) {
      // No voices for the selected provider, clear selection
      this.updateSetting('selectedTtsVoiceId', null);
    }
  }

  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator?.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('[VoiceSettingsManager] enumerateDevices API not supported.');
      this.audioInputDevicesLoaded.value = true; return;
    }
    try {
      // Check if we previously loaded devices AND got labels (which implies permission was granted at some point)
      const devicesPreviouslyLoadedWithLabels = this.audioInputDevices.value.length > 0 &&
                                                this.audioInputDevices.value.some(d => d.label && d.label !== '');

      if (forcePermissionRequest || !devicesPreviouslyLoadedWithLabels) {
        // Temporarily request stream to get permission for device labels
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getTracks().forEach(track => track.stop()); // Stop the temporary stream immediately
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;

      // If current selection is no longer valid, reset it
      if (this.settings.selectedAudioInputDeviceId &&
          !this.audioInputDevices.value.some(d => d.deviceId === this.settings.selectedAudioInputDeviceId)) {
        this.updateSetting('selectedAudioInputDeviceId', null); // Reset to default (null means system default)
      }
    } catch (error: any) {
      console.error('[VoiceSettingsManager] Error loading audio input devices:', error.name, error.message);
      // Don't clear devices if it was just a permission prompt issue but list was previously populated
      // this.audioInputDevices.value = []; 
      this.audioInputDevicesLoaded.value = true; // Still mark as loaded to unblock UI
      // User might need to grant permission via interacting with mic button if it failed here.
    }
  }

  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    (this.settings as any)[key] = value;
  }

  public updateSettings(newSettings: Partial<VoiceApplicationSettings>): void {
    let settingsChanged = false;
    let ttsSettingsImpacted = false;
    for (const key in newSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (Object.prototype.hasOwnProperty.call(this.settings, K) && this.settings[K] !== newSettings[K]) {
        (this.settings as any)[K] = newSettings[K];
        settingsChanged = true;
        if (K === 'ttsProvider' || K === 'speechLanguage' || K === 'selectedTtsVoiceId') {
          ttsSettingsImpacted = true;
        }
      }
    }
    if (settingsChanged && ttsSettingsImpacted) {
        this.loadAllTtsVoices(); // This will also call ensureDefaultTtsVoiceSelected
    }
  }

  public resetToDefaults(): void {
    const defaultsToApply = { ...this.defaultSettings };
    // Iterate over defaultSettings to ensure all keys are reset or initialized
    for (const key in defaultsToApply) {
        (this.settings as any)[key] = (defaultsToApply as any)[key];
    }
    this.applyMissingDefaults(); // Crucial to ensure nested objects like sttOptions are correctly reset
    this.loadAllTtsVoices(); // Reload and re-evaluate default voice
    this.loadAudioInputDevices(); // Reload devices and check current selection
  }

  public getCurrentTtsVoice(): VoiceOption | null {
    if (!this.settings.selectedTtsVoiceId) return null;
    return this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId) || null;
  }

  public get ttsVoicesForCurrentProvider(): ComputedRef<VoiceOption[]> {
    return computed(() => {
      if (!this.ttsVoicesLoaded.value) return []; // Ensure voices are loaded
      const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
      return this.availableTtsVoices.value.filter(v => v.provider === currentProviderType);
    });
  }

  public async speakText(text: string): Promise<void> {
    if (!this.isInitialized || !this.settings.autoPlayTts || !text || !text.trim()) return;
    this.cancelSpeech(); // Cancel any ongoing speech

    const currentVoice = this.getCurrentTtsVoice();
    const volume = this.settings.ttsVolume;

    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage, // Use current voice lang, fallback to general speech lang
          voiceURI: currentVoice?.providerVoiceId, // This is the actual URI/ID for the browser's engine
          rate: this.settings.ttsRate,
          pitch: this.settings.ttsPitch,
          volume: volume,
        } as BrowserSpeakOptions);
      } catch (error) {
        console.error("[VoiceSettingsManager] Error speaking with browser TTS:", error);
      }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      try {
        const payload: TTSRequestPayloadFE = {
          text: text,
          voice: currentVoice?.providerVoiceId || 'alloy', // Use the raw providerVoiceId for OpenAI
          speed: this.settings.ttsRate,
          // model: 'tts-1', // Can be specified if needed, backend might default
        };
        const response = await ttsAPI.synthesize(payload); // Expects AxiosResponse<Blob>
        const audioBlob = response.data; // response.data is the Blob
        const audioUrl = URL.createObjectURL(audioBlob);

        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        const currentAudio = this.activePreviewAudio; // Capture instance for closure

        const cleanup = () => {
            if (currentAudio && currentAudio.src === audioUrl) { // Ensure it's the same audio object
                URL.revokeObjectURL(audioUrl);
            }
            if (this.activePreviewAudio === currentAudio) { // Clear global ref only if it's the one that finished/errored
                this.activePreviewAudio = null;
            }
        };
        currentAudio.onended = cleanup;
        currentAudio.onerror = () => {
            console.error("[VoiceSettingsManager] Error playing synthesized OpenAI audio.");
            cleanup();
        };
        await currentAudio.play();

      } catch (error: any) {
        console.error("[VoiceSettingsManager] Error synthesizing or playing OpenAI TTS:", error.response?.data || error.message);
        if (this.activePreviewAudio && this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.activePreviewAudio.src);
        }
        this.activePreviewAudio = null;
      }
    }
  }

  public cancelSpeech(): void {
    if (!this.isInitialized) return;
    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      browserTtsService.cancel();
    }
    if (this.activePreviewAudio) {
      this.activePreviewAudio.pause();
      this.activePreviewAudio.currentTime = 0; // Reset time
      if (this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.activePreviewAudio.src); // Clean up blob URL
      }
      this.activePreviewAudio.removeAttribute('src'); // Remove src to ensure it stops loading
      this.activePreviewAudio.load(); // Abort current playback/loading
      this.activePreviewAudio = null;
    }
  }

  public async previewVoice(voiceId: string, text?: string): Promise<void> {
    if (!this.isInitialized) return;
    const voiceToPreview = this.availableTtsVoices.value.find(v => v.id === voiceId);
    if (!voiceToPreview) {
      console.error(`[VoiceSettingsManager] Voice ID ${voiceId} not found for preview.`);
      return;
    }

    const previewText = text || `This is a preview of the voice ${voiceToPreview.name}.`;
    this.cancelSpeech(); // Cancel any current speech first

    const { ttsVolume: volume, ttsRate: rate, ttsPitch: pitch } = this.settings;

    if (voiceToPreview.provider === 'browser' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(previewText, {
          voiceURI: voiceToPreview.providerVoiceId, // Use the actual providerVoiceId
          lang: voiceToPreview.lang,
          volume, rate, pitch,
        } as BrowserSpeakOptions);
      } catch (error) {
        console.error("[VoiceSettingsManager] Error previewing browser voice:", error);
      }
    } else if (voiceToPreview.provider === 'openai') {
      try {
        const payload: TTSRequestPayloadFE = {
          text: previewText,
          voice: voiceToPreview.providerVoiceId, // Use the raw providerVoiceId
          speed: rate,
        };
        const response = await ttsAPI.synthesize(payload); // Expects AxiosResponse<Blob>
        const audioUrl = URL.createObjectURL(response.data); // response.data is the Blob

        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        const currentPreview = this.activePreviewAudio; // Capture for closure

        const cleanup = () => {
            if (currentPreview && currentPreview.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            if (this.activePreviewAudio === currentPreview) {
                this.activePreviewAudio = null;
            }
        };
        currentPreview.onended = cleanup;
        currentPreview.onerror = () => {
            console.error("[VoiceSettingsManager] Error playing preview OpenAI audio.");
            cleanup();
        };
        await currentPreview.play();
      } catch (error: any) {
        console.error("[VoiceSettingsManager] Error fetching/playing OpenAI voice preview:", error.response?.data || error.message);
        if (this.activePreviewAudio?.src && this.activePreviewAudio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.activePreviewAudio.src);
        }
        this.activePreviewAudio = null;
      }
    }
  }
}

export const voiceSettingsManager = new VoiceSettingsManager();