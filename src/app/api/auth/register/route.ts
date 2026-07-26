import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, phone, organizationName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    // 1. Email format and password complexity validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // 2. Duplicate user prevention check (email and fullName)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { fullName }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "An account with this email address already exists. Please sign in instead." }, { status: 400 });
      }
      if (existingUser.fullName === fullName) {
        return NextResponse.json({ error: "An account with this full name already exists. Please use a unique full name." }, { status: 400 });
      }
    }

    // Map role enum
    let dbRole = "STUDENT";
    let redirectUrl = "/student/dashboard";

    if (role === "industry") {
      dbRole = "INDUSTRY_MANAGER";
      redirectUrl = "/industry/dashboard";
    } else if (role === "expert") {
      dbRole = "EXPERT";
      redirectUrl = "/expert/dashboard";
    } else if (role === "admin") {
      dbRole = "SUPER_ADMIN";
      redirectUrl = "/admin/dashboard";
    }

    // 3. Register User in Supabase Auth via Service Role with fallback for local dev
    let authUser: { id: string; email?: string } | null = null;

    try {
      const adminSupabase = createAdminClient();
      const { data: authData } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: dbRole,
          phone,
        }
      });
      if (authData?.user) authUser = authData.user;
    } catch (e) {
      console.warn("Supabase Auth admin createUser warning:", e);
    }

    const supabaseId = authUser?.id || `dev-user-${Date.now()}`;

    // 4. Create User, Organization, VerificationRequest, and AuditLog in Supabase PostgreSQL via Prisma
    let organizationId: string | undefined = undefined;
    let createdOrg: any = null;

    if (role === "industry" || organizationName) {
      createdOrg = await prisma.organization.create({
        data: {
          orgName: organizationName || `${fullName}'s Organization`,
          orgType: "PRIVATE_LIMITED",
          email: email,
          phone: phone || "+91 9876543210",
          industryDomain: "Technology",
          businessCategory: "COMMERCIAL",
          state: "Maharashtra",
          district: "Mumbai",
          city: "Mumbai",
          pin: "400001",
          addressLine: "Enterprise Park",
          verificationStatus: "PENDING",
        }
      });
      organizationId = createdOrg.id;
    }

    const dbUser = await prisma.user.create({
      data: {
        email: email,
        fullName: fullName,
        name: fullName,
        role: dbRole as any,
        phone: phone || null,
        emailVerified: true,
        organizationId: organizationId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true,
        role: true,
        organizationId: true,
        organization: true,
      }
    });

    // Create VerificationRequest for Admin Verification Center Queue
    if (createdOrg) {
      await prisma.verificationRequest.create({
        data: {
          orgId: createdOrg.id,
          type: "INDUSTRY",
          stage: "SUBMITTED",
          priority: "STANDARD",
          submittedAt: new Date().toISOString(),
          riskScore: 12,
          fraudFlag: false,
          duplicateFlag: false,
        }
      });
    }

    // Write AuditLog
    await logAudit({
      userId: dbUser.id,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: dbUser.id,
      details: JSON.stringify({ role: dbRole, email, organizationId }),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: dbUser.id,
        supabaseId: supabaseId,
        email: dbUser.email,
        fullName: dbUser.fullName || dbUser.name,
        role: dbUser.role,
        organization: dbUser.organization,
      },
      redirectUrl,
    });

    response.cookies.set("anveshakhub-auth", JSON.stringify({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 365 days persistent session
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + (error.message || "Failed to create account") },
      { status: 500 }
    );
  }
}
