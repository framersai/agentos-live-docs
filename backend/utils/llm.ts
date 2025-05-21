import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
import { MODEL_CONFIGS } from '../config/models.js';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to call OpenAI API
export async function callOpenAI(
  messages: any[],
  modelName: string = 'gpt-4o',
  temperature: number = 0.7
) {
  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages,
      temperature,
      max_tokens: 2000,
    });

    return {
      text: response.choices[0].message.content,
      usage: response.usage,
      model: modelName
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
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
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: modelName,
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
      model: response.data.model
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to get response from AI models');
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