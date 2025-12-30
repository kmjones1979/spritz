import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/calendar/availability - Get availability windows for a user
export async function GET(request: NextRequest) {
    const userAddress = request.nextUrl.searchParams.get("userAddress");

    if (!userAddress) {
        return NextResponse.json({ error: "User address required" }, { status: 400 });
    }

    let windows = [];
    let error = null;

    try {
        const result = await supabase
            .from("shout_availability_windows")
            .select("*")
            .eq("wallet_address", userAddress.toLowerCase())
            .eq("is_active", true)
            .order("day_of_week", { ascending: true })
            .order("start_time", { ascending: true });

        windows = result.data || [];
        error = result.error;
    } catch (err) {
        console.error("[Calendar] Availability GET error:", err);
        // Table might not exist - return empty array
        return NextResponse.json({ windows: [] });
    }

    if (error) {
        console.error("[Calendar] Availability GET error:", error);
        // If table doesn't exist (PostgREST error PGRST205 or PostgreSQL error 42P01), return empty array
        if (error.code === "PGRST205" || error.code === "42P01" || 
            error.message?.includes("does not exist") || 
            error.message?.includes("Could not find the table")) {
            return NextResponse.json({ windows: [] });
        }
        return NextResponse.json(
            { error: "Failed to fetch availability windows", details: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ windows });
}

// POST /api/calendar/availability - Create or update availability window
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            userAddress,
            id, // If provided, update existing window
            name,
            dayOfWeek,
            startTime,
            endTime,
            timezone,
        } = body;

        if (!userAddress || dayOfWeek === undefined || !startTime || !endTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate day of week (0-6)
        if (dayOfWeek < 0 || dayOfWeek > 6) {
            return NextResponse.json(
                { error: "Invalid day of week (0-6)" },
                { status: 400 }
            );
        }

        // Validate time format and that end > start
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        if (end <= start) {
            return NextResponse.json(
                { error: "End time must be after start time" },
                { status: 400 }
            );
        }

        const windowData = {
            wallet_address: userAddress.toLowerCase(),
            name: name || `Day ${dayOfWeek}`,
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            timezone: timezone || "UTC",
            is_active: true,
            updated_at: new Date().toISOString(),
        };

        let result;
        if (id) {
            // Update existing window
            const { data, error } = await supabase
                .from("shout_availability_windows")
                .update(windowData)
                .eq("id", id)
                .eq("wallet_address", userAddress.toLowerCase())
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Create new window
            const { data, error } = await supabase
                .from("shout_availability_windows")
                .insert(windowData)
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({ window: result });
    } catch (err) {
        console.error("[Calendar] Availability POST error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Failed to save availability window" },
            { status: 500 }
        );
    }
}

// DELETE /api/calendar/availability - Delete availability window
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userAddress = searchParams.get("userAddress");
        const id = searchParams.get("id");

        if (!userAddress || !id) {
            return NextResponse.json(
                { error: "User address and window ID required" },
                { status: 400 }
            );
        }

        // Soft delete by setting is_active to false
        const { error } = await supabase
            .from("shout_availability_windows")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("wallet_address", userAddress.toLowerCase());

        if (error) {
            console.error("[Calendar] Availability DELETE error:", error);
            return NextResponse.json(
                { error: "Failed to delete availability window" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Calendar] Availability DELETE error:", err);
        return NextResponse.json(
            { error: "Failed to delete availability window" },
            { status: 500 }
        );
    }
}

