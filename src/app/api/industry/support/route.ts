import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_TICKETS = [
  {
    id: "tkt-001",
    industryId: DEMO_ORG_ID,
    ticketNumber: "INC-2026-041",
    subject: "DPIIT Grant Tranche 2 Receipt Upload Issue",
    category: "BILLING",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignedTo: "Support Officer - Anveshak Hub",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-21T14:20:00Z"
  },
  {
    id: "tkt-002",
    industryId: DEMO_ORG_ID,
    ticketNumber: "INC-2026-018",
    subject: "Adding Custom Sub-Domain for Industry Vault Link",
    category: "TECHNICAL",
    priority: "MEDIUM",
    status: "RESOLVED",
    assignedTo: "DevOps Helpdesk",
    createdAt: "2026-07-10T11:30:00Z",
    updatedAt: "2026-07-12T09:00:00Z"
  }
];

const MOCK_FAQS = [
  {
    id: "kb-01",
    title: "How do I invite subject experts to collaborate on a project?",
    category: "COLLABORATION",
    content: "Navigate to Expert Directory under Industry Portal, search for the expert by institution or skill domain, and click 'Invite to Collaborate'. Select your project and write your invitation message.",
    viewsCount: 342,
    helpfulCount: 89
  },
  {
    id: "kb-02",
    title: "What is the SLA for DPIIT & DST verification approval?",
    category: "VERIFICATION",
    content: "Standard verification requests are processed by assigned compliance officers within 3 to 5 business days. You can track your stage progress live in the Verification Status tab.",
    viewsCount: 512,
    helpfulCount: 140
  },
  {
    id: "kb-03",
    title: "How does version control work in Central Document Vault?",
    category: "DOCUMENTS",
    content: "When uploading a file with an existing document name, AnveshakHub automatically increments the version (v1.0 -> v2.0) and preserves previous versions in the version history tree.",
    viewsCount: 278,
    helpfulCount: 65
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  let filteredTickets = MOCK_TICKETS;
  if (search) {
    const q = search.toLowerCase();
    filteredTickets = filteredTickets.filter(t => t.subject.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q));
  }
  if (status && status !== "ALL") {
    filteredTickets = filteredTickets.filter(t => t.status === status);
  }

  let filteredFaqs = MOCK_FAQS;
  if (search) {
    const q = search.toLowerCase();
    filteredFaqs = filteredFaqs.filter(f => f.title.toLowerCase().includes(q) || f.content.toLowerCase().includes(q));
  }

  return NextResponse.json({
    tickets: filteredTickets,
    faqs: filteredFaqs,
    totalTickets: filteredTickets.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, category, priority, description } = body;

    const newTicket = {
      id: `tkt-${Date.now()}`,
      industryId: DEMO_ORG_ID,
      ticketNumber: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      category: category || "TECHNICAL",
      priority: priority || "MEDIUM",
      status: "OPEN",
      assignedTo: "Support Officer - Anveshak Hub",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Support ticket submitted successfully. Our helpdesk team will respond within 4 hours."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
