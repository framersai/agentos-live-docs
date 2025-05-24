// File: frontend/src/store/voice.store.ts
/**
 * @fileoverview Pinia store for managing global voice command state,
 * including listening status, STT engine preference, transcripts, parsed intents, and errors.
 * @module store/voice
 * @see IVoiceCommandService for interactions with this store.
 */
import { defineStore } from 'pinia';
import { SpeechRecognitionStatus, ParsedLLMIntent, TranscriptionMethod, AudioInputMode } from '../types/voice.types'; // Assuming these are in voice.types.ts
import { storageService, StorageType } from '../services/storageService';

const VOICE_ENABLED_PREF_KEY = 'voiceCommandsEnabledByUser';
const TRANSCRIPTION_METHOD_PREF_KEY = 'voiceTranscriptionMethodPreference';
const AUDIO_INPUT_MODE_PREF_KEY = 'voiceAudioInputModePreference';


/**
 * @interface VoiceState
 * @description Represents the state managed by the voice store.
 */
export interface VoiceState {
  /** User's global preference to enable/disable the entire voice command system. */
  isEnabledByUser: boolean;
  /** Current status of the speech recognition engine. */
  status: SpeechRecognitionStatus;
  /** Interim (non-final) transcript from STT. */
  interimTranscript: string;
  /** Last finalized transcript from STT before NLU processing. */
  finalTranscript: string;
  /**
   * A copy of the final transcript specifically for emitting once to parent components.
   * Cleared after being read to prevent re-emission.
   */
  finalTranscriptForEmit: string | null;
  /** Stores the last error message related to voice processing. */
  lastError: string | null;
  /** True if VoiceCommandService is currently sending a transcript to the NLU engine. */
  isProcessingIntent: boolean;
  /** The last successfully parsed intent from the NLU engine. */
  lastParsedIntent: ParsedLLMIntent | null;
  /** A short feedback message for the UI (e.g., "Listening...", "Processing..."). */
  feedbackMessage: string | null;
  /** Stores details for a pending confirmation action (e.g., "Are you sure?"). */
  activeConfirmation: { intentToConfirm: ParsedLLMIntent; message: string } | null;
  /** Preferred transcription method (WebSpeech or backend Whisper via API). */
  currentTranscriptionMethod: TranscriptionMethod;
  /** Preferred audio input mode (Push-to-Talk, Continuous, VAD). */
  currentAudioInputMode: AudioInputMode;
  /** Indicates if the underlying STT engine (browser or advanced processor) is available/initialized. */
  isVoiceFeatureAvailable: boolean;
  /** Stores the last full accumulated transcription in continuous mode before sending to NLU. */
  pendingTranscription: string;
}

