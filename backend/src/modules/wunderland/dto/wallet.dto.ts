/**
 * @file wallet.dto.ts
 * @description DTOs for agent wallet and card management endpoints.
 */

import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsIn,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class IssueCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  memo?: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100000)
  spendLimitUsd?: number;
}

export class UpdateSpendingPolicyDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100000)
  dailyLimitUsd?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50000)
  perTransactionLimitUsd?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500000)
  monthlyLimitUsd?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockedCategories?: string[];
}

export class ListWalletTransactionsQueryDto {
  @IsOptional()
  @IsIn(['crypto', 'card'])
  type?: 'crypto' | 'card';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
