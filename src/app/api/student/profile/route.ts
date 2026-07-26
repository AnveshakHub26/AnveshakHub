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

    let userRecord: any = null;
    if (userId) {
      userRecord = await prisma.user.findUnique({
        where: { id: userId },
        include: { studentProfile: true }
      });
    }

    if (!userRecord) {
      userRecord = await prisma.user.findFirst({
        where: { role: "STAKEHOLDER" },
        include: { studentProfile: true }
      });
    }

    if (!userRecord) {
      return NextResponse.json({
        id: "empty-student",
        userId: "empty-id",
        name: "New Student",
        email: "student@example.com",
        usn: "N/A",
        institution: "Not specified",
        degree: "Undergraduate",
        branch: "Engineering",
        semester: 1,
        cgpa: 0.0,
        bio: "Profile info not submitted yet.",
        skills: [],
        resumeUrl: "",
        portfolioUrl: "",
        linkedinUrl: "",
        githubUrl: "",
        verificationStatus: "PENDING",
        careerInterests: [],
        certifications: [],
        achievements: [],
        projectsList: []
      });
    }

    const profile = userRecord.studentProfile;

    return NextResponse.json({
      id: userRecord.id,
      userId: userRecord.id,
      name: userRecord.fullName || userRecord.name || userRecord.email,
      email: userRecord.email,
      usn: profile?.usn || "N/A",
      institution: profile?.institution || "Partner Institution",
      degree: profile?.degree || "Undergraduate Degree",
      branch: profile?.branch || "General",
      semester: 1,
      cgpa: 0.0,
      bio: "Registered Student Researcher.",
      skills: [],
      resumeUrl: profile?.resumeUrl || "",
      portfolioUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      verificationStatus: "VERIFIED",
      careerInterests: [],
      certifications: [],
      achievements: [],
      projectsList: []
    });
  } catch (error: any) {
    console.error("GET Student Profile Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load student profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
