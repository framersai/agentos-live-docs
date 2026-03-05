/**
 * @file social-posts.controller.ts
 * @description HTTP controller for cross-platform social post management.
 *
 * ## Route Summary
 *
 * | Method | Path                                        | Description                    |
 * |--------|---------------------------------------------|--------------------------------|
 * | POST   | /api/wunderland/social-posts                | Create a draft post            |
 * | GET    | /api/wunderland/social-posts                | List posts with filters        |
 * | GET    | /api/wunderland/social-posts/:id            | Get a single post              |
 * | PUT    | /api/wunderland/social-posts/:id/schedule   | Schedule a draft post          |
 * | POST   | /api/wunderland/social-posts/:id/publish    | Publish a post immediately     |
 * | POST   | /api/wunderland/social-posts/:id/retry      | Retry a failed post            |
 * | DELETE | /api/wunderland/social-posts/:id            | Delete a post                  |
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SocialPostsService } from './social-posts.service.js';
import { CreateSocialPostDto } from './dto/create-social-post.dto.js';
import { ScheduleSocialPostDto } from './dto/schedule-social-post.dto.js';

@Controller('api/wunderland/social-posts')
export class SocialPostsController {
  constructor(@Inject(SocialPostsService) private readonly service: SocialPostsService) {}

  /**
   * Create a new social post draft.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDraft(@Body() dto: CreateSocialPostDto) {
    const post = await this.service.createDraft(
      dto.seedId,
      dto.baseContent,
      dto.platforms,
      dto.adaptations,
      dto.mediaUrls,
      dto.scheduledAt
    );
    return { post };
  }

  /**
   * List social posts with optional filters.
   */
  @Get()
  async listPosts(
    @Query('seedId') seedId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.service.listPosts({
      seedId: seedId || undefined,
      status: status || undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  /**
   * Get a single social post by ID.
   */
  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.service.getPost(id);
    return { post };
  }

  /**
   * Schedule a draft post for future publishing.
   */
  @Put(':id/schedule')
  async schedulePost(@Param('id') id: string, @Body() dto: ScheduleSocialPostDto) {
    const post = await this.service.schedulePost(id, dto.scheduledAt);
    return { post };
  }

  /**
   * Publish a post immediately by moving it to 'scheduled' with now() timestamp,
   * which the scheduler will pick up on the next tick.
   */
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishNow(@Param('id') id: string) {
    const now = new Date().toISOString();
    // Move draft -> scheduled with immediate timestamp
    const post = await this.service.getPost(id);
    if (post.status === 'draft') {
      await this.service.schedulePost(id, now);
    }
    // Start publishing immediately
    const published = await this.service.startPublishing(id);
    return { post: published };
  }

  /**
   * Retry a failed post.
   */
  @Post(':id/retry')
  @HttpCode(HttpStatus.OK)
  async retryPost(@Param('id') id: string) {
    const post = await this.service.retryPost(id);
    return { post };
  }

  /**
   * Delete a social post.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.service.deletePost(id);
  }
}
