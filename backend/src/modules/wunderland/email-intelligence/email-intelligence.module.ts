import { Module } from '@nestjs/common';
import { CredentialsModule } from '../credentials/credentials.module.js';
import { MediaLibraryModule } from '../media-library/media-library.module.js';
import { CronModule } from '../cron/cron.module.js';
import { ChannelsModule } from '../channels/channels.module.js';
import { EmailIntelligenceController } from './email-intelligence.controller.js';
import { EmailSyncService } from './services/email-sync.service.js';
import { EmailThreadService } from './services/email-thread.service.js';

@Module({
  imports: [CredentialsModule, MediaLibraryModule, CronModule, ChannelsModule],
  controllers: [EmailIntelligenceController],
  providers: [EmailSyncService, EmailThreadService],
  exports: [EmailSyncService, EmailThreadService],
})
export class EmailIntelligenceModule {}
