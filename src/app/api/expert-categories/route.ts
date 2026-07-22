import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC EXPERT CATEGORIES API
// ─────────────────────────────────────────────────────────────────

const DEFAULT_EXPERT_CATEGORIES = [
  { id: "cat-prof", code: "PROFESSOR", name: "Professor / Associate Professor", group: "ACADEMIC", description: "Senior University Academic, Faculty Advisor & Research Department Head", icon: "GraduationCap" },
  { id: "cat-phd", code: "PHD_HOLDER", name: "PhD Holder / Postdoc Researcher", group: "RESEARCH", description: "Doctoral Degree Holder specializing in Advanced Applied R&D", icon: "Award" },
  { id: "cat-researcher", code: "RESEARCH_SCHOLAR", name: "Research Scholar", group: "RESEARCH", description: "Active Doctoral / Master Researcher in Academic & Industrial Labs", icon: "Microscope" },
  { id: "cat-industry", code: "INDUSTRY_PROFESSIONAL", name: "Industry Professional", group: "TECHNICAL", description: "Corporate Technology Specialist, Engineering Manager & R&D Lead", icon: "Briefcase" },
  { id: "cat-ai-ml", code: "AI_ML_EXPERT", name: "AI / Machine Learning Expert", group: "TECHNICAL", description: "LLM, Computer Vision, Deep Learning & Neural Network Specialist", icon: "Cpu" },
  { id: "cat-cybersecurity", code: "CYBER_SECURITY", name: "Cyber Security Expert", group: "TECHNICAL", description: "CEH / OSCP Certified Security Researcher & VAPT Lead", icon: "ShieldCheck" },
  { id: "cat-fullstack", code: "FULLSTACK_DEV", name: "Full Stack Developer", group: "TECHNICAL", description: "Next.js, Node.js, React, Python & Cloud Application Architect", icon: "Code" },
  { id: "cat-devops", code: "DEVOPS_ENGINEER", name: "DevOps & Cloud Architect", group: "TECHNICAL", description: "Kubernetes, Docker, CI/CD Pipelines & AWS/Azure Infrastructure", icon: "Cloud" },
  { id: "cat-freelancer", code: "FREELANCER", name: "Freelancer / Independent Expert", group: "PROFESSIONAL", description: "Independent Technology Contractor & Specialized Project Consultant", icon: "UserCheck" },
  { id: "cat-consultant", code: "CONSULTANT", name: "Management / Tech Consultant", group: "ADVISORY", description: "Strategic Technology Advisor, Transformation Lead & Enterprise SME", icon: "TrendingUp" },
  { id: "cat-uiux", code: "UIUX_DESIGNER", name: "UI / UX & Product Designer", group: "TECHNICAL", description: "Design Systems, User Experience Research & Interface Specialist", icon: "Figma" },
  { id: "cat-patent", code: "PATENT_CONSULTANT", name: "Patent Consultant / Attorney", group: "ADVISORY", description: "IP Protection, Patent Drafting, Prior Art Search & Legal Advisory", icon: "FileText" },
  { id: "cat-ca", code: "CHARTERED_ACCOUNTANT", name: "Chartered Accountant (CA)", group: "PROFESSIONAL", description: "ICAI Member, Corporate Taxation, R&D Audit & Financial Advisory", icon: "Calculator" },
  { id: "cat-legal", code: "LEGAL_ADVISOR", name: "Legal Advisor", group: "ADVISORY", description: "Bar Council Advocate, IP Licensing & Regulatory Compliance Counsel", icon: "Scale" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");

  let filtered = DEFAULT_EXPERT_CATEGORIES;
  if (group && group !== "ALL") {
    filtered = filtered.filter(c => c.group === group);
  }

  return NextResponse.json({
    expertCategories: filtered,
    totalCount: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, group, description, icon } = body;

    const newCat = {
      id: `cat-${Date.now()}`,
      code: (code || name).toUpperCase().replace(/\s+/g, "_"),
      name,
      group: group || "TECHNICAL",
      description: description || "Custom Expert Category",
      icon: icon || "Briefcase"
    };

    DEFAULT_EXPERT_CATEGORIES.push(newCat);

    return NextResponse.json({
      success: true,
      expertCategory: newCat,
      message: `New Expert Category '${name}' configured successfully.`
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create Expert Category" }, { status: 500 });
  }
}
