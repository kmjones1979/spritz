import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/public/user - Get public user info by address (no auth required)
export async function GET(request: NextRequest) {
    const address = request.nextUrl.searchParams.get("address");

    if (!address) {
        return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    // Fetch user data from shout_users
    const { data: user, error: userError } = await supabase
        .from("shout_users")
        .select("wallet_address, display_name, ens_name, avatar_url")
        .eq("wallet_address", address.toLowerCase())
        .single();

    // Fetch username from shout_usernames
    const { data: usernameData, error: usernameError } = await supabase
        .from("shout_usernames")
        .select("username")
        .eq("wallet_address", address.toLowerCase())
        .maybeSingle();

    // Debug logging
    console.log(`[Public User API] Fetching user for address: ${address.toLowerCase()}`);
    if (userError) {
        console.error(`[Public User API] Error fetching user:`, userError);
    }
    if (usernameError) {
        console.error(`[Public User API] Error fetching username:`, usernameError);
    }
    if (user || usernameData) {
        console.log(`[Public User API] User found: username="${usernameData?.username || null}", display_name="${user?.display_name || null}", ens_name="${user?.ens_name || null}"`);
    } else {
        console.log(`[Public User API] No user found for address: ${address.toLowerCase()}`);
    }

    // Return user data even if only username exists
    if (!user && !usernameData) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({
        user: {
            username: usernameData?.username || null,
            display_name: user?.display_name || null,
            ens_name: user?.ens_name || null,
            avatar_url: user?.avatar_url || null,
        },
    });
}

