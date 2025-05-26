// File: backend/src/features/speech/tts.routes.ts
/**
 * @file Text-to-Speech (TTS) API route handlers.
 * @version 1.2.2 - Aligned with updated ITtsOptions from tts.interfaces.ts.
 * @description Handles requests to the /api/tts endpoint for synthesizing speech from text
 * using the configured TTS provider (e.g., OpenAI TTS via AudioService).
 */

import { Request, Response } from 'express';
import { audioService } from '../../core/audio/audio.service';
// ITtsOptions now expected to have providerId and stricter outputFormat from tts.interfaces.ts
import { ITtsOptions, ITtsResult, IAvailableVoice } from '../../core/audio/tts.interfaces';
import { CostService } from '../../core/cost/cost.service';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import type { SpeechCreateParams } from 'openai/resources/audio/speech';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

/**
 * @interface ITtsRequestBody
 * @description Defines the expected structure of the request body for TTS synthesis.
 * 'outputFormat' uses OpenAI's specific types for type safety when constructing ITtsOptions.
 */
interface ITtsRequestBody {
  text: string;
  voice?: string;
  model?: string;
  outputFormat?: SpeechCreateParams['response_format']; // Align with strict type
  speakingRate?: number;
  languageCode?: string;
  userId?: string;
  providerId?: string;
}

