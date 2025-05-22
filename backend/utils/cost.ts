// backend/utils/cost.ts
import dotenv from 'dotenv';
import { MODEL_CONFIGS } from '../config/models.js'; // Assuming you have this for accurate LLM costs

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });


const COST_THRESHOLD = parseFloat(process.env.COST_THRESHOLD || '20.00');
const WHISPER_COST_PER_MINUTE = 0.006; // Keep this if used by trackWhisperCost

export interface SessionCostDetail {
  totalCost: number;
  whisperCost: number;
  llmCost: number;
  lastUpdated: number;
  interactions: number; // To track number of calls contributing to cost
}

// In-memory store for session costs. In production, consider a database.
const sessionCosts = new Map<string, SessionCostDetail>();

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
 * Tracks cost for LLM calls.
 * Ensure MODEL_CONFIGS is correctly defined in '../config/models.js'
 * Example MODEL_CONFIGS entry:
 * 'gpt-4o': { inputCostPer1K: 0.005, outputCostPer1K: 0.015, contextWindow: 128000 }
 */
export function trackLlmCost(
  userId: string,
  modelName: string,
  promptTokens: number,
  completionTokens: number
): number {
  const session = initializeSessionCost(userId);
  const modelConfig = MODEL_CONFIGS[modelName] || MODEL_CONFIGS['gpt-4o']; // Fallback to gpt-4o config

  let cost = 0;
  if (modelConfig) {
    const inputCost = (promptTokens / 1000) * modelConfig.inputCostPer1K;
    const outputCost = (completionTokens / 1000) * modelConfig.outputCostPer1K;
    cost = inputCost + outputCost;
  } else {
    console.warn(`Cost configuration for model ${modelName} not found. Using default LLM calculation.`);
    // Fallback generic calculation if modelConfig is missing (less accurate)
    cost = ((promptTokens + completionTokens) / 1000) * 0.01; // Generic $0.01 per 1K tokens
  }
  
  session.llmCost += cost;
  session.totalCost += cost;
  session.interactions += 1;
  session.lastUpdated = Date.now();
  
  console.log(`LLM Cost for ${modelName} (User: ${userId}): $${cost.toFixed(6)}. Session total: $${session.totalCost.toFixed(6)}`);
  return session.totalCost;
}

/**
 * Tracks cost for Whisper calls.
 */
export function trackWhisperServiceCost(
  userId: string,
  durationMinutes: number // Duration of the audio processed by Whisper
): number {
  const session = initializeSessionCost(userId);
  // Whisper bills for a minimum of 0.01 minutes if duration is less
  const billableMinutes = Math.max(durationMinutes, 0.01);
  const cost = billableMinutes * WHISPER_COST_PER_MINUTE;
  
  session.whisperCost += cost;
  session.totalCost += cost;
  session.interactions += 1; // Counting this as an interaction
  session.lastUpdated = Date.now();
  
  console.log(`Whisper Cost (User: ${userId}): $${cost.toFixed(6)} for ${durationMinutes.toFixed(2)} min. Session total: $${session.totalCost.toFixed(6)}`);
  return session.totalCost;
}

export function getSessionCost(userId: string): SessionCostDetail {
  return initializeSessionCost(userId);
}

export function isThresholdReached(userId: string): boolean {
  const session = sessionCosts.get(userId);
  return session ? session.totalCost >= COST_THRESHOLD : false;
}

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

// Periodically clean up old sessions (e.g., inactive for 24 hours)
setInterval(() => {
  const now = Date.now();
  for (const [userId, session] of sessionCosts.entries()) {
    if (now - session.lastUpdated > 24 * 60 * 60 * 1000) { // 24 hours
      sessionCosts.delete(userId);
      console.log(`Cleaned up inactive session for user: ${userId}`);
    }
  }
}, 60 * 60 * 1000); // Check every hour