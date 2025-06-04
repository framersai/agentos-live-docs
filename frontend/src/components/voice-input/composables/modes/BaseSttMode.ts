// File: frontend/src/components/voice-input/composables/modes/BaseSttMode.ts
/**
 * @file BaseSttMode.ts
 * @description Abstract base class for STT modes (PTT, Continuous, VAD).
 * Defines the common contract, state structure, and shared utilities for all modes.
 * Modes should extend this class to ensure consistent behavior and API.
 *
 * @version 1.3.0
 * @updated 2025-06-04 - Corrected playSound signature in SttModeContext to accept AudioBuffer | null.
 * Added audioMode to SttModeContext to provide modes with direct access to the current audio input mode setting.
 */
import type { Ref, ComputedRef } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { SttHandlerInstance, SttHandlerErrorPayload } from '../../types'; // Added SttHandlerErrorPayload
import type { VoiceInputSharedState } from '../shared/useVoiceInputState';
import type { AudioFeedbackInstance } from '../shared/useAudioFeedback';
import type { useTranscriptionDisplay } from '../shared/useTranscriptionDisplay';
import type { ToastService } from '@/services/services';

/**
 * @interface SttModeContext
 * @description Context object provided to STT mode constructors.
 * Contains dependencies and shared state needed by the modes.
 */
export interface SttModeContext {
  /** Indicates if the Language Model is currently processing. */
  isProcessingLLM: Ref<boolean>;
  /** Indicates if microphone permission has been granted. */
  micPermissionGranted: Ref<boolean>;
  /** Reactive reference to the API of the currently active STT handler. */
  activeHandlerApi: Ref<SttHandlerInstance | null>;
  /** Vue component emit function for mode-specific events. */
  emit: (event: string, ...args: any[]) => void;
  /**
   * @method playSound
   * @description Function to play audio feedback sounds.
   * @param {AudioBuffer | null} buffer - The audio buffer to play. Can be null if sound failed to load.
   * @param {number} [volume] - Optional volume override (0.0 to 1.0).
   */
  playSound: (buffer: AudioBuffer | null, volume?: number) => void;
  /** Global voice application settings. */
  settings: Ref<VoiceApplicationSettings>;
  /** Shared reactive state for the voice input module. */
  sharedState: VoiceInputSharedState;
  /** Instance for managing transcription UI feedback. */
  transcriptionDisplay: ReturnType<typeof useTranscriptionDisplay>;
  /** Instance for playing audio cues (beeps). */
  audioFeedback: AudioFeedbackInstance;
  /** Reactive reference to the current audio input mode selected by the user. */
  audioMode: Ref<AudioInputMode>;
  /** Optional toast notification service. */
  toast?: ToastService;
}

/**
 * @interface SttModePublicState
 * @description Defines the reactive state properties that each mode must expose publicly.
 */
export interface SttModePublicState {
  /** True if the mode is actively listening/processing. */
  isActive: ComputedRef<boolean>;
  /** True if the mode can currently be started. */
  canStart: ComputedRef<boolean>;
  /** User-facing status text for the current mode. */
  statusText: ComputedRef<string>;
  /** Placeholder text for the input field, relevant to the current mode. */
  placeholderText: ComputedRef<string>;
}

/**
 * @abstract
 * @class BaseSttMode
 * @description Abstract base class for all STT modes.
 * Provides a common structure and ensures all modes implement essential methods.
 * Exposes reactive state properties directly.
 */
export abstract class BaseSttMode implements SttModePublicState {
  /** Context object containing dependencies and shared state. */
  protected readonly context: SttModeContext;

  public abstract readonly isActive: ComputedRef<boolean>;
  public abstract readonly canStart: ComputedRef<boolean>;
  public abstract readonly statusText: ComputedRef<string>;
  public abstract readonly placeholderText: ComputedRef<string>;

  /**
   * @constructor
   * @param {SttModeContext} context - The context object providing dependencies.
   */
  constructor(context: SttModeContext) {
    this.context = context;
  }

  /** @abstract */
  abstract start(): Promise<boolean>;
  /** @abstract */
  abstract stop(): Promise<void>;
  /** @abstract */
  abstract handleTranscription(text: string): void;
  /**
   * @abstract
   * @method handleError
   * @description Handles an error that occurred during STT processing or in the handler.
   * @param {Error | SttHandlerErrorPayload} error - The error object or structured error payload.
   * @returns {void}
   */
  abstract handleError(error: Error | SttHandlerErrorPayload): void;
  /** @abstract */
  abstract cleanup(): void;

  /**
   * @protected
   * @method isBlocked
   * @description Checks if the mode is currently blocked from starting or operating.
   * @returns {boolean} True if blocked, false otherwise.
   */
  protected isBlocked(): boolean {
    return (
      this.context.isProcessingLLM.value ||
      !this.context.micPermissionGranted.value ||
      !this.context.activeHandlerApi.value
    );
  }

  /**
   * @protected
   * @method emitTranscription
   * @description Emits a processed transcription to the parent component if it's not empty.
   * @param {string} text - The text to emit.
   */
  protected emitTranscription(text: string): void {
    const trimmedText = text.trim();
    if (trimmedText) {
      this.context.emit('transcription', trimmedText);
    }
  }
}
