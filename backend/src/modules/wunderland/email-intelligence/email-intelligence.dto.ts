/**
 * @file email-intelligence.dto.ts
 * @description DTOs for the EmailIntelligenceController endpoints.
 */

import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

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
