import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-002 STUDENT PROFILE & CAREER PORTFOLIO API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_PROFILE = {
  id: "std-001",
  userId: "usr-std-001",
  name: "Arpit Goel",
  email: "arpit.goel@iitm.ac.in",
  usn: "CS21B042",
  institution: "IIT Madras",
  degree: "B.Tech Computer Science & Engineering",
  branch: "Computer Science",
  semester: 7,
  cgpa: 9.4,
  bio: "Senior CS undergraduate at IIT Madras specializing in embedded systems, power electronics digital twins, and hardware-in-the-loop (HIL) micro-grid control algorithms.",
  skills: ["C++", "MATLAB", "SIMULINK", "Embedded Systems", "ADC Calibration", "Python", "TensorFlow"],
  resumeUrl: "https://storage.anvesha.in/resumes/arpit-goel-resume.pdf",
  portfolioUrl: "https://arpitgoel.dev",
  linkedinUrl: "https://linkedin.com/in/arpit-goel-iitm",
  githubUrl: "https://github.com/arpit-goel-iitm",
  verificationStatus: "VERIFIED",
  careerInterests: ["Embedded Systems R&D", "Clean Energy Tech", "Robotics Navigation"],
  certifications: [
    { title: "NPTEL Certified Embedded Systems Architect", issuer: "IIT Kharagpur", year: 2025 },
    { title: "IEEE Student Member", issuer: "IEEE", year: 2024 }
  ],
  achievements: [
    { title: "1st Rank in IIT Madras Hardware Hackathon 2025", issuer: "IIT Madras", year: 2025 },
    { title: "KVPY Fellow", issuer: "DST Govt of India", year: 2021 }
  ],
  projectsList: [
    { title: "Solar Micro-Grid Inverter Hardware Node 3", role: "Intern Lead", description: "Calibrated 10kHz ADC sampling rate and resolved ring topology baud rate mismatch." },
    { title: "Autonomous Obstacle Avoidance Quadcopter", role: "Team Lead", description: "Built ROS2 C++ obstacle detection pipeline using ultrasonic sensor array." }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STUDENT_PROFILE);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bio, githubUrl, linkedinUrl, portfolioUrl, skills, newProject, newCertification } = body;

    if (bio !== undefined) MOCK_STUDENT_PROFILE.bio = bio;
    if (githubUrl !== undefined) MOCK_STUDENT_PROFILE.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) MOCK_STUDENT_PROFILE.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) MOCK_STUDENT_PROFILE.portfolioUrl = portfolioUrl;
    if (skills !== undefined) MOCK_STUDENT_PROFILE.skills = skills;

    if (newProject) {
      MOCK_STUDENT_PROFILE.projectsList.unshift({
        title: newProject.title,
        role: newProject.role || "Developer",
        description: newProject.description || ""
      });
    }

    if (newCertification) {
      MOCK_STUDENT_PROFILE.certifications.unshift({
        title: newCertification.title,
        issuer: newCertification.issuer || "Certification Authority",
        year: parseInt(newCertification.year) || 2026
      });
    }

    return NextResponse.json({
      success: true,
      profile: MOCK_STUDENT_PROFILE,
      message: "Student profile and career portfolio updated successfully."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update student profile" }, { status: 500 });
  }
}
