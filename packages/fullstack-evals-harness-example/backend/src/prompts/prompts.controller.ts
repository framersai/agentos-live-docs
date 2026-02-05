import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import {
  PromptsService,
  CreatePromptTemplateDto,
  UpdatePromptTemplateDto,
} from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  findAll() {
    return this.promptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePromptTemplateDto) {
    return this.promptsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromptTemplateDto) {
    return this.promptsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promptsService.remove(id);
  }
}
