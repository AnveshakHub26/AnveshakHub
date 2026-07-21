import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// const orgId = req.headers.get("x-org-id") ?? "org-001";
// ─────────────────────────────────────────────────────────────────

const DEMO_ORG_ID = "org-001";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || DEMO_ORG_ID;

  // ── KPI Metrics
  const kpis = {
    activeProjects: 6,
    pendingMeetings: 3,
    openProblemStatements: 4,
    grantApplications: 2,
    platformCreditBalance: 2850000
  };

  // ── Project Progress
  const projects = [
    { id: "prj-001", name: "Solar Grid AI Pilot", progress: 72, status: "ON_TRACK", milestone: "Phase 3 — Testing" },
    { id: "prj-002", name: "Vayu Aerospace Drone Nav", progress: 45, status: "IN_PROGRESS", milestone: "Phase 2 — Prototype" },
    { id: "prj-003", name: "BioGen Clinical Data System", progress: 91, status: "NEAR_COMPLETE", milestone: "Phase 5 — Deployment" }
  ];

  // ── Today's Meetings
  const meetings = [
    { id: "mtg-001", title: "Solar Grid Kickoff Review", time: "10:30 AM", platform: "GOOGLE_MEET", link: "https://meet.google.com/abc-xyz" },
    { id: "mtg-002", title: "Expert Matching Committee", time: "02:00 PM", platform: "MICROSOFT_TEAMS", link: "https://teams.microsoft.com/abc" },
    { id: "mtg-003", title: "Q3 Grant Compliance Audit", time: "04:30 PM", platform: "ZOOM", link: "https://zoom.us/j/12345678" }
  ];

  // ── Recent Activity
  const activities = [
    { id: "act-001", type: "PROJECT_UPDATE", description: "Solar Grid AI Pilot advanced to Phase 3 Testing milestone.", timestamp: "2026-07-21T14:00:00Z" },
    { id: "act-002", type: "EXPERT_ASSIGNED", description: "Dr. Arisudan assigned as AI Lead for BioGen Clinical project.", timestamp: "2026-07-21T11:30:00Z" },
    { id: "act-003", type: "GRANT_APPLICATION", description: "MeitY Smart Grid Innovation Fund application submitted.", timestamp: "2026-07-20T16:00:00Z" },
    { id: "act-004", type: "MEETING_SCHEDULED", description: "Q3 Grant Compliance Audit meeting scheduled for today.", timestamp: "2026-07-20T09:00:00Z" }
  ];

  // ── Financial Summary
  const financial = {
    allocatedBudget: 5000000,
    disbursedAmount: 3200000,
    remainingBalance: 1800000,
    currency: "INR"
  };

  // ── Quick Actions
  const quickActions = [
    { label: "Submit Problem Statement", href: "/industry/problem-statements/new", icon: "FileText" },
    { label: "Schedule Expert Meeting", href: "/industry/meetings/new", icon: "Calendar" },
    { label: "Apply for Grant", href: "/industry/grants", icon: "Landmark" },
    { label: "Browse Expert Marketplace", href: "/industry/marketplace", icon: "ShoppingBag" }
  ];

  return NextResponse.json({
    orgId,
    kpis,
    projects,
    meetings,
    activities,
    financial,
    quickActions
  });
}
