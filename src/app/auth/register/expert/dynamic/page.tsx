"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Award, Microscope, Briefcase, Cpu, ShieldCheck,
  Code, Cloud, UserCheck, TrendingUp, Layout, FileText, Calculator,
  Scale, CheckCircle2, ChevronRight, ChevronLeft, Upload, FileCheck,
  Loader2, Search, User, Mail, Lock, Eye, EyeOff, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface ExpertCategory {
  id: string;
  code: string;
  name: string;
  group: string;
  description: string;
  icon: string;
}

interface DynamicField {
  fieldKey: string;
  label: string;
  fieldType: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
}

interface DynamicSection {
  title: string;
  fields: DynamicField[];
}

interface RequiredDoc {
  docKey: string;
  label: string;
  required: boolean;
}

interface TemplateData {
  expertCategoryCode: string;
  title: string;
  sections: DynamicSection[];
  requiredDocuments: RequiredDoc[];
}

const ICON_MAP: Record<string, any> = {
  GraduationCap, Award, Microscope, Briefcase, Cpu, ShieldCheck,
  Code, Cloud, UserCheck, TrendingUp, Layout, FileText, Calculator, Scale
};

export default function DynamicExpertRegistrationPage() {
  const router = useRouter();

  // Wizard Step: 0 = Account Credentials, 1 = Category, 2 = Dynamic Form, 3 = Upload Docs, 4 = Preview, 5 = Submitted
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Step 0 Account Credentials State
  const [accountFullName, setAccountFullName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountConfirmPassword, setAccountConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Category & Template State
  const [categories, setCategories] = useState<ExpertCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExpertCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Common Form State
  const [commonForm, setCommonForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentInstitution: "",
    designation: "",
    orcidId: "",
    experienceYears: 5,
    primaryDomain: ""
  });

  // Dynamic Values & Document Uploads State
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<any>(null);

  useEffect(() => {
    fetch("/api/expert-categories")
      .then(res => res.json())
      .then(data => {
        const cats = data.expertCategories || data.categories || [];
        setCategories(cats);
      })
      .catch(err => console.error(err));
  }, []);

  // Handle Step 0 Credentials Validation
  const handleStep0Next = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!accountFullName.trim()) {
      setAccountError("Please enter your full name");
      return;
    }
    if (!emailRegex.test(accountEmail)) {
      setAccountError("Please enter a valid email address");
      return;
    }
    if (accountPassword.length < 8) {
      setAccountError("Password must be at least 8 characters long");
      return;
    }
    if (accountPassword !== accountConfirmPassword) {
      setAccountError("Passwords do not match");
      return;
    }

    setCommonForm(prev => ({ ...prev, fullName: accountFullName, email: accountEmail }));
    setStep(1);
  };

  // Fetch Template when Expert Category selected
  const handleSelectCategory = async (cat: ExpertCategory) => {
    setSelectedCategory(cat);
    setLoadingTemplate(true);
    try {
      const res = await fetch(`/api/expert-categories/${cat.code}/template`);
      const tpl = await res.json();
      setTemplate(tpl);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleDynamicChange = (key: string, value: any) => {
    setDynamicValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDocSimulatedUpload = (key: string) => {
    setUploadedDocs(prev => ({ ...prev, [key]: `https://anveshakhub.s3.region.minio.io/docs/${key}_expert_verified.pdf` }));
  };

  const handleSubmitRegistration = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: accountEmail,
          password: accountPassword,
          fullName: accountFullName,
          role: "expert",
          phone: commonForm.phone,
          expertCategoryCode: selectedCategory.code,
          typeAttributes: dynamicValues,
          uploadedDocuments: uploadedDocs
        })
      });
      const data = await res.json();
      setRegisteredSuccess(data);
      setStep(5);
    } catch (e) {
      console.error(e);
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === "ALL" || c.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-sans">
      <Navigation showBack={true} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Header */}
        <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-[#E8F2EC] text-[#2F6B4F] uppercase tracking-wider border border-[#2F6B4F]/20">
              Expert Credential Verification
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-[#211F1D] mt-2">
              Subject Matter Expert Registration
            </h1>
            <p className="text-xs text-[#57534E]">
              Create account credentials and complete your research & advisory profile.
            </p>
          </div>
          <Link href="/auth/login" className="text-xs font-bold text-[#FF5A36] hover:underline shrink-0">
            Sign In Instead
          </Link>
        </div>

        {/* Wizard Stepper Bar */}
        <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-xl p-3.5 mb-8 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { s: 0, label: "1. Create Account" },
            { s: 1, label: "2. Select Field" },
            { s: 2, label: "3. Profile Details" },
            { s: 3, label: "4. Verification Docs" },
            { s: 4, label: "5. Preview" },
            { s: 5, label: "6. Submitted" }
          ].map(item => (
            <div key={item.s} className="flex items-center gap-2 shrink-0">
              <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step === item.s ? "bg-[#FF5A36] text-white" : step > item.s ? "bg-[#2F6B4F] text-white" : "bg-[#FBF7F0] text-[#78716A]"
              }`}>
                {step > item.s ? <CheckCircle2 className="h-4 w-4" /> : item.s + 1}
              </div>
              <span className={`text-xs font-bold hidden md:inline ${step === item.s ? "text-[#FF5A36]" : "text-[#78716A]"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ================= STEP 0: CREATE ACCOUNT CREDENTIALS ================= */}
        {step === 0 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 sm:p-8 max-w-xl mx-auto space-y-6">
            <div className="border-b border-[#D8D2C7] pb-3">
              <h2 className="text-base font-extrabold text-[#211F1D]">Step 1: Create Account Credentials</h2>
              <p className="text-xs text-[#78716A] mt-0.5">Enter your academic or professional email and password to begin expert registration.</p>
            </div>

            {accountError && (
              <div className="p-4 bg-[#FFF0ED] border border-[#FFCFC4] rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#FF5A36]">Validation Error</p>
                <p className="text-[#57534E]">{accountError}</p>
              </div>
            )}

            <form onSubmit={handleStep0Next} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Full Name (with Title) *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                  <input
                    type="text"
                    required
                    value={accountFullName}
                    onChange={(e) => setAccountFullName(e.target.value)}
                    placeholder="e.g. Prof. Rajesh Kumar"
                    className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Institutional / Professional Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="rajesh@iisc.ac.in"
                    className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#211F1D] block mb-1.5">Account Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
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
                      value={accountConfirmPassword}
                      onChange={(e) => setAccountConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#A8A196] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8D2C7] flex justify-end">
                <button
                  type="submit"
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-xs font-bold text-white shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer"
                >
                  Continue to Field Selection <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 1: SELECT EXPERT FIELD ================= */}
        {step === 1 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#211F1D] uppercase tracking-wide">Step 2: Choose Your Advisory Field</h2>
                <p className="text-xs text-[#78716A]">Account: <span className="font-bold text-[#211F1D]">{accountEmail}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search AI, Robotics..."
                    className="pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] w-48 bg-[#FBF7F0]"
                  />
                </div>
              </div>
            </div>

            {/* Expert Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map(c => {
                const IconComponent = ICON_MAP[c.icon] || GraduationCap;
                return (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectCategory(c)}
                    className="border border-[#E2DCD2] rounded-2xl p-4 cursor-pointer hover:border-[#FF5A36] hover:shadow-md transition-all space-y-2 bg-[#FBF7F0]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-xl bg-[#E8F2EC] text-[#2F6B4F] flex items-center justify-center font-bold">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#D8D2C7] text-[#211F1D] uppercase">{c.group}</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#211F1D]">{c.name}</h3>
                    <p className="text-[10px] text-[#78716A] font-medium leading-relaxed">{c.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: DYNAMIC FORM ================= */}
        {step === 2 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D8D2C7] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#211F1D]">Step 3: {selectedCategory?.name} Profile Details</h2>
                <p className="text-xs text-[#78716A]">Enter your academic designation and research parameters.</p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-[#FF5A36] hover:underline">Change Field</button>
            </div>

            <div className="space-y-4 bg-[#FBF7F0] p-4 rounded-xl border border-[#E2DCD2]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] block mb-1">Institution / University *</label>
                  <input
                    value={commonForm.currentInstitution}
                    onChange={e => setCommonForm({ ...commonForm, currentInstitution: e.target.value })}
                    placeholder="e.g. IISc Bangalore / IIT Bombay"
                    className="w-full text-xs p-2.5 border border-[#E2DCD2] rounded-lg bg-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] block mb-1">Designation / Title *</label>
                  <input
                    value={commonForm.designation}
                    onChange={e => setCommonForm({ ...commonForm, designation: e.target.value })}
                    placeholder="e.g. Professor / Senior Scientist"
                    className="w-full text-xs p-2.5 border border-[#E2DCD2] rounded-lg bg-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#D8D2C7]">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-bold border border-[#E2DCD2] rounded-xl hover:bg-[#FBF7F0]">Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl hover:bg-[#E04826]">Continue to Documents</button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: UPLOAD DOCUMENTS ================= */}
        {step === 3 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 space-y-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#211F1D]">Step 4: Academic CV & Publications</h2>
            <div className="space-y-3">
              {template?.requiredDocuments.map(doc => (
                <div key={doc.docKey} className="p-4 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#211F1D]">{doc.label} {doc.required && "*"}</p>
                    <p className="text-[10px] text-[#78716A]">Upload PDF max 10MB</p>
                  </div>
                  {uploadedDocs[doc.docKey] ? (
                    <span className="text-xs font-bold text-[#2F6B4F] flex items-center gap-1"><FileCheck className="h-4 w-4" /> Uploaded</span>
                  ) : (
                    <button onClick={() => handleDocSimulatedUpload(doc.docKey)} className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-lg hover:bg-[#E04826] flex items-center gap-1">
                      <Upload className="h-3.5 w-3.5" /> Upload File
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-[#D8D2C7]">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-xs font-bold border border-[#E2DCD2] rounded-xl hover:bg-[#FBF7F0]">Back</button>
              <button
                onClick={() => {
                  const hasUploaded = Object.keys(uploadedDocs).length > 0;
                  if (!hasUploaded) {
                    alert("Please click 'Upload File' on at least one required verification document before proceeding.");
                    return;
                  }
                  setStep(4);
                }}
                className="px-6 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl hover:bg-[#E04826] cursor-pointer"
              >
                Preview Registration
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PREVIEW & SUBMIT ================= */}
        {step === 4 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 space-y-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#211F1D]">Step 5: Review Expert Registration</h2>
            
            <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 space-y-2 text-xs">
              <p><span className="font-bold">Full Name:</span> {accountFullName}</p>
              <p><span className="font-bold">Email:</span> {accountEmail}</p>
              <p><span className="font-bold">Institution:</span> {commonForm.currentInstitution}</p>
              <p><span className="font-bold">Category:</span> {selectedCategory?.name}</p>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#D8D2C7]">
              <button onClick={() => setStep(3)} className="px-4 py-2 text-xs font-bold border border-[#E2DCD2] rounded-xl hover:bg-[#FBF7F0]">Back</button>
              <button
                onClick={handleSubmitRegistration}
                disabled={submitting}
                className="px-6 py-2.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl hover:bg-[#E04826] shadow-md shadow-[#FF5A36]/30 flex items-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Expert Registration"}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: SUBMITTED SUCCESS & PROCEED TO SIGN IN ================= */}
        {step === 5 && (
          <div className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto shadow-xs">
            <div className="h-16 w-16 rounded-full bg-[#E8F2EC] flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-[#2F6B4F]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#211F1D]">Registration Submitted Successfully!</h2>
            <p className="text-xs text-[#78716A] leading-relaxed max-w-md mx-auto">
              Your account credentials (<span className="font-bold text-[#211F1D]">{accountEmail}</span>) have been created and your expert profile has been submitted to the verification queue.
            </p>

            <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 text-left space-y-1 text-xs">
              <p className="font-extrabold text-[#78716A] uppercase text-[10px]">Account Summary:</p>
              <p><span className="font-bold">Email:</span> {accountEmail}</p>
              <p><span className="font-bold">Institution:</span> {commonForm.currentInstitution}</p>
              <p><span className="font-bold">Field:</span> {selectedCategory?.name || "Subject Expert"}</p>
            </div>

            <Link
              href={`/auth/login?email=${encodeURIComponent(accountEmail)}`}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-xs font-bold text-white shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer"
            >
              Proceed to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
