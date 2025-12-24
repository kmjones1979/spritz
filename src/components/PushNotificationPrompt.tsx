"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const PUSH_PROMPTED_KEY = "spritz_push_prompted";

type PushNotificationPromptProps = {
    userAddress: string | null;
    isSupported: boolean;
    isSubscribed: boolean;
    permission: NotificationPermission;
    onEnable: () => Promise<boolean>;
    onSkip: () => void;
};

export function PushNotificationPrompt({
    userAddress,
    isSupported,
    isSubscribed,
    permission,
    onEnable,
    onSkip,
}: PushNotificationPromptProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEnabling, setIsEnabling] = useState(false);

    // Check if we should show the prompt
    useEffect(() => {
        if (!userAddress || !isSupported || isSubscribed) {
            return;
        }

        // Don't show if permission already denied
        if (permission === "denied") {
            return;
        }

        // Check if already prompted
        const hasPrompted = localStorage.getItem(PUSH_PROMPTED_KEY);
        if (hasPrompted) {
            return;
        }

        // Show prompt after a short delay (let the app settle first)
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, [userAddress, isSupported, isSubscribed, permission]);

    const handleEnable = async () => {
        setIsEnabling(true);
        localStorage.setItem(PUSH_PROMPTED_KEY, "true");
        
        const success = await onEnable();
        
        setIsEnabling(false);
        if (success) {
            setIsOpen(false);
        }
    };

    const handleSkip = () => {
        localStorage.setItem(PUSH_PROMPTED_KEY, "true");
        setIsOpen(false);
        onSkip();
    };

    const handleLater = () => {
        // Don't set the prompted flag - we'll ask again next session
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm z-50"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5500] to-[#FB8D22] flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-white text-center mb-2">
                                Never Miss a Call
                            </h2>

                            {/* Description */}
                            <p className="text-zinc-400 text-center text-sm mb-6">
                                Enable push notifications to get alerted when friends call you, even when Spritz isn't open.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-zinc-300">Incoming call alerts</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-zinc-300">Friend request notifications</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-zinc-300">You can disable anytime in settings</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleEnable}
                                    disabled={isEnabling}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FB8D22] text-white font-medium transition-all hover:shadow-lg hover:shadow-[#FB8D22]/25 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isEnabling ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enabling...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            Enable Notifications
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleLater}
                                        disabled={isEnabling}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors disabled:opacity-50"
                                    >
                                        Maybe Later
                                    </button>
                                    <button
                                        onClick={handleSkip}
                                        disabled={isEnabling}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-zinc-500 font-medium transition-colors disabled:opacity-50"
                                    >
                                        Don't Ask Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

