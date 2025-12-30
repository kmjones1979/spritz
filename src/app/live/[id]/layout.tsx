import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    try {
        const { data: stream } = await supabase
            .from("shout_streams")
            .select("id, title, description, status, user_address, started_at, ended_at")
            .eq("id", id)
            .single();

        if (!stream) {
            return {
                title: "Stream Not Found | Spritz",
                description: "This stream could not be found",
                robots: {
                    index: false,
                    follow: false,
                },
            };
        }

        // Get user info
        const { data: user } = await supabase
            .from("shout_users")
            .select("display_name, avatar_url")
            .eq("wallet_address", stream.user_address)
            .single();

        const streamerName = user?.display_name || stream.user_address.slice(0, 6) + "..." + stream.user_address.slice(-4);
        const title = stream.title || `${streamerName}'s Live Stream`;
        const description = stream.description || `Watch ${streamerName} live on Spritz - Censorship-resistant Web3 communication platform`;
        const isLive = stream.status === "live" && !stream.ended_at;

        return {
            title: `${title} | Live on Spritz`,
            description,
            openGraph: {
                title: `${title} | Live on Spritz`,
                description,
                url: `https://app.spritz.chat/live/${id}`,
                type: isLive ? "video.other" : "website",
                images: [
                    {
                        url: "/og-image.png",
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} | Live on Spritz`,
                description,
                images: ["/og-image.png"],
            },
            robots: {
                index: isLive,
                follow: true,
            },
            alternates: {
                canonical: `https://app.spritz.chat/live/${id}`,
            },
        };
    } catch (error) {
        console.error("[Live Stream Metadata] Error:", error);
        return {
            title: "Live Stream | Spritz",
            description: "Watch live streams on Spritz",
        };
    }
}

export default function LiveStreamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

