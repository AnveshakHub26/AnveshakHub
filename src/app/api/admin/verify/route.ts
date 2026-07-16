import { NextRequest, NextResponse } from "next/server";

// In-memory queue of pending organizations for verification
let verificationQueue = [
  { id: "v-1", orgName: "Solaris Power Pvt Ltd", type: "Private Limited", domain: "Clean Energy", submittedAt: "16 Jul 2026", documentStatus: "UPLOADED", priority: "HIGH" },
  { id: "v-2", orgName: "Vayu Aerospace Solutions", type: "Partnership", domain: "Drone Research", submittedAt: "15 Jul 2026", documentStatus: "PENDING_AUDIT", priority: "STANDARD" },
  { id: "v-3", orgName: "BioGen Diagnostics", type: "LLP", domain: "BioTech Research", submittedAt: "16 Jul 2026", documentStatus: "UPLOADED", priority: "HIGH" },
  { id: "v-4", orgName: "Astra Launch Systems", type: "Startup (DPIIT)", domain: "Space Technology", submittedAt: "14 Jul 2026", documentStatus: "UNDER_REVIEW", priority: "STANDARD" }
];

export async function GET() {
  return NextResponse.json({ queue: verificationQueue });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, comment } = body; // action: APPROVE or REJECT

    const idx = verificationQueue.findIndex(item => item.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Organization record not found in queue" }, { status: 404 });
    }

    const removedItem = verificationQueue.splice(idx, 1)[0];

    /*
     * Audit Log Integration Point:
     * await prisma.auditLog.create({
     *   data: {
     *     action: `${action}_ORGANIZATION`,
     *     details: `Org ${removedItem.orgName} processed. Comment: ${comment || 'No comment'}`
     *   }
     * });
     */

    return NextResponse.json({
      success: true,
      message: `Organization ${removedItem.orgName} has been successfully ${action === "APPROVE" ? "approved" : "rejected"}.`,
      item: removedItem
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
