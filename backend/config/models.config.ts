// File: backend/config/models.config.ts

/**
 * @file Defines model configurations, pricing, and preferences.
 * @version 1.1.0
 * @description This file centralizes the configuration for different LLM models,
 * including their costs and preferred usage for various application modes (coding, system design, etc.).
 * It also provides a utility function to retrieve model pricing information.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded relative to the project root
const __filename = fileURLToPath(import.meta.url);
// For backend/config/models.config.ts, going up two levels to project root.
const __projectRoot = path.resolve(path.dirname(__filename), '../..');
dotenv.config({ path: path.join(__projectRoot, '.env'), override: true });


export interface ModelConfig {
  /** The unique name or identifier of the model (e.g., "gpt-4o-mini", "anthropic/claude-3-opus-20240229"). */
  modelName: string;
  /** Cost per 1000 input tokens in USD. */
  inputCostPer1K: number;
  /** Cost per 1000 output tokens in USD. */
  outputCostPer1K: number;
  /** The primary provider of this model (e.g., 'openai', 'openrouter', 'anthropic'). */
  provider: 'openai' | 'openrouter' | 'anthropic' | string; // Allow string for other providers
  /** Context window size in tokens, if known. */
  contextWindow?: number;
}

/**
 * Pricing and configuration details for various LLM models.
 * Keys should be the model identifiers used throughout the application,
 * especially those returned by LLM services or used in `MODEL_PREFERENCES`.
 * For OpenRouter, use the full path (e.g., "openrouter/anthropic/claude-3-opus-20240229").
 */
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  // OpenAI Models (direct)
  'gpt-4o': {
    modelName: 'gpt-4o',
    inputCostPer1K: 0.005,  // $5.00 / 1M input tokens
    outputCostPer1K: 0.015, // $15.00 / 1M output tokens
    provider: 'openai',
    contextWindow: 128000,
  },
  'gpt-4o-mini': {
    modelName: 'gpt-4o-mini',
    inputCostPer1K: 0.00015, // $0.15 / 1M input tokens
    outputCostPer1K: 0.0006,  // $0.60 / 1M output tokens
    provider: 'openai',
    contextWindow: 128000,
  },
  'gpt-3.5-turbo': { // Example, often 'gpt-3.5-turbo-0125' or similar variant
    modelName: 'gpt-3.5-turbo',
    inputCostPer1K: 0.0005, // $0.50 / 1M input tokens
    outputCostPer1K: 0.0015, // $1.50 / 1M output tokens
    provider: 'openai',
    contextWindow: 16385,
  },

  // OpenRouter Models (examples - ensure keys match OpenRouter model IDs)
  // It's crucial that the keys here match the exact model identifiers
  // that will be returned by your LLM services when using OpenRouter.
  'openrouter/anthropic/claude-3-opus': {
    modelName: 'anthropic/claude-3-opus-20240229', // This is the OpenRouter model ID
    inputCostPer1K: 0.015,  // $15 / 1M input tokens
    outputCostPer1K: 0.075, // $75 / 1M output tokens
    provider: 'openrouter',
    contextWindow: 200000,
  },
  'openrouter/anthropic/claude-3-sonnet': {
    modelName: 'anthropic/claude-3-sonnet-20240229',
    inputCostPer1K: 0.003,  // $3 / 1M input tokens
    outputCostPer1K: 0.015, // $15 / 1M output tokens
    provider: 'openrouter',
    contextWindow: 200000,
  },
  'openrouter/anthropic/claude-3-haiku': {
    modelName: 'anthropic/claude-3-haiku-20240307',
    inputCostPer1K: 0.00025, // $0.25 / 1M input tokens
    outputCostPer1K: 0.00125, // $1.25 / 1M output tokens
    provider: 'openrouter',
    contextWindow: 200000,
  },
  'openrouter/google/gemini-pro': { // Example, actual ID might be 'google/gemini-pro-1.0'
    modelName: 'google/gemini-pro',
    inputCostPer1K: 0.000125,
    outputCostPer1K: 0.000375,
    provider: 'openrouter',
    contextWindow: 32768, // Approximate, check specific Gemini Pro version
  },
  'openrouter/openai/gpt-4o': { // If accessing OpenAI models via OpenRouter
    modelName: 'openai/gpt-4o',
    inputCostPer1K: 0.005, // Match OpenAI's pricing, or OpenRouter's if different
    outputCostPer1K: 0.015,
    provider: 'openrouter',
    contextWindow: 128000,
  },
  'openrouter/openai/gpt-4o-mini': {
    modelName: 'openai/gpt-4o-mini',
    inputCostPer1K: 0.00015,
    outputCostPer1K: 0.0006,
    provider: 'openrouter',
    contextWindow: 128000,
  },
  // Add more models as needed, ensuring the key is the exact identifier.
};

