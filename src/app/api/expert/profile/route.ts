import { NextRequest, NextResponse } from "next/server";

const MOCK_EXPERT_PROFILE = {
  id: "exp-001",
  userId: "usr-exp-001",
  name: "Dr. Arunima Krishnan",
  designation: "Professor & Head of AI Research",
  institution: "IIT Madras",
  department: "Computer Science & Engineering",
  yearsOfExp: 15,
  bio: "15 years of industry experience in machine learning, distributed computing, and energy grid optimization systems. Has led 7 successful industry-academia projects worth ₹12Cr in total.",
  rating: 4.9,
  reviewsCount: 34,
  availabilityStatus: "AVAILABLE",
  hourlyRate: 3500.00,
  preferredHoursPerWeek: 12,
  verificationStatus: "VERIFIED",
  linkedinUrl: "https://linkedin.com/in/dr-arunima",
  googleScholar: "https://scholar.google.com/citations?user=arunk",
  orcid: "0000-0001-2345-6789",
  skills: ["Python", "TensorFlow", "MATLAB", "Power Systems", "Reinforcement Learning", "Distributed Computing"],
  domains: ["AI/ML", "Grid Technology", "Distributed Systems", "Clean Energy"],
  certifications: [
    { title: "Google Cloud Professional ML Engineer", issuer: "Google", year: 2024 },
    { title: "IEEE Senior Member", issuer: "IEEE", year: 2022 }
  ],
  employmentHistory: [
    { role: "Professor & Head of AI Lab", organization: "IIT Madras", duration: "2020 – Present" },
    { role: "Associate Professor", organization: "IIT Madras", duration: "2015 – 2020" },
    { role: "Senior Research Scientist", organization: "ABB Corporate Research", duration: "2011 – 2015" }
  ],
  publications_list: [
    { title: "Decentralized Load Balancing in Smart Micro-Grids Using Reinforcement Learning", journal: "IEEE Transactions on Smart Grid", year: 2024, doi: "10.1109/TSG.2024.10293", citations: 42 },
    { title: "Federated Learning for Energy Demand Prediction in Distributed Sensor Networks", journal: "Nature Energy", year: 2023, doi: "10.1038/s41560-023-0112", citations: 118 },
    { title: "Multi-Agent RL for Power Sharing in Off-Grid Solar Arrays", journal: "Applied Energy", year: 2022, doi: "10.1016/j.apenergy.2022.09.041", citations: 86 }
  ],
  patents: [
    { title: "Adaptive Voltage Regulation Circuit for Micro-Grid Solar Nodes", patentNumber: "IN202441089201", status: "GRANTED", year: 2024 },
    { title: "Federated Sensor Fusion Algorithm for Distributed Energy Storage", patentNumber: "IN202341071234", status: "FILED", year: 2023 }
  ],
  documents: [
    { id: "doc-exp-01", name: "Institutional No-Objection Certificate (NOC).pdf", docType: "NOC", fileUrl: "https://storage.anvesha.in/expert-docs/noc-iit.pdf", status: "APPROVED" },
    { id: "doc-exp-02", name: "Ph.D. Degree & Academic Credentials.pdf", docType: "CERTIFICATE", fileUrl: "https://storage.anvesha.in/expert-docs/phd-cert.pdf", status: "APPROVED" }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_EXPERT_PROFILE);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bio, designation, availabilityStatus, hourlyRate, preferredHoursPerWeek, skills, domains, newPublication, newPatent } = body;

    if (bio !== undefined) MOCK_EXPERT_PROFILE.bio = bio;
    if (designation !== undefined) MOCK_EXPERT_PROFILE.designation = designation;
    if (availabilityStatus !== undefined) MOCK_EXPERT_PROFILE.availabilityStatus = availabilityStatus;
    if (hourlyRate !== undefined) MOCK_EXPERT_PROFILE.hourlyRate = parseFloat(hourlyRate);
    if (preferredHoursPerWeek !== undefined) MOCK_EXPERT_PROFILE.preferredHoursPerWeek = parseInt(preferredHoursPerWeek);
    if (skills !== undefined) MOCK_EXPERT_PROFILE.skills = skills;
    if (domains !== undefined) MOCK_EXPERT_PROFILE.domains = domains;

    if (newPublication) {
      MOCK_EXPERT_PROFILE.publications_list.unshift({
        title: newPublication.title,
        journal: newPublication.journal,
        year: parseInt(newPublication.year) || 2026,
        doi: newPublication.doi || "10.1109/IEEE.2026",
        citations: 0
      });
    }

    if (newPatent) {
      MOCK_EXPERT_PROFILE.patents.unshift({
        title: newPatent.title,
        patentNumber: newPatent.patentNumber || `IN2026${Math.floor(100000 + Math.random() * 900000)}`,
        status: newPatent.status || "FILED",
        year: parseInt(newPatent.year) || 2026
      });
    }

    return NextResponse.json({
      success: true,
      message: "Expert profile and research portfolio updated successfully.",
      profile: MOCK_EXPERT_PROFILE
    });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
