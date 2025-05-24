// File: backend/api/personaRoutes.ts
/**
 * @fileoverview Persona routes with constructor argument fix
 * FIXES: Fix authenticateToken constructor call with correct arguments
 */

import { Router, Response } from 'express';
import { IAgentOS } from '../agentos/api/interfaces/IAgentOS';
import { IAuthService } from '../services/user_auth/IAuthService';
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode } from '../utils/errors';

/**
 * Creates and configures the Express router for persona-related operations.
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
  // FIXED: Use authenticateToken with proper arguments (authService, true for optional)
  router.get('/', authenticateToken(authService, true), async (req: AuthenticatedRequest, res: Response) => {
    // `authenticateToken` with `optionalAuth = true` will set `req.user` if a valid token is present,
    // but will proceed even if no token or an invalid token is provided.
    const userId = req.user?.userId; // Will be undefined for guests or if token was invalid

    try {
      console.log(`PersonaRoutes: / GET request. Authenticated UserID: ${userId || 'Guest'}`);
      const personas = await agentOS.listAvailablePersonas(userId);
      return res.status(200).json(personas);
    } catch (error: any) {
      console.error(`PersonaRoutes: Error listing personas (User: ${userId || 'Guest'}):`, error);
      const errCode = error instanceof GMIError ? error.code : GMIErrorCode.INTERNAL_SERVER_ERROR;
      return res.status(error.statusCode || 500).json({
        error: {
          code: errCode,
          message: error.message || 'Failed to retrieve personas.',
          details: error.details,
          timestamp: new Date().toISOString(),
        }
      });
    }
  });

  /**
   * @route GET /personas/:personaId
   * @description Retrieves detailed information about a specific persona.
   * @access Public / Optionally Authenticated
   * @param {string} personaId - The ID of the persona to retrieve
   * @returns {Partial<IPersonaDefinition>} The persona definition
   * @throws {404} If persona not found or not accessible
   * @throws {500/503} For server-side errors
   */
  router.get('/:personaId', authenticateToken(authService, true), async (req: AuthenticatedRequest, res: Response) => {
    const { personaId } = req.params;
    const userId = req.user?.userId;

    try {
      console.log(`PersonaRoutes: /:personaId GET request for persona ${personaId}. Authenticated UserID: ${userId || 'Guest'}`);
      
      // Get all available personas for the user
      const personas = await agentOS.listAvailablePersonas(userId);
      
      // Find the requested persona
      const persona = personas.find(p => p.id === personaId);
      
      if (!persona) {
        return res.status(404).json({
          error: {
            code: GMIErrorCode.RESOURCE_NOT_FOUND,
            message: `Persona '${personaId}' not found or not accessible.`,
            timestamp: new Date().toISOString(),
          }
        });
      }

      return res.status(200).json(persona);
    } catch (error: any) {
      console.error(`PersonaRoutes: Error retrieving persona ${personaId} (User: ${userId || 'Guest'}):`, error);
      const errCode = error instanceof GMIError ? error.code : GMIErrorCode.INTERNAL_SERVER_ERROR;
      return res.status(error.statusCode || 500).json({
        error: {
          code: errCode,
          message: error.message || `Failed to retrieve persona '${personaId}'.`,
          details: error.details,
          timestamp: new Date().toISOString(),
        }
      });
    }
  });

  // Future: Add routes for user-specific persona management if applicable.
  // router.post('/', authenticateToken(authService), async (req, res) => { ... }); // Create custom persona
  // router.put('/:personaId', authenticateToken(authService), async (req, res) => { ... }); // Update persona
  // router.delete('/:personaId', authenticateToken(authService), async (req, res) => { ... }); // Delete persona

  return router;
};