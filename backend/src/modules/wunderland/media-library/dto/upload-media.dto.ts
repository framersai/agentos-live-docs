/**
 * @file upload-media.dto.ts
 * @description DTO for media upload requests.
 */

export class UploadMediaDto {
  /** Agent seed ID (owner). */
  seedId: string;

  /** Optional tags for organizing the asset. */
  tags?: string[];
}

export class TagMediaDto {
  /** Updated tag list for the asset. */
  tags: string[];
}

export class ListMediaQueryDto {
  /** Filter by agent seed ID. */
  seedId?: string;

  /** Comma-separated list of tags to filter by. */
  tags?: string;

  /** Filter by MIME type (e.g. "image/png" or "image" for all images). */
  mimeType?: string;

  /** Max items to return (default 50). */
  limit?: string;

  /** Pagination offset (default 0). */
  offset?: string;
}
