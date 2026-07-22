import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// IND-008 ENTERPRISE FINANCE DASHBOARD METRICS API
// ─────────────────────────────────────────────────────────────────

const DEMO_ORG_ID = "org-001";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    orgId: DEMO_ORG_ID,
    summary: {
      totalAllocatedBudget: 15000000.00, // ₹1.5 Cr
      totalUtilizedFunds: 9850000.00,    // ₹98.5 Lakhs (65.6%)
      remainingBudget: 5150000.00,       // ₹51.5 Lakhs
      totalGrantsDisbursed: 7500000.00,  // ₹75 Lakhs
      pendingInvoicesCount: 3,
      pendingInvoicesAmount: 1850000.00  // ₹18.5 Lakhs
    },
    costCenters: [
      { id: "cc-01", code: "CC-RND", name: "R&D Prototyping & Equipment", allocated: 6000000.00, spent: 4400000.00, utilization: 73.3 },
      { id: "cc-02", code: "CC-STIPEND", name: "Student Intern Stipends & Grants", allocated: 3500000.00, spent: 2100000.00, utilization: 60.0 },
      { id: "cc-03", code: "CC-CSR", name: "CSR Clean Energy Deployment", allocated: 4000000.00, spent: 2800000.00, utilization: 70.0 },
      { id: "cc-04", code: "CC-OPS", name: "Compliance, Audits & Platform Ops", allocated: 1500000.00, spent: 550000.00, utilization: 36.6 }
    ],
    projectBudgets: [
      { id: "prj-001", name: "Solar Micro-Grid for IIT Madras", totalBudget: 7500000.00, spent: 5200000.00, status: "ON_TRACK" },
      { id: "prj-004", name: "Autonomous Rover Control Module", totalBudget: 4500000.00, spent: 2800000.00, status: "ON_TRACK" },
      { id: "prj-005", name: "AI Bioreactor Cell Monitoring", totalBudget: 3000000.00, spent: 1850000.00, status: "NEEDS_ATTENTION" }
    ],
    monthlyBurnRate: [
      { month: "Jan", revenue: 2500000, expense: 1200000 },
      { month: "Feb", revenue: 1800000, expense: 1400000 },
      { month: "Mar", revenue: 3200000, expense: 1600000 },
      { month: "Apr", revenue: 2000000, expense: 1100000 },
      { month: "May", revenue: 2800000, expense: 1750000 },
      { month: "Jun", revenue: 3500000, expense: 1900000 },
      { month: "Jul", revenue: 4000000, expense: 900000 }
    ]
  });
}
