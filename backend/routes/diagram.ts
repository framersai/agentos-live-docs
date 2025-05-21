import { Request, Response } from 'express';
import { callOpenAI } from '../utils/llm.js';
import { trackCost, getSessionCost, isThresholdReached } from '../utils/cost.js';

// Generate diagrams from text descriptions
export async function POST(req: Request, res: Response) {
  try {
    const { description, type = 'mermaid', userId = 'default' } = req.body;
    
    // Check if cost threshold reached
    if (isThresholdReached(userId)) {
      return res.status(403).json({
        message: 'Session cost threshold reached',
        currentCost: getSessionCost(userId)
      });
    }
    
    // Create a prompt to generate the diagram
    const diagramPrompt = [
      {
        role: 'system',
        content: `You are a diagram generator. The user will provide a description of a diagram they want to create. Generate a valid ${type} syntax that correctly represents their description. Only return the diagram code without any explanations or markdown formatting.`
      },
      {
        role: 'user',
        content: description
      }
    ];
    
    // Call LLM API to generate diagram code
    const response = await callOpenAI(diagramPrompt, 'gpt-4o');
    
    // Extract the diagram code from the response
    let diagramCode = response.text;
    
    // Clean up the diagram code (remove markdown code fences if present)
    diagramCode = diagramCode.replace(/```(?:mermaid|plantuml|graphviz)?\n/g, '');
    diagramCode = diagramCode.replace(/```$/g, '');
    
    // Track cost
    if (response.usage) {
      const { prompt_tokens, completion_tokens } = response.usage;
      const sessionCost = trackCost(
        userId,
        'gpt-4o',
        prompt_tokens || 0,
        completion_tokens || 0
      );
      
      // Return response with cost information
      return res.status(200).json({
        diagramCode,
        type,
        usage: response.usage,
        sessionCost
      });
    }
    
    return res.status(200).json({
      diagramCode,
      type,
      sessionCost: getSessionCost(userId)
    });
  } catch (error) {
    console.error('Error in diagram endpoint:', error);
    return res.status(500).json({
      message: 'Error generating diagram',
      error: (error as Error).message
    });
  }
}