"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, UploadCloud, CheckCircle, Plus, Trash2, ShieldCheck, Mail, User, Building, Landmark } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface Qualification {
  degree: string;
  institution: string;
  year: string;
}

export default function RegisterRolePage() {
  const { role } = useParams() as { role: string };
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Common Form States
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [domain, setDomain] = useState("");

  // Role-Specific Form States
  const [companyType, setCompanyType] = useState("Startup/MSME");
  const [website, setWebsite] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { degree: "", institution: "", year: "" }
  ]);
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [skills, setSkills] = useState("");
  const [partnerType, setPartnerType] = useState("Academic Partner");
  const [govSector, setGovSector] = useState("State Department");
  const [vendorCategory, setVendorCategory] = useState("Software Licensing");

  // Reset states on role change
  useEffect(() => {
    setFullName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setDomain("");
    setAgree(false);
  }, [role]);

  const addQualification = () => {
    setQualifications([...qualifications, { degree: "", institution: "", year: "" }]);
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const updateQualification = (index: number, field: keyof Qualification, value: string) => {
    const updated = [...qualifications];
    updated[index][field] = value;
    setQualifications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated NestJS API Registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Define role metadata for titles
  const getRoleMeta = () => {
    switch (role) {
      case "industry":
        return {
          title: "Industry Partner Registration",
          desc: "Create an enterprise profile to submit problems and match with vetted expert advisors.",
          badge: "Verification Required"
        };
      case "expert":
        return {
          title: "Subject Expert Registration",
          desc: "Register as a verified researcher or technical expert to lead high-impact projects.",
          badge: "Professional Verification"
        };
      case "student":
        return {
          title: "Student Intern Onboarding",
          desc: "Set up your student profile to discover and apply for expert-supervised research internships.",
          badge: "Resume Required"
        };
      case "contributor":
        return {
          title: "External Contributor Onboarding",
          desc: "Register as a freelance specialist, vendor consultant, or external executor.",
          badge: "Verification Required"
        };
      case "partner":
        return {
          title: "Strategic Partner Onboarding",
          desc: "Onboard your institution or laboratory for joint strategic research and incubation ventures.",
          badge: "MOU Governed"
        };
      case "government":
        return {
          title: "Government Agency Integration",
          desc: "Register to manage state-sponsored grants, audit research schemes, and oversee public R&D.",
          badge: "Agency Approval Required"
        };
      case "vendor":
        return {
          title: "Vendor / Supplier Registration",
          desc: "Onboard to supply specialized software licensing, hardware, laboratory facilities, or logistics.",
          badge: "Vetted Supplier"
        };
      default:
        return {
          title: "Platform Onboarding Gateway",
          desc: "Complete your identity profile details to join the AnveshakHub enterprise platform.",
          badge: "Verification Required"
        };
    }
  };

  const meta = getRoleMeta();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Shared sticky navigation with back button */}
      <Navigation showBack={true} />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50/40">
        {/* Background mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10">
          
          {/* Header titles */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-secondary tracking-tight">{meta.title}</h1>
            <p className="mt-2 text-xs text-slate-550 max-w-sm mx-auto leading-relaxed">{meta.desc}</p>
          </div>

          <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8">
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-14 w-14 text-emerald-600 mb-4 animate-[bounce_1.5s_infinite_alternate]" />
                <h3 className="text-lg font-bold text-secondary">
                  {role === "student" ? "Account Activated" : "Application Submitted"}
                </h3>
                <p className="mt-3 text-xs text-slate-500 max-w-sm leading-relaxed">
                  {role === "student"
                    ? "Welcome to AnveshakHub! Your student account is active immediately. You can now log in and discover research vacancies."
                    : `Thank you. Your onboarding profile as an enterprise ${role} has been submitted to the verification queue. Our administrators will review the documents within 24 hours.`}
                </p>
                <div className="mt-8 flex gap-4">
                  <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <ArrowLeft className="h-4 w-4" /> Back to Homepage
                  </Link>
                  <Link href="/auth/login" className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Visual indicator badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Role Category: {role}
                  </span>
                  <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-primary border border-blue-100">
                    {meta.badge}
                  </span>
                </div>

                {/* ================= INDUSTRY FORM FIELDS ================= */}
                {role === "industry" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Aether Technologies Ltd"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company Type *</label>
                        <select
                          value={companyType}
                          onChange={(e) => setCompanyType(e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                          <option>Startup/MSME</option>
                          <option>LLP</option>
                          <option>Pvt/Public Ltd</option>
                          <option>Government/Research Org</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Industry Domain *</label>
                        <input
                          type="text"
                          required
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. Robotics / Fintech"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Website URL</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://company.com"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Contact Person Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Elena Rostova"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="elena@company.com"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit phone"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company Registration Documents * (Max 10MB)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Click to upload tax or corporation documents</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= EXPERT FORM FIELDS ================= */}
                {role === "expert" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Prof. Rajesh Kumar"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Institution / University *</label>
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. IISc Bangalore"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Experience (Years) *</label>
                        <input
                          type="number"
                          required
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Expertise Tags *</label>
                      <input
                        type="text"
                        required
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. Neural Networks, Cyber-physical systems"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rajesh@iisc.ac.in"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pt-2 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qualifications</span>
                      <button type="button" onClick={addQualification} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add Row
                      </button>
                    </div>

                    {qualifications.map((q, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative space-y-2">
                        {qualifications.length > 1 && (
                          <button type="button" onClick={() => removeQualification(idx)} className="absolute right-2 top-2 text-slate-400 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Degree"
                            value={q.degree}
                            onChange={(e) => updateQualification(idx, "degree", e.target.value)}
                            className="text-xs p-1.5 border border-slate-200 rounded bg-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Institution"
                            value={q.institution}
                            onChange={(e) => updateQualification(idx, "institution", e.target.value)}
                            className="text-xs p-1.5 border border-slate-200 rounded bg-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Year"
                            value={q.year}
                            onChange={(e) => updateQualification(idx, "year", e.target.value)}
                            className="text-xs p-1.5 border border-slate-200 rounded bg-white"
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Detailed CV / Publication Record * (Max 10MB)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Click to upload professional CV</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STUDENT FORM FIELDS ================= */}
                {role === "student" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Priyan Sharma"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">University / College *</label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. IIT Madras"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Course / Major *</label>
                        <input
                          type="text"
                          required
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g. B.Tech Engineering Physics"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Current Year *</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                          <option>Graduate</option>
                          <option>Postgraduate</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Technical Skill Tags * (Min 3)</label>
                      <input
                        type="text"
                        required
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Python, ROS, AutoCAD, PyTorch"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="priyan@student.iitm.ac.in"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Contact phone"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Academic Resume * (PDF Max 10MB)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Click to upload Resume PDF</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= OTHER ROLES FORM FIELDS ================= */}
                {["contributor", "partner", "government", "vendor"].includes(role) && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        {role === "contributor" ? "Full Name *" : "Organization Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={organization || fullName}
                        onChange={(e) => {
                          if (role === "contributor") setFullName(e.target.value);
                          else setOrganization(e.target.value);
                        }}
                        placeholder={`e.g. ${role === "contributor" ? "Sarah Jenkins" : "Strategic Tech Labs"}`}
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>

                    {role === "partner" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Partner Type *</label>
                        <select
                          value={partnerType}
                          onChange={(e) => setPartnerType(e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                          <option>Academic Partner</option>
                          <option>Incubator / Accelerator</option>
                          <option>Research Laboratory</option>
                          <option>Corporate Venture Group</option>
                        </select>
                      </div>
                    )}

                    {role === "government" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Government Sector *</label>
                        <select
                          value={govSector}
                          onChange={(e) => setGovSector(e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                          <option>State Department</option>
                          <option>Central Agency / Ministry</option>
                          <option>Defense/Aerospace Lab</option>
                          <option>Public Venture fund</option>
                        </select>
                      </div>
                    )}

                    {role === "vendor" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Supply/Service Category *</label>
                        <select
                          value={vendorCategory}
                          onChange={(e) => setVendorCategory(e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        >
                          <option>Software Licensing</option>
                          <option>Lab Equipment & Hardware</option>
                          <option>Cloud Infrastructure</option>
                          <option>Logistics & Support</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Operational Domain / Core Focus *</label>
                      <input
                        type="text"
                        required
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. Biotech logistics, Cybersecurity compliance, Academic incubation"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@organization.gov / .com"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        {role === "partner" ? "MOU Agreement Draft / Credentials Draft" : "Supporting Documents / Supply Catalogue"} *
                      </label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600">Click to upload verification files (Max 10MB)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Consent Checkbox */}
                <div className="flex items-start pt-2 border-t border-slate-100">
                  <input
                    id="agree"
                    type="checkbox"
                    required
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded mt-0.5"
                  />
                  <label htmlFor="agree" className="ml-2.5 text-[11px] leading-normal text-slate-500">
                    I accept that all details submitted represent authentic credentials, and I agree to the AnveshakHub{" "}
                    <Link href="/" className="font-semibold text-primary hover:underline">Compliance & Security Policy</Link>.
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Link
                    href="/auth/role-selection"
                    className="w-1/3 h-11 inline-flex items-center justify-center border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 h-11 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-blue-700 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      "Submit Onboarding"
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
