import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { trackWhisperCost } from './cost.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Audio processing constants
const WHISPER_COST_PER_MINUTE = 0.006; // $0.006 per minute (accurate as of 2025)
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB Whisper limit
const MIN_AUDIO_DURATION = 0.1; // 100ms minimum

// Define AudioBuffer interface for Node.js environment
interface AudioBuffer {
  sampleRate: number;
  length: number;
  duration: number;
  numberOfChannels: number;
  getChannelData(channel: number): Float32Array;
}

interface AudioAnalysisResult {
  duration: number;
  estimatedCost: number;
  fileSize: number;
  isOptimal: boolean;
  recommendations: string[];
}

interface TranscriptionResult {
  transcription: string;
  duration: number;
  cost: number;
  usage: {
    durationMinutes: number;
    costPerMinute: number;
  };
}

/**
 * Analyze audio buffer/blob for cost estimation and optimization
 */
export async function analyzeAudioForCost(audioBuffer: Buffer): Promise<AudioAnalysisResult> {
  const fileSize = audioBuffer.length;
  const recommendations: string[] = [];
  
  // Check file size
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(`Audio file too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB (limit: 25MB)`);
  }
  
  // Estimate duration from file size (rough estimation)
  // For WebM/MP3 audio, roughly 1MB = 1-2 minutes depending on quality
  const estimatedDurationMinutes = Math.max(0.01, (fileSize / (1024 * 1024)) * 1.5);
  const estimatedCost = estimatedDurationMinutes * WHISPER_COST_PER_MINUTE;
  
  // Generate recommendations
  if (fileSize < 10 * 1024) { // Less than 10KB
    recommendations.push('Audio file very small - may be too short for meaningful transcription');
  }
  
  if (estimatedDurationMinutes > 10) { // Over 10 minutes
    recommendations.push('Consider breaking long audio into smaller chunks for better processing');
  }
  
  if (fileSize > 10 * 1024 * 1024) { // Over 10MB
    recommendations.push('Large file detected - consider audio compression to reduce costs');
  }
  
  return {
    duration: estimatedDurationMinutes * 60, // Convert to seconds
    estimatedCost: Math.round(estimatedCost * 10000) / 10000, // Round to 4 decimal places
    fileSize,
    isOptimal: fileSize > 10 * 1024 && fileSize < 5 * 1024 * 1024, // 10KB - 5MB is optimal
    recommendations
  };
}

/**
 * Get accurate audio duration from file
 */
export async function getAudioDuration(audioBuffer: Buffer): Promise<number> {
  // For now, use the estimation method
  // In a production environment, you might want to use ffprobe or similar
  const analysis = await analyzeAudioForCost(audioBuffer);
  return analysis.duration;
}

/**
 * Enhanced transcription with cost tracking and optimization
 */
export async function transcribeWithWhisper(audioBuffer: Buffer, userId: string = 'default'): Promise<TranscriptionResult> {
  try {
    // Analyze audio first
    const analysis = await analyzeAudioForCost(audioBuffer);
    
    // Check minimum duration
    if (analysis.duration < MIN_AUDIO_DURATION) {
      throw new Error(`Audio too short: ${analysis.duration.toFixed(1)}s (minimum: ${MIN_AUDIO_DURATION}s)`);
    }
    
    // Create temporary file
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tmpDir, `audio-${userId}-${Date.now()}.webm`);
    await promisify(fs.writeFile)(tempFilePath, audioBuffer);
    
    // Create readable stream
    const audioFile = fs.createReadStream(tempFilePath);
    
    // Enhance the file object with additional metadata
    (audioFile as any).originalname = path.basename(tempFilePath);
    
    console.log(`Transcribing audio: ${analysis.fileSize} bytes, ~${analysis.duration.toFixed(1)}s, estimated cost: $${analysis.estimatedCost.toFixed(4)}`);
    
    // Call Whisper API with optimized settings
    const startTime = Date.now();
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Specify language for better accuracy and speed
      response_format: 'verbose_json', // Get additional metadata
      temperature: 0.1, // Lower temperature for more consistent results
    });
    
    const processingTime = Date.now() - startTime;
    
    // Clean up temporary file
    await promisify(fs.unlink)(tempFilePath).catch(console.error);
    
    // Get actual duration from Whisper response if available
    const actualDuration = (transcription as any).duration || analysis.duration;
    const actualDurationMinutes = Math.max(0.01, actualDuration / 60); // Whisper bills minimum 0.01 minutes
    const actualCost = actualDurationMinutes * WHISPER_COST_PER_MINUTE;
    
    // Track cost in backend
    const sessionCost = trackWhisperCost(userId, actualDurationMinutes, actualCost);
    
    console.log(`Transcription completed in ${processingTime}ms. Duration: ${actualDuration.toFixed(1)}s, Cost: $${actualCost.toFixed(4)}, Session total: $${sessionCost.toFixed(4)}`);
    
    // Log recommendations if any
    if (analysis.recommendations.length > 0) {
      console.log('Audio optimization recommendations:', analysis.recommendations);
    }
    
    return {
      transcription: typeof transcription === 'string' ? transcription : transcription.text,
      duration: actualDuration,
      cost: actualCost,
      usage: {
        durationMinutes: actualDurationMinutes,
        costPerMinute: WHISPER_COST_PER_MINUTE
      }
    };
  } catch (error) {
    console.error('Error transcribing with Whisper:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('file format')) {
        throw new Error('Unsupported audio format. Please use WebM, MP3, MP4, MPEG, MPGA, M4A, or WAV.');
      } else if (error.message.includes('file size')) {
        throw new Error('Audio file too large. Maximum size is 25MB.');
      } else if (error.message.includes('Invalid API key')) {
        throw new Error('OpenAI API key not configured properly.');
      }
    }
    
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch transcribe multiple audio files (for future use)
 */