export const useVoiceStore = defineStore('voice', {
  state: (): VoiceState => ({
    isEnabledByUser: false,
    status: SpeechRecognitionStatus.IDLE,
    interimTranscript: '',
    finalTranscript: '',
    finalTranscriptForEmit: null,
    lastError: null,
    isProcessingIntent: false,
    lastParsedIntent: null,
    feedbackMessage: null,
    activeConfirmation: null,
    currentTranscriptionMethod: TranscriptionMethod.WEB_SPEECH, // Default
    currentAudioInputMode: AudioInputMode.PUSH_TO_TALK, // Default
    isVoiceFeatureAvailable: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window), // Basic check for WebSpeech
    pendingTranscription: '',
  }),

  getters: {
    isListening: (state): boolean => state.status === SpeechRecognitionStatus.LISTENING,
    isIdle: (state): boolean => state.status === SpeechRecognitionStatus.IDLE,
    isErrorState: (state): boolean => state.status === SpeechRecognitionStatus.ERROR && !!state.lastError,
  },

  actions: {
    /** Initializes voice preferences from storage. */
    async initializeVoicePreference() {
      const enabled = storageService.get<boolean>(StorageType.Local, VOICE_ENABLED_PREF_KEY);
      this.isEnabledByUser = enabled === null ? false : enabled; // Default false if not set

      const method = storageService.get<TranscriptionMethod>(StorageType.Local, TRANSCRIPTION_METHOD_PREF_KEY);
      this.currentTranscriptionMethod = method || TranscriptionMethod.WEB_SPEECH;

      const audioMode = storageService.get<AudioInputMode>(StorageType.Local, AUDIO_INPUT_MODE_PREF_KEY);
      this.currentAudioInputMode = audioMode || AudioInputMode.PUSH_TO_TALK;

      if (!this.isEnabledByUser) {
        this.status = SpeechRecognitionStatus.IDLE;
      }
      // isVoiceFeatureAvailable might be updated by VoiceCommandService after deeper checks
    },

    /** Sets user's global preference for enabling/disabling voice commands. */
    setUserVoicePreference(enabled: boolean) {
      this.isEnabledByUser = enabled;
      storageService.set(StorageType.Local, VOICE_ENABLED_PREF_KEY, enabled);
      if (!enabled) {
        this.setStatus(SpeechRecognitionStatus.IDLE);
        this.clearTranscripts();
        // VoiceCommandService will handle actually stopping listening.
      }
    },

    /** Sets the current status of the voice recognition system. */
    setStatus(newStatus: SpeechRecognitionStatus) {
      this.status = newStatus;
      if (newStatus !== SpeechRecognitionStatus.ERROR) this.lastError = null;

      // Update feedback message based on status (can be refined)
      if (newStatus === SpeechRecognitionStatus.LISTENING && this.isEnabledByUser) {
        this.feedbackMessage = "Listening...";
      } else if (newStatus === SpeechRecognitionStatus.PROCESSING && !this.feedbackMessage?.startsWith("Processing") && !this.feedbackMessage?.startsWith("Understanding")) {
        this.feedbackMessage = "Processing...";
      } else if (newStatus === SpeechRecognitionStatus.IDLE && (this.feedbackMessage === "Listening..." || this.feedbackMessage?.startsWith("Processing"))) {
        this.feedbackMessage = null;
      }
    },

    setInterimTranscript(transcript: string) { this.interimTranscript = transcript; },
    setFinalTranscript(transcript: string) {
      this.finalTranscript = transcript;
      this.finalTranscriptForEmit = transcript; // Set for one-time emit
      this.interimTranscript = '';
    },
    clearEmittedFinalTranscript() { this.finalTranscriptForEmit = null; },
    setError(errorMessage: string | null) {
      this.status = SpeechRecognitionStatus.ERROR;
      this.lastError = errorMessage;
      this.isProcessingIntent = false;
      this.feedbackMessage = errorMessage ? `Voice Error: ${errorMessage}` : null;
    },
    clearError() {
        if (this.status === SpeechRecognitionStatus.ERROR) {
            this.status = SpeechRecognitionStatus.IDLE;
        }
        this.lastError = null;
    },
    setProcessingIntent(isProcessing: boolean) {
      this.isProcessingIntent = isProcessing;
      if (isProcessing) {
        this.setStatus(SpeechRecognitionStatus.PROCESSING); // Implicitly sets feedback
        this.feedbackMessage = "Understanding your command...";
      }
    },
    setLastParsedIntent(intent: ParsedLLMIntent | null) {
      this.lastParsedIntent = intent;
      // Final transcript is cleared by VoiceCommandService after successful NLU
    },
    setFeedbackMessage(message: string | null, durationMs: number = 0) {
      this.feedbackMessage = message;
      if (message && durationMs > 0) {
        setTimeout(() => {
          if (this.feedbackMessage === message) this.feedbackMessage = null;
        }, durationMs);
      }
    },
    requestConfirmation(intentToConfirm: ParsedLLMIntent, message: string) {
      this.activeConfirmation = { intentToConfirm, message };
      this.feedbackMessage = `${message} Say "confirm" or "cancel".`;
      this.setStatus(SpeechRecognitionStatus.AWAITING_CONFIRMATION); // New status
    },
    resolveConfirmation(confirmed: boolean): ParsedLLMIntent | null {
      const actionToExecute = this.activeConfirmation;
      this.activeConfirmation = null;
      this.setStatus(SpeechRecognitionStatus.IDLE); // Return to idle or processing based on next step
      if (confirmed && actionToExecute) {
        this.setFeedbackMessage("Confirmed.", 1500);
        return actionToExecute.intentToConfirm;
      } else {
        this.setFeedbackMessage("Cancelled.", 1500);
        return null;
      }
    },
    clearTranscripts() {
      this.interimTranscript = '';
      this.finalTranscript = '';
      this.finalTranscriptForEmit = null; // Ensure this is also cleared
    },
    setTranscriptionMethod(method: TranscriptionMethod) {
      this.currentTranscriptionMethod = method;
      storageService.set(StorageType.Local, TRANSCRIPTION_METHOD_PREF_KEY, method);
    },
    setAudioInputMode(mode: AudioInputMode) {
      this.currentAudioInputMode = mode;
      storageService.set(StorageType.Local, AUDIO_INPUT_MODE_PREF_KEY, mode);
    },
    setIsVoiceFeatureAvailable(isAvailable: boolean) {
        this.isVoiceFeatureAvailable = isAvailable;
        if (!isAvailable) {
            this.isEnabledByUser = false; // Cannot be enabled if not available
            this.status = SpeechRecognitionStatus.IDLE;
        }
    },
    appendToPendingTranscription(text: string): string {
        this.pendingTranscription = (this.pendingTranscription ? this.pendingTranscription + " " : "") + text;
        return this.pendingTranscription;
    },
    clearPendingTranscription() {
        this.pendingTranscription = "";
    }
  },
});

// Add SpeechRecognitionStatus.AWAITING_CONFIRMATION to your enum in types/voice.types.ts
// export enum SpeechRecognitionStatus { /*...,*/ AWAITING_CONFIRMATION = 'awaiting_confirmation' }