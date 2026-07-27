import { NextRequest, NextResponse } from "next/server";

const DYNAMIC_EXPERT_TEMPLATES: Record<string, any> = {
  "PROFESSOR": {
    expertCategoryCode: "PROFESSOR",
    title: "University Faculty & Professor Registration",
    sections: [
      {
        title: "Academic Institutional Appointment",
        fields: [
          { fieldKey: "institutionName", label: "University / Institution Name", fieldType: "TEXT", required: true, placeholder: "e.g. Indian Institute of Technology Bombay" },
          { fieldKey: "department", label: "Academic Department", fieldType: "TEXT", required: true, placeholder: "e.g. Department of Electrical Engineering" },
          { fieldKey: "designation", label: "Academic Designation", fieldType: "SELECT", required: true, options: ["PROFESSOR", "ASSOCIATE_PROFESSOR", "ASSISTANT_PROFESSOR", "DEPARTMENT_HEAD"] },
          { fieldKey: "highestQualification", label: "Highest Academic Degree", fieldType: "SELECT", required: true, options: ["Ph.D.", "D.Sc.", "Postdoctoral", "Master of Technology"] },
          { fieldKey: "teachingExperienceYears", label: "Academic Experience (Years)", fieldType: "NUMBER", required: true, placeholder: "12" }
        ]
      },
      {
        title: "Research Metrics & Academic Indexing",
        fields: [
          { fieldKey: "googleScholarUrl", label: "Google Scholar Profile URL", fieldType: "TEXT", required: true, placeholder: "https://scholar.google.com/citations?user=..." },
          { fieldKey: "orcidId", label: "ORCID iD Number", fieldType: "TEXT", required: true, placeholder: "0000-0002-1825-0097" },
          { fieldKey: "scopusAuthorId", label: "Scopus Author ID", fieldType: "TEXT", required: false, placeholder: "57200000000" },
          { fieldKey: "publicationsCount", label: "Peer-Reviewed Journal Publications", fieldType: "NUMBER", required: true, placeholder: "45" },
          { fieldKey: "patentsGranted", label: "Patents Filed / Granted", fieldType: "NUMBER", required: false, placeholder: "4" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "facultyIdCard", label: "University Faculty ID Card", required: true },
      { docKey: "cvResume", label: "Academic Curriculum Vitae (CV)", required: true },
      { docKey: "degreeCertificate", label: "Highest Doctoral Degree Certificate", required: true }
    ]
  },
  "PHD_HOLDER": {
    expertCategoryCode: "PHD_HOLDER",
    title: "PhD Holder & Postdoc Researcher Registration",
    sections: [
      {
        title: "Doctoral Degree & Thesis Information",
        fields: [
          { fieldKey: "thesisTitle", label: "Doctoral Dissertation / Thesis Title", fieldType: "TEXT", required: true, placeholder: "e.g. High Efficiency Power Electronics Digital Twins" },
          { fieldKey: "degreeAwardedUniversity", label: "University Awarding PhD", fieldType: "TEXT", required: true, placeholder: "e.g. IISc Bangalore / IIT Madras" },
          { fieldKey: "yearAwarded", label: "Year Awarded", fieldType: "NUMBER", required: true, placeholder: "2022" },
          { fieldKey: "researchDomain", label: "Core Research Specialization", fieldType: "TEXT", required: true, placeholder: "e.g. Power Electronics & HIL Simulation" }
        ]
      },
      {
        title: "Research Profiles & Publications",
        fields: [
          { fieldKey: "orcidId", label: "ORCID iD Number", fieldType: "TEXT", required: true, placeholder: "0000-0001-9283-4921" },
          { fieldKey: "googleScholarUrl", label: "Google Scholar Profile", fieldType: "TEXT", required: false, placeholder: "https://scholar.google.com/citations?user=..." },
          { fieldKey: "journalPapersCount", label: "Journal Publications", fieldType: "NUMBER", required: true, placeholder: "12" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "phdCertificate", label: "PhD Degree Award Certificate", required: true },
      { docKey: "cvResume", label: "Detailed Academic CV", required: true }
    ]
  },
  "RESEARCH_SCHOLAR": {
    expertCategoryCode: "RESEARCH_SCHOLAR",
    title: "Research Scholar Onboarding",
    sections: [
      {
        title: "Academic & Research Lab Affiliation",
        fields: [
          { fieldKey: "institutionName", label: "Research Institution / University", fieldType: "TEXT", required: true, placeholder: "e.g. IIT Delhi" },
          { fieldKey: "programType", label: "Current Research Program", fieldType: "SELECT", required: true, options: ["DIRECT_PHD", "SPONSORED_PHD", "MS_BY_RESEARCH", "POSTGRADUATE"] },
          { fieldKey: "guideName", label: "Supervising Guide / Professor Name", fieldType: "TEXT", required: true, placeholder: "Dr. Alok Verma" },
          { fieldKey: "researchTopic", label: "Current Research Problem Statement", fieldType: "TEXTAREA", required: true, placeholder: "Summary of ongoing research objectives" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "studentIdCard", label: "Institutional ID Card", required: true },
      { docKey: "cvResume", label: "Academic CV / Synopsis", required: true }
    ]
  },
  "INDUSTRY_PROFESSIONAL": {
    expertCategoryCode: "INDUSTRY_PROFESSIONAL",
    title: "Corporate Technology Expert Registration",
    sections: [
      {
        title: "Corporate Experience & Leadership",
        fields: [
          { fieldKey: "companyName", label: "Current Employer / Organization", fieldType: "TEXT", required: true, placeholder: "e.g. Siemens Corporate Technology" },
          { fieldKey: "designation", label: "Job Title / Role", fieldType: "TEXT", required: true, placeholder: "e.g. Lead Systems Architect" },
          { fieldKey: "totalExperienceYears", label: "Total Professional Experience (Years)", fieldType: "NUMBER", required: true, placeholder: "10" },
          { fieldKey: "industrySector", label: "Primary Industry Vertical", fieldType: "SELECT", required: true, options: ["AUTOMOTIVE", "AEROSPACE", "SEMICONDUCTOR", "ENERGY", "FINTECH", "BIOTECH", "SOFTWARE"] },
          { fieldKey: "linkedinUrl", label: "LinkedIn Professional Profile URL", fieldType: "TEXT", required: true, placeholder: "https://linkedin.com/in/username" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Professional Resume / CV", required: true },
      { docKey: "employmentProof", label: "Employment Proof / ID Card", required: false }
    ]
  },
  "AI_ML_EXPERT": {
    expertCategoryCode: "AI_ML_EXPERT",
    title: "AI / Machine Learning Specialist Registration",
    sections: [
      {
        title: "AI Frameworks & Technical Mastery",
        fields: [
          { fieldKey: "aiDomains", label: "Primary AI Specializations", fieldType: "SELECT", required: true, options: ["LLM & GEN_AI", "COMPUTER_VISION", "NLP", "REINFORCEMENT_LEARNING", "ROBOTICS_AI"] },
          { fieldKey: "frameworks", label: "Core AI Frameworks", fieldType: "TEXT", required: true, placeholder: "PyTorch, TensorFlow, HuggingFace, CUDA, LangChain" },
          { fieldKey: "githubUrl", label: "GitHub Profile / Open Source Repos", fieldType: "TEXT", required: true, placeholder: "https://github.com/aiml-expert" },
          { fieldKey: "kaggleProfile", label: "Kaggle Profile / Grandmaster Badge", fieldType: "TEXT", required: false, placeholder: "https://kaggle.com/username" }
        ]
      },
      {
        title: "Deployed Models & Architecture",
        fields: [
          { fieldKey: "modelsDeployed", label: "Key Deployed AI Models / Papers", fieldType: "TEXTAREA", required: true, placeholder: "Describe LLMs fine-tuned or vision pipelines deployed in production" },
          { fieldKey: "yearsExperience", label: "Years of Active AI Engineering Experience", fieldType: "NUMBER", required: true, placeholder: "8" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Technical CV / Portfolio", required: true },
      { docKey: "aiCertifications", label: "NVIDIA / AWS ML Specialist Certificate", required: false }
    ]
  },
  "CYBER_SECURITY": {
    expertCategoryCode: "CYBER_SECURITY",
    title: "Cyber Security Specialist Registration",
    sections: [
      {
        title: "Security Certifications & VAPT Expertise",
        fields: [
          { fieldKey: "securityCertifications", label: "Security Certifications Held", fieldType: "TEXT", required: true, placeholder: "CEH, OSCP, CISSP, CISM, GIAC" },
          { fieldKey: "securityDomains", label: "Primary Security Verticals", fieldType: "SELECT", required: true, options: ["PENETRATION_TESTING", "CLOUD_SECURITY", "SOC_AUDIT", "SMART_CONTRACT_AUDIT", "FORENSICS"] },
          { fieldKey: "cveContributions", label: "CVE Contributions / Bug Bounty Honors", fieldType: "TEXTAREA", required: false, placeholder: "List any published CVEs or Hall of Fame recognitions" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Cyber Security Resume", required: true },
      { docKey: "certCopy", label: "OSCP / CISSP Certification Copy", required: true }
    ]
  },
  "FULLSTACK_DEV": {
    expertCategoryCode: "FULLSTACK_DEV",
    title: "Full Stack & Cloud Application Architect Registration",
    sections: [
      {
        title: "Technology Stack & Architecture",
        fields: [
          { fieldKey: "frontendStack", label: "Frontend Technologies", fieldType: "TEXT", required: true, placeholder: "React, Next.js, TypeScript, TailwindCSS" },
          { fieldKey: "backendStack", label: "Backend & Database Stack", fieldType: "TEXT", required: true, placeholder: "Node.js, NestJS, Python, PostgreSQL, Prisma, Redis" },
          { fieldKey: "githubUrl", label: "GitHub Profile URL", fieldType: "TEXT", required: true, placeholder: "https://github.com/dev" },
          { fieldKey: "yearsExperience", label: "Years of Full Stack Engineering", fieldType: "NUMBER", required: true, placeholder: "6" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Software Architecture CV", required: true }
    ]
  },
  "CHARTERED_ACCOUNTANT": {
    expertCategoryCode: "CHARTERED_ACCOUNTANT",
    title: "Chartered Accountant (CA) & Financial Auditor Registration",
    sections: [
      {
        title: "ICAI Accreditation & Audit Experience",
        fields: [
          { fieldKey: "icaiMembershipNumber", label: "ICAI Membership Number", fieldType: "TEXT", required: true, placeholder: "CA-123456" },
          { fieldKey: "firmName", label: "CA Firm Name", fieldType: "TEXT", required: true, placeholder: "Raman & Associates Chartered Accountants" },
          { fieldKey: "yearsInPractice", label: "Years of Practice", fieldType: "NUMBER", required: true, placeholder: "10" },
          { fieldKey: "rdAuditExperience", label: "R&D Tax Credit & Grant Audit Experience", fieldType: "SELECT", required: true, options: ["EXPERT", "MODERATE", "BASIC"] }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "icaiCertificate", label: "ICAI Certificate of Practice", required: true },
      { docKey: "cvResume", label: "Professional Profile / Bio", required: true }
    ]
  },
  "LEGAL_ADVISOR": {
    expertCategoryCode: "LEGAL_ADVISOR",
    title: "Legal Advisor & IP Licensing Attorney Registration",
    sections: [
      {
        title: "Bar Council Registration & Practice",
        fields: [
          { fieldKey: "barEnrollmentNumber", label: "Bar Council Enrollment Number", fieldType: "TEXT", required: true, placeholder: "MAH/1234/2015" },
          { fieldKey: "legalSpecialization", label: "Legal Practice Area", fieldType: "SELECT", required: true, options: ["IP_AND_PATENTS", "CORPORATE_CONTRACTS", "R_AND_D_AGREEMENTS", "NDA_COMPLIANCE"] },
          { fieldKey: "yearsInPractice", label: "Years of Legal Practice", fieldType: "NUMBER", required: true, placeholder: "8" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "barIdCard", label: "Bar Council Identity Card", required: true },
      { docKey: "cvResume", label: "Legal Profile / CV", required: true }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryCode = id.toUpperCase().replace("CAT-", "");

  const template = DYNAMIC_EXPERT_TEMPLATES[categoryCode] || {
    expertCategoryCode: categoryCode,
    title: `${categoryCode.replace(/_/g, " ")} Expert Registration`,
    sections: [
      {
        title: "Professional & Technical Background",
        fields: [
          { fieldKey: "currentOrganization", label: "Current Employer / Affiliation", fieldType: "TEXT", required: true, placeholder: "e.g. Technology Solutions Ltd" },
          { fieldKey: "designation", label: "Current Designation / Title", fieldType: "TEXT", required: true, placeholder: "e.g. Principal Consultant" },
          { fieldKey: "coreSkills", label: "Core Technical Skills & Expertise", fieldType: "TEXT", required: true, placeholder: "e.g. Embedded C++, ROS2, System Design" },
          { fieldKey: "yearsExperience", label: "Total Years of Experience", fieldType: "NUMBER", required: true, placeholder: "5" },
          { fieldKey: "linkedinUrl", label: "LinkedIn / Professional Profile URL", fieldType: "TEXT", required: false, placeholder: "https://linkedin.com/in/username" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Curriculum Vitae (CV) / Profile Resume", required: true }
    ]
  };

  return NextResponse.json(template);
}
