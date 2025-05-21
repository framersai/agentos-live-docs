import { Request, Response } from 'express';
import multer from 'multer';
import { transcribeWithWhisper } from '../utils/audio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Handle audio transcription with Whisper
export async function POST(req: Request, res: Response) {
  try {
    // Use multer to handle the file upload
    upload.single('audio')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No audio file provided' });
      }
      
      try {
        // Transcribe the audio using Whisper
        const transcription = await transcribeWithWhisper(req.file.buffer);
        
        return res.status(200).json({
          message: 'Audio transcribed successfully',
          transcription
        });
      } catch (error) {
        console.error('Transcription error:', error);
        return res.status(500).json({
          message: 'Error transcribing audio',
          error: (error as Error).message
        });
      }
    });
  } catch (error) {
    console.error('Speech endpoint error:', error);
    return res.status(500).json({
      message: 'Error processing speech request',
      error: (error as Error).message
    });
  }
}