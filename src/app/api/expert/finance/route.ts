import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-008 EARNINGS & FINANCIAL MANAGEMENT API
// ─────────────────────────────────────────────────────────────────

const MOCK_FINANCE_METRICS = {
  kpis: {
    totalEarnings: 385000.00,
    honorariumIncome: 245000.00,
    activeGrantsTotal: 12000000.00,
    pendingReimbursements: 18500.00
  },
  earningsHistory: [
    { id: "ern-01", project: "Solar Micro-Grid for IIT Madras", amount: 150000.00, type: "CONSULTANCY_FEE", status: "PAID", date: "2026-07-15T00:00:00Z" },
    { id: "ern-02", project: "Autonomous Rover Control Module", amount: 95000.00, type: "HONORARIUM", status: "PAID", date: "2026-06-30T00:00:00Z" },
    { id: "ern-03", project: "BioSynth AI Advisory", amount: 140000.00, type: "CONSULTANCY_FEE", status: "PAID", date: "2026-05-20T00:00:00Z" }
  ],
  reimbursements: [
    { id: "rmb-01", title: "Flight & Travel for Solaris On-Site Review", category: "TRAVEL", amount: 12500.00, status: "DISBURSED", date: "2026-07-10T00:00:00Z" },
    { id: "rmb-02", title: "Node 3 Microcontroller Board Component Purchase", category: "LAB_EQUIPMENT", amount: 6000.00, status: "SUBMITTED", date: "2026-07-21T00:00:00Z" }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_FINANCE_METRICS);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, amount, category, receiptUrl } = body;

    const newClaim = {
      id: `rmb-${Date.now()}`,
      title: title || "Lab Expense Claim",
      category: category || "TRAVEL",
      amount: parseFloat(amount) || 5000.00,
      status: "SUBMITTED",
      receiptUrl: receiptUrl || "https://storage.anvesha.in/receipts/receipt.pdf",
      date: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      claim: newClaim,
      message: "Expense reimbursement claim submitted successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit reimbursement claim" }, { status: 500 });
  }
}
