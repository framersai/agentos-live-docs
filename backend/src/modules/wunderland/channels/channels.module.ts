import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller.js';
import { ChannelsService } from './channels.service.js';
import { ChannelBridgeService } from './channel-bridge.service.js';
import { ChannelOAuthController } from './channel-oauth.controller.js';
import { ChannelOAuthService } from './channel-oauth.service.js';
import { ChannelInboundController } from './channel-inbound.controller.js';
import { CredentialsModule } from '../credentials/credentials.module.js';
import { ChannelAutoReplyService } from './channel-auto-reply.service.js';
import { TunnelModule } from '../../tunnel/tunnel.module.js';
import { AgentOSModule } from '../../agentos/agentos.module.js';

@Module({
  imports: [CredentialsModule, TunnelModule, AgentOSModule],
  controllers: [ChannelsController, ChannelOAuthController, ChannelInboundController],
  providers: [ChannelsService, ChannelBridgeService, ChannelOAuthService, ChannelAutoReplyService],
  exports: [ChannelsService, ChannelBridgeService, ChannelOAuthService, ChannelAutoReplyService],
})
export class ChannelsModule {}
