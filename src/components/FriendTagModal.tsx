"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extended emoji list organized by category
const EMOJI_CATEGORIES = {
    "People": ["👥", "🤝", "👋", "🙌", "💪", "👨‍💻", "👩‍💼", "🧑‍🎓", "👨‍🎨", "👩‍🔬"],
    "Work & Events": ["💼", "🏢", "📊", "📈", "🎪", "🎭", "🎉", "🎊", "🏆", "🎯"],
    "Tech & Web3": ["💻", "⛓️", "🔗", "💎", "🚀", "⚡", "🔥", "✨", "🌟", "💡"],
    "Places": ["🏠", "🏖️", "🌍", "🗽", "🏔️", "🌆", "🎡", "📍", "✈️", "🚗"],
    "Activities": ["🎮", "🎨", "🎸", "📚", "🎓", "🏋️", "⛳", "🏄", "🎿", "🏕️"],
    "Nature & Fun": ["🌈", "☀️", "🌙", "⭐", "🌸", "🍀", "🎈", "🎁", "❤️", "💜"],
};

// Flatten all emojis for quick access
const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

// Color options for tags
const TAG_COLORS = [
    { name: "Orange", value: "orange", bg: "bg-[#FF5500]/20", text: "text-[#FFBBA7]", accent: "#FF5500" },
    { name: "Blue", value: "blue", bg: "bg-blue-500/20", text: "text-blue-300", accent: "#3B82F6" },
    { name: "Green", value: "green", bg: "bg-emerald-500/20", text: "text-emerald-300", accent: "#10B981" },
    { name: "Purple", value: "purple", bg: "bg-purple-500/20", text: "text-purple-300", accent: "#8B5CF6" },
    { name: "Pink", value: "pink", bg: "bg-pink-500/20", text: "text-pink-300", accent: "#EC4899" },
    { name: "Yellow", value: "yellow", bg: "bg-yellow-500/20", text: "text-yellow-300", accent: "#EAB308" },
    { name: "Cyan", value: "cyan", bg: "bg-cyan-500/20", text: "text-cyan-300", accent: "#06B6D4" },
    { name: "Red", value: "red", bg: "bg-red-500/20", text: "text-red-300", accent: "#EF4444" },
];

// Suggested tags
const SUGGESTED_TAGS = [
    "Work",
    "Family",
    "College",
    "ETH Denver",
    "Devcon",
    "DAO",
    "NFT Friends",
    "DeFi",
    "Gaming",
    "IRL Met",
];

type FriendTagModalProps = {
    isOpen: boolean;
    onClose: () => void;
    friendAddress: string;
    friendName?: string | null;
    currentTag?: string | null;
    currentEmoji?: string | null;
    currentColor?: string | null;
    onSave: (tag: string | null, emoji: string | null, color: string | null) => Promise<boolean>;
};

