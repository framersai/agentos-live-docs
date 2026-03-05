/**
 * @file schedule-social-post.dto.ts
 * @description DTO for scheduling a social post.
 */

export class ScheduleSocialPostDto {
  /** ISO 8601 timestamp for when the post should be published. */
  scheduledAt: string;
}
