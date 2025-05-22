import { Request, Response } from 'express';
import multer from 'multer';
import { transcribeWithWhisper, analyzeAudioForCost, AudioCostUtils } from '../utils/audio.js';
import { getSessionCost, isThresholdReached } from '../utils/cost.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage with size limits
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper API limit)
    files: 1 // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/mp4',
      'audio/m4a',
      'audio/wav',
      'audio/flac',
      'audio/ogg'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(webm|mp3|mp4|m4a|wav|flac|ogg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported formats: WebM, MP3, MP4, M4A, WAV, FLAC, OGG'));
    }
  }
});

// Handle audio transcription with Whisper
export async function POST(req: Request, res: Response): Promise<any> {
  try {
    // Use multer to handle the file upload
    upload.single('audio')(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              message: 'Audio file too large. Maximum size is 25MB.',
              error: 'FILE_TOO_LARGE',
              maxSize: '25MB'
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
              message: 'Too many files. Please upload one audio file at a time.',
              error: 'TOO_MANY_FILES'
            });
          }
        }
        
        return res.status(400).json({ 
          message: err.message || 'File upload error', 
          error: 'UPLOAD_ERROR' 
        });
      }
      
      if (!req.file) {
        return res.status(400).json({ 
          message: 'No audio file provided',
          error: 'NO_FILE'
        });
      }
      
      // Get user ID from request (could be from auth middleware)
      const userId = (req as any).userId || req.body.userId || 'default';
      
      try {
        // Check cost threshold before processing
        if (isThresholdReached(userId)) {
          const currentCost = getSessionCost(userId);
          return res.status(403).json({
            message: 'Session cost threshold reached',
            error: 'COST_THRESHOLD_EXCEEDED',
            currentCost,
            threshold: process.env.COST_THRESHOLD || '20.00'
          });
        }
        
        // Analyze audio for cost estimation
        const analysis = await analyzeAudioForCost(req.file.buffer);
        
        console.log(`Audio analysis - Size: ${analysis.fileSize} bytes, Duration: ~${analysis.duration.toFixed(1)}s, Estimated cost: ${AudioCostUtils.formatCost(analysis.estimatedCost)}`);
        
        // Log recommendations if any
        if (analysis.recommendations.length > 0) {
          console.log('Audio recommendations:', analysis.recommendations);
        }
        
        // Transcribe the audio using Whisper with cost tracking
        const result = await transcribeWithWhisper(req.file.buffer, userId);
        
        // Get updated session cost
        const sessionCost = getSessionCost(userId);
        
        // Prepare response
        const response = {
          message: 'Audio transcribed successfully',
          transcription: result.transcription,
          duration: result.duration,
          cost: result.cost,
          sessionCost,
          usage: {
            durationMinutes: result.usage.durationMinutes,
            costPerMinute: result.usage.costPerMinute,
            totalCost: result.cost
          },
          analysis: {
            fileSize: analysis.fileSize,
            isOptimal: analysis.isOptimal,
            recommendations: analysis.recommendations
          },
          metadata: {
            originalFilename: req.file.originalname,
            mimeType: req.file.mimetype,
            processingTime: Date.now() - Date.now() // This would be calculated properly in a real implementation
          },
          warning: {}
        };
        
        // Add warnings if cost is getting high
        if (sessionCost.totalCost > 1.0) {
          response.warning = {
            message: 'Session cost is getting high',
            currentCost: sessionCost,
            threshold: parseFloat(process.env.COST_THRESHOLD || '20.00')
          };
        }
        
        return res.status(200).json(response);
        
      } catch (transcriptionError) {
        console.error('Transcription error:', transcriptionError);
        
        // Provide specific error messages
        let errorMessage = 'Error transcribing audio';
        let errorCode = 'TRANSCRIPTION_ERROR';
        
        if (transcriptionError instanceof Error) {
          const errorMsg = transcriptionError.message.toLowerCase();
          
          if (errorMsg.includes('api key')) {
            errorMessage = 'OpenAI API key not configured properly';
            errorCode = 'API_KEY_ERROR';
          } else if (errorMsg.includes('file format') || errorMsg.includes('unsupported')) {
            errorMessage = 'Unsupported audio format';
            errorCode = 'UNSUPPORTED_FORMAT';
          } else if (errorMsg.includes('too short')) {
            errorMessage = 'Audio too short for transcription';
            errorCode = 'AUDIO_TOO_SHORT';
          } else if (errorMsg.includes('too large')) {
            errorMessage = 'Audio file too large';
            errorCode = 'AUDIO_TOO_LARGE';
          } else if (errorMsg.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a moment.';
            errorCode = 'RATE_LIMIT_ERROR';
          } else if (errorMsg.includes('quota')) {
            errorMessage = 'API quota exceeded. Please check your billing.';
            errorCode = 'QUOTA_EXCEEDED';
          } else {
            errorMessage = transcriptionError.message;
          }
        }
        
        return res.status(500).json({
          message: errorMessage,
          error: errorCode,
          details: process.env.NODE_ENV === 'development' ? transcriptionError : undefined
        });
      }
    });
  } catch (error) {
    console.error('Speech endpoint error:', error);
    return res.status(500).json({
      message: 'Error processing speech request',
      error: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

// GET endpoint for retrieving speech processing statistics
export async function GET(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string || 'default';
    
    const sessionCost = getSessionCost(userId);
    const costThreshold = parseFloat(process.env.COST_THRESHOLD || '20.00');
    
    return res.status(200).json({
      message: 'Speech processing statistics',
      userId,
      sessionCost,
      costThreshold,
      whisperPricing: {
        costPerMinute: AudioCostUtils.WHISPER_COST_PER_MINUTE,
        maxFileSize: AudioCostUtils.MAX_FILE_SIZE,
        minDuration: AudioCostUtils.MIN_AUDIO_DURATION
      },
      supportedFormats: [
        'audio/webm',
        'audio/mp3',
        'audio/mpeg',
        'audio/mp4',
        'audio/m4a',
        'audio/wav',
        'audio/flac',
        'audio/ogg'
      ],
      limits: {
        maxFileSize: '25MB',
        maxDuration: '10 minutes (recommended)',
        minDuration: '0.1 seconds'
      }
    });
  } catch (error) {
    console.error('Error retrieving speech statistics:', error);
    return res.status(500).json({
      message: 'Error retrieving speech statistics',
      error: 'INTERNAL_ERROR'
    });
  }
}