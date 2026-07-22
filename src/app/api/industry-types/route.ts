import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC INDUSTRY TYPES API
// ─────────────────────────────────────────────────────────────────

const DEFAULT_INDUSTRY_TYPES = [
  { id: "type-startup", code: "STARTUP", name: "Startup", category: "COMMERCIAL", description: "DPIIT Recognized or Early-stage Technology Innovation Ventures", icon: "Rocket" },
  { id: "type-msme", code: "MSME", name: "MSME", category: "COMMERCIAL", description: "Micro, Small & Medium Manufacturing / Service Enterprises", icon: "Building" },
  { id: "type-enterprise", code: "ENTERPRISE", name: "Enterprise / Private Co", category: "COMMERCIAL", description: "Established Private or Public Limited Corporations & Conglomerates", icon: "Briefcase" },
  { id: "type-llp", code: "LLP", name: "Limited Liability Partnership (LLP)", category: "COMMERCIAL", description: "Registered Professional Partnerships & Consultancy Firms", icon: "FileText" },
  { id: "type-institution", code: "INSTITUTION", name: "Academic Institution", category: "EDUCATIONAL", description: "UGC / AICTE Approved Universities, Colleges & Engineering Institutes", icon: "GraduationCap" },
  { id: "type-research", code: "RESEARCH", name: "Research Organization", category: "RESEARCH", description: "CSIR, ICAR, DRDO, DST Approved National Labs & R&D Facilities", icon: "Microscope" },
  { id: "type-ngo", code: "NGO", name: "NGO / Non-Profit", category: "NON_PROFIT", description: "Registered Section 8 Companies, Trusts & Social Impact Foundations", icon: "HeartHandshake" },
  { id: "type-manufacturing", code: "MANUFACTURING", name: "Manufacturing & Industrial", category: "COMMERCIAL", description: "Heavy Machinery, Electronics, OEM & Plant Operations", icon: "Factory" },
  { id: "type-healthcare", code: "HEALTHCARE", name: "Healthcare & Life Sciences", category: "COMMERCIAL", description: "Hospitals, Clinical Labs, Medical Devices & Biotech Enterprises", icon: "Activity" },
  { id: "type-agriculture", code: "AGRICULTURE", name: "Agritech & Farming", category: "COMMERCIAL", description: "Agricultural Research, Agri-Business & Farming Tech Enterprises", icon: "Sprout" },
  { id: "type-automobile", code: "AUTOMOBILE", name: "Automotive & EV", category: "COMMERCIAL", description: "EV OEMs, Powertrain R&D & Mobility Technology Partners", icon: "Car" },
  { id: "type-aerospace", code: "AEROSPACE", name: "Aerospace & Defence", category: "COMMERCIAL", description: "Avionics, Drone Manufacturing, Defence & Space Tech Labs", icon: "Plane" },
  { id: "type-energy", code: "ENERGY", name: "Clean Energy & Utilities", category: "COMMERCIAL", description: "Solar, Wind, Power Grid & Renewable Energy Developers", icon: "Zap" },
  { id: "type-fintech", code: "FINTECH", name: "Banking & Finance", category: "COMMERCIAL", description: "NBFCs, Insurtech, Payment Systems & Financial Services", icon: "CreditCard" },
  { id: "type-software", code: "SOFTWARE", name: "IT & Software Services", category: "COMMERCIAL", description: "SaaS Platforms, Cloud Engineering, AI Research & Software Export", icon: "Code" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let filtered = DEFAULT_INDUSTRY_TYPES;
  if (category && category !== "ALL") {
    filtered = filtered.filter(t => t.category === category);
  }

  return NextResponse.json({
    industryTypes: filtered,
    totalCount: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, category, description, icon } = body;

    const newType = {
      id: `type-${Date.now()}`,
      code: (code || name).toUpperCase().replace(/\s+/g, "_"),
      name,
      category: category || "COMMERCIAL",
      description: description || "Custom Industry Partner Category",
      icon: icon || "Building"
    };

    DEFAULT_INDUSTRY_TYPES.push(newType);

    return NextResponse.json({
      success: true,
      industryType: newType,
      message: `New Industry Type '${name}' successfully configured for AnveshakHub registration.`
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create Industry Type" }, { status: 500 });
  }
}
