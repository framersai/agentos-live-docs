import { Module } from '@nestjs/common';
import { CredentialsModule } from '../credentials/credentials.module.js';
import { MediaLibraryModule } from '../media-library/media-library.module.js';
import { CronModule } from '../cron/cron.module.js';
import { ChannelsModule } from '../channels/channels.module.js';

@Module({
  imports: [CredentialsModule, MediaLibraryModule, CronModule, ChannelsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class EmailIntelligenceModule {}
