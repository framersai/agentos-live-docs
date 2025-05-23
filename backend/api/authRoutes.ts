// backend/api/authRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { AuthService, IAuthService, RegistrationData, LoginData } from '../services/user_auth/AuthService';
import { SubscriptionService, ISubscriptionService } from '../services/user_auth/SubscriptionService';

/**
 * @fileoverview Defines Express routes for user authentication and authorization.
 * @module agentos/api/authRoutes
 */

// This middleware would be more complex, checking actual JWT validity
// For MVP, it uses the mock AuthService.validateToken
const authenticateTokenMiddleware = (authService: IAuthService) =>
    async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const user = await authService.validateToken(token);
        if (!user) {
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
        }
        (req as any).user = user; // Attach user to request object
        next();
    } catch (error: any) {
        console.error("Token validation error:", error);
        return res.status(500).json({ message: 'Internal server error during token validation.' });
    }
};


export const createAuthRoutes = (authService: IAuthService, subscriptionService: ISubscriptionService): Router => {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const registrationData: RegistrationData = req.body;
      if (!registrationData.email || !registrationData.passwordPlainText) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const result = await authService.register(registrationData);
      // In a real app, set cookie or return token securely
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      if (error.message.includes('already exists')) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Registration failed due to an internal error.' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const loginData: LoginData = req.body;
      if (!loginData.email || !loginData.passwordPlainText) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const result = await authService.login(loginData);
      // In a real app, set cookie or return token securely
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Login error:", error.message);
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Login failed due to an internal error.' });
    }
  });

  // Protected route example
  router.get('/me', authenticateTokenMiddleware(authService), async (req: Request, res: Response) => {
    // (req as any).user is populated by the middleware
    const user = (req as any).user;
    const tier = await subscriptionService.getUserTier(user.id);
    return res.status(200).json({ user, tier });
  });

  // Endpoint to (conceptually) upgrade tier - in real app, this follows payment etc.
  router.post('/me/upgrade-tier', authenticateTokenMiddleware(authService), async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { newTierId } = req.body;

    if (!newTierId || typeof newTierId !== 'string') {
        return res.status(400).json({message: "newTierId is required and must be a string."});
    }

    try {
        const updatedUser = await subscriptionService.updateUserTier(user.id, newTierId);
        const newTier = await subscriptionService.getUserTier(updatedUser.id);
        return res.status(200).json({ message: 'Subscription tier updated successfully.', user: updatedUser, tier: newTier});
    } catch (error: any) {
        console.error(`Error upgrading tier for user ${user.id}:`, error);
        if (error.message.includes('not found')) {
            return res.status(404).json({message: error.message});
        }
        return res.status(500).json({message: 'Failed to upgrade subscription tier.'});
    }
  });


  return router;
};