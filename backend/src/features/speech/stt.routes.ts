// File: backend/src/features/speech/stt.routes.ts
/**
 * @file Speech-to-Text (STT) API Route Handlers
 * @version 1.0.1 - Added file type filtering and refined error handling.
 * @description Handles requests to the /api/stt endpoint for transcribing audio
 * using the configured STT provider (e.g., OpenAI Whisper via AudioService).
 * It uses multer for parsing multipart/form-data containing the audio file.
 * @dependencies express, multer, ../../core/audio/audio.service, ../../core/audio/stt.interfaces, ../../core/cost/cost.service, dotenv, path, url
 */

import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { audioService } from '../../core/audio/audio.service.js';
import { ISttRequestOptions, ISttOptions, ITranscriptionResult, SttResponseFormat } from '../../core/audio/stt.interfaces.js';
import { CostService } from '../../core/cost/cost.service.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../../'); // Adjusted path to project root
dotenv.config({ path: path.join(__projectRoot, '.env') });

// Configure multer for file uploads
// Store files in memory for processing.
const storage = multer.memoryStorage();
const MAX_FILE_SIZE_MB = 25; // OpenAI Whisper limit is 25MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    // Whisper supports: mp3, mp4, mpeg, mpga, m4a, wav, and webm.
    const allowedMimeTypes = [
      'audio/mpeg', // mp3, mpga
      'audio/mp4',  // mp4 (typically m4a audio is in mp4 container)
      'audio/x-m4a',// m4a
      'audio/wav',  // wav
      'audio/webm', // webm
      'audio/ogg',  // ogg (Opus in ogg is common)
      'video/mp4',  // mp4 video with audio track
      'video/webm'  // webm video with audio track
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn(`[stt.routes] Attempted upload of unsupported file type: ${file.mimetype} from user ${req.ip}`);
      cb(new Error(`Unsupported file type: ${file.mimetype}. Supported types include MP3, WAV, M4A, WebM.`));
    }
  },
});

/**
 * Validates and maps a client-provided responseFormat string to the SttResponseFormat type.
 * @param {string | undefined} formatString - The response format string from the client request.
 * @returns {SttResponseFormat | undefined} The validated SttResponseFormat, or undefined if invalid or not provided.
 */
function validateAndMapResponseFormat(formatString: string | undefined): SttResponseFormat | undefined {
  if (!formatString) return undefined; // Default to provider's choice if not specified
  const validFormats: ReadonlyArray<SttResponseFormat> = ['json', 'text', 'srt', 'verbose_json', 'vtt'];
  if (validFormats.includes(formatString as SttResponseFormat)) {
    return formatString as SttResponseFormat;
  }
  console.warn(`[stt.routes] Invalid responseFormat requested: "${formatString}". Provider will use its default or 'verbose_json'.`);
  return undefined; // Let the provider handle default if client sends invalid format
}


/**
 * @route POST /api/stt
 * @description Handles audio transcription requests.
 * Expects an 'audio' file in a multipart/form-data request.
 * Optional fields in the body: language, prompt, model, responseFormat, temperature.
 * @param {Request} req - Express request object, potentially augmented by auth middleware with `req.user`.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 * @throws Will send appropriate HTTP error responses for various failure conditions.
 */