/**
 * Preferred models for different application modes.
 * Values should be keys from `MODEL_CONFIGS` or fully qualified model IDs
 * that `llm.factory.ts` can resolve (e.g., "openai/gpt-4o-mini" or "openrouter/anthropic/claude-3-sonnet").
 */
export const MODEL_PREFERENCES = {
  coding: process.env.MODEL_PREF_CODING || 'openrouter/openai/gpt-4o',
  system_design: process.env.MODEL_PREF_SYSTEM_DESIGN || 'openrouter/anthropic/claude-3-sonnet', // Sonnet is good for this
  meeting: process.env.MODEL_PREF_MEETING_SUMMARY || 'openrouter/anthropic/claude-3-haiku', // Haiku for speed and cost
  general_chat: process.env.MODEL_PREF_GENERAL_CHAT || 'openrouter/openai/gpt-4o-mini',
  diagram_generation: process.env.MODEL_PREF_DIAGRAM_GENERATION || 'openrouter/anthropic/claude-3-sonnet', // Needs good reasoning
  // Fallback model if a mode-specific one isn't found or configured
  default: process.env.MODEL_PREF_DEFAULT || 'openrouter/openai/gpt-4o-mini',
};

export const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'python';
export const TOKEN_LIMIT = parseInt(process.env.TOKEN_LIMIT || '8000', 10); // General fallback
export const COST_THRESHOLD = parseFloat(process.env.COST_THRESHOLD || '20.0'); // App-wide threshold

/**
 * Retrieves the pricing configuration for a given model ID.
 *
 * @param {string} modelId - The model identifier (e.g., "gpt-4o-mini", "openrouter/anthropic/claude-3-opus").
 * @returns {ModelConfig | undefined} The ModelConfig for the model, or undefined if not found.
 */
export function getModelPrice(modelId: string): ModelConfig | undefined {
  if (MODEL_CONFIGS[modelId]) {
    return MODEL_CONFIGS[modelId];
  }
  // If the modelId includes a provider prefix (e.g., "openai/gpt-4o-mini")
  // and it's not directly in MODEL_CONFIGS, try looking for the part after the slash.
  // This is a fallback and might not always be correct if pricing differs when accessed via a router.
  const parts = modelId.split('/');
  if (parts.length > 1) {
    const modelNameOnly = parts.slice(1).join('/'); // Handles cases like "meta-llama/llama-3-70b-instruct"
    if (MODEL_CONFIGS[modelNameOnly]) {
        // If found, we assume it's being accessed directly, so use its provider.
        // This might need adjustment if OpenRouter has different pricing for the same underlying model.
        console.warn(`getModelPrice: Found pricing for "${modelNameOnly}" as a fallback for "${modelId}". Provider context might be important.`);
        return MODEL_CONFIGS[modelNameOnly];
    }
  }
  console.warn(`getModelPrice: Pricing for model "${modelId}" not found in MODEL_CONFIGS.`);
  return undefined;
}
