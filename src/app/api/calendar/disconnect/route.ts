import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/calendar/disconnect - Disconnect Google Calendar
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userAddress } = body;

        if (!userAddress) {
            return NextResponse.json({ error: "User address required" }, { status: 400 });
        }

        // Delete calendar connection
        const { error } = await supabase
            .from("shout_calendar_connections")
            .delete()
            .eq("wallet_address", userAddress.toLowerCase())
            .eq("provider", "google");

        if (error) {
            console.error("[Calendar] Disconnect error:", error);
            return NextResponse.json(
                { error: "Failed to disconnect calendar" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Calendar] Disconnect error:", err);
        return NextResponse.json(
            { error: "Failed to disconnect calendar" },
            { status: 500 }
        );
    }
}

