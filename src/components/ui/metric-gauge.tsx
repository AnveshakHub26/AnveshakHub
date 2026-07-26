"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { motion } from "framer-motion";

interface MetricGaugeProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  progress?: number; // 0 to 100
  progressColor?: string;
  icon?: React.ElementType;
  hint?: string;
  badge?: string;
}

export default function MetricGauge({
  label,
  value,
  sublabel,
  trend,
  trendValue,
  progress,
  progressColor = "#FF5A36",
  icon: Icon,
  hint,
  badge,
}: MetricGaugeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card-flat p-5 rounded-2xl bg-[#FBF7F0] hover:bg-[#EFE9DF] transition-all group relative text-left"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#78716A]">
          {label}
        </span>
        {Icon && (
          <div className="h-9 w-9 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36] shrink-0 group-hover:scale-110 transition-transform">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4]">
            {badge}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-heading text-3xl font-extrabold text-[#211F1D] tracking-tight">
          {value}
        </span>
        {trendValue && (
          <span
            className={`inline-flex items-center text-xs font-bold gap-0.5 ${
              trend === "up"
                ? "text-[#2F6B4F]"
                : trend === "down"
                ? "text-[#C0392B]"
                : "text-[#78716A]"
            }`}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {trend === "neutral" && <Minus className="h-3 w-3" />}
            {trendValue}
          </span>
        )}
      </div>

      {/* Optional Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3 space-y-1">
          <div className="w-full bg-[#EFE9DF] rounded-full h-2 overflow-hidden border border-[#E2DCD2]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: progressColor }}
            />
          </div>
        </div>
      )}

      {/* Sublabel / Hint */}
      {(sublabel || hint) && (
        <p className="text-xs text-[#57534E] font-semibold mt-2.5 flex items-center gap-1">
          {hint && <Info className="h-3 w-3 text-[#FF5A36] shrink-0" />}
          {sublabel || hint}
        </p>
      )}
    </motion.div>
  );
}
