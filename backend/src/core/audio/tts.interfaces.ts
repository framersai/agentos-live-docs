// File: backend/src/core/audio/tts.interfaces.ts

/**
 * @file Defines interfaces for Text-to-Speech (TTS) services.
 * @version 1.0.1 - Added providerName to ITtsResult.
 * @description This file contains type definitions for TTS results,
 * provider-specific options, and TTS service configurations.
 */

/**
 * Represents the result of a Text-to-Speech (TTS) operation.
 */
export interface ITtsResult {
  /**
   * The synthesized audio data as a Buffer.
   * @type {Buffer}
   */
  audioBuffer: Buffer;

  /**
   * The MIME type of the synthesized audio (e.g., 'audio/mpeg', 'audio/opus').
   * @type {string}
   */
  mimeType: string;

  /**
   * The calculated cost for this TTS operation in USD.
   * @type {number}
   */
  cost: number;

  /**
   * The duration of the synthesized audio in seconds.
   * Optional, as it might not always be easily available or relevant for all use cases.
   * @type {number | undefined}
   */
  durationSeconds?: number;

  /**
   * The raw response from the TTS provider.
   * Can be used for debugging or accessing provider-specific information.
   * @type {any | undefined}
   */
  providerResponse?: any;

  /**
   * The voice ID or name used for synthesis, if applicable.
   * @type {string | undefined}
   */
  voiceUsed?: string;

  /**
   * Name of the TTS provider that performed the synthesis.
   * @type {string | undefined}
   */
  providerName?: string;
}

/**
 * Represents an available voice for TTS.
 */
export interface IAvailableVoice {
  /** Unique identifier for the voice. */
  id: string;
  /** Display name for the voice. */
  name: string;
  /** Gender of the voice, if specified by the provider. */
  gender?: 'male' | 'female' | 'neutral' | string;
  /** Language codes supported by this voice (e.g., "en-US", "es-ES"). */
  languageCodes?: string[];
  /** Description or characteristics of the voice. */
  description?: string;
  /** The provider this voice belongs to. */
  provider: string;
}

/**
 * Options for configuring a Text-to-Speech (TTS) service request.
 */
export interface ITtsOptions {
  /**
   * The voice to use for synthesis. Provider-specific (e.g., 'alloy', 'nova' for OpenAI).
   * @type {string | undefined}
   * @default Provider's default voice
   */
  voice?: string;

  /**
   * The desired output format of the audio (e.g., 'mp3', 'opus', 'aac', 'flac').
   * Support varies by provider.
   * @type {string | undefined}
   * @default "mp3"
   */
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;

  /**
   * The speaking rate (speed). Provider-specific interpretation.
   * Often a multiplier (e.g., 1.0 is normal, 0.5 is half speed, 2.0 is double speed).
   * @type {number | undefined}
   * @default 1.0
   */
  speakingRate?: number;

  /**
   * The pitch of the voice. Provider-specific interpretation.
   * @type {number | undefined}
   */
  pitch?: number;

  /**
   * The volume gain. Provider-specific interpretation.
   * @type {number | undefined}
   */
  volumeGainDb?: number;

  /**
   * The language of the text to be synthesized, if the provider supports multilingual synthesis
   * or needs a hint. Uses ISO 639-1 codes (e.g., 'en-US', 'es-ES').
   * @type {string | undefined}
   */
  languageCode?: string;

  /**
   * The model to use for TTS, if the provider supports model selection (e.g., 'tts-1', 'tts-1-hd' for OpenAI).
   * @type {string | undefined}
   */
  model?: string;

  /**
   * Additional provider-specific options.
   * @type {{ [key: string]: any } | undefined}
   */
  providerSpecificOptions?: { [key: string]: any };
}

/**
 * Interface for a Text-to-Speech (TTS) provider.
 * Defines the contract that all TTS service implementations must adhere to.
 */
export interface ITtsProvider {
  /**
   * Synthesizes speech from text.
   * @param {string} text - The text to synthesize.
   * @param {ITtsOptions} options - Configuration options for the synthesis.
   * @returns {Promise<ITtsResult>} A promise that resolves with the TTS result.
   * @throws {Error} If synthesis fails due to API errors, configuration issues, or unsupported options.
   */
  synthesize(
    text: string,
    options: ITtsOptions
  ): Promise<ITtsResult>;

  /**
   * Gets the name of the TTS provider.
   * @returns {string} The provider's name (e.g., "OpenAITts", "BrowserWebServiceAPI").
   */
  getProviderName(): string;

  /**
   * Optional: Lists available voices for the provider.
   * @returns {Promise<IAvailableVoice[]>} A promise that resolves with a list of available voices.
   */
  listVoices?(): Promise<IAvailableVoice[]>;
}
