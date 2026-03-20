/**
 * @file email-intelligence.dto.ts
 * @description DTOs for the EmailIntelligenceController endpoints.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';

export class SeedIdQuery {
  @IsString()
  seedId!: string;
}

export class AccountStatusQuery extends SeedIdQuery {}

export class ThreadQuery extends SeedIdQuery {
  @IsString()
  accountId!: string;
}

export class ListMessagesQuery extends SeedIdQuery {
  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  isRead?: string;

  @IsOptional()
  @IsNumber()
  after?: number;

  @IsOptional()
  @IsNumber()
  before?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class ListThreadsQuery extends SeedIdQuery {
  @IsString()
  accountId!: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsNumber()
  syncIntervalMs?: number;

  @IsOptional()
  @IsBoolean()
  syncEnabled?: boolean;
}

// ---------------------------------------------------------------------------
// Project DTOs
// ---------------------------------------------------------------------------

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  threads?: Array<{ threadId: string; accountId: string }>;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class AddThreadsDto {
  threads!: Array<{ threadId: string; accountId: string }>;
}

export class MergeProjectsDto {
  @IsString()
  projectIdA!: string;

  @IsString()
  projectIdB!: string;
}

export class ApplyProposalsDto {
  proposals!: any[];
}

// ---------------------------------------------------------------------------
// Intelligence / RAG DTOs
// ---------------------------------------------------------------------------

export class EmailQueryDto {
  @IsString()
  query!: string;

  @IsOptional()
  accountIds?: string[];

  @IsOptional()
  projectIds?: string[];

  @IsOptional()
  threadIds?: string[];

  @IsOptional()
  dateRange?: { from?: number; to?: number };

  @IsOptional()
  @IsBoolean()
  includeAttachments?: boolean;

  @IsOptional()
  @IsNumber()
  topK?: number;
}

// ---------------------------------------------------------------------------
// Attachment query DTOs
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Report / Digest DTOs
// ---------------------------------------------------------------------------

export class GenerateReportDto {
  @IsString()
  @IsIn(['pdf', 'markdown', 'json'])
  format!: string;
}

export class CreateDigestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  schedule!: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsString()
  deliveryChannel!: string;

  @IsString()
  deliveryTarget!: string;

  @IsOptional()
  @IsArray()
  filterProjects?: string[];

  @IsOptional()
  @IsArray()
  filterAccounts?: string[];

  @IsOptional()
  @IsBoolean()
  includeAttachments?: boolean;

  @IsOptional()
  @IsBoolean()
  includeTimeline?: boolean;
}

export class UpdateDigestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsString()
  deliveryChannel?: string;

  @IsOptional()
  @IsString()
  deliveryTarget?: string;

  @IsOptional()
  @IsBoolean()
  includeAttachments?: boolean;

  @IsOptional()
  @IsBoolean()
  includeTimeline?: boolean;
}

// ---------------------------------------------------------------------------
// Attachment query DTOs
// ---------------------------------------------------------------------------

export class ListAttachmentsQuery extends SeedIdQuery {
  @IsOptional()
  @IsString()
  messageId?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}