/**
 * Handles POST requests to /api/tts for speech synthesis.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export async function POST(req: Request, res: Response): Promise<void> {
  const body: ITtsRequestBody = req.body;
  const {
    text,
    voice,
    model,
    outputFormat, // Now correctly typed via ITtsRequestBody
    speakingRate,
    languageCode,
    providerId,
  } = body;

  // @ts-ignore - req.user is custom property set by auth middleware
  const userId = req.user?.id || body.userId || 'default_user_tts';

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ message: 'Text for speech synthesis is required.', error: 'MISSING_TEXT_INPUT' });
    return;
  }

  const effectiveProviderId = providerId || process.env.DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER || 'openai_tts';
  if (effectiveProviderId === 'openai_tts' && text.length > 4096) {
    res.status(400).json({ message: 'Text input is too long for OpenAI TTS. Maximum 4096 characters.', error: 'TEXT_TOO_LONG' });
    return;
  }

  try {
    const costThresholdString = process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00';
    const effectiveCostThreshold = parseFloat(costThresholdString);
    const disableCostLimits = process.env.DISABLE_COST_LIMITS === 'true';

    if (!disableCostLimits && CostService.isSessionCostThresholdReached(userId, effectiveCostThreshold)) {
      const currentCostDetail = CostService.getSessionCost(userId);
      res.status(403).json({
        message: `Session cost threshold of $${effectiveCostThreshold.toFixed(2)} reached. TTS synthesis blocked.`,
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCostDetail.totalCost,
        threshold: effectiveCostThreshold,
      });
      return;
    }

    // This ttsServiceOptions object will be passed to audioService.synthesizeSpeech
    // Its type ITtsOptions comes from tts.interfaces.ts.
    // If tts.interfaces.ts has been updated as suggested, this will be type-correct.
    const ttsServiceOptions: ITtsOptions = {
      voice: voice,
      model: model || process.env.OPENAI_TTS_DEFAULT_MODEL,
      outputFormat: outputFormat || 'mp3', // 'mp3' is a valid SpeechCreateParams['response_format']
      speakingRate: speakingRate,
      languageCode: languageCode,
      providerId: effectiveProviderId, // This key must exist in ITtsOptions from tts.interfaces.ts
    };

    if (ttsServiceOptions.providerId === 'openai_tts' && !ttsServiceOptions.voice) {
        ttsServiceOptions.voice = process.env.OPENAI_TTS_DEFAULT_VOICE || 'alloy';
    }

    console.log(`TTS Routes: Request for user ${userId}. Provider: ${ttsServiceOptions.providerId}. Text: "${text.substring(0, 50)}...". Options:`, { ...ttsServiceOptions });

    // audioService.synthesizeSpeech expects ITtsOptions from tts.interfaces.ts
    const ttsResult: ITtsResult = await audioService.synthesizeSpeech(
      text,
      ttsServiceOptions,
      userId
    );
    
    const providerNameForResult = ttsResult.providerName || ttsServiceOptions.providerId || 'UnknownProvider';
    console.log(`TTS Routes: Synthesized audio for user ${userId}. Cost: $${ttsResult.cost.toFixed(6)}, Format: ${ttsResult.mimeType}, Provider: ${providerNameForResult}, Voice: ${ttsResult.voiceUsed}`);

    res.setHeader('Content-Type', ttsResult.mimeType);
    const actualOutputFormat = ttsResult.mimeType.split('/')[1] || ttsServiceOptions.outputFormat || 'mp3';
    res.setHeader('Content-Disposition', `inline; filename="speech.${actualOutputFormat}"`);
    res.setHeader('X-TTS-Cost', ttsResult.cost.toFixed(6));
    res.setHeader('X-TTS-Voice', ttsResult.voiceUsed || 'default');
    res.setHeader('X-TTS-Provider', providerNameForResult);
    if (ttsResult.durationSeconds) {
      res.setHeader('X-TTS-Duration-Seconds', ttsResult.durationSeconds.toString());
    }
    
    res.status(200).send(ttsResult.audioBuffer);

  } catch (ttsError: any) {
    console.error(`TTS Routes: TTS synthesis error for user ${userId}:`, ttsError.message, ttsError.originalError || ttsError.stack);
    if (res.headersSent) {
      return;
    }
    // ... (error handling remains the same) ...
    let errorMessage = 'Error synthesizing speech.';
    let errorCode = 'TTS_SYNTHESIS_ERROR';
    let statusCode = ttsError.status || 500;

    if (ttsError.message?.includes('API key') || ttsError.message?.includes('authentication')) {
      errorMessage = 'TTS service API key not configured properly, is invalid, or authentication failed.';
      errorCode = 'TTS_API_AUTH_ERROR';
      statusCode = 503;
    } else if (ttsError.message?.includes('model_not_found') || ttsError.message?.includes('Invalid voice')) {
      errorMessage = `Invalid TTS model or voice specified: ${ttsError.message}`;
      errorCode = 'INVALID_TTS_PARAMS';
      statusCode = 400;
    } else if (ttsError.message?.includes('insufficient_quota') || ttsError.message?.includes('limit reached')) {
        errorMessage = 'TTS service quota exceeded or rate limit reached.';
        errorCode = 'TTS_QUOTA_OR_RATE_LIMIT_EXCEEDED';
        statusCode = 429; 
    } else if (ttsError.message?.includes('Text input is too long')) {
        errorMessage = ttsError.message;
        errorCode = 'TEXT_TOO_LONG';
        statusCode = 400;
    } else if (ttsError.message?.includes("Browser TTS cannot be directly used by the backend")) {
        errorMessage = "The selected TTS provider (Browser TTS) cannot be used by the backend. Please choose a different provider.";
        errorCode = "INVALID_TTS_PROVIDER_FOR_BACKEND";
        statusCode = 400;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? {
        originalError: ttsError.message,
      } : undefined,
    });
  }
}

/**
 * Handles GET requests to /api/tts/voices to list available TTS voices.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export async function GET(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore - req.user is custom property set by auth middleware
        const userId = req.user?.id || 'public_user_tts_voices';
        const providerFilter = req.query.providerId as string | undefined;

        // Assuming audioService.listAvailableTtsVoices is the correct method name matching ITtsProvider
        const voices: IAvailableVoice[] = await audioService.listAvailableTtsVoices(providerFilter);
        
        console.log(`TTS Routes: User ${userId} requested available voices. Provider filter: ${providerFilter || 'all'}. Found: ${voices.length}`);
        
        res.status(200).json({
            message: "Available TTS voices fetched successfully.",
            voices: voices,
            count: voices.length,
        });
    } catch (error: any) {
        console.error("TTS Routes: Error fetching available voices:", error.message, error.stack);
        if (res.headersSent) {
         return;
        }
        res.status(500).json({
            message: "Failed to fetch available TTS voices.",
            error: "VOICE_LISTING_ERROR",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}