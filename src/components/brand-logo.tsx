"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  lightText?: boolean;
  href?: string;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  className = "",
  lightText = false,
  href = "/"
}: BrandLogoProps) {
  const heightMap = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11"
  };

  const textMap = {
    sm: "text-base font-extrabold tracking-tight",
    md: "text-xl font-black tracking-tight",
    lg: "text-2xl font-black tracking-tight"
  };

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Official Metallic AH Logo */}
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src="/logo.png"
          alt="AnveshakHub Logo"
          className={`${heightMap[size]} w-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm`}
        />
      </div>

      {showText && (
        <span className={`${textMap[size]} ${lightText ? "text-white" : "text-slate-900"} font-bold tracking-tight`}>
          Anveshak<span className="bg-gradient-to-r from-amber-500 via-blue-600 to-sky-500 bg-clip-text text-transparent font-black">Hub</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
