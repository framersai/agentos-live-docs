// File: backend/config/models.config.ts
/**
 * @file Centralized model configuration for LLM preferences and pricing.
 * @description Loads model preferences from environment variables and defines pricing
 * information for cost calculation. This ensures that model choices and their associated
 * costs are managed in one place.
 * @version 1.1.0 - Added more explicit .env sourcing and comments.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded from project root to make these variables available
const __filename = fileURLToPath(import.meta.url); // backend/config/models.config.ts
const __projectRoot = path.resolve(path.dirname(__filename), '../..'); // up to project root
dotenv.config({ path: path.join(__projectRoot, '.env') });

/**
 * Defines the structure for model pricing information.
 * Costs are typically per 1,000 tokens.
 */
export interface ModelConfig {
  /** Input cost per 1,000 tokens in USD. */
  inputCostPer1K: number;
  /** Output cost per 1,000 tokens in USD. */
  outputCostPer1K: number;
  /** Human-readable name or alias for the model. */
  displayName?: string;
  /** The provider of the model, if applicable (e.g., "openai", "anthropic"). */
  provider?: string;
}

/**
 * A map holding pricing information for various models.
 * Keys are typically the model IDs used in API calls (e.g., "gpt-4o-mini", "openai/gpt-4o-mini").
 * It's crucial that the keys here match the `model` field returned by the LLM services.
 */
export const MODEL_PRICING: Record<string, ModelConfig> = {
  // OpenAI Models (ensure these keys match what your OpenAI service returns in `response.model`)
  'gpt-4o-mini': { inputCostPer1K: 0.00015, outputCostPer1K: 0.00060, displayName: 'GPT-4o Mini', provider: 'openai' },
  'gpt-4o': { inputCostPer1K: 0.005, outputCostPer1K: 0.015, displayName: 'GPT-4o', provider: 'openai' },
  'gpt-4-turbo': { inputCostPer1K: 0.01, outputCostPer1K: 0.03, displayName: 'GPT-4 Turbo', provider: 'openai' },
  'gpt-3.5-turbo': { inputCostPer1K: 0.0005, outputCostPer1K: 0.0015, displayName: 'GPT-3.5 Turbo', provider: 'openai' },
  'gpt-3.5-turbo-16k': { inputCostPer1K: 0.003, outputCostPer1K: 0.004, displayName: 'GPT-3.5 Turbo 16k', provider: 'openai' }, // Example, check current pricing
  'text-embedding-3-small': { inputCostPer1K: 0.00002, outputCostPer1K: 0, displayName: 'Text Embedding 3 Small', provider: 'openai'}, // Output cost 0 for embeddings
  'text-embedding-3-large': { inputCostPer1K: 0.00013, outputCostPer1K: 0, displayName: 'Text Embedding 3 Large', provider: 'openai'},

  // OpenRouter Models (keys should be `provider_slug/model_name` as OpenRouter returns them)
  // These often mirror the original provider's pricing but OpenRouter might add a markup.
  // For simplicity, using OpenAI's direct pricing here. Adjust if OpenRouter has different effective rates.
  'openai/gpt-4o-mini': { inputCostPer1K: 0.00015, outputCostPer1K: 0.00060, displayName: 'OpenRouter: GPT-4o Mini', provider: 'openrouter' },
  'openai/gpt-4o': { inputCostPer1K: 0.005, outputCostPer1K: 0.015, displayName: 'OpenRouter: GPT-4o', provider: 'openrouter' },
  'openai/gpt-4-turbo': { inputCostPer1K: 0.01, outputCostPer1K: 0.03, displayName: 'OpenRouter: GPT-4 Turbo', provider: 'openrouter' },
  'openai/gpt-3.5-turbo': { inputCostPer1K: 0.0005, outputCostPer1K: 0.0015, displayName: 'OpenRouter: GPT-3.5 Turbo', provider: 'openrouter' },
  'anthropic/claude-3-haiku-20240307': { inputCostPer1K: 0.00025, outputCostPer1K: 0.00125, displayName: 'OpenRouter: Claude 3 Haiku', provider: 'openrouter' },
  'anthropic/claude-3-sonnet-20240229': { inputCostPer1K: 0.003, outputCostPer1K: 0.015, displayName: 'OpenRouter: Claude 3 Sonnet', provider: 'openrouter' },
  'anthropic/claude-3-opus-20240229': { inputCostPer1K: 0.015, outputCostPer1K: 0.075, displayName: 'OpenRouter: Claude 3 Opus', provider: 'openrouter' },
  'google/gemini-pro': { inputCostPer1K: 0.000125, outputCostPer1K: 0.000375, displayName: 'OpenRouter: Gemini Pro', provider: 'openrouter' }, // Example pricing for Gemini Pro

  // Add other models from different providers as needed
  // Ensure keys match the `modelId` format returned by the respective LLM service
  // For Ollama models, pricing is typically 0 as they are self-hosted.
  'llama3': { inputCostPer1K: 0, outputCostPer1K: 0, displayName: 'Llama 3 (Ollama)', provider: 'ollama' },
  'codellama:13b': { inputCostPer1K: 0, outputCostPer1K: 0, displayName: 'CodeLlama 13B (Ollama)', provider: 'ollama' },

  // Default/Fallback Pricing (use a cheap model's pricing if specific one not found)
  'default': { inputCostPer1K: 0.0005, outputCostPer1K: 0.0015, displayName: 'Default Fallback Model Pricing' },
};

