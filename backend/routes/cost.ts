// backend/utils/cost.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Model cost configurations (since models.js is missing)
const MODEL_CONFIGS: Record<string, { inputCostPer1K: number; outputCostPer1K: number; contextWindow: number }> = {
  'gpt-4o': { inputCostPer1K: 0.005, outputCostPer1K: 0.015, contextWindow: 128000 },
  'gpt-4o-mini': { inputCostPer1K: 0.00015, outputCostPer1K: 0.0006, contextWindow: 128000 },
  'gpt-4': { inputCostPer1K: 0.03, outputCostPer1K: 0.06, contextWindow: 8192 },
  'gpt-3.5-turbo': { inputCostPer1K: 0.001, outputCostPer1K: 0.002, contextWindow: 4096 },
};

const COST_THRESHOLD = parseFloat(process.env.COST_THRESHOLD || '20.00');
const WHISPER_COST_PER_MINUTE = 0.006;

export interface SessionCostDetail {
  totalCost: number;
  whisperCost: number;
  llmCost: number;
  lastUpdated: number;
  interactions: number;
}

// In-memory store for session costs
const sessionCosts = new Map<string, SessionCostDetail>();

/**
 * Initialize session cost data for a user
 */
function initializeSessionCost(userId: string): SessionCostDetail {
  if (!sessionCosts.has(userId)) {
    sessionCosts.set(userId, {
      totalCost: 0,
      whisperCost: 0,
      llmCost: 0,
      lastUpdated: Date.now(),
      interactions: 0,
    });
  }
  return sessionCosts.get(userId)!;
}

/**
 * Track cost for LLM calls
 * @param userId - User identifier
 * @param modelName - Name of the model used
 * @param promptTokens - Number of input tokens
 * @param completionTokens - Number of output tokens
 * @returns Total session cost
 */
export function trackCost(
  userId: string,
  modelName: string,
  promptTokens: number,
  completionTokens: number
): number {
  const session = initializeSessionCost(userId);
  const modelConfig = MODEL_CONFIGS[modelName] || MODEL_CONFIGS['gpt-4o'];

  let cost = 0;
  if (modelConfig) {
    const inputCost = (promptTokens / 1000) * modelConfig.inputCostPer1K;
    const outputCost = (completionTokens / 1000) * modelConfig.outputCostPer1K;
    cost = inputCost + outputCost;
  } else {
    console.warn(`Cost configuration for model ${modelName} not found. Using default calculation.`);
    cost = ((promptTokens + completionTokens) / 1000) * 0.01;
  }
  
  session.llmCost += cost;
  session.totalCost += cost;
  session.interactions += 1;
  session.lastUpdated = Date.now();
  
  console.log(`LLM Cost for ${modelName} (User: ${userId}): $${cost.toFixed(6)}. Session total: $${session.totalCost.toFixed(6)}`);
  return session.totalCost;
}

/**
 * Track cost for LLM calls (alias for trackCost for compatibility)
 */
export const trackLlmCost = trackCost;

/**
 * Track cost for Whisper transcription
 * @param userId - User identifier  
 * @param durationMinutes - Duration of audio in minutes
 * @returns Total session cost
 */
export function trackWhisperCost(
  userId: string,
  durationMinutes: number
): number {
  const session = initializeSessionCost(userId);
  // Whisper bills for a minimum of 0.01 minutes
  const billableMinutes = Math.max(durationMinutes, 0.01);
  const cost = billableMinutes * WHISPER_COST_PER_MINUTE;
  
  session.whisperCost += cost;
  session.totalCost += cost;
  session.interactions += 1;
  session.lastUpdated = Date.now();
  
  console.log(`Whisper Cost (User: ${userId}): $${cost.toFixed(6)} for ${durationMinutes.toFixed(2)} min. Session total: $${session.totalCost.toFixed(6)}`);
  return session.totalCost;
}

/**
 * Alternative name for trackWhisperCost for compatibility
 */
export const trackWhisperServiceCost = trackWhisperCost;

/**
 * Get current session cost details
 * @param userId - User identifier
 * @returns Session cost details
 */
export function getSessionCost(userId: string): SessionCostDetail {
  return initializeSessionCost(userId);
}

/**
 * Check if cost threshold has been reached
 * @param userId - User identifier  
 * @returns True if threshold reached
 */
export function isThresholdReached(userId: string): boolean {
  const session = sessionCosts.get(userId);
  return session ? session.totalCost >= COST_THRESHOLD : false;
}

/**
 * Reset session cost for a user
 * @param userId - User identifier
 * @returns New session cost details
 */
export function resetSessionCost(userId: string): SessionCostDetail {
  console.log(`Resetting session cost for user: ${userId}`);
  sessionCosts.set(userId, {
    totalCost: 0,
    whisperCost: 0,
    llmCost: 0,
    lastUpdated: Date.now(),
    interactions: 0,
  });
  return sessionCosts.get(userId)!;
}

// Clean up old sessions periodically (24 hours of inactivity)
setInterval(() => {
  const now = Date.now();
  for (const [userId, session] of sessionCosts.entries()) {
    if (now - session.lastUpdated > 24 * 60 * 60 * 1000) {
      sessionCosts.delete(userId);
      console.log(`Cleaned up inactive session for user: ${userId}`);
    }
  }
}, 60 * 60 * 1000); // Check every hour