/**
 * @file Diagram API route handlers.
 * @description Handles requests to the /api/diagram endpoint for generating diagrams
 * from textual descriptions using an LLM.
 * @version 1.2.3 - Safely access MODEL_PREFERENCES.diagram_generation.
 */

import { Request, Response } from 'express';
import { callLlm, initializeLlmServices } from '../../core/llm/llm.factory.js';
import { IChatMessage, ILlmUsage } from '../../core/llm/llm.interfaces.js';
import { CostService } from '../../core/cost/cost.service.js';
import { MODEL_PREFERENCES, getModelPrice, ModelConfig, MODEL_PRICING } from '../../../config/models.config.js';

initializeLlmServices(); // Ensures LLM services are ready

/**
 * Calculates the cost of an LLM interaction for diagram generation.
 */
function calculateDiagramLlmCost(modelId: string, usage?: ILlmUsage): number {
  if (!usage || typeof usage.prompt_tokens !== 'number' || typeof usage.completion_tokens !== 'number') {
    console.warn(`Diagram Cost calculation: Invalid or missing usage data for model "${modelId}". Cost set to $0. Usage: ${JSON.stringify(usage)}`);
    return 0;
  }
  const modelPriceConfig: ModelConfig | undefined = getModelPrice(modelId);
  if (!modelPriceConfig) {
    console.warn(`Diagram Cost calculation: Pricing for model "${modelId}" not found. Attempting default pricing. Cost will be $0 if default not found.`);
    const defaultPricing = MODEL_PRICING['default'];
    if (defaultPricing) {
        return (usage.prompt_tokens / 1000) * defaultPricing.inputCostPer1K +
               (usage.completion_tokens / 1000) * defaultPricing.outputCostPer1K;
    }
    return 0;
  }
  const inputCost = (usage.prompt_tokens / 1000) * modelPriceConfig.inputCostPer1K;
  const outputCost = (usage.completion_tokens / 1000) * modelPriceConfig.outputCostPer1K;
  return inputCost + outputCost;
}

/**
 * Handles POST requests to /api/diagram for generating diagrams.
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const {
      description,
      type = 'mermaid', // Default diagram type
      // @ts-ignore - req.user is a custom property potentially set by auth middleware
      userId = req.user?.id || 'default_user_diagram',
    } = req.body as { description: string; type?: string; userId?: string };

    if (!description || typeof description !== 'string' || description.trim() === '') {
      res.status(400).json({ message: 'Diagram description is required and cannot be empty.', error: 'MISSING_DESCRIPTION' });
      return;
    }

    if (CostService.isSessionCostThresholdReached(userId)) {
      const currentCostDetail = CostService.getSessionCost(userId);
      res.status(403).json({
        message: 'Session cost threshold reached. Further requests are blocked for this session.',
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCostDetail.totalCost,
        threshold: parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'),
      });
      return;
    }

    // Safely access diagram_generation model preference
    let diagramModelId: string;
    // Check if 'diagram_generation' key exists and has a truthy value in MODEL_PREFERENCES
    if ('diagram_generation' in MODEL_PREFERENCES && (MODEL_PREFERENCES as any).diagram_generation) {
        diagramModelId = (MODEL_PREFERENCES as any).diagram_generation;
    } else {
        // Fallback if diagram_generation is not defined or is falsy
        diagramModelId = MODEL_PREFERENCES.general || MODEL_PREFERENCES.default;
        console.warn(`DiagramRoutes: 'MODEL_PREFERENCES.diagram_generation' is not defined or is empty in models.config.ts. Falling back to model: '${diagramModelId}'. Consider adding a specific model preference for diagrams.`);
    }

    const diagramPromptMessages: IChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert diagram generator. The user will provide a description.
Your task is to generate valid ${type} syntax that accurately represents their description.
ONLY return the raw diagram code itself. Do NOT include any explanations, apologies, or markdown code fences like \`\`\`mermaid ... \`\`\`.
Just the pure ${type} code. If you cannot generate a valid diagram for the description, output only the exact string "DIAGRAM_GENERATION_ERROR".`,
      },
      {
        role: 'user',
        content: `Generate a ${type} diagram for the following description: ${description}`,
      },
    ];
    
    console.log(`DiagramRoutes: User [${userId}] generating ${type} diagram with model ${diagramModelId}. Description: "${description.substring(0, 100)}..."`);

    const llmResponse = await callLlm(diagramPromptMessages, diagramModelId, { temperature: 0.2, max_tokens: 1500 });

    let diagramCode = llmResponse.text || '';
    diagramCode = diagramCode.replace(/^```(?:mermaid|plantuml|graphviz|dot|)\s*\n?/im, '');
    diagramCode = diagramCode.replace(/\n?```$/im, '');
    diagramCode = diagramCode.trim();

    if (diagramCode.toUpperCase() === "DIAGRAM_GENERATION_ERROR" || diagramCode.length < 10) {
        console.warn(`DiagramRoutes: LLM indicated an error or returned insufficient code for diagram. Raw output: "${diagramCode}"`);
        res.status(502).json({
             message: 'The AI failed to generate a valid diagram for the provided description. Please try rephrasing your description or try again later.',
             error: 'AI_DIAGRAM_GENERATION_FAILED',
             details: diagramCode.toUpperCase() === "DIAGRAM_GENERATION_ERROR" ? "AI indicated generation error." : "Generated code was too short or empty."
        });
        return;
    }
    
    const costOfThisCall = calculateDiagramLlmCost(llmResponse.model, llmResponse.usage);
    CostService.trackCost(
        userId,
        'diagram',
        costOfThisCall,
        llmResponse.model,
        llmResponse.usage?.prompt_tokens ?? 0,
        'tokens',
        llmResponse.usage?.completion_tokens ?? 0,
        'tokens',
        { diagramType: type, descriptionLength: description.length }
    );
    const sessionCostDetail = CostService.getSessionCost(userId);

    res.status(200).json({
      diagramCode,
      type,
      model: llmResponse.model,
      usage: llmResponse.usage,
      sessionCost: sessionCostDetail,
      cost: costOfThisCall,
    });

  } catch (error: any) {
    console.error('DiagramRoutes: Error in /api/diagram POST endpoint:', error.message, error.stack ? `\nStack: ${error.stack}` : '');
    if (res.headersSent) {
        return;
    }
    res.status(error.status || 500).json({
      message: error.message || 'Error generating diagram.',
      error: error.code || 'INTERNAL_DIAGRAM_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}