/**
 * Retrieves the pricing configuration for a given model ID.
 * It tries to match the exact model ID, then a more generic version (e.g. without provider prefix if applicable).
 * @param {string} modelId - The model identifier (e.g., "gpt-4o-mini", "openai/gpt-4o-mini").
 * @returns {ModelConfig | undefined} The pricing configuration or undefined if not found.
 */
export function getModelPrice(modelId: string): ModelConfig | undefined {
  if (MODEL_PRICING[modelId]) {
    return MODEL_PRICING[modelId];
  }
  // Try to strip provider prefix if modelId is like "openai/gpt-4o-mini" and direct key was "gpt-4o-mini"
  const parts = modelId.split('/');
  if (parts.length > 1) {
    const genericModelId = parts.slice(1).join('/'); // e.g., "gpt-4o-mini" from "openai/gpt-4o-mini"
    if (MODEL_PRICING[genericModelId]) {
      return MODEL_PRICING[genericModelId];
    }
  }
  console.warn(`getModelPrice: Pricing not found for model "${modelId}". Using default pricing.`);
  return MODEL_PRICING['default'];
}


/**
 * Preferred models for different application modes.
 * These are loaded from environment variables, with sensible fallbacks.
 * The values should be fully qualified model IDs if they are intended for a specific provider
 * that might be different from the default routing provider (e.g. if ROUTING_LLM_PROVIDER_ID is openrouter,
 * these can be 'openai/gpt-4o', 'anthropic/claude-3-opus-20240229', etc.).
 * If they are meant for the default OpenAI provider, they can be 'gpt-4o'.
 * The `callLlm` factory will handle processing these IDs for the target service.
 */
export const MODEL_PREFERENCES = {
  general: process.env.MODEL_PREF_GENERAL_CHAT || 'openai/gpt-4o-mini',
  coding: process.env.MODEL_PREF_CODING || 'openai/gpt-4o',
  system_design: process.env.MODEL_PREF_SYSTEM_DESIGN || 'openai/gpt-4o', // Using a capable model for diagrams
  meeting_summary: process.env.MODEL_PREF_SUMMARIZATION || 'openai/gpt-4o-mini', // Alias for summarization
  rag_synthesis: process.env.MODEL_PREF_RAG_SYNTHESIS || 'openai/gpt-4o-mini',
  self_reflection: process.env.MODEL_PREF_SELF_REFLECTION || 'openai/gpt-4o-mini',
  summarization: process.env.MODEL_PREF_SUMMARIZATION || 'openai/gpt-4o-mini',
  default_embedding: process.env.MODEL_PREF_DEFAULT_EMBEDDING || 'openai/text-embedding-3-small',
  interview_tutor: process.env.MODEL_PREF_INTERVIEW_TUTOR || 'openai/gpt-4o', // For coding_interviewer mode
  coding_tutor: process.env.MODEL_PREF_CODING_TUTOR || 'openai/gpt-4o-mini', // For coding_tutor mode
  utility: process.env.UTILITY_LLM_MODEL_ID || 'openai/gpt-4o-mini', // For internal tasks like summarization
  default: process.env.ROUTING_LLM_MODEL_ID || 'openai/gpt-4o-mini', // System-wide default if no mode matches
  diagram_generation: undefined
};

// Log the loaded model preferences for verification during startup
console.log("Loaded MODEL_PREFERENCES:", MODEL_PREFERENCES);