// File: frontend/src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application settings including STT, TTS,
 * audio input modes, VAD parameters, chat behavior, appearance, and memory management strategy.
 * Persists settings to localStorage and provides reactive access.
 * @version 1.2.4 - Moved initialization logic from onMounted to a public initialize method.
 * @author Voice Coding Assistant Team
 */

import { reactive, watch, computed, ref, type ComputedRef, type Ref } from 'vue'; // Removed onMounted
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService } from './tts.service';
import { ttsAPI, type TTSVoiceFE } from '../utils/api';

// Interfaces (VoiceOption, AudioInputMode, VoiceApplicationSettings) and initialDefaultSettings remain the same

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  provider: 'browser' | 'openai';
  isDefault?: boolean;
}

export type AudioInputMode = 'push-to-talk' | 'continuous' | 'voice-activation';

export interface VoiceApplicationSettings {
  currentAppMode: string;
  preferredCodingLanguage: string;
  defaultMode: string;
  defaultLanguage: string;
  autoClearChat: boolean;
  generateDiagrams: boolean;
  useAdvancedMemory: boolean;
  sttPreference: 'browser_webspeech_api' | 'whisper_api';
  selectedAudioInputDeviceId: string | null;
  speechLanguage: string;
  audioInputMode: AudioInputMode;
  vadThreshold: number;
  vadSilenceTimeoutMs: number;
  continuousModePauseTimeoutMs: number;
  continuousModeAutoSend: boolean;
  ttsProvider: 'browser_tts' | 'openai_tts';
  selectedTtsVoiceId: string | null;
  ttsVolume: number;
  ttsRate: number;
  ttsPitch: number;
  autoPlayTts: boolean;
  costLimit: number;
}

const initialDefaultSettings: Readonly<VoiceApplicationSettings> = {
  currentAppMode: 'general',
  preferredCodingLanguage: 'python',
  defaultMode: 'general',
  defaultLanguage: 'python',
  autoClearChat: false,
  generateDiagrams: false,
  useAdvancedMemory: true,
  sttPreference: 'browser_webspeech_api',
  selectedAudioInputDeviceId: null,
  speechLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  audioInputMode: 'push-to-talk',
  vadThreshold: 0.1,
  vadSilenceTimeoutMs: 2000,
  continuousModePauseTimeoutMs: 3000,
  continuousModeAutoSend: true,
  ttsProvider: 'browser_tts',
  selectedTtsVoiceId: null,
  ttsVolume: 0.8,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  autoPlayTts: true,
  costLimit: 5.00,
};


