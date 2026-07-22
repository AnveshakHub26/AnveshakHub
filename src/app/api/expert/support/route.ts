import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-012 ENTERPRISE SUPPORT & HELP CENTER API
// ─────────────────────────────────────────────────────────────────

const MOCK_FAQS = [
  { id: "faq-01", question: "How do I submit an Expression of Interest (EOI) for an industry problem statement?", category: "OPPORTUNITIES", answer: "Navigate to the Opportunities Directory, select an open RFP, click 'Submit EOI', specify your proposed budget, duration, and technical proposal." },
  { id: "faq-02", question: "How are consultancy honorariums disbursed to experts?", category: "FINANCE", answer: "Honorariums are disbursed directly to your registered bank account upon industry partner milestone approval and receipt generation." },
  { id: "faq-03", question: "Can I issue letters of recommendation directly from the platform?", category: "MENTORSHIP", answer: "Yes, open the Student Mentee Detail workspace, select the 'Recommendation' tab, click 'Issue Recommendation', and enter your recommendation letter content." }
];

const MOCK_TICKETS = [
  {
    id: "tkt-001",
    ticketNumber: "EXP-TKT-9021",
    subject: "Inquiry regarding Node 3 Travel Expense Reimbursement Status",
    category: "REIMBURSEMENT",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-07-21T10:00:00Z"
  },
  {
    id: "tkt-002",
    ticketNumber: "EXP-TKT-8842",
    subject: "Request for Google Scholar Automated Citation Sync",
    category: "FEATURE_REQUEST",
    priority: "LOW",
    status: "RESOLVED",
    createdAt: "2026-06-15T14:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  let filteredFaqs = MOCK_FAQS;
  if (search) {
    const q = search.toLowerCase();
    filteredFaqs = MOCK_FAQS.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }

  return NextResponse.json({
    faqs: filteredFaqs,
    tickets: MOCK_TICKETS
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, category, priority, description } = body;

    const newTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `EXP-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject || "General Support Ticket",
      category: category || "TECHNICAL",
      priority: priority || "MEDIUM",
      status: "OPEN",
      createdAt: new Date().toISOString()
    };

    MOCK_TICKETS.unshift(newTicket);

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Support ticket created. An AnveshakHub support engineer will respond within 4 business hours."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
