// File: backend/api/personaRoutes.ts
/**
 * @fileoverview Defines Express routes for interacting with AgentOS personas.
 * This includes listing available personas, potentially filtered by user entitlements.
 *
 * @module backend/api/personaRoutes
 */

import { Router, Response } from 'express';
import { IAgentOS } from './interfaces/IAgentOS';
import { IAuthService } from '../services/user_auth/IAuthService';
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode } from '../utils/errors';

/**
 * Creates and configures the Express router for persona-related operations.
 *
 * @param {IAgentOS} agentOS - The main AgentOS service facade instance.
 * @param {IAuthService} authService - The authentication service instance for optional authentication.
 * @returns {Router} The configured Express router.
 */
export const createPersonaRoutes = (agentOS: IAgentOS, authService: IAuthService): Router => {
  const router = Router();

  /**
   * @route GET /personas
   * @description Retrieves a list of available personas.
   * If the user is authenticated, the list may be filtered based on their entitlements.
   * If unauthenticated (guest), only publicly available personas are returned.
   * @access Public / Optionally Authenticated
   * @returns {Partial<IPersonaDefinition>[]} An array of persona definition summaries.
   * @throws {500/503} For server-side errors or if AgentOS service is unavailable.
   */
  router.get('/', authenticateToken(authService, true), async (req: AuthenticatedRequest, res: Response) => {
    // `authenticateToken` with `optionalAuth = true` will set `req.user` if a valid token is present,
    // but will proceed even if no token or an invalid token is provided.
    const userId = req.user?.userId; // Will be undefined for guests or if token was invalid

    try {
      console.log(`PersonaRoutes: / GET request. Authenticated UserID: ${userId || 'Guest'}`);
      const personas = await agentOS.listAvailablePersonas(userId);
      res.status(200).json(personas);
    } catch (error: any) {
      console.error(`PersonaRoutes: Error listing personas (User: ${userId || 'Guest'}):`, error);
      const errCode = error instanceof GMIError ? error.code : GMIErrorCode.INTERNAL_SERVER_ERROR;
      res.status(error.statusCode || 500).json({
        error: {
          code: errCode,
          message: error.message || 'Failed to retrieve personas.',
          details: error.details,
          timestamp: new Date().toISOString(),
        }
      });
    }
  });

  // Future: Add routes for getting specific persona details (e.g., GET /personas/:personaId)
  // or for user-specific persona management if applicable.

  return router;
};