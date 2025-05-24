// File: frontend/src/features/chat/store/chatSettings.store.ts
/**
 * @fileoverview Pinia store for managing chat and assistant-specific settings.
 * This includes the current operational mode (e.g., coding, system design),
 * selected programming language, and other user preferences related to the assistant's behavior.
 * @module features/chat/store/chatSettings
 */
import { defineStore } from 'pinia';
import { storageService, StorageType } from '../../../services/storageService'; // Using our robust storage service
import type { SelectOption } from '../../../types'; // Assuming a global SelectOption type

const CHAT_SETTINGS_STORAGE_KEY_PREFIX = 'app-chat-settings-';

/**
 * Defines the available operational modes for the AI assistant.
 * These values should correspond to backend configurations or prompt templates.
 * @enum {string} AssistantMode
 */
export enum AssistantMode {
  CODING = 'coding',
  SYSTEM_DESIGN = 'system_design',
  MEETING_SUMMARY = 'meeting',
  GENERAL_CHAT = 'general',
  // Add more modes as the platform evolves
}

/**
 * Defines the available audio input modes.
 * @enum {string} AudioInputMode
 */
export enum AudioInputMode {
  PUSH_TO_TALK = 'push-to-talk',
  CONTINUOUS_LISTENING = 'continuous',
  VOICE_ACTIVATION = 'voice-activation',
}

/**
 * @interface ChatSettingsState
 * @description Represents the state managed by the chat settings store.
 */
export interface ChatSettingsState {
  /** The currently active assistant mode. */
  currentMode: AssistantMode;
  /** The currently selected programming language (primarily for coding mode). */
  currentLanguage: string; // e.g., 'python', 'javascript'
  /** Whether to automatically generate diagrams (e.g., for system design mode). */
  shouldGenerateDiagrams: boolean;
  /** The selected audio input mode for voice interaction. */
  currentAudioMode: AudioInputMode;
  /** Whether to automatically clear the chat input after sending a message. */
  shouldAutoClearInput: boolean;
  // Add other chat-related settings here
}

/**
 * `useChatSettingsStore` Pinia store definition.
 */
export const useChatSettingsStore = defineStore('chatSettings', {
  state: (): ChatSettingsState => ({
    currentMode: storageService.get<AssistantMode>(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}mode`) || AssistantMode.CODING,
    currentLanguage: storageService.get<string>(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}language`) || 'python',
    shouldGenerateDiagrams: storageService.get<boolean>(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}generateDiagrams`) ?? true,
    currentAudioMode: storageService.get<AudioInputMode>(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}audioMode`) || AudioInputMode.PUSH_TO_TALK,
    shouldAutoClearInput: storageService.get<boolean>(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}autoClearInput`) ?? true,
  }),

  getters: {
    /**
     * Gets the display name for the current assistant mode.
     * @param state - The current store state.
     * @returns {string} The human-readable mode name.
     */
    currentModeDisplayName(state): string {
      // This would ideally come from a configuration or i18n
      const modeMap: Record<AssistantMode, string> = {
        [AssistantMode.CODING]: 'Coding Q&A',
        [AssistantMode.SYSTEM_DESIGN]: 'System Design',
        [AssistantMode.MEETING_SUMMARY]: 'Meeting Summary',
        [AssistantMode.GENERAL_CHAT]: 'General Chat',
      };
      return modeMap[state.currentMode] || 'Unknown Mode';
    },

    /**
     * Provides a list of available assistant modes as options for UI selectors.
     * @returns {SelectOption<AssistantMode>[]}
     */
    availableModes(): SelectOption<AssistantMode>[] {
      // This could also include icons and descriptions from a config file
      return [
        { value: AssistantMode.CODING, label: 'Coding Q&A' /*, icon: CodeBracketIcon, description: '...' */ },
        { value: AssistantMode.SYSTEM_DESIGN, label: 'System Design' },
        { value: AssistantMode.MEETING_SUMMARY, label: 'Meeting Summary' },
        { value: AssistantMode.GENERAL_CHAT, label: 'General Chat' },
      ];
    },

    /**
     * Provides a list of available programming languages for UI selectors.
     * @returns {SelectOption<string>[]}
     */
    availableLanguages(): SelectOption<string>[] {
      // This could be fetched from a config or be more extensive
      return [
        { value: 'python', label: 'Python', /* icon: '🐍' */ },
        { value: 'javascript', label: 'JavaScript', /* icon: '⚡' */ },
        { value: 'typescript', label: 'TypeScript', /* icon: '🔷' */ },
        { value: 'java', label: 'Java', /* icon: '☕' */ },
        { value: 'go', label: 'Go', /* icon: '🔵' */ },
        { value: 'rust', label: 'Rust', /* icon: '🦀' */ },
      ];
    },
     /**
     * Provides a list of available audio input modes for UI selectors.
     * @returns {SelectOption<AudioInputMode>[]}
     */
    availableAudioModes(): SelectOption<AudioInputMode>[] {
        return [
            { value: AudioInputMode.PUSH_TO_TALK, label: 'Push to Talk' /* icon: '🎙️' */},
            { value: AudioInputMode.CONTINUOUS_LISTENING, label: 'Continuous Listening' /* icon: '🔊' */},
            { value: AudioInputMode.VOICE_ACTIVATION, label: 'Voice Activation' /* icon: '🔔' */},
        ];
    }
  },

  actions: {
    /**
     * Sets the active assistant mode.
     * @param {AssistantMode} mode - The new mode to set.
     */
    setMode(mode: AssistantMode) {
      if (Object.values(AssistantMode).includes(mode)) {
        this.currentMode = mode;
        storageService.set(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}mode`, mode);
      } else {
        console.warn(`[ChatSettingsStore] Attempted to set invalid mode: ${mode}`);
      }
    },

    /**
     * Sets the active programming language.
     * @param {string} language - The new language code (e.g., 'python').
     */
    setLanguage(language: string) {
      // Basic validation: ensure it's a non-empty string. More robust validation could check against a list.
      if (language && typeof language === 'string') {
        this.currentLanguage = language;
        storageService.set(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}language`, language);
      } else {
        console.warn(`[ChatSettingsStore] Attempted to set invalid language: ${language}`);
      }
    },

    /**
     * Sets the preference for generating diagrams.
     * @param {boolean} shouldGenerate - True to enable diagram generation.
     */
    setShouldGenerateDiagrams(shouldGenerate: boolean) {
      this.shouldGenerateDiagrams = shouldGenerate;
      storageService.set(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}generateDiagrams`, shouldGenerate);
    },

    /**
     * Sets the audio input mode.
     * @param {AudioInputMode} mode - The new audio mode.
     */
    setAudioMode(mode: AudioInputMode) {
      if (Object.values(AudioInputMode).includes(mode)) {
        this.currentAudioMode = mode;
        storageService.set(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}audioMode`, mode);
      } else {
        console.warn(`[ChatSettingsStore] Attempted to set invalid audio mode: ${mode}`);
      }
    },

    /**
     * Sets the preference for auto-clearing chat input.
     * @param {boolean} shouldClear - True to enable auto-clearing.
     */
    setShouldAutoClearInput(shouldClear: boolean) {
      this.shouldAutoClearInput = shouldClear;
      storageService.set(StorageType.Local, `${CHAT_SETTINGS_STORAGE_KEY_PREFIX}autoClearInput`, shouldClear);
    },
  },
});