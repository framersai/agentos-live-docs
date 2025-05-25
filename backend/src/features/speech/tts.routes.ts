// File: backend/src/features/speech/tts.routes.ts

/**
 * @file Text-to-Speech (TTS) API route handlers.
 * @version 1.1.0 - Corrected Promise<void> return types for route handlers.
 * @description Handles requests to the /api/tts endpoint for synthesizing speech from text
 * using the configured TTS provider (e.g., OpenAI TTS via AudioService).
 */

import { Request, Response } from 'express';
import { audioService } from '../../core/audio/audio.service';
import { ITtsOptions, ITtsResult, IAvailableVoice } from '../../core/audio/tts.interfaces';
import { CostService } from '../../core/cost/cost.service';
import dotenv from 'dotenv';

dotenv.config();

interface ITtsRequestBody {
  text: string;
  voice?: string;
  model?: string;
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string;
  speakingRate?: number;
  languageCode?: string;
  userId?: string;
}

/**
 * Handles POST requests to /api/tts for speech synthesis.
 * Expects a JSON body with 'text' and optional TTS configuration.
 *
 * @async
 * @param {Request} req - The Express request object, expecting ITtsRequestBody in req.body.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the request is handled.
 */
export async function POST(req: Request, res: Response): Promise<void> {
  const {
    text,
    voice,
    model,
    outputFormat,
    speakingRate,
    languageCode,
  }: ITtsRequestBody = req.body;

  const userId = (req as any).user?.id || req.body.userId || 'default_user_tts';

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ message: 'Text to synthesize is required.', error: 'MISSING_TEXT' });
    return; // Exit after sending response
  }

  if (text.length > 4096) { // OpenAI TTS character limit
    res.status(400).json({ message: 'Text input is too long. Maximum 4096 characters.', error: 'TEXT_TOO_LONG' });
    return; // Exit after sending response
  }

  try {
    const COST_THRESHOLD_USD_PER_SESSION_STRING = process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00';
    const effectiveCostThreshold = parseFloat(COST_THRESHOLD_USD_PER_SESSION_STRING);
    const disableCostCheck = process.env.DISABLE_COST_LIMIT === 'true';

    if (!disableCostCheck && CostService.isSessionCostThresholdReached(userId, effectiveCostThreshold)) {
      const currentCostDetail = CostService.getSessionCost(userId);
      res.status(403).json({
        message: 'Session cost threshold reached for TTS. Synthesis blocked.',
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCostDetail.totalCost,
        threshold: effectiveCostThreshold,
      });
      return; // Exit after sending response
    }

    const ttsOptions: ITtsOptions = {
      voice: voice,
      model: model,
      outputFormat: outputFormat || 'mp3',
      speakingRate: speakingRate,
      languageCode: languageCode,
    };

    console.log(`TTS Routes: Request for user ${userId} with text: "${text.substring(0, 30)}...", options:`, ttsOptions);

    const ttsResult: ITtsResult = await audioService.synthesizeSpeech(
      text,
      ttsOptions,
      userId
    );
    
    const providerNameForResult = ttsResult.providerName || audioService['ttsProvider']?.getProviderName() || 'UnknownProvider';
    console.log(`TTS Routes: Successfully synthesized audio for user ${userId}. Cost: $${ttsResult.cost.toFixed(6)}, Format: ${ttsResult.mimeType}, Provider: ${providerNameForResult}`);

    res.setHeader('Content-Type', ttsResult.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="speech.${ttsOptions.outputFormat || 'mp3'}"`);
    res.setHeader('X-TTS-Cost', ttsResult.cost.toFixed(6));
    res.setHeader('X-TTS-Voice', ttsResult.voiceUsed || 'default');
    if (ttsResult.durationSeconds) {
      res.setHeader('X-TTS-Duration-Seconds', ttsResult.durationSeconds.toString());
    }
    
    res.status(200).send(ttsResult.audioBuffer);
    // No explicit return after res.send()

  } catch (ttsError: any) {
    console.error(`TTS Routes: TTS synthesis error for user ${userId}:`, ttsError.message, ttsError.originalError || ttsError);
    // Ensure response is sent only once
    if (res.headersSent) {
      return;
    }
    let errorMessage = 'Error synthesizing speech.';
    let errorCode = 'TTS_SYNTHESIS_ERROR';
    let statusCode = ttsError.status || 500;

    if (ttsError.message?.includes('API key')) {
      errorMessage = 'TTS service API key not configured properly or is invalid.';
      errorCode = 'API_KEY_ERROR';
      statusCode = 503;
    } else if (ttsError.code === 'INVALID_TTS_PARAMS' || ttsError.message?.includes('model_not_found') || ttsError.message?.includes('Invalid voice')) {
      errorMessage = `Invalid TTS model or voice specified: ${ttsError.message}`;
      errorCode = 'INVALID_TTS_PARAMS';
      statusCode = 400;
    } else if (ttsError.code === 'QUOTA_EXCEEDED' || ttsError.message?.includes('insufficient_quota')) {
        errorMessage = 'TTS service quota exceeded.';
        errorCode = 'QUOTA_EXCEEDED';
        statusCode = 429;
    } else if (ttsError.code === 'TEXT_TOO_LONG') {
        errorMessage = ttsError.message;
        errorCode = ttsError.code;
        statusCode = 400;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? {
        originalMessage: ttsError.message,
      } : undefined,
    });
  }
}

/**
 * Handles GET requests to /api/tts/voices to list available TTS voices.
 *
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export async function GET(req: Request, res: Response): Promise<void> {
    try {
        const voices: IAvailableVoice[] = await audioService.listAvailableTtsVoices();
        res.status(200).json({
            message: "Available TTS voices fetched successfully.",
            voices: voices,
        });
    } catch (error: any) {
        console.error("TTS Routes: Error fetching available voices:", error);
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
