/**
 * @file human-help.module.ts
 * @description NestJS module for human help task queue and hour tracking.
 */

import { Module } from '@nestjs/common';
import { HumanHelpController } from './human-help.controller.js';
import { HumanHelpService } from './human-help.service.js';

@Module({
  controllers: [HumanHelpController],
  providers: [HumanHelpService],
  exports: [HumanHelpService],
})
export class HumanHelpModule {}
