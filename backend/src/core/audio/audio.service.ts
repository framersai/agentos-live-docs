// File: backend/src/core/audio/audio.service.ts

/**
 * @file Service for handling audio processing tasks like STT and TTS.
 * @version 1.2.0 - Corrected OpenAI Transcription type to TranscriptionVerbose and segment speaker handling.
 * @description This service acts as a facade for various audio providers (e.g., OpenAI Whisper for STT, OpenAI TTS).
 * It also includes utilities for cost estimation and audio analysis.
 */

import OpenAI from 'openai';
import { ITranscriptionResult, ISttOptions, ISttProvider, ITranscriptionSegment } from './stt.interfaces'; 
import { ITtsResult, ITtsOptions, ITtsProvider, IAvailableVoice } from './tts.interfaces';
import { CostService } from '../cost/cost.service';
import { Readable } from 'stream';
import { LlmConfigService, LlmProviderId } from '../llm/llm.config.service';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Utility class for audio cost calculations and limits.
 */
export class AudioCostUtils {
  public static readonly WHISPER_API_COST_PER_MINUTE = 0.006;
  public static readonly MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
  public static readonly OPENAI_TTS_COST_PER_1K_CHARS = 0.015;
  public static readonly OPENAI_TTS_HD_COST_PER_1K_CHARS = 0.030;

  public static calculateWhisperCost(durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const durationMinutes = durationSeconds / 60;
    return durationMinutes * this.WHISPER_API_COST_PER_MINUTE;
  }

  public static calculateOpenAiTtsCost(text: string, model: string = 'tts-1'): number {
    const charCount = text.length;
    if (charCount === 0) return 0;
    const costPer1kChars = model.toLowerCase().includes('-hd')
      ? this.OPENAI_TTS_HD_COST_PER_1K_CHARS
      : this.OPENAI_TTS_COST_PER_1K_CHARS;
    return (charCount / 1000) * costPer1kChars;
  }
}

/**
 * Interface for the result of basic audio analysis for cost estimation.
 */
export interface IAudioAnalysisResult {
  fileSizeBytes: number;
  estimatedDurationSeconds?: number;
  estimatedCostUSD: number;
  isOptimal: boolean;
  recommendations: string[];
}

// --- STT Provider Implementation (OpenAI Whisper) ---

class OpenAIWhisperProvider implements ISttProvider {
  private openai: OpenAI | null = null;
  private llmConfigService: LlmConfigService;

  constructor(llmConfigServiceInstance: LlmConfigService) {
    this.llmConfigService = llmConfigServiceInstance;
    const openAIConfig = this.llmConfigService.getProviderConfig(LlmProviderId.OPENAI);
    
    if (openAIConfig?.apiKey) {
      this.openai = new OpenAI({ apiKey: openAIConfig.apiKey });
    } else {
      console.error('OpenAIWhisperProvider: OpenAI API key is not configured. STT will not function.');
    }
  }

  public getProviderName(): string {
    return 'OpenAIWhisper';
  }

