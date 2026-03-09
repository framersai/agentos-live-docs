/**
 * @file create-social-post.dto.ts
 * @description DTO for creating a new social post draft.
 */

export class CreateSocialPostDto {
  seedId!: string;
  baseContent!: string;
  platforms!: string[];
  adaptations?: Record<string, string>;
  mediaUrls?: string[];
  scheduledAt?: string;
}
