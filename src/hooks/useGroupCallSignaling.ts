"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/config/supabase";

export type GroupCall = {
  id: string;
  groupId: string;
  groupName: string;
  channelName: string;
  startedBy: string;
  isVideo: boolean;
  startedAt: Date;
  participantCount: number;
};

export type GroupCallParticipant = {
  userAddress: string;
  joinedAt: Date;
};

export function useGroupCallSignaling(userAddress: string | null) {
  const [activeGroupCalls, setActiveGroupCalls] = useState<Record<string, GroupCall>>({});
  const [currentGroupCall, setCurrentGroupCall] = useState<GroupCall | null>(null);
  const [participants, setParticipants] = useState<GroupCallParticipant[]>([]);
  const [incomingGroupCall, setIncomingGroupCall] = useState<GroupCall | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const seenCallsRef = useRef<Set<string>>(new Set());
  const groupIdsRef = useRef<string[]>([]);

  // Fetch active calls for groups the user is part of
  const fetchActiveCalls = useCallback(async (groupIds: string[], showNotification = false) => {
    if (!isSupabaseConfigured || !supabase || groupIds.length === 0) return;

    // Store group IDs for polling
    groupIdsRef.current = groupIds;

    try {
      const { data, error } = await supabase
        .from("shout_group_calls")
        .select(`
          id,
          group_id,
          group_name,
          channel_name,
          started_by,
          is_video,
          started_at,
          shout_group_call_participants!inner(user_address)
        `)
        .in("group_id", groupIds)
        .eq("is_active", true);

      if (error) {
        console.error("[GroupCall] Fetch error:", error);
        return;
      }

      if (data) {
        const calls: Record<string, GroupCall> = {};
        data.forEach((call: {
          id: string;
          group_id: string;
          group_name: string;
          channel_name: string;
          started_by: string;
          is_video: boolean;
          started_at: string;
          shout_group_call_participants: { user_address: string }[];
        }) => {
          const groupCall: GroupCall = {
            id: call.id,
            groupId: call.group_id,
            groupName: call.group_name,
            channelName: call.channel_name,
            startedBy: call.started_by,
            isVideo: call.is_video,
            startedAt: new Date(call.started_at),
            participantCount: call.shout_group_call_participants?.length || 0,
          };
          calls[call.group_id] = groupCall;

          // Check if this is a new call we haven't seen and we're not the one who started it
          if (
            showNotification &&
            !seenCallsRef.current.has(call.id) &&
            call.started_by.toLowerCase() !== userAddress?.toLowerCase() &&
            !currentGroupCall // Don't show if we're already in a call
          ) {
            console.log("[GroupCall] New incoming group call detected:", call.group_name);
            setIncomingGroupCall(groupCall);
          }
          seenCallsRef.current.add(call.id);
        });
        setActiveGroupCalls(calls);
      }
    } catch (err) {
      console.error("[GroupCall] Error:", err);
    }
  }, [userAddress, currentGroupCall]);

  // Start a group call
  const startGroupCall = useCallback(
    async (groupId: string, groupName: string, isVideo: boolean): Promise<GroupCall | null> => {
      if (!isSupabaseConfigured || !supabase || !userAddress) return null;

      try {
        // Check if there's already an active call for this group
        const { data: existing } = await supabase
          .from("shout_group_calls")
          .select("*")
          .eq("group_id", groupId)
          .eq("is_active", true)
          .single();

        if (existing) {
          // Join existing call instead
          return await joinGroupCall(existing.id);
        }

        // Create channel name from group ID
        const channelName = `group_${groupId.slice(0, 20)}_${Date.now()}`;

        // Create new call
        const { data: call, error } = await supabase
          .from("shout_group_calls")
          .insert({
            group_id: groupId,
            group_name: groupName,
            channel_name: channelName,
            started_by: userAddress.toLowerCase(),
            is_video: isVideo,
          })
          .select()
          .single();

        if (error || !call) {
          console.error("[GroupCall] Start error:", error);
          return null;
        }

        // Add self as participant
        await supabase.from("shout_group_call_participants").insert({
          call_id: call.id,
          user_address: userAddress.toLowerCase(),
        });

        const groupCall: GroupCall = {
          id: call.id,
          groupId: call.group_id,
          groupName: call.group_name,
          channelName: call.channel_name,
          startedBy: call.started_by,
          isVideo: call.is_video,
          startedAt: new Date(call.started_at),
          participantCount: 1,
        };

        setCurrentGroupCall(groupCall);
        setParticipants([{ userAddress: userAddress.toLowerCase(), joinedAt: new Date() }]);

        return groupCall;
      } catch (err) {
        console.error("[GroupCall] Start error:", err);
        return null;
      }
    },
    [userAddress]
  );

  // Join an existing group call
  const joinGroupCall = useCallback(
    async (callId: string): Promise<GroupCall | null> => {
      if (!isSupabaseConfigured || !supabase || !userAddress) return null;

      try {
        // Get call details
        const { data: call, error } = await supabase
          .from("shout_group_calls")
          .select("*")
          .eq("id", callId)
          .eq("is_active", true)
          .single();

        if (error || !call) {
          console.error("[GroupCall] Join error - call not found:", error);
          return null;
        }

        // Add self as participant (upsert to handle rejoin)
        await supabase
          .from("shout_group_call_participants")
          .upsert({
            call_id: callId,
            user_address: userAddress.toLowerCase(),
            is_active: true,
            left_at: null,
          }, {
            onConflict: "call_id,user_address",
          });

        // Get all participants
        const { data: participantsData } = await supabase
          .from("shout_group_call_participants")
          .select("user_address, joined_at")
          .eq("call_id", callId)
          .eq("is_active", true);

        const groupCall: GroupCall = {
          id: call.id,
          groupId: call.group_id,
          groupName: call.group_name,
          channelName: call.channel_name,
          startedBy: call.started_by,
          isVideo: call.is_video,
          startedAt: new Date(call.started_at),
          participantCount: participantsData?.length || 1,
        };

        setCurrentGroupCall(groupCall);
        setParticipants(
          participantsData?.map((p: { user_address: string; joined_at: string }) => ({
            userAddress: p.user_address,
            joinedAt: new Date(p.joined_at),
          })) || []
        );

        return groupCall;
      } catch (err) {
        console.error("[GroupCall] Join error:", err);
        return null;
      }
    },
    [userAddress]
  );

  // Leave a group call
  const leaveGroupCall = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase || !userAddress || !currentGroupCall) return;

    try {
      // Mark participant as inactive
      await supabase
        .from("shout_group_call_participants")
        .update({
          is_active: false,
          left_at: new Date().toISOString(),
        })
        .eq("call_id", currentGroupCall.id)
        .eq("user_address", userAddress.toLowerCase());

      // Check if there are any remaining participants
      const { data: remaining } = await supabase
        .from("shout_group_call_participants")
        .select("id")
        .eq("call_id", currentGroupCall.id)
        .eq("is_active", true);

      // If no one left, end the call
      if (!remaining || remaining.length === 0) {
        await supabase
          .from("shout_group_calls")
          .update({
            is_active: false,
            ended_at: new Date().toISOString(),
          })
          .eq("id", currentGroupCall.id);
      }

      setCurrentGroupCall(null);
      setParticipants([]);
    } catch (err) {
      console.error("[GroupCall] Leave error:", err);
    }
  }, [userAddress, currentGroupCall]);

  // Poll for participant updates when in a call
  useEffect(() => {
    if (!currentGroupCall || !isSupabaseConfigured || !supabase) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const pollParticipants = async () => {
      if (!supabase) return;
      
      const { data } = await supabase
        .from("shout_group_call_participants")
        .select("user_address, joined_at")
        .eq("call_id", currentGroupCall.id)
        .eq("is_active", true);

      if (data) {
        setParticipants(
          data.map((p: { user_address: string; joined_at: string }) => ({
            userAddress: p.user_address,
            joinedAt: new Date(p.joined_at),
          }))
        );
      }

      // Also check if call is still active
      const { data: call } = await supabase
        .from("shout_group_calls")
        .select("is_active")
        .eq("id", currentGroupCall.id)
        .single();

      if (call && !call.is_active) {
        setCurrentGroupCall(null);
        setParticipants([]);
      }
    };

    pollingRef.current = setInterval(pollParticipants, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentGroupCall]);

  // Poll for new group calls when not in a call
  useEffect(() => {
    if (currentGroupCall || !isSupabaseConfigured || !supabase) return;

    const pollForCalls = () => {
      if (groupIdsRef.current.length > 0) {
        fetchActiveCalls(groupIdsRef.current, true);
      }
    };

    // Poll every 3 seconds for new calls
    const interval = setInterval(pollForCalls, 3000);

    return () => clearInterval(interval);
  }, [currentGroupCall, fetchActiveCalls]);

  // Dismiss incoming call notification
  const dismissIncomingCall = useCallback(() => {
    setIncomingGroupCall(null);
  }, []);

  return {
    activeGroupCalls,
    currentGroupCall,
    participants,
    incomingGroupCall,
    fetchActiveCalls,
    startGroupCall,
    joinGroupCall,
    leaveGroupCall,
    dismissIncomingCall,
  };
}