  async transcribe(
    audioBuffer: Buffer,
    originalFileName: string,
    options: ISttOptions
  ): Promise<ITranscriptionResult> {
    if (!this.openai) {
        throw new Error('OpenAIWhisperProvider is not initialized due to missing API key.');
    }
    try {
      const audioStream = Readable.from(audioBuffer);
      const fileNameForApi = originalFileName.includes('.') ? originalFileName : `${originalFileName}.mp3`;

      const transcriptionParams: OpenAI.Audio.Transcriptions.TranscriptionCreateParams = {
        file: {
          name: fileNameForApi,
          [Symbol.toStringTag]: 'File',
          // @ts-ignore SDK might expect a proper File object
          [Symbol.asyncIterator]: () => audioStream[Symbol.asyncIterator](),
        } as unknown as File,
        model: (options.model as OpenAI.Audio.Transcriptions.TranscriptionCreateParams['model']) || 'whisper-1',
        language: options.language,
        prompt: options.phrases?.join(', '),
        response_format: 'verbose_json', 
        temperature: options.temperature,
        // timestamp_granularities: options.enableSpeakerDiarization ? ['segment', 'word'] : ['segment'] // Example if needed
      };
      
      // Corrected Type: Use TranscriptionVerbose as suggested by TS error
      const response: OpenAI.Audio.Transcriptions.TranscriptionVerbose = 
        await this.openai.audio.transcriptions.create(transcriptionParams) as OpenAI.Audio.Transcriptions.TranscriptionVerbose;

      const durationSeconds = response.duration;
      const cost = AudioCostUtils.calculateWhisperCost(durationSeconds);

      // The OpenAI.Audio.Transcriptions.TranscriptionSegment type might not have 'speaker'.
      // We adapt based on what 'verbose_json' actually returns.
      // If 'speaker' is part of the API response for segments (even if not in SDK type), handle it.
      const segments: ITranscriptionSegment[] | undefined = response.segments?.map(
        (s: any) => { // Use 'any' for s if SDK type is too restrictive and API returns more
          const segment: ITranscriptionSegment = {
            text: s.text,
            startTime: s.start,
            endTime: s.end,
            confidence: s.avg_logprob, // This is avg_logprob, not direct confidence
          };
          // Check if 'speaker' property exists on the segment from the API response
          if (s.hasOwnProperty('speaker')) {
            segment.speaker = s.speaker?.toString();
          }
          return segment;
        }
      );

      return {
        text: response.text,
        language: response.language,
        durationSeconds: durationSeconds,
        segments: segments,
        cost,
        providerResponse: response,
        isFinal: true,
      };
    } catch (error: any) {
      console.error(`${this.getProviderName()}: Transcription error - ${error.message}`, error.response?.data || error);
      let clientMessage = `Failed to transcribe audio with ${this.getProviderName()}.`;
      let clientCode = `${this.getProviderName().toUpperCase()}_TRANSCRIPTION_FAILED`;

      if (error.response) {
        clientMessage = error.response.data?.error?.message || clientMessage;
        if (error.response.status === 401) clientCode = 'API_KEY_INVALID';
        if (error.response.status === 429) clientCode = 'QUOTA_EXCEEDED';
        if (error.response.status === 400 && clientMessage.includes('format')) {
            clientCode = 'UNSUPPORTED_FORMAT';
        }
      } else if (error.message?.includes('Unsupported audio format')) {
        clientCode = 'UNSUPPORTED_FORMAT';
      }
      
      const customError = new Error(clientMessage);
      (customError as any).code = clientCode;
      (customError as any).originalError = error;
      (customError as any).status = error.response?.status || 500;
      throw customError;
    }
  }
}

// --- TTS Provider Implementation (OpenAI TTS) ---
class OpenAiTtsProvider implements ITtsProvider {
  private openai: OpenAI | null = null;
  private llmConfigService: LlmConfigService;

  constructor(llmConfigServiceInstance: LlmConfigService) {
    this.llmConfigService = llmConfigServiceInstance;
    const openAIConfig = this.llmConfigService.getProviderConfig(LlmProviderId.OPENAI);

    if (openAIConfig?.apiKey) {
      this.openai = new OpenAI({ apiKey: openAIConfig.apiKey });
    } else {
      console.error('OpenAiTtsProvider: OpenAI API key is not configured. TTS will not function.');
    }
  }

  public getProviderName(): string {
    return 'OpenAITTS';
  }

  async synthesize(text: string, options: ITtsOptions): Promise<ITtsResult> {
    if (!this.openai) {
        throw new Error('OpenAiTtsProvider is not initialized due to missing API key.');
    }
    try {
      const model = (options.model || 'tts-1') as 'tts-1' | 'tts-1-hd';
      const voice = (options.voice || 'alloy') as 'alloy'|'echo'|'fable'|'onyx'|'nova'|'shimmer';
      const outputFormat = (options.outputFormat || 'mp3') as 'mp3'|'opus'|'aac'|'flac';

      const ttsParams: OpenAI.Audio.Speech.SpeechCreateParams = {
        model: model,
        input: text,
        voice: voice,
        response_format: outputFormat,
        speed: options.speakingRate,
      };

      const response = await this.openai.audio.speech.create(ttsParams);
      
      const audioBuffer = Buffer.from(await response.arrayBuffer());
      const cost = AudioCostUtils.calculateOpenAiTtsCost(text, model);

      let mimeType = 'audio/mpeg';
      if (outputFormat === 'opus') mimeType = 'audio/opus';
      else if (outputFormat === 'aac') mimeType = 'audio/aac';
      else if (outputFormat === 'flac') mimeType = 'audio/flac';
      
      return {
        audioBuffer,
        mimeType,
        cost,
        providerResponse: { status: 'success', model, voice, format: outputFormat },
        voiceUsed: voice,
      };

    } catch (error: any) {
      console.error(`${this.getProviderName()}: TTS synthesis error - ${error.message}`, error.response?.data || error);
      let clientMessage = `Failed to synthesize speech with ${this.getProviderName()}.`;
      let clientCode = `${this.getProviderName().toUpperCase()}_TTS_FAILED`;

      if (error.response) {
        clientMessage = error.response.data?.error?.message || clientMessage;
        if (error.response.status === 401) clientCode = 'API_KEY_INVALID';
        if (error.response.status === 429) clientCode = 'QUOTA_EXCEEDED';
        if (error.response.status === 400) clientCode = 'BAD_REQUEST';
      }
      
      const customError = new Error(clientMessage);
      (customError as any).code = clientCode;
      (customError as any).originalError = error;
      (customError as any).status = error.response?.status || 500;
      throw customError;
    }
  }

