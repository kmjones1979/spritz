import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type ScheduledCall = {
    id: string;
    scheduler_wallet_address: string | null;
    recipient_wallet_address: string;
    scheduled_at: string;
    duration_minutes: number;
    title: string | null;
    status: string;
    is_paid: boolean;
    payment_amount_cents: number | null;
    guest_name: string | null;
    guest_email: string | null;
    notes: string | null;
    invite_token: string | null;
    timezone: string | null;
    created_at: string;
};

// GET /api/scheduling/list - Get scheduled calls for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get("wallet_address");
        const status = searchParams.get("status"); // 'upcoming', 'past', or specific status
        const limit = parseInt(searchParams.get("limit") || "50");

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        const normalizedAddress = walletAddress.toLowerCase();
        const now = new Date().toISOString();

        // Build query for calls where user is either scheduler or recipient
        let query = supabase
            .from("shout_scheduled_calls")
            .select(`
                id,
                scheduler_wallet_address,
                recipient_wallet_address,
                scheduled_at,
                duration_minutes,
                title,
                status,
                is_paid,
                payment_amount_cents,
                guest_name,
                guest_email,
                notes,
                invite_token,
                timezone,
                created_at
            `)
            .or(`scheduler_wallet_address.eq.${normalizedAddress},recipient_wallet_address.eq.${normalizedAddress}`)
            .limit(limit);

        // Filter by status type
        if (status === "upcoming") {
            // Future calls that are pending or confirmed
            query = query
                .gte("scheduled_at", now)
                .in("status", ["pending", "confirmed"])
                .order("scheduled_at", { ascending: true });
        } else if (status === "past") {
            // Past calls (any status) or completed/cancelled
            query = query
                .or(`scheduled_at.lt.${now},status.in.(completed,cancelled)`)
                .order("scheduled_at", { ascending: false });
        } else if (status) {
            // Specific status filter
            query = query
                .eq("status", status)
                .order("scheduled_at", { ascending: true });
        } else {
            // All calls, most recent first
            query = query.order("scheduled_at", { ascending: false });
        }

        const { data: calls, error } = await query;

        if (error) {
            console.error("[Scheduling List] Query error:", error);
            return NextResponse.json(
                { error: "Failed to fetch scheduled calls" },
                { status: 500 }
            );
        }

        // Get display names for scheduler/recipient addresses
        const addresses = new Set<string>();
        calls?.forEach((call) => {
            if (call.scheduler_wallet_address) addresses.add(call.scheduler_wallet_address);
            addresses.add(call.recipient_wallet_address);
        });

        const { data: users } = await supabase
            .from("shout_users")
            .select("wallet_address, display_name, username, avatar")
            .in("wallet_address", Array.from(addresses));

        const userMap = new Map(
            users?.map((u) => [u.wallet_address, u]) || []
        );

        // Enrich calls with user info
        const enrichedCalls = calls?.map((call) => ({
            ...call,
            scheduler_user: call.scheduler_wallet_address ? userMap.get(call.scheduler_wallet_address) || null : null,
            recipient_user: userMap.get(call.recipient_wallet_address) || null,
            is_host: call.recipient_wallet_address === normalizedAddress,
        })) || [];

        return NextResponse.json({
            calls: enrichedCalls,
            total: enrichedCalls.length,
        });
    } catch (error) {
        console.error("[Scheduling List] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

