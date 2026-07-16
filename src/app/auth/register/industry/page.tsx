"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Award,
  Clock,
  ChevronRight,
  Info,
  X,
  Sparkles,
  Lock,
  UserCheck
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// Cascading Smart Address System Data (India)
interface StateDistricts {
  [district: string]: string[];
}
interface AddressCascadeData {
  [state: string]: StateDistricts;
}

const smartAddressData: AddressCascadeData = {
  "Karnataka": {
    "Bangalore Urban": ["Bangalore City", "Whitefield", "Electronic City", "Yelahanka"],
    "Mysore": ["Mysore City", "Nanjangud", "Hunsur"],
    "Dharwad": ["Hubli", "Dharwad City", "Kalghatgi"]
  },
  "Maharashtra": {
    "Mumbai City": ["Colaba", "Dadar", "Nariman Point"],
    "Pune": ["Pune City", "Pimpri-Chinchwad", "Hinjawadi", "Hadapsar"],
    "Nagpur": ["Nagpur City", "Kamptee", "Hingna"]
  },
  "Delhi": {
    "New Delhi": ["Connaught Place", "Chanakyapuri", "Vasant Kunj"],
    "South Delhi": ["Saket", "Hauz Khas", "Greater Kailash"]
  },
  "Tamil Nadu": {
    "Chennai": ["Adyar", "Guindy", "T. Nagar", "Velachery"],
    "Coimbatore": ["Gandhipuram", "Peelamedu", "RS Puram"]
  }
};

// Main state interface for draft preservation
interface IndustryOnboardingData {
  orgName: string;
  email: string;
  phone: string;
  orgType: string;
  country: string;
  // Section 2: Business Information
  industryDomain: string;
  orgDescription: string;
  researchAreas: string;
  // Startup specific
  founderName: string;
  startupIndiaReg: string;
  fundingStage: string;
  teamSize: string;
  incubationStatus: string;
  incubatorName: string;
  // Pvt Ltd specific
  cin: string;
  gst: string;
  pan: string;
  registeredOffice: string;
  website: string;
  // LLP specific
  llpNumber: string;
  partnerDetails: string;
  // MSME specific
  msmeReg: string;
  businessCategory: string;
  // Smart Address fields
  state: string;
  district: string;
  city: string;
  pin: string;
  addressLine: string;
}

const defaultFormData: IndustryOnboardingData = {
  orgName: "",
  email: "",
  phone: "",
  orgType: "Startup",
  country: "India",
  industryDomain: "",
  orgDescription: "",
  researchAreas: "",
  founderName: "",
  startupIndiaReg: "",
  fundingStage: "Bootstrap",
  teamSize: "1-10",
  incubationStatus: "No",
  incubatorName: "",
  cin: "",
  gst: "",
  pan: "",
  registeredOffice: "",
  website: "",
  llpNumber: "",
  partnerDetails: "",
  msmeReg: "",
  businessCategory: "Manufacturing",
  state: "",
  district: "",
  city: "",
  pin: "",
  addressLine: ""
};

