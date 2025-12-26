"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/config/supabase";

export type FriendTag = {
    friendAddress: string;
    tag: string | null;
    emoji: string | null;
    color: string | null;
};

export function useFriendTags(userAddress: string | null) {
    const [tags, setTags] = useState<Record<string, FriendTag>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Load all friend tags for the user
    const loadTags = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase || !userAddress) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("shout_friend_tags")
                .select("friend_address, tag, emoji, color")
                .eq("user_address", userAddress.toLowerCase());

            if (error) {
                console.error("[FriendTags] Load error:", error);
                return;
            }

            if (data) {
                const tagsMap: Record<string, FriendTag> = {};
                data.forEach((row) => {
                    tagsMap[row.friend_address.toLowerCase()] = {
                        friendAddress: row.friend_address,
                        tag: row.tag,
                        emoji: row.emoji,
                        color: row.color,
                    };
                });
                setTags(tagsMap);
            }
        } catch (err) {
            console.error("[FriendTags] Load error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [userAddress]);

    // Load tags on mount
    useEffect(() => {
        loadTags();
    }, [loadTags]);

    // Get tag for a specific friend
    const getTag = useCallback(
        (friendAddress: string): FriendTag | null => {
            return tags[friendAddress.toLowerCase()] || null;
        },
        [tags]
    );

    // Set or update tag for a friend
    const setTag = useCallback(
        async (
            friendAddress: string,
            tag: string | null,
            emoji: string | null,
            color: string | null = null
        ): Promise<boolean> => {
            if (!isSupabaseConfigured || !supabase || !userAddress) return false;

            // Validate tag length
            if (tag && tag.length > 30) {
                console.error("[FriendTags] Tag too long (max 30 chars)");
                return false;
            }

            try {
                const friendAddr = friendAddress.toLowerCase();
                const userAddr = userAddress.toLowerCase();

                // If both tag and emoji are empty, delete the entry
                if (!tag && !emoji) {
                    const { error } = await supabase
                        .from("shout_friend_tags")
                        .delete()
                        .eq("user_address", userAddr)
                        .eq("friend_address", friendAddr);

                    if (error) throw error;

                    setTags((prev) => {
                        const updated = { ...prev };
                        delete updated[friendAddr];
                        return updated;
                    });
                    return true;
                }

                // Upsert the tag
                const { error } = await supabase.from("shout_friend_tags").upsert(
                    {
                        user_address: userAddr,
                        friend_address: friendAddr,
                        tag: tag || null,
                        emoji: emoji || null,
                        color: color || null,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_address,friend_address" }
                );

                if (error) throw error;

                setTags((prev) => ({
                    ...prev,
                    [friendAddr]: {
                        friendAddress: friendAddr,
                        tag: tag || null,
                        emoji: emoji || null,
                        color: color || null,
                    },
                }));

                return true;
            } catch (err) {
                console.error("[FriendTags] Set error:", err);
                return false;
            }
        },
        [userAddress]
    );

    // Remove tag from a friend
    const removeTag = useCallback(
        async (friendAddress: string): Promise<boolean> => {
            return setTag(friendAddress, null, null);
        },
        [setTag]
    );

    // Get all unique tags (for filtering)
    const getAllTags = useCallback((): string[] => {
        const uniqueTags = new Set<string>();
        Object.values(tags).forEach((t) => {
            if (t.tag) uniqueTags.add(t.tag);
        });
        return Array.from(uniqueTags).sort();
    }, [tags]);

    return {
        tags,
        isLoading,
        getTag,
        setTag,
        removeTag,
        getAllTags,
        refresh: loadTags,
    };
}


