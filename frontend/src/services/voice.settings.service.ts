// File: frontend/src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application settings including STT, TTS,
 * audio input modes, VAD parameters, chat behavior, appearance, and memory management strategy.
 * Persists settings to localStorage and provides reactive access.
 * @version 1.2.2 - Ensured full method definitions (conceptual) and consistent storage key.
 */

import { reactive, watch, onMounted, computed, ref, ComputedRef, Ref } from 'vue'; // Added Ref
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService } from './tts.service'; // Assuming tts.service.ts exists
import { ttsAPI } from '../utils/api'; // For fetching backend voices

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  provider: 'browser' | 'openai';
  isDefault?: boolean;
}

export interface VoiceApplicationSettings {
  // Core App Behavior
  currentAppMode: string;
  preferredCodingLanguage: string;
  defaultMode: string;
  defaultLanguage: string;
  autoClearChat: boolean;
  generateDiagrams: boolean;
  useAdvancedMemory: boolean; // True to use AdvancedConversationManager, false for simple

  // STT
  sttPreference: 'browser_webspeech_api' | 'whisper_api';
  selectedAudioInputDeviceId: string | null;
  speechLanguage: string;

  // Audio Input Mode
  audioInputMode: 'push-to-talk' | 'continuous' | 'voice-activation';
  vadThreshold: number;
  vadSilenceTimeoutMs: number;
  continuousModePauseTimeoutMs: number;
  continuousModeAutoSend: boolean;

  // TTS
  ttsProvider: 'browser_tts' | 'openai_tts';
  selectedTtsVoiceId: string | null;
  ttsVolume: number;
  ttsRate: number;
  ttsPitch: number;
  autoPlayTts: boolean;

  // Cost Management
  costLimit: number;
}

const initialDefaultSettings: Readonly<VoiceApplicationSettings> = {
  currentAppMode: 'general',
  preferredCodingLanguage: 'python',
  defaultMode: 'general',
  defaultLanguage: 'python',
  autoClearChat: false,
  generateDiagrams: false,
  useAdvancedMemory: true, // Default to using the advanced manager
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
  ttsVolume: 0.8, // Default volume
  ttsRate: 1.0,
  ttsPitch: 1.0,
  autoPlayTts: true,
  costLimit: 5.00, // Default $5.00
};

