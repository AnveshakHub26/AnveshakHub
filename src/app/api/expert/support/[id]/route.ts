import { NextRequest, NextResponse } from "next/server";

const MOCK_TICKET_DETAILS: Record<string, any> = {
  "tkt-001": {
    id: "tkt-001",
    ticketNumber: "EXP-TKT-9021",
    subject: "Inquiry regarding Node 3 Travel Expense Reimbursement Status",
    category: "REIMBURSEMENT",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-07-21T10:00:00Z",
    messages: [
      { sender: "Dr. Arunima Krishnan", text: "I submitted a ₹12,500 travel reimbursement claim for Solaris site visit on July 10. Could you confirm the expected payout date?", timestamp: "2026-07-21T10:00:00Z" },
      { sender: "Anveshak Finance Desk", text: "Hello Dr. Arunima, your claim has been verified by the Solaris finance team and is scheduled for bank transfer on July 25.", timestamp: "2026-07-21T11:30:00Z" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = MOCK_TICKET_DETAILS[id] || {
    ...MOCK_TICKET_DETAILS["tkt-001"],
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

  const ticket = MOCK_TICKET_DETAILS[id] || MOCK_TICKET_DETAILS["tkt-001"];

  if (replyText) {
    ticket.messages.push({
      sender: "Dr. Arunima Krishnan",
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
