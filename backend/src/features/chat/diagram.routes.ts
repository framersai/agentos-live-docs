// File: backend/src/features/diagram/diagram.routes.ts

/**
 * @file Diagram API route handlers.
 * @description Handles requests to the /api/diagram endpoint for generating diagrams
 * from textual descriptions using an LLM.
 * @version 1.2.1 - Corrected Promise<void> return types and models.config import path.
 */

import { Request, Response } from 'express';
import { callLlm } from '../../core/llm/llm.factory';
import { IChatMessage, ILlmUsage } from '../../core/llm/llm.interfaces';
import { CostService } from '../../core/cost/cost.service';
// Corrected import path for models.config.ts
// Assuming diagram.routes.ts is in backend/src/features/diagram/
// and models.config.ts is in backend/config/
import { MODEL_PREFERENCES, getModelPrice, ModelConfig } from '../../../config/models.config';

/**
 * Calculates the cost of an LLM interaction for diagram generation.
 */
function calculateDiagramLlmCost(modelId: string, usage?: ILlmUsage): number {
  if (!usage || usage.prompt_tokens === null || usage.completion_tokens === null) {
    return 0;
  }
  const modelPriceConfig: ModelConfig | undefined = getModelPrice(modelId);
  if (!modelPriceConfig) {
    console.warn(`Diagram Cost calculation: Pricing for model "${modelId}" not found. Cost will be $0.`);
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
      type = 'mermaid',
      userId = 'default_user',
    } = req.body as { description: string; type?: string; userId?: string };

    if (!description) {
      res.status(400).json({ message: 'Diagram description is required.', error: 'MISSING_DESCRIPTION' });
      return; // Exit after sending response
    }

    if (CostService.isSessionCostThresholdReached(userId)) {
      const currentCostDetail = CostService.getSessionCost(userId);
      res.status(403).json({
        message: 'Session cost threshold reached. Further requests are blocked for this session.',
        error: 'COST_THRESHOLD_EXCEEDED',
        currentCost: currentCostDetail.totalCost,
        threshold: parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'),
      });
      return; // Exit after sending response
    }

    const diagramModelId = MODEL_PREFERENCES.diagram_generation || MODEL_PREFERENCES.default;

    const diagramPromptMessages: IChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert diagram generator. The user will provide a description.
Your task is to generate valid ${type} syntax that accurately represents their description.
ONLY return the raw diagram code itself. Do NOT include any explanations, apologies, or markdown code fences like \`\`\`mermaid ... \`\`\`.
Just the pure ${type} code. If you cannot generate the diagram, output "DIAGRAM_GENERATION_ERROR".`,
      },
      {
        role: 'user',
        content: `Generate a ${type} diagram for the following description: ${description}`,
      },
    ];
    
    console.log(`DiagramRoutes: Generating ${type} diagram with model ${diagramModelId} for user ${userId}`);

    const llmResponse = await callLlm(diagramPromptMessages, diagramModelId, { temperature: 0.3 });

    let diagramCode = llmResponse.text || '';
    diagramCode = diagramCode.replace(/^```(?:mermaid|plantuml|graphviz|dot)?\s*\n?/im, '');
    diagramCode = diagramCode.replace(/\n?```$/im, '');
    diagramCode = diagramCode.trim();

    if (diagramCode.toUpperCase() === "DIAGRAM_GENERATION_ERROR" || diagramCode.length < 10) {
        console.warn(`DiagramRoutes: LLM indicated an error or returned very short/empty code for diagram: "${diagramCode}"`);
        res.status(502).json({
             message: 'The AI failed to generate a valid diagram for the provided description.',
             error: 'AI_DIAGRAM_GENERATION_FAILED',
             details: diagramCode.toUpperCase() === "DIAGRAM_GENERATION_ERROR" ? "AI indicated generation error." : "Generated code too short."
        });
        return; // Exit after sending response
    }
    
    const costOfThisCall = calculateDiagramLlmCost(llmResponse.model, llmResponse.usage);
    CostService.trackCost(
        userId,
        'diagram',
        costOfThisCall,
        llmResponse.model,
        llmResponse.usage?.prompt_tokens ?? undefined,
        llmResponse.usage?.completion_tokens ?? undefined
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
    // No explicit return after res.json()

  } catch (error: any) {
    console.error('DiagramRoutes: Error in /api/diagram POST endpoint:', error);
    if (res.headersSent) {
        return;
    }
    res.status(500).json({
      message: 'Error generating diagram.',
      error: 'INTERNAL_DIAGRAM_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
