import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_LEAVES = [
  { id: "lv-001", employeeId: "emp-001", employeeName: "Dr. Arunima K.", leaveType: "CASUAL", startDate: "2026-07-25", endDate: "2026-07-26", reason: "Medical checkup and personal work", status: "PENDING" },
  { id: "lv-002", employeeId: "emp-003", employeeName: "Amit V. Deshmukh", leaveType: "SICK", startDate: "2026-07-28", endDate: "2026-07-29", reason: "Viral fever recovery", status: "PENDING" }
];

const MOCK_ASSETS = [
  { id: "ast-001", name: "Apple MacBook Pro M3", serialNumber: "C02XYZ123ABC", assignedAt: "2026-01-16T10:00:00Z" },
  { id: "ast-002", name: "Yubikey 5C NFC", serialNumber: "YUBI98765", assignedAt: "2026-01-16T10:00:00Z" }
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const employee = await prisma.employee.findUnique({
  //   where: { id },
  //   include: { leaves: true, assets: true }
  // });

  return NextResponse.json({
    id,
    leaves: MOCK_LEAVES.filter(l => l.employeeId === id || id === "emp-001"),
    assets: MOCK_ASSETS
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, leaveId, status, assetName, assetSerial } = body;

  // API Integration Point:
  // if (action === "DEACTIVATE") {
  //   await prisma.employee.update({ where: { id }, data: { status: "INACTIVE" } });
  // } else if (action === "APPROVE_LEAVE") {
  //   await prisma.employeeLeave.update({ where: { id: leaveId }, data: { status } });
  // } else if (action === "ASSIGN_ASSET") {
  //   await prisma.employeeAsset.create({ data: { employeeId: id, name: assetName, serialNumber: assetSerial } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Employee profile configuration updated successfully",
    timestamp: new Date().toISOString()
  });
}
