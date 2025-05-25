// File: backend/api/visionRoutes.ts
/**
 * @file visionRoutes.ts
 * @module backend/api/visionRoutes
 * @version 1.0.0
 * @description Defines HTTP API routes for the AgentOS Vision Subsystem.
 * This module provides endpoints for:
 * - Processing incoming visual frames (e.g., from a webcam) with real-time event streaming.
 * - Requesting explicit, on-demand analysis of specific images.
 * - Managing the "is watching" state for visual streams.
 * - Retrieving visual environment profiles.
 * - Triggering recalibration of the visual environment.
 * - Health checks for the vision subsystem.
 *
 * It integrates with `IVisionProcessorService` for core logic and uses
 * standard authentication, validation, rate limiting, and error handling patterns.
 *
 * @requires express
 * @requires express-validator
 * @requires express-rate-limit
 * @requires ../agentos/core/vision/processing/IVisionProcessorService
 * @requires ../services/user_auth/IAuthService
 * @requires ../middleware/jwtAuthMiddleware
 * @requires ../agentos/core/vision/types/VisionInput
 * @requires ../agentos/core/vision/types/VisionOutput
 * @requires ../agentos/core/vision/errors/VisionError
 * @requires ../utils/errors
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult, ValidationChain } from 'express-validator';
import rateLimit from 'express-rate-limit';

import { IAuthService } from '../services/user_auth/IAuthService';
import { createJwtAuthMiddleware, AuthenticatedRequest } from '../middleware/jwtAuthMiddleware';
import {
  IVisionProcessorService,
  VisionProcessingOutput,
  VisionProcessingEventType,
  FrameProcessingErrorEvent,
} from '../agentos/core/vision/processing/IVisionProcessorService';
import { VisionInputEnvelope, VisionInputData } from '../agentos/core/vision/types/VisionInput';
import { VisionTask, ProcessedVisionData } from '../agentos/core/vision/types/VisionOutput';
import { VisualEnvironmentProfile } from '../agentos/core/vision/types/VisualEnvironment';
import { VisionError, VisionErrorCode } from '../agentos/core/vision/errors/VisionError';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors'; // For consistency and base error structure
import { v4 as uuidv4 } from 'uuid';


// Assuming these interfaces are defined in a shared types file or copied from agentosRoutes.ts
// For brevity, I'll assume they are available. If not, they should be defined/imported.
interface VisionApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

interface VisionApiSuccessResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  requestId?: string;
}

/**
 * Centralized validation error handler for vision routes.
 */
const handleVisionValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().reduce((acc: Record<string, string>, error: any) => {
      const field = error.path || error.param || 'unknown_field';
      acc[field] = error.msg;
      return acc;
    }, {});

    const errorResponse: VisionApiErrorResponse = {
      error: {
        code: VisionErrorCode.INPUT_VALIDATION_FAILED,
        message: 'Request validation failed. Please check your input data for the vision endpoint.',
        details: { validationErrors, providedInput: { body: req.body, query: req.query, params: req.params } },
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || `val-${Date.now()}`,
      },
    };
    return res.status(400).json(errorResponse);
  }
  next();
};

/**
 * Rate limiting configurations for Vision Subsystem endpoints.
 */
