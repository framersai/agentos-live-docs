// File: backend/utils/llm.ts
import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MODEL_CONFIGS } from '../config/models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **FORCE LOAD ENVIRONMENT VARIABLES**
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath, override: true });

console.log('🔑 LLM Environment loaded successfully!');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Convert model names between OpenAI and OpenRouter formats
 */
function getOpenAIModelName(modelName: string): string {
  // Remove provider prefix for OpenAI API calls
  if (modelName.startsWith('openai/')) {
    return modelName.replace('openai/', '');
  }
  return modelName;
}

function getOpenRouterModelName(modelName: string): string {
  // Add provider prefix for OpenRouter if not present
  if (!modelName.includes('/')) {
    return `openai/${modelName}`;
  }
  return modelName;
}

// Function to call OpenAI API
export async function callOpenAI(
  messages: any[],
  modelName: string = 'gpt-4o',
  temperature: number = 0.7
) {
  try {
    // Check if OpenAI API key is properly configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
      console.log('❌ OpenAI API key not configured, falling back to OpenRouter');
      return callOpenRouter(messages, modelName, temperature);
    }

    // Convert model name for OpenAI API
    const openaiModelName = getOpenAIModelName(modelName);
    console.log(`✅ Calling OpenAI with model: ${openaiModelName} (original: ${modelName})`);
    
    const response = await openai.chat.completions.create({
      model: openaiModelName,
      messages,
      temperature,
      max_tokens: 2000,
    });

    return {
      text: response.choices[0].message.content,
      usage: response.usage,
      model: openaiModelName
    };
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    console.log('⚠️ Falling back to OpenRouter due to OpenAI error');
    // If OpenAI fails, try OpenRouter as fallback
    return callOpenRouter(messages, modelName, temperature);
  }
}

// Function to call OpenRouter API
export async function callOpenRouter(
  messages: any[],
  modelName: string = 'gpt-4o',
  temperature: number = 0.7
) {
  try {
    // Check if OpenRouter API key is properly configured
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
      throw new Error('OpenRouter API key not configured properly. Please set OPENROUTER_API_KEY in your .env file.');
    }

    // Convert model name for OpenRouter API
    const openrouterModelName = getOpenRouterModelName(modelName);
    console.log(`✅ Calling OpenRouter with model: ${openrouterModelName} (original: ${modelName})`);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: openrouterModelName,
        messages,
        temperature,
        max_tokens: 2000,
      },
      {  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://voice-coding-assistant.com',
          'X-Title': 'Voice Coding Assistant',
        },
      }
    );

    return {
      text: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: response.data.model || openrouterModelName
    };
  } catch (error: any) {
    console.error('❌ OpenRouter API error:', error.response?.data || error.message);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in the .env file.');
    } else if (error.response?.status === 402) {
      throw new Error('OpenRouter account has insufficient credits. Please add credits to your account.');
    } else if (error.response?.status === 429) {
      throw new Error('OpenRouter rate limit exceeded. Please try again later.');
    }
    
    throw new Error(`Failed to get response from AI models: ${error.message}`);
  }
}

// Calculate cost of API usage
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelName: string
): number {
  const modelConfig = MODEL_CONFIGS[modelName] || MODEL_CONFIGS['gpt-4o'];
  
  const inputCost = (inputTokens / 1000) * modelConfig.inputCostPer1K;
  const outputCost = (outputTokens / 1000) * modelConfig.outputCostPer1K;
  
  return inputCost + outputCost;
}