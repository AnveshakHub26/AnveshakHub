"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, FileText, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: "COMPLETED" | "IN_PROGRESS" | "UPCOMING" | "OVERDUE" | "UNDER_REVIEW";
  description: string;
  deliverables?: Array<{ name: string; type: string; size?: string }>;
  deliverableCount?: number;
  approvedBy?: string;
  stipendAmount?: number;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onSelectMilestone?: (milestone: Milestone) => void;
  activeId?: string;
}

const statusConfig = {
  COMPLETED: {
    label: "Milestone Verified",
    badgeBg: "bg-[#E8F2EC]",
    badgeText: "text-[#2F6B4F]",
    badgeBorder: "border-[#BBD9C8]",
    dotBg: "bg-[#2F6B4F]",
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: "Active Sprint",
    badgeBg: "bg-[#FFF0ED]",
    badgeText: "text-[#FF5A36]",
    badgeBorder: "border-[#FFCFC4]",
    dotBg: "bg-[#FF5A36]",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Expert Audit Queue",
    badgeBg: "bg-[#FEF3C7]",
    badgeText: "text-[#B45309]",
    badgeBorder: "border-[#FDE68A]",
    dotBg: "bg-[#B45309]",
    icon: Clock,
  },
  OVERDUE: {
    label: "Deadline Exceeded",
    badgeBg: "bg-[#FEE2E2]",
    badgeText: "text-[#C0392B]",
    badgeBorder: "border-[#FECACA]",
    dotBg: "bg-[#C0392B]",
    icon: AlertTriangle,
  },
  UPCOMING: {
    label: "Scheduled Phase",
    badgeBg: "bg-[#EFE9DF]",
    badgeText: "text-[#78716A]",
    badgeBorder: "border-[#E2DCD2]",
    dotBg: "bg-[#A8A196]",
    icon: Clock,
  },
};

export default function MilestoneTimeline({ milestones, onSelectMilestone, activeId }: MilestoneTimelineProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="relative pl-6 border-l-2 border-[#E2DCD2] space-y-8 ml-2">
        {milestones.map((m, idx) => {
          const cfg = statusConfig[m.status] || statusConfig.UPCOMING;
          const Icon = cfg.icon;
          const isSelected = activeId === m.id;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              onClick={() => onSelectMilestone?.(m)}
              className={`relative group cursor-pointer transition-all ${
                isSelected ? "scale-[1.01]" : ""
              }`}
            >
              {/* Timeline Dot Node */}
              <div
                className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-[#FBF7F0] ${cfg.dotBg} shadow-sm group-hover:scale-125 transition-transform`}
              />

              {/* Card Container */}
              <div
                className={`card-flat p-5 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-[#FFF0ED] border-[#FF5A36] shadow-md"
                    : "bg-[#FBF7F0] hover:bg-[#EFE9DF] hover:border-[#FF5A36]/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#78716A]">PHASE 0{idx + 1}</span>
                    <h4 className="font-heading text-base font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors">
                      {m.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    <span className="text-xs font-semibold text-[#78716A]">
                      Due: {m.dueDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                  {m.description}
                </p>

                {/* Optional Deliverables & Payout Metadata */}
                {(m.deliverables?.length || m.approvedBy || m.stipendAmount) && (
                  <div className="mt-3 pt-3 border-t border-[#E2DCD2] flex flex-wrap items-center justify-between gap-3 text-xs">
                    {m.deliverables && m.deliverables.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-[#FF5A36]" />
                        <span className="font-semibold text-[#211F1D]">
                          {m.deliverables.length} Deliverable PDF{m.deliverables.length > 1 ? "s" : ""} Uploaded
                        </span>
                      </div>
                    )}

                    {m.stipendAmount && (
                      <div className="text-xs font-bold text-[#2F6B4F] bg-[#E8F2EC] px-2.5 py-1 rounded-lg border border-[#BBD9C8]">
                        Milestone Escrow: ₹{m.stipendAmount.toLocaleString("en-IN")}
                      </div>
                    )}

                    {m.approvedBy && (
                      <span className="text-[11px] text-[#78716A] font-semibold">
                        Verified by {m.approvedBy}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
