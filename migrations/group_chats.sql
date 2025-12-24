-- Group Chats Migration
-- Run this in your Supabase SQL editor
-- This enables group chats to be visible to ALL members (not just the creator)

-- 1. Groups Table
CREATE TABLE IF NOT EXISTS shout_groups (
    id TEXT PRIMARY KEY,  -- Group ID (uuid-like string)
    name TEXT NOT NULL,
    created_by TEXT NOT NULL,  -- Creator's wallet address
    symmetric_key TEXT NOT NULL,  -- Encrypted symmetric key for the group
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_created_by ON shout_groups(created_by);

-- 2. Group Members Table
CREATE TABLE IF NOT EXISTS shout_group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES shout_groups(id) ON DELETE CASCADE,
    member_address TEXT NOT NULL,  -- Member's wallet address (lowercase)
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role TEXT DEFAULT 'member',  -- 'admin' or 'member'
    UNIQUE(group_id, member_address)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON shout_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_member ON shout_group_members(member_address);

-- 3. Enable RLS
ALTER TABLE shout_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE shout_group_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (allow all for now - you can tighten later)
CREATE POLICY "Allow all on groups" ON shout_groups FOR ALL USING (true);
CREATE POLICY "Allow all on group_members" ON shout_group_members FOR ALL USING (true);

-- 5. Enable realtime for groups (so members see updates)
ALTER PUBLICATION supabase_realtime ADD TABLE shout_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE shout_group_members;

-- Done!
SELECT 'Group chats migration complete!' as status;

