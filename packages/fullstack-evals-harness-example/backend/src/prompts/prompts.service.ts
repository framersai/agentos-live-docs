import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { DB_ADAPTER, IDbAdapter } from '../database/db.module';

export interface CreatePromptTemplateDto {
  name: string;
  description?: string;
  systemPrompt?: string;
  userPrompt: string;
}

export interface UpdatePromptTemplateDto {
  name?: string;
  description?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

@Injectable()
export class PromptsService {
  constructor(
    @Inject(DB_ADAPTER)
    private db: IDbAdapter
  ) {}

  async findAll() {
    const templates = await this.db.findAllPromptTemplates();
    return templates.map((t) => ({
      ...t,
      variables: t.variables ? JSON.parse(t.variables) : [],
    }));
  }

  async findOne(id: string) {
    const template = await this.db.findPromptTemplateById(id);
    if (!template) {
      throw new NotFoundException(`Prompt template ${id} not found`);
    }
    return {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : [],
    };
  }

  async create(dto: CreatePromptTemplateDto) {
    const now = new Date();
    const variables = this.extractVariables(dto.userPrompt, dto.systemPrompt);

    const template = await this.db.insertPromptTemplate({
      id: nanoid(),
      name: dto.name,
      description: dto.description,
      systemPrompt: dto.systemPrompt || null,
      userPrompt: dto.userPrompt,
      variables: JSON.stringify(variables),
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...template,
      variables,
    };
  }

  async update(id: string, dto: UpdatePromptTemplateDto) {
    const existing = await this.db.findPromptTemplateById(id);
    if (!existing) {
      throw new NotFoundException(`Prompt template ${id} not found`);
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.systemPrompt !== undefined) updates.systemPrompt = dto.systemPrompt;
    if (dto.userPrompt !== undefined) updates.userPrompt = dto.userPrompt;

    // Re-extract variables if prompts changed
    const userPrompt = dto.userPrompt ?? existing.userPrompt;
    const systemPrompt = dto.systemPrompt ?? existing.systemPrompt;
    updates.variables = JSON.stringify(this.extractVariables(userPrompt, systemPrompt));

    await this.db.updatePromptTemplate(id, updates);
    return this.findOne(id);
  }

  async remove(id: string) {
    const existing = await this.db.findPromptTemplateById(id);
    if (!existing) {
      throw new NotFoundException(`Prompt template ${id} not found`);
    }
    await this.db.deletePromptTemplate(id);
    return { deleted: true };
  }

  /**
   * Extract {{variable}} names from prompt text.
   */
  private extractVariables(userPrompt: string, systemPrompt?: string | null): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const vars = new Set<string>();
    const text = (systemPrompt || '') + '\n' + userPrompt;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }

  /**
   * Render a template by substituting variables.
   */
  renderTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return variables[key] ?? `{{${key}}}`;
    });
  }
}
