import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-010 ENTERPRISE STUDENT NOTIFICATIONS API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_NOTIFICATIONS = [
  {
    id: "notif-std-01",
    title: "Application Shortlisted for Solaris Internship",
    message: "Solaris Power Pvt Ltd selected your application for Hardware Inverter Testbed Internship.",
    category: "OPPORTUNITY",
    read: false,
    createdAt: "2026-07-21T14:30:00Z"
  },
  {
    id: "notif-std-02",
    title: "Review Meeting Scheduled",
    message: "Sprint 2 Review call with Dr. Arunima Krishnan scheduled for July 28 at 10:00 IST.",
    category: "MEETING",
    read: false,
    createdAt: "2026-07-19T10:00:00Z"
  },
  {
    id: "notif-std-03",
    title: "Task Assigned: Node 3 ADC Calibration",
    message: "Dr. Arunima assigned task 'Calibrate Node 3 ADC sensor sampling rate'.",
    category: "TASK",
    read: true,
    createdAt: "2026-07-16T16:00:00Z"
  },
  {
    id: "notif-std-04",
    title: "Stipend Disbursed: ₹25,000",
    message: "Month 1 consultancy stipend credited to your registered bank account.",
    category: "FINANCE",
    read: true,
    createdAt: "2026-07-15T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "ALL";

  let filtered = MOCK_STUDENT_NOTIFICATIONS;
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
      MOCK_STUDENT_NOTIFICATIONS.forEach(n => n.read = true);
    } else if (action === "MARK_READ" && id) {
      const n = MOCK_STUDENT_NOTIFICATIONS.find(item => item.id === id);
      if (n) n.read = true;
    }

    return NextResponse.json({
      success: true,
      unreadCount: MOCK_STUDENT_NOTIFICATIONS.filter(n => !n.read).length,
      message: "Notifications updated."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
