import { NextRequest, NextResponse } from "next/server";

const MOCK_TICKET_DETAILS: Record<string, any> = {
  "tkt-001": {
    id: "tkt-001",
    ticketNumber: "INC-2026-041",
    subject: "DPIIT Grant Tranche 2 Receipt Upload Issue",
    category: "BILLING",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignedTo: "Support Officer - Anveshak Hub",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-21T14:20:00Z",
    messages: [
      { id: "m1", author: "Rajesh Sharma", role: "USER", text: "When uploading the PDF receipt for Tranche 2, the system showed a 504 timeout error.", time: "2026-07-20T10:00:00Z" },
      { id: "m2", author: "Support Officer", role: "AGENT", text: "We have checked the file vault endpoint. The file size threshold has been increased to 25MB. Could you try re-uploading?", time: "2026-07-21T14:20:00Z" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = MOCK_TICKET_DETAILS[id] || {
    id,
    ticketNumber: `INC-2026-099`,
    subject: `Support Ticket ${id}`,
    category: "TECHNICAL",
    priority: "MEDIUM",
    status: "OPEN",
    assignedTo: "Support Officer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      { id: "m0", author: "Rajesh Sharma", role: "USER", text: "Issue description logged with Anveshak Helpdesk.", time: new Date().toISOString() }
    ]
  };

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, text, status } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Support ticket updated.",
    timestamp: new Date().toISOString(),
    newMessage: text ? {
      id: `m-${Date.now()}`,
      author: "Rajesh Sharma",
      role: "USER",
      text,
      time: new Date().toISOString()
    } : undefined,
    status: status || "IN_PROGRESS"
  });
}
