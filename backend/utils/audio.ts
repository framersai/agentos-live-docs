import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define AudioBuffer interface for Node.js environment
interface AudioBuffer {
  sampleRate: number;
  length: number;
  duration: number;
  numberOfChannels: number;
  getChannelData(channel: number): Float32Array;
}

// Function to transcribe audio using OpenAI Whisper
export async function transcribeWithWhisper(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a temporary file
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tmpDir, `audio-${Date.now()}.webm`);
    await promisify(fs.writeFile)(tempFilePath, audioBuffer);
    
    // Create a readable stream from the file
    const audioFile = fs.createReadStream(tempFilePath);
    
    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });
    
    // Clean up the temporary file
    await promisify(fs.unlink)(tempFilePath).catch(console.error);
    
    return transcription;
  } catch (error) {
    console.error('Error transcribing with Whisper:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Analyzes an AudioBuffer to detect if it primarily contains silence.
 *
 * @param {AudioBuffer} audioBuffer - The audio data to analyze (from Web Audio API).
 * @param {number} silenceThreshold - RMS threshold below which audio is considered silent (e.g., 0.01).
 * @param {number} minSilenceDurationMs - Minimum duration of silence in milliseconds to be considered a significant pause.
 * @returns {boolean} - True if the buffer is considered silent for the minimum duration, false otherwise.
 */
export function analyzeSilence(
  audioBuffer: AudioBuffer, 
  silenceThreshold: number = 0.01, 
  minSilenceDurationMs: number = 500
): boolean {
  if (!audioBuffer) {
    console.warn("AudioBuffer is null or undefined.");
    return false; // Or true, depending on how you want to handle no input
  }

  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); // Assuming mono, use channel 0
  const numSamples = channelData.length;

  // Calculate how many samples correspond to the minimum silence duration
  const minSilenceSamples = (sampleRate * minSilenceDurationMs) / 1000;

  let silentSamplesCount = 0;
  let consecutiveSilentSamples = 0;

  // Option 1: Simple average of absolute values (less accurate but faster)
  // Option 2: Root Mean Square (RMS) - More standard for energy/loudness
  // We'll go with a simplified RMS-like approach for this example by squaring samples.

  // Process in chunks to avoid blocking the main thread for very long audio.
  // A more robust solution might use an AudioWorklet.
  // For this example, we'll iterate, but be mindful of performance for long buffers.

  for (let i = 0; i < numSamples; i++) {
    const sample = channelData[i];
    // Using absolute value as a proxy for energy in this simplified version.
    // A true RMS would involve squaring, averaging over a window, then taking the square root.
    if (Math.abs(sample) < silenceThreshold) {
      consecutiveSilentSamples++;
    } else {
      // If significant silence was detected before this loud sound,
      // and it met the duration, we can consider it a silence period.
      // For this function's purpose (is the *entire buffer* silent?),
      // we reset if sound is found.
      // If you want to detect *any* period of silence *within* the buffer
      // that meets minSilenceDurationMs, the logic would be different.

      // For "is the buffer predominantly silent or ends in silence?"
      if (consecutiveSilentSamples >= minSilenceSamples) {
        // A qualifying silence period was found.
        // Depending on the exact goal (e.g., "ends in silence"),
        // you might return true here or continue.
        // For now, let's assume we're checking if the buffer *concludes* with silence
        // or is mostly silence.
      }
      consecutiveSilentSamples = 0; // Reset counter when sound is detected
    }
  }

  // Check after the loop if the audio ended with a qualifying period of silence
  if (consecutiveSilentSamples >= minSilenceSamples) {
    return true;
  }

  // Fallback: if the whole buffer was very short and entirely below threshold
  if (numSamples > 0 && numSamples < minSilenceSamples) {
    let totalEnergy = 0;
    for (let i = 0; i < numSamples; i++) {
      totalEnergy += Math.abs(channelData[i]);
    }
    const averageEnergy = totalEnergy / numSamples;
    if (averageEnergy < silenceThreshold) {
      return true; // Very short and very quiet
    }
  }

  return false; // No qualifying silence detected
}

/**
 * More robust RMS calculation for a chunk of audio data.
 * @param {Float32Array} samples - A chunk of audio samples.
 * @returns {number} - The RMS value.
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
 *
 * @param {AudioBuffer} audioBuffer - The audio data to analyze.
 * @param {number} rmsThreshold - RMS threshold below which a chunk is considered silent (e.g., 0.005 to 0.02).
 * @param {number} minSilenceDurationMs - Minimum duration of silence in milliseconds.
 * @param {number} chunkDurationMs - Duration of each audio chunk to analyze in milliseconds (e.g., 30ms).
 * @returns {boolean} - True if a continuous silence period meeting minSilenceDurationMs is found.
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
        return false; // Or handle as per requirements
    }

    let consecutiveSilentChunks = 0;

    for (let i = 0; i < channelData.length; i += samplesPerChunk) {
        const chunk = channelData.slice(i, i + samplesPerChunk);
        if (chunk.length === 0 && i < channelData.length) continue; // Should not happen if samplesPerChunk > 0

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