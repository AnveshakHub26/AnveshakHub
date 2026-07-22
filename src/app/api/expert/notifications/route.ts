import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-010 ENTERPRISE NOTIFICATIONS API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_NOTIFICATIONS = [
  {
    id: "notif-01",
    title: "Sprint 2 Deliverable Approved",
    message: "Solaris Power Pvt Ltd approved the Sprint 2 Ring Topology Technical Review Report.",
    category: "PROJECT",
    read: false,
    createdAt: "2026-07-20T14:30:00Z"
  },
  {
    id: "notif-02",
    title: "Meeting Scheduled: Rover Architecture Sync",
    message: "Robotics Corp scheduled a video call session for Aug 2, 2026 at 14:00 IST.",
    category: "MEETING",
    read: false,
    createdAt: "2026-07-18T10:00:00Z"
  },
  {
    id: "notif-03",
    title: "Mentee Task Milestone Submission",
    message: "Arpit Goel submitted Node 3 ADC calibration test log.",
    category: "MENTORSHIP",
    read: true,
    createdAt: "2026-07-15T16:00:00Z"
  },
  {
    id: "notif-04",
    title: "Consultancy Fee Disbursed",
    message: "₹1,500,000 disbursement for Solar Micro-Grid Milestone 2 credited to your account.",
    category: "FINANCE",
    read: true,
    createdAt: "2026-07-15T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "ALL";

  let filtered = MOCK_EXPERT_NOTIFICATIONS;
  if (category && category !== "ALL") {
    filtered = filtered.filter(n => n.category === category);
  }

  return NextResponse.json({
    notifications: filtered,
    unreadCount: filtered.filter(n => !n.read).length
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === "MARK_ALL_READ") {
      MOCK_EXPERT_NOTIFICATIONS.forEach(n => n.read = true);
    } else if (action === "MARK_READ" && id) {
      const n = MOCK_EXPERT_NOTIFICATIONS.find(item => item.id === id);
      if (n) n.read = true;
    }

    return NextResponse.json({
      success: true,
      unreadCount: MOCK_EXPERT_NOTIFICATIONS.filter(n => !n.read).length,
      message: "Notifications updated."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
