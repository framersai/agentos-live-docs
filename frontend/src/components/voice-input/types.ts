// File: frontend/src/components/voice-input/types.ts
/**
 * @file types.ts
 * @description Defines shared TypeScript interfaces and types for the VoiceInput module.
 *
 * Revision:
 * - Added MicPermissionStatusType.
 * - Ensured AudioModeOption's description is optional.
 */

import type { Ref, ComputedRef } from 'vue';
import type { AudioInputMode } from '@/services/voice.settings.service';

/**
 * @interface SttHandlerInstance
 * @description Defines the API contract that STT handler components must expose.
 */
export interface SttHandlerInstance {
  isActive: Ref<boolean>;
  isListeningForWakeWord: Ref<boolean>;
  hasPendingTranscript: ComputedRef<boolean>;
  pendingTranscript: Ref<string>;
  startListening: (forVadCommandCapture?: boolean) => Promise<boolean>;
  stopListening: (abort?: boolean) => Promise<void>;
  reinitialize: () => Promise<void>;
  stopAll: (abort?: boolean) => Promise<void>;
  clearPendingTranscript: () => void;
}

/**
 * @type SttEngineType
 * @description Supported STT engines.
 * 'browser_webspeech_api': Browser's built-in Web Speech API.
 * 'whisper_api': Whisper API endpoint.
 */
export type SttEngineType = 'browser_webspeech_api' | 'whisper_api';

/**
 * @type VoiceInputMode
 * @description Alias for AudioInputMode.
 */
export type VoiceInputMode = AudioInputMode;

/**
 * @type MicPermissionStatusType
 * @description Defines the possible states for microphone permission.
 */
export type MicPermissionStatusType =
  | ''          // Initial state, unknown
  | 'prompt'    // Permission prompt is active or will be shown
  | 'granted'   // Permission granted
  | 'denied'    // Permission explicitly denied
  | 'error';    // Error occurred trying to get permission or access mic

/**
 * @interface AudioModeOption
 * @description Represents an option in the audio mode selection UI.
 */
export interface AudioModeOption {
  label: string;
  value: VoiceInputMode;
  icon?: string;
  description?: string; // Made optional to match usage
}

/**
 * @interface SttEngineOption
 * @description Represents an option for STT engine selection.
 */
export interface SttEngineOption {
  label: string;
  value: SttEngineType;
  description?: string;
}

/**
 * @interface TranscriptionData
 * @description Payload for transcription events from STT Handlers.
 */
export interface TranscriptionData {
  /** The transcribed text. */
  text: string;
  /** Indicates if this is the final segment of a transcription. */
  isFinal: boolean;
  /** Optional confidence score (0.0 to 1.0). */
  confidence?: number;
  /** Optional timestamp for the transcription. */
  timestamp?: number;
}

/**
 * @interface SttHandlerErrorPayload
 * @description Payload for error events from STT Handlers.
 */
export interface SttHandlerErrorPayload {
  /** A type/category for the error (e.g., 'network', 'recognition', 'permission'). */
  type: string;
  /** The error message. */
  message: string;
  /** An optional error code provided by the underlying STT engine or system. */
  code?: string;
  /** Indicates if the error is fatal and the handler needs reinitialization. */
  fatal?: boolean;
}