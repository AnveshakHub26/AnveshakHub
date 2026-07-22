"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Rocket, Building, Briefcase, FileText, GraduationCap,
  Microscope, HeartHandshake, Factory, Activity, Sprout, Car, Plane,
  Zap, CreditCard, Code, CheckCircle2, ChevronRight, ChevronLeft,
  Upload, FileCheck, ShieldCheck, Loader2, Info, Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IndustryType {
  id: string;
  code: string;
  name: string;
  category: string;
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
  industryTypeCode: string;
  title: string;
  sections: DynamicSection[];
  requiredDocuments: RequiredDoc[];
}

const ICON_MAP: Record<string, any> = {
  Rocket, Building, Briefcase, FileText, GraduationCap,
  Microscope, HeartHandshake, Factory, Activity, Sprout,
  Car, Plane, Zap, CreditCard, Code
};

export default function DynamicIndustryRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [industryTypes, setIndustryTypes] = useState<IndustryType[]>([]);
  const [selectedType, setSelectedType] = useState<IndustryType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Common Form State
  const [commonForm, setCommonForm] = useState({
    organizationName: "",
    officialEmail: "",
    contactNumber: "",
    website: "",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    pinCode: "400001",
    organizationDescription: ""
  });

  // Type-specific Dynamic Attributes State
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  // Document Uploads State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<any>(null);

  // Fetch Industry Types
  useEffect(() => {
    fetch("/api/industry-types")
      .then(res => res.json())
      .then(data => setIndustryTypes(data.industryTypes || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch Template when Industry Type selected
  const handleSelectType = async (type: IndustryType) => {
    setSelectedType(type);
    setLoadingTemplate(true);
    try {
      const res = await fetch(`/api/industry-types/${type.code}/template`);
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
    setUploadedDocs(prev => ({ ...prev, [key]: `https://anveshakhub.s3.region.minio.io/docs/${key}_verified.pdf` }));
  };

  const handleSubmitRegistration = async () => {
    if (!selectedType) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register/industry/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industryTypeCode: selectedType.code,
          ...commonForm,
          typeAttributes: dynamicValues,
          uploadedDocuments: uploadedDocs
        })
      });
      const data = await res.json();
      setRegisteredSuccess(data);
      setStep(5);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTypes = industryTypes.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Wizard Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-primary-light text-primary uppercase tracking-wide">Dynamic Framework</span>
              <h1 className="text-xl font-bold text-slate-900">Industry Partner Enterprise Registration</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">Configurable 5-step registration engine supporting 25+ specialized industry & institutional categories</p>
          </div>

          <Link href="/auth/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Sign In Instead
          </Link>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between px-8">
          {[
            { s: 1, label: "1. Select Category" },
            { s: 2, label: "2. Dynamic Form" },
            { s: 3, label: "3. Upload Documents" },
            { s: 4, label: "4. Preview" },
            { s: 5, label: "5. Submitted" }
          ].map(item => (
            <div key={item.s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step === item.s ? "bg-primary text-white" : step > item.s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {step > item.s ? <CheckCircle2 className="h-4 w-4" /> : item.s}
              </div>
              <span className={`text-xs font-bold hidden md:inline ${step === item.s ? "text-primary" : "text-slate-500"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: SELECT INDUSTRY TYPE */}
        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Step 1: Choose Your Industry & Organization Category</h2>
                <p className="text-xs text-slate-500">Form fields & verification checklists will dynamically tailor to your selection</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search Startup, MSME, NGO..."
                    className="pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary w-48"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="h-8 px-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary font-semibold"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="EDUCATIONAL">Educational</option>
                  <option value="RESEARCH">Research</option>
                  <option value="NON_PROFIT">Non-Profit</option>
                </select>
              </div>
            </div>

            {/* Industry Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTypes.map(t => {
                const IconComponent = ICON_MAP[t.icon] || Building;
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectType(t)}
                    className="border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">{t.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{t.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{t.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DYNAMIC FORM ENGINE */}
        {step === 2 && selectedType && template && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-primary-light text-primary uppercase">Category: {selectedType.name}</span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{template.title}</h2>
              </div>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" /> Change Category
              </button>
            </div>

            {/* Section A: Common Core Registration Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide text-primary">A. General Statutory Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Organization Name *</label>
                  <input value={commonForm.organizationName} onChange={e => setCommonForm({ ...commonForm, organizationName: e.target.value })}
                    placeholder="e.g. Solaris Power Pvt Ltd" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Official Email *</label>
                  <input value={commonForm.officialEmail} onChange={e => setCommonForm({ ...commonForm, officialEmail: e.target.value })}
                    placeholder="contact@solarissystems.com" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Contact Phone</label>
                  <input value={commonForm.contactNumber} onChange={e => setCommonForm({ ...commonForm, contactNumber: e.target.value })}
                    placeholder="+91 98765 43210" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-semibold" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Website URL</label>
                  <input value={commonForm.website} onChange={e => setCommonForm({ ...commonForm, website: e.target.value })}
                    placeholder="https://solarissystems.com" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-semibold" />
                </div>
              </div>
            </div>

            {/* Section B: Dynamic Type-Specific Sections */}
            {template.sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide text-primary">B{secIdx + 1}. {sec.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {sec.fields.map(f => (
                    <div key={f.fieldKey} className={f.fieldType === "TEXTAREA" ? "md:col-span-2" : ""}>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                        {f.label} {f.required && "*"}
                      </label>
                      {f.fieldType === "SELECT" ? (
                        <select
                          value={dynamicValues[f.fieldKey] || ""}
                          onChange={e => handleDynamicChange(f.fieldKey, e.target.value)}
                          className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary font-bold"
                        >
                          <option value="">-- Select {f.label} --</option>
                          {f.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : f.fieldType === "TEXTAREA" ? (
                        <textarea
                          value={dynamicValues[f.fieldKey] || ""}
                          onChange={e => handleDynamicChange(f.fieldKey, e.target.value)}
                          rows={3} placeholder={f.placeholder}
                          className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none"
                        />
                      ) : (
                        <input
                          type={f.fieldType === "NUMBER" ? "number" : "text"}
                          value={dynamicValues[f.fieldKey] || ""}
                          onChange={e => handleDynamicChange(f.fieldKey, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary font-semibold"
                        />
                      )}
                      {f.helpText && <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{f.helpText}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(3)} className="h-9 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                Next: Upload Verification Documents <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPLOAD REQUIRED DOCUMENTS */}
        {step === 3 && template && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Step 3: Statutory & Identity Verification Documents</h2>

            <div className="space-y-3">
              {template.requiredDocuments.map(doc => {
                const isUploaded = !!uploadedDocs[doc.docKey];
                return (
                  <div key={doc.docKey} className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold ${
                        isUploaded ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-primary"
                      }`}>
                        {isUploaded ? <FileCheck className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{doc.label} {doc.required && "*"}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{isUploaded ? "Document verified & attached" : "PDF or JPG format, max 10MB"}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDocSimulatedUpload(doc.docKey)}
                      className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                        isUploaded ? "bg-emerald-100 text-emerald-700" : "bg-primary text-white hover:bg-primary-hover"
                      }`}
                    >
                      {isUploaded ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                      {isUploaded ? "Attached" : "Upload File"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="h-9 px-4 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
              <button onClick={() => setStep(4)} className="h-9 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                Next: Review Registration Preview <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW & SUBMIT */}
        {step === 4 && selectedType && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Step 4: Registration Summary Preview</h2>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-900 text-sm">{commonForm.organizationName || "Solaris Power Pvt Ltd"}</span>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-primary text-white uppercase">{selectedType.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <p><span className="font-bold text-slate-500">Official Email:</span> {commonForm.officialEmail || "contact@solarissystems.com"}</p>
                <p><span className="font-bold text-slate-500">Contact:</span> {commonForm.contactNumber || "+91 98765 43210"}</p>
                <p><span className="font-bold text-slate-500">Location:</span> {commonForm.city}, {commonForm.state}</p>
                <p><span className="font-bold text-slate-500">Website:</span> {commonForm.website || "N/A"}</p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-700 text-xs mb-1">Dynamic Category Attributes</h4>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {Object.entries(dynamicValues).map(([k, v]) => (
                    <p key={k}><span className="font-bold text-slate-500 uppercase">{k}:</span> {String(v)}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(3)} className="h-9 px-4 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
              <button onClick={handleSubmitRegistration} disabled={submitting}
                className="h-9 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Submit Registration for Verification
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUBMITTED CONFIRMATION */}
        {step === 5 && registeredSuccess && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Registration Submitted Successfully!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{registeredSuccess.message}</p>
            <div className="pt-4">
              <Link href="/auth/login" className="h-9 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover inline-flex items-center gap-1.5">
                Proceed to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
