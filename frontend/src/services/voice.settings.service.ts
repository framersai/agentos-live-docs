// File: frontend/src/services/voice.settings.service.ts
/**
 * @file VoiceSettingsService.ts
 * @description Manages all voice-related and core application operational settings.
 * @version 1.4.4 - Added Whisper-specific VAD/continuous mode settings.
 */

import { reactive, watch, computed, ref, type Ref, type ComputedRef /* Removed Ref type if not explicitly used */ } from 'vue';
import { useStorage } from '@vueuse/core';
import { ttsService as browserTtsService, type SpeakOptions as BrowserSpeakOptions } from './tts.service';
import { ttsAPI, type TTSVoiceFE, type TTSRequestPayloadFE } from '../utils/api';
import type { AgentId } from './agent.service';

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  provider: 'browser' | 'openai';
  providerVoiceId: string;
  isDefault?: boolean;
  gender?: string;
  description?: string;
}

export type AudioInputMode = 'push-to-talk' | 'continuous' | 'voice-activation';
export type TutorLevel = 'beginner' | 'intermediate' | 'expert';
export type STTPreference = 'browser_webspeech_api' | 'whisper_api';
export type TTSProvider = 'browser_tts' | 'openai_tts';

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
  ephemeralLogMaxCompact: number;
  ephemeralLogMaxExpanded: number;

  // STT (Speech-to-Text) Settings
  sttPreference: STTPreference;
  selectedAudioInputDeviceId: string | null;
  speechLanguage: string;
  sttOptions?: {
    prompt?: string;
    temperature?: number;
  };

  // Audio Input & VAD Settings
  audioInputMode: AudioInputMode;
  vadThreshold: number; // For BrowserSpeechHandler VAD (visual/general)
  vadSilenceTimeoutMs: number; // General silence timeout for VAD command phase completion
  continuousModePauseTimeoutMs: number; // For BrowserSpeechHandler continuous mode's own pause logic to send
  continuousModeAutoSend: boolean; // Applies to Browser STT continuous
  vadCommandRecognizedPauseMs: number; // How long to wait after VAD command for more speech (Browser STT)

  /**
   * @property {number} [vadThresholdWhisper] - Deprecated or specific if used differently.
   * Consider standardizing VAD settings or clarifying its use if distinct from vadSensitivityDb.
   * For now, keeping as per your definition.
   */
  vadThresholdWhisper?: number;

  // NEWLY ADDED Settings for WhisperHandler and general STT control
  /** Sensitivity for AnalyserNode based silence detection (dBFS, lower is more sensitive). Used by Whisper handler. */
  vadSensitivityDb?: number;
  /** Duration for the "Sending in..." UI countdown for Whisper continuous mode (ms). */
  continuousModeSilenceSendDelayMs?: number;
  /** Minimum duration of a Whisper audio segment to be considered for transcription (seconds). */
  minWhisperSegmentDurationS?: number;
  /** Maximum duration for STT recording segments (seconds), e.g., for continuous Whisper. */
  maxSegmentDurationS?: number;


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
    // temperature: 0.0
  },
  audioInputMode: 'voice-activation',
  vadThreshold: 0.15, // General VAD threshold (e.g. for visualization)
  vadSilenceTimeoutMs: 2500, // For VAD command phase completion
  continuousModePauseTimeoutMs: 3000, // For Browser STT continuous pause before send
  continuousModeAutoSend: true,
  vadCommandRecognizedPauseMs: 2000, // For Browser STT VAD command continuation

  vadThresholdWhisper: 4, // Original Whisper VAD energy level (if used by a specific VAD implementation)

  // Defaults for NEWLY ADDED settings
  vadSensitivityDb: -45, // Default dBFS for silence detection with AnalyserNode
  continuousModeSilenceSendDelayMs: 1500, // e.g., 1.5 seconds "sending in" display
  minWhisperSegmentDurationS: 0.75, // Minimum 0.75s for a valid Whisper segment
  maxSegmentDurationS: 30, // Max 30s for continuous segments, can be overridden for PTT/VAD

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
  rawProviderId: string; name: string; lang: string; provider: 'browser' | 'openai';
  isDefault?: boolean; gender?: string; description?: string;
}

class VoiceSettingsManager {
  private static readonly STORAGE_KEY_SETTINGS = 'vcaUserAppSettings_v1.4.4'; // Version bump
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
    this.settings = reactive(storedSettings.value) as VoiceApplicationSettings;
    this.applyMissingDefaults();

    watch(() => this.settings.ttsProvider, async (newProvider, oldProvider) => {
      if (!this.isInitialized || newProvider === oldProvider) return;
      await this.loadAllTtsVoices();
    });

