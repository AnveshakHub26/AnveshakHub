import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_TRANSACTIONS = [
  {
    id: "tx-001",
    industryId: DEMO_ORG_ID,
    type: "EXPENSE",
    amount: 850000.00,
    costCenterCode: "CC-RND",
    costCenterName: "R&D Prototyping & Equipment",
    status: "APPROVED",
    description: "High-efficiency Solar Inverter modules procurement for IIT Madras lab",
    referenceId: "INV-2026-089",
    receiptUrl: "https://storage.anvesha.in/receipts/inv-089.pdf",
    category: "Equipment",
    paymentMethod: "BANK_TRANSFER",
    createdAt: "2026-07-18T10:30:00Z"
  },
  {
    id: "tx-002",
    industryId: DEMO_ORG_ID,
    type: "REVENUE",
    amount: 2000000.00,
    costCenterCode: "CC-CSR",
    costCenterName: "CSR Clean Energy Deployment",
    status: "APPROVED",
    description: "Tranche 2 Grant Disbursement received from DPIIT Clean Energy Fund",
    referenceId: "GRANT-TR-02",
    receiptUrl: "https://storage.anvesha.in/receipts/grant-tr2.pdf",
    category: "CSR Grant",
    paymentMethod: "NEFT",
    createdAt: "2026-06-15T14:00:00Z"
  },
  {
    id: "tx-003",
    industryId: DEMO_ORG_ID,
    type: "EXPENSE",
    amount: 140000.00,
    costCenterCode: "CC-STIPEND",
    costCenterName: "Student Intern Stipends & Grants",
    status: "APPROVED",
    description: "Monthly Intern stipends payout (Arpit Goel, Rishika Roy, Kabir Verma)",
    referenceId: "STIPEND-JUL-26",
    receiptUrl: "https://storage.anvesha.in/receipts/stipend-jul.pdf",
    category: "Stipend",
    paymentMethod: "DIRECT_DEBIT",
    createdAt: "2026-07-05T09:15:00Z"
  },
  {
    id: "tx-004",
    industryId: DEMO_ORG_ID,
    type: "EXPENSE",
    amount: 55000.00,
    costCenterCode: "CC-OPS",
    costCenterName: "Compliance, Audits & Platform Ops",
    status: "APPROVED",
    description: "ISO 9001 quality audit renewal fee payment to TUV Rheinland",
    referenceId: "AUDIT-ISO-9001",
    receiptUrl: "https://storage.anvesha.in/receipts/audit-fee.pdf",
    category: "Taxation & Audit",
    paymentMethod: "CREDIT_CARD",
    createdAt: "2026-06-28T16:45:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "ALL";

  let filtered = MOCK_TRANSACTIONS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.referenceId?.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  if (type && type !== "ALL") {
    filtered = filtered.filter(t => t.type === type);
  }

  return NextResponse.json({
    transactions: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, amount, costCenterCode, description, category, paymentMethod, referenceId } = body;

    const newTx = {
      id: `tx-${Date.now()}`,
      industryId: DEMO_ORG_ID,
      type: type || "EXPENSE",
      amount: parseFloat(amount) || 0.00,
      costCenterCode: costCenterCode || "CC-RND",
      costCenterName: costCenterCode === "CC-STIPEND" ? "Student Intern Stipends" : "R&D Prototyping & Equipment",
      status: "APPROVED",
      description: description || "Financial transaction entry",
      referenceId: referenceId || `REF-${Date.now()}`,
      receiptUrl: null,
      category: category || "General",
      paymentMethod: paymentMethod || "BANK_TRANSFER",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      transaction: newTx,
      message: "Transaction logged in financial ledger successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }
}
