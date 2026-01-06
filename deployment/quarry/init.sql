-- Quarry Database Schema
-- Auto-executed on first container start via /docker-entrypoint-initdb.d/
--
-- Tables:
--   sync_accounts  - User accounts with OAuth and Stripe integration
--   sync_devices   - Registered devices per account (with limit enforcement)
--   license_keys   - Lifetime license keys (hashed)
--   checkout_sessions - Temporary session-to-license mapping

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SYNC ACCOUNTS
-- ============================================================================

CREATE TABLE sync_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Auth
    wrapped_master_key BYTEA,           -- Encrypted master key (E2EE)
    recovery_key_hash VARCHAR(255),     -- Double-hashed recovery key
    google_id VARCHAR(255) UNIQUE,      -- Google OAuth ID
    github_id VARCHAR(255) UNIQUE,      -- GitHub OAuth ID

    -- Billing
    stripe_customer_id VARCHAR(255) UNIQUE,
    tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
    device_limit INTEGER DEFAULT 3,     -- NULL = unlimited (premium)
    premium_expires_at TIMESTAMPTZ,     -- Subscription expiry (NULL = lifetime)

    -- Status
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_accounts_email ON sync_accounts(email);
CREATE INDEX idx_sync_accounts_google_id ON sync_accounts(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_sync_accounts_github_id ON sync_accounts(github_id) WHERE github_id IS NOT NULL;
CREATE INDEX idx_sync_accounts_stripe_customer_id ON sync_accounts(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- ============================================================================
-- SYNC DEVICES
-- ============================================================================

CREATE TABLE sync_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES sync_accounts(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,    -- Client-generated device identifier
    device_name VARCHAR(255),           -- Human-readable name
    device_type VARCHAR(50),            -- e.g., 'desktop', 'mobile', 'tablet'
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (account_id, device_id)
);

CREATE INDEX idx_sync_devices_account_id ON sync_devices(account_id);
CREATE INDEX idx_sync_devices_last_seen ON sync_devices(last_seen_at);

-- Device limit enforcement trigger
CREATE OR REPLACE FUNCTION check_device_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_limit INTEGER;
    current_count INTEGER;
BEGIN
    -- Get account's device limit
    SELECT device_limit INTO current_limit
    FROM sync_accounts WHERE id = NEW.account_id;

    -- NULL limit = unlimited
    IF current_limit IS NULL THEN
        RETURN NEW;
    END IF;

    -- Count existing devices (excluding the one being updated)
    SELECT COUNT(*) INTO current_count
    FROM sync_devices
    WHERE account_id = NEW.account_id
      AND id != COALESCE(NEW.id, uuid_nil());

    IF current_count >= current_limit THEN
        RAISE EXCEPTION 'DEVICE_LIMIT_EXCEEDED: Account has reached device limit of %', current_limit;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_device_limit
    BEFORE INSERT ON sync_devices
    FOR EACH ROW
    EXECUTE FUNCTION check_device_limit();

-- ============================================================================
-- LICENSE KEYS
-- ============================================================================

CREATE TABLE license_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES sync_accounts(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,      -- bcrypt hash of the license key
    stripe_payment_id VARCHAR(255),      -- Stripe payment intent ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ,            -- When key was activated
    revoked_at TIMESTAMPTZ               -- When key was revoked (refund, etc.)
);

CREATE INDEX idx_license_keys_account_id ON license_keys(account_id) WHERE account_id IS NOT NULL;
CREATE INDEX idx_license_keys_email ON license_keys(email);
CREATE INDEX idx_license_keys_active ON license_keys(activated_at) WHERE revoked_at IS NULL;

-- ============================================================================
-- CHECKOUT SESSIONS
-- ============================================================================
-- Temporary storage for session_id -> license_key mapping
-- Allows the success page to retrieve the key multiple times within 24 hours

CREATE TABLE checkout_sessions (
    session_id VARCHAR(255) PRIMARY KEY,  -- Stripe checkout session ID
    license_key VARCHAR(255) NOT NULL,    -- Plain text key (shown to user)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_checkout_sessions_expires ON checkout_sessions(expires_at);

-- Auto-cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM checkout_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MAINTENANCE
-- ============================================================================

-- Optional: Create a scheduled job to cleanup expired sessions
-- In production, use pg_cron or external cron job:
--   SELECT cleanup_expired_sessions();

COMMENT ON TABLE sync_accounts IS 'User accounts with OAuth providers and Stripe billing';
COMMENT ON TABLE sync_devices IS 'Registered devices per account with automatic limit enforcement';
COMMENT ON TABLE license_keys IS 'Lifetime license keys (bcrypt hashed, plain key emailed to user)';
COMMENT ON TABLE checkout_sessions IS 'Temporary session-to-license mapping (24h TTL)';
