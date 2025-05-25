// File: backend/src/features/speech/stt.routes.ts
/**
 * @file Speech-to-Text (STT) API route handlers.
 * @version 1.0.2 - Corrected exported function names for router consistency and updated file filter message.
 * @description Handles requests to the /api/stt endpoint for transcribing audio to text
 * using the configured STT provider via AudioService.
 */


/**
 * Represents the result of a speech transcription.
 * This was defined in a previous response and is reiterated here for clarity.
 */
export interface ITranscriptionResult {
  /** The transcribed text. */
  text: string;
  /** Optional: The confidence score of the transcription (0.0 to 1.0). */
  confidence?: number;
  /** Optional: The language detected or used for transcription (e.g., "en-US"). */
  language?: string;
  /** Optional: Duration of the processed audio segment in seconds. */
  durationSeconds?: number;
  /** Cost associated with this transcription. */
  cost: number;
  /** Original provider response for debugging or extended information. */
  providerResponse?: unknown;
  /** Usage details if provided by the STT service. */
  usage?: {
    durationMinutes: number;
    costPerMinute?: number; // Optional, as not all services might expose this directly
    totalCost?: number; // May differ from `cost` if there are other factors
    [key: string]: any; // Allow other usage details
  };
}

/**
 * Options for an STT request.
 * This was defined in a previous response and is reiterated here for clarity.
 */
export interface ISttRequestOptions {
  language?: string; // BCP-47 language tag
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  model?: string; // e.g., 'whisper-1'
  temperature?: number; // For Whisper
}

/**
 * Represents the analysis of an audio file before transcription,
 * often for cost estimation or pre-processing checks.
 */
export interface IAudioAnalysis {
  /** Duration of the audio in seconds. */
  duration: number;
  /** Size of the audio file in bytes. */
  fileSize: number;
  /** Estimated cost for transcribing this audio. */
  estimatedCost: number;
  /** Indicates if the audio file is considered optimal for processing (e.g., format, size). */
  isOptimal: boolean;
  /** Any recommendations for optimizing the audio before transcription. */
  recommendations: string[];
  /** MIME type of the audio. */
  mimeType?: string;
}

/**
 * Interface for an Audio Service that handles both STT and potentially TTS.
 * For this STT route, we are focusing on the STT-related methods.
 */
export interface IAudioService {
  /**
   * Transcribes an audio file using the configured STT provider.
   *
   * @param audioBuffer The raw audio data.
   * @param originalFileName The name of the file, used to infer format or for logging.
   * @param options Options for the STT request.
   * @param userId The ID of the user making the request, for cost tracking.
   * @returns A Promise resolving to the transcription result.
   */
  transcribeAudio(
    audioBuffer: Buffer,
    originalFileName: string,
    options: ISttRequestOptions,
    userId: string,
  ): Promise<ITranscriptionResult>;

  /**
   * Analyzes an audio file for properties like duration and estimated cost.
   *
   * @param audioBuffer The raw audio data.
   * @returns A Promise resolving to the audio analysis.
   */
  analyzeAudio(audioBuffer: Buffer): Promise<IAudioAnalysis>;

  /**
   * Retrieves statistics related to speech processing, such as pricing and supported formats.
   * @param userId The ID of the user, if stats are user-specific.
   * @returns A Promise resolving to an object containing speech statistics.
   */
  getSpeechProcessingStats(userId?: string): Promise<object>; // Define a more specific interface later
}

import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
// import { audioService } from '../../core/audio/audio.service'; // Actual service import
import { CostService, ISessionCostDetail } from '../../core/cost/cost.service';
import dotenv from 'dotenv';

dotenv.config();

// --- Constants for Whisper Pricing (should ideally come from a config or the audio service itself) ---
const WHISPER_COST_PER_MINUTE = parseFloat(process.env.WHISPER_API_COST_PER_MINUTE || "0.006");
const WHISPER_MINIMUM_BILLABLE_DURATION_SECONDS = 0.6; // OpenAI bills per minute, rounded up to the nearest second. Minimum effectively 1 sec.

/**
 * Calculates the cost for Whisper transcription.
 * @param durationSeconds - The duration of the audio in seconds.
 * @returns The calculated cost in USD.
 */
function calculateWhisperCostLocal(durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    // OpenAI bills per minute, rounding up to the nearest second for duration.
    // Effectively, any audio up to 1 minute is billed as 1 minute if we consider their $0.006/min model.
    // However, the API itself might bill more granularly based on actual processed seconds.
    // For a simple model: billable_seconds = max(duration_seconds, min_billable_seconds)
    // billable_minutes = billable_seconds / 60
    // cost = billable_minutes * cost_per_minute
    const billableSeconds = Math.max(durationSeconds, WHISPER_MINIMUM_BILLABLE_DURATION_SECONDS);
    const durationMinutes = billableSeconds / 60;
    return durationMinutes * WHISPER_COST_PER_MINUTE;
}

