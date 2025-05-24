/**
 * @file backend/api/personaRoutes.ts
 * @module backend/api/personaRoutes
 * @version 1.2.1
 *
 * @description
 * This module defines the Express router for persona-related API endpoints.
 * It allows clients to list available AI personas and retrieve details for a specific persona.
 * Authentication is optional for these routes: if a user is authenticated, the list of personas
 * might be tailored to their entitlements; otherwise, a list of publicly available personas is returned.
 * This version corrects type imports and adapts to the currently defined IAgentOS interface.
 *
 * Key Dependencies:
 * - `express`: For router creation and request/response handling.
 * - `../agentos/api/interfaces/IAgentOS`: Interface for the AgentOS service.
 * - `../agentos/cognitive_substrate/personas/IPersonaDefinition.ts`: For `IPersonaDefinition` type.
 * - `../services/user_auth/IAuthService`: Interface for the Authentication Service.
 * - `../middleware/authenticateTokenMiddleware`: Provides the base `AuthenticatedRequest` type.
 * - `../utils/errors`: For standardized error handling (`GMIError`, `GMIErrorCode`, `ErrorFactory`).
 */

import { Router, Request, Response, NextFunction } from 'express';
import { IAgentOS } from '../agentos/api/interfaces/IAgentOS';
import { IPersonaDefinition } from '../agentos/cognitive_substrate/personas/IPersonaDefinition'; // Corrected: Direct import
import { IAuthService, AuthTokenPayload } from '../services/user_auth/IAuthService';
import { AuthenticatedRequest } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode, ErrorFactory } from '../utils/errors';

/**
 * Creates an optional authentication middleware.
 * If a valid token is provided in the 'Authorization' header (Bearer scheme), `req.user` is populated
 * with the `AuthTokenPayload`. If no token is provided, or if the token is invalid/expired,
 * the request proceeds as unauthenticated (i.e., `req.user` will be undefined).
 * This allows routes to behave differently for authenticated versus guest users.
 *
 * @function authenticateOptionally
 * @param {IAuthService} authService - An instance of the authentication service, used to validate tokens.
 * @returns {Function} An Express middleware function of the form `(req, res, next) => Promise<void>`.
 */
const authenticateOptionally = (authService: IAuthService) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    req.user = undefined; // Initialize to undefined

    if (token) {
      try {
        const userPayload: AuthTokenPayload | null = await authService.validateToken(token);
        if (userPayload) {
          req.user = userPayload;
        }
      } catch (error) {
        console.warn(`[PersonaRoutes OptionalAuth] Error during token validation: ${(error as Error).message}. Proceeding as guest.`);
      }
    }
    return next();
  };

/**
 * Creates and configures the Express router for persona-related operations.
 * It defines endpoints for listing available personas and fetching details of a specific persona.
 * These routes support optional authentication to tailor responses based on user status.
 *
 * @function createPersonaRoutes
 * @param {IAgentOS} agentOS - An instance of the AgentOS service, used for persona management.
 * @param {IAuthService} authService - An instance of the Authentication Service, used for optional authentication.
 * @returns {Router} The configured Express router for persona endpoints.
 */
export const createPersonaRoutes = (agentOS: IAgentOS, authService: IAuthService): Router => {
  const router = Router();

  /**
   * @route GET /api/v1/personas
   * @description Retrieves a list of available AI personas.
   * The list may be filtered based on user authentication and entitlements.
   * For unauthenticated users, only publicly accessible personas are typically returned.
   * The type `Partial<IPersonaDefinition>` is used as per `IAgentOS.listAvailablePersonas`.
   * @access Public / Optionally Authenticated
   * @middleware authenticateOptionally - Populates `req.user` with `AuthTokenPayload` if a valid token is provided.
   * @response {200} OK - Successfully retrieved personas. Returns an array of `Partial<IPersonaDefinition>` objects.
   * @response {500} Internal Server Error - If an unexpected error occurs while fetching personas.
   * @response {503} Service Unavailable - If the AgentOS service or its dependencies are not properly initialized or available.
   */
  router.get('/', authenticateOptionally(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    try {
      // console.log(`[PersonaRoutes] GET / - Request for available personas. UserID: ${userId || 'Guest'}`);
      const personas: Partial<IPersonaDefinition>[] = await agentOS.listAvailablePersonas(userId);
      return res.status(200).json(personas);
    } catch (error) {
      console.error(`[PersonaRoutes] GET / - Error listing personas for UserID: ${userId || 'Guest'}:`, error);
      return next(error instanceof GMIError ? error : ErrorFactory.internal('Failed to retrieve available personas.', error));
    }
  });

  /**
   * @route GET /api/v1/personas/:personaId
   * @description Retrieves detailed information about a specific AI persona by its ID.
   * Access to certain personas might be restricted based on user authentication and entitlements.
   * **Architectural Note:** Currently, this route fetches all accessible personas via `IAgentOS.listAvailablePersonas()`
   * and then filters by ID. This is due to the absence of a dedicated `getPersonaDetails(personaId, userId?)` method
   * on the `IAgentOS` interface. For improved performance and scalability, especially with a large number of personas,
   * it is **strongly recommended** to implement a direct `getPersonaDetails` method in `IAgentOS` and `AgentOS.ts`.
   * @access Public / Optionally Authenticated
   * @middleware authenticateOptionally - Populates `req.user` with `AuthTokenPayload` if a valid token is provided.
   * @param {string} req.params.personaId - The unique identifier (ID) of the persona to retrieve.
   * @response {200} OK - Successfully retrieved persona details. Returns a `Partial<IPersonaDefinition>` object (or `IPersonaDefinition` if a future `getPersonaDetails` method returns the full object).
   * @response {400} Bad Request - If `personaId` is missing or malformed.
   * @response {404} Not Found - If the persona with the given ID is not found or is not accessible.
   * @response {500} Internal Server Error - For other unexpected server issues.
   */
  router.get('/:personaId', authenticateOptionally(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId } = req.params;
    const userId = req.user?.userId;

    if (!personaId || typeof personaId !== 'string' || personaId.trim() === '') {
      return next(ErrorFactory.validation('A valid Persona ID path parameter is required.'));
    }

    try {
      // console.log(`[PersonaRoutes] GET /${personaId} - Request for persona details. UserID: ${userId || 'Guest'}`);
      // Current workaround: Fetch all and filter.
      const availablePersonas: Partial<IPersonaDefinition>[] = await agentOS.listAvailablePersonas(userId);
      const persona: Partial<IPersonaDefinition> | undefined = availablePersonas.find(p => p.id === personaId);

      if (!persona) {
        return next(ErrorFactory.notFound(
          `Persona with ID '${personaId}' not found or is not accessible.`,
          { personaIdAttempted: personaId, userId: userId || 'Guest' },
          GMIErrorCode.PERSONA_NOT_FOUND
        ));
      }
      // If `getPersonaDetails` were implemented and returned `IPersonaDefinition | null`,
      // this response would ideally be `IPersonaDefinition`.
      return res.status(200).json(persona);
    } catch (error) {
      console.error(`[PersonaRoutes] GET /${personaId} - Error retrieving persona for UserID: ${userId || 'Guest'}:`, error);
      return next(error instanceof GMIError ? error : ErrorFactory.internal(`Failed to retrieve details for persona '${personaId}'.`, error));
    }
  });

  return router;
};