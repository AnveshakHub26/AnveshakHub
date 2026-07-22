import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_INDUSTRY_PROJECTS = [
  {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    description: "Design and implement a local solar microgrid within the campus to test decentralized power sharing algorithms.",
    lifecycle: "IN_PROGRESS",
    budget: 4500000,
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-12-15T00:00:00Z",
    progress: 62,
    tasksCount: 12,
    tasksCompleted: 8,
    risksCount: 2,
    issuesCount: 1,
    changeRequestsCount: 1,
    budgetUsed: 3100000,
    experts: [{ name: "Dr. Arunima Krishnan" }],
    students: [{ name: "Arpit Goel" }, { name: "Rishika Roy" }]
  },
  {
    id: "prj-004",
    name: "Autonomous Rover Control Module",
    description: "Develop a backup navigation controller module for exploratory search and rescue autonomous rovers.",
    lifecycle: "UNDER_REVIEW",
    budget: 3500000,
    startDate: "2026-08-01T00:00:00Z",
    endDate: "2027-02-28T00:00:00Z",
    progress: 10,
    tasksCount: 2,
    tasksCompleted: 0,
    risksCount: 1,
    issuesCount: 0,
    changeRequestsCount: 0,
    budgetUsed: 150000,
    experts: [{ name: "Rohan Das" }],
    students: [{ name: "Kabir Verma" }]
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const lifecycle = searchParams.get("lifecycle") || "";

  let filtered = MOCK_INDUSTRY_PROJECTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (lifecycle && lifecycle !== "ALL") {
    filtered = filtered.filter(p => p.lifecycle === lifecycle);
  }

  // Aggregate stats
  const totalBudget = MOCK_INDUSTRY_PROJECTS.reduce((acc, curr) => acc + curr.budget, 0);
  const avgProgress = Math.round(
    MOCK_INDUSTRY_PROJECTS.reduce((acc, curr) => acc + curr.progress, 0) / MOCK_INDUSTRY_PROJECTS.length
  );
  const activeRisks = MOCK_INDUSTRY_PROJECTS.reduce((acc, curr) => acc + curr.risksCount, 0);
  const completedTasks = MOCK_INDUSTRY_PROJECTS.reduce((acc, curr) => acc + curr.tasksCompleted, 0);

  return NextResponse.json({
    projects: filtered,
    total: filtered.length,
    stats: {
      total: MOCK_INDUSTRY_PROJECTS.length,
      totalBudget,
      avgProgress,
      activeRisks,
      completedTasks
    }
  });
}
