// File: backend/db.ts
/**
 * @fileoverview Database connection setup and utilities for the Voice Chat Assistant backend.
 * Provides Prisma client instance, connection management, and database health check functions.
 * This module centralizes all database interactions and ensures proper connection lifecycle management.
 * @module backend/db
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client instance for the application.
 * Uses connection pooling and optimized settings for production environments.
 * @type {PrismaClient}
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Connects to the database and performs initial health checks.
 * This function should be called during application startup.
 * @async
 * @function connectToDatabase
 * @throws {Error} If connection fails or database is unreachable.
 */
export async function connectToDatabase(): Promise<void> {
  try {
    console.log('🔌 Attempting to connect to database...');
    
    // Test the connection with a simple query
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Database connection established successfully');
    
    // Log database info for debugging (non-sensitive)
    const databaseUrl = new URL(process.env.DATABASE_URL || '');
    console.log(`📊 Connected to ${databaseUrl.protocol}//${databaseUrl.hostname}:${databaseUrl.port}${databaseUrl.pathname}`);
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    console.error('🔍 Check your DATABASE_URL environment variable and ensure PostgreSQL is running');
    throw error;
  }
}

/**
 * Gracefully disconnects from the database.
 * This function should be called during application shutdown.
 * @async
 * @function disconnectFromDatabase
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Database connection closed gracefully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
    throw error;
  }
}

/**
 * Performs a database health check.
 * Useful for health endpoints and monitoring.
 * @async
 * @function checkDatabaseHealth
 * @returns {Promise<{ healthy: boolean; latency?: number; error?: string }>}
 */
export async function checkDatabaseHealth(): Promise<{ 
  healthy: boolean; 
  latency?: number; 
  error?: string; 
}> {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;
    
    return { healthy: true, latency };
  } catch (error) {
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

/**
 * Initializes database with seed data if needed.
 * Creates default subscription tiers and admin user if they don't exist.
 * @async
 * @function initializeDatabase
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🌱 Initializing database with default data...');

    // Create default subscription tiers if they don't exist
    const existingTiers = await prisma.subscriptionTier.findMany();
    
    if (existingTiers.length === 0) {
      console.log('📊 Creating default subscription tiers...');
      
      await prisma.subscriptionTier.createMany({
        data: [
          {
            name: 'Free',
            description: 'Basic features for getting started',
            level: 0,
            maxGmiInstances: 1,
            maxApiKeys: 1,
            maxConversationHistoryTurns: 20,
            maxContextWindowTokens: 4096,
            dailyCostLimitUsd: 1.00,
            monthlyCostLimitUsd: 10.00,
            isPublic: true,
            features: ['basic_chat', 'voice_input'],
            priceMonthlyUsd: 0,
            priceYearlyUsd: 0,
          },
          {
            name: 'Pro',
            description: 'Advanced features for power users',
            level: 1,
            maxGmiInstances: 5,
            maxApiKeys: 3,
            maxConversationHistoryTurns: 100,
            maxContextWindowTokens: 8192,
            dailyCostLimitUsd: 10.00,
            monthlyCostLimitUsd: 100.00,
            isPublic: true,
            features: ['basic_chat', 'voice_input', 'advanced_rag', 'custom_personas', 'api_access'],
            priceMonthlyUsd: 19.99,
            priceYearlyUsd: 199.99,
          },
          {
            name: 'Enterprise',
            description: 'Full features for teams and organizations',
            level: 2,
            maxGmiInstances: 20,
            maxApiKeys: 10,
            maxConversationHistoryTurns: 500,
            maxContextWindowTokens: 16384,
            dailyCostLimitUsd: 50.00,
            monthlyCostLimitUsd: 500.00,
            isPublic: true,
            features: [
              'basic_chat', 'voice_input', 'advanced_rag', 'custom_personas', 
              'api_access', 'team_management', 'priority_support', 'custom_integrations'
            ],
            priceMonthlyUsd: 99.99,
            priceYearlyUsd: 999.99,
          },
        ],
      });
      
      console.log('✅ Default subscription tiers created');
    }

    // Create default app configuration
    const existingConfig = await prisma.appConfig.findMany();
    
    if (existingConfig.length === 0) {
      console.log('⚙️ Creating default app configuration...');
      
      await prisma.appConfig.createMany({
        data: [
          {
            key: 'MAINTENANCE_MODE',
            value: 'false',
            description: 'Whether the application is in maintenance mode',
            isPublic: true,
            valueType: 'boolean',
            group: 'system',
          },
          {
            key: 'REGISTRATION_ENABLED',
            value: 'true',
            description: 'Whether new user registration is enabled',
            isPublic: true,
            valueType: 'boolean',
            group: 'auth',
          },
          {
            key: 'DEFAULT_SUBSCRIPTION_TIER',
            value: 'Free',
            description: 'Default subscription tier for new users',
            isPublic: false,
            valueType: 'string',
            group: 'subscription',
          },
        ],
      });
      
      console.log('✅ Default app configuration created');
    }

    console.log('🎉 Database initialization completed');
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Cleans up expired sessions and tokens.
 * Should be run periodically (e.g., via cron job).
 * @async
 * @function cleanupExpiredData
 */
export async function cleanupExpiredData(): Promise<void> {
  try {
    const now = new Date();
    
    // Clean up expired sessions
    const expiredSessions = await prisma.userSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { isActive: false },
        ],
      },
    });
    
    // Clean up expired password reset tokens
    const expiredResetTokens = await prisma.user.updateMany({
      where: {
        resetPasswordExpires: { lt: now },
      },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    
    // Clean up expired email verification tokens (older than 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const expiredVerificationTokens = await prisma.user.updateMany({
      where: {
        emailVerified: false,
        createdAt: { lt: sevenDaysAgo },
      },
      data: {
        emailVerificationToken: null,
      },
    });
    
    console.log(`🧹 Cleanup completed: ${expiredSessions.count} sessions, ${expiredResetTokens.count} reset tokens, ${expiredVerificationTokens.count} verification tokens`);
    
  } catch (error) {
    console.error('❌ Error during data cleanup:', error);
  }
}

// Default export is the Prisma client instance
export default prisma;
export { prisma };