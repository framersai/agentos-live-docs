import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { PromptLoaderService } from './prompt-loader.service';
import { CandidateRunnerService } from './candidate-runner.service';

@Controller('prompts')
export class PromptsController {
  constructor(
    private promptLoader: PromptLoaderService,
    private runner: CandidateRunnerService,
  ) {}

  @Get()
  listPrompts() {
    return this.promptLoader.findAll();
  }

  @Get(':id')
  getPrompt(@Param('id') id: string) {
    return this.promptLoader.findOne(id);
  }

  @Post(':id/test')
  async testPrompt(
    @Param('id') id: string,
    @Body() body: { input: string; context?: string; metadata?: Record<string, unknown> },
  ) {
    const prompt = this.promptLoader.findOne(id);
    const result = await this.runner.run(prompt, {
      input: body.input,
      context: body.context,
      metadata: body.metadata,
    });
    return result;
  }

  @Put(':id')
  updatePrompt(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      runnerType?: 'llm_prompt' | 'http_endpoint';
      systemPrompt?: string;
      userPromptTemplate?: string;
      temperature?: number;
      maxTokens?: number;
      provider?: string;
      model?: string;
      endpointUrl?: string;
      endpointMethod?: string;
      endpointBodyTemplate?: string;
      recommendedGraders?: string[];
      graderWeights?: Record<string, number>;
      recommendedDatasets?: string[];
      graderRationale?: string;
      notes?: string;
    },
  ) {
    return this.promptLoader.updatePrompt(id, body);
  }

  @Post('reload')
  reloadPrompts() {
    return this.promptLoader.loadAll();
  }
}
