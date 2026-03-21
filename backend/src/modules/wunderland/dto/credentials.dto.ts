/**
 * @file credentials.dto.ts
 * @description DTOs for agent credential vault endpoints.
 */

import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class ListCredentialsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  seedId?: string;
}

export class CreateCredentialDto {
  @IsString()
  @MaxLength(128)
  seedId!: string;

  @IsString()
  @MaxLength(64)
  type!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsString()
  @MaxLength(4096)
  value!: string;

  /** Optional JSON string with provider-specific metadata (e.g. OAuth refresh token). */
  @IsOptional()
  @IsString()
  @MaxLength(8192)
  metadata?: string;

  /** Optional expiry timestamp in epoch milliseconds. */
  @IsOptional()
  @IsNumber()
  expiresAt?: number;
}

export class RotateCredentialDto {
  @IsString()
  @MaxLength(4096)
  value!: string;
}
