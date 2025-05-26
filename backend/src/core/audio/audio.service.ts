
// File: backend/src/core/audio/audio.service.ts
/**
 * @file Audio Service
 * @description Handles audio processing tasks including Speech-to-Text (STT) and Text-to-Speech (TTS)
 * using various providers like OpenAI Whisper and OpenAI TTS.
 * @version 1.2.1 - Corrected TypeScript errors and interface alignments.
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'; // Added import for ES Modules
import OpenAI from 'openai';
import type { SpeechCreateParams } from 'openai/resources/audio/speech'; // For OpenAI specific types

// --- Temporary Interface Definitions (These should live in their respective .interfaces.ts files) ---
// Assuming these are the intended structures based on usage and errors.

/**
 * @interface ISttRequestOptions (Should be in stt.interfaces.ts)
 * @description Options for an STT request.
 */
export interface ISttRequestOptions {
  language?: string; // BCP-47 language tag
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  model?: string; // e.g., 'whisper-1'
  temperature?: number; // For Whisper
}

/**
 * @interface ITranscriptionResult (Should be in stt.interfaces.ts)
 * @description Represents the result of a speech transcription.
 */
export interface ITranscriptionResult {
  text: string;
  language?: string;
  durationSeconds?: number;
  cost: number;
  providerResponse?: any;
  usage?: { // Added usage property
    durationMinutes: number;
    modelUsed: string;
    [key: string]: any;
  };
}

/**
 * @interface ITtsOptions (Should be in tts.interfaces.ts)
 * @description Defines options for Text-to-Speech synthesis.
 */
export interface ITtsOptions {
  voice?: string;
  model?: string;
  outputFormat?: SpeechCreateParams['response_format']; // Use OpenAI's specific type
  speakingRate?: number; // Typically 0.25 to 4.0 for OpenAI
  languageCode?: string; // For browser TTS primarily
  providerId?: string; // Added providerId
  [key: string]: any; // Allow other provider-specific options
}

/**
 * @interface IAvailableVoice (Should be in tts.interfaces.ts)
 * @description Represents an available TTS voice.
 */
export interface IAvailableVoice {
  id: string;
  name: string;
  lang: string;
  gender?: string; // Or other relevant properties
  provider: string;
  isDefault?: boolean;
}

/**
 * @interface ITtsResult (Should be in tts.interfaces.ts)
 * @description Represents the result of a TTS synthesis.
 */
export interface ITtsResult {
  audioBuffer: Buffer;
  mimeType: string;
  cost: number;
  voiceUsed?: string;
  providerName?: string;
  durationSeconds?: number; // Optional, as it might not always be available
  usage?: { // Added usage property
    characters: number;
    modelUsed: string;
    [key: string]: any;
  };
}

/**
 * @interface ISttProvider (Should be in stt.interfaces.ts)
 * @description Defines the contract for a Speech-to-Text provider.
 */
export interface ISttProvider {
  getProviderName(): string;
  transcribe(audioBuffer: Buffer, originalFileName: string, options: ISttRequestOptions): Promise<ITranscriptionResult>;
}

/**
 * @interface ITtsProvider (Should be in tts.interfaces.ts)
 * @description Defines the contract for a Text-to-Speech provider.
 */
export interface ITtsProvider {
  getProviderName(): string;
  synthesize(text: string, options: ITtsOptions): Promise<ITtsResult>; // Renamed from synthesizeSpeech
  listAvailableVoices(): Promise<IAvailableVoice[]>;
}

// --- End of Temporary Interface Definitions ---


