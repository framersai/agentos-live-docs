import { Controller, Get, Post, Param, Body } from '@nestjs/common';
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

  @Post('reload')
  reloadPrompts() {
    return this.promptLoader.loadAll();
  }
}
