-- Migration: Add MCP and API enable toggles to agents
-- Run this in your Supabase SQL Editor

-- Add mcp_enabled column (default true for backward compatibility)
ALTER TABLE shout_agents
ADD COLUMN IF NOT EXISTS mcp_enabled BOOLEAN DEFAULT true;

-- Add api_enabled column (default true for backward compatibility)
ALTER TABLE shout_agents
ADD COLUMN IF NOT EXISTS api_enabled BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN shout_agents.mcp_enabled IS 'Whether MCP server integrations are enabled for this agent';
COMMENT ON COLUMN shout_agents.api_enabled IS 'Whether API tool integrations are enabled for this agent';

