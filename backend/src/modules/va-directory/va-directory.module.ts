/**
 * @file va-directory.module.ts
 * @description NestJS module for the VA directory system.
 */

import { Module } from '@nestjs/common';
import { VaDirectoryController } from './va-directory.controller.js';

@Module({
  controllers: [VaDirectoryController],
})
export class VaDirectoryModule {}
