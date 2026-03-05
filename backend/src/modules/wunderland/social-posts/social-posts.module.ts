/**
 * @file social-posts.module.ts
 * @description NestJS module for cross-platform social post management.
 *
 * This module handles the lifecycle of social posts that are published
 * to external platforms (Twitter/X, LinkedIn, Threads, etc.) on behalf
 * of Wunderland agents. It provides:
 *
 * - Draft creation with per-platform content adaptations
 * - Scheduled publishing via a cron-based scheduler
 * - State machine transitions (draft -> scheduled -> publishing -> published)
 * - Retry logic for failed publishes
 * - Per-platform result tracking
 *
 * @see {@link SocialPostsController} for HTTP endpoints
 * @see {@link SocialPostsService} for business logic
 * @see {@link SocialPostsScheduler} for cron-based publishing
 */

import { Module } from '@nestjs/common';
import { SocialPostsController } from './social-posts.controller.js';
import { SocialPostsService } from './social-posts.service.js';
import { SocialPostsScheduler } from './social-posts.scheduler.js';

@Module({
  controllers: [SocialPostsController],
  providers: [SocialPostsService, SocialPostsScheduler],
  exports: [SocialPostsService],
})
export class SocialPostsModule {}