export default function IndustryOnboarding() {
  const router = useRouter();
  
  // Basic UX Steps
  // Step 1: Initial Form (Name, Email, Type, Country)
  // Step 2: Dynamic Form sections based on Selection & Address
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IndustryOnboardingData>(defaultFormData);
  
  // Live Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Custom dialog visibility states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [saveDraftStatus, setSaveDraftStatus] = useState<"idle" | "saved">("idle");

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setStep(2); // If saved data exists, resume directly at dynamic fields
      } catch (e) {
        console.error("Failed to parse saved onboarding draft", e);
      }
    }
  }, []);

  // Save to localStorage automatically on any input change (Auto-save)
  const updateField = (field: keyof IndustryOnboardingData, value: string) => {
    const updated = { ...formData, [field]: value };
    
    // Cascading resetting values
    if (field === "state") {
      updated.district = "";
      updated.city = "";
    } else if (field === "district") {
      updated.city = "";
    }

    setFormData(updated);
    localStorage.setItem("anveshakhub_industry_onboarding", JSON.stringify(updated));
    validateField(field, value, updated);
  };

  // Real-Time Form Field Validation Engine
  const validateField = (field: string, value: string, currentData: IndustryOnboardingData) => {
    let errMsg = "";
    
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errMsg = "Please enter a valid corporate email address";
      } else {
        // Disallow generic email providers
        const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "mail.com"];
        const domainPart = value.split("@")[1]?.toLowerCase();
        if (domains.includes(domainPart)) {
          errMsg = "Please use an official company/organization email domain.";
        }
      }
    }

    if (field === "website" && value) {
      const webRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!webRegex.test(value)) {
        errMsg = "Invalid website format. e.g. https://company.com";
      }
    }

    if (field === "phone" && value) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        errMsg = "Phone number must be exactly 10 numeric digits";
      }
    }

    if (field === "cin" && value) {
      // Indian Corporate Identity Number: 21 alphanumeric
      const cinRegex = /^[L|U][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i;
      if (!cinRegex.test(value)) {
        errMsg = "Invalid Indian CIN format (e.g. U72200DL2021PTC123456)";
      }
    }

    if (field === "gst" && value) {
      // GSTIN: 15 alphanumeric characters
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
      if (!gstRegex.test(value)) {
        errMsg = "Invalid GSTIN format (e.g. 27AAPCS1482K1Z0)";
      }
    }

    if (field === "pan" && value) {
      // PAN card format
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
      if (!panRegex.test(value)) {
        errMsg = "Invalid PAN card format (e.g. ABCDE1234F)";
      }
    }

    if (field === "llpNumber" && value) {
      // LLP Identification Number
      const llpRegex = /^[A-Z]{3}-[0-9]{4}$/i;
      if (!llpRegex.test(value)) {
        errMsg = "Invalid LLP identification number (e.g. AAA-1234)";
      }
    }

    if (field === "pin" && value) {
      const pinRegex = /^[0-9]{6}$/;
      if (!pinRegex.test(value)) {
        errMsg = "PIN code must be exactly 6 numeric digits";
      }
    }

    // Duplicate Check Warnings
    if (field === "orgName" && value.toLowerCase() === "aether") {
      errMsg = "An organization with this name is already registered or verification is pending.";
    }

    setErrors(prev => ({
      ...prev,
      [field]: errMsg
    }));
  };

  // Profile Completion Percentage calculator (starts at 18% base)
  const computeCompletion = () => {
    let base = 18;
    let filledFields = 0;
    
    // Core fields
    if (formData.orgName) filledFields++;
    if (formData.email) filledFields++;
    if (formData.orgType) filledFields++;
    if (formData.country) filledFields++;
    
    let totalFields = 4;

    // Role dynamic fields
    if (formData.orgType === "Startup") {
      totalFields += 5;
      if (formData.founderName) filledFields++;
      if (formData.startupIndiaReg) filledFields++;
      if (formData.fundingStage) filledFields++;
      if (formData.teamSize) filledFields++;
      if (formData.incubationStatus === "Yes" ? (formData.incubationStatus && formData.incubatorName) : formData.incubationStatus) filledFields++;
    } else if (formData.orgType === "Private Limited") {
      totalFields += 5;
      if (formData.cin) filledFields++;
      if (formData.gst) filledFields++;
      if (formData.pan) filledFields++;
      if (formData.registeredOffice) filledFields++;
      if (formData.website) filledFields++;
    } else if (formData.orgType === "LLP") {
      totalFields += 3;
      if (formData.llpNumber) filledFields++;
      if (formData.partnerDetails) filledFields++;
      if (formData.gst) filledFields++;
    } else if (formData.orgType === "MSME") {
      totalFields += 2;
      if (formData.msmeReg) filledFields++;
      if (formData.businessCategory) filledFields++;
    }

    // Business Information fields (Section 2)
    totalFields += 3;
    if (formData.industryDomain) filledFields++;
    if (formData.orgDescription) filledFields++;
    if (formData.researchAreas) filledFields++;

    // Smart Address fields
    totalFields += 5;
    if (formData.state) filledFields++;
    if (formData.district) filledFields++;
    if (formData.city) filledFields++;
    if (formData.pin) filledFields++;
    if (formData.addressLine) filledFields++;

    const addedPct = Math.round((filledFields / totalFields) * 82);
    return Math.min(base + addedPct, 100);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    // Check step 1 validation
    if (step === 1) {
      if (!formData.orgName || !formData.email || !formData.orgType || errors.orgName || errors.email) {
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 validations before proceeding to AUTH-004
    const requiredErrors: { [key: string]: string } = {};
    if (!formData.state) requiredErrors.state = "State selection is required";
    if (!formData.district) requiredErrors.district = "District selection is required";
    if (!formData.city) requiredErrors.city = "City selection is required";
    if (!formData.pin) requiredErrors.pin = "Postal PIN code is required";
    if (!formData.addressLine) requiredErrors.addressLine = "Registered office address is required";

    if (!formData.industryDomain) requiredErrors.industryDomain = "Industry domain is required";
    if (!formData.orgDescription) requiredErrors.orgDescription = "Organization description is required";
    if (!formData.researchAreas) requiredErrors.researchAreas = "Technical research areas are required";

    if (formData.orgType === "Startup" && !formData.founderName) {
      requiredErrors.founderName = "Founder Name is required";
    }
    if (formData.orgType === "Private Limited") {
      if (!formData.cin) requiredErrors.cin = "CIN number is required";
      if (!formData.pan) requiredErrors.pan = "PAN number is required";
    }
    if (formData.orgType === "LLP" && !formData.llpNumber) {
      requiredErrors.llpNumber = "LLPIN is required";
    }
    if (formData.orgType === "MSME" && !formData.msmeReg) {
      requiredErrors.msmeReg = "MSME Registration ID is required";
    }

    // Ensure there are no outstanding format errors
    const hasFormatErrors = Object.values(errors).some(err => err !== "");

    if (Object.keys(requiredErrors).length > 0 || hasFormatErrors) {
      setErrors(prev => ({ ...prev, ...requiredErrors }));
      return;
    }

    // Auto-save draft, then proceed to AUTH-004
    localStorage.setItem("anveshakhub_industry_onboarding", JSON.stringify(formData));
    router.push("/auth/register/review");
  };

  const handleSaveDraft = () => {
    localStorage.setItem("anveshakhub_industry_onboarding", JSON.stringify(formData));
    setSaveDraftStatus("saved");
    setTimeout(() => {
      setSaveDraftStatus("idle");
    }, 2000);
  };

  const handleCancelConfirm = () => {
    localStorage.removeItem("anveshakhub_industry_onboarding");
    router.push("/auth/role-selection");
  };

  // Dynamic Tooltip helper component
  const Tooltip = ({ content }: { content: string }) => (
    <div className="relative inline-block ml-1.5 group cursor-help select-none">
      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full h-3.5 w-3.5 inline-flex items-center justify-center transition-colors">ⓘ</span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 hidden group-hover:block bg-slate-900 text-white text-[10px] leading-relaxed p-2.5 rounded-lg shadow-lg z-50 pointer-events-none">
        {content}
        <div className="w-2 h-2 bg-slate-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1" />
      </div>
    </div>
  );

  const completionPct = computeCompletion();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step === 2 ? setStep(1) : router.push("/auth/role-selection")}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-primary/20 cursor-pointer"
              aria-label="Back to role selection"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-sm text-secondary tracking-tight">AnveshakHub</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Status:</span>
              <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-primary">{completionPct}% Complete</span>
            </div>
            <button
              onClick={() => setShowSupportModal(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/45 relative overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT: Dynamic Form Panel */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <h1 className="text-xl font-black text-secondary tracking-tight flex items-center gap-2">
                Create Your Organization Profile
                {completionPct === 100 && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-pulse" />
                )}
              </h1>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Let's understand your organization before starting the verification process.
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-6">
              
              {/* STEP 1: INITIAL FORM FIELDS */}
              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Dynamic Profile Engine</h4>
                      <p className="text-[10px] text-slate-550 mt-0.5 leading-normal">
                        Fields adjust dynamically based on your Organization Type. Verify your details live before submitting.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Organization Name *
                      <Tooltip content="Official registered legal name of the organization. Must match identity proofs." />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.orgName}
                      onChange={(e) => updateField("orgName", e.target.value)}
                      placeholder="e.g. Aether Technologies Pvt Ltd"
                      className={`w-full text-xs py-2.5 px-3 border rounded-lg focus:outline-none bg-white placeholder-slate-400 ${
                        errors.orgName ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                      }`}
                    />
                    {errors.orgName && (
                      <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.orgName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Official Contact Email *
                      <Tooltip content="Corporate domain emails only (e.g. name@company.com). Personal Gmail/Outlook is restricted." />
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="e.g. contact@aether.com"
                      className={`w-full text-xs py-2.5 px-3 border rounded-lg focus:outline-none bg-white placeholder-slate-400 ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Organization Type *
                        <Tooltip content="Select the legal registration format of your enterprise." />
                      </label>
                      <select
                        value={formData.orgType}
                        onChange={(e) => updateField("orgType", e.target.value)}
                        className="w-full text-xs py-2.5 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white font-medium"
                      >
                        <option value="Startup">Startup / MSME (Self-Classified)</option>
                        <option value="Private Limited">Private Limited Company (MND Registered)</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="MSME">Micro, Small & Medium Enterprise (MSME)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Registered Country *
                        <Tooltip content="Primary country of legal registration." />
                      </label>
                      <input
                        type="text"
                        disabled
                        value="India"
                        className="w-full text-xs py-2.5 px-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                </motion.div>
              ) : (
                /* STEP 2: DYNAMIC FORM ENGINE & SMART ADDRESS */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Dynamic Organization Sub-Section */}
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" /> {formData.orgType} Details
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded px-2 py-0.5">Dynamic Fields</span>
                    </div>

                    {/* STARTUP FIELDS */}
                    {formData.orgType === "Startup" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Founder Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.founderName}
                            onChange={(e) => updateField("founderName", e.target.value)}
                            placeholder="Founder or CEO"
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Startup India Reg No</label>
                          <input
                            type="text"
                            value={formData.startupIndiaReg}
                            onChange={(e) => updateField("startupIndiaReg", e.target.value)}
                            placeholder="e.g. DIPP12345"
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Funding Stage</label>
                          <select
                            value={formData.fundingStage}
                            onChange={(e) => updateField("fundingStage", e.target.value)}
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          >
                            <option>Bootstrap</option>
                            <option>Seed / Angel</option>
                            <option>Series A/B</option>
                            <option>Series C+</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Incubation Status</label>
                          <select
                            value={formData.incubationStatus}
                            onChange={(e) => updateField("incubationStatus", e.target.value)}
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          >
                            <option value="No">Not Incubation Governed</option>
                            <option value="Yes">Incubated Startup</option>
                          </select>
                        </div>
                        {formData.incubationStatus === "Yes" && (
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Incubator Organization Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.incubatorName}
                              onChange={(e) => updateField("incubatorName", e.target.value)}
                              placeholder="e.g. SINE IIT Bombay"
                              className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* PRIVATE LIMITED FIELDS */}
                    {formData.orgType === "Private Limited" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">
                              Corporate Identity Number (CIN) *
                              <Tooltip content="21 alphanumeric characters assigned by Ministry of Corporate Affairs." />
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.cin}
                              onChange={(e) => updateField("cin", e.target.value)}
                              placeholder="U72200DL2021PTC123456"
                              className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white uppercase ${
                                errors.cin ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                              }`}
                            />
                            {errors.cin && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.cin}</span>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">
                              GST Number (GSTIN)
                              <Tooltip content="15-character Goods and Services Tax Identification Number." />
                            </label>
                            <input
                              type="text"
                              value={formData.gst}
                              onChange={(e) => updateField("gst", e.target.value)}
                              placeholder="27AAPCS1482K1Z0"
                              className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white uppercase ${
                                errors.gst ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                              }`}
                            />
                            {errors.gst && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.gst}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">
                              PAN Number *
                              <Tooltip content="Permanent Account Number issued by Income Tax Department." />
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.pan}
                              onChange={(e) => updateField("pan", e.target.value)}
                              placeholder="ABCDE1234F"
                              className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white uppercase ${
                                errors.pan ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                              }`}
                            />
                            {errors.pan && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.pan}</span>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Website URL</label>
                            <input
                              type="text"
                              value={formData.website}
                              onChange={(e) => updateField("website", e.target.value)}
                              placeholder="https://company.com"
                              className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white ${
                                errors.website ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                              }`}
                            />
                            {errors.website && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.website}</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LLP FIELDS */}
                    {formData.orgType === "LLP" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">LLPIN Number *</label>
                            <input
                              type="text"
                              required
                              value={formData.llpNumber}
                              onChange={(e) => updateField("llpNumber", e.target.value)}
                              placeholder="AAA-1234"
                              className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white uppercase ${
                                errors.llpNumber ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                              }`}
                            />
                            {errors.llpNumber && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.llpNumber}</span>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">GST Number</label>
                            <input
                              type="text"
                              value={formData.gst}
                              onChange={(e) => updateField("gst", e.target.value)}
                              placeholder="27AAPCS1482K1Z0"
                              className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white uppercase"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Partner / Representative Names *</label>
                          <input
                            type="text"
                            required
                            value={formData.partnerDetails}
                            onChange={(e) => updateField("partnerDetails", e.target.value)}
                            placeholder="e.g. Ramesh Kumar, Sunita Rao"
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* MSME FIELDS */}
                    {formData.orgType === "MSME" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Udyam Registration Number *</label>
                          <input
                            type="text"
                            required
                            value={formData.msmeReg}
                            onChange={(e) => updateField("msmeReg", e.target.value)}
                            placeholder="UDYAM-KR-00-1234567"
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Business Category</label>
                          <select
                            value={formData.businessCategory}
                            onChange={(e) => updateField("businessCategory", e.target.value)}
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                          >
                            <option>Manufacturing</option>
                            <option>Services</option>
                            <option>Trading / Retail</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Common Phone Input */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Primary Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="10-digit number"
                        className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white ${
                          errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                        }`}
                      />
                      {errors.phone && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Business Information Card */}
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
                      <FileText className="h-4 w-4 text-primary" /> Business Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Industry Domain *</label>
                        <input
                          type="text"
                          required
                          value={formData.industryDomain}
                          onChange={(e) => updateField("industryDomain", e.target.value)}
                          placeholder="e.g. Robotics, Artificial Intelligence"
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                        />
                        {errors.industryDomain && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.industryDomain}</span>}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Business Category *</label>
                        <select
                          required
                          value={formData.businessCategory}
                          onChange={(e) => updateField("businessCategory", e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white font-medium"
                        >
                          <option>Manufacturing</option>
                          <option>Services</option>
                          <option>Consultancy</option>
                          <option>R&D Labs</option>
                          <option>Infrastructure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Research Areas / Technical Focus *</label>
                      <input
                        type="text"
                        required
                        value={formData.researchAreas}
                        onChange={(e) => updateField("researchAreas", e.target.value)}
                        placeholder="e.g. Computer Vision, Materials Science, Edge AI"
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                      />
                      {errors.researchAreas && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.researchAreas}</span>}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Organization Description *</label>
                      <textarea
                        required
                        value={formData.orgDescription}
                        onChange={(e) => updateField("orgDescription", e.target.value)}
                        placeholder="Describe your organization's core operations, R&D aims, or technical needs..."
                        rows={3}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                      />
                      {errors.orgDescription && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.orgDescription}</span>}
                    </div>
                  </div>

                  {/* Smart Address cascading block */}
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" /> Smart Address Verification
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">State *</label>
                        <select
                          required
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white font-medium"
                        >
                          <option value="">Select State</option>
                          {Object.keys(smartAddressData).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">District *</label>
                        <select
                          required
                          disabled={!formData.state}
                          value={formData.district}
                          onChange={(e) => updateField("district", e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select District</option>
                          {formData.state &&
                            Object.keys(smartAddressData[formData.state] || {}).map((dist) => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">City / Locality *</label>
                        <select
                          required
                          disabled={!formData.district}
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select City</option>
                          {formData.state && formData.district &&
                            (smartAddressData[formData.state]?.[formData.district] || []).map((ct) => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={formData.pin}
                          onChange={(e) => updateField("pin", e.target.value)}
                          placeholder="6-digit postal code"
                          className={`w-full text-xs py-2 px-3 border rounded-lg focus:outline-none bg-white ${
                            errors.pin ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-primary"
                          }`}
                        />
                        {errors.pin && <span className="text-[9px] text-red-500 mt-1 block font-semibold">{errors.pin}</span>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block mb-1.5">Registered Office Address Line *</label>
                      <textarea
                        required
                        value={formData.addressLine}
                        onChange={(e) => updateField("addressLine", e.target.value)}
                        placeholder="Plot No, Street, Landmark details"
                        rows={2}
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCancelDialog(true)}
                    className="h-10 px-4 inline-flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors focus:ring-2 focus:ring-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-10 px-4 inline-flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-100 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="h-10 px-4 inline-flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-100 cursor-pointer relative"
                  >
                    {saveDraftStatus === "saved" ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Draft Saved
                      </span>
                    ) : (
                      "Save Draft"
                    )}
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-xs font-bold text-white rounded-lg shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {step === 1 ? "Continue" : "Proceed to Confirm"}
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT: Informational Widget Panels */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Completion card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider">Profile Completion</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Progress</span>
                  <span className="font-extrabold text-primary">{completionPct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 transition-all duration-300"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Provide matching legal credentials to expedite verification queue reviews. Standard check audits complete within 24 hours.
              </p>
            </div>

            {/* Verification Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-primary" /> Onboarding Pipeline
              </h3>
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-150">
                <div className="flex gap-3 items-start relative z-10">
                  <span className="h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center mt-0.5">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dynamic Profile Submission</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Verify Organization identifiers live.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start relative z-10">
                  <span className="h-4 w-4 bg-slate-200 text-slate-600 text-[9px] font-bold rounded-full flex items-center justify-center mt-0.5">2</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-650">System Verification Audit</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Auto-checks match MCA registry records.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start relative z-10">
                  <span className="h-4 w-4 bg-slate-200 text-slate-600 text-[9px] font-bold rounded-full flex items-center justify-center mt-0.5">3</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-650">Credential Match Approval</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Vetted dashboard access unlocked.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Lock className="h-4 w-4 text-slate-655" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Enterprise Security</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All records, including registration proofs and corporate documents, are protected using TLS 1.3 encryption and stored inside ISO 27001 secure repositories.
              </p>
            </div>

            {/* Need Help Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stuck? Let's Assist</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Having issues verifying your business identity details or registry match?
              </p>
              <button
                onClick={() => setShowSupportModal(true)}
                className="w-full h-9 inline-flex items-center justify-center border border-slate-200 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Contact Support Desk
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Radix Dialog: Cancel Leaving Confirmation popup */}
      <Dialog.Root open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 transition-all" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full z-50 focus:outline-none">
            <Dialog.Title className="text-sm font-extrabold text-secondary">
              Discard Profile Progress?
            </Dialog.Title>
            <Dialog.Description className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to discard registration details? Your current saved progress will be deleted from draft memory.
            </Dialog.Description>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="h-9 px-4 inline-flex items-center justify-center border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                onClick={handleCancelConfirm}
                className="h-9 px-4 inline-flex items-center justify-center bg-red-650 hover:bg-red-700 rounded-lg text-xs font-semibold text-white cursor-pointer"
              >
                Discard Draft
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Radix Dialog: Contact Support Modal */}
      <Dialog.Root open={showSupportModal} onOpenChange={setShowSupportModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 transition-all" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-md w-full z-50 focus:outline-none">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <Dialog.Title className="text-sm font-extrabold text-secondary flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-primary" /> Support Desk Inquiry
              </Dialog.Title>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-slate-550 leading-relaxed">
                Submit an inquiry details regarding onboarding, identification rules or audit mismatch logs.
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Corporate Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Inquiry / Issue Message</label>
                <textarea
                  placeholder="Explain details of verification issues"
                  rows={3}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-2 justify-end">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="h-9 px-4 inline-flex items-center justify-center border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="h-9 px-4 inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-xs font-semibold text-white rounded-lg shadow-sm cursor-pointer"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
