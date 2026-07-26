"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Activity, ArrowLeft, UploadCloud, CheckCircle2, Plus, Trash2,
  ShieldCheck, Mail, User, Building, Lock, Eye, EyeOff, ArrowRight,
  Loader2, Sparkles, CheckCircle
} from "lucide-react";
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

  // Wizard Step State: 1 = Create Account, 2 = Profile Details, 3 = Success & Proceed to Login
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1 Account Credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 Profile Information
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [domain, setDomain] = useState("");
  const [agree, setAgree] = useState(false);

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

  // Reset state on role change
  useEffect(() => {
    setStep(1);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setOrganization("");
    setDomain("");
    setAgree(false);
    setErrorMessage(null);
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

  // Handle Step 1 Validation & Proceed
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setStep(2);
  };

  // Handle Step 2 Final Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agree) {
      setErrorMessage("Please accept the compliance and security terms to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
          phone,
          organizationName: organization,
          domain,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitting(false);
        setStep(3);
      } else {
        setIsSubmitting(false);
        setErrorMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage("Network error occurred. Please try again.");
    }
  };

  // Role Metadata for titles and badges
  const getRoleMeta = () => {
    switch (role) {
      case "industry":
        return {
          title: "Industry Partner Registration",
          desc: "Create an enterprise profile to submit problem statements & match with vetted experts.",
          badge: "Enterprise Onboarding"
        };
      case "expert":
        return {
          title: "Subject Expert Registration",
          desc: "Register as a verified research advisor or technical expert to lead R&D milestones.",
          badge: "Expert Credential"
        };
      case "student":
        return {
          title: "Student Intern Onboarding",
          desc: "Set up your student profile to discover and apply for expert-supervised research internships.",
          badge: "Student Verification"
        };
      default:
        return {
          title: "Platform Onboarding Gateway",
          desc: "Create your identity profile details to join the AnveshakHub enterprise platform.",
          badge: "Verification Required"
        };
    }
  };

  const meta = getRoleMeta();

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF7F0]">
      <Navigation showBack={true} />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10">

          {/* Header titles */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF5A36] uppercase tracking-widest border border-[#FFCFC4] inline-block mb-3">
              {meta.badge}
            </span>
            <h1 className="text-3xl font-extrabold text-[#211F1D] tracking-tight">{meta.title}</h1>
            <p className="mt-2 text-xs text-[#78716A] max-w-sm mx-auto leading-relaxed">{meta.desc}</p>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${step >= 1 ? "bg-[#FF5A36] text-white" : "bg-[#EFE9DF] text-[#78716A]"}`}>1</span>
              <span className={`text-xs font-bold ${step === 1 ? "text-[#211F1D]" : "text-[#78716A]"}`}>Create Account</span>
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? "bg-[#FF5A36]" : "bg-[#E2DCD2]"}`} />
            <div className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${step >= 2 ? "bg-[#FF5A36] text-white" : "bg-[#EFE9DF] text-[#78716A]"}`}>2</span>
              <span className={`text-xs font-bold ${step === 2 ? "text-[#211F1D]" : "text-[#78716A]"}`}>Profile Details</span>
            </div>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? "bg-[#FF5A36]" : "bg-[#E2DCD2]"}`} />
            <div className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${step === 3 ? "bg-[#2F6B4F] text-white" : "bg-[#EFE9DF] text-[#78716A]"}`}>3</span>
              <span className={`text-xs font-bold ${step === 3 ? "text-[#211F1D]" : "text-[#78716A]"}`}>Sign In</span>
            </div>
          </div>

          <div className="bg-[#EFE9DF] border border-[#E2DCD2] shadow-sm rounded-2xl p-6 sm:p-8">

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-[#FFF0ED] border border-[#FFCFC4] rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#FF5A36]">Registration Error</p>
                <p className="text-[#57534E]">{errorMessage}</p>
              </div>
            )}

            {/* ================= STEP 1: CREATE ACCOUNT (EMAIL & PASSWORD) ================= */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-5">
                <div className="border-b border-[#D8D2C7] pb-3 mb-2">
                  <h2 className="text-sm font-extrabold text-[#211F1D]">Step 1: Account Credentials</h2>
                  <p className="text-xs text-[#78716A] mt-0.5">Enter your email and password to create your account credentials.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Priyan Sharma"
                      className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com or student@iitm.ac.in"
                      className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716A] hover:text-[#211F1D]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#D8D2C7]">
                  <Link
                    href="/auth/role-selection"
                    className="w-1/3 h-11 inline-flex items-center justify-center border border-[#E2DCD2] rounded-xl text-xs font-bold text-[#57534E] hover:bg-[#FBF7F0] transition-all cursor-pointer"
                  >
                    Change Role
                  </Link>
                  <button
                    type="submit"
                    className="w-2/3 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-xs font-bold text-white shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer"
                  >
                    Continue to Profile Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 2: ROLE-SPECIFIC PROFILE DETAILS ================= */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5">
                <div className="border-b border-[#D8D2C7] pb-3 mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#211F1D]">Step 2: {meta.title}</h2>
                    <p className="text-xs text-[#78716A] mt-0.5">Account email: <span className="font-bold text-[#211F1D]">{email}</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] font-bold text-[#FF5A36] hover:underline"
                  >
                    Edit Credentials
                  </button>
                </div>

                {/* INDUSTRY SPECIFIC FIELDS */}
                {role === "industry" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Company / Organization Name *</label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Apex Robotics India Pvt Ltd"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Company Type *</label>
                        <select
                          value={companyType}
                          onChange={(e) => setCompanyType(e.target.value)}
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        >
                          <option>Startup/MSME</option>
                          <option>LLP</option>
                          <option>Pvt/Public Ltd</option>
                          <option>Government/Research Org</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Industry Domain *</label>
                        <input
                          type="text"
                          required
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. Robotics / Autonomous Systems"
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Website URL</label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://apexrobotics.in"
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* EXPERT SPECIFIC FIELDS */}
                {role === "expert" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Institution / University *</label>
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. IISc Bangalore / IIT Madras"
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Research Experience (Years) *</label>
                        <input
                          type="number"
                          required
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Core Expertise Tags *</label>
                      <input
                        type="text"
                        required
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. Artificial Intelligence, Embedded Systems, Quantum Computing"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                  </div>
                )}

                {/* STUDENT SPECIFIC FIELDS */}
                {role === "student" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">University / College Name *</label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. IIT Madras / BITS Pilani"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Course / Major *</label>
                        <input
                          type="text"
                          required
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g. B.Tech Computer Science"
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Current Year of Study *</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                          className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                          <option>Postgraduate / PhD</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Technical Skill Tags *</label>
                      <input
                        type="text"
                        required
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Python, ROS, PyTorch, C++"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Contact Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 text-xs text-[#211F1D] focus:border-[#FF5A36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                  </div>
                )}

                {/* Consent Checkbox */}
                <div className="flex items-start pt-2 border-t border-[#D8D2C7]">
                  <input
                    id="agree"
                    type="checkbox"
                    required
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="h-4 w-4 text-[#FF5A36] focus:ring-[#FF5A36]/20 border-[#E2DCD2] rounded mt-0.5"
                  />
                  <label htmlFor="agree" className="ml-2.5 text-xs text-[#78716A] leading-relaxed">
                    I accept that all details submitted represent authentic credentials, and I agree to the AnveshakHub{" "}
                    <Link href="/" className="font-semibold text-[#FF5A36] hover:underline">Compliance & Security Policy</Link>.
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#D8D2C7]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 h-11 inline-flex items-center justify-center border border-[#E2DCD2] rounded-xl text-xs font-bold text-[#57534E] hover:bg-[#FBF7F0] transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-xs font-bold text-white shadow-md shadow-[#FF5A36]/30 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Submit Onboarding"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 3: SUCCESS & PROCEED TO SIGN IN ================= */}
            {step === 3 && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-[#E8F2EC] flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-[#2F6B4F]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#211F1D]">Registration Submitted Successfully!</h3>
                <p className="mt-2 text-xs text-[#78716A] max-w-md leading-relaxed">
                  Your account credentials (<span className="font-bold text-[#211F1D]">{email}</span>) have been created and your profile has been submitted to the verification queue.
                </p>
                
                <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 my-6 w-full text-left space-y-1">
                  <p className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-wider">Account Created:</p>
                  <p className="text-xs font-bold text-[#211F1D]">Email: {email}</p>
                  <p className="text-xs text-[#78716A]">Role: {role.toUpperCase()}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href={`/auth/login?email=${encodeURIComponent(email)}`}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-xs font-bold text-white shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer"
                  >
                    Proceed to Sign In <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
