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

export async function POST(req: Request, res: Response) {
  try {
    const { mode, messages, language = 'python', generateDiagram = false, userId = 'default' } = req.body;
    
    // Check if cost threshold reached
    if (isThresholdReached(userId)) {
      return res.status(403).json({
        message: 'Session cost threshold reached',
        currentCost: getSessionCost(userId)
      });
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
      content: processedTemplate
    };
    
    const apiMessages = [systemMessage, ...messages];
    
    // Call LLM API
    const response = await callOpenAI(apiMessages, modelName);
    
    // Track cost
    if (response.usage) {
      const { prompt_tokens, completion_tokens } = response.usage;
      const sessionCost = trackCost(
        userId,
        modelName,
        prompt_tokens || 0,
        completion_tokens || 0
      );
      
      // Return response with cost information
      return res.status(200).json({
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
    }
    
    return res.status(200).json({
      message: response.text,
      model: response.model,
      sessionCost: getSessionCost(userId)
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      message: 'Error processing chat request',
      error: (error as Error).message
    });
  }
}