const visionApiRateLimits = {
  /** Rate limiting for frame processing, which can be frequent. */
  frameProcessing: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // Max 120 frames per minute (avg 2 FPS). Adjust based on expected client behavior & server capacity.
    message: {
      error: {
        code: VisionErrorCode.RESOURCE_LIMIT_EXCEEDED, // Specific vision error code
        message: 'Frame processing rate limit exceeded. Please reduce frame submission frequency.',
        details: { limit: 120, window: '1 minute' },
        timestamp: new Date().toISOString(),
      },
    } as VisionApiErrorResponse,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => (req as AuthenticatedRequest).user?.userId || req.ip,
    handler: (req, res, _next, options) => {
      console.warn(`Rate limit exceeded for vision frame processing: User/IP ${(req as AuthenticatedRequest).user?.userId || req.ip}`);
      const errorResponse = options.message as VisionApiErrorResponse;
      errorResponse.error.requestId = res.locals.requestId || req.headers['x-request-id'] as string || `rl-${Date.now()}`;
      errorResponse.error.timestamp = new Date().toISOString();
      res.status(options.statusCode).json(errorResponse);
    }
  }),
  /** Rate limiting for explicit, potentially heavier analysis tasks. */
  explicitAnalysis: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // Max 30 explicit analyses per 5 minutes
    message: {
      error: {
        code: VisionErrorCode.RESOURCE_LIMIT_EXCEEDED,
        message: 'Explicit vision analysis rate limit exceeded. Please wait before requesting more analyses.',
        details: { limit: 30, window: '5 minutes' },
        timestamp: new Date().toISOString(),
      },
    } as VisionApiErrorResponse,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => (req as AuthenticatedRequest).user?.userId || req.ip,
    handler: (req, res, _next, options) => {
        console.warn(`Rate limit exceeded for explicit vision analysis: User/IP ${(req as AuthenticatedRequest).user?.userId || req.ip}`);
        const errorResponse = options.message as VisionApiErrorResponse;
        errorResponse.error.requestId = res.locals.requestId || req.headers['x-request-id'] as string || `rl-${Date.now()}`;
        errorResponse.error.timestamp = new Date().toISOString();
        res.status(options.statusCode).json(errorResponse);
    }
  }),
  /** General rate limiting for management endpoints (watching state, profile). */
  management: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
    message: {
      error: {
        code: VisionErrorCode.RESOURCE_LIMIT_EXCEEDED,
        message: 'Too many vision management requests.',
        details: { limit: 60, window: '1 minute' },
        timestamp: new Date().toISOString(),
      },
    } as VisionApiErrorResponse,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => (req as AuthenticatedRequest).user?.userId || req.ip,
    handler: (req, res, _next, options) => {
        console.warn(`Rate limit exceeded for vision management: User/IP ${(req as AuthenticatedRequest).user?.userId || req.ip}`);
        const errorResponse = options.message as VisionApiErrorResponse;
        errorResponse.error.requestId = res.locals.requestId || req.headers['x-request-id'] as string || `rl-${Date.now()}`;
        errorResponse.error.timestamp = new Date().toISOString();
        res.status(options.statusCode).json(errorResponse);
    }
  }),
};

/**
 * Validation rules for `VisionInputEnvelope` structure.
 * @constant {ValidationChain[]} visionInputEnvelopeValidation
 */
const visionInputEnvelopeValidation: ValidationChain[] = [
  body('frameData').isObject().withMessage('frameData object is required.'),
  body('frameData.type').isIn(['image_url', 'base64']).withMessage('frameData.type must be "image_url" or "base64".'),
  body('frameData.data').isString().notEmpty().withMessage('frameData.data string is required.')
    .isLength({ max: 15 * 1024 * 1024 }).withMessage('frameData.data exceeds maximum allowed size (15MB).'), // Generous limit for base64
  body('frameData.mimeType').optional().isString().isMimeType().withMessage('Invalid frameData.mimeType.'),

  body('metadata').isObject().withMessage('metadata object is required.'),
  body('metadata.timestamp').isNumeric().withMessage('metadata.timestamp (Unix epoch ms) is required.'),
  body('metadata.streamId').optional().isString().isLength({ min: 1, max: 128 }).withMessage('metadata.streamId is invalid.'),
  body('metadata.frameId').optional().isString().isLength({ min: 1, max: 128 }).withMessage('metadata.frameId is invalid.'),
  body('metadata.resolution.width').optional().isInt({min: 1}).withMessage('metadata.resolution.width must be a positive integer.'),
  body('metadata.resolution.height').optional().isInt({min: 1}).withMessage('metadata.resolution.height must be a positive integer.'),

  body('correlationId').optional().isString().isLength({ min: 1, max: 128 }).withMessage('correlationId is invalid.'),
];

/**
 * Validation rules for the explicit analysis request.
 * @constant {ValidationChain[]} explicitAnalysisValidation
 */
