import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC INDUSTRY REGISTRATION TEMPLATE API
// ─────────────────────────────────────────────────────────────────

const DYNAMIC_TEMPLATES: Record<string, any> = {
  "STARTUP": {
    industryTypeCode: "STARTUP",
    title: "Startup Enterprise Registration",
    sections: [
      {
        title: "Startup Recognition & Foundation",
        fields: [
          { fieldKey: "dpiitNumber", label: "DPIIT Recognition Number", fieldType: "TEXT", required: true, placeholder: "DPIIT123456", helpText: "Ministry of Commerce DPIIT startup certificate number" },
          { fieldKey: "startupStage", label: "Startup Growth Stage", fieldType: "SELECT", required: true, options: ["IDEATION", "VALIDATION", "EARLY_TRACTION", "SCALING", "GROWTH"] },
          { fieldKey: "yearFounded", label: "Year Founded", fieldType: "NUMBER", required: true, placeholder: "2023" },
          { fieldKey: "fundingStage", label: "Funding Stage", fieldType: "SELECT", required: true, options: ["BOOTSTRAPPED", "GRANT_FUNDED", "SEED", "SERIES_A", "SERIES_B_PLUS"] },
          { fieldKey: "technologyStack", label: "Core Technology Stack", fieldType: "TEXT", required: false, placeholder: "e.g. ROS2, Python, C++, SIMULINK HIL" }
        ]
      },
      {
        title: "Team & Products",
        fields: [
          { fieldKey: "foundersList", label: "Founders & Co-Founders", fieldType: "TEXTAREA", required: true, placeholder: "List key founders with LinkedIn URLs" },
          { fieldKey: "employeeCount", label: "Current Employee Count", fieldType: "SELECT", required: true, options: ["1-10", "11-50", "51-200", "200+"] },
          { fieldKey: "productsDescription", label: "Key Flagship Products / Innovation", fieldType: "TEXTAREA", required: true, placeholder: "Describe core innovations or hardware prototypes" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "dpiitCertificate", label: "DPIIT Recognition Certificate", required: true },
      { docKey: "pitchDeck", label: "Company Pitch Deck / Executive Summary", required: false },
      { docKey: "panCard", label: "Company PAN Card", required: true }
    ]
  },
  "MSME": {
    industryTypeCode: "MSME",
    title: "MSME Enterprise Registration",
    sections: [
      {
        title: "UDYAM & Statutory Details",
        fields: [
          { fieldKey: "udyamNumber", label: "UDYAM Registration Number", fieldType: "TEXT", required: true, placeholder: "UDYAM-XX-00-0000000", helpText: "MSME Ministry UDYAM registration certificate number" },
          { fieldKey: "gstNumber", label: "GSTIN Number", fieldType: "TEXT", required: true, placeholder: "27AAAAA0000A1Z5" },
          { fieldKey: "panNumber", label: "Company PAN Number", fieldType: "TEXT", required: true, placeholder: "ABCDE1234F" },
          { fieldKey: "businessCategory", label: "Business Category", fieldType: "SELECT", required: true, options: ["MICRO", "SMALL", "MEDIUM"] },
          { fieldKey: "manufacturingType", label: "Enterprise Type", fieldType: "SELECT", required: true, options: ["MANUFACTURING", "SERVICE", "BOTH"] }
        ]
      },
      {
        title: "Financials & Turnovers",
        fields: [
          { fieldKey: "annualTurnover", label: "Annual Turnover (INR Cr)", fieldType: "SELECT", required: true, options: ["Under ₹1 Cr", "₹1 Cr - ₹5 Cr", "₹5 Cr - ₹50 Cr", "₹50 Cr - ₹250 Cr"] },
          { fieldKey: "employeeCount", label: "Total Workforce Count", fieldType: "NUMBER", required: true, placeholder: "25" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "udyamCertificate", label: "UDYAM Registration Certificate", required: true },
      { docKey: "gstCertificate", label: "GST Registration Certificate", required: true },
      { docKey: "panCard", label: "Company PAN Card", required: true }
    ]
  },
  "INSTITUTION": {
    industryTypeCode: "INSTITUTION",
    title: "Academic & Research Institution Registration",
    sections: [
      {
        title: "Academic Approvals & Accreditations",
        fields: [
          { fieldKey: "institutionType", label: "Institution Type", fieldType: "SELECT", required: true, options: ["CENTRAL_UNIVERSITY", "STATE_UNIVERSITY", "DEEMED_UNIVERSITY", "AUTONOMOUS_ENGINEERING_COLLEGE", "AFFILIATED_COLLEGE"] },
          { fieldKey: "aicteApproval", label: "AICTE Approval Number", fieldType: "TEXT", required: true, placeholder: "F.No. South-West/1-XXXXXXX" },
          { fieldKey: "naacGrade", label: "NAAC Grade Accreditation", fieldType: "SELECT", required: true, options: ["A++", "A+", "A", "B++", "B+", "NOT_ACCREDITED"] },
          { fieldKey: "nirfRanking", label: "NIRF Ranking (Engineering / Overall)", fieldType: "NUMBER", required: false, placeholder: "45" }
        ]
      },
      {
        title: "Faculty & Student Capacity",
        fields: [
          { fieldKey: "principalDetails", label: "Principal / Director Name", fieldType: "TEXT", required: true, placeholder: "Dr. Ramesh Sharma" },
          { fieldKey: "placementOfficer", label: "Head of Training & Placement", fieldType: "TEXT", required: true, placeholder: "Prof. Anitha Nair" },
          { fieldKey: "studentCount", label: "Total Enrolled Engineering Students", fieldType: "NUMBER", required: true, placeholder: "3500" },
          { fieldKey: "researchCenters", label: "Active Research Centers of Excellence", fieldType: "TEXTAREA", required: false, placeholder: "e.g. EV Battery Testbed Lab, AI Robotics COE" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "aicteCertificate", label: "AICTE Approval Order", required: true },
      { docKey: "naacCertificate", label: "NAAC Accreditation Certificate", required: true },
      { docKey: "nocLetter", label: "Institution No Objection Letter", required: true }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const typeCode = id.toUpperCase().replace("TYPE-", "");

  const template = DYNAMIC_TEMPLATES[typeCode] || {
    industryTypeCode: typeCode,
    title: `${typeCode} Enterprise Registration`,
    sections: [
      {
        title: "General Enterprise Statutory Metadata",
        fields: [
          { fieldKey: "registrationNumber", label: "Statutory Registration / CIN Number", fieldType: "TEXT", required: true, placeholder: "L12345MH2020PLC123456" },
          { fieldKey: "gstNumber", label: "GSTIN Number", fieldType: "TEXT", required: true, placeholder: "27AAAAA0000A1Z5" },
          { fieldKey: "panNumber", label: "Company PAN Card Number", fieldType: "TEXT", required: true, placeholder: "ABCDE1234F" },
          { fieldKey: "businessSector", label: "Primary Business Sector", fieldType: "TEXT", required: true, placeholder: "e.g. Industrial Automation, Defence Technology" }
        ]
      }
    ],
    requiredDocuments: [
      { docKey: "incorporationCertificate", label: "Certificate of Incorporation / Registration", required: true },
      { docKey: "panCard", label: "Company PAN Card", required: true }
    ]
  };

  return NextResponse.json(template);
}
