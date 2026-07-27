import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, phone, organizationName, designation, department, course } = body;

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
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
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

    // Map Prisma role enum and user role label
    let dbRole: "SUPER_ADMIN" | "INDUSTRY_MANAGER" | "STAKEHOLDER" = "STAKEHOLDER";
    let userRoleName = "STUDENT";
    let redirectUrl = "/student/dashboard";

    if (role === "industry") {
      dbRole = "INDUSTRY_MANAGER";
      userRoleName = "INDUSTRY_MANAGER";
      redirectUrl = "/industry/dashboard";
    } else if (role === "expert") {
      dbRole = "STAKEHOLDER";
      userRoleName = "EXPERT";
      redirectUrl = "/expert/dashboard";
    } else if (role === "student") {
      dbRole = "STAKEHOLDER";
      userRoleName = "STUDENT";
      redirectUrl = "/student/dashboard";
    } else if (role === "admin") {
      dbRole = "SUPER_ADMIN";
      userRoleName = "SUPER_ADMIN";
      redirectUrl = "/admin/dashboard";
    }

    // 3. Register User in Supabase Auth
    let authUser: { id: string; email?: string } | null = null;
    try {
      const adminSupabase = createAdminClient();
      const { data: authData } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { fullName, role: userRoleName }
      });
      if (authData?.user) {
        authUser = authData.user;
      }
    } catch (supabaseErr) {
      console.warn("Supabase Admin Auth bypass for local dev:", supabaseErr);
    }

    const supabaseId = authUser?.id || `usr-sp-${Date.now()}`;

    // 4. Provision Industry Organization if industry user
    let organizationId: string | undefined = undefined;
    let createdOrg: any = null;

    if (role === "industry") {
      const orgName = organizationName || `${fullName}'s Enterprise`;
      try {
        createdOrg = await prisma.organization.create({
          data: {
            orgName,
            orgType: "PRIVATE_LIMITED",
            email: email,
            phone: phone || "+91 9876543210",
            industryDomain: "Technology",
            businessCategory: "COMMERCIAL",
            state: "Karnataka",
            district: "Bangalore",
            city: "Bangalore",
            pin: "560001",
            addressLine: "Tech Park",
            verificationStatus: "PENDING",
          }
        });
        organizationId = createdOrg.id;
      } catch (orgErr) {
        console.warn("Organization creation warning:", orgErr);
      }
    }

    // 5. Create Prisma User Record
    const dbUser = await prisma.user.create({
      data: {
        email,
        fullName,
        name: fullName.split(" ")[0],
        role: dbRole,
        phone: phone || null,
        organizationId,
        department: department || null,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
        organizationId: true,
        organization: true,
      }
    });

    // 6. Create Profile Relation
    if (role === "expert") {
      try {
        await prisma.expertProfile.create({
          data: {
            userId: dbUser.id,
            institution: organizationName || "Partner University",
            designation: designation || "Subject Matter Expert",
            department: department || "Research & Advisory",
            yearsOfExp: 5,
          }
        });
      } catch (e) {
        console.warn("ExpertProfile creation notice:", e);
      }
    } else if (role === "student") {
      try {
        await prisma.studentProfile.create({
          data: {
            userId: dbUser.id,
            institution: organizationName || "Partner Institution",
            degree: course || "Undergraduate Degree",
            branch: department || "General",
            semester: 6,
            cgpa: 9.0,
          }
        });
      } catch (e) {
        console.warn("StudentProfile creation notice:", e);
      }
    }

    // 7. Write AuditLog
    await logAudit({
      userId: dbUser.id,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: dbUser.id,
      details: JSON.stringify({ role: userRoleName, email, organizationId }),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: dbUser.id,
        supabaseId: supabaseId,
        email: dbUser.email,
        fullName: dbUser.fullName || dbUser.name,
        role: userRoleName,
        organization: dbUser.organization,
      },
      redirectUrl,
    });

    // Store persistent cookie with userRoleName ("EXPERT", "INDUSTRY_MANAGER", "STUDENT")
    response.cookies.set("anveshakhub-auth", JSON.stringify({
      userId: dbUser.id,
      email: dbUser.email,
      role: userRoleName,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
