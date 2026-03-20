import { Module } from '@nestjs/common';
import { CredentialsModule } from '../credentials/credentials.module.js';
import { MediaLibraryModule } from '../media-library/media-library.module.js';
import { CronModule } from '../cron/cron.module.js';
import { ChannelsModule } from '../channels/channels.module.js';
import { EmailIntelligenceController } from './email-intelligence.controller.js';
import { EmailSyncService } from './services/email-sync.service.js';
import { EmailThreadService } from './services/email-thread.service.js';
import { EmailAttachmentService } from './services/email-attachment.service.js';
import { EmailVectorMemoryService } from './services/email-vector-memory.service.js';
import { EmailRagService } from './services/email-rag.service.js';
import { EmailProjectService } from './services/email-project.service.js';
import { EmailRateLimitService } from './services/email-rate-limit.service.js';
import { EmailReportService } from './services/email-report.service.js';
import { EmailDigestService } from './services/email-digest.service.js';
import { EmailRetentionService } from './services/email-retention.service.js';

@Module({
  imports: [CredentialsModule, MediaLibraryModule, CronModule, ChannelsModule],
  controllers: [EmailIntelligenceController],
  providers: [
    EmailSyncService,
    EmailThreadService,
    EmailAttachmentService,
    EmailVectorMemoryService,
    EmailRagService,
    EmailProjectService,
    EmailRateLimitService,
    EmailReportService,
    EmailDigestService,
    EmailRetentionService,
  ],
  exports: [
    EmailSyncService,
    EmailThreadService,
    EmailAttachmentService,
    EmailVectorMemoryService,
    EmailRagService,
    EmailProjectService,
    EmailRateLimitService,
    EmailReportService,
    EmailDigestService,
    EmailRetentionService,
  ],
})
export class EmailIntelligenceModule {}