    watch(() => this.settings.speechLanguage, async (newLang, oldLang) => {
      if (!this.isInitialized || newLang === oldLang) return;
      await this.ensureDefaultTtsVoiceSelected();
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.applyMissingDefaults();
    await this.loadAllTtsVoices();
    await this.loadAudioInputDevices();
    this.isInitialized = true;
  }

  private applyMissingDefaults(): void {
    let changed = false;
    for (const key in this.defaultSettings) {
      const K = key as keyof VoiceApplicationSettings;
      if (this.settings[K] === undefined && this.defaultSettings[K] !== undefined) {
        (this.settings as any)[K] = this.defaultSettings[K];
        changed = true;
      }
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
    // if (changed) { console.log("[VoiceSettingsManager] Applied default values for new/missing settings."); }
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

    if (browserTtsService.isSupported()) {
      try {
        const browserVoicesRaw = await browserTtsService.getVoices();
        browserVoicesRaw.forEach((v: SpeechSynthesisVoice) => {
          collectedVoices.push({
            rawProviderId: v.voiceURI,
            name: v.name,
            lang: v.lang,
            provider: 'browser',
            isDefault: v.default,
          });
        });
      } catch (error) {
        console.error("[VoiceSettingsManager] Error loading browser TTS voices:", error);
      }
    }

    try {
      const response = await ttsAPI.getAvailableVoices();
      if (response.data && Array.isArray(response.data.voices)) {
        const backendApiVoices = response.data.voices as TTSVoiceFE[];
        backendApiVoices.forEach(v_api => {
          collectedVoices.push({
            rawProviderId: v_api.id,
            name: v_api.name,
            lang: v_api.lang || 'en',
            provider: (v_api.provider as 'openai' | 'browser') || 'openai',
            isDefault: v_api.isDefault || false,
            gender: v_api.gender,
            description: v_api.description,
          });
        });
      }
    } catch (error) {
      console.error("[VoiceSettingsManager] Error loading backend TTS voices:", error);
    }

    const uniqueVoicesMap = new Map<string, VoiceOption>();
    collectedVoices.forEach(cv => {
      const sanitizedRawId = cv.provider === 'browser'
        ? cv.rawProviderId.replace(/[^a-zA-Z0-9_.:\/-]/g, '_')
        : cv.rawProviderId;
      const uniqueId = `${cv.provider}_${sanitizedRawId}`;

      if (!uniqueVoicesMap.has(uniqueId)) {
        uniqueVoicesMap.set(uniqueId, {
          id: uniqueId,
          providerVoiceId: cv.rawProviderId,
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
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.isDefault);
      if (!defaultVoice) defaultVoice = voicesForProvider.find(v => v.lang.toLowerCase().startsWith(langShort));
      if (!defaultVoice) defaultVoice = voicesForProvider[0];

      this.updateSetting('selectedTtsVoiceId', defaultVoice.id);
    } else if (!currentSelectionIsValid && voicesForProvider.length === 0) {
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
      const devicesPreviouslyLoadedWithLabels = this.audioInputDevices.value.length > 0 &&
                                                this.audioInputDevices.value.some(d => d.label && d.label !== '');

      if (forcePermissionRequest || !devicesPreviouslyLoadedWithLabels) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        stream.getTracks().forEach(track => track.stop());
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      this.audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
      this.audioInputDevicesLoaded.value = true;

      if (this.settings.selectedAudioInputDeviceId &&
          !this.audioInputDevices.value.some(d => d.deviceId === this.settings.selectedAudioInputDeviceId)) {
        this.updateSetting('selectedAudioInputDeviceId', null);
      }
    } catch (error: any) {
      console.error('[VoiceSettingsManager] Error loading audio input devices:', error.name, error.message);
      this.audioInputDevicesLoaded.value = true;
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
        this.loadAllTtsVoices();
    }
  }

  public resetToDefaults(): void {
    const defaultsToApply = { ...this.defaultSettings };
    for (const key in defaultsToApply) {
        (this.settings as any)[key] = (defaultsToApply as any)[key];
    }
    this.applyMissingDefaults();
    this.loadAllTtsVoices();
    this.loadAudioInputDevices();
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
    if (!this.isInitialized || !this.settings.autoPlayTts || !text || !text.trim()) return;
    this.cancelSpeech();

    const currentVoice = this.getCurrentTtsVoice();
    const volume = this.settings.ttsVolume;

    if (this.settings.ttsProvider === 'browser_tts' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(text, {
          lang: currentVoice?.lang || this.settings.speechLanguage,
          voiceURI: currentVoice?.providerVoiceId,
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
          voice: currentVoice?.providerVoiceId || 'alloy',
          speed: this.settings.ttsRate,
        };
        const response = await ttsAPI.synthesize(payload);
        const audioBlob = response.data;
        const audioUrl = URL.createObjectURL(audioBlob);

        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        const currentAudio = this.activePreviewAudio;

        const cleanup = () => {
            if (currentAudio && currentAudio.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            if (this.activePreviewAudio === currentAudio) {
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
      this.activePreviewAudio.currentTime = 0;
      if (this.activePreviewAudio.src && this.activePreviewAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.activePreviewAudio.src);
      }
      this.activePreviewAudio.removeAttribute('src');
      this.activePreviewAudio.load();
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
    this.cancelSpeech();

    const { ttsVolume: volume, ttsRate: rate, ttsPitch: pitch } = this.settings;

    if (voiceToPreview.provider === 'browser' && browserTtsService.isSupported()) {
      try {
        await browserTtsService.speak(previewText, {
          voiceURI: voiceToPreview.providerVoiceId,
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
          voice: voiceToPreview.providerVoiceId,
          speed: rate,
        };
        const response = await ttsAPI.synthesize(payload);
        const audioUrl = URL.createObjectURL(response.data);

        this.activePreviewAudio = new Audio(audioUrl);
        this.activePreviewAudio.volume = volume;
        const currentPreview = this.activePreviewAudio;

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