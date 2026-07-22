import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-001",
    industryId: DEMO_ORG_ID,
    title: "Sprint 2 Review Scheduled",
    message: "Dr. Arunima Krishnan accepted the calendar invite for Solar Micro-Grid Sprint 2 review.",
    category: "MEETINGS",
    read: false,
    link: "/industry/meetings/mtg-001",
    channel: "IN_APP",
    createdAt: "2026-07-22T09:00:00Z"
  },
  {
    id: "notif-002",
    industryId: DEMO_ORG_ID,
    title: "Grant Tranche 2 Disbursed",
    message: "DPIIT has released ₹20.00 Lakhs for Clean Energy Scaleup Grant Tranche 2.",
    category: "FINANCE",
    read: false,
    link: "/industry/finance/grants",
    channel: "IN_APP",
    createdAt: "2026-07-20T14:30:00Z"
  },
  {
    id: "notif-003",
    industryId: DEMO_ORG_ID,
    title: "E-Signature Completed",
    message: "Master R&D MoU with IIT Madras has been fully signed by all authorized parties.",
    category: "LEGAL",
    read: true,
    link: "/industry/legal",
    channel: "IN_APP",
    createdAt: "2026-07-18T11:00:00Z"
  },
  {
    id: "notif-004",
    industryId: DEMO_ORG_ID,
    title: "New Problem Statement AI Analysis Ready",
    message: "AI Feasibility Score of 94/100 generated for Grid Frequency Balancing problem statement.",
    category: "PROJECTS",
    read: true,
    link: "/industry/problem-statements/ps-001",
    channel: "IN_APP",
    createdAt: "2026-07-15T16:20:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "ALL";

  let filtered = MOCK_NOTIFICATIONS;
  if (category && category !== "ALL") {
    filtered = filtered.filter(n => n.category === category);
  }

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return NextResponse.json({
    notifications: filtered,
    total: filtered.length,
    unreadCount
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === "MARK_ALL_READ") {
      MOCK_NOTIFICATIONS.forEach(n => { n.read = true; });
    } else if (id) {
      const target = MOCK_NOTIFICATIONS.find(n => n.id === id);
      if (target) target.read = true;
    }

    return NextResponse.json({
      success: true,
      message: "Notifications updated successfully."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
