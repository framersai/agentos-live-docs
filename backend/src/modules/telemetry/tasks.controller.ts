import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { TasksService, type RuntimeTaskType } from './tasks.service.js';

const isValidStatus = (s: string): boolean =>
  s === 'queued' ||
  s === 'running' ||
  s === 'completed' ||
  s === 'failed' ||
  s === 'cancelled' ||
  s === 'all';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get('overview')
  async overview(@CurrentUser('id') userId: string) {
    return { tasks: await this.tasks.overview(userId) };
  }

  @Get(':seedId')
  async list(
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string
  ) {
    if (status && !isValidStatus(status.trim())) {
      throw new BadRequestException(
        'Invalid status. Use: queued, running, completed, failed, cancelled, all'
      );
    }

    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    const effectiveLimit = Number.isFinite(parsedLimit) ? parsedLimit : undefined;
    const tasks = await this.tasks.listTasks(userId, seedId, {
      status,
      limit: effectiveLimit,
    });
    return {
      seedId,
      status: status ?? 'all',
      limit: Math.min(Math.max(1, Number(effectiveLimit ?? 50)), 200),
      tasks,
    };
  }

  @Post(':seedId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Body() body: { taskType?: RuntimeTaskType; title?: string; description?: string }
  ) {
    if (!body?.taskType || !body?.title) {
      throw new BadRequestException('taskType and title are required');
    }
    const task = await this.tasks.createTask(userId, seedId, {
      taskType: body.taskType,
      title: body.title,
      description: body.description ?? null,
    });
    return { task };
  }

  @Get(':seedId/:taskId')
  async get(
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Param('taskId') taskId: string
  ) {
    const task = await this.tasks.getTask(userId, seedId, taskId);
    return { task };
  }

  @Delete(':seedId/:taskId')
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Param('taskId') taskId: string
  ) {
    const task = await this.tasks.cancelTask(userId, seedId, taskId);
    return { task };
  }
}
