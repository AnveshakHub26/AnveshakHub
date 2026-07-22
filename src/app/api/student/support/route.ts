import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-012 ENTERPRISE STUDENT SUPPORT & HELP CENTER API
// ─────────────────────────────────────────────────────────────────

const MOCK_FAQS = [
  { id: "faq-std-01", question: "How do I apply for an industry R&D internship?", category: "OPPORTUNITIES", answer: "Open Opportunities Directory, select an active role, click 'Apply Now', enter your cover note and submit your verified student resume." },
  { id: "faq-std-02", question: "How is my student stipend disbursed?", category: "FINANCE", answer: "Stipends are transferred to your registered bank account upon monthly lead mentor milestone approval." },
  { id: "faq-std-03", question: "How do I request a review call with my lead expert mentor?", category: "MEETINGS", answer: "Navigate to Meetings & Collaboration, click 'Request Review Session', enter the agenda and select your preferred meeting date." }
];

const MOCK_TICKETS = [
  {
    id: "tkt-std-001",
    ticketNumber: "STU-TKT-1042",
    subject: "Inquiry regarding Month 1 Stipend Payout Date",
    category: "REIMBURSEMENT",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-07-20T10:00:00Z"
  },
  {
    id: "tkt-std-002",
    ticketNumber: "STU-TKT-0918",
    subject: "Request for Official IEEE Student Verification Badge",
    category: "VERIFICATION",
    priority: "LOW",
    status: "RESOLVED",
    createdAt: "2026-06-10T14:00:00Z"
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
      id: `tkt-std-${Date.now()}`,
      ticketNumber: `STU-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
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
      message: "Student support ticket created. An AnveshakHub support engineer will respond within 4 business hours."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
