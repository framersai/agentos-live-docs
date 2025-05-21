import { MODEL_CONFIGS } from '../config/models.js';
import { COST_THRESHOLD } from '../config/models.js';

// Track session costs
interface SessionCost {
  userId: string;
  totalCost: number;
  sessionStart: Date;
  usageByModel: Record<string, {
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>;
}

// In-memory store for session costs
// In a production environment, this would be replaced with a database
const sessionCosts: Record<string, SessionCost> = {};

// Initialize a new session
export function initSession(userId: string): void {
  sessionCosts[userId] = {
    userId,
    totalCost: 0,
    sessionStart: new Date(),
    usageByModel: {}
  };
}

// Track cost for a request
export function trackCost(
  userId: string, 
  modelName: string, 
  inputTokens: number, 
  outputTokens: number
): number {
  // Create session if it doesn't exist
  if (!sessionCosts[userId]) {
    initSession(userId);
  }
  
  const session = sessionCosts[userId];
  const modelConfig = MODEL_CONFIGS[modelName] || MODEL_CONFIGS['gpt-4o'];
  
  // Calculate costs
  const inputCost = (inputTokens / 1000) * modelConfig.inputCostPer1K;
  const outputCost = (outputTokens / 1000) * modelConfig.outputCostPer1K;
  const totalCost = inputCost + outputCost;
  
  // Update session costs
  session.totalCost += totalCost;
  
  // Initialize model tracking if needed
  if (!session.usageByModel[modelName]) {
    session.usageByModel[modelName] = {
      inputTokens: 0,
      outputTokens: 0,
      cost: 0
    };
  }
  
  // Update model usage
  session.usageByModel[modelName].inputTokens += inputTokens;
  session.usageByModel[modelName].outputTokens += outputTokens;
  session.usageByModel[modelName].cost += totalCost;
  
  return session.totalCost;
}

// Check if cost threshold is reached
export function isThresholdReached(userId: string): boolean {
  if (!sessionCosts[userId]) {
    return false;
  }
  
  return sessionCosts[userId].totalCost >= COST_THRESHOLD;
}

// Get current session cost
export function getSessionCost(userId: string): number {
  if (!sessionCosts[userId]) {
    return 0;
  }
  
  return sessionCosts[userId].totalCost;
}

// Get detailed session usage
export function getSessionDetails(userId: string): SessionCost | null {
  return sessionCosts[userId] || null;
}

// Reset session cost
export function resetSessionCost(userId: string): void {
  if (sessionCosts[userId]) {
    initSession(userId);
  }
}