  async listVoices(): Promise<IAvailableVoice[]> {
    const voices = [
      { id: 'alloy', name: 'Alloy', provider: this.getProviderName() },
      { id: 'echo', name: 'Echo', provider: this.getProviderName() },
      { id: 'fable', name: 'Fable', provider: this.getProviderName() },
      { id: 'onyx', name: 'Onyx', provider: this.getProviderName() },
      { id: 'nova', name: 'Nova', provider: this.getProviderName() },
      { id: 'shimmer', name: 'Shimmer', provider: this.getProviderName() },
    ];
    return Promise.resolve(voices);
  }
}

// --- Audio Service ---

class AudioService {
  private sttProvider: ISttProvider;
  private ttsProvider: ITtsProvider;
  private llmConfigService: LlmConfigService;

  constructor() {
    this.llmConfigService = new LlmConfigService();
    this.sttProvider = new OpenAIWhisperProvider(this.llmConfigService);
    this.ttsProvider = new OpenAiTtsProvider(this.llmConfigService);
    console.log(`AudioService initialized with STT: ${this.sttProvider.getProviderName()} and TTS: ${this.ttsProvider.getProviderName()}`);
  }

  async transcribe(
    audioBuffer: Buffer,
    originalFileName: string,
    options: ISttOptions,
    userId: string
  ): Promise<ITranscriptionResult> {
    if (audioBuffer.length > AudioCostUtils.MAX_FILE_SIZE_BYTES) {
        const err = new Error(
            `Audio file size (${(audioBuffer.length / (1024*1024)).toFixed(1)}MB) exceeds maximum of ${AudioCostUtils.MAX_FILE_SIZE_BYTES / (1024*1024)}MB.`
        );
        (err as any).code = 'FILE_TOO_LARGE';
        (err as any).status = 413;
        throw err;
    }
    
    const result = await this.sttProvider.transcribe(audioBuffer, originalFileName, options);
    
    CostService.trackCost(
      userId,
      'stt',
      result.cost,
      `${this.sttProvider.getProviderName()}${options.model ? `/${options.model}` : ''}`,
      result.durationSeconds, 
      result.text.length 
    );
    
    return result;
  }

  async synthesizeSpeech(
    text: string,
    options: ITtsOptions,
    userId: string
  ): Promise<ITtsResult> {
    const result = await this.ttsProvider.synthesize(text, options);

    CostService.trackCost(
      userId,
      'tts',
      result.cost,
      `${this.ttsProvider.getProviderName()}${options.model ? `/${options.model}` : ''}`,
      text.length, 
      result.durationSeconds || (result.audioBuffer.length / 16000 / 2) 
    );

    return result;
  }

  async analyzeAudioForCost(audioBuffer: Buffer): Promise<IAudioAnalysisResult> {
    const fileSizeBytes = audioBuffer.length;
    let estimatedDurationSeconds: number | undefined;
    let estimatedCostUSD = 0;
    let isOptimal = true;
    const recommendations: string[] = [];

    estimatedDurationSeconds = fileSizeBytes / (16 * 1024); 
    estimatedCostUSD = AudioCostUtils.calculateWhisperCost(estimatedDurationSeconds);

    if (fileSizeBytes > AudioCostUtils.MAX_FILE_SIZE_BYTES) {
      isOptimal = false;
      recommendations.push(
        `File size (${(fileSizeBytes / (1024*1024)).toFixed(1)}MB) exceeds recommended maximum of ${AudioCostUtils.MAX_FILE_SIZE_BYTES / (1024*1024)}MB. Consider compressing or shortening.`
      );
    }

    return {
      fileSizeBytes,
      estimatedDurationSeconds,
      estimatedCostUSD,
      isOptimal,
      recommendations,
    };
  }

  public setSttProvider(provider: ISttProvider): void {
    this.sttProvider = provider;
    console.log(`AudioService STT provider updated to: ${provider.getProviderName()}`);
  }

  public setTtsProvider(provider: ITtsProvider): void {
    this.ttsProvider = provider;
    console.log(`AudioService TTS provider updated to: ${provider.getProviderName()}`);
  }

  public async listAvailableTtsVoices(): Promise<IAvailableVoice[]> {
    if (this.ttsProvider.listVoices) {
      return this.ttsProvider.listVoices();
    }
    console.warn(`AudioService: Current TTS provider ${this.ttsProvider.getProviderName()} does not support listing voices.`);
    return Promise.resolve([]);
  }
}

export const audioService = new AudioService();
