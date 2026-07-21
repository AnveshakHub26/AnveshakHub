import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERTS = [
  {
    id: "exp-001",
    userId: "usr-exp-001",
    user: {
      name: "Dr. Arunima Krishnan",
      email: "dr.arunima@aiml.in",
      avatarUrl: null
    },
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    department: "Computer Science & Engineering",
    yearsOfExp: 16,
    rating: 4.9,
    availability: "AVAILABLE",
    linkedinUrl: "linkedin.com/in/arunima-krishnan-ai",
    googleScholar: "scholar.google.com/citations?user=arunima",
    orcid: "orcid.org/0000-0002-1823-7462",
    skills: ["Deep Learning", "NLP", "Reinforcement Learning", "PyTorch", "Transformers"],
    domains: ["AI/ML Research", "Healthcare Diagnostics", "Autonomous Systems"],
    certifications: [
      { name: "NVIDIA DLI Certified Instructor", issuer: "NVIDIA", year: 2022 },
      { name: "Google Cloud Professional ML Engineer", issuer: "Google", year: 2023 }
    ],
    employmentHistory: [
      { role: "Associate Professor", org: "IISc Bangalore", period: "2015 - 2020" },
      { role: "Research Scientist", org: "Microsoft Research", period: "2011 - 2015" }
    ],
    status: "ACTIVE",
    projectsCount: 3,
    studentsCount: 6,
    createdAt: "2026-05-10T10:00:00Z"
  },
  {
    id: "exp-002",
    userId: "usr-exp-002",
    user: {
      name: "Prof. Rajiv Menon",
      email: "rajiv.menon@nanotech.in",
      avatarUrl: null
    },
    designation: "Principal Investigator",
    institution: "IISc Bangalore",
    department: "Materials Engineering",
    yearsOfExp: 22,
    rating: 4.8,
    availability: "AVAILABLE",
    linkedinUrl: "linkedin.com/in/rajiv-menon-nano",
    googleScholar: "scholar.google.com/citations?user=rajivmenon",
    orcid: "orcid.org/0000-0001-9988-1234",
    skills: ["Nanomaterials", "Semiconductors", "Thin Films", "Spectroscopy"],
    domains: ["Nanotechnology", "Solar Energy Materials", "Microelectronics"],
    certifications: [
      { name: "Fellow of Royal Society of Chemistry", issuer: "RSC", year: 2019 }
    ],
    employmentHistory: [
      { role: "Assistant Professor", org: "IIT Bombay", period: "2004 - 2010" }
    ],
    status: "ACTIVE",
    projectsCount: 2,
    studentsCount: 4,
    createdAt: "2026-06-01T09:30:00Z"
  },
  {
    id: "exp-003",
    userId: "usr-exp-003",
    user: {
      name: "Dr. Anjali Sharma",
      email: "anjali.sharma@biogen.in",
      avatarUrl: null
    },
    designation: "Chief Biotech Advisor",
    institution: "BioGen Diagnostics LLP",
    department: "Genomics Division",
    yearsOfExp: 14,
    rating: 4.7,
    availability: "BUSY",
    linkedinUrl: "linkedin.com/in/anjali-sharma-bio",
    googleScholar: "scholar.google.com/citations?user=anjalisharma",
    orcid: "orcid.org/0000-0003-4455-8899",
    skills: ["Genomics", "CRISPR", "Bioinformatics", "Python", "R"],
    domains: ["BioTech Research", "Genetic Engineering", "Pathology Automation"],
    certifications: [
      { name: "Certified Genomics Specialist", issuer: "ASCP", year: 2021 }
    ],
    employmentHistory: [
      { role: "Senior Scientist", org: "Biocon", period: "2014 - 2022" }
    ],
    status: "ACTIVE",
    projectsCount: 4,
    studentsCount: 8,
    createdAt: "2026-06-15T11:00:00Z"
  },
  {
    id: "exp-004",
    userId: "usr-exp-004",
    user: {
      name: "Rohan Das",
      email: "rohan.das@spaceaero.in",
      avatarUrl: null
    },
    designation: "Lead Systems Architect",
    institution: "Astra Launch Systems",
    department: "Avionics",
    yearsOfExp: 11,
    rating: 4.5,
    availability: "AVAILABLE",
    linkedinUrl: "linkedin.com/in/rohan-das-space",
    googleScholar: null,
    orcid: "orcid.org/0000-0002-3322-1100",
    skills: ["Avionics", "Control Systems", "C++", "MATLAB", "Embedded Systems"],
    domains: ["Space Technology", "Drone Research", "Guidance Systems"],
    certifications: [
      { name: "Systems Engineering Professional", issuer: "INCOSE", year: 2020 }
    ],
    employmentHistory: [
      { role: "Avionics Engineer", org: "ISRO", period: "2015 - 2021" }
    ],
    status: "ACTIVE",
    projectsCount: 1,
    studentsCount: 2,
    createdAt: "2026-07-02T14:00:00Z"
  },
  {
    id: "exp-005",
    userId: "usr-exp-005",
    user: {
      name: "Dr. Venkat Rao",
      email: "venkat.rao@solartech.in",
      avatarUrl: null
    },
    designation: "Energy Storage Specialist",
    institution: "Solaris Power Pvt Ltd",
    department: "R&D Lab",
    yearsOfExp: 19,
    rating: 4.6,
    availability: "ON_LEAVE",
    linkedinUrl: "linkedin.com/in/venkat-rao-energy",
    googleScholar: "scholar.google.com/citations?user=venkatrao",
    orcid: "orcid.org/0000-0001-5544-3322",
    skills: ["Battery Management Systems", "Solid-State Batteries", "Electrochemistry"],
    domains: ["Clean Energy", "Electric Vehicles", "Micro-grids"],
    certifications: [
      { name: "IEEE Senior Member", issuer: "IEEE", year: 2018 }
    ],
    employmentHistory: [
      { role: "Lead Scientist", org: "Tesla R&D", period: "2010 - 2018" }
    ],
    status: "ACTIVE",
    projectsCount: 2,
    studentsCount: 3,
    createdAt: "2026-07-10T16:00:00Z"
  },
  {
    id: "exp-006",
    userId: "usr-exp-006",
    user: {
      name: "Karan Mehta",
      email: "karan.mehta@expert.in",
      avatarUrl: null
    },
    designation: "Consultant Cyber Security",
    institution: "IIIT Hyderabad",
    department: "Center for Security Research",
    yearsOfExp: 9,
    rating: 4.2,
    availability: "AVAILABLE",
    linkedinUrl: "linkedin.com/in/karan-mehta-sec",
    googleScholar: null,
    orcid: null,
    skills: ["Penetration Testing", "Cryptography", "Network Security", "Rust"],
    domains: ["Cyber Security", "Secure Protocols", "Fintech Protection"],
    certifications: [
      { name: "Certified Information Systems Security Professional (CISSP)", issuer: "ISC2", year: 2021 }
    ],
    employmentHistory: [
      { role: "Security Analyst", org: "Stripe", period: "2019 - 2022" }
    ],
    status: "PENDING",
    projectsCount: 0,
    studentsCount: 0,
    createdAt: "2026-07-20T10:15:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const domain = searchParams.get("domain") || "";
  const status = searchParams.get("status") || "";
  const availability = searchParams.get("availability") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const sortBy = searchParams.get("sortBy") || "rating";
  const sortDir = searchParams.get("sortDir") || "desc";

  // API Integration Point:
  // const [experts, total] = await Promise.all([
  //   prisma.expertProfile.findMany({ where: {...}, include: { user: true }, skip, take, orderBy: { [sortBy]: sortDir } }),
  //   prisma.expertProfile.count({ where: {...} })
  // ]);

  let filtered = MOCK_EXPERTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.user.name.toLowerCase().includes(q) ||
        e.user.email.toLowerCase().includes(q) ||
        e.institution.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (domain && domain !== "ALL") {
    filtered = filtered.filter((e) => e.domains.includes(domain));
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((e) => e.status === status);
  }

  if (availability && availability !== "ALL") {
    filtered = filtered.filter((e) => e.availability === availability);
  }

  const sorted = [...filtered].sort((a, b) => {
    const aVal = ((a as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    const bVal = ((b as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    return sortDir === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  // Statistics
  const stats = {
    total: MOCK_EXPERTS.length,
    active: MOCK_EXPERTS.filter((e) => e.status === "ACTIVE").length,
    pending: MOCK_EXPERTS.filter((e) => e.status === "PENDING").length,
    avgRating: parseFloat((MOCK_EXPERTS.reduce((acc, curr) => acc + curr.rating, 0) / MOCK_EXPERTS.length).toFixed(2)),
    availableCount: MOCK_EXPERTS.filter((e) => e.availability === "AVAILABLE").length,
    domainsList: Array.from(new Set(MOCK_EXPERTS.flatMap((e) => e.domains))),
    skillsList: Array.from(new Set(MOCK_EXPERTS.flatMap((e) => e.skills)))
  };

  return NextResponse.json({
    experts: paginated,
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
    // const newExpert = await prisma.expertProfile.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `exp-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "PENDING",
      projectsCount: 0,
      studentsCount: 0
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create expert profile" }, { status: 500 });
  }
}
