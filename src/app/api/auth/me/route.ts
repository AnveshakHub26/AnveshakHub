import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("anveshakhub-auth")?.value;

    if (!authCookie) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const userData = JSON.parse(authCookie);

    let redirectUrl = "/student/dashboard";
    const role = userData.role || "";
    if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "CRM_SPECIALIST" || role === "COMPLIANCE_OFFICER") {
      redirectUrl = "/admin/dashboard";
    } else if (role === "INDUSTRY_MANAGER" || role === "INDUSTRY") {
      redirectUrl = "/industry/dashboard";
    } else if (role === "EXPERT") {
      redirectUrl = "/expert/dashboard";
    } else if (role === "STUDENT") {
      redirectUrl = "/student/dashboard";
    }

    return NextResponse.json({
      authenticated: true,
      user: userData,
      redirectUrl,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
