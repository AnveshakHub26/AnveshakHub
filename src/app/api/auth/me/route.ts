import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseId: authUser.id },
          { email: authUser.email }
        ]
      },
      include: {
        organization: true,
      }
    });

    if (!dbUser) {
      return NextResponse.json({ authenticated: false, error: "User profile not found in database" }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser.id,
        supabaseId: authUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName || dbUser.name,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
        phone: dbUser.phone,
        emailVerified: dbUser.emailVerified,
        createdAt: dbUser.createdAt,
        organization: dbUser.organization,
      }
    });
  } catch (error: any) {
    console.error("Auth Me API Error:", error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