class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaAllVoiceAndAppSettings_v1.2.3';
  public readonly defaultSettings: Readonly<VoiceApplicationSettings> = initialDefaultSettings;
  public settings: Record<keyof VoiceApplicationSettings, any> & VoiceApplicationSettings;
  public availableTtsVoices: Ref<VoiceOption[]> = ref([]);
  public ttsVoicesLoaded: Ref<boolean> = ref(false);
  public audioInputDevices: Ref<MediaDeviceInfo[]> = ref([]);
  public audioInputDevicesLoaded: Ref<boolean> = ref(false);
  private synthesis: SpeechSynthesis | null = null;
  private isInitialized: boolean = false;

  constructor() {
    const storedSettings = useStorage(
      VoiceSettingsManager.STORAGE_KEY_SETTINGS,
      { ...this.defaultSettings },
      localStorage,
      { mergeDefaults: true }
    );
    this.settings = reactive(storedSettings.value);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
    
    this.applyMissingDefaults();

    // Watchers are set up here, they will become active once `initialize` is called
    // and settings potentially change.
    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (!this.isInitialized || newProvider === oldProvider) return;
      console.log(`VoiceSettingsManager: TTS provider changed to ${newProvider}. Reloading voices.`);
      await this.loadAllTtsVoices();
    });

    watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (!this.isInitialized || newLang === oldLang) return;
      console.log(`VoiceSettingsManager: Speech language changed to ${newLang}. Re-evaluating default TTS voice.`);
      await this.ensureDefaultTtsVoiceSelected();
    });
  }

  /**
   * @public
   * @async
   * @function initialize
   * @description Initializes the service by loading voices and devices. Should be called once, e.g., from App.vue.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("VoiceSettingsManager already initialized.");
      return;
    }
    console.log("VoiceSettingsManager: Initializing...");
    // Ensure critical settings have valid initial values
    if (!this.settings.currentAppMode || typeof this.settings.currentAppMode !== 'string') {
      this.settings.currentAppMode = this.defaultSettings.defaultMode;
    }
    if (!this.settings.preferredCodingLanguage || typeof this.settings.preferredCodingLanguage !== 'string') {
      this.settings.preferredCodingLanguage = this.defaultSettings.defaultLanguage;
    }
    if (!this.settings.audioInputMode) this.settings.audioInputMode = this.defaultSettings.audioInputMode;
    if (!this.settings.ttsProvider) this.settings.ttsProvider = this.defaultSettings.ttsProvider;

    await this.loadAllTtsVoices();
    await this.loadAudioInputDevices();
    this.isInitialized = true;
    console.log("VoiceSettingsManager: Initialization complete.");
  }

  private applyMissingDefaults(): void {
    // ... (remains the same)
    let changed = false;
    for (const key in this.defaultSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (this.settings[K] === undefined) {
        this.settings[K] = this.defaultSettings[K] as any; // Added 'as any' to satisfy TS, knowing K is valid
        changed = true;
      }
    }
    if (changed) {
      console.log("VoiceSettingsManager: Applied default values for missing settings.", JSON.parse(JSON.stringify(this.settings)));
    }
  }

  // All other methods (loadAllTtsVoices, ensureDefaultTtsVoiceSelected, loadAudioInputDevices, updateSetting, etc.)
  // remain the same as in the user-provided file.
  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: VoiceOption[] = [];

    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices();
        browserVoicesRaw.forEach((v: SpeechSynthesisVoice) => {
          collectedVoices.push({
            id: v.voiceURI, name: `${v.name} (Browser)`, lang: v.lang,
            provider: 'browser', isDefault: v.default,
          });
        });
      } catch (error) { console.error("VoiceSettingsManager: Error loading browser TTS voices:", error); }
    }

    try {
      const response = await ttsAPI.getAvailableVoices();
      if (response.data && Array.isArray(response.data.voices)) {
        const backendApiVoices = response.data.voices as TTSVoiceFE[];
        backendApiVoices.forEach(v => {
          collectedVoices.push({
            id: v.id, name: `${v.name} (Cloud - ${v.provider || 'OpenAI'})`, lang: v.lang || 'en',
            provider: 'openai', 
            isDefault: v.isDefault || false,
          });
        });
      }
    } catch (error) { console.error("VoiceSettingsManager: Error loading backend TTS voices:", error); }

    const uniqueVoices = Array.from(new Map(collectedVoices.map(v => [v.id, v])).values());
    this.availableTtsVoices.value = uniqueVoices.sort((a,b) => a.name.localeCompare(b.name));
    this.ttsVoicesLoaded.value = true;
    this.ensureDefaultTtsVoiceSelected();
  }

  private ensureDefaultTtsVoiceSelected(): void {
    const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
    const voicesForProvider = this.availableTtsVoices.value.filter(v => v.provider === currentProviderType);

    if (!this.settings.selectedTtsVoiceId || !voicesForProvider.find(v => v.id === this.settings.selectedTtsVoiceId)) {
      const preferredLang = this.settings.speechLanguage || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
      const langShort = preferredLang.split('-')[0].toLowerCase();

      let defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort) && v.isDefault);
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice && currentProviderType === 'browser') defaultVoice = voicesForProvider.find(v => v.isDefault);
      if (!defaultVoice && voicesForProvider.length > 0) defaultVoice = voicesForProvider[0];

      this.updateSetting('selectedTtsVoiceId', defaultVoice ? defaultVoice.id : null);
      console.log(`VoiceSettingsManager: Default TTS voice for provider '${currentProviderType}' (lang: ${preferredLang}) set to: ${defaultVoice?.name || 'None available'}`);
    }
  }

  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator?.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('VoiceSettingsManager: navigator.mediaDevices.enumerateDevices is not supported in this browser.');
      this.audioInputDevicesLoaded.value = true; return;
    }
    try {
      const devicesWithoutLabels = this.audioInputDevices.value.length > 0 && this.audioInputDevices.value.every(d => !d.label);
      if (forcePermissionRequest || devicesWithoutLabels) {
        console.log('VoiceSettingsManager: Requesting media permissions to enumerate devices with labels...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getTracks().forEach(track => track.stop());
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;

      if (this.settings.selectedAudioInputDeviceId && !this.audioInputDevices.value.find(d => d.deviceId === this.settings.selectedAudioInputDeviceId)) {
        this.updateSetting('selectedAudioInputDeviceId', null);
      }
      console.log(`VoiceSettingsManager: Loaded ${this.audioInputDevices.value.length} audio input devices.`);
    } catch (error: any) {
      console.error('VoiceSettingsManager: Error loading audio input devices:', error.name, error.message);
      this.audioInputDevices.value = [];
      this.audioInputDevicesLoaded.value = true; 
    }
  }

  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    this.settings[key] = value as any; // Added 'as any' for TS

    if (this.isInitialized && (key === 'ttsProvider' || key === 'speechLanguage')) {
      this.ensureDefaultTtsVoiceSelected();
    }
    console.log(`VoiceSettingsManager: Setting '${key}' updated to`, value);
  }

  public resetToDefaults(): void {
    const defaults = { ...this.defaultSettings };
    for (const key in defaults) {
      this.updateSetting(key as keyof VoiceApplicationSettings, defaults[key as keyof VoiceApplicationSettings]);
    }
    if(this.isInitialized) {
      this.loadAllTtsVoices().then(() => {
          this.ensureDefaultTtsVoiceSelected();
      });
    }
    console.log("VoiceSettingsManager: All settings reset to defaults.");
  }

  public getCurrentTtsVoice(): VoiceOption | null {
    if (!this.settings.selectedTtsVoiceId) return null;
    return this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId) || null;
  }

  public get ttsVoicesForCurrentProvider(): ComputedRef<VoiceOption[]> {
    return computed(() => {
      if (!this.ttsVoicesLoaded.value) return [];
      const currentProviderType = this.settings.ttsProvider === 'browser_tts' ? 'browser' : 'openai';
      return this.availableTtsVoices.value.filter(v => v.provider === currentProviderType);
    });
  }
  
  public async speakText(text: string): Promise<void> {
    if (!this.isInitialized) {
        console.warn("VoiceSettingsManager: speakText called before initialization. Please call initialize() first.");
        return;
    }
    if (!this.settings.autoPlayTts || !text || !text.trim()) return;

    const currentVoice = this.getCurrentTtsVoice();
    const volume = this.settings.ttsVolume;

    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage,
          voiceURI: currentVoice?.id,
          rate: this.settings.ttsRate,
          pitch: this.settings.ttsPitch,
          volume: volume,
        });
      } catch (error) { console.error("VoiceSettingsManager: Error speaking with browser TTS:", error); }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      try {
        const response = await ttsAPI.synthesize({
          text: text,
          voice: currentVoice?.id, 
          speed: this.settings.ttsRate,
        });
        const audioBlob = response.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = volume; 
        await audio.play(); // Ensure play is awaited or handled correctly
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      } catch (error: any) {
        console.error("VoiceSettingsManager: Error speaking with backend (OpenAI) TTS:", error.response?.data || error.message);
      }
    }
  }

  public cancelSpeech(): void {
    if (!this.isInitialized) return;
    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      browserTtsService.cancel();
    }
    console.log("VoiceSettingsManager: cancelSpeech called.");
  }
}

export const voiceSettingsManager = new VoiceSettingsManager();