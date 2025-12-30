import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/streams/[id]/viewers - Increment viewer count (viewer joined)
// Also handles ?action=leave from sendBeacon for page unload
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const action = request.nextUrl.searchParams.get("action");
    
    // Handle leave action from sendBeacon
    if (action === "leave") {
        console.log("[Viewers API] Viewer leaving stream:", id);
        return decrementViewerCount(id);
    }

    console.log("[Viewers API] Viewer joining stream:", id);

    // Increment viewer count
    const { data: stream, error: fetchError } = await supabase
        .from("shout_streams")
        .select("viewer_count")
        .eq("id", id)
        .single();
    
    if (fetchError) {
        console.error("[Viewers API] Error fetching stream:", fetchError);
        return NextResponse.json({ success: false, error: "Stream not found" }, { status: 404 });
    }
    
    if (stream) {
        const newCount = (stream.viewer_count || 0) + 1;
        const { error: updateError } = await supabase
            .from("shout_streams")
            .update({ viewer_count: newCount })
            .eq("id", id);
        
        if (updateError) {
            console.error("[Viewers API] Error updating viewer count:", updateError);
        } else {
            console.log("[Viewers API] Updated viewer count to:", newCount);
        }
    }

    return NextResponse.json({ success: true });
}

// Helper to decrement viewer count
async function decrementViewerCount(id: string) {
    const { data: stream, error: fetchError } = await supabase
        .from("shout_streams")
        .select("viewer_count")
        .eq("id", id)
        .single();
    
    if (fetchError) {
        console.error("[Viewers API] Error fetching stream for decrement:", fetchError);
        return NextResponse.json({ success: false });
    }
    
    if (stream) {
        const newCount = Math.max(0, (stream.viewer_count || 0) - 1);
        const { error: updateError } = await supabase
            .from("shout_streams")
            .update({ viewer_count: newCount })
            .eq("id", id);
        
        if (updateError) {
            console.error("[Viewers API] Error decrementing viewer count:", updateError);
        } else {
            console.log("[Viewers API] Decremented viewer count to:", newCount);
        }
    }
    
    return NextResponse.json({ success: true });
}

// DELETE /api/streams/[id]/viewers - Decrement viewer count (viewer left)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return decrementViewerCount(id);
}