export async function batchTranscribe(audioFiles: Buffer[], userId: string = 'default'): Promise<TranscriptionResult[]> {
  const results: TranscriptionResult[] = [];
  
  for (let i = 0; i < audioFiles.length; i++) {
    console.log(`Processing audio file ${i + 1}/${audioFiles.length}`);
    
    try {
      const result = await transcribeWithWhisper(audioFiles[i], `${userId}-batch-${i}`);
      results.push(result);
      
      // Add small delay between requests to avoid rate limiting
      if (i < audioFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Failed to transcribe audio file ${i + 1}:`, error);
      // Continue with other files
      results.push({
        transcription: '',
        duration: 0,
        cost: 0,
        usage: { durationMinutes: 0, costPerMinute: WHISPER_COST_PER_MINUTE }
      });
    }
  }
  
  return results;
}

/**
 * More robust RMS calculation for a chunk of audio data.
 */
function calculateRMS(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sumOfSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumOfSquares += samples[i] * samples[i];
  }
  return Math.sqrt(sumOfSquares / samples.length);
}

/**
 * Analyzes an AudioBuffer for silence using RMS chunks.
 * This is a more common approach for Voice Activity Detection (VAD).
 */
export function analyzeSilenceWithRMSChunks(
  audioBuffer: AudioBuffer,
  rmsThreshold: number = 0.01,
  minSilenceDurationMs: number = 500,
  chunkDurationMs: number = 30
): boolean {
  if (!audioBuffer) {
    console.warn("AudioBuffer is null or undefined.");
    return false;
  }

  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); // Assuming mono

  const samplesPerChunk = Math.floor((sampleRate * chunkDurationMs) / 1000);
  const numChunksRequiredForSilence = Math.ceil(minSilenceDurationMs / chunkDurationMs);

  if (samplesPerChunk === 0) {
    console.warn("Chunk duration is too short for the sample rate.");
    return false;
  }

  let consecutiveSilentChunks = 0;

  for (let i = 0; i < channelData.length; i += samplesPerChunk) {
    const chunk = channelData.slice(i, i + samplesPerChunk);
    if (chunk.length === 0 && i < channelData.length) continue;

    const rms = calculateRMS(chunk);

    if (rms < rmsThreshold) {
      consecutiveSilentChunks++;
      if (consecutiveSilentChunks >= numChunksRequiredForSilence) {
        return true; // Detected sufficient consecutive silent chunks
      }
    } else {
      consecutiveSilentChunks = 0; // Reset counter if a chunk is not silent
    }
  }

  return false; // No qualifying continuous silence detected
}

/**
 * Legacy function for backward compatibility
 */
export function analyzeSilence(
  audioBuffer: AudioBuffer, 
  silenceThreshold: number = 0.01, 
  minSilenceDurationMs: number = 500
): boolean {
  return analyzeSilenceWithRMSChunks(audioBuffer, silenceThreshold, minSilenceDurationMs);
}

// Export cost calculation utilities
export const AudioCostUtils = {
  WHISPER_COST_PER_MINUTE,
  MAX_FILE_SIZE,
  MIN_AUDIO_DURATION,
  calculateCost: (durationMinutes: number) => durationMinutes * WHISPER_COST_PER_MINUTE,
  formatCost: (cost: number) => `$${cost.toFixed(4)}`,
  formatDuration: (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  }
};