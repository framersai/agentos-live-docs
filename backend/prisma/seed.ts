// File: backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seeds the database with initial data including subscription tiers,
 * default admin user, and application configuration.
 */
async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Subscription Tiers
  console.log('📦 Creating subscription tiers...');
  
  const freeTier = await prisma.subscriptionTier.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      description: 'Basic voice chat functionality with limited usage',
      level: 0,
      maxGmiInstances: 1,
      maxApiKeys: 1,
      maxConversationHistoryTurns: 10,
      maxContextWindowTokens: 2048,
      dailyCostLimitUsd: 0.50,
      monthlyCostLimitUsd: 5.00,
      isPublic: true,
      features: [
        'BASIC_CHAT',
        'VOICE_INPUT',
        'LIMITED_HISTORY'
      ],
      priceMonthlyUsd: 0.00,
      priceYearlyUsd: 0.00,
    },
  });

  const basicTier = await prisma.subscriptionTier.upsert({
    where: { name: 'Basic' },
    update: {},
    create: {
      name: 'Basic',
      description: 'Enhanced voice chat with more features and higher limits',
      level: 1,
      maxGmiInstances: 3,
      maxApiKeys: 3,
      maxConversationHistoryTurns: 50,
      maxContextWindowTokens: 8192,
      dailyCostLimitUsd: 5.00,
      monthlyCostLimitUsd: 50.00,
      isPublic: false,
      features: [
        'BASIC_CHAT',
        'VOICE_INPUT',
        'EXTENDED_HISTORY',
        'CUSTOM_PERSONAS',
        'EXPORT_CONVERSATIONS'
      ],
      priceMonthlyUsd: 9.99,
      priceYearlyUsd: 99.99,
      lemonSqueezyProductId: process.env.LEMONSQUEEZY_BASIC_PRODUCT_ID || '',
      lemonSqueezyVariantId: process.env.LEMONSQUEEZY_BASIC_VARIANT_ID || '',
    },
  });

  const proPier = await prisma.subscriptionTier.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      description: 'Advanced features with unlimited usage and priority support',
      level: 2,
      maxGmiInstances: 10,
      maxApiKeys: 10,
      maxConversationHistoryTurns: 200,
      maxContextWindowTokens: 32000,
      dailyCostLimitUsd: 25.00,
      monthlyCostLimitUsd: 200.00,
      isPublic: false,
      features: [
        'BASIC_CHAT',
        'VOICE_INPUT',
        'UNLIMITED_HISTORY',
        'CUSTOM_PERSONAS',
        'EXPORT_CONVERSATIONS',
        'ADVANCED_TOOLS',
        'PRIORITY_SUPPORT',
        'API_ACCESS',
        'TEAM_COLLABORATION'
      ],
      priceMonthlyUsd: 29.99,
      priceYearlyUsd: 299.99,
      lemonSqueezyProductId: process.env.LEMONSQUEEZY_PRO_PRODUCT_ID || '',
      lemonSqueezyVariantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID || '',
    },
  });

  // 2. Create Default Admin User (if specified in env)
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    console.log('👤 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    
    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: {},
      create: {
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        passwordHash: hashedPassword,
        emailVerified: true,
        subscriptionTierId: proPier.id,
      },
    });
  }

  // 3. Create Application Configuration
  console.log('⚙️ Setting up application configuration...');
  
  const appConfigs = [
    {
      key: 'APP_NAME',
      value: 'Voice Chat Assistant',
      description: 'Application display name',
      isPublic: true,
    },
    {
      key: 'APP_VERSION',
      value: '2.0.0',
      description: 'Current application version',
      isPublic: true,
    },
    {
      key: 'DEFAULT_LANGUAGE',
      value: 'en-US',
      description: 'Default language for new users',
      isPublic: true,
    },
    {
      key: 'SUPPORTED_LANGUAGES',
      value: JSON.stringify(['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN']),
      description: 'List of supported languages',
      isPublic: true,
    },
    {
      key: 'MAX_FREE_CONVERSATIONS_PER_DAY',
      value: '10',
      description: 'Maximum conversations per day for free users',
      isPublic: false,
    },
    {
      key: 'MAINTENANCE_MODE',
      value: 'false',
      description: 'Whether the app is in maintenance mode',
      isPublic: true,
    },
    {
      key: 'FEATURE_FLAGS',
      value: JSON.stringify({
        voice_input: true,
        advanced_personas: true,
        conversation_export: true,
        team_features: false,
        beta_features: false,
      }),
      description: 'Application feature flags',
      isPublic: true,
    },
  ];

  for (const config of appConfigs) {
    await prisma.appConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  // 4. Create Sample Conversations for Demo
  console.log('💬 Creating sample conversations...');
  
  // Create a sample conversation for demo purposes
  const sampleConversation = await prisma.conversation.create({
    data: {
      title: 'Welcome to Voice Chat Assistant',
      language: 'en-US',
      messages: {
        create: [
          {
            role: 'system',
            content: 'Welcome to Voice Chat Assistant! I\'m here to help you with coding questions, system design, and more. How can I assist you today?',
          },
          {
            role: 'user',
            content: 'Hello! Can you help me understand how to implement authentication in a Node.js application?',
          },
          {
            role: 'assistant',
            content: 'I\'d be happy to help you implement authentication in Node.js! There are several approaches you can take...',
          },
        ],
      },
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created subscription tiers: ${freeTier.name}, ${basicTier.name}, ${proPier.name}`);
  console.log(`🔧 Created ${appConfigs.length} application configurations`);
  console.log(`💬 Created sample conversation: ${sampleConversation.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });