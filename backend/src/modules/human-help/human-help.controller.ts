/**
 * @file human-help.controller.ts
 * @description NestJS controller for consumer-facing human help tasks,
 * VA operations, and admin overview.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { ProTierGuard } from '../../common/guards/pro-tier.guard.js';
import { VaAdminGuard } from '../../common/guards/va-admin.guard.js';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard.js';
import { HumanHelpService } from './human-help.service.js';

@Controller('human-help')
export class HumanHelpController {
  constructor(private readonly helpService: HumanHelpService) {}

  // =========================================================================
  // Consumer endpoints (require auth + Pioneer tier)
  // =========================================================================

  @UseGuards(AuthGuard, ProTierGuard)
  @Get('quota')
  async getQuota(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    const userId = user.sub || user.id;
    const tier = user.tier || user.subscriptionTier || 'free';

    const quota = await this.helpService.getQuota(userId, tier);
    res.json({ quota });
  }

  @UseGuards(AuthGuard, ProTierGuard)
  @Get('tasks')
  async listTasks(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    const userId = user.sub || user.id;
    const { status, limit, offset } = req.query as {
      status?: string;
      limit?: string;
      offset?: string;
    };

    const tasks = await this.helpService.listUserTasks(userId, {
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    res.json({ tasks });
  }

  @UseGuards(AuthGuard, ProTierGuard)
  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    const userId = user.sub || user.id;
    const { title, description, category, priority, seedId, projectName, estimatedHours } =
      req.body as {
        title?: string;
        description?: string;
        category?: string;
        priority?: string;
        seedId?: string;
        projectName?: string;
        estimatedHours?: number;
      };

    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required.' });
      return;
    }

    try {
      const task = await this.helpService.createTask({
        userId,
        title,
        description,
        category,
        priority,
        seedId,
        projectName,
        estimatedHours,
      });

      res.status(201).json({ task });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  @UseGuards(AuthGuard, ProTierGuard)
  @Get('tasks/:id')
  async getTask(@Req() req: Request, @Res() res: Response): Promise<void> {
    const taskId = (req as any).params.id;

    try {
      const task = await this.helpService.getTask(taskId);

      // Ensure user owns the task
      const user = (req as any).user;
      const userId = user.sub || user.id;
      if (task.userId !== userId && !user.isVaAdmin) {
        res.status(403).json({ message: 'Not authorized to view this task.' });
        return;
      }

      res.json({ task });
    } catch (err: any) {
      res.status(404).json({ message: 'Task not found.' });
    }
  }

  // =========================================================================
  // VA endpoints (require auth + VA admin)
  // =========================================================================

  @UseGuards(AuthGuard, VaAdminGuard)
  @Get('va/tasks')
  async vaListTasks(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    const { status } = req.query as { status?: string };

    const tasks = await this.helpService.listVaTasks(user.email, { status });
    res.json({ tasks });
  }

  @UseGuards(AuthGuard, VaAdminGuard)
  @Post('va/tasks/:id/claim')
  @HttpCode(HttpStatus.OK)
  async vaClaimTask(@Req() req: Request, @Res() res: Response): Promise<void> {
    const taskId = (req as any).params.id;
    const user = (req as any).user;

    try {
      const task = await this.helpService.claimTask(taskId, user.email, user.name);
      res.json({ task });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  @UseGuards(AuthGuard, VaAdminGuard)
  @Post('va/tasks/:id/deduct')
  @HttpCode(HttpStatus.OK)
  async vaDeductHours(@Req() req: Request, @Res() res: Response): Promise<void> {
    const taskId = (req as any).params.id;
    const user = (req as any).user;
    const { amount, reason } = req.body as { amount?: number; reason?: string };

    if (amount === undefined || !reason) {
      res.status(400).json({ message: 'Amount and reason are required.' });
      return;
    }

    try {
      const result = await this.helpService.deductHours({
        taskId,
        vaEmail: user.email,
        vaName: user.name,
        amount,
        reason,
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  @UseGuards(AuthGuard, VaAdminGuard)
  @Patch('va/tasks/:id/status')
  async vaUpdateStatus(@Req() req: Request, @Res() res: Response): Promise<void> {
    const taskId = (req as any).params.id;
    const { status } = req.body as { status?: string };

    if (!status) {
      res.status(400).json({ message: 'Status is required.' });
      return;
    }

    try {
      const task = await this.helpService.updateTaskStatus(taskId, status);
      res.json({ task });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  @UseGuards(AuthGuard, VaAdminGuard)
  @Get('va/stats')
  async vaStats(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    const stats = await this.helpService.getVaStats(user.email);
    res.json({ stats });
  }

  // =========================================================================
  // Admin endpoints (require super admin)
  // =========================================================================

  @UseGuards(AuthGuard, SuperAdminGuard)
  @Get('admin/overview')
  async adminOverview(@Req() _req: Request, @Res() res: Response): Promise<void> {
    const overview = await this.helpService.getAdminOverview();
    res.json({ overview });
  }

  @UseGuards(AuthGuard, SuperAdminGuard)
  @Post('admin/tasks/:id/assign')
  @HttpCode(HttpStatus.OK)
  async adminAssignTask(@Req() req: Request, @Res() res: Response): Promise<void> {
    const taskId = (req as any).params.id;
    const { vaEmail, vaName } = req.body as { vaEmail?: string; vaName?: string };

    if (!vaEmail) {
      res.status(400).json({ message: 'VA email is required.' });
      return;
    }

    try {
      const task = await this.helpService.assignTask(taskId, vaEmail, vaName);
      res.json({ task });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
