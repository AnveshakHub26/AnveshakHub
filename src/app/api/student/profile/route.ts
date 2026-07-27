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

    if (!userId) {
      return NextResponse.json(
        { authenticated: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });

    if (!userRecord) {
      return NextResponse.json(
        { authenticated: false, message: "User account not found" },
        { status: 404 }
      );
    }

    const sp = userRecord.studentProfile;
    const isProfileComplete = !!(sp?.institution && sp?.degree && sp?.usn);

    return NextResponse.json({
      id: sp?.id || `sp-${userRecord.id}`,
      userId: userRecord.id,
      name: userRecord.name || userRecord.fullName || userRecord.email.split("@")[0],
      email: userRecord.email,
      usn: sp?.usn || null,
      institution: sp?.institution || null,
      degree: sp?.degree || null,
      branch: sp?.branch || null,
      semester: sp?.semester || null,
      cgpa: sp?.cgpa || null,
      bio: sp?.bio || null,
      skills: sp?.skills || [],
      resumeUrl: sp?.resumeUrl || null,
      portfolioUrl: sp?.portfolioUrl || null,
      linkedinUrl: sp?.linkedinUrl || null,
      githubUrl: sp?.githubUrl || null,
      verificationStatus: sp?.verificationStatus || "PENDING",
      isProfileComplete
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch student profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { name, usn, institution, degree, branch, semester, cgpa, bio, skills, resumeUrl } = body;

    // Update User Name
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name, fullName: name }
      });
    }

    // Upsert StudentProfile
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        usn: usn || undefined,
        institution: institution || undefined,
        degree: degree || undefined,
        branch: branch || undefined,
        semester: semester ? Number(semester) : undefined,
        cgpa: cgpa ? Number(cgpa) : undefined,
        bio: bio || undefined,
        skills: skills || undefined,
        resumeUrl: resumeUrl || undefined,
      },
      create: {
        userId,
        institution: institution || "Partner Institution",
        degree: degree || "Undergraduate Degree",
        branch: branch || "Engineering",
        semester: semester ? Number(semester) : 6,
        cgpa: cgpa ? Number(cgpa) : 9.0,
        usn: usn || null,
        bio: bio || null,
        skills: skills || [],
        resumeUrl: resumeUrl || null,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
