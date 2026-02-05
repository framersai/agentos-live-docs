import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LoadedPrompt {
  id: string;
  name: string;
  description: string | null;
  runnerType: 'llm_prompt' | 'http_endpoint';
  systemPrompt: string | null;
  userPromptTemplate: string | null;
  modelConfig: Record<string, unknown> | null;
  endpointUrl: string | null;
  endpointMethod: string | null;
  endpointHeaders: Record<string, string> | null;
  endpointBodyTemplate: string | null;
  parentId: string | null;
  variantLabel: string | null;
  recommendedGraders: string[];
  graderWeights: Record<string, number>;
  recommendedDatasets: string[];
  graderRationale: string | null;
  notes: string | null;
  source: 'file';
}

@Injectable()
export class PromptLoaderService implements OnModuleInit {
  private readonly logger = new Logger(PromptLoaderService.name);
  private prompts = new Map<string, LoadedPrompt>();
  private promptsDir: string;

  constructor() {
    // prompts/ directory lives next to src/ in the backend package
    this.promptsDir = path.resolve(__dirname, '..', '..', 'prompts');
  }

  onModuleInit() {
    this.loadAll();
  }

  /**
   * Read all .md files from the prompts directory and parse them.
   */
  loadAll(): { loaded: number } {
    this.prompts.clear();

    if (!fs.existsSync(this.promptsDir)) {
      this.logger.warn(`Prompts directory not found: ${this.promptsDir}`);
      return { loaded: 0 };
    }

    const files = fs.readdirSync(this.promptsDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.promptsDir, file), 'utf-8');
        const prompt = this.parseMarkdown(file, content);
        this.prompts.set(prompt.id, prompt);
      } catch (err) {
        this.logger.error(`Failed to parse ${file}: ${err}`);
      }
    }

    this.logger.log(`Loaded ${this.prompts.size} prompts from ${this.promptsDir}`);
    return { loaded: this.prompts.size };
  }

  findAll(): LoadedPrompt[] {
    return Array.from(this.prompts.values());
  }

  findOne(id: string): LoadedPrompt {
    const prompt = this.prompts.get(id);
    if (!prompt) {
      throw new NotFoundException(`Prompt "${id}" not found`);
    }
    return prompt;
  }

  findMany(ids: string[]): LoadedPrompt[] {
    return ids.map((id) => this.findOne(id));
  }

  /**
   * Parse a markdown file with simple frontmatter into a LoadedPrompt.
   *
   * Format:
   * ---
   * key: value
   * key: value
   * ---
   * Body text (system prompt)
   */
  private parseMarkdown(filename: string, content: string): LoadedPrompt {
    const id = filename.replace(/\.md$/, '');

    // Split frontmatter from body
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!fmMatch) {
      throw new Error(`No frontmatter found in ${filename}`);
    }

    const frontmatterText = fmMatch[1];
    const body = fmMatch[2].trim();

    // Parse flat key: value pairs from frontmatter
    const fm: Record<string, string> = {};
    for (const line of frontmatterText.split('\n')) {
      const match = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
      if (match) {
        fm[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }

    if (!fm.name) {
      throw new Error(`Missing "name" in frontmatter of ${filename}`);
    }
    if (!fm.runner) {
      throw new Error(`Missing "runner" in frontmatter of ${filename}`);
    }

    // Build model config from optional fields
    const modelConfig: Record<string, unknown> = {};
    if (fm.temperature !== undefined) modelConfig.temperature = parseFloat(fm.temperature);
    if (fm.max_tokens !== undefined) modelConfig.maxTokens = parseInt(fm.max_tokens, 10);
    if (fm.provider) modelConfig.provider = fm.provider;
    if (fm.model) modelConfig.model = fm.model;

    // Parse comma-separated recommendation lists
    const parseList = (val: string | undefined): string[] =>
      val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [];

    // Parse weighted grader list: "grader-id:0.4, grader-id2:0.3" → ids + weights
    const parseWeightedList = (val: string | undefined): { ids: string[]; weights: Record<string, number> } => {
      if (!val) return { ids: [], weights: {} };
      const ids: string[] = [];
      const weights: Record<string, number> = {};
      for (const item of val.split(',').map((s) => s.trim()).filter(Boolean)) {
        const colonIdx = item.lastIndexOf(':');
        if (colonIdx > 0) {
          const maybeWeight = parseFloat(item.slice(colonIdx + 1));
          if (!isNaN(maybeWeight)) {
            const id = item.slice(0, colonIdx);
            ids.push(id);
            weights[id] = maybeWeight;
            continue;
          }
        }
        ids.push(item);
        weights[item] = 1.0;
      }
      return { ids, weights };
    };

    const graderResult = parseWeightedList(fm.recommended_graders);

    return {
      id,
      name: fm.name,
      description: fm.description || null,
      runnerType: fm.runner as 'llm_prompt' | 'http_endpoint',
      systemPrompt: body || null,
      userPromptTemplate: fm.user_template || null,
      modelConfig: Object.keys(modelConfig).length > 0 ? modelConfig : null,
      endpointUrl: fm.endpoint_url || null,
      endpointMethod: fm.endpoint_method || null,
      endpointHeaders: null,
      endpointBodyTemplate: fm.endpoint_body_template || null,
      parentId: null,
      variantLabel: null,
      recommendedGraders: graderResult.ids,
      graderWeights: graderResult.weights,
      recommendedDatasets: parseList(fm.recommended_datasets),
      graderRationale: fm.grader_rationale || null,
      notes: fm.notes || null,
      source: 'file',
    };
  }
}
