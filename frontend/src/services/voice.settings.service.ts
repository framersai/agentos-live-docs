// File: frontend/src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application operational settings.
 * Persists settings to localStorage and provides reactive access.
 * @version 1.5.0 - Improved JSDoc, robust audio/TTS resource handling, clearer API interaction.
 */

import { reactive, watch, computed, ref, type Ref, type ComputedRef, readonly } from 'vue'; // Added readonly
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService, type SpeakOptions as BrowserSpeakOptions } from './tts.service';
import { ttsAPI, type TTSVoiceFE, type TTSRequestPayloadFE } from '../utils/api';
import type { AgentId } from './agent.service';

/**
 * Represents a selectable voice option in the UI, combining browser and API voices.
 */
export interface VoiceOption {
  /** Unique composite ID (e.g., 'browser_voiceURI' or 'openai_voiceModelId'). */
  id: string;
  /** Display name of the voice. */
  name: string;
  /** Language code (BCP 47) of the voice. */
  lang: string;
  /** Provider of the voice ('browser' or 'openai'). */
  provider: 'browser' | 'openai';
  /** The actual ID used by the underlying provider's API (e.g., voiceURI or OpenAI model ID). */
  providerVoiceId: string;
  /** Indicates if this is a default voice for its language/provider. */
  isDefault?: boolean;
  /** Gender of the voice, if specified. */
  gender?: string;
  /** Additional description of the voice, if available. */
  description?: string;
}

/** Defines available audio input modes. */
export type AudioInputMode = 'push-to-talk' | 'continuous' | 'voice-activation';
/** Defines available tutor difficulty levels. */
export type TutorLevel = 'beginner' | 'intermediate' | 'expert';
/** Defines available Speech-to-Text (STT) engine preferences. */
export type STTPreference = 'browser_webspeech_api' | 'whisper_api';
/** Defines available Text-to-Speech (TTS) provider preferences. */
export type TTSProvider = 'browser_tts' | 'openai_tts';

/**
 * Defines the structure for all application voice and operational settings.
 */
export interface VoiceApplicationSettings {
  // Agent & Interaction Settings
  /** ID of the currently active application mode/agent. */
  currentAppMode: AgentId;
  /** For VAD mode with browser STT, array of wake words. */
  vadWakeWordsBrowserSTT?: readonly string[]; // `readonly string[]` is correct.

  vadCommandTimeoutMs: number; // 

  showLiveTranscription?: boolean; // Optional, if live transcription is supported
  alwaysShowVoiceVisualization?: boolean; // Optional, if voice visualization is always shown
  /** Preferred default language for coding-related agents. */
  preferredCodingLanguage: string;
  /** ID of the default agent to load on startup. */
  defaultMode: AgentId; // Consider if this is distinct from currentAppMode's initial value
  /** Default language for general interactions or specific agents. */
  defaultLanguage: string; // General default language
  /** Whether diagram generation features are enabled. */
  generateDiagrams: boolean;

  // Chat Behavior & Memory
  /** If true, chat history clears when switching agents/modes. */
  autoClearChat: boolean;
  /** If true, enables advanced RAG/memory features for conversation context. */
  useAdvancedMemory: boolean;

  // Ephemeral Chat Log specific settings
  /** Maximum number of messages to display in the compact ephemeral log. */
  ephemeralLogMaxCompact: number;
  /** Maximum number of messages to display in the expanded ephemeral log. */
  ephemeralLogMaxExpanded: number;

  // STT (Speech-to-Text) Settings
  /** Preferred STT engine. */
  sttPreference: STTPreference;
  /** ID of the selected audio input device (microphone). Null for default. */
  selectedAudioInputDeviceId: string | null;
  /** BCP 47 language tag for STT (e.g., 'en-US'). */
  speechLanguage: string;
  /** Provider-specific options for STT (e.g., Whisper prompt/temperature). */
  sttOptions?: {
    prompt?: string;
    temperature?: number;
  };

