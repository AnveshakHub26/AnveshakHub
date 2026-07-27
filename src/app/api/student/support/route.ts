import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("anveshakhub-auth")?.value;
    let userId: string | undefined = undefined;

    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie);
        userId = parsed.userId;
      } catch {}
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase() || "";

    const faqs = [
      { id: "faq-1", question: "How do student R&D stipends get disbursed?", answer: "Stipends are transferred on the 1st of every month via direct bank transfer under corporate SLA approval.", category: "STIPEND" },
      { id: "faq-2", question: "What happens if a project milestone is delayed?", answer: "Inform your expert lead via the sprint board. Milestone extensions can be granted by the industry sponsor.", category: "MILESTONES" },
      { id: "faq-3", question: "How can I request an institutional NOC letter?", answer: "Submit an NOC request through the Document Portal under Student Verification Services.", category: "DOCUMENTS" }
    ];

    const filteredFaqs = q
      ? faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
      : faqs;

    return NextResponse.json({
      faqs: filteredFaqs,
      tickets: [],
      unreadCount: 0
    });
  } catch (error: any) {
    return NextResponse.json({ faqs: [], tickets: [], unreadCount: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      ticket: {
        id: `tkt-${Date.now()}`,
        ticketNumber: `TKT-STD-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: body.subject || "Student Inquiry",
        category: body.category || "GENERAL",
        priority: body.priority || "MEDIUM",
        status: "OPEN",
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create support ticket" }, { status: 500 });
  }
}