class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaAllVoiceAndAppSettings_v1.2.2'; // Version in key
  public readonly defaultSettings: Readonly<VoiceApplicationSettings> = initialDefaultSettings;

  public settings: VoiceApplicationSettings; // Made non-private for direct use by stores if needed

  public availableTtsVoices: Ref<VoiceOption[]> = ref([]);
  public ttsVoicesLoaded: Ref<boolean> = ref(false);
  public audioInputDevices: Ref<MediaDeviceInfo[]> = ref([]);
  public audioInputDevicesLoaded: Ref<boolean> = ref(false);
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    // Initialize settings with useStorage
    const storedSettings = useStorage(
      VoiceSettingsManager.STORAGE_KEY_SETTINGS,
      { ...this.defaultSettings }, // Ensure a new object with defaults
      localStorage,
      { mergeDefaults: true } // This will merge stored settings with defaults
    );
    this.settings = reactive(storedSettings.value);


    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
    
    // Ensure all default keys are present after loading from storage
    this.applyMissingDefaults();

    onMounted(async () => {
      if (!this.settings.currentAppMode) {
        this.settings.currentAppMode = this.defaultSettings.defaultMode;
      }
      if (!this.settings.preferredCodingLanguage) {
        this.settings.preferredCodingLanguage = this.defaultSettings.defaultLanguage;
      }
      await this.loadAllTtsVoices();
      await this.loadAudioInputDevices();
    });

    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (newProvider !== oldProvider) {
        console.log(`VoiceSettingsManager: TTS provider changed to ${newProvider}. Reloading voices.`);
        await this.loadAllTtsVoices();
      }
    });
     watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (newLang !== oldLang) {
        console.log(`VoiceSettingsManager: Speech language changed to ${newLang}. Re-evaluating default TTS voice.`);
        await this.ensureDefaultTtsVoiceSelected(); // Re-check default voice for new language
      }
    });
  }

  private applyMissingDefaults(): void {
    let changed = false;
    for (const key in this.defaultSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (this.settings[K] === undefined) {
        // @ts-ignore - K is a valid key here
        this.settings[K] = this.defaultSettings[K];
        changed = true;
      }
    }
    if (changed) {
      console.log("VoiceSettingsManager: Applied default values for missing settings.", this.settings);
    }
  }

  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: VoiceOption[] = [];

    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices(); // This now waits for voices
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
      if (response.data && Array.isArray(response.data)) {
        const backendVoices = response.data as Array<{id: string, name: string, lang?: string}>;
        backendVoices.forEach(v => {
          collectedVoices.push({
            id: v.id, name: `${v.name} (Cloud)`, lang: v.lang || 'en',
            provider: 'openai', isDefault: false, // Assuming backend doesn't mark default in the same way
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
    const currentProvider = this.settings.ttsProvider;
    const voicesForProvider = this.availableTtsVoices.value.filter(v => v.provider === (currentProvider === 'browser_tts' ? 'browser' : 'openai'));

    if (!this.settings.selectedTtsVoiceId || !voicesForProvider.find(v => v.id === this.settings.selectedTtsVoiceId)) {
      const preferredLang = this.settings.speechLanguage || 'en-US';
      const langShort = preferredLang.split('-')[0];

      let defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort) && v.isDefault);
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice && currentProvider === 'browser_tts') defaultVoice = voicesForProvider.find(v => v.isDefault);
      if (!defaultVoice && voicesForProvider.length > 0) defaultVoice = voicesForProvider[0];

      this.settings.selectedTtsVoiceId = defaultVoice ? defaultVoice.id : null;
      console.log(`VoiceSettingsManager: Default TTS voice for provider '${currentProvider}' (lang: ${preferredLang}) set to: ${defaultVoice?.name || 'None'}`);
    }
  }

  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    // ... (Full implementation as provided by user initially) ...
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator?.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('VoiceSettingsManager: enumerateDevices not supported.');
      this.audioInputDevicesLoaded.value = true; return;
    }
    try {
      if (forcePermissionRequest || this.audioInputDevices.value.every(d => !d.label)) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getTracks().forEach(track => track.stop());
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;
      if (this.settings.selectedAudioInputDeviceId && !this.audioInputDevices.value.find(d=>d.deviceId === this.settings.selectedAudioInputDeviceId)){
        this.settings.selectedAudioInputDeviceId = null;
      }
    } catch (error) {
      console.error('VoiceSettingsManager: Error loading audio input devices:', error);
      this.audioInputDevicesLoaded.value = true;
    }
  }

  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    (this.settings as any)[key] = value;
    if (key === 'ttsProvider' || key === 'speechLanguage') {
      this.ensureDefaultTtsVoiceSelected();
    }
  }

  public resetToDefaults(): void {
    const defaults = { ...this.defaultSettings };
    for (const key in defaults) {
        this.updateSetting(key as keyof VoiceApplicationSettings, defaults[key as keyof VoiceApplicationSettings]);
    }
    // No need to call loadAllTtsVoices here, ensureDefaultTtsVoiceSelected will be triggered by ttsProvider/speechLanguage updates if any.
    console.log("VoiceSettingsManager: All settings reset to defaults.");
  }

  public getCurrentTtsVoice(): VoiceOption | null {
    if (!this.settings.selectedTtsVoiceId) return null;
    return this.availableTtsVoices.value.find(v => v.id === this.settings.selectedTtsVoiceId) || null;
  }

  public get ttsVoicesForCurrentProvider(): ComputedRef<VoiceOption[]> {
    return computed(() => {
      if (!this.ttsVoicesLoaded.value) return [];
      return this.availableTtsVoices.value.filter(v =>
        (this.settings.ttsProvider === 'browser_tts' && v.provider === 'browser') ||
        (this.settings.ttsProvider === 'openai_tts' && v.provider === 'openai')
      );
    });
  }

  public async speakText(text: string): Promise<void> {
    // ... (Full implementation as provided by user initially or my prior stub if simple)
    if (!this.settings.autoPlayTts || !text || !text.trim()) return;
    const currentVoice = this.getCurrentTtsVoice();
    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage,
          voiceURI: currentVoice?.id,
          rate: this.settings.ttsRate, pitch: this.settings.ttsPitch, volume: this.settings.ttsVolume,
        });
      } catch (error) { console.error("VoiceSettingsManager: Error speaking with browser TTS:", error); }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      try {
        const response = await ttsAPI.synthesize({ text: text, voice: currentVoice?.id });
        const audioBlob = response.data; const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl); audio.volume = this.settings.ttsVolume;
        audio.play(); audio.onended = () => URL.revokeObjectURL(audioUrl);
      } catch (error) { console.error("VoiceSettingsManager: Error speaking with backend (OpenAI) TTS:", error); }
    }
  }

  public cancelSpeech(): void {
    // ... (Full implementation as provided by user initially) ...
    if (this.settings.ttsProvider === 'browser_tts') browserTtsService.cancel();
    // Add audio element cancellation for OpenAI TTS if implemented
  }
}

export const voiceSettingsManager = new VoiceSettingsManager();