import { CostService } from '../cost/cost.service';
import dotenv from 'dotenv';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../'); // backend/src/core/audio -> project root
dotenv.config({ path: path.join(projectRoot, '.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHISPER_MODEL_DEFAULT = 'whisper-1';
const OPENAI_TTS_MODEL_DEFAULT : SpeechCreateParams['model'] = 'tts-1'; // Ensure type matches OpenAI SDK
const OPENAI_TTS_VOICE_DEFAULT : SpeechCreateParams['voice'] = 'alloy'; // Ensure type matches OpenAI SDK

if (!OPENAI_API_KEY) {
  console.warn('AudioService: OPENAI_API_KEY is not set. OpenAI dependent services (Whisper, OpenAI TTS) will fail.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// --- STT Providers ---

class WhisperApiSttProvider implements ISttProvider {
  private readonly providerName = "OpenAI Whisper API";

  public getProviderName(): string {
    return this.providerName;
  }
  
  async transcribe(audioBuffer: Buffer, originalFileName: string, options: ISttRequestOptions): Promise<ITranscriptionResult> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Whisper STT unavailable.');
    }

    const tempFilePath = path.join(os.tmpdir(), `whisper-audio-${Date.now()}-${originalFileName}`);
    await fs.writeFile(tempFilePath, audioBuffer);
    
    // fs.open returns a FileHandle, its createReadStream method can be used directly.
    const fileHandle = await fs.open(tempFilePath, 'r');

    try {
      const transcriptionInput = await OpenAI.toFile(fileHandle.createReadStream(), originalFileName);
      
      const transcription = await openai.audio.transcriptions.create({
        file: transcriptionInput,
        model: options.model || WHISPER_MODEL_DEFAULT,
        language: options.language,
        prompt: options.prompt,
        response_format: options.responseFormat || 'json',
        temperature: options.temperature,
      });

      const text = (transcription as any).text || ''; 
      
      let durationSeconds = 0;
      if (options.responseFormat === 'verbose_json' && (transcription as any).duration) {
        durationSeconds = (transcription as any).duration;
      } else {
        const typicalBytesPerSecond = 16000 * 2; 
        durationSeconds = audioBuffer.length / typicalBytesPerSecond; 
      }
      
      const costPerMinute = parseFloat(process.env.WHISPER_API_COST_PER_MINUTE || "0.006");
      const cost = (durationSeconds / 60) * costPerMinute;

      return {
        text: text,
        language: (transcription as any).language || options.language,
        durationSeconds: durationSeconds,
        cost: cost,
        providerResponse: transcription,
        usage: { // Added usage object
            durationMinutes: durationSeconds / 60,
            modelUsed: options.model || WHISPER_MODEL_DEFAULT,
        }
      };
    } finally {
      await fileHandle.close();
      await fs.unlink(tempFilePath).catch(err => console.error(`AudioService: Failed to delete temp file ${tempFilePath}:`, err));
    }
  }
}


// --- TTS Providers ---

class BrowserTtsProvider implements ITtsProvider {
    private readonly providerName = "Browser Web Speech API (Conceptual)";
  
    public getProviderName(): string {
      return this.providerName;
    }
  
    async synthesize(text: string, options: ITtsOptions): Promise<ITtsResult> { // Renamed method
      console.warn("AudioService: BrowserTtsProvider is conceptual for backend. Cannot synthesize speech server-side.");
      throw new Error("Browser TTS cannot be directly used by the backend service.");
    }
  
    async listAvailableVoices(): Promise<IAvailableVoice[]> {
      console.warn("AudioService: BrowserTtsProvider cannot list voices from the backend.");
      return [];
    }
}

class OpenAiTtsProvider implements ITtsProvider {
  private readonly providerName = "OpenAI TTS API";
  public readonly costPer1KChars = parseFloat(process.env.OPENAI_TTS_COST_PER_1K_CHARS || "0.000015");

  public getProviderName(): string {
    return this.providerName;
  }

  async synthesize(text: string, options: ITtsOptions): Promise<ITtsResult> { // Renamed method
    if (!openai) {
      throw new Error('OpenAI API key not configured. OpenAI TTS unavailable.');
    }
    if (text.length > 4096) {
        throw new Error('Text input for OpenAI TTS exceeds maximum length of 4096 characters.');
    }

    try {
      const ttsPayload: SpeechCreateParams = {
        model: (options.model as SpeechCreateParams['model']) || OPENAI_TTS_MODEL_DEFAULT,
        voice: (options.voice as SpeechCreateParams['voice']) || OPENAI_TTS_VOICE_DEFAULT,
        input: text,
        response_format: options.outputFormat || 'mp3', // Default to 'mp3'
        speed: options.speakingRate,
      };
      
      const speechResponse = await openai.audio.speech.create(ttsPayload);
      
      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      const charactersBilled = text.length;
      const cost = (charactersBilled / 1000) * this.costPer1KChars;
      
      return {
        audioBuffer,
        mimeType: `audio/${ttsPayload.response_format === 'aac' ? 'aac' : ttsPayload.response_format === 'opus' ? 'opus' : ttsPayload.response_format === 'flac' ? 'flac' : 'mpeg'}`, // Adjust mime type
        cost,
        voiceUsed: ttsPayload.voice,
        providerName: this.providerName,
        usage: { // Added usage object
            characters: text.length,
            modelUsed: String(ttsPayload.model),
        }
      };
    } catch (error: any) {
      console.error(`AudioService: OpenAI TTS synthesis error:`, error.message || error);
      if (error.response && error.response.data) {
        console.error("OpenAI TTS API Error Details:", error.response.data);
      }
      throw new Error(`OpenAI TTS synthesis failed: ${error.message}`);
    }
  }

  async listAvailableVoices(): Promise<IAvailableVoice[]> {
    const voices: SpeechCreateParams['voice'][] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    return voices.map(voice => ({
      id: voice!, // Assert voice is not undefined
      name: voice!.charAt(0).toUpperCase() + voice!.slice(1),
      lang: 'en', 
      gender: 'neutral', 
      provider: this.providerName,
    }));
  }
}

class AudioService {
  private sttProvider: ISttProvider;
  private ttsProviders: Map<string, ITtsProvider>;
  private defaultTtsProviderId: string;

  constructor() {
    this.sttProvider = new WhisperApiSttProvider(); 

    this.ttsProviders = new Map();
    this.ttsProviders.set('browser_tts', new BrowserTtsProvider()); 
    if (openai) {
        this.ttsProviders.set('openai_tts', new OpenAiTtsProvider());
        this.defaultTtsProviderId = process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER === 'openai_tts' ? 'openai_tts' : 'browser_tts';
        if (this.defaultTtsProviderId === 'browser_tts' && !openai) { // If default is browser but openai was intended and failed
            console.warn("AudioService: OpenAI TTS not available, but was set as preferred. TTS might not function as expected on backend.");
        } else if (!openai && process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER === 'openai_tts') {
            this.defaultTtsProviderId = 'browser_tts'; // Fallback if openAI not configured but was default
             console.warn("AudioService: OpenAI TTS preferred but not configured, falling back to conceptual browser_tts for default.");
        } else if (openai) {
             this.defaultTtsProviderId = process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER || 'openai_tts';
        }

    } else {
        this.defaultTtsProviderId = 'browser_tts'; 
        console.warn("AudioService: OpenAI API key not configured. OpenAI TTS provider not initialized. Defaulting to conceptual browser_tts.");
    }

    console.log(`AudioService initialized. Default STT: ${this.sttProvider.getProviderName()}. Default TTS: ${this.defaultTtsProviderId}`);
  }

  public setSttProvider(providerId: 'whisper_api' | string): void {
    if (providerId === 'whisper_api') {
      this.sttProvider = new WhisperApiSttProvider();
    } else {
      throw new Error(`AudioService: Unknown STT provider ID: ${providerId}`);
    }
    console.log(`AudioService: STT provider set to ${this.sttProvider.getProviderName()}`);
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    originalFileName: string,
    options: ISttRequestOptions,
    userId: string,
  ): Promise<ITranscriptionResult> {
    try {
      const result = await this.sttProvider.transcribe(audioBuffer, originalFileName, options);
      CostService.trackCost(
        userId,
        'stt',
        result.cost,
        options.model || this.sttProvider.getProviderName(),
        audioBuffer.length, 
        result.text?.length || 0,
        { 
            provider: this.sttProvider.getProviderName(), 
            durationSeconds: result.durationSeconds,
            language: result.language
        }
      );
      return result;
    } catch (error: any) {
        console.error(`AudioService: Error during STT processing with ${this.sttProvider.getProviderName()}:`, error.message);
        throw error;
    }
  }

  async synthesizeSpeech(text: string, options: ITtsOptions, userId: string): Promise<ITtsResult> {
    // Use providerId from options if present, otherwise use .env default, otherwise use service default
    const providerIdToUse = options.providerId || process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER || this.defaultTtsProviderId;
    const ttsProvider = this.ttsProviders.get(providerIdToUse);

    if (!ttsProvider) {
      throw new Error(`AudioService: TTS provider '${providerIdToUse}' not found or not configured.`);
    }
    
    // Ensure options for OpenAI provider are correctly defaulted if it's the chosen one
    const finalOptions = { ...options };
    if (providerIdToUse === 'openai_tts') {
        finalOptions.model = options.model || OPENAI_TTS_MODEL_DEFAULT;
        finalOptions.voice = options.voice || OPENAI_TTS_VOICE_DEFAULT;
        finalOptions.outputFormat = options.outputFormat || 'mp3';
    }


    try {
      console.log(`AudioService: Synthesizing speech with ${ttsProvider.getProviderName()}. Text length: ${text.length}`);
      const result = await ttsProvider.synthesize(text, finalOptions); // Changed to .synthesize
      CostService.trackCost(
        userId,
        'tts',
        result.cost,
        finalOptions.model || ttsProvider.getProviderName(),
        text.length, 
        result.audioBuffer.length, 
        { 
            provider: ttsProvider.getProviderName(), 
            voice: result.voiceUsed,
            format: result.mimeType.split('/')[1]
        }
      );
      return result;
    } catch (error: any) {
        console.error(`AudioService: Error during TTS processing with ${ttsProvider.getProviderName()}:`, error.message);
        throw error;
    }
  }

  async listAvailableTtsVoices(providerId?: string): Promise<IAvailableVoice[]> {
    if (providerId) {
      const ttsProvider = this.ttsProviders.get(providerId);
      if (!ttsProvider) {
        console.warn(`AudioService: TTS provider '${providerId}' not found when listing voices.`);
        return [];
      }
      return ttsProvider.listAvailableVoices();
    } else {
      let allVoices: IAvailableVoice[] = [];
      for (const [_id, provider] of this.ttsProviders) {
        try {
            const voices = await provider.listAvailableVoices();
            allVoices = allVoices.concat(voices);
        } catch (error: any) {
            console.warn(`AudioService: Could not list voices for provider ${_id}: ${error.message}`);
        }
      }
      return allVoices;
    }
  }

  async analyzeAudio(audioBuffer: Buffer): Promise<{duration: number, fileSize: number, estimatedCost: number, isOptimal: boolean, recommendations: string[], mimeType?: string}> {
    const fileSize = audioBuffer.length;
    const bytesPerSecond = 32000; 
    const duration = fileSize / bytesPerSecond;
    const costPerMinute = parseFloat(process.env.WHISPER_API_COST_PER_MINUTE || "0.006");
    const estimatedCost = (duration / 60) * costPerMinute;

    return {
        duration,
        fileSize,
        estimatedCost,
        isOptimal: true, 
        recommendations: [],
        mimeType: 'audio/webm' 
    };
  }

  async getSpeechProcessingStats(userId?: string): Promise<object> {
    const openAITtsProvider = this.ttsProviders.get('openai_tts');
    let openAITTSCostInfo = 'N/A (OpenAI TTS provider not available)';
    if (openAITtsProvider && openAITtsProvider instanceof OpenAiTtsProvider) {
        openAITTSCostInfo = String(openAITtsProvider.costPer1KChars);
    }

    return {
        sttProvider: this.sttProvider.getProviderName(),
        defaultTtsProvider: this.defaultTtsProviderId,
        availableTtsProviders: Array.from(this.ttsProviders.keys()),
        whisperCostPerMinute: process.env.WHISPER_API_COST_PER_MINUTE || "0.006",
        openAITTSCostPer1KChars: openAITTSCostInfo,
    };
  }
}

export const audioService = new AudioService();