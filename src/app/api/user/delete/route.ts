import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    // Fetch database user record
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseId: authUser.id },
          { email: authUser.email }
        ]
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // 1. Delete associated profile records from PostgreSQL
    await prisma.studentProfile.deleteMany({ where: { userId: dbUser.id } });
    await prisma.expertProfile.deleteMany({ where: { userId: dbUser.id } });
    if (dbUser.organizationId) {
      await prisma.industryProfile.deleteMany({ where: { orgId: dbUser.organizationId } });
    }

    // 2. Write AuditLog using helper
    await logAudit({
      userId: dbUser.id,
      action: "ACCOUNT_DELETED",
      entityType: "User",
      entityId: dbUser.id,
      details: JSON.stringify({ email: dbUser.email, role: dbUser.role }),
    });

    // 3. Delete database User record
    await prisma.user.delete({ where: { id: dbUser.id } });

    // 4. Delete user from Supabase Auth via Admin Client
    try {
      const adminSupabase = createAdminClient();
      await adminSupabase.auth.admin.deleteUser(authUser.id);
    } catch (e) {
      console.warn("Supabase Auth admin deletion warning:", e);
    }

    // 5. Sign out session
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Your account and associated profile data have been permanently deleted."
    });
  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 });
  }
}
