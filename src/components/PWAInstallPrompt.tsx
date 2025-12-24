"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "spritz_pwa_prompt_dismissed";

export function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    // Handle app update
    const handleUpdate = useCallback(() => {
        if (waitingWorker) {
            // Tell the waiting service worker to skip waiting
            waitingWorker.postMessage({ type: "SKIP_WAITING" });
        }
        // Reload the page to get the new version
        window.location.reload();
    }, [waitingWorker]);

    // Check for service worker updates
    useEffect(() => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
            return;
        }

        const checkForUpdates = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Check if there's already a waiting worker
                if (registration.waiting) {
                    setWaitingWorker(registration.waiting);
                    setShowUpdatePrompt(true);
                }

                // Listen for new service worker updates
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener("statechange", () => {
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            // New content is available
                            setWaitingWorker(newWorker);
                            setShowUpdatePrompt(true);
                        }
                    });
                });
            } catch (error) {
                console.error("[PWA] Error checking for updates:", error);
            }
        };

        checkForUpdates();

        // Also listen for controller change (when update is activated)
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });

        // Check for updates periodically (every 30 minutes)
        const intervalId = setInterval(() => {
            navigator.serviceWorker.ready.then((registration) => {
                registration.update();
            });
        }, 30 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Check if already dismissed
        const dismissed = localStorage.getItem(DISMISS_KEY);
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            // Show again after 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Check if already running as PWA
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            // @ts-expect-error - iOS Safari specific
            window.navigator.standalone === true;

        if (isStandalone) {
            return;
        }

        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOSDevice =
            /iphone|ipad|ipod/.test(userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        const isAndroidDevice = /android/.test(userAgent);
        const isMobile = isIOSDevice || isAndroidDevice;

        if (!isMobile) {
            return;
        }

        setIsIOS(isIOSDevice);
        setIsAndroid(isAndroidDevice);

        // For Android, listen for beforeinstallprompt
        if (isAndroidDevice) {
            const handleBeforeInstall = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e as BeforeInstallPromptEvent);
                setShowPrompt(true);
            };

            window.addEventListener("beforeinstallprompt", handleBeforeInstall);

            return () => {
                window.removeEventListener(
                    "beforeinstallprompt",
                    handleBeforeInstall
                );
            };
        }

        // For iOS, show after a short delay
        if (isIOSDevice) {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        setShowPrompt(false);
    };

    if (!showPrompt && !showUpdatePrompt) {
        return null;
    }

    // Install prompt UI
    const installPromptUI = showPrompt ? (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-4 right-4 z-50 safe-area-pb"
            >
                <div className="glass-card rounded-2xl p-4 shadow-xl border border-[#FB8D22]/20">
                    <div className="flex items-start gap-3">
                        {/* App Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB8D22] to-[#FF5500] flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm mb-1">
                                Install Spritz
                            </h3>

                            {isIOS && (
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Tap the{" "}
                                    <span className="inline-flex items-center align-middle">
                                        <svg
                                            className="w-4 h-4 text-[#FFBBA7] mx-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            {/* Safari share icon - square with arrow up */}
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v12m0-12l-3 3m3-3l3 3"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
                                            />
                                        </svg>
                                    </span>{" "}
                                    share button, then{" "}
                                    <span className="text-white font-medium">
                                        &quot;Add to Home Screen&quot;
                                    </span>
                                </p>
                            )}

                            {isAndroid && (
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Add to your home screen for quick access and
                                    a better experience
                                </p>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Install button for Android */}
                    {isAndroid && deferredPrompt && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleInstall}
                            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF5500] text-white text-sm font-medium hover:from-[#FB8D22] hover:to-[#FB8D22] transition-all"
                        >
                            Install App
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    ) : null;

    // Update available UI (shown instead of install prompt)
    if (showUpdatePrompt) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 right-4 z-50 safe-area-pb"
                >
                    <div className="glass-card rounded-2xl p-4 shadow-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20">
                        <div className="flex items-start gap-3">
                            {/* Update Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-sm mb-1">
                                    Update Available
                                </h3>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    A new version of Spritz is available with improvements and bug fixes.
                                </p>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setShowUpdatePrompt(false)}
                                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                                aria-label="Dismiss"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Update button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleUpdate}
                            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all"
                        >
                            Update Now
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return installPromptUI;
}

