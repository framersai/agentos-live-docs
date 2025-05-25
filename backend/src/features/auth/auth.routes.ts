// File: backend/src/features/auth/auth.routes.ts
// Note: Moved from backend/routes/auth.ts

/**
 * @file Authentication API route handlers.
 * @description Handles user authentication, login, and status checks.
 * @version 1.0.3 - Corrected userId declaration order.
 */

import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env path from the project root
const __filename = fileURLToPath(import.meta.url); // backend/src/features/auth/auth.routes.ts
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..'); // up to project root
dotenv.config({ path: path.join(__projectRoot, '.env') });

/**
 * Handle POST /api/auth - User authentication (login)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const { password, rememberMe = false } = req.body;
    const correctPassword = process.env.PASSWORD;

    if (!correctPassword) {
      console.error('AuthRoutes: Server configuration error - PASSWORD not set in environment.');
      res.status(500).json({
        message: 'Server configuration error. Authentication is not properly configured.',
        error: 'AUTH_NOT_CONFIGURED'
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        message: 'Password is required for authentication.',
        error: 'MISSING_PASSWORD'
      });
      return;
    }

    if (password !== correctPassword) {
      console.warn(`AuthRoutes: Failed login attempt. IP: ${req.ip}`);
      res.status(401).json({
        message: 'Invalid password provided.',
        error: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Successful authentication
    // In a real app, this would come from a user database or be generated
    const userId = 'default_user'; // Declare userId BEFORE using it.
    // For a real application, generate a secure JWT token here.
    // Using the password itself as a token is highly insecure and only for basic demonstration.
    // Example of a more appropriate (but still simple) token:
    const token = Buffer.from(`${userId}:${correctPassword}`).toString('base64'); 

    if (rememberMe) {
      res.cookie('authToken', token, { // Changed cookie name to 'authToken' for clarity
        httpOnly: true, // Helps prevent XSS
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'lax', // Or 'strict' depending on needs
        // path: '/api', // Optional: scope cookie to API paths
      });
    }

    console.log(`AuthRoutes: Authentication successful for user: ${userId}`);
    res.status(200).json({
      message: 'Authentication successful.',
      token: token, // Send token in response body as well for API clients
      rememberMe: rememberMe,
      user: {
        id: userId,
        // Add other relevant non-sensitive user details here
      }
    });

  } catch (error: any) {
    console.error('AuthRoutes: Error in POST /api/auth endpoint:', error);
    if (res.headersSent) return; // Avoid sending multiple responses
    res.status(500).json({
      message: 'Internal server error during authentication.',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_AUTH_ERROR' : error.message
    });
  }
}

/**
 * Handle GET /api/auth - Check authentication status
 * This route relies on the authMiddleware to have run first.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    // If authMiddleware passed, (req as any).user should be set.
    const user = (req as any).user;

    if (user && user.id) {
      console.log(`AuthRoutes: Authentication status check for user: ${user.id} - Authenticated.`);
      res.status(200).json({
        authenticated: true,
        message: 'User is currently authenticated.',
        user: {
          id: user.id,
          // other user details if available from middleware/session
        }
      });
    } else {
      // This case should ideally not be reached if authMiddleware is effective for protected routes.
      // If /api/auth (this route itself) is not protected by authMiddleware, this path is possible.
      console.log(`AuthRoutes: Authentication status check - Not authenticated.`);
      res.status(401).json({
        authenticated: false,
        message: 'User is not authenticated.',
        error: 'NOT_AUTHENTICATED'
      });
    }
  } catch (error: any) {
    console.error('AuthRoutes: Error in GET /api/auth (status check):', error);
    if (res.headersSent) return;
    res.status(500).json({
      message: 'Error checking authentication status.',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_STATUS_CHECK_ERROR' : error.message
    });
  }
}

/**
 * Handle DELETE /api/auth - User logout
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export async function DELETE(req: Request, res: Response): Promise<void> {
    try {
        // Clear the authentication cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            // path: '/api', // Ensure path matches if set during login
        });

        // Optionally, invalidate server-side session if one exists

        console.log(`AuthRoutes: User logged out. IP: ${req.ip}`);
        res.status(200).json({ message: 'Logout successful.' });
    } catch (error: any) {
        console.error('AuthRoutes: Error in DELETE /api/auth (logout):', error);
        if (res.headersSent) return;
        res.status(500).json({
            message: 'Internal server error during logout.',
            error: process.env.NODE_ENV === 'production' ? 'INTERNAL_LOGOUT_ERROR' : error.message,
        });
    }
}