export async function POST(req: Request, res: Response): Promise<void> {
  // @ts-ignore - req.user is a custom property potentially injected by authentication middleware
  const userId = req.user?.id || req.body.userId || `unauthenticated_user_${req.ip || 'unknown_ip'}`;

  // Wrap the multer call in a Promise to ensure the outer async function awaits its completion
  // and can explicitly return a Promise<void>.
  await new Promise<void>(resolve => {
    upload.single('audio')(req, res, async (err: any) => {
      if (err instanceof MulterError) {
        console.error(`[stt.routes] Multer error for user ${userId} (IP: ${req.ip}): ${err.message} (Code: ${err.code})`);
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(413).json({ message: `Audio file is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`, error: 'FILE_TOO_LARGE' });
        } else {
          res.status(400).json({ message: `File upload error: ${err.message}`, error: 'FILE_UPLOAD_ERROR' });
        }
        return resolve(); // Resolve the promise after sending response
      } else if (err) {
        console.error(`[stt.routes] Non-multer error during upload for user ${userId} (IP: ${req.ip}): ${err.message}`);
        // This 'err' might be from our custom fileFilter
        res.status(415).json({ message: err.message || 'Invalid audio file type.', error: 'INVALID_AUDIO_FILE_TYPE' });
        return resolve(); // Resolve the promise after sending response
      }

      if (!req.file) {
        console.warn(`[stt.routes] No audio file uploaded by user ${userId} (IP: ${req.ip})`);
        res.status(400).json({ message: 'No audio file was provided in the request.', error: 'NO_AUDIO_FILE' });
        return resolve(); // Resolve the promise after sending response
      }

      const audioBuffer: Buffer = req.file.buffer;
      const originalFileName: string = req.file.originalname || `audio-${Date.now()}.${req.file.mimetype.split('/')[1] || 'bin'}`;

      // Extract options from request body (multer puts non-file fields into req.body)
      const requestOptions: ISttRequestOptions = req.body;

      const costThresholdString = process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00';
      const effectiveCostThreshold = parseFloat(costThresholdString);
      const disableCostLimits = process.env.DISABLE_COST_LIMITS === 'true';

      if (!disableCostLimits) {
        const currentCost = CostService.getSessionCost(userId); // Assuming CostService can provide this
        if (currentCost.totalCost >= effectiveCostThreshold) {
          console.warn(`[stt.routes] STT request blocked for user ${userId}. Session cost threshold $${effectiveCostThreshold.toFixed(2)} reached (Current: $${currentCost.totalCost.toFixed(2)}).`);
          res.status(403).json({
            message: `Session cost threshold of $${effectiveCostThreshold.toFixed(2)} reached. STT transcription blocked.`,
            error: 'COST_THRESHOLD_EXCEEDED',
            currentCost: currentCost.totalCost,
            threshold: effectiveCostThreshold,
          });
          return resolve(); // Resolve the promise after sending response
        }
      }

      try {
        const sttServiceOptions: ISttOptions = {
          language: requestOptions.language,
          model: requestOptions.model, // audio.service will default if not provided
          prompt: requestOptions.prompt,
          responseFormat: validateAndMapResponseFormat(requestOptions.responseFormat),
          temperature: requestOptions.temperature !== undefined ? Number(requestOptions.temperature) : undefined,
          providerSpecificOptions: {
            mimeType: req.file.mimetype // Pass MIME type for better handling in audio.service
          }
        };

        console.log(`[stt.routes] User [${userId}] (IP: ${req.ip}) Requesting STT - Model: ${sttServiceOptions.model || 'default'}, Lang: ${sttServiceOptions.language || 'auto'}, Filename: ${originalFileName}, Size: ${(req.file.size / 1024).toFixed(2)}KB`);

        const transcriptionResult: ITranscriptionResult = await audioService.transcribeAudio(
          audioBuffer,
          originalFileName,
          sttServiceOptions,
          userId
        );

        const providerNameForResult = transcriptionResult.usage?.modelUsed || 'UnknownProvider'; // Prefer model if available
        console.log(`[stt.routes] User [${userId}] (IP: ${req.ip}) Audio transcribed. Cost: $${transcriptionResult.cost.toFixed(6)}, Duration: ${transcriptionResult.durationSeconds?.toFixed(2)}s, Provider/Model: ${providerNameForResult}`);

        res.status(200).json({
          transcription: transcriptionResult.text,
          durationSeconds: transcriptionResult.durationSeconds,
          cost: transcriptionResult.cost,
          language: transcriptionResult.language,
          segments: transcriptionResult.segments, // Pass segments if available
          message: 'Transcription successful.',
          metadata: { // Include some useful metadata
            modelUsed: transcriptionResult.usage?.modelUsed,
            detectedLanguage: transcriptionResult.language, // Explicitly state detected language
          }
        });

      } catch (sttError: any) {
        console.error(`[stt.routes] STT transcription error for user ${userId} (IP: ${req.ip}), File: ${originalFileName}: ${sttError.message}`, sttError.stack);
        if (res.headersSent) {
          return resolve(); // Resolve and exit if headers already sent
        }
        let errorMessage = 'Error transcribing audio.';
        let errorCode = 'STT_TRANSCRIPTION_ERROR';
        let statusCode = sttError.status || 500; // Use error status if available

        if (sttError.message?.includes('API key') || sttError.message?.includes('authentication')) {
          errorMessage = 'STT service API key issue or authentication failure. Please check server configuration.';
          errorCode = 'STT_API_AUTH_ERROR';
          statusCode = 503; // Service Unavailable (misconfiguration)
        } else if (sttError.message?.includes('insufficient_quota') || sttError.message?.includes('limit reached')) {
          errorMessage = 'STT service quota exceeded or rate limit reached.';
          errorCode = 'STT_QUOTA_OR_RATE_LIMIT_EXCEEDED';
          statusCode = 429; // Too Many Requests
        } else if (sttError.message?.includes('Unsupported file type') || sttError.message?.includes('Invalid audio file')) {
          errorMessage = sttError.message; // Use specific error from file filter or service
          errorCode = 'INVALID_AUDIO_FILE_FORMAT';
          statusCode = 415; // Unsupported Media Type
        } else if (sttError.message?.toLowerCase().includes('timeout')) {
          errorMessage = 'Transcription request timed out.';
          errorCode = 'STT_TIMEOUT';
          statusCode = 504; // Gateway Timeout
        }

        res.status(statusCode).json({
          message: errorMessage,
          error: errorCode,
          details: process.env.NODE_ENV === 'development' ? {
            originalErrorName: sttError.name,
            originalErrorMessage: sttError.message,
          } : undefined,
        });
      }
      resolve(); // Resolve the promise after the main logic or error handling
    });
  });
}



/**
 * @route GET /api/stt/stats
 * @description Retrieves statistics related to STT and TTS services from the backend.
 * This can include provider information, cost details, and default configurations.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    // @ts-ignore - req.user is a custom property
    const userId = req.user?.id || `public_user_stt_stats_${req.ip || 'unknown_ip'}`;
    const stats = await audioService.getSpeechProcessingStats(userId);
    const sessionCost = CostService.getSessionCost(userId);

    console.log(`[stt.routes] User ${userId} (IP: ${req.ip}) requested STT/TTS stats.`);

    res.status(200).json({
      ...stats, // Spread the stats from audioService
      currentSessionCost: sessionCost.totalCost, // Add current session cost
      sessionCostThreshold: parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'),
    });
  } catch (error: any) {
    console.error(`[stt.routes] Error fetching STT/TTS stats for user at IP ${req.ip}: ${error.message}`, error.stack);
    if (res.headersSent) {
      return;
    }
    res.status(500).json({
      message: "Failed to fetch speech processing statistics.",
      error: "STATS_FETCH_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}