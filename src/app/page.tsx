"use client";

import { motion } from "motion/react";
import { PasskeyAuth } from "@/components/PasskeyAuth";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
    return (
        <main className="relative min-h-screen gradient-bg overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 grid-pattern" />
            <div className="absolute inset-0 noise-overlay" />

            {/* Glowing orbs */}
            <div
                className="glow-orb glow-orb-violet w-[500px] h-[500px] -top-48 -left-24 animate-pulse-glow"
                style={{ animationDelay: "0s" }}
            />
            <div
                className="glow-orb glow-orb-purple w-[400px] h-[400px] top-1/3 -right-32 animate-pulse-glow"
                style={{ animationDelay: "2s" }}
            />
            <div
                className="glow-orb glow-orb-blue w-[300px] h-[300px] -bottom-24 left-1/4 animate-pulse-glow"
                style={{ animationDelay: "4s" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: 0.2,
                            }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
                        >
                            <svg
                                className="w-7 h-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </motion.div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
                    >
                        Akash Auth
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 text-lg max-w-md mx-auto"
                    >
                        Secure, passwordless authentication with passkeys and
                        Web3 wallets
                    </motion.p>
                </motion.div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card rounded-3xl p-8 shadow-2xl">
                        {/* Passkey Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                                    Passkey
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                            </div>

                            <PasskeyAuth />
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <span className="text-zinc-600 text-sm">or</span>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {/* Wallet Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                                    Wallet
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                            </div>

                            <WalletConnect />
                        </div>
                    </div>

                    {/* Footer text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-zinc-600 text-sm mt-6"
                    >
                        Powered by{" "}
                        <a
                            href="https://pimlico.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Pimlico
                        </a>{" "}
                        &{" "}
                        <a
                            href="https://walletconnect.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            WalletConnect
                        </a>
                    </motion.p>
                </motion.div>
            </div>
        </main>
    );
}
