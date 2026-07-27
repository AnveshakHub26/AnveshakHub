import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json({
      proposals: [],
      total: 0
    });
  } catch (error: any) {
    return NextResponse.json({ proposals: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      proposal: {
        id: `prp-${Date.now()}`,
        title: body.title || "Research Advisory Proposal",
        status: "SUBMITTED",
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create proposal" }, { status: 500 });
  }
}
