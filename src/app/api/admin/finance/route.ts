import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_COST_CENTERS = [
  { id: "cc-001", name: "University R&D Projects", code: "RD-UNI-2026", budget: 8500000, allocated: 4500000 },
  { id: "cc-002", name: "B2B Marketplace Operations", code: "OPS-MKT-2026", budget: 3000000, allocated: 1200000 },
  { id: "cc-003", name: "CSR R&D Innovations", code: "CSR-INN-2026", budget: 5000000, allocated: 2500000 },
  { id: "cc-004", name: "Platform Admin & Legal Vaults", code: "ADM-LEG-2026", budget: 2000000, allocated: 800000 }
];

const MOCK_TRANSACTIONS = [
  { id: "tx-001", costCenterCode: "RD-UNI-2026", type: "EXPENSE", amount: 450000, status: "RECONCILED", description: "Feasibility hardware panels grid syncing", referenceId: "PRJ-001", category: "Equipment", createdAt: "2026-07-15T10:00:00Z" },
  { id: "tx-002", costCenterCode: "RD-UNI-2026", type: "EXPENSE", amount: 12000, status: "RECONCILED", description: "Student intern stipend disbursement", referenceId: "PRJ-001", category: "Stipend", createdAt: "2026-07-20T14:30:00Z" },
  { id: "tx-003", costCenterCode: "OPS-MKT-2026", type: "REVENUE", amount: 150000, status: "RECONCILED", description: "B2B platform commission Solaris integration", referenceId: "OPP-001", category: "Platform Fee", createdAt: "2026-07-18T11:00:00Z" },
  { id: "tx-004", costCenterCode: "CSR-INN-2026", type: "EXPENSE", amount: 250000, status: "PENDING", description: "Initial MeitY startup incubation funding", referenceId: "GNT-001", category: "Incubation", createdAt: "2026-07-21T09:00:00Z" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || ""; // REVENUE, EXPENSE
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [transactions, costCenters] = await Promise.all([
  //   prisma.financialTransaction.findMany({ where: {...}, skip, take }),
  //   prisma.costCenter.findMany()
  // ]);

  let filtered = MOCK_TRANSACTIONS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.costCenterCode.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
    );
  }

  if (type && type !== "ALL") {
    filtered = filtered.filter((tx) => tx.type === type);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Stats summaries
  const totalRevenue = MOCK_TRANSACTIONS.filter(t => t.type === "REVENUE").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = MOCK_TRANSACTIONS.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0);

  const stats = {
    totalRevenue,
    totalExpense,
    netProfit: totalRevenue - totalExpense,
    allocatedBudget: MOCK_COST_CENTERS.reduce((acc, c) => acc + c.allocated, 0),
    totalBudget: MOCK_COST_CENTERS.reduce((acc, c) => acc + c.budget, 0),
  };

  return NextResponse.json({
    transactions: paginated,
    costCenters: MOCK_COST_CENTERS,
    total,
    page,
    limit,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // API Integration Point:
    // const newTransaction = await prisma.financialTransaction.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `tx-${Date.now()}`,
      ...body,
      status: "PENDING",
      createdAt: new Date().toISOString()
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to record transaction log" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, txId, status } = body;
  
  // API Integration Point: Transaction Reconciliation
  // if (action === "RECONCILE") {
  //   await prisma.financialTransaction.update({ where: { id: txId }, data: { status } });
  // }
  
  return NextResponse.json({
    success: true,
    action,
    message: `Transaction ${txId} successfully updated with status: ${status}.`,
    timestamp: new Date().toISOString()
  });
}
