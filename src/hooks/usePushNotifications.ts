"use client";

import { useState, useEffect, useCallback } from "react";
import { type Address } from "viem";
import { supabase } from "@/config/supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray.buffer;
}

export function usePushNotifications(userAddress: Address | null) {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if push notifications are supported
    useEffect(() => {
        const supported =
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            "PushManager" in window &&
            "Notification" in window &&
            !!VAPID_PUBLIC_KEY;

        setIsSupported(supported);

        if (supported) {
            setPermission(Notification.permission);
        }
    }, []);

    // Check existing subscription when user changes
    useEffect(() => {
        if (!isSupported || !userAddress) {
            setIsSubscribed(false);
            return;
        }

        const checkSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription =
                    await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);
            } catch (err) {
                console.error("[Push] Error checking subscription:", err);
            }
        };

        checkSubscription();
    }, [isSupported, userAddress]);

    // Subscribe to push notifications
    const subscribe = useCallback(async (): Promise<boolean> => {
        if (!isSupported || !userAddress || !supabase) {
            setError("Push notifications not supported or not configured");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Request permission
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result !== "granted") {
                setError("Notification permission denied");
                setIsLoading(false);
                return false;
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
            });

            console.log("[Push] Subscription created:", subscription);

            // Save subscription to Supabase
            const subscriptionJSON = subscription.toJSON();
            const { error: dbError } = await supabase
                .from("push_subscriptions")
                .upsert(
                    {
                        user_address: userAddress.toLowerCase(),
                        endpoint: subscriptionJSON.endpoint,
                        p256dh: subscriptionJSON.keys?.p256dh,
                        auth: subscriptionJSON.keys?.auth,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_address" }
                );

            if (dbError) {
                console.error("[Push] Error saving subscription:", dbError);
                setError("Failed to save subscription");
                setIsLoading(false);
                return false;
            }

            setIsSubscribed(true);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error("[Push] Error subscribing:", err);
            setError(err instanceof Error ? err.message : "Failed to subscribe");
            setIsLoading(false);
            return false;
        }
    }, [isSupported, userAddress]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        if (!userAddress || !supabase) {
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Get current subscription
            const registration = await navigator.serviceWorker.ready;
            const subscription =
                await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
            }

            // Remove from database
            await supabase
                .from("push_subscriptions")
                .delete()
                .eq("user_address", userAddress.toLowerCase());

            setIsSubscribed(false);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error("[Push] Error unsubscribing:", err);
            setError(
                err instanceof Error ? err.message : "Failed to unsubscribe"
            );
            setIsLoading(false);
            return false;
        }
    }, [userAddress]);

    return {
        isSupported,
        permission,
        isSubscribed,
        isLoading,
        error,
        subscribe,
        unsubscribe,
    };
}
