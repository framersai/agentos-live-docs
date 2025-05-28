/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application operational settings.
 * This includes STT, TTS, audio input modes, VAD parameters, chat behavior preferences,
 * agent interaction toggles (like diagram generation), memory strategy, and API cost limits.
 * Persists settings to localStorage and provides reactive access.
 * @version 1.3.4 - Clarified scope and minor type assertion update.
 * @author Voice Coding Assistant Team
 */

import { reactive, watch, computed, ref, type ComputedRef, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService, type SpeakOptions as BrowserSpeakOptions } from './tts.service';
import { ttsAPI, type TTSVoiceFE, type TTSRequestPayloadFE } from '../utils/api'; // Corrected import
import type { AgentId } from './agent.service'; // For currentAppMode and defaultMode

/**
 * @interface VoiceOption
 * @description Represents a TTS voice option available to the user.
 * The `id` is a unique identifier, typically prefixed with the provider.
 */
export interface VoiceOption {
  /** Unique ID, typically provider_voiceId (e.g., browser_voiceURI, openai_alloy). */
  id: string;
  name: string;
  lang: string;
  provider: 'browser' | 'openai'; // Add other providers if they exist
  isDefault?: boolean;
  gender?: string;
  description?: string;
}

export type AudioInputMode = 'push-to-talk' | 'continuous' | 'voice-activation';
export type TutorLevel = 'beginner' | 'intermediate' | 'expert'; // For defaultTutorLevel

/**
 * @interface VoiceApplicationSettings
 * @description Defines the complete structure for all user-configurable application settings,
 * encompassing voice, agent interaction, chat behavior, and operational parameters.
 */
export interface VoiceApplicationSettings {
  // Agent & Interaction Settings
  currentAppMode: AgentId; // Active agent ID
  preferredCodingLanguage: string;
  defaultMode: AgentId; // Default agent ID to load
  defaultLanguage: string;
  generateDiagrams: boolean; // Global toggle for agents that can generate diagrams

  // Chat Behavior & Memory
  autoClearChat: boolean;
  useAdvancedMemory: boolean; // Toggle for advanced conversation summarization/history management

  // STT (Speech-to-Text) Settings
  sttPreference: 'browser_webspeech_api' | 'whisper_api';
  selectedAudioInputDeviceId: string | null;
  speechLanguage: string; // BCP 47 code, for STT and TTS hint

  // Audio Input & VAD Settings
  audioInputMode: AudioInputMode;
  vadThreshold: number; // 0-1, voice activity detection sensitivity
  vadSilenceTimeoutMs: number; // Silence duration to stop VAD recording
  continuousModePauseTimeoutMs: number; // Pause duration in continuous mode
  continuousModeAutoSend: boolean; // Auto-send audio after pause in continuous mode

  // TTS (Text-to-Speech) Settings
  ttsProvider: 'browser_tts' | 'openai_tts';
  selectedTtsVoiceId: string | null; // Prefixed ID (e.g., "openai_alloy")
  ttsVolume: number; // 0-1
  ttsRate: number;   // 0.5-2.0 typically
  ttsPitch: number;  // 0.0-2.0 primarily for browser TTS
  autoPlayTts: boolean;

  // Application Operational Settings
  costLimit: number; // User-defined API cost threshold

  // Agent-Specific Default Settings (Consider if these are truly global user prefs)
  defaultTutorLevel?: TutorLevel; // User's preferred default difficulty for Tutor Agent
}

const initialDefaultSettings: Readonly<VoiceApplicationSettings> = {
  currentAppMode: 'general_chat' as AgentId,
  preferredCodingLanguage: 'python',
  defaultMode: 'general_chat' as AgentId,
  defaultLanguage: 'python',
  autoClearChat: false,
  generateDiagrams: true,
  useAdvancedMemory: true,
  sttPreference: 'browser_webspeech_api',
  selectedAudioInputDeviceId: null,
  speechLanguage: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  audioInputMode: 'continuous',
  vadThreshold: 0.15,
  vadSilenceTimeoutMs: 2500,
  continuousModePauseTimeoutMs: 3000,
  continuousModeAutoSend: true,
  ttsProvider: 'browser_tts',
  selectedTtsVoiceId: null,
  ttsVolume: 0.9,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  autoPlayTts: true,
  costLimit: 10.00,
  defaultTutorLevel: 'intermediate',
};

