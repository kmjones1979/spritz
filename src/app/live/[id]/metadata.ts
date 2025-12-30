import { Metadata } from "next";

// This will be used to generate metadata for live stream pages
// Note: Since the page is a client component, we'll generate metadata
// dynamically in the component or use a layout wrapper
export function generateLiveStreamMetadata(
    streamId: string,
    streamData?: {
        title?: string | null;
        description?: string | null;
        streamer?: {
            display_name?: string | null;
            address?: string;
        };
        is_live?: boolean;
    }
): Metadata {
    const title = streamData?.title
        ? `${streamData.title} | Live on Spritz`
        : `Live Stream | Spritz`;
    const description = streamData?.description
        ? streamData.description
        : streamData?.is_live
          ? `Watch ${streamData.streamer?.display_name || streamData.streamer?.address || "this streamer"} live on Spritz`
          : "Watch live streams on Spritz - Censorship-resistant Web3 communication platform";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://app.spritz.chat/live/${streamId}`,
            type: streamData?.is_live ? "video.other" : "website",
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
            title,
            description,
            images: ["/og-image.png"],
        },
        robots: {
            index: streamData?.is_live ? true : false,
            follow: true,
        },
        alternates: {
            canonical: `https://app.spritz.chat/live/${streamId}`,
        },
    };
}

