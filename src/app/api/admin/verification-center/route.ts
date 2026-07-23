import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "ALL";
    const stage = searchParams.get("stage") || "ALL";

    const whereClause: any = {};
    if (type !== "ALL") whereClause.type = type;
    if (stage !== "ALL") whereClause.stage = stage;

    const requests = await prisma.verificationRequest.findMany({
      where: whereClause,
      include: {
        organization: true,
        assignedOfficer: { select: { name: true, fullName: true, email: true } },
        documents: true,
      },
      orderBy: { submittedAt: "desc" }
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      orgId: r.orgId,
      orgName: r.organization?.orgName || "Enterprise Partner",
      orgType: r.organization?.orgType || "Private Limited",
      email: r.organization?.email || "",
      phone: r.organization?.phone || "",
      type: r.type,
      stage: r.stage,
      priority: r.priority,
      assignedOfficer: r.assignedOfficer?.fullName || r.assignedOfficer?.name || "Unassigned",
      riskScore: r.riskScore,
      fraudFlag: r.fraudFlag,
      duplicateFlag: r.duplicateFlag,
      submittedAt: r.submittedAt,
      domain: r.organization?.industryDomain || "Technology",
      city: r.organization?.city || "Mumbai",
      state: r.organization?.state || "Maharashtra",
      documentsCount: r.documents.length,
      documentsApproved: r.documents.filter((d) => d.status === "APPROVED").length,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("GET Verification Center Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch verification requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, action, notes, stage } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: "requestId and action are required" }, { status: 400 });
    }

    const updated = await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        stage: stage || (action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "DOCUMENT_VERIFICATION"),
        ...(action === "APPROVE" && { approvedAt: new Date() }),
        ...(action === "REJECT" && { rejectedAt: new Date(), rejectionReason: notes || "Did not pass compliance check" }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Verification request ${action.toLowerCase()}d successfully`,
      data: updated,
    });
  } catch (error: any) {
    console.error("POST Verification Action Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process verification action" }, { status: 500 });
  }
}
