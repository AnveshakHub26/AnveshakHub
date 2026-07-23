import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Authenticate against Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    const authUser = authData.user;

    // 2. Fetch or Sync User Profile in Supabase PostgreSQL via Prisma
    let dbUser = await prisma.user.findFirst({
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
      // Auto-provision DB User if missing
      const role = (authUser.user_metadata?.role as any) || "STAKEHOLDER";
      dbUser = await prisma.user.create({
        data: {
          supabaseId: authUser.id,
          email: authUser.email!,
          fullName: authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
          name: authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
          role: role,
          emailVerified: !!authUser.email_confirmed_at,
        },
        include: {
          organization: true,
        }
      });
    } else if (!dbUser.supabaseId) {
      // Link existing record with Supabase ID
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { supabaseId: authUser.id, emailVerified: !!authUser.email_confirmed_at },
        include: {
          organization: true,
        }
      });
    }

    // Determine redirect route based on role
    let redirectUrl = "/";
    if (dbUser.role === "SUPER_ADMIN" || dbUser.role === "CRM_SPECIALIST" || dbUser.role === "COMPLIANCE_OFFICER") {
      redirectUrl = "/admin/dashboard";
    } else if (dbUser.role === "INDUSTRY_MANAGER" || dbUser.organizationId) {
      redirectUrl = "/industry/dashboard";
    } else if (dbUser.role === "STAKEHOLDER") {
      redirectUrl = "/expert/dashboard";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        supabaseId: authUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName || dbUser.name,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
        emailVerified: dbUser.emailVerified,
      },
      redirectUrl,
      session: {
        accessToken: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
        expiresAt: authData.session?.expires_at,
      }
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + (error.message || "Failed to process login") },
      { status: 500 }
    );
  }
}