// Placeholder for audioService until its actual implementation is provided/created
const audioService: IAudioService = {
  transcribeAudio: async (audioBuffer, originalFileName, options, userId): Promise<ITranscriptionResult> => {
    console.warn(`[Placeholder STT Service] Transcribing audio for ${userId}: ${originalFileName} with options:`, options, `Buffer size: ${audioBuffer.length}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate duration based on buffer size (very rough)
    // Assuming 16kHz, 16-bit mono audio (2 bytes per sample)
    const bytesPerSecond = 16000 * 2;
    const estimatedDurationSeconds = audioBuffer.length / bytesPerSecond;

    const cost = calculateWhisperCostLocal(estimatedDurationSeconds);
    CostService.trackCost(userId, 'stt', cost, options?.model || 'whisper-1', audioBuffer.length, undefined, { durationSeconds: estimatedDurationSeconds });

    return {
      text: `[Placeholder] Transcription of ${originalFileName}`,
      confidence: 0.95,
      language: options?.language || 'en-US',
      durationSeconds: estimatedDurationSeconds,
      cost: cost,
      usage: {
          durationMinutes: estimatedDurationSeconds / 60,
          totalCost: cost,
      },
      providerResponse: { "status": "placeholder_success" },
    };
  },
  analyzeAudio: async (audioBuffer): Promise<IAudioAnalysis> => {
    console.warn(`[Placeholder STT Service] Analyzing audio buffer size: ${audioBuffer.length}`);
    const bytesPerSecond = 16000 * 2;
    const duration = audioBuffer.length / bytesPerSecond;
    const estimatedCost = calculateWhisperCostLocal(duration);
    return {
      duration: duration,
      fileSize: audioBuffer.length,
      estimatedCost: estimatedCost,
      isOptimal: true,
      recommendations: [],
      mimeType: 'audio/webm', // Placeholder
    };
  },
  getSpeechProcessingStats: async (userId?: string): Promise<object> => {
    console.warn(`[Placeholder STT Service] Getting speech processing stats for user ${userId}`);
    return {
        message: 'Speech processing statistics (placeholder)',
        userId,
        whisperPricing: {
            costPerMinute: WHISPER_COST_PER_MINUTE,
            maxFileSizeMB: 25,
            minAudioDurationSeconds: 0.1,
        },
        supportedFormats: ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/flac', 'audio/ogg'],
        limits: { maxFileSize: '25MB', maxDuration: 'Approx 2 hours (varies)', minDuration: '0.1 seconds' },
    };
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/mp4',
      'audio/m4a', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/opus',
      'application/octet-stream', // Allow octet-stream and rely on extension check
    ];
    const allowedExtensions = /\.(webm|mp3|mp4|m4a|wav|flac|ogg|opus)$/i;
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      console.warn(`STT Routes: Rejected file type: ${file.mimetype}, original name: ${file.originalname}`);
      // FIX: Updated the error message to be more comprehensive
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', `Invalid file type. Supported audio formats include WebM, MP3, MP4, M4A, WAV, FLAC, OGG, Opus. Received: ${file.mimetype}`));
    }
  },
});

// FIX: Renamed from POST_transcribe to POST
export async function POST(req: Request, res: Response): Promise<void> {
  upload.single('audio')(req, res, async (uploadError: any) => {
    if (uploadError) {
      console.error('STT Routes: File upload error:', uploadError.message);
      if (uploadError instanceof MulterError) {
        let friendlyMessage = 'File upload error.';
        if (uploadError.code === 'LIMIT_FILE_SIZE') friendlyMessage = 'Audio file too large. Maximum size is 25MB.';
        else if (uploadError.code === 'LIMIT_FILE_COUNT') friendlyMessage = 'Too many files. Please upload one audio file at a time.';
        else if (uploadError.code === 'LIMIT_UNEXPECTED_FILE') friendlyMessage = uploadError.message; // This will now use the more detailed message from fileFilter

        res.status(400).json({ message: friendlyMessage, error: uploadError.code || 'UPLOAD_ERROR' });
        return;
      }
      res.status(500).json({ message: 'An unexpected error occurred during file upload.', error: 'UPLOAD_PROCESSING_ERROR' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No audio file provided.', error: 'NO_FILE_UPLOADED' });
      return;
    }

    const userId = (req as any).user?.id || req.body.userId || 'default_user_stt';

    try {
      const COST_THRESHOLD_USD_PER_SESSION_STRING = process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00';
      const effectiveCostThreshold = parseFloat(COST_THRESHOLD_USD_PER_SESSION_STRING);
      const disableCostCheck = process.env.DISABLE_COST_LIMIT === 'true';

      if (!disableCostCheck && CostService.isSessionCostThresholdReached(userId, effectiveCostThreshold)) {
        const currentCostDetail: ISessionCostDetail = CostService.getSessionCost(userId);
        res.status(403).json({
          message: 'Session cost threshold reached for STT. Transcription blocked.',
          error: 'COST_THRESHOLD_EXCEEDED',
          currentCost: currentCostDetail.totalCost,
          threshold: effectiveCostThreshold,
        });
        return;
      }

      const audioAnalysis: IAudioAnalysis = await audioService.analyzeAudio(req.file.buffer);
      console.log(`STT Routes: Audio analysis for user ${userId} - Duration: ~${audioAnalysis.duration.toFixed(1)}s, Estimated cost: $${audioAnalysis.estimatedCost.toFixed(6)}`);
      if (audioAnalysis.recommendations.length > 0) {
        console.log('STT Routes: Audio recommendations:', audioAnalysis.recommendations);
      }

      const { language, prompt, model, responseFormat } : ISttRequestOptions = req.body;
      const sttOptions: ISttRequestOptions = { language, prompt, model, responseFormat };

      const transcriptionResult: ITranscriptionResult = await audioService.transcribeAudio(
        req.file.buffer,
        req.file.originalname,
        sttOptions,
        userId,
      );

      const sessionCostDetails: ISessionCostDetail = CostService.getSessionCost(userId);

      res.status(200).json({
        message: 'Audio transcribed successfully.',
        transcription: transcriptionResult.text,
        durationSeconds: transcriptionResult.durationSeconds,
        cost: transcriptionResult.cost,
        sessionCost: sessionCostDetails.totalCost,
        usage: transcriptionResult.usage,
        analysis: {
          fileSize: audioAnalysis.fileSize,
          isOptimal: audioAnalysis.isOptimal,
          recommendations: audioAnalysis.recommendations,
        },
        metadata: {
          originalFilename: req.file.originalname,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error: any) {
      console.error(`STT Routes: Transcription error for user ${userId}:`, error.message, error.originalError || error);
      let errorMessage = 'Error transcribing audio.';
      let errorCode = 'TRANSCRIPTION_ERROR';
      let statusCode = error.status || 500;

      if (error.message?.includes('API key')) {
        errorMessage = 'STT service API key not configured properly or is invalid.';
        errorCode = 'API_KEY_ERROR';
        statusCode = 503;
      } else if (error.message?.includes('Unsupported audio format') || error.message?.includes('Invalid file type')) {
        errorMessage = error.message; // Use the more specific message from Multer or service
        errorCode = 'UNSUPPORTED_FORMAT';
        statusCode = 400;
      } else if (error.message?.includes('Audio too short')) {
        errorMessage = error.message;
        errorCode = 'AUDIO_TOO_SHORT';
        statusCode = 400;
      } else if (error.message?.includes('Rate limit') || error.status === 429) {
        errorMessage = 'STT service rate limit exceeded. Please try again later.';
        errorCode = 'RATE_LIMIT_EXCEEDED';
        statusCode = 429;
      } else if (error.message?.includes('quota') || error.message?.includes('insufficient_quota')) {
        errorMessage = 'STT service quota exceeded. Please check your OpenAI account.';
        errorCode = 'QUOTA_EXCEEDED';
        statusCode = 429;
      }

      res.status(statusCode).json({
        message: errorMessage,
        error: errorCode,
        details: process.env.NODE_ENV === 'development' ? { originalMessage: error.message } : undefined,
      });
    }
  });
}

// FIX: Renamed from GET_stats to GET
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id || req.query.userId as string || 'default_user_stt_stats';
    const stats = await audioService.getSpeechProcessingStats(userId);
    const currentSessionCostDetails: ISessionCostDetail = CostService.getSessionCost(userId);
    const costThreshold = parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00');

    res.status(200).json({
      ...stats,
      currentSessionCost: currentSessionCostDetails.totalCost,
      sessionCostThreshold: costThreshold,
    });
  } catch (error: any) {
    console.error('STT Routes: Error retrieving speech statistics:', error);
    res.status(500).json({
      message: 'Error retrieving speech statistics.',
      error: 'STATS_RETRIEVAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}