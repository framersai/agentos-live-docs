/**
 * @file vault.dto.ts
 * @description DTOs for user-level API key vault endpoints.
 */

import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVaultKeyDto {
  @IsString()
  @MaxLength(64)
  credentialType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsString()
  @MaxLength(4096)
  value!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rpmLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditsRemaining?: number;
}

export class UpdateVaultKeyDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rpmLimit?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditsRemaining?: number | null;
}

export class RotateVaultKeyDto {
  @IsString()
  @MaxLength(4096)
  value!: string;
}

export class BulkCreateVaultKeysDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVaultKeyDto)
  keys!: CreateVaultKeyDto[];
}

export class AssignmentEntryDto {
  @IsString()
  keyId!: string;

  @IsBoolean()
  enabled!: boolean;
}

export class BulkSetAssignmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentEntryDto)
  assignments!: AssignmentEntryDto[];
}