  // Audio Input & VAD Settings
  /** Current audio input mode (PTT, Continuous, VAD). */
  audioInputMode: AudioInputMode;
  /** Threshold for BrowserSpeechHandler's visual VAD (not silence detection). */
  vadThreshold: number; // Ensure this is clearly distinct from vadSensitivityDb
  /** Timeout in ms for VAD command phase completion (silence after wake word). */
  vadSilenceTimeoutMs: number;
  /** Timeout in ms for Browser STT continuous mode to send transcript after pause. */
  continuousModePauseTimeoutMs: number;
  /** If true, Browser STT continuous mode automatically sends transcript on pause. */
  continuousModeAutoSend: boolean;
  /** Pause in ms Browser STT waits after VAD command is recognized for more speech. */
  vadCommandRecognizedPauseMs: number;
  /** Sensitivity in dBFS for AnalyserNode-based silence detection (lower is more sensitive). */
  vadSensitivityDb?: number;
  /** UI Countdown in ms for "Sending in..." in continuous mode. */
  continuousModeSilenceSendDelayMs?: number;
  /** Minimum segment duration in seconds for Whisper STT to process. */
  minWhisperSegmentDurationS?: number;
  /** Maximum recording segment duration in seconds for STT. */
  maxSegmentDurationS?: number;

  // TTS (Text-to-Speech) Settings
  /** Preferred TTS provider. */
  ttsProvider: TTSProvider;
  /** Composite ID of the selected TTS voice (e.g., 'browser_voiceURI' or 'openai_alloy'). */
  selectedTtsVoiceId: string | null;
  /** TTS playback volume (0.0 to 1.0). */
  ttsVolume: number;
  /** TTS speech rate (0.1 to 10, 1 is default). */
  ttsRate: number;
  /** TTS speech pitch (0.0 to 2.0, 1 is default). */
  ttsPitch: number;
  /** If true, automatically plays TTS responses. */
  autoPlayTts: boolean;

  // Application Operational Settings
  /** Cost limit threshold in USD (e.g., for API usage). */
  costLimit: number;
  /** Default difficulty level for tutor agents. */
  defaultTutorLevel?: TutorLevel;
}

const initialDefaultSettings: Readonly<VoiceApplicationSettings> = { // Mark as Readonly
  currentAppMode: 'v_agent' as AgentId, // Default to the main 'V' agent
  preferredCodingLanguage: 'python',
  vadCommandTimeoutMs: 4000, // Default VAD command timeout
  showLiveTranscription: true, // Default to showing live transcription
  alwaysShowVoiceVisualization: true, // Default to always showing voice visualization
  defaultMode: 'v_agent' as AgentId,
  defaultLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  autoClearChat: false,
  generateDiagrams: true,
  useAdvancedMemory: true,
  ephemeralLogMaxCompact: 3, // Slightly more compact messages by default
  ephemeralLogMaxExpanded: 20,
  sttPreference: 'browser_webspeech_api',
  selectedAudioInputDeviceId: null,
  speechLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  sttOptions: {
    prompt: '', // Default empty prompt for Whisper
    // temperature: 0.0 // Let API decide default temperature
  },
  audioInputMode: 'voice-activation',
  vadThreshold: 0.15, // Keep as is, visual/general VAD trigger
  vadSilenceTimeoutMs: 3000, // Slightly longer for VAD command
  continuousModePauseTimeoutMs: 2500, // Shorter for quicker auto-send
  continuousModeAutoSend: true,
  vadCommandRecognizedPauseMs: 1500, // Shorter pause after command recognition
  vadWakeWordsBrowserSTT: Object.freeze(['v', 'vee', 'victoria', 'hey v']), // Object.freeze for true readonly
  vadSensitivityDb: -50, // More sensitive by default
  continuousModeSilenceSendDelayMs: 1000, // Shorter UI delay
  minWhisperSegmentDurationS: 0.5, // Shorter min segment for Whisper
  maxSegmentDurationS: 28, // Slightly less than 30s common limit
  ttsProvider: 'browser_tts',
  selectedTtsVoiceId: null,
  ttsVolume: 0.9,
  ttsRate: 1.05, // Slightly faster default rate
  ttsPitch: 1.0,
  autoPlayTts: true,
  costLimit: 20.00, // Increased default cost limit
  defaultTutorLevel: 'intermediate',
};

/**
 * Temporary interface for collecting voices before final processing into VoiceOption.
 * @internal
 */
interface CollectedVoiceTemp {
  rawProviderId: string; // Original ID from the provider
  name: string;
  lang: string;
  provider: 'browser' | 'openai';
  isDefault?: boolean;
  gender?: string;
  description?: string;
}

/**
 * Manages voice application settings, including persistence and reactive updates.
 */
