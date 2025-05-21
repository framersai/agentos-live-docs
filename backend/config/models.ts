import dotenv from 'dotenv';

dotenv.config();

export interface ModelConfig {
  modelName: string;
  inputCostPer1K: number;
  outputCostPer1K: number;
  provider: 'openai' | 'openrouter';
}

// Model configurations with pricing information
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gpt-4o': {
    modelName: 'gpt-4o',
    inputCostPer1K: 0.5,
    outputCostPer1K: 1.5,
    provider: 'openai'
  },
  'gpt-4o-mini': {
    modelName: 'gpt-4o-mini',
    inputCostPer1K: 0.15,
    outputCostPer1K: 0.6,
    provider: 'openai'
  },
  'gpt-3.5-turbo': {
    modelName: 'gpt-3.5-turbo',
    inputCostPer1K: 0.0015,
    outputCostPer1K: 0.002,
    provider: 'openai'
  },
  'claude-3-opus-20240229': {
    modelName: 'claude-3-opus-20240229',
    inputCostPer1K: 15,
    outputCostPer1K: 75,
    provider: 'openrouter'
  },
  'claude-3-sonnet-20240229': {
    modelName: 'claude-3-sonnet-20240229',
    inputCostPer1K: 3,
    outputCostPer1K: 15,
    provider: 'openrouter'
  }
};

// Available models by mode
export const MODEL_PREFERENCES = {
  coding: process.env.MODEL_PREF_CODING || 'gpt-4o',
  system_design: process.env.MODEL_PREF_SYSTEM_DESIGN || 'gpt-4o',
  meeting: process.env.MODEL_PREF_SUMMARY || 'gpt-4o-mini'
};

export const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'python';
export const TOKEN_LIMIT = parseInt(process.env.TOKEN_LIMIT || '4000', 10);
export const COST_THRESHOLD = parseFloat(process.env.COST_THRESHOLD || '5.0');