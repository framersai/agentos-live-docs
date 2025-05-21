import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Simple login endpoint
export async function POST(req: Request, res: Response) {
  const { password, rememberMe = false } = req.body;
  const correctPassword = process.env.PASSWORD;
  
  if (!correctPassword) {
    return res.status(500).json({ message: 'Server configuration error: No password set' });
  }
  
  if (password === correctPassword) {
    // Set cookie for better persistence
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    
    res.cookie('auth', correctPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge,
      sameSite: 'strict'
    });
    
    return res.status(200).json({ 
      message: 'Authentication successful',
      token: correctPassword, // Still provide token for local storage if needed
      rememberMe
    });
  }
  
  return res.status(401).json({ message: 'Authentication failed: Invalid password' });
}