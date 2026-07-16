import { NextRequest, NextResponse } from "next/server";

// Mock Database Storage for Leads to enable real pipeline drag-and-drop state changes
let crmLeads = [
  { id: "lead-1", orgName: "Aether Technologies", domain: "Aerospace", stage: "LEAD", estRevenue: 1200000, healthScore: 82, assignedTo: "Aditya Mehta" },
  { id: "lead-2", orgName: "Vayu Aerospace", domain: "Drone Tech", stage: "QUALIFIED", estRevenue: 850000, healthScore: 78, assignedTo: "Rohit Sen" },
  { id: "lead-3", orgName: "BioGen Lab", domain: "BioTech", stage: "MEETING_SCHEDULED", estRevenue: 2400000, healthScore: 92, assignedTo: "Karan Johar" },
  { id: "lead-4", orgName: "Krypton Grid", domain: "Clean Energy", stage: "PROPOSAL_SHARED", estRevenue: 3500000, healthScore: 65, assignedTo: "Aditya Mehta" },
  { id: "lead-5", orgName: "Pixel Foundry", domain: "Graphics AR/VR", stage: "NEGOTIATION", estRevenue: 450000, healthScore: 72, assignedTo: "Neha Sen" },
  { id: "lead-6", orgName: "Solaris Power", domain: "Solar Energy", stage: "APPROVED", estRevenue: 1800000, healthScore: 95, assignedTo: "Rohit Sen" },
  { id: "lead-7", orgName: "Apex Medicals", domain: "MedTech", stage: "PROJECT_INITIATED", estRevenue: 600000, healthScore: 99, assignedTo: "Neha Sen" }
];

let crmTasks = [
  { id: "t-1", title: "Submit NDA Clarification", priority: "HIGH", status: "PENDING", dueDate: "19 Jul 2026", leadName: "Krypton Grid" },
  { id: "t-2", title: "Share Budget Proposals", priority: "MEDIUM", status: "PENDING", dueDate: "21 Jul 2026", leadName: "BioGen Lab" },
  { id: "t-3", title: "Initial Introductory Call", priority: "LOW", status: "COMPLETED", dueDate: "15 Jul 2026", leadName: "Vayu Aerospace" }
];

export async function GET() {
  try {
    // Generate analytics dynamically based on mock values
    const totalPipelineValue = crmLeads.reduce((acc, curr) => acc + curr.estRevenue, 0);
    const avgHealthScore = Math.round(crmLeads.reduce((acc, curr) => acc + curr.healthScore, 0) / crmLeads.length);

    return NextResponse.json({
      leads: crmLeads,
      tasks: crmTasks,
      stats: {
        totalLeads: crmLeads.length,
        pipelineValue: `₹${(totalPipelineValue / 100000).toFixed(1)}L`,
        avgHealth: `${avgHealthScore}%`,
        conversionRate: "72.4%"
      },
      reports: {
        leadConversions: [
          { month: "Jan", leads: 12, converted: 8 },
          { month: "Feb", leads: 15, converted: 11 },
          { month: "Mar", leads: 18, converted: 14 },
          { month: "Apr", leads: 22, converted: 16 },
          { month: "May", leads: 30, converted: 22 }
        ],
        responseTimeHrs: [
          { category: "Govt", hours: 4 },
          { category: "Corporate", hours: 2 },
          { category: "Startup", hours: 1 },
          { category: "Expert", hours: 3 }
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, leadId, newStage, taskId, newStatus } = body;

    // Update Lead Stage (Drag & Drop)
    if (action === "UPDATE_LEAD_STAGE") {
      const idx = crmLeads.findIndex(l => l.id === leadId);
      if (idx !== -1) {
        crmLeads[idx].stage = newStage;
        // Dynamically shift health score as a simulated compliance multiplier
        if (newStage === "PROJECT_INITIATED") crmLeads[idx].healthScore = 99;
        else if (newStage === "NEGOTIATION") crmLeads[idx].healthScore = Math.max(30, crmLeads[idx].healthScore - 8);
        return NextResponse.json({ success: true, updatedLead: crmLeads[idx] });
      }
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Update Task Status
    if (action === "UPDATE_TASK_STATUS") {
      const idx = crmTasks.findIndex(t => t.id === taskId);
      if (idx !== -1) {
        crmTasks[idx].status = newStatus;
        return NextResponse.json({ success: true, updatedTask: crmTasks[idx] });
      }
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Add New Lead
    if (action === "CREATE_LEAD") {
      const { orgName, domain, estRevenue, assignedTo } = body;
      if (!orgName || !domain) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      const newLead = {
        id: `lead-${Date.now()}`,
        orgName,
        domain,
        stage: "LEAD",
        estRevenue: Number(estRevenue) || 0,
        healthScore: 100,
        assignedTo: assignedTo || "Unassigned"
      };
      crmLeads.unshift(newLead);
      return NextResponse.json({ success: true, lead: newLead });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
