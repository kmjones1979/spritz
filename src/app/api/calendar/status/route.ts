import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/calendar/status - Get calendar connection status
export async function GET(request: NextRequest) {
    const userAddress = request.nextUrl.searchParams.get("userAddress");

    if (!userAddress) {
        return NextResponse.json({ error: "User address required" }, { status: 400 });
    }

    let connection = null;
    let error = null;

    try {
        const result = await supabase
            .from("shout_calendar_connections")
            .select("id, provider, calendar_email, is_active, last_sync_at, created_at")
            .eq("wallet_address", userAddress.toLowerCase())
            .eq("provider", "google")
            .maybeSingle();

        connection = result.data;
        error = result.error;
    } catch (err) {
        console.error("[Calendar] Status error:", err);
        // Table might not exist - return not connected
        return NextResponse.json({
            connected: false,
            connection: null,
        });
    }

    if (error) {
        console.error("[Calendar] Status error:", error);
        // If table doesn't exist (PostgREST error PGRST205 or PostgreSQL error 42P01), return not connected
        if (error.code === "PGRST205" || error.code === "42P01" || 
            error.message?.includes("does not exist") || 
            error.message?.includes("Could not find the table")) {
            return NextResponse.json({
                connected: false,
                connection: null,
            });
        }
        return NextResponse.json(
            { error: "Failed to fetch calendar status", details: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        connected: !!connection,
        connection: connection || null,
    });
}