export function FriendTagModal({
    isOpen,
    onClose,
    friendAddress,
    friendName,
    currentTag,
    currentEmoji,
    currentColor,
    onSave,
}: FriendTagModalProps) {
    const [tag, setTag] = useState(currentTag || "");
    const [emoji, setEmoji] = useState(currentEmoji || "");
    const [color, setColor] = useState(currentColor || "orange");
    const [isSaving, setIsSaving] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<string>("People");

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setTag(currentTag || "");
            setEmoji(currentEmoji || "");
            setColor(currentColor || "orange");
            setShowEmojiPicker(false);
            setSelectedEmojiCategory("People");
        }
    }, [isOpen, currentTag, currentEmoji, currentColor]);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await onSave(
            tag.trim() || null,
            emoji || null,
            color || "orange"
        );
        setIsSaving(false);
        if (success) {
            onClose();
        }
    };

    const handleClear = async () => {
        setIsSaving(true);
        const success = await onSave(null, null, null);
        setIsSaving(false);
        if (success) {
            onClose();
        }
    };

    const displayName = friendName || `${friendAddress.slice(0, 6)}...${friendAddress.slice(-4)}`;
    
    // Get color classes for selected color
    const selectedColorConfig = TAG_COLORS.find(c => c.value === color) || TAG_COLORS[0];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md z-50 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${selectedColorConfig.accent}, ${selectedColorConfig.accent}88)` }}
                                    >
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Tag Friend
                                        </h2>
                                        <p className="text-zinc-400 text-sm">
                                            {displayName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
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

                            {/* Tag Input */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Tag (max 30 characters)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value.slice(0, 30))}
                                            placeholder="e.g., Work, ETH Denver, College..."
                                            className="w-full py-3 px-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5500]/50 focus:ring-2 focus:ring-[#FF5500]/20 transition-all pr-12"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                                            {tag.length}/30
                                        </span>
                                    </div>
                                </div>

                                {/* Suggested Tags */}
                                <div>
                                    <p className="text-xs text-zinc-500 mb-2">
                                        Suggested tags:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGGESTED_TAGS.map((suggestedTag) => (
                                            <button
                                                key={suggestedTag}
                                                onClick={() => setTag(suggestedTag)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                    tag === suggestedTag
                                                        ? `${selectedColorConfig.bg} ${selectedColorConfig.text}`
                                                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                                }`}
                                            >
                                                {suggestedTag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Tag Color
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {TAG_COLORS.map((colorOption) => (
                                            <button
                                                key={colorOption.value}
                                                onClick={() => setColor(colorOption.value)}
                                                className={`w-8 h-8 rounded-lg transition-all ${
                                                    color === colorOption.value
                                                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                                                        : "hover:scale-105"
                                                }`}
                                                style={{ backgroundColor: colorOption.accent }}
                                                title={colorOption.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Emoji Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Emoji (optional)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-[#FF5500]/50 flex items-center justify-center text-2xl transition-colors"
                                        >
                                            {emoji || (
                                                <svg
                                                    className="w-6 h-6 text-zinc-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                        {emoji && (
                                            <button
                                                onClick={() => setEmoji("")}
                                                className="text-zinc-500 hover:text-red-400 text-sm transition-colors"
                                            >
                                                Clear emoji
                                            </button>
                                        )}
                                    </div>

                                    {/* Emoji Picker Grid with Categories */}
                                    <AnimatePresence>
                                        {showEmojiPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 overflow-hidden"
                                            >
                                                <div className="bg-zinc-800 rounded-xl overflow-hidden">
                                                    {/* Category Tabs */}
                                                    <div className="flex overflow-x-auto border-b border-zinc-700 p-1 gap-1">
                                                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                                                            <button
                                                                key={category}
                                                                onClick={() => setSelectedEmojiCategory(category)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                                                                    selectedEmojiCategory === category
                                                                        ? `${selectedColorConfig.bg} ${selectedColorConfig.text}`
                                                                        : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                                                                }`}
                                                            >
                                                                {category}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {/* Emoji Grid */}
                                                    <div className="grid grid-cols-10 gap-1 p-3">
                                                        {EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES].map((e) => (
                                                            <button
                                                                key={e}
                                                                onClick={() => {
                                                                    setEmoji(e);
                                                                    setShowEmojiPicker(false);
                                                                }}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-zinc-700 transition-colors ${
                                                                    emoji === e ? selectedColorConfig.bg : ""
                                                                }`}
                                                            >
                                                                {e}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Preview */}
                                {(tag || emoji) && (
                                    <div className="bg-zinc-800/50 rounded-xl p-3">
                                        <p className="text-xs text-zinc-500 mb-2">Preview:</p>
                                        <div className="flex items-center gap-2">
                                            {emoji && (
                                                <span className="text-lg">{emoji}</span>
                                            )}
                                            {tag && (
                                                <span className={`px-2 py-1 ${selectedColorConfig.bg} ${selectedColorConfig.text} rounded-md text-sm font-medium`}>
                                                    {tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    {(currentTag || currentEmoji) && (
                                        <button
                                            onClick={handleClear}
                                            disabled={isSaving}
                                            className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition-colors disabled:opacity-50"
                                        >
                                            Remove Tag
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || (!tag && !emoji)}
                                        className="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${selectedColorConfig.accent}, ${selectedColorConfig.accent}cc)`,
                                            boxShadow: isSaving ? 'none' : `0 10px 25px -5px ${selectedColorConfig.accent}40`
                                        }}
                                    >
                                        {isSaving ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            "Save Tag"
                                        )}
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

// Export color config for use in other components
export const TAG_COLOR_CONFIG = TAG_COLORS;
export function getTagColorConfig(colorValue: string | null | undefined) {
    return TAG_COLORS.find(c => c.value === colorValue) || TAG_COLORS[0];
}
