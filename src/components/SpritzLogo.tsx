"use client";

import React from "react";

interface SpritzLogoProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string;
    rounded?: "none" | "lg" | "xl" | "2xl" | "full";
}

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
    "2xl": "w-16 h-16",
};

const roundedClasses = {
    none: "",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
};

export function SpritzLogo({ size = "md", className = "", rounded = "2xl" }: SpritzLogoProps) {
    return (
        <div className={`${sizeClasses[size]} ${roundedClasses[rounded]} overflow-hidden ${className}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
                {/* Background - Cream/Light Peach */}
                <rect width="512" height="512" rx="0" fill="#FFF5E6"/>
                
                {/* 8-bit Orange - Pixel Art Style */}
                {/* Stem (dark brown) */}
                <rect x="240" y="96" width="32" height="32" fill="#8B4513"/>
                
                {/* Leaf (green) */}
                <rect x="272" y="96" width="32" height="32" fill="#22C55E"/>
                <rect x="304" y="96" width="32" height="32" fill="#22C55E"/>
                <rect x="272" y="128" width="32" height="32" fill="#22C55E"/>
                <rect x="304" y="128" width="32" height="32" fill="#16A34A"/>
                <rect x="336" y="128" width="32" height="32" fill="#16A34A"/>
                
                {/* Orange body - Row 1 (top) */}
                <rect x="208" y="128" width="32" height="32" fill="#FF5500"/>
                <rect x="240" y="128" width="32" height="32" fill="#FF5500"/>
                
                {/* Orange body - Row 2 */}
                <rect x="176" y="160" width="32" height="32" fill="#FF5500"/>
                <rect x="208" y="160" width="32" height="32" fill="#FF6B1A"/>
                <rect x="240" y="160" width="32" height="32" fill="#FF6B1A"/>
                <rect x="272" y="160" width="32" height="32" fill="#FF5500"/>
                <rect x="304" y="160" width="32" height="32" fill="#FF5500"/>
                
                {/* Orange body - Row 3 */}
                <rect x="144" y="192" width="32" height="32" fill="#FF5500"/>
                <rect x="176" y="192" width="32" height="32" fill="#FF6B1A"/>
                <rect x="208" y="192" width="32" height="32" fill="#FF8533"/>
                <rect x="240" y="192" width="32" height="32" fill="#FF8533"/>
                <rect x="272" y="192" width="32" height="32" fill="#FF6B1A"/>
                <rect x="304" y="192" width="32" height="32" fill="#FF5500"/>
                <rect x="336" y="192" width="32" height="32" fill="#E04D00"/>
                
                {/* Orange body - Row 4 */}
                <rect x="112" y="224" width="32" height="32" fill="#FF5500"/>
                <rect x="144" y="224" width="32" height="32" fill="#FF6B1A"/>
                <rect x="176" y="224" width="32" height="32" fill="#FF8533"/>
                <rect x="208" y="224" width="32" height="32" fill="#FFAA66"/>
                <rect x="240" y="224" width="32" height="32" fill="#FF8533"/>
                <rect x="272" y="224" width="32" height="32" fill="#FF6B1A"/>
                <rect x="304" y="224" width="32" height="32" fill="#FF5500"/>
                <rect x="336" y="224" width="32" height="32" fill="#E04D00"/>
                <rect x="368" y="224" width="32" height="32" fill="#E04D00"/>
                
                {/* Orange body - Row 5 */}
                <rect x="112" y="256" width="32" height="32" fill="#FF5500"/>
                <rect x="144" y="256" width="32" height="32" fill="#FF6B1A"/>
                <rect x="176" y="256" width="32" height="32" fill="#FF8533"/>
                <rect x="208" y="256" width="32" height="32" fill="#FF8533"/>
                <rect x="240" y="256" width="32" height="32" fill="#FF6B1A"/>
                <rect x="272" y="256" width="32" height="32" fill="#FF6B1A"/>
                <rect x="304" y="256" width="32" height="32" fill="#FF5500"/>
                <rect x="336" y="256" width="32" height="32" fill="#E04D00"/>
                <rect x="368" y="256" width="32" height="32" fill="#E04D00"/>
                
                {/* Orange body - Row 6 */}
                <rect x="112" y="288" width="32" height="32" fill="#FF5500"/>
                <rect x="144" y="288" width="32" height="32" fill="#FF6B1A"/>
                <rect x="176" y="288" width="32" height="32" fill="#FF6B1A"/>
                <rect x="208" y="288" width="32" height="32" fill="#FF6B1A"/>
                <rect x="240" y="288" width="32" height="32" fill="#FF5500"/>
                <rect x="272" y="288" width="32" height="32" fill="#FF5500"/>
                <rect x="304" y="288" width="32" height="32" fill="#E04D00"/>
                <rect x="336" y="288" width="32" height="32" fill="#E04D00"/>
                <rect x="368" y="288" width="32" height="32" fill="#CC4400"/>
                
                {/* Orange body - Row 7 */}
                <rect x="144" y="320" width="32" height="32" fill="#FF5500"/>
                <rect x="176" y="320" width="32" height="32" fill="#FF5500"/>
                <rect x="208" y="320" width="32" height="32" fill="#FF5500"/>
                <rect x="240" y="320" width="32" height="32" fill="#E04D00"/>
                <rect x="272" y="320" width="32" height="32" fill="#E04D00"/>
                <rect x="304" y="320" width="32" height="32" fill="#E04D00"/>
                <rect x="336" y="320" width="32" height="32" fill="#CC4400"/>
                
                {/* Orange body - Row 8 */}
                <rect x="176" y="352" width="32" height="32" fill="#E04D00"/>
                <rect x="208" y="352" width="32" height="32" fill="#E04D00"/>
                <rect x="240" y="352" width="32" height="32" fill="#E04D00"/>
                <rect x="272" y="352" width="32" height="32" fill="#CC4400"/>
                <rect x="304" y="352" width="32" height="32" fill="#CC4400"/>
                
                {/* Orange body - Row 9 (bottom) */}
                <rect x="208" y="384" width="32" height="32" fill="#CC4400"/>
                <rect x="240" y="384" width="32" height="32" fill="#CC4400"/>
                <rect x="272" y="384" width="32" height="32" fill="#CC4400"/>
            </svg>
        </div>
    );
}

export default SpritzLogo;

