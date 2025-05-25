// File: backend/src/core/audio/stt.interfaces.ts

/**
 * @file Defines interfaces for Speech-to-Text (STT) services.
 * @version 1.0.0
 * @description This file contains type definitions for transcription results,
 * provider-specific responses, and STT service options.
 */

/**
 * Represents the result of a transcription operation.
 */
export interface ITranscriptionResult {
  /**
   * The transcribed text.
   * @type {string}
   */
  text: string;

  /**
   * The language detected or used for transcription (e.g., 'en', 'es').
   * Optional, as not all providers may return this.
   * @type {string | undefined}
   */
  language?: string;

  /**
   * The duration of the transcribed audio in seconds.
   * Optional.
   * @type {number | undefined}
   */
  durationSeconds?: number;

  /**
   * The calculated cost for this transcription in USD.
   * @type {number}
   */
  cost: number;

  /**
   * Segments of the transcription, if provided by the STT service.
   * Useful for more detailed analysis or timestamped text.
   * @type {ITranscriptionSegment[] | undefined}
   */
  segments?: ITranscriptionSegment[];

  /**
   * The raw response from the STT provider.
   * Can be used for debugging or accessing provider-specific information.
   * Type is 'any' for flexibility with different providers.
   * @type {any | undefined}
   */
  providerResponse?: any;

  /**
   * Confidence score of the transcription, if available (0.0 to 1.0).
   * @type {number | undefined}
   */
  confidence?: number;

  /**
   * Indicates if the transcription is considered final or partial (e.g., for streaming).
   * @type {boolean | undefined}
   */
  isFinal?: boolean;
}

/**
 * Represents a segment of transcribed audio, often with timing information.
 */
export interface ITranscriptionSegment {
  /**
   * The text of this segment.
   * @type {string}
   */
  text: string;

  /**
   * Start time of the segment in seconds from the beginning of the audio.
   * @type {number}
   */
  startTime: number;

  /**
   * End time of the segment in seconds from the beginning of the audio.
   * @type {number}
   */
  endTime: number;

  /**
   * Confidence score for this specific segment, if available (0.0 to 1.0).
   * @type {number | undefined}
   */
  confidence?: number;

  /**
   * Speaker ID, if speaker diarization is enabled and supported.
   * @type {string | number | undefined}
   */
  speaker?: string | number;
}

/**
 * Options for configuring an STT service request.
 */
export interface ISttOptions {
  /**
   * The language of the audio. Providing this can improve accuracy.
   * Uses ISO 639-1 codes (e.g., 'en', 'es', 'fr').
   * @type {string | undefined}
   * @example "en-US"
   */
  language?: string;

  /**
   * The model to use for transcription, if the provider supports model selection.
   * @type {string | undefined}
   * @example "whisper-1"
   */
  model?: string;

  /**
   * Whether to enable speaker diarization (identifying different speakers).
   * Support varies by provider.
   * @type {boolean | undefined}
   */
  enableSpeakerDiarization?: boolean;

  /**
   * Expected number of speakers if diarization is enabled.
   * @type {number | undefined}
   */
  numSpeakers?: number;

  /**
   * A hint to the STT service about the context or specific phrases to expect.
   * Can improve accuracy for domain-specific terms.
   * @type {string[] | undefined}
   */
  phrases?: string[];

  /**
   * Temperature for the STT model, if applicable (OpenAI Whisper).
   * Higher values make output more random.
   * @type {number | undefined}
   */
  temperature?: number;

  /**
   * Additional provider-specific options.
   * @type {{ [key: string]: any } | undefined}
   */
  providerSpecificOptions?: { [key: string]: any };
}

/**
 * Interface for an STT provider.
 * Defines the contract that all STT service implementations must adhere to.
 */
export interface ISttProvider {
  /**
   * Transcribes an audio buffer.
   * @param {Buffer} audioBuffer - The audio data to transcribe.
   * @param {string} originalFileName - The original name of the audio file, used for format hinting.
   * @param {ISttOptions} options - Configuration options for the transcription.
   * @returns {Promise<ITranscriptionResult>} A promise that resolves with the transcription result.
   * @throws {Error} If transcription fails due to API errors, configuration issues, or unsupported formats.
   */
  transcribe(
    audioBuffer: Buffer,
    originalFileName: string,
    options: ISttOptions
  ): Promise<ITranscriptionResult>;

  /**
   * Gets the name of the STT provider.
   * @returns {string} The provider's name (e.g., "OpenAIWhisper", "GoogleSpeech").
   */
  getProviderName(): string;
}