interface CollectedVoiceTemp {
  rawId: string; name: string; lang: string; provider: 'browser' | 'openai';
  isDefault?: boolean; gender?: string; description?: string;
}

class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaUserAppSettings_v1.4.0';
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
      { ...this.defaultSettings },
      localStorage,
      { mergeDefaults: true }
    );
    this.settings = reactive(storedSettings.value as VoiceApplicationSettings);
    this.applyMissingDefaults();

    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (!this.isInitialized || newProvider === oldProvider) return;
      // console.log(`[VoiceSettingsManager] TTS provider changed to ${newProvider}. Reloading voices.`);
      await this.loadAllTtsVoices();
    });

    watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (!this.isInitialized || newLang === oldLang) return;
      // console.log(`[VoiceSettingsManager] Speech language changed to ${newLang}. Re-evaluating default TTS voice.`);
      await this.ensureDefaultTtsVoiceSelected(); // No need to reload all voices, just re-evaluate default
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    // console.log("[VoiceSettingsManager] Initializing settings service...");

    (Object.keys(this.defaultSettings) as Array<keyof VoiceApplicationSettings>).forEach(key => {
        if (this.settings[key] === undefined || this.settings[key] === null) {
            // console.warn(`[VoiceSettingsManager] Setting ${key} was undefined/null, applying default: ${this.defaultSettings[key]}`);
            (this.settings as any)[key] = this.defaultSettings[key];
        }
    });

    await this.loadAllTtsVoices();
    await this.loadAudioInputDevices();
    this.isInitialized = true;
    // console.log("[VoiceSettingsManager] Initialization complete. Current settings:", JSON.parse(JSON.stringify(this.settings)));
  }

  private applyMissingDefaults(): void {
    let changed = false;
    for (const key in this.defaultSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (this.settings[K] === undefined) {
        (this.settings as any)[K] = this.defaultSettings[K];
        changed = true;
      }
    }
    if (changed) {
      // console.log("[VoiceSettingsManager] Applied default values for missing settings during construction.");
    }
  }

  public async loadAllTtsVoices(): Promise<void> {
    this.ttsVoicesLoaded.value = false;
    const collectedVoices: CollectedVoiceTemp[] = [];

    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices();
        browserVoicesRaw.forEach((v: SpeechSynthesisVoice) => {
          collectedVoices.push({
            rawId: v.voiceURI, name: v.name, lang: v.lang,
            provider: 'browser', isDefault: v.default,
          });
        });
      } catch (error) { console.error("[VoiceSettingsManager] Error loading browser TTS voices:", error); }
    }

    try {
      const response = await ttsAPI.getAvailableVoices();
      if (response.data && Array.isArray(response.data.voices)) {
        const backendApiVoices = response.data.voices as TTSVoiceFE[];
        backendApiVoices.forEach(v_api => {
          collectedVoices.push({
            rawId: v_api.id, name: v_api.name, lang: v_api.lang || 'en',
            provider: (v_api.provider as 'openai' | 'browser') || 'openai',
            isDefault: v_api.isDefault || false,
            gender: v_api.gender,
            description: v_api.description,
          });
        });
      }
    } catch (error) { console.error("[VoiceSettingsManager] Error loading backend TTS voices:", error); }

    const uniqueVoicesMap = new Map<string, VoiceOption>();
    collectedVoices.forEach(cv => {
        const uniqueId = `${cv.provider}_${cv.rawId}`;
        if (!uniqueVoicesMap.has(uniqueId)) {
            uniqueVoicesMap.set(uniqueId, {
                id: uniqueId, name: cv.name, lang: cv.lang, provider: cv.provider,
                isDefault: cv.isDefault, gender: cv.gender, description: cv.description,
            });
        }
    });

    this.availableTtsVoices.value = Array.from(uniqueVoicesMap.values())
      .sort((a, b) => `${a.provider}-${a.name}`.localeCompare(`${b.provider}-${b.name}`));
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
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.isDefault);
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice) defaultVoice = voicesForProvider[0];

      this.updateSetting('selectedTtsVoiceId', defaultVoice.id);
      // console.log(`[VoiceSettingsManager] Default TTS voice auto-set to: ${defaultVoice.name}`);
    } else if (!currentSelectionIsValid && voicesForProvider.length === 0) {
      this.updateSetting('selectedTtsVoiceId', null);
      // console.log(`[VoiceSettingsManager] No TTS voices for provider '${currentProviderType}'. Selection cleared.`);
    }
  }

  public async loadAudioInputDevices(forcePermissionRequest: boolean = false): Promise<void> {
    this.audioInputDevicesLoaded.value = false;
    if (typeof navigator?.mediaDevices?.enumerateDevices !== 'function') {
      console.warn('[VoiceSettingsManager] navigator.mediaDevices.enumerateDevices is not supported.');
      this.audioInputDevicesLoaded.value = true; return;
    }
    try {
      const devicesPreviouslyLoaded = this.audioInputDevices.value.length > 0;
      const devicesLackLabels = devicesPreviouslyLoaded && this.audioInputDevices.value.every(d => !d.label);

      if (forcePermissionRequest || !devicesPreviouslyLoaded || devicesLackLabels ) {
        // console.log('[VoiceSettingsManager] Requesting media permissions to enumerate devices with labels...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getTracks().forEach(track => track.stop());
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;

      if (this.settings.selectedAudioInputDeviceId && !this.audioInputDevices.value.some(d => d.deviceId === this.settings.selectedAudioInputDeviceId)) {
        this.updateSetting('selectedAudioInputDeviceId', null);
        // console.log('[VoiceSettingsManager] Previously selected audio input device not found. Selection cleared.');
      }
      // console.log(`[VoiceSettingsManager] Loaded ${this.audioInputDevices.value.length} audio input devices.`);
    } catch (error: any) {
      console.error('[VoiceSettingsManager] Error loading audio input devices:', error.name, error.message);
      this.audioInputDevices.value = [];
      this.audioInputDevicesLoaded.value = true;
    }
  }

  public updateSetting<K extends keyof VoiceApplicationSettings>(key: K, value: VoiceApplicationSettings[K]): void {
    this.settings[key] = value;
    // console.log(`[VoiceSettingsManager] Setting '${key}' updated to`, value);
  }

  public updateSettings(newSettings: Partial<VoiceApplicationSettings>): void {
    let changed = false;
    let ttsRelatedChanged = false;
    for (const key in newSettings) {
        const K = key as keyof VoiceApplicationSettings;
        if (Object.prototype.hasOwnProperty.call(this.settings, K) && this.settings[K] !== newSettings[K]) {
            (this.settings as any)[K] = newSettings[K]; // Direct assignment
            changed = true;
            if (K === 'ttsProvider' || K === 'speechLanguage') {
                ttsRelatedChanged = true;
            }
        }
    }
    if (changed) {
        // console.log("[VoiceSettingsManager] Multiple settings updated.");
        if (ttsRelatedChanged) {
            this.loadAllTtsVoices(); // This will re-ensure default voice
        }
    }
  }

  public resetToDefaults(): void {
    const oldSelectedAudioDevice = this.settings.selectedAudioInputDeviceId;
    const defaultsToApply = { ...this.defaultSettings };
    this.updateSettings(defaultsToApply); // Use batch update

    // updateSettings handles ttsProvider/speechLanguage changes causing loadAllTtsVoices.
    // Explicitly check if audio device related settings changed and might need a reload/revalidation.
    if (this.isInitialized && this.settings.selectedAudioInputDeviceId !== oldSelectedAudioDevice) {
        this.loadAudioInputDevices();
    }
    // console.log("[VoiceSettingsManager] All settings reset to defaults.");
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
        console.warn("[VoiceSettingsManager] speakText called before initialization.");
        return;
    }
    if (!this.settings.autoPlayTts || !text || !text.trim()) return;

    this.cancelSpeech(); // Cancel any existing speech before starting new

    const currentVoice = this.getCurrentTtsVoice();
    const volume = this.settings.ttsVolume;
    let effectiveVoiceId = currentVoice?.id; // By default, use the prefixed ID

    if (currentVoice?.provider === 'browser' && currentVoice.id.startsWith('browser_')) {
        effectiveVoiceId = currentVoice.id.substring('browser_'.length); // Browser TTS needs raw voiceURI
    }
    // For OpenAI, the prefixed ID (e.g., 'openai_alloy') is assumed to be handled by the ttsAPI or backend.

    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage,
          voiceURI: effectiveVoiceId,
          rate: this.settings.ttsRate,
          pitch: this.settings.ttsPitch,
          volume: volume,
        } as BrowserSpeakOptions);
      } catch (error) { console.error("[VoiceSettingsManager] Error speaking with browser TTS:", error); }
    } else if (this.settings.ttsProvider === 'openai_tts') {
      try {
        const payload: TTSRequestPayloadFE = {
          text: text,
          voice: effectiveVoiceId, // Send the potentially prefixed ID (e.g. "openai_alloy")
          speed: this.settings.ttsRate,
        };
        const response = await ttsAPI.synthesize(payload);
        const audioBlob = response.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Use activePreviewAudio to manage this playback so it can be cancelled
        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        
        const currentAudio = this.activePreviewAudio; // Capture current audio for handlers
        currentAudio.onended = () => {
          if (this.activePreviewAudio === currentAudio) { // Check if it's still the active one
            URL.revokeObjectURL(audioUrl);
            this.activePreviewAudio = null;
          } else if (currentAudio.src === audioUrl) { // If not active but it's this one, still revoke
             URL.revokeObjectURL(audioUrl);
          }
        };
        currentAudio.onerror = () => {
            console.error("[VoiceSettingsManager] Error playing synthesized audio from backend.");
            if (this.activePreviewAudio === currentAudio) {
                URL.revokeObjectURL(audioUrl);
                this.activePreviewAudio = null;
            } else if (currentAudio.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
        await currentAudio.play();
      } catch (error: any) {
        console.error("[VoiceSettingsManager] Error speaking with backend (OpenAI) TTS:", error.response?.data || error.message);
         if (this.activePreviewAudio && this.activePreviewAudio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.activePreviewAudio.src); // Clean up if error before playback ends
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
        this.activePreviewAudio.currentTime = 0;
        if (this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.activePreviewAudio.src);
        }
        this.activePreviewAudio = null;
    }
    // console.log("[VoiceSettingsManager] cancelSpeech called.");
  }

  public async previewVoice(voiceId: string, text?: string): Promise<void> {
    if (!this.isInitialized) {
      console.warn("[VoiceSettingsManager] previewVoice called before initialization.");
      return;
    }
    const voiceToPreview = this.availableTtsVoices.value.find(v => v.id === voiceId);
    if (!voiceToPreview) {
      console.error(`[VoiceSettingsManager] Voice with ID ${voiceId} not found for preview.`);
      return;
    }

    const previewText = text || `This is a preview of the voice ${voiceToPreview.name}.`;
    this.cancelSpeech(); // Cancel any ongoing speech, including other previews

    const volume = this.settings.ttsVolume;
    const rate = this.settings.ttsRate;
    const pitch = this.settings.ttsPitch;
    let effectiveVoiceId = voiceToPreview.id; // Default to the prefixed ID

    if (voiceToPreview.provider === 'browser' && voiceToPreview.id.startsWith('browser_')) {
        effectiveVoiceId = voiceToPreview.id.substring('browser_'.length);
    }
    // For OpenAI, the prefixed ID (e.g., 'openai_alloy') is used.

    if (voiceToPreview.provider === 'browser' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(previewText, {
          voiceURI: effectiveVoiceId,
          lang: voiceToPreview.lang,
          volume: volume,
          rate: rate,
          pitch: pitch,
        } as BrowserSpeakOptions);
      } catch (error) { console.error("[VoiceSettingsManager] Error previewing browser voice:", error); }
    } else if (voiceToPreview.provider === 'openai') {
      try {
        const payload: TTSRequestPayloadFE = {
            text: previewText,
            voice: effectiveVoiceId, // Use the prefixed ID for API
            speed: rate,
        };
        const response = await ttsAPI.synthesize(payload);
        const audioUrl = URL.createObjectURL(response.data);

        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;

        const currentPreview = this.activePreviewAudio;
        currentPreview.onended = () => {
            if (this.activePreviewAudio === currentPreview && currentPreview.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
                this.activePreviewAudio = null;
            } else if (currentPreview.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
        currentPreview.onerror = () => {
            console.error("[VoiceSettingsManager] Error playing preview audio for OpenAI voice.");
            if (this.activePreviewAudio === currentPreview && currentPreview.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
                this.activePreviewAudio = null;
            } else if (currentPreview.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
        await currentPreview.play();

      } catch (error: any) {
        console.error("[VoiceSettingsManager] Error fetching or playing OpenAI voice preview:", error.response?.data || error.message);
        if (this.activePreviewAudio && this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.activePreviewAudio.src);
        }
        this.activePreviewAudio = null;
      }
    }
  }
}

export const voiceSettingsManager = new VoiceSettingsManager();