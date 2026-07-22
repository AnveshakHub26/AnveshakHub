import { NextRequest, NextResponse } from "next/server";

const MOCK_TICKET_DETAILS: Record<string, any> = {
  "tkt-std-001": {
    id: "tkt-std-001",
    ticketNumber: "STU-TKT-1042",
    subject: "Inquiry regarding Month 1 Stipend Payout Date",
    category: "REIMBURSEMENT",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-07-20T10:00:00Z",
    messages: [
      { sender: "Arpit Goel", text: "I completed Sprint 1 tasks for Solaris Hardware Inverter on July 15. Could you confirm when the ₹25,000 stipend will be transferred?", timestamp: "2026-07-20T10:00:00Z" },
      { sender: "Anveshak Finance Desk", text: "Hello Arpit, your lead mentor Dr. Arunima Krishnan approved your Milestone 1 report on July 18. The stipend is queued for bank transfer on July 25.", timestamp: "2026-07-20T11:30:00Z" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = MOCK_TICKET_DETAILS[id] || {
    ...MOCK_TICKET_DETAILS["tkt-std-001"],
    id,
    subject: `Support Ticket ${id}`
  };

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { replyText, action } = body;

  const ticket = MOCK_TICKET_DETAILS[id] || MOCK_TICKET_DETAILS["tkt-std-001"];

  if (replyText) {
    ticket.messages.push({
      sender: "Arpit Goel",
      text: replyText,
      timestamp: new Date().toISOString()
    });
  }

  if (action === "RESOLVE") {
    ticket.status = "RESOLVED";
  }

  return NextResponse.json({
    success: true,
    id,
    ticket,
    message: "Ticket updated."
  });
}
