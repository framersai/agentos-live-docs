/**
 * @file approval-queue.dto.ts
 * @description DTOs for the Approval Queue endpoints.
 */

import { IsString, IsOptional, IsIn, IsNumber, Min, Max, MaxLength } from 'class-validator';

/** Request body for POST /wunderland/approval-queue/:queueId/decide. */
export class DecideApprovalDto {
  @IsIn(['approve', 'reject'])
  action!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedback?: string;
}

/** Query parameters for GET /wunderland/approval-queue. */
export class ListApprovalQueueQueryDto {
  @IsOptional() @IsNumber() @Min(1) page?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(50) limit?: number;
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'expired'])
  status?: string;
}
