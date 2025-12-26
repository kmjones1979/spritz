-- Friend Tags Migration
-- Allows users to add customizable tags and optional emojis to their friends

-- Create friend tags table
CREATE TABLE IF NOT EXISTS shout_friend_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL,
    friend_address TEXT NOT NULL,
    tag TEXT CHECK (char_length(tag) <= 30),
    emoji TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_address, friend_address)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_friend_tags_user ON shout_friend_tags(user_address);
CREATE INDEX IF NOT EXISTS idx_friend_tags_friend ON shout_friend_tags(friend_address);
CREATE INDEX IF NOT EXISTS idx_friend_tags_tag ON shout_friend_tags(tag);

-- Enable RLS
ALTER TABLE shout_friend_tags ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own friend tags
DROP POLICY IF EXISTS "Users can manage own friend tags" ON shout_friend_tags;
CREATE POLICY "Users can manage own friend tags" ON shout_friend_tags
    FOR ALL USING (true);

-- Enable realtime for friend tags
ALTER PUBLICATION supabase_realtime ADD TABLE shout_friend_tags;


