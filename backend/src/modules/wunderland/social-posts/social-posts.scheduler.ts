/**
 * @file social-posts.scheduler.ts
 * @description Cron-based scheduler that polls for due social posts
 * and triggers the publishing pipeline.
 *
 * Runs every minute to check for scheduled posts whose `scheduled_at`
 * timestamp has passed. Transitions them to 'publishing' state so
 * the AgentOS integration layer can handle per-platform delivery.
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SocialPostsService } from './social-posts.service.js';

@Injectable()
export class SocialPostsScheduler {
  private readonly logger = new Logger(SocialPostsScheduler.name);

  constructor(@Inject(SocialPostsService) private readonly postsService: SocialPostsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processDuePosts() {
    try {
      const duePosts = await this.postsService.getDuePosts();
      if (duePosts.length === 0) return;

      this.logger.log(`Found ${duePosts.length} due social post(s) to publish.`);

      for (const post of duePosts) {
        this.logger.log(
          `Publishing scheduled post ${post.id} to ${post.platforms.join(', ')}`
        );
        try {
          await this.postsService.startPublishing(post.id);
          // Actual platform publishing is handled by the AgentOS integration layer
          // which calls markPlatformResult for each platform, then markPublished.
        } catch (err) {
          this.logger.error(`Failed to start publishing post ${post.id}: ${err}`);
          await this.postsService.markError(post.id, String(err));
        }
      }
    } catch (err) {
      this.logger.error(`Error in processDuePosts cron: ${err}`);
    }
  }
}
