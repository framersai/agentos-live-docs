/**
 * @file media-library.module.ts
 * @description Module for media asset management — upload, tag, list, delete media files.
 */

import { Module } from '@nestjs/common';
import { MediaLibraryController } from './media-library.controller.js';
import { MediaLibraryService } from './media-library.service.js';

@Module({
  controllers: [MediaLibraryController],
  providers: [MediaLibraryService],
  exports: [MediaLibraryService],
})
export class MediaLibraryModule {}
