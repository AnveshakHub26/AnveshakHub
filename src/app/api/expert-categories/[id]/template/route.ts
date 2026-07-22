import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC EXPERT REGISTRATION TEMPLATE API
// ─────────────────────────────────────────────────────────────────

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
          { fieldKey: "highestQualification", label: "Highest Academic Degree", fieldType: "SELECT", required: true, options: ["Ph.D.", "D.Sc.", "Postdoctoral", "Master of Technology"] }
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
    title: `${categoryCode} Expert Registration`,
    sections: [
      {
        title: "Professional & Technical Background",
        fields: [
          { fieldKey: "currentOrganization", label: "Current Employer / Affiliation", fieldType: "TEXT", required: true, placeholder: "e.g. Technology Solutions Ltd" },
          { fieldKey: "designation", label: "Current Designation", fieldType: "TEXT", required: true, placeholder: "e.g. Principal Consultant" },
          { fieldKey: "coreSkills", label: "Core Technical Skills", fieldType: "TEXT", required: true, placeholder: "e.g. Embedded C++, ROS2, System Design" },
          { fieldKey: "yearsExperience", label: "Total Years of Professional Experience", fieldType: "NUMBER", required: true, placeholder: "10" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "cvResume", label: "Professional Curriculum Vitae (CV)", required: true },
      { docKey: "identityProof", label: "Government Issued Identity Proof", required: true }
    ]
  };

  return NextResponse.json(template);
}
