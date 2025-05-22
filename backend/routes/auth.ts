// backend/routes/auth.ts
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Handle POST /api/auth - User authentication
 * @param req - Express request object
 * @param res - Express response object
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const { password, rememberMe = false } = req.body;
    const correctPassword = process.env.PASSWORD;

    if (!correctPassword) {
      console.error('Server configuration error: PASSWORD not set in environment');
      res.status(500).json({
        message: 'Server configuration error',
        error: 'AUTH_NOT_CONFIGURED'
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        message: 'Password is required',
        error: 'MISSING_PASSWORD'
      });
      return;
    }

    if (password !== correctPassword) {
      res.status(401).json({
        message: 'Invalid password',
        error: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Successful authentication
    const token = correctPassword; // Using password as token for simplicity
    
    // Set cookie if remember me is selected
    if (rememberMe) {
      res.cookie('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'strict'
      });
    }

    res.status(200).json({
      message: 'Authentication successful',
      token: token,
      rememberMe: rememberMe,
      user: {
        authenticated: true,
        id: 'default_user'
      }
    });

  } catch (error) {
    console.error('Auth endpoint error:', error);
    res.status(500).json({
      message: 'Internal server error during authentication',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_ERROR' : (error as Error).message
    });
  }
}

/**
 * Handle GET /api/auth - Check authentication status
 * @param req - Express request object  
 * @param res - Express response object
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    // If we reach here, the auth middleware has already validated the token
    const user = (req as any).user || { authenticated: true, id: 'default_user' };
    
    res.status(200).json({
      message: 'Authenticated',
      authenticated: true,
      user: user
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    res.status(500).json({
      message: 'Error checking authentication status',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_ERROR' : (error as Error).message
    });
  }
}