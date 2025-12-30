-- Google Calendar Integration Migration
-- Creates tables for calendar connections and availability windows

-- 1. Calendar Connections Table
-- Stores OAuth tokens and connection info for Google Calendar
CREATE TABLE IF NOT EXISTS shout_calendar_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'google', -- 'google', 'outlook', etc. (future-proofing)
    access_token TEXT NOT NULL, -- Encrypted OAuth access token
    refresh_token TEXT, -- Encrypted OAuth refresh token
    token_expires_at TIMESTAMPTZ, -- When the access token expires
    calendar_id TEXT, -- Primary calendar ID from provider
    calendar_email TEXT, -- Email associated with the calendar
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ, -- Last time we synced events
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(wallet_address, provider) -- One connection per provider per user
);

CREATE INDEX IF NOT EXISTS idx_calendar_connections_wallet ON shout_calendar_connections(wallet_address);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_active ON shout_calendar_connections(is_active) WHERE is_active = true;

-- 2. Availability Windows Table
-- Stores user-defined availability windows (like Calendly)
CREATE TABLE IF NOT EXISTS shout_availability_windows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    name TEXT NOT NULL, -- e.g., "Weekday Mornings", "Weekend Afternoons"
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL, -- e.g., '09:00:00'
    end_time TIME NOT NULL, -- e.g., '12:00:00'
    timezone TEXT NOT NULL DEFAULT 'UTC', -- User's timezone
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_windows_wallet ON shout_availability_windows(wallet_address);
CREATE INDEX IF NOT EXISTS idx_availability_windows_active ON shout_availability_windows(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_availability_windows_day ON shout_availability_windows(day_of_week);

-- 3. Scheduled Calls Table (for future API)
-- Stores scheduled calls/meetings
CREATE TABLE IF NOT EXISTS shout_scheduled_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scheduler_wallet_address TEXT NOT NULL, -- Person who scheduled
    recipient_wallet_address TEXT NOT NULL, -- Person being scheduled with
    scheduled_at TIMESTAMPTZ NOT NULL, -- When the call is scheduled
    duration_minutes INTEGER DEFAULT 30, -- Call duration in minutes
    title TEXT, -- Optional title/description
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    payment_required BOOLEAN DEFAULT false,
    payment_amount TEXT, -- Amount in wei or token amount
    payment_token TEXT, -- Token address (null for native token)
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    calendar_event_id TEXT, -- ID of event in connected calendar
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_calls_scheduler ON shout_scheduled_calls(scheduler_wallet_address);
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_recipient ON shout_scheduled_calls(recipient_wallet_address);
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_scheduled_at ON shout_scheduled_calls(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_status ON shout_scheduled_calls(status);

-- Add comments
COMMENT ON TABLE shout_calendar_connections IS 'Stores OAuth connections to calendar providers (Google, Outlook, etc.)';
COMMENT ON TABLE shout_availability_windows IS 'User-defined availability windows for scheduling (like Calendly)';
COMMENT ON TABLE shout_scheduled_calls IS 'Scheduled calls/meetings between users (for future API)';

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE shout_calendar_connections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE shout_availability_windows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE shout_scheduled_calls ENABLE ROW LEVEL SECURITY;