const explicitAnalysisValidation: ValidationChain[] = [
  ...visionInputEnvelopeValidation, // Re-use envelope validation
  body('tasksToPerform')
    .isArray({ min: 1 }).withMessage('tasksToPerform must be a non-empty array.')
    .custom((tasks: VisionTask[]) => tasks.every(task => Object.values(VisionTask).includes(task)))
    .withMessage(`Invalid task specified in tasksToPerform. Valid tasks are: ${Object.values(VisionTask).join(', ')}.`),
  body('preferredModelId').optional().isString().isLength({ min: 1, max: 100 }).withMessage('preferredModelId is invalid.'),
];


/**
 * Creates and configures Express routes for the Vision Subsystem.
 *
 * @function createVisionRoutes
 * @param {IVisionProcessorService} visionProcessorService - An initialized instance of the vision processing service.
 * @param {IAuthService} authService - An initialized instance of the authentication service.
 * @param {object} [options] - Optional configuration for the routes.
 * @param {boolean} [options.logActivity=false] - Enable detailed logging for vision routes.
 * @returns {Router} A fully configured Express router for vision endpoints.
 */
export function createVisionRoutes(
  visionProcessorService: IVisionProcessorService,
  authService: IAuthService,
  options?: { logActivity?: boolean }
): Router {
  if (!visionProcessorService || typeof visionProcessorService.processVisualInput !== 'function') {
    throw new Error('A valid IVisionProcessorService instance is required to create vision routes.');
  }
  if (!authService || typeof authService.verifyToken !== 'function') {
    throw new Error('A valid IAuthService instance is required for vision route authentication.');
  }

  const router = express.Router();
  const requireAuth = createJwtAuthMiddleware(authService);
  const logActivity = options?.logActivity ?? false;

  // Middleware to add requestId to res.locals for consistent logging
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.requestId = req.headers['x-request-id'] as string || `vis-${Date.now()}-${uuidv4().substring(0,8)}`;
    next();
  });


  /**
   * @route POST /api/v1/vision/process-frame
   * @description Submits a visual frame for processing. If the service is "watching" the associated
   * stream and detects a significant change, it performs analysis and streams back events/results via SSE.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.frameProcessing
   * @validation Validates `VisionInputEnvelope`.
   * @requestBody {VisionInputEnvelope} The visual frame and its metadata.
   * @response {stream} `text/event-stream` yielding `VisionProcessingOutput` events.
   */
  router.post('/process-frame',
    requireAuth,
    visionApiRateLimits.frameProcessing,
    visionInputEnvelopeValidation,
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
      const { requestId } = res.locals;
      const envelope = req.body as VisionInputEnvelope; // Already validated

      try {
        const userId = req.user!.userId;
        if (logActivity) console.log(`[VisionRoutes][${requestId}] POST /process-frame - User: ${userId}, Stream: ${envelope.metadata.streamId}, Frame: ${envelope.metadata.frameId}`);

        // SSE Setup
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        const sendSse = (id: string, event: string, data: object) => {
            if (res.writableEnded) return;
            try {
                res.write(`id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            } catch (e) {
                console.error(`[VisionRoutes][${requestId}] Error writing to SSE stream (process-frame):`, e);
                if (!res.writableEnded) res.end();
            }
        };

        sendSse(Date.now().toString(), 'connection', { message: 'Vision processing stream connected.', requestId, timestamp: new Date().toISOString() });

        const heartbeatInterval = setInterval(() => {
          if (res.writableEnded) { clearInterval(heartbeatInterval); return; }
          sendSse(Date.now().toString(), 'heartbeat', { timestamp: new Date().toISOString(), requestId });
        }, 25000);

        req.on('close', () => {
          if (logActivity) console.log(`[VisionRoutes][${requestId}] Client disconnected (SSE /process-frame). Stream: ${envelope.metadata.streamId}`);
          clearInterval(heartbeatInterval);
          if (!res.writableEnded) res.end();
        });

        let chunkCount = 0;
        try {
          for await (const outputEvent of visionProcessorService.processVisualInput(envelope)) {
            if (res.writableEnded) break;
            chunkCount++;
            sendSse(outputEvent.timestamp.toString(), outputEvent.type, { ...outputEvent, requestId, chunkIndex: chunkCount });

             if (outputEvent.type === VisionProcessingEventType.FRAME_PROCESSING_ERROR ||
                (outputEvent.type === VisionProcessingEventType.ANALYSIS_COMPLETED && (outputEvent as any).data?.errors?.length > 0)
            ) {
                if (logActivity) console.warn(`[VisionRoutes][${requestId}] Frame processing event contained error(s):`, outputEvent);
            }

            // Decide if stream should end based on event type.
            // e.g. for NO_SIGNIFICANT_CHANGE, PROCESSING_SKIPPED, we might end early.
            // Or if an error makes further processing for this frame impossible.
            if (outputEvent.type === VisionProcessingEventType.NO_SIGNIFICANT_CHANGE ||
                outputEvent.type === VisionProcessingEventType.PROCESSING_SKIPPED_NOT_WATCHING ||
                outputEvent.type === VisionProcessingEventType.PROCESSING_SKIPPED_RATE_LIMIT ||
                outputEvent.type === VisionProcessingEventType.FRAME_PROCESSING_ERROR ||
                outputEvent.type === VisionProcessingEventType.ANALYSIS_COMPLETED // Typically last event for a successful analysis
            ) {
                 if (logActivity) console.log(`[VisionRoutes][${requestId}] Terminal event for frame ${envelope.metadata.frameId}: ${outputEvent.type}. Ending this frame's SSE sequence.`);
                 break;
            }
          }
        } catch (processingError: any) {
            console.error(`[VisionRoutes][${requestId}] Error in visionProcessorService.processVisualInput stream for frame ${envelope.metadata.frameId}:`, processingError);
            const visionErr = VisionError.fromError(processingError, VisionErrorCode.PROCESSING_FAILED, "Vision processing stream failed internally");
            const errorEvent: FrameProcessingErrorEvent = {
                type: VisionProcessingEventType.FRAME_PROCESSING_ERROR, streamId: envelope.metadata.streamId, frameId: envelope.metadata.frameId,
                timestamp: Date.now(), correlationId: envelope.correlationId,
                error: { message: visionErr.message, code: visionErr.code, details: visionErr.details },
            };
            sendSse(Date.now().toString(), VisionProcessingEventType.FRAME_PROCESSING_ERROR, {...errorEvent, requestId, chunkIndex: ++chunkCount});
        }

        if (!res.writableEnded) {
            sendSse(Date.now().toString(), 'stream_end', { message: 'Vision frame processing sequence finished.', requestId, totalChunks: chunkCount, timestamp: new Date().toISOString() });
            res.end();
        }
        clearInterval(heartbeatInterval);

      } catch (error: unknown) { // Catch setup errors
        const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, 'Failed to initiate vision frame processing stream.');
        if (!res.headersSent) {
            return _next(visionError);
        } else if (!res.writableEnded) {
            console.error(`[VisionRoutes][${requestId}] Critical setup error for /process-frame after headers sent:`, visionError);
            // Attempt to send error over SSE
            try {
                const errorEvent: FrameProcessingErrorEvent = {
                    type: VisionProcessingEventType.FRAME_PROCESSING_ERROR, streamId: envelope.metadata.streamId, frameId: envelope.metadata.frameId,
                    timestamp: Date.now(), correlationId: envelope.correlationId,
                    error: { message: visionError.message, code: visionError.code, details: visionError.details },
                };
                res.write(`id: ${Date.now()}\nevent: ${VisionProcessingEventType.FRAME_PROCESSING_ERROR}\ndata: ${JSON.stringify({...errorEvent, requestId})}\n\n`);
            } catch (sseError) {
                console.error(`[VisionRoutes][${requestId}] Failed to send setup error via SSE (process-frame):`, sseError);
            }
            res.end();
        }
      }
    }
  );

  /**
   * @route POST /api/v1/vision/analyze-explicitly
   * @description Requests an explicit, on-demand analysis of a given image for specified tasks.
   * Bypasses "is watching" and differencing logic. Returns full ProcessedVisionData.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.explicitAnalysis
   * @validation Validates `VisionInputEnvelope` and `tasksToPerform`.
   * @requestBody Object { envelope: VisionInputEnvelope, tasksToPerform: VisionTask[], preferredModelId?: string }
   * @response {VisionApiSuccessResponse<ProcessedVisionData>} The analysis results.
   */
  router.post('/analyze-explicitly',
    requireAuth,
    visionApiRateLimits.explicitAnalysis,
    [ // Custom validation for the specific structure of this endpoint
        body('envelope').isObject().withMessage('Field "envelope" of type VisionInputEnvelope is required.'),
        ...visionInputEnvelopeValidation.map(validation => validation.customSanitizer((value, { path }) => path.startsWith('envelope.') ? value : undefined )), // Prefix paths for nested validation
        body('tasksToPerform')
            .isArray({ min: 1 }).withMessage('tasksToPerform must be a non-empty array.')
            .custom((tasks: any[]) => tasks.every(task => Object.values(VisionTask).includes(task as VisionTask)))
            .withMessage(`Invalid task in tasksToPerform. Valid tasks: ${Object.values(VisionTask).join(', ')}`),
        body('preferredModelId').optional().isString().isLength({ min: 1, max: 100 }).withMessage('preferredModelId is invalid.'),
    ],
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      const { requestId } = res.locals;
      try {
        const userId = req.user!.userId;
        const { envelope, tasksToPerform, preferredModelId } = req.body as {
            envelope: VisionInputEnvelope,
            tasksToPerform: VisionTask[],
            preferredModelId?: string
        };

        if (logActivity) console.log(`[VisionRoutes][${requestId}] POST /analyze-explicitly - User: ${userId}, Tasks: ${tasksToPerform.join(', ')}, Model: ${preferredModelId || 'default'}`);

        const processedData: ProcessedVisionData = await visionProcessorService.requestExplicitAnalysis(
          envelope,
          tasksToPerform,
          preferredModelId
        );

        const response: VisionApiSuccessResponse<ProcessedVisionData> = {
          success: true,
          message: 'Image analysis completed successfully.',
          data: processedData,
          timestamp: new Date().toISOString(),
          requestId,
        };
        res.status(200).json(response);

      } catch (error: unknown) {
        const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, 'Explicit image analysis failed.');
        // Augment error with request specific details before passing to global handler
        visionError.details = {...(visionError.details || {}), route: '/analyze-explicitly', tasks: req.body.tasksToPerform, requestId };
        next(visionError);
      }
    }
  );

  // =============================================================================
  // VISION STREAM MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * @route POST /api/v1/vision/stream/:streamId/watching
   * @description Sets the "is watching" state for a given visual stream.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.management
   * @param {string} streamId - Path parameter. The ID of the visual stream.
   * @requestBody {{ isWatching: boolean, profileIdToAssociate?: string }}
   * @response {VisionApiSuccessResponse} Confirmation message.
   */
  router.post('/stream/:streamId/watching',
    requireAuth,
    visionApiRateLimits.management,
    [
      param('streamId').isString().notEmpty().isLength({min:1, max:128}).withMessage('Valid streamId is required.'),
      body('isWatching').isBoolean().withMessage('isWatching (boolean) is required in the body.'),
      body('profileIdToAssociate').optional().isString().isLength({min:1, max:128}).withMessage('profileIdToAssociate is invalid.'),
    ],
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const { requestId } = res.locals;
        try {
            const userId = req.user!.userId; // For logging/audit, not typically for direct logic here
            const { streamId } = req.params;
            const { isWatching, profileIdToAssociate } = req.body;

            if (logActivity) console.log(`[VisionRoutes][${requestId}] POST /stream/${streamId}/watching - User: ${userId}, Set Watching: ${isWatching}, Profile: ${profileIdToAssociate || 'default'}`);
            await visionProcessorService.setStreamWatchingState(streamId, isWatching, profileIdToAssociate);

            const response: VisionApiSuccessResponse = {
                success: true,
                message: `Stream '${streamId}' watching state set to ${isWatching}.`,
                timestamp: new Date().toISOString(),
                requestId,
            };
            res.status(200).json(response);
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, 'Failed to set stream watching state.');
            visionError.details = {...(visionError.details || {}), route: `/stream/${req.params.streamId}/watching`, streamId: req.params.streamId, requestId };
            next(visionError);
        }
    }
);

  /**
   * @route GET /api/v1/vision/stream/:streamId/watching
   * @description Gets the current "is watching" state for a given visual stream.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.management
   * @param {string} streamId - Path parameter. The ID of the visual stream.
   * @response {VisionApiSuccessResponse<{ isWatching: boolean }>} The current watching state.
   */
  router.get('/stream/:streamId/watching',
    requireAuth,
    visionApiRateLimits.management,
    [param('streamId').isString().notEmpty().isLength({min:1, max:128}).withMessage('Valid streamId is required.')],
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const { requestId } = res.locals;
        try {
            const userId = req.user!.userId;
            const { streamId } = req.params;

            if (logActivity) console.log(`[VisionRoutes][${requestId}] GET /stream/${streamId}/watching - User: ${userId}`);
            const isWatching = await visionProcessorService.getStreamWatchingState(streamId);

            const response: VisionApiSuccessResponse<{ isWatching: boolean }> = {
                success: true,
                message: `Stream '${streamId}' watching state retrieved.`,
                data: { isWatching },
                timestamp: new Date().toISOString(),
                requestId,
            };
            res.status(200).json(response);
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, 'Failed to get stream watching state.');
            visionError.details = {...(visionError.details || {}), route: `/stream/${req.params.streamId}/watching`, streamId: req.params.streamId, requestId };
            next(visionError);
        }
    }
);

  /**
   * @route GET /api/v1/vision/stream/:streamId/profile
   * @description Retrieves the current VisualEnvironmentProfile for a stream.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.management
   * @param {string} streamId - Path parameter. The ID of the visual stream.
   * @response {VisionApiSuccessResponse<VisualEnvironmentProfile | undefined>} The profile.
   */
  router.get('/stream/:streamId/profile',
    requireAuth,
    visionApiRateLimits.management,
    [param('streamId').isString().notEmpty().isLength({min:1, max:128}).withMessage('Valid streamId is required.')],
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const { requestId } = res.locals;
        try {
            const userId = req.user!.userId;
            const { streamId } = req.params;
            if (logActivity) console.log(`[VisionRoutes][${requestId}] GET /stream/${streamId}/profile - User: ${userId}`);
            const profile = await visionProcessorService.getCurrentVisualProfile(streamId);
            if (!profile) {
                throw new VisionError(`No visual environment profile found for stream '${streamId}'. It might not be initialized or actively watched.`, VisionErrorCode.RESOURCE_NOT_FOUND, {streamId});
            }
            const response: VisionApiSuccessResponse<VisualEnvironmentProfile> = {
                success: true,
                message: `Visual environment profile for stream '${streamId}' retrieved.`,
                data: profile,
                timestamp: new Date().toISOString(),
                requestId,
            };
            res.status(200).json(response);
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.CALIBRATION_FAILED, 'Failed to get visual environment profile.');
            visionError.details = {...(visionError.details || {}), route: `/stream/${req.params.streamId}/profile`, streamId: req.params.streamId, requestId };
            next(visionError);
        }
    }
  );

  /**
   * @route POST /api/v1/vision/stream/:streamId/recalibrate
   * @description Manually triggers recalibration for a stream's visual environment profile.
   * @access Private (Requires Authentication)
   * @rateLimit visionApiRateLimits.management (stricter if this is heavy)
   * @param {string} streamId - Path parameter. The ID of the visual stream.
   * @response {VisionApiSuccessResponse<VisualEnvironmentProfile | undefined>} The updated profile.
   */
  router.post('/stream/:streamId/recalibrate',
    requireAuth,
    visionApiRateLimits.management, // Potentially a stricter limit
    [param('streamId').isString().notEmpty().isLength({min:1, max:128}).withMessage('Valid streamId is required.')],
    handleVisionValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const { requestId } = res.locals;
        try {
            const userId = req.user!.userId;
            const { streamId } = req.params;
            if (logActivity) console.log(`[VisionRoutes][${requestId}] POST /stream/${streamId}/recalibrate - User: ${userId}`);

            const updatedProfile = await visionProcessorService.triggerProfileRecalibration(streamId);
            if (!updatedProfile) {
                 throw new VisionError(`Recalibration for stream '${streamId}' did not result in a profile update or profile not found.`, VisionErrorCode.CALIBRATION_FAILED, {streamId});
            }
            const response: VisionApiSuccessResponse<VisualEnvironmentProfile> = {
                success: true,
                message: `Visual environment profile recalibration triggered and updated for stream '${streamId}'.`,
                data: updatedProfile,
                timestamp: new Date().toISOString(),
                requestId,
            };
            res.status(200).json(response);
        } catch (error) {
            const visionError = VisionError.fromError(error, VisionErrorCode.CALIBRATION_FAILED, 'Failed to trigger visual environment profile recalibration.');
            visionError.details = {...(visionError.details || {}), route: `/stream/${req.params.streamId}/recalibrate`, streamId: req.params.streamId, requestId };
            next(visionError);
        }
    }
);


  // =============================================================================
  // VISION SUBSYSTEM HEALTH CHECK
  // =============================================================================
  /**
   * @route GET /api/v1/vision/health
   * @description Public health check for the Vision Subsystem.
   * Can be expanded to check dependencies like providers.
   * @access Public
   */
  router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
    const { requestId } = res.locals;
    try {
      // For a more detailed health check, IVisionProcessorService could expose a checkHealth method
      // that internally checks its dependencies (cache, calibrator, provider manager).
      // const healthStatus = await visionProcessorService.checkHealth();
      // For now, a simple operational check:
      if (!visionProcessorService || !visionProcessorService.isInitialized) {
        throw new VisionError('VisionProcessorService is not available or not initialized.', VisionErrorCode.CONFIGURATION_ERROR);
      }

      res.status(200).json({
        status: 'UP',
        message: 'AgentOS Vision Subsystem is operational.',
        serviceId: visionProcessorService.serviceId,
        timestamp: new Date().toISOString(),
        requestId,
      });
    } catch (error) {
        const visionError = VisionError.fromError(error, VisionErrorCode.PROCESSING_FAILED, 'Vision subsystem health check failed.');
        visionError.details = {...(visionError.details || {}), route: `/health`, requestId };
        // Pass to the main error handler for consistent formatting
        next(visionError);
    }
  });

  // Global Error Handler for Vision routes
  router.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const { requestId } = res.locals;
    
    if (logActivity || process.env.NODE_ENV === 'development') {
        console.error(`[VisionRoutes][ErrorHandler][${requestId}] Unhandled error for ${req.method} ${req.originalUrl}:`, {
            message: error.message,
            code: error.code,
            visionProviderId: (error as VisionError).visionProviderId,
            visionModelId: (error as VisionError).visionModelId,
            details: error.details,
            stack: process.env.NODE_ENV === 'development' ? error.stack : '[omitted_in_production]',
            userId: (req as AuthenticatedRequest).user?.userId,
        });
    }


    if (res.headersSent) {
      if (!res.writableEnded) {
        console.error(`[VisionRoutes][ErrorHandler][${requestId}] Headers already sent on error, attempting to end response for ${req.method} ${req.originalUrl}.`);
        res.end();
      }
      return next(error); // Delegate to Express default error handler
    }

    let statusCode = 500;
    let errorCode: string = GMIErrorCode.INTERNAL_SERVER_ERROR; // Default to GMI base error
    let message = 'An unexpected error occurred in the Vision Subsystem.';
    let details: any = error.details || { originalErrorName: error.name };

    if (error instanceof VisionError) {
      statusCode = error.recommendedHttpStatusCode || 500; // VisionError should have this from GMIError
      errorCode = error.code; // Use specific VisionErrorCode
      message = error.message;
    } else if (error instanceof GMIError) {
      statusCode = error.recommendedHttpStatusCode || 500;
      errorCode = error.code;
      message = error.message;
    } else if (error.status || error.statusCode) { // Generic Express errors
      statusCode = error.status || error.statusCode;
      message = error.message || message;
    }

    const errorResponse: VisionApiErrorResponse = {
      error: {
        code: errorCode,
        message,
        details: process.env.NODE_ENV !== 'production' ? details : undefined,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
    res.status(statusCode).json(errorResponse);
  });

  return router;
}