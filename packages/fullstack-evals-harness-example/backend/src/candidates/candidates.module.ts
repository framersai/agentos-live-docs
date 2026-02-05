import { Module } from '@nestjs/common';
import { PromptsController } from './prompts.controller';
import { PromptLoaderService } from './prompt-loader.service';
import { CandidateRunnerService } from './candidate-runner.service';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [PromptsController],
  providers: [PromptLoaderService, CandidateRunnerService],
  exports: [PromptLoaderService, CandidateRunnerService],
})
export class CandidatesModule {}