class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaUserAppSettings_v1.5.0'; // Version bump
  /** Default settings, used as a fallback and for resetting. */
  public readonly defaultSettings: Readonly<VoiceApplicationSettings>;
  /** Reactive application settings object. Persisted to localStorage. */
  public readonly settings: VoiceApplicationSettings; // Made readonly at top level, mutations via methods.
  
  /** Reactive list of available TTS voices from all configured providers. */
  public readonly availableTtsVoices: Ref<Readonly<VoiceOption[]>>; // Expose as Readonly<Ref<Readonly<...>>>
  /** Reactive flag indicating if TTS voices have been loaded. */
  public readonly ttsVoicesLoaded: Ref<boolean>;
  /** Reactive list of available audio input devices (microphones). */
  public readonly audioInputDevices: Ref<Readonly<MediaDeviceInfo[]>>;
  /** Reactive flag indicating if audio input devices have been loaded. */
  public readonly audioInputDevicesLoaded: Ref<boolean>;
  
  private _isInitialized: Ref<boolean> = ref(false); // Internal initialization state
  private activePreviewAudio: HTMLAudioElement | null = null; // For playing OpenAI TTS previews

  constructor() {
    this.defaultSettings = initialDefaultSettings; // Already marked Readonly
    
    // useStorage returns a Ref, which is already reactive.
    const storedSettingsRef = useStorage(
      VoiceSettingsManager.STORAGE_KEY_SETTINGS,
      { ...this.defaultSettings }, // Create a new object to avoid modifying original defaultSettings
      localStorage,
      { mergeDefaults: (storageValue, defaults) => this._mergeDefaults(storageValue, defaults) }
    );
    // We want `this.settings` to be the reactive object that `useStorage` manages.
    this.settings = reactive(storedSettingsRef.value) as VoiceApplicationSettings; // Keep reactive wrapper for internal mutations via methods

    this.availableTtsVoices = ref(Object.freeze([])); // Initialize with frozen empty array
    this.ttsVoicesLoaded = ref(false);
    this.audioInputDevices = ref(Object.freeze([]));
    this.audioInputDevicesLoaded = ref(false);

    // Ensure any newly added default keys are applied to the loaded settings
    // This is now handled by the custom mergeDefaults in useStorage
    // this._applyMissingDefaults(); // Still good for an explicit pass if mergeDefaults is complex

    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (!this._isInitialized.value || newProvider === oldProvider) return;
      console.log(`[VSM] TTS Provider changed: ${oldProvider} -> ${newProvider}. Reloading voices.`);
      await this.loadAllTtsVoices();
    });

    watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (!this._isInitialized.value || newLang === oldLang) return;
      console.log(`[VSM] Speech Language changed: ${oldLang} -> ${newLang}. Ensuring default TTS voice.`);
      await this._ensureDefaultTtsVoiceSelected();
    });
  }

  /**
   * Custom merge function for useStorage to handle nested objects and new default keys.
   * @param storageValue Value from localStorage.
   * @param defaults The default settings object.
   * @returns Merged settings object.
   * @private
   */
  private _mergeDefaults(storageValue: any, defaults: VoiceApplicationSettings): VoiceApplicationSettings {
    const merged = { ...defaults, ...storageValue };
    // Deep merge for sttOptions specifically
    if (storageValue.sttOptions || defaults.sttOptions) {
        merged.sttOptions = {
            ...(defaults.sttOptions || {}),
            ...(storageValue.sttOptions || {}),
        };
    }
    // Ensure all default keys are present
    for (const key of Object.keys(defaults) as Array<keyof VoiceApplicationSettings>) {
        if (merged[key] === undefined && defaults[key] !== undefined) {
            merged[key] = defaults[key];
        }
    }
    return merged;
  }


  /**
   * Initializes the VoiceSettingsManager by loading voices and devices.
   * Should be called once when the application starts.
   * @public
   * @returns {Promise<void>}
   */
  public async initialize(): Promise<void> {
    if (this._isInitialized.value) return;
    console.log('[VSM] Initializing...');
    // _applyMissingDefaults is effectively done by useStorage's mergeDefaults now.
    await this.loadAllTtsVoices();
    await this.loadAudioInputDevices();
    this._isInitialized.value = true;
    console.log('[VSM] Initialized with settings:', JSON.parse(JSON.stringify(this.settings)));
  }

  /** Readonly access to initialization state. */
  public get isInitialized(): Readonly<Ref<boolean>> {
      return readonly(this._isInitialized);
  }


  /**
   * Loads all available TTS voices from browser and backend API.
   * Updates `availableTtsVoices` and `ttsVoicesLoaded` reactive properties.
   * @public
   * @returns {Promise<void>}
   */
  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: CollectedVoiceTemp[] = [];

    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices();
        browserVoicesRaw.forEach((v: SpeechSynthesisVoice) => {
          collectedVoices.push({
            rawProviderId: v.voiceURI, name: v.name, lang: v.lang,
            provider: 'browser', isDefault: v.default,
          });
        });
      } catch (error) {
        console.error("[VSM] Error loading browser TTS voices:", error);
      }
    }

    try {
      const response = await ttsAPI.getAvailableVoices();
      if (response.data?.voices) { // Check if response.data and response.data.voices exist
        const backendApiVoices = response.data.voices as TTSVoiceFE[];
        backendApiVoices.forEach(v_api => {
          collectedVoices.push({
            rawProviderId: v_api.id, name: v_api.name, lang: v_api.lang || 'en',
            provider: (v_api.provider as 'openai' | 'browser') || 'openai', // Ensure type
            isDefault: v_api.isDefault || false,
            gender: v_api.gender, description: v_api.description,
          });
        });
      } else {
        console.warn("[VSM] No voices found in backend TTS API response or response format unexpected.");
      }
    } catch (error) {
      console.error("[VSM] Error loading backend TTS voices:", error);
    }

    const uniqueVoicesMap = new Map<string, VoiceOption>();
    collectedVoices.forEach(cv => {
      const sanitizedRawId = cv.provider === 'browser'
        ? cv.rawProviderId.replace(/[^a-zA-Z0-9_.:=/-]/g, '_') // Allow more chars for URI
        : cv.rawProviderId;
      const uniqueId = `${cv.provider}_${sanitizedRawId}`;

      if (!uniqueVoicesMap.has(uniqueId)) {
        uniqueVoicesMap.set(uniqueId, Object.freeze({ // Freeze individual voice options
          id: uniqueId, providerVoiceId: cv.rawProviderId,
          name: cv.name, lang: cv.lang, provider: cv.provider,
          isDefault: cv.isDefault, gender: cv.gender, description: cv.description,
        }));
      }
    });
    // Freeze the array itself after sorting
    this.availableTtsVoices.value = Object.freeze(
        Array.from(uniqueVoicesMap.values())
        .sort((a, b) => `${a.provider}-${a.lang}-${a.name}`.localeCompare(`${b.provider}-${b.lang}-${b.name}`))
    );
    this.ttsVoicesLoaded.value = true;
    console.log(`[VSM] Total unique TTS voices loaded: ${this.availableTtsVoices.value.length}`);
    await this._ensureDefaultTtsVoiceSelected(); // Use await as it might be async if getVoices inside is
  }

  /**
   * Ensures a suitable default TTS voice is selected based on current provider and language.
   * @private
   * @returns {Promise<void>}
   */
  private async _ensureDefaultTtsVoiceSelected(): Promise<void> {
    if (!this.ttsVoicesLoaded.value || this.availableTtsVoices.value.length === 0) {
      if (this.settings.selectedTtsVoiceId && !this.availableTtsVoices.value.some(v => v.id === this.settings.selectedTtsVoiceId)) {
        this.updateSetting('selectedTtsVoiceId', null);
      }
      return;
    }
    
    const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
    const voicesForProvider = this.availableTtsVoices.value.filter(v => v.provider === currentProviderType);

    const currentSelectionIsValid = this.settings.selectedTtsVoiceId &&
                                  voicesForProvider.some(v => v.id === this.settings.selectedTtsVoiceId);

    if (!currentSelectionIsValid && voicesForProvider.length > 0) {
      const preferredLang = this.settings.speechLanguage || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
      const langShort = preferredLang.split('-')[0].toLowerCase();

      let defaultVoice = voicesForProvider.find(v => v.isDefault && v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.isDefault);
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice) defaultVoice = voicesForProvider[0];

      this.updateSetting('selectedTtsVoiceId', defaultVoice.id);
      console.log(`[VSM] Default TTS voice auto-selected for provider ${currentProviderType}: ${defaultVoice.name} (ID: ${defaultVoice.id})`);
    } else if (voicesForProvider.length === 0 && this.settings.selectedTtsVoiceId) {
      console.warn(`[VSM] No voices available for current provider ${currentProviderType}. Clearing selected TTS voice.`);
      this.updateSetting('selectedTtsVoiceId', null);
    }
  }

  /**
   * Loads available audio input devices (microphones).
   * Updates `audioInputDevices` and `audioInputDevicesLoaded` reactive properties.
   * @public
   * @param {boolean} [forcePermissionRequest=false] - If true, attempts to get user media to enable detailed labels.
   * @returns {Promise<void>}
   */
  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    // (Implementation largely same, ensure freezing array)
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator?.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('[VSM] enumerateDevices API not supported.');
      this.audioInputDevices.value = Object.freeze([]); this.audioInputDevicesLoaded.value = true; return;
    }
    try {
      const devicesPreviouslyLoadedWithLabels = this.audioInputDevices.value.length > 0 && this.audioInputDevices.value.some(d => d.label && d.label !== '');
      if (forcePermissionRequest || !devicesPreviouslyLoadedWithLabels) {
        if (typeof navigator?.mediaDevices?.getUserMedia === 'function') { // Check if getUserMedia is supported
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            stream.getTracks().forEach(track => track.stop());
        } else {
            console.warn("[VSM] getUserMedia API not supported, cannot force permission for device labels.");
        }
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = Object.freeze(devices.filter(device => device.kind === 'audioinput')); // Freeze
      this.audioInputDevicesLoaded.value = true;
      console.log(`[VSM] Audio input devices loaded: ${this.audioInputDevices.value.length}`);
      if (this.settings.selectedAudioInputDeviceId && !this.audioInputDevices.value.some(d => d.deviceId === this.settings.selectedAudioInputDeviceId)) {
        this.updateSetting('selectedAudioInputDeviceId', null);
        console.log('[VSM] Previously selected audio input device not found, selection reset.');
      }
    } catch (error: any) {
      console.error('[VSM] Error loading audio input devices:', error.name, error.message);
      this.audioInputDevices.value = Object.freeze([]); this.audioInputDevicesLoaded.value = true;
    }
  }

  /**
   * Updates a single setting value.
   * @public
   * @param {K} key - The key of the setting to update.
   * @param {VoiceApplicationSettings[K]} value - The new value for the setting.
   * @template K - A key of VoiceApplicationSettings.
   */
  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    if (this.settings[key] !== value) {
      // Create a new object for the settings to ensure reactivity if `this.settings` was made deeply readonly.
      // However, since `this.settings` is a reactive object from `useStorage`, direct mutation is fine.
      (this.settings as any)[key] = value; // Type assertion to bypass readonly if external type is Readonly
      console.log(`[VSM] Setting updated - ${key}:`, value);
    }
  }

  /**
   * Updates multiple settings at once.
   * @public
   * @param {Partial<VoiceApplicationSettings>} newSettings - An object containing settings to update.
   */
  public updateSettings(newSettings: Partial<VoiceApplicationSettings>): void {
    // (Implementation largely same)
    let settingsChanged = false; let ttsRelatedChanged = false;
    for (const key in newSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (Object.prototype.hasOwnProperty.call(this.settings, K) && this.settings[K] !== newSettings[K]) {
        (this.settings as any)[K] = newSettings[K]; settingsChanged = true;
        if (K === 'ttsProvider' || K === 'speechLanguage' || K === 'selectedTtsVoiceId') ttsRelatedChanged = true;
      } else if (!Object.prototype.hasOwnProperty.call(this.settings, K) && newSettings[K] !== undefined) {
        (this.settings as any)[K] = newSettings[K]; settingsChanged = true;
        if (K === 'ttsProvider' || K === 'speechLanguage' || K === 'selectedTtsVoiceId') ttsRelatedChanged = true;
      }
    }
    if (settingsChanged) {
      console.log("[VSM] Settings updated via updateSettings:", newSettings);
      if (ttsRelatedChanged) this._ensureDefaultTtsVoiceSelected();
    }
  }


  /**
   * Resets all settings to their default values.
   * @public
   */
  public resetToDefaults(): void {
    // (Implementation largely same, ensure it reloads voices/devices)
    console.log("[VSM] Resetting settings to defaults.");
    const defaultsToApply = { ...this.defaultSettings };
    const defaultKeys = Object.keys(defaultsToApply) as Array<keyof VoiceApplicationSettings>;
    for (const key of defaultKeys) { (this.settings as any)[key] = defaultsToApply[key]; }
    // Re-trigger dependent loads
    this.loadAllTtsVoices();
    this.loadAudioInputDevices();
    console.log("[VSM] Settings reset to defaults complete.");
  }

  /**
   * Gets the currently selected TTS voice option object.
   * @public
   * @returns {Readonly<VoiceOption> | null} The current voice option or null if none selected/found.
   */
  public getCurrentTtsVoice(): Readonly<VoiceOption> | null { // Return Readonly
    if (!this.settings.selectedTtsVoiceId) return null;
    return this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId) || null;
  }

  /**
   * Computed property returning available TTS voices filtered by the current TTS provider setting.
   * @public
   * @type {ComputedRef<Readonly<VoiceOption[]>>}
   */
  public get ttsVoicesForCurrentProvider(): ComputedRef<Readonly<VoiceOption[]>> { // Return Readonly
    return computed(() => {
      if (!this.ttsVoicesLoaded.value) return Object.freeze([]); // Freeze
      const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
      return Object.freeze(this.availableTtsVoices.value.filter(v => v.provider === currentProviderType)); // Freeze
    });
  }

  /**
   * Speaks the given text using the currently configured TTS provider and voice.
   * Cancels any ongoing speech before starting.
   * @public
   * @param {string} text - The text to speak.
   * @returns {Promise<void>}
   */
  public async speakText(text: string): Promise<void> {
    // (Implementation largely same, ensure robust error handling and Audio object management)
    if (!this._isInitialized.value || !this.settings.autoPlayTts || !text || !text.trim()) {
        if (!this.settings.autoPlayTts) console.log("[VSM] TTS auto-play disabled. Skipping speech.");
        return;
    }
    this.cancelSpeech(); // Crucial: Cancel any ongoing speech (browser or Audio element)

    const currentVoice = this.getCurrentTtsVoice();
    const volume = Math.max(0, Math.min(1, this.settings.ttsVolume)); // Clamp volume
    const rate = Math.max(0.1, Math.min(10, this.settings.ttsRate)); // Clamp rate
    const pitch = Math.max(0, Math.min(2, this.settings.ttsPitch));   // Clamp pitch

    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        console.log(`[VSM] Speaking with browser TTS: "${text.substring(0,30)}...", Voice: ${currentVoice?.name || 'Default'}`);
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage,
          voiceURI: currentVoice?.providerVoiceId,
          rate, pitch, volume,
        } as BrowserSpeakOptions);
      } catch (error) { console.error("[VSM] Error speaking with browser TTS:", error); }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      if (!currentVoice || currentVoice.provider !== 'openai') {
        console.error("[VSM] OpenAI TTS selected but no valid OpenAI voice configured."); return;
      }
      try {
        console.log(`[VSM] Synthesizing with OpenAI TTS: "${text.substring(0,30)}...", Voice: ${currentVoice.name}`);
        const payload: TTSRequestPayloadFE = {
          text, voice: currentVoice.providerVoiceId, speed: rate,
        };
        const response = await ttsAPI.synthesize(payload);
        const audioBlob = response.data; // Should be Blob
        const audioUrl = URL.createObjectURL(audioBlob);

        this.activePreviewAudio = new Audio(audioUrl); // Reuse for playback
        this.activePreviewAudio.volume = volume;
        const audioToPlay = this.activePreviewAudio; // Capture for closure

        audioToPlay.onended = () => {
          console.log("[VSM] OpenAI TTS playback ended.");
          URL.revokeObjectURL(audioUrl); // Clean up blob URL
          if (this.activePreviewAudio === audioToPlay) this.activePreviewAudio = null;
        };
        audioToPlay.onerror = (e) => {
          console.error("[VSM] Error playing synthesized OpenAI audio.", e);
          URL.revokeObjectURL(audioUrl);
          if (this.activePreviewAudio === audioToPlay) this.activePreviewAudio = null;
        };
        await audioToPlay.play();
        console.log("[VSM] Playing OpenAI TTS.");
      } catch (error: any) {
        console.error("[VSM] Error synthesizing/playing OpenAI TTS:", error.response?.data || error.message);
        if (this.activePreviewAudio?.src?.startsWith('blob:')) URL.revokeObjectURL(this.activePreviewAudio.src);
        this.activePreviewAudio = null;
      }
    } else {
        console.warn(`[VSM] TTS provider "${this.settings.ttsProvider}" not supported or no voice available.`);
    }
  }

  /**
   * Cancels any currently active speech output (browser SpeechSynthesis or HTMLAudioElement).
   * @public
   */
  public cancelSpeech(): void {
    if (!this._isInitialized.value) return;
    // Cancel browser speech synthesis
    if (browserTtsService.isSupported() && browserTtsService.isSpeaking()) {
      browserTtsService.cancel();
      console.log("[VSM] Cancelled browser SpeechSynthesis.");
    }
    // Stop and clean up HTMLAudioElement if playing OpenAI TTS
    if (this.activePreviewAudio) {
      console.log("[VSM] Stopping active preview/OpenAI audio.");
      this.activePreviewAudio.pause();
      this.activePreviewAudio.currentTime = 0;
      if (this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
        const oldSrc = this.activePreviewAudio.src;
        // Defer revoke slightly to allow any final events on the audio element
        setTimeout(() => {
            console.log(`[VSM] Revoking object URL: ${oldSrc}`);
            URL.revokeObjectURL(oldSrc);
        }, 100);
      }
      // Detach event listeners to prevent issues if element is reused or errors occur after this point
      this.activePreviewAudio.onended = null;
      this.activePreviewAudio.onerror = null;
      this.activePreviewAudio.removeAttribute('src'); // Further prevent issues with revoked URL
      try { this.activePreviewAudio.load(); } catch(e) { /* Expected error on load after src removed */ }
      this.activePreviewAudio = null;
    }
  }

  /**
   * Plays a preview of the specified TTS voice.
   * @public
   * @param {string} voiceId - The composite ID of the voice to preview.
   * @param {string} [text] - Optional text for the preview. Defaults to a generic message.
   * @returns {Promise<void>}
   */
  public async previewVoice(voiceId: string, text?: string): Promise<void> {
    // (Implementation largely same, ensure it uses the robust speakText logic or similar for playback)
    if (!this._isInitialized.value) { console.warn("[VSM] Cannot preview voice, service not initialized."); return;}
    const voiceToPreview = this.availableTtsVoices.value.find(v => v.id === voiceId);
    if (!voiceToPreview) { console.error(`[VSM] Voice ID ${voiceId} not found for preview.`); return; }

    const previewText = text || `This is a preview of the voice: ${voiceToPreview.name}. Testing 1, 2, 3.`;
    console.log(`[VSM] Previewing voice: ${voiceToPreview.name} (Provider: ${voiceToPreview.provider})`);
    this.cancelSpeech(); // Cancel any current speech

    const { ttsVolume: volume, ttsRate: rate, ttsPitch: pitch } = this.settings;

    if (voiceToPreview.provider === 'browser' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(previewText, {
          voiceURI: voiceToPreview.providerVoiceId, lang: voiceToPreview.lang,
          volume, rate, pitch,
        } as BrowserSpeakOptions);
      } catch (error) { console.error("[VSM] Error previewing browser voice:", error); }
    } else if (voiceToPreview.provider === 'openai') {
      try {
        const payload: TTSRequestPayloadFE = { text: previewText, voice: voiceToPreview.providerVoiceId, speed: rate };
        const response = await ttsAPI.synthesize(payload);
        const audioUrl = URL.createObjectURL(response.data);
        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        const audioToPlay = this.activePreviewAudio;
        audioToPlay.onended = () => { URL.revokeObjectURL(audioUrl); if (this.activePreviewAudio === audioToPlay) this.activePreviewAudio = null; };
        audioToPlay.onerror = (e) => { console.error("[VSM] Error playing preview OpenAI audio.", e); URL.revokeObjectURL(audioUrl); if (this.activePreviewAudio === audioToPlay) this.activePreviewAudio = null; };
        await audioToPlay.play();
      } catch (error: any) {
        console.error("[VSM] Error fetching/playing OpenAI voice preview:", error.response?.data || error.message);
        if (this.activePreviewAudio?.src?.startsWith('blob:')) URL.revokeObjectURL(this.activePreviewAudio.src);
        this.activePreviewAudio = null;
      }
    } else {
        console.warn(`[VSM] TTS provider for voice ${voiceId} not supported for preview.`);
    }
  }
}

/** Singleton instance of the VoiceSettingsManager. */
export const voiceSettingsManager = new VoiceSettingsManager();