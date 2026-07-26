"use client";

import React from "react";
import { FolderOpen, Plus, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HumanEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  hint?: string;
}

export default function HumanEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon: Icon = FolderOpen,
  hint,
}: HumanEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card-flat p-10 rounded-3xl bg-[#FBF7F0] border-[#E2DCD2] text-center max-w-lg mx-auto space-y-4 my-8"
    >
      <div className="h-16 w-16 rounded-2xl bg-[#FFF0ED] border border-[#FFCFC4] text-[#FF5A36] flex items-center justify-center mx-auto shadow-sm">
        <Icon className="h-8 w-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg font-bold text-[#211F1D]">
          {title}
        </h3>
        <p className="text-xs text-[#57534E] leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {hint && (
        <p className="text-[11px] text-[#78716A] bg-[#EFE9DF] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 font-semibold border border-[#E2DCD2]">
          <HelpCircle className="h-3 w-3 text-[#FF5A36]" />
          {hint}
        </p>
      )}

      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="btn-primary text-xs min-h-[40px] px-5 shadow-md inline-flex items-center gap-2"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="btn-primary text-xs min-h-[40px] px-5 shadow-md inline-flex items-center gap-2"
            >
              <span>{actionLabel}</span>
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
