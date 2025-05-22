// backend/routes/chat.ts
import { Request, Response } from 'express';
import { callOpenAI } from '../utils/llm.js';
import { trackCost, getSessionCost, isThresholdReached } from '../utils/cost.js';
import { MODEL_PREFERENCES } from '../config/models.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load prompt templates
function loadPromptTemplate(templateName: string): string {
  try {
    const promptPath = path.join(__dirname, '../../prompts', `${templateName}.md`);
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt template ${templateName}:`, error);
    return ''; // Return empty string if template not found
  }
}

/**
 * Handle POST /api/chat - Process chat messages
 * @param req - Express request object
 * @param res - Express response object
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const { mode, messages, language = 'python', generateDiagram = false, userId = 'default_user' } = req.body;
    
    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        message: 'Messages array is required and cannot be empty',
        error: 'INVALID_MESSAGES'
      });
      return;
    }
    
    // Check if cost threshold reached
    if (isThresholdReached(userId)) {
      const currentCost = getSessionCost(userId);
      res.status(403).json({
        message: 'Session cost threshold reached',
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCost.totalCost,
        threshold: process.env.COST_THRESHOLD || '20.00'
      });
      return;
    }
    
    // Get appropriate model for the mode
    const modelName = MODEL_PREFERENCES[mode as keyof typeof MODEL_PREFERENCES] || MODEL_PREFERENCES.coding;
    
    // Load appropriate prompt template
    const templateContent = loadPromptTemplate(mode || 'coding');
    
    // Replace placeholders in template
    const processedTemplate = templateContent
      .replace(/{{language}}/g, language)
      .replace(/{{generateDiagram}}/g, generateDiagram ? 'true' : 'false');
    
    // Prepare messages for API call
    const systemMessage = {
      role: 'system',
      content: processedTemplate || `You are a helpful assistant specializing in ${mode || 'coding'} questions. Please provide clear, detailed responses in ${language}.`
    };
    
    const apiMessages = [systemMessage, ...messages];
    
    console.log(`Processing chat request - Mode: ${mode}, Model: ${modelName}, User: ${userId}`);
    
    // Call LLM API
    const response = await callOpenAI(apiMessages, modelName);
    
    // Track cost if usage information is available
    if (response.usage) {
      const { prompt_tokens, completion_tokens } = response.usage;
      const sessionCost = trackCost(
        userId,
        modelName,
        prompt_tokens || 0,
        completion_tokens || 0
      );
      
      // Return response with cost information
      res.status(200).json({
        message: response.text,
        model: response.model,
        usage: response.usage,
        sessionCost,
        cost: {
          prompt_tokens: prompt_tokens || 0,
          completion_tokens: completion_tokens || 0,
          total_tokens: (prompt_tokens || 0) + (completion_tokens || 0)
        }
      });
      return;
    }
    
    // Return response without detailed cost tracking
    const sessionCostDetail = getSessionCost(userId);
    res.status(200).json({
      message: response.text,
      model: response.model,
      sessionCost: sessionCostDetail.totalCost
    });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Error processing chat request';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error';
        statusCode = 503;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'AI service rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
        statusCode = 408;
      }
    }
    
    res.status(statusCode).json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'production' ? 'CHAT_ERROR' : (error as Error).message
    });
  }
}