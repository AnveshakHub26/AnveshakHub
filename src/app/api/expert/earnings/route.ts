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
      totalEarnings: 0,
      pendingPayouts: 0,
      currency: "INR",
      payoutHistory: []
    });
  } catch (error: any) {
    return NextResponse.json({ totalEarnings: 0, pendingPayouts: 0, currency: "INR", payoutHistory: [] });
  }
}
