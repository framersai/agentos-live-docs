-- File: backend/prisma/init.sql

-- Voice Chat Assistant Database Initialization
-- This script sets up the PostgreSQL database with necessary extensions

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable vector similarity search (if using pgvector for embeddings)
-- Uncomment if you plan to use PostgreSQL for vector embeddings instead of Pinecone/Weaviate
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types for better data integrity
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'past_due', 'trial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system', 'tool');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance (these will be created by Prisma migrations)
-- But keeping here for reference and manual optimization if needed

-- Indexes for users table
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Indexes for conversations
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_language ON conversations(language);

-- Indexes for messages
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_id ON conversation_messages(conversation_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON conversation_messages(created_at);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_role ON conversation_messages(role);

-- Full-text search indexes for message content
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_content_fts ON conversation_messages USING gin(to_tsvector('english', content));

-- Indexes for usage tracking
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_records_created_at ON usage_records(created_at);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_records_provider ON usage_records(provider);

-- Indexes for API keys
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_api_keys_user_id ON user_api_keys(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_api_keys_provider ON user_api_keys(provider_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: Triggers will be added by Prisma migrations
-- But keeping this function available for manual table updates

-- Initial data insertion is handled by the seed script
-- This file is mainly for database-level setup and extensions

COMMENT ON DATABASE voice_chat_assistant IS 'Voice Chat Assistant - AI-powered conversational interface with AgentOS integration';