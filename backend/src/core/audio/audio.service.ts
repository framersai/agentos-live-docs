/**
 * @file Audio Service
 * @description Handles audio processing tasks including Speech-to-Text (STT) and Text-to-Speech (TTS)
 * using various providers like OpenAI Whisper and OpenAI TTS.
 * @version 1.3.1 - Corrected TypeScript errors from interface misalignments and CostService calls.
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import type { SpeechCreateParams } from 'openai/resources/audio/speech';

// Using interfaces from their dedicated files
import { ISttOptions, ITranscriptionResult as ISttTranscriptionResult, ISttProvider as ISttProviderDefinition } from './stt.interfaces';
import { ITtsOptions, IAvailableVoice, ITtsResult, ITtsProvider as ITtsProviderDefinition } from './tts.interfaces'; // ITtsOptions will be the updated version

import { CostService } from '../cost/cost.service';
import dotenv from 'dotenv';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');
dotenv.config({ path: path.join(projectRoot, '.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHISPER_MODEL_DEFAULT = 'whisper-1';
const OPENAI_TTS_MODEL_DEFAULT : SpeechCreateParams['model'] = (process.env.OPENAI_TTS_DEFAULT_MODEL as SpeechCreateParams['model']) || 'tts-1';
const OPENAI_TTS_VOICE_DEFAULT : SpeechCreateParams['voice'] = (process.env.OPENAI_TTS_DEFAULT_VOICE as SpeechCreateParams['voice']) || 'alloy';
const OPENAI_TTS_DEFAULT_SPEED = parseFloat(process.env.OPENAI_TTS_DEFAULT_SPEED || "1.0");

if (!OPENAI_API_KEY) {
  console.warn('AudioService: OPENAI_API_KEY is not set. OpenAI dependent services (Whisper, OpenAI TTS) will fail.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// --- STT Providers ---

class WhisperApiSttProvider implements ISttProviderDefinition {
  private readonly providerName = "OpenAI Whisper API";

  public getProviderName(): string {
    return this.providerName;
  }
  
  async transcribe(audioBuffer: Buffer, originalFileName: string, options: ISttOptions): Promise<ISttTranscriptionResult> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Whisper STT unavailable.');
    }

    const tempFileName = `whisper-audio-${Date.now()}-${path.basename(originalFileName)}`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    await fs.writeFile(tempFilePath, audioBuffer);
    
    const fileHandle = await fs.open(tempFilePath, 'r');

    try {
      const transcriptionInput = await OpenAI.toFile(fileHandle.createReadStream(), path.basename(originalFileName));
      
      const sttModel = options.model || WHISPER_MODEL_DEFAULT;
      console.log(`AudioService: Whisper STT request - Model: ${sttModel}, Lang: ${options.language || 'auto'}, Filename: ${originalFileName}, Prompt: ${options.prompt ? 'Yes' : 'No'}`);

      const transcription = await openai.audio.transcriptions.create({
        file: transcriptionInput,
        model: sttModel,
        language: options.language,
        prompt: options.prompt,
        response_format: options.responseFormat || 'verbose_json',
        temperature: options.temperature,
      });

      const text = (transcription as any).text || ''; 
      
      let durationSeconds = 0;
      if ((transcription as any).duration) {
        durationSeconds = (transcription as any).duration;
      } else {
        const typicalBytesPerSecond = 16000 * 2; 
        durationSeconds = audioBuffer.length / typicalBytesPerSecond; 
        console.warn(`AudioService: Whisper duration not available from API response for format ${options.responseFormat || 'verbose_json'}. Estimated duration: ${durationSeconds.toFixed(2)}s`);
      }
      
      const costPerMinute = parseFloat(process.env.WHISPER_API_COST_PER_MINUTE || "0.006");
      const cost = (durationSeconds / 60) * costPerMinute;

      const result: ISttTranscriptionResult = {
        text: text,
        language: (transcription as any).language || options.language,
        durationSeconds: durationSeconds,
        cost: cost,
        providerResponse: transcription,
        usage: {
            durationMinutes: durationSeconds / 60,
            modelUsed: sttModel,
        }
      };
      return result;
    } finally {
      await fileHandle.close();
      await fs.unlink(tempFilePath).catch(err => console.error(`AudioService: Failed to delete temp file ${tempFilePath}:`, err));
    }
  }
}


// --- TTS Providers ---

class BrowserTtsProvider implements ITtsProviderDefinition {
    private readonly providerName = "Browser Web Speech API (Conceptual)";
  
    public getProviderName(): string {
      return this.providerName;
    }
  
    async synthesize(text: string, options: ITtsOptions): Promise<ITtsResult> {
      console.warn("AudioService: BrowserTtsProvider is conceptual for backend. Cannot synthesize speech server-side for provider 'browser_tts'.");
      throw new Error("Browser TTS cannot be directly used by the backend service. Please select a server-side TTS provider like 'openai_tts'.");
    }
  
    async listAvailableVoices(): Promise<IAvailableVoice[]> {
      console.warn("AudioService: BrowserTtsProvider cannot list voices from the backend.");
      return [];
    }
}

class OpenAiTtsProvider implements ITtsProviderDefinition {
  private readonly providerName = "OpenAI TTS API";
  public readonly costPer1KChars = parseFloat(process.env.OPENAI_TTS_COST_PER_1M_CHARS || "0.015") / 1000;


  public getProviderName(): string {
    return this.providerName;
  }

  async synthesize(text: string, options: ITtsOptions): Promise<ITtsResult> { // options.speed and options.volume are now valid
    if (!openai) {
      throw new Error('OpenAI API key not configured. OpenAI TTS unavailable.');
    }
    if (text.length > 4096) {
        throw new Error('Text input for OpenAI TTS exceeds maximum length of 4096 characters.');
    }

    try {
      const ttsModel: SpeechCreateParams['model'] = options.model || OPENAI_TTS_MODEL_DEFAULT;
      const ttsVoice: SpeechCreateParams['voice'] = (options.voice as SpeechCreateParams['voice']) || OPENAI_TTS_VOICE_DEFAULT;
      // Accessing options.speed (now valid due to ITtsOptions change)
      const ttsSpeed: number = options.speed ?? OPENAI_TTS_DEFAULT_SPEED;
      const ttsFormat: SpeechCreateParams['response_format'] = options.outputFormat || 'mp3';

      if (options.pitch !== undefined && options.pitch !== 1.0) {
          console.warn(`AudioService (OpenAI TTS): 'pitch' parameter (value: ${options.pitch}) is provided but not supported by the OpenAI TTS API. It will be ignored.`);
      }
      // Accessing options.volume (now valid due to ITtsOptions change)
      if (options.volume !== undefined && options.volume !== 1.0) {
          console.warn(`AudioService (OpenAI TTS): 'volume' parameter (value: ${options.volume}) is provided but not supported by the OpenAI TTS API. It will be ignored.`);
      }

      const ttsPayload: SpeechCreateParams = {
        model: ttsModel,
        voice: ttsVoice,
        input: text,
        response_format: ttsFormat,
        speed: ttsSpeed, 
      };
      
      console.log(`AudioService: OpenAI TTS request - Model: ${ttsModel}, Voice: ${ttsVoice}, Speed: ${ttsSpeed}, Format: ${ttsFormat}, Chars: ${text.length}`);
      const speechResponse = await openai.audio.speech.create(ttsPayload);
      
      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      const charactersBilled = text.length;
      const cost = (charactersBilled / 1000) * this.costPer1KChars;
      
      let mimeType = 'audio/mpeg';
      if (ttsFormat === 'opus') mimeType = 'audio/opus';
      else if (ttsFormat === 'aac') mimeType = 'audio/aac';
      else if (ttsFormat === 'flac') mimeType = 'audio/flac';

      const estimatedDurationSeconds = audioBuffer.length / (24000 * 2);

      const result: ITtsResult = {
        audioBuffer,
        mimeType,
        cost,
        voiceUsed: String(ttsPayload.voice),
        providerName: this.providerName,
        durationSeconds: estimatedDurationSeconds,
        usage: { 
            characters: text.length,
            modelUsed: String(ttsPayload.model),
        }
      };
      return result;
    } catch (error: any) {
      console.error(`AudioService: OpenAI TTS synthesis error - Text: "${text.substring(0,50)}..."`, error.message || error);
      if (error.response && error.response.data) {
        console.error("OpenAI TTS API Error Details:", JSON.stringify(error.response.data, null, 2));
      }
      throw new Error(`OpenAI TTS synthesis failed: ${error.message}`);
    }
  }

  async listAvailableVoices(): Promise<IAvailableVoice[]> {
    const voices: SpeechCreateParams['voice'][] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    return voices.map(voice => ({
      id: voice, 
      name: voice.charAt(0).toUpperCase() + voice.slice(1),
      lang: 'en', 
      gender: 'neutral',
      provider: this.providerName,
      isDefault: voice === OPENAI_TTS_VOICE_DEFAULT,
    }));
  }
}

class AudioService {
  private sttProvider: ISttProviderDefinition;
  private ttsProviders: Map<string, ITtsProviderDefinition>;
  private defaultTtsProviderId: string;

  constructor() {
    this.sttProvider = new WhisperApiSttProvider(); 

    this.ttsProviders = new Map();
    this.ttsProviders.set('browser_tts', new BrowserTtsProvider()); 
    if (openai) {
        this.ttsProviders.set('openai_tts', new OpenAiTtsProvider());
        const preferredProvider = process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER;
        if (preferredProvider === 'openai_tts') {
            this.defaultTtsProviderId = 'openai_tts';
        } else if (preferredProvider === 'browser_tts') {
            this.defaultTtsProviderId = 'browser_tts';
        } else {
            this.defaultTtsProviderId = 'openai_tts';
        }
    } else {
        this.defaultTtsProviderId = 'browser_tts'; 
        console.warn("AudioService: OpenAI API key not configured. OpenAI TTS provider not initialized. Defaulting to conceptual browser_tts.");
    }
    console.log(`AudioService initialized. Default STT: ${this.sttProvider.getProviderName()}. Default TTS provider: ${this.defaultTtsProviderId}`);
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
    options: ISttOptions,
    userId: string,
  ): Promise<ISttTranscriptionResult> {
    try {
      const result = await this.sttProvider.transcribe(audioBuffer, originalFileName, options);
      CostService.trackCost(
        userId,
        'stt',
        result.cost,
        result.usage?.modelUsed || this.sttProvider.getProviderName(),
        audioBuffer.length, 
        'bytes',
        result.text?.length || 0,
        'characters',
        { 
            provider: this.sttProvider.getProviderName(), 
            durationSeconds: result.durationSeconds,
            language: result.language
        }
      );
      return result;
    } catch (error: any) {
        console.error(`AudioService: Error during STT processing with ${this.sttProvider.getProviderName()} for user ${userId}:`, error.message);
        throw error;
    }
  }

  async synthesizeSpeech(text: string, options: ITtsOptions, userId: string): Promise<ITtsResult> {
    const providerIdToUse = options.providerId || this.defaultTtsProviderId;
    const ttsProvider = this.ttsProviders.get(providerIdToUse);

    if (!ttsProvider) {
      throw new Error(`AudioService: TTS provider '${providerIdToUse}' not found or not configured.`);
    }
    
    const finalOptions: ITtsOptions = { ...options }; // finalOptions.speed and finalOptions.volume are now valid fields
    if (providerIdToUse === 'openai_tts') {
        finalOptions.model = (options.model as SpeechCreateParams['model']) || OPENAI_TTS_MODEL_DEFAULT;
        finalOptions.voice = (options.voice as SpeechCreateParams['voice']) || OPENAI_TTS_VOICE_DEFAULT;
        finalOptions.outputFormat = options.outputFormat || 'mp3';
        // Accessing options.speed (now valid)
        finalOptions.speed = options.speed ?? OPENAI_TTS_DEFAULT_SPEED; 
    }

    try {
      console.log(`AudioService: User [${userId}] attempting TTS with ${ttsProvider.getProviderName()}. Options:`, JSON.stringify(finalOptions));
      const result = await ttsProvider.synthesize(text, finalOptions);
      CostService.trackCost(
        userId,
        'tts',
        result.cost,
        result.usage?.modelUsed || ttsProvider.getProviderName(),
        result.usage?.characters || text.length,
        'characters',
        result.audioBuffer.length, 
        'bytes',
        { 
            provider: ttsProvider.getProviderName(), 
            voice: result.voiceUsed,
            format: result.mimeType.split('/')[1],
            durationSeconds: result.durationSeconds,
            // finalOptions.speed and finalOptions.volume are now valid fields from ITtsOptions
            speed: finalOptions.speed,
            pitch: finalOptions.pitch,
            volume: finalOptions.volume
        }
      );
      return result;
    } catch (error: any) {
        console.error(`AudioService: Error during TTS processing with ${ttsProvider.getProviderName()} for user ${userId}:`, error.message);
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
      return ttsProvider.listAvailableVoices ? await ttsProvider.listAvailableVoices() : [];
    } else {
      let allVoices: IAvailableVoice[] = [];
      for (const [_id, provider] of this.ttsProviders) {
        try {
            if(provider.listAvailableVoices){
                const voices = await provider.listAvailableVoices();
                allVoices = allVoices.concat(voices);
            }
        } catch (error: any) {
            console.warn(`AudioService: Could not list voices for provider ${_id}: ${error.message}`);
        }
      }
      return allVoices;
    }
  }

  async analyzeAudio(audioBuffer: Buffer): Promise<{duration: number, fileSize: number, estimatedCost: number, isOptimal: boolean, recommendations: string[], mimeType?: string}> {
    const fileSize = audioBuffer.length;
    const typicalBytesPerSecond = 16000 * 2 * 0.5; 
    const duration = fileSize / typicalBytesPerSecond;
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
    const openAITtsProviderInstance = this.ttsProviders.get('openai_tts') as OpenAiTtsProvider | undefined;
    let openAITTSCostInfo = 'N/A (OpenAI TTS provider not available or not configured)';
    if (openAITtsProviderInstance) {
        openAITTSCostInfo = `$${openAITtsProviderInstance.costPer1KChars.toFixed(6)} per 1K characters`;
    }

    return {
        sttProvider: this.sttProvider.getProviderName(),
        defaultTtsProvider: this.defaultTtsProviderId,
        availableTtsProviders: Array.from(this.ttsProviders.keys()),
        whisperCostPerMinute: `$${parseFloat(process.env.WHISPER_API_COST_PER_MINUTE || "0.006").toFixed(3)}`,
        openAITTSCostInfo: openAITTSCostInfo,
        openaiTtsDefaultModel: OPENAI_TTS_MODEL_DEFAULT,
        openaiTtsDefaultVoice: OPENAI_TTS_VOICE_DEFAULT,
        openaiTtsDefaultSpeed: OPENAI_TTS_DEFAULT_SPEED,
    };
  }
}

export const audioService = new AudioService();