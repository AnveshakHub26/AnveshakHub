"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  Building2,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Lock,
  Globe,
  Phone,
  Mail,
  MapPin,
  Check,
  Sparkles,
  BadgeCheck,
  CircleAlert,
  Info,
  ExternalLink
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// ─── Types ─────────────────────────────────────────────────────────────────
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

type SectionStatus = "completed" | "incomplete" | "missing";

interface ReviewSection {
  id: string;
  title: string;
  sectionIndex: number;
  status: SectionStatus;
  missingFields: string[];
}

// ─── Animation Variants ────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.07, ease: "easeOut" as const }
  })
};

const accordionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" as const } }
};

// ─── Status Badge Component ────────────────────────────────────────────────
function StatusBadge({ status }: { status: SectionStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </span>
    );
  }
  if (status === "incomplete") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="h-3 w-3" /> Incomplete
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
      <AlertCircle className="h-3 w-3" /> Missing
    </span>
  );
}

// ─── Field Row ─────────────────────────────────────────────────────────────
function FieldRow({ label, value, missing }: { label: string; value?: string; missing?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40 shrink-0">{label}</span>
      {missing || !value ? (
        <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
          <CircleAlert className="h-3 w-3" /> Not provided
        </span>
      ) : (
        <span className="text-xs font-semibold text-slate-800 text-right max-w-xs leading-relaxed">{value}</span>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ReviewConfirmPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<IndustryOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    business: false,
    address: false,
    verification: false
  });

  // Three enterprise checkboxes
  const [ckAccuracy, setCkAccuracy] = useState(false);
  const [ckPrivacy, setCkPrivacy] = useState(false);
  const [ckTerms, setCkTerms] = useState(false);

  // UI states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [saveDraftStatus, setSaveDraftStatus] = useState<"idle" | "saved">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Section refs for scroll-to-error
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const termsRef = useRef<HTMLDivElement | null>(null);

  // ── Load draft ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    if (saved) {
      try { setDraft(JSON.parse(saved)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  // Auto-redirect if no draft
  useEffect(() => {
    if (!loading && !draft) {
      router.push("/auth/register/industry");
    }
  }, [loading, draft, router]);

  // ── Section completeness logic ────────────────────────────────────────────
  const evaluateSections = (d: IndustryOnboardingData): ReviewSection[] => {
    const sections: ReviewSection[] = [];

    // Section 1: Basic
    const basicMissing: string[] = [];
    if (!d.orgName) basicMissing.push("Organization Name");
    if (!d.email) basicMissing.push("Official Email");
    if (!d.phone) basicMissing.push("Contact Phone");
    sections.push({
      id: "basic",
      title: "Basic Organization Information",
      sectionIndex: 1,
      status: basicMissing.length === 0 ? "completed" : basicMissing.length <= 1 ? "incomplete" : "missing",
      missingFields: basicMissing
    });

    // Section 2: Business
    const bizMissing: string[] = [];
    if (!d.industryDomain) bizMissing.push("Industry Domain");
    if (!d.orgDescription) bizMissing.push("Organization Description");
    if (!d.businessCategory) bizMissing.push("Business Category");
    if (!d.researchAreas) bizMissing.push("Research Areas");
    sections.push({
      id: "business",
      title: "Business Information",
      sectionIndex: 2,
      status: bizMissing.length === 0 ? "completed" : bizMissing.length <= 2 ? "incomplete" : "missing",
      missingFields: bizMissing
    });

    // Section 3: Address
    const addrMissing: string[] = [];
    if (!d.state) addrMissing.push("State");
    if (!d.district) addrMissing.push("District");
    if (!d.city) addrMissing.push("City");
    if (!d.pin) addrMissing.push("PIN Code");
    if (!d.addressLine) addrMissing.push("Office Address Line");
    sections.push({
      id: "address",
      title: "Registered Address Information",
      sectionIndex: 3,
      status: addrMissing.length === 0 ? "completed" : addrMissing.length <= 2 ? "incomplete" : "missing",
      missingFields: addrMissing
    });

    // Section 4: Verification Information
    const docsMissing: string[] = [];
    if (d.orgType === "Private Limited") {
      if (!d.cin) docsMissing.push("CIN Number");
      if (!d.gst) docsMissing.push("GST Number");
      if (!d.pan) docsMissing.push("PAN Number");
    } else if (d.orgType === "LLP") {
      if (!d.llpNumber) docsMissing.push("LLPIN Number");
      if (!d.partnerDetails) docsMissing.push("Partner details");
    } else if (d.orgType === "MSME") {
      if (!d.msmeReg) docsMissing.push("Udyam Registration Number");
    } else if (d.orgType === "Startup") {
      if (!d.founderName) docsMissing.push("Founder Name");
    }
    sections.push({
      id: "verification",
      title: "Verification Information",
      sectionIndex: 4,
      status: docsMissing.length === 0 ? "completed" : "incomplete",
      missingFields: docsMissing
    });

    return sections;
  };

  const sections = draft ? evaluateSections(draft) : [];
  const allSectionsComplete = sections.every(s => s.status === "completed");
  const completedCount = sections.filter(s => s.status === "completed").length;
  const completionPct = Math.round((completedCount / 4) * 100);

  // ── Toggle accordion ──────────────────────────────────────────────────────
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Save draft ────────────────────────────────────────────────────────────
  const handleSaveDraft = () => {
    if (draft) {
      localStorage.setItem("anveshakhub_industry_onboarding", JSON.stringify(draft));
    }
    setSaveDraftStatus("saved");
    setTimeout(() => setSaveDraftStatus("idle"), 2000);
  };

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancelConfirm = () => {
    localStorage.removeItem("anveshakhub_industry_onboarding");
    router.push("/auth/role-selection");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Check all sections complete
    sections.forEach(s => {
      if (s.status !== "completed") {
        errors.push(s.id);
      }
    });

    // Check terms
    if (!ckAccuracy || !ckPrivacy || !ckTerms) {
      errors.push("terms");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to first incomplete section
      const firstError = errors[0];
      if (firstError === "terms") {
        termsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const ref = sectionRefs.current[firstError];
        if (ref) {
          ref.scrollIntoView({ behavior: "smooth", block: "start" });
          setExpandedSections(prev => ({ ...prev, [firstError]: true }));
        }
      }
      return;
    }

    setValidationErrors([]);
    setIsSubmitting(true);
    // Simulated API submission
    // NOTE: We do NOT remove the draft here — AUTH-005 needs it to read the email address
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  // ─── Loading / redirect state ──────────────────────────────────────────
  if (loading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // ─── Success screen ────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navigation showBack={false} />
        <main className="flex-grow flex items-center justify-center py-20 px-4 bg-slate-50/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 mb-6"
            >
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </motion.div>
            <h1 className="text-xl font-black text-secondary tracking-tight">Profile Submitted for Verification</h1>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Your organization profile has been submitted to the AnveshakHub verification queue. Our compliance team will audit your credentials against MCA and state registrar records.
            </p>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> What Happens Next?
              </p>
              <ul className="space-y-2 text-[10px] text-slate-550 leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" /> Verification email notification sent to your registered corporate email.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" /> Compliance team reviews credentials — typically within 24 business hours.</li>
                <li className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" /> Upon approval, your secure organization dashboard will be unlocked.</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-3 justify-center">
              <Link
                href="/"
                className="h-10 px-4 inline-flex items-center gap-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Homepage
              </Link>
              <Link
                href="/auth/verify-email"
                className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-700 rounded-lg text-xs font-bold text-white shadow-sm transition-colors"
              >
                <ShieldCheck className="h-4 w-4" /> Verify Identity
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Main Review UI ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/auth/register/industry")}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Back to organization profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-secondary tracking-tight">AnveshakHub</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-5">
            {/* Header completion bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile:</span>
              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-primary">{completionPct}%</span>
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

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/40 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-8"
          >
            <h1 className="text-xl font-black text-secondary tracking-tight">Review Your Organization Profile</h1>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xl">
              Please review your information carefully before submitting it for verification. Each section must be complete before submission.
            </p>
          </motion.div>

          {/* Global validation error banner */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700">Submission Blocked</p>
                  <p className="text-[10px] text-red-600 mt-0.5">
                    {validationErrors.includes("terms")
                      ? "Please accept all three terms & conditions before submitting."
                      : "One or more profile sections are incomplete. Please review and fill in the missing information."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── LEFT: Accordion Sections ─────────────────────────────── */}
            <div className="lg:col-span-8 space-y-4">

              {sections.map((section, idx) => {
                const isExpanded = expandedSections[section.id];
                const hasError = validationErrors.includes(section.id);

                return (
                  <motion.div
                    key={section.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    ref={el => { sectionRefs.current[section.id] = el; }}
                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-colors ${
                      hasError ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          section.status === "completed"
                            ? "bg-emerald-600 text-white"
                            : section.status === "incomplete"
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {section.status === "completed" ? <Check className="h-3.5 w-3.5" /> : section.sectionIndex}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-sm font-extrabold text-secondary truncate">{section.title}</h2>
                          <div className="mt-0.5">
                            <StatusBadge status={section.status} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <Link
                          href={`/auth/register/industry?section=${section.sectionIndex}`}
                          className="inline-flex items-center gap-1 h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Link>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="h-7 w-7 inline-flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                          aria-label={isExpanded ? "Collapse section" : "Expand section"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Empty state warning strip (always visible if incomplete) */}
                    {section.missingFields.length > 0 && (
                      <div className="mx-5 mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-amber-700">Missing required information:</p>
                          <p className="text-[10px] text-amber-600 mt-0.5">
                            {section.missingFields.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          variants={accordionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4">

                            {/* ── SECTION 1: Basic Organization Info ── */}
                            {section.id === "basic" && (
                              <div className="space-y-0">
                                <FieldRow label="Organization Name" value={draft.orgName} />
                                <FieldRow label="Official Email" value={draft.email} />
                                <FieldRow label="Contact Phone" value={draft.phone} />
                                <FieldRow label="Registered Country" value={draft.country || "India"} />
                                <FieldRow label="Website" value={draft.website || undefined} />
                              </div>
                            )}

                            {/* ── SECTION 2: Business Details ── */}
                            {section.id === "business" && (
                              <div className="space-y-0">
                                <FieldRow label="Organization Type" value={draft.orgType} />
                                <FieldRow label="Industry Domain" value={draft.industryDomain} />
                                <FieldRow label="Business Category" value={draft.businessCategory} />
                                <FieldRow label="Research Areas / Focus" value={draft.researchAreas} />
                                <FieldRow label="Organization Description" value={draft.orgDescription} />
                              </div>
                            )}

                            {/* ── SECTION 3: Address ── */}
                            {section.id === "address" && (
                              <div className="space-y-0">
                                <FieldRow label="Country" value={draft.country || "India"} />
                                <FieldRow label="State" value={draft.state} />
                                <FieldRow label="District" value={draft.district} />
                                <FieldRow label="City / Locality" value={draft.city} />
                                <FieldRow label="PIN Code" value={draft.pin} />
                                <FieldRow label="Office Address" value={draft.addressLine} />
                              </div>
                            )}

                            {/* ── SECTION 4: Verification Information ── */}
                            {section.id === "verification" && (
                              <div className="space-y-4">
                                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1">
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Registration Credential Values</h4>
                                  {draft.orgType === "Private Limited" && (
                                    <>
                                      <FieldRow label="CIN Number" value={draft.cin} />
                                      <FieldRow label="GSTIN" value={draft.gst || undefined} />
                                      <FieldRow label="PAN Number" value={draft.pan} />
                                    </>
                                  )}
                                  {draft.orgType === "Startup" && (
                                    <>
                                      <FieldRow label="Founder Name" value={draft.founderName} />
                                      <FieldRow label="Startup India Reg" value={draft.startupIndiaReg || undefined} />
                                      <FieldRow label="Funding Stage" value={draft.fundingStage} />
                                      <FieldRow label="Incubation Status" value={draft.incubationStatus === "Yes" ? `Incubated at ${draft.incubatorName}` : "Not Incubated"} />
                                    </>
                                  )}
                                  {draft.orgType === "LLP" && (
                                    <>
                                      <FieldRow label="LLPIN Number" value={draft.llpNumber} />
                                      <FieldRow label="GSTIN" value={draft.gst || undefined} />
                                      <FieldRow label="Partners" value={draft.partnerDetails} />
                                    </>
                                  )}
                                  {draft.orgType === "MSME" && (
                                    <>
                                      <FieldRow label="Udyam Reg No." value={draft.msmeReg} />
                                      <FieldRow label="Business Category" value={draft.businessCategory} />
                                    </>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] text-slate-500 leading-relaxed">
                                    The following documents will be required during admin verification. Ensure physical copies are available when requested.
                                  </p>

                                  {/* Required documents per type */}
                                  {draft.orgType === "Private Limited" && (
                                    <div className="space-y-2">
                                      {[
                                        { label: "Certificate of Incorporation (CIN)", present: !!draft.cin },
                                        { label: "GST Registration Certificate", present: !!draft.gst },
                                        { label: "PAN Card (Organization)", present: !!draft.pan },
                                        { label: "Board Resolution / Authorization Letter", present: false }
                                      ].map(doc => (
                                        <div key={doc.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                          <span className="text-xs text-slate-700">{doc.label}</span>
                                          {doc.present ? (
                                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Provided</span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Required</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {draft.orgType === "Startup" && (
                                    <div className="space-y-2">
                                      {[
                                        { label: "Startup India / DIPP Certificate", present: !!draft.startupIndiaReg },
                                        { label: "Founder Identity Proof", present: !!draft.founderName },
                                        { label: "Pitch Deck or Business Summary (Optional)", present: false }
                                      ].map(doc => (
                                        <div key={doc.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                          <span className="text-xs text-slate-700">{doc.label}</span>
                                          {doc.present ? (
                                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Provided</span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Required</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {draft.orgType === "LLP" && (
                                    <div className="space-y-2">
                                      {[
                                        { label: "LLP Incorporation Certificate", present: !!draft.llpNumber },
                                        { label: "GST Registration Certificate", present: !!draft.gst },
                                        { label: "LLP Agreement Document", present: false }
                                      ].map(doc => (
                                        <div key={doc.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                          <span className="text-xs text-slate-700">{doc.label}</span>
                                          {doc.present ? (
                                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Provided</span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Required</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {draft.orgType === "MSME" && (
                                    <div className="space-y-2">
                                      {[
                                        { label: "Udyam Registration Certificate", present: !!draft.msmeReg },
                                        { label: "GST Registration (if applicable)", present: !!draft.gst },
                                        { label: "Bank Account Proof", present: false }
                                      ].map(doc => (
                                        <div key={doc.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                          <span className="text-xs text-slate-700">{doc.label}</span>
                                          {doc.present ? (
                                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Provided</span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Required</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* ── Terms & Conditions Card ── */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                ref={termsRef}
                className={`bg-white border rounded-2xl shadow-sm p-6 space-y-5 ${
                  validationErrors.includes("terms") ? "border-red-300" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-sm font-extrabold text-secondary">Declaration & Consent</h2>
                </div>

                {validationErrors.includes("terms") && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-red-700">You must accept all three declarations before submitting.</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Checkbox 1 */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox.Root
                      checked={ckAccuracy}
                      onCheckedChange={(v) => setCkAccuracy(!!v)}
                      className="h-4 w-4 mt-0.5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0 flex items-center justify-center transition-colors"
                    >
                      <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                      I confirm that all information provided is <strong>accurate, complete and authentic</strong>. I understand that providing false credentials is a registrable offence under applicable law.
                    </span>
                  </label>

                  {/* Checkbox 2 */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox.Root
                      checked={ckPrivacy}
                      onCheckedChange={(v) => setCkPrivacy(!!v)}
                      className="h-4 w-4 mt-0.5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0 flex items-center justify-center transition-colors"
                    >
                      <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                      I have read and I agree to the{" "}
                      <Link href="/" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                        Privacy Policy <ExternalLink className="h-3 w-3" />
                      </Link>
                      {" "}governing the processing of my organization's personal and corporate data.
                    </span>
                  </label>

                  {/* Checkbox 3 */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox.Root
                      checked={ckTerms}
                      onCheckedChange={(v) => setCkTerms(!!v)}
                      className="h-4 w-4 mt-0.5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0 flex items-center justify-center transition-colors"
                    >
                      <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                      I agree to the{" "}
                      <Link href="/" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                        Terms of Service <ExternalLink className="h-3 w-3" />
                      </Link>
                      {" "}and the{" "}
                      <Link href="/" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                        Verification Policy <ExternalLink className="h-3 w-3" />
                      </Link>
                      {" "}of the AnveshakHub Enterprise Platform.
                    </span>
                  </label>
                </div>
              </motion.div>

              {/* ── Action Buttons ── */}
              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-wrap items-center justify-between gap-4 pt-2"
              >
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/auth/register/industry")}
                    className="h-10 px-4 inline-flex items-center gap-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="h-10 px-4 inline-flex items-center border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    Cancel Registration
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="h-10 px-4 inline-flex items-center border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {saveDraftStatus === "saved" ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Draft Saved
                      </span>
                    ) : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-10 px-6 inline-flex items-center justify-center bg-primary hover:bg-blue-700 rounded-lg text-xs font-bold text-white shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting…
                      </span>
                    ) : "Submit for Verification"}
                  </button>
                </div>
              </motion.div>

            </div>

            {/* ── RIGHT: Summary Widgets ────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-5">

              {/* Registration Summary Card */}
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-primary" /> Registration Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization</span>
                    <span className="text-xs font-bold text-slate-800 text-right max-w-[160px] truncate">{draft.orgName || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entity Type</span>
                    <span className="text-xs font-bold text-slate-800">{draft.orgType || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Level</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-100">
                      Standard
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Approval</span>
                    <span className="text-xs font-bold text-slate-800">24 hrs</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 font-bold">Profile Completion</span>
                      <span className="font-extrabold text-primary">{completionPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 transition-all duration-500" style={{ width: `${completionPct}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security Card */}
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-slate-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Encrypted Submission</h4>
                </div>
                <ul className="space-y-2.5 text-[10px] text-slate-550 leading-relaxed">
                  <li className="flex gap-2 items-start">
                    <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>Your submitted information is <strong>encrypted in transit</strong> using TLS 1.3.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>Confidential documents are <strong>visible only to the Verification Team</strong>.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>Industry details remain <strong>hidden from all users until approval</strong>.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Verification Timeline */}
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <h4 className="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Verification Pipeline
                </h4>
                <div className="space-y-4">
                  {[
                    { step: 1, label: "Profile Submission", desc: "Credentials submitted for queue entry.", active: true },
                    { step: 2, label: "System Audit Check", desc: "Auto-matching against MCA registry.", active: false },
                    { step: 3, label: "Admin Review", desc: "Manual credential verification.", active: false },
                    { step: 4, label: "Access Granted", desc: "Dashboard and portals unlocked.", active: false }
                  ].map(item => (
                    <div key={item.step} className="flex gap-3 items-start">
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        item.active ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {item.step}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${item.active ? "text-primary" : "text-slate-600"}`}>{item.label}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Help Card */}
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Need Assistance?</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Unsure about any field or credential requirement? Our verification support desk is available.
                </p>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" /> Contact Support Desk
                </button>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Cancel Confirmation Modal ── */}
      <Dialog.Root open={showCancelModal} onOpenChange={setShowCancelModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full z-50 focus:outline-none"
            aria-describedby="cancel-desc"
          >
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <Dialog.Title className="text-sm font-extrabold text-secondary">Cancel Registration?</Dialog.Title>
              </div>
              <Dialog.Description id="cancel-desc" className="text-xs text-slate-500 leading-relaxed">
                This will permanently discard your saved draft and all entered organization details. You will be returned to the Role Selection page.
              </Dialog.Description>
              <div className="flex gap-3 mt-6 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Keep Profile
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="h-9 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold text-white cursor-pointer"
                >
                  Discard & Cancel
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Support Modal ── */}
      <Dialog.Root open={showSupportModal} onOpenChange={setShowSupportModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-md w-full z-50 focus:outline-none"
            aria-describedby="support-desc"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <Dialog.Title className="text-sm font-extrabold text-secondary flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-primary" /> Support Desk
              </Dialog.Title>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <Dialog.Description id="support-desc" className="text-xs text-slate-500 mb-4 leading-relaxed">
              Submit an inquiry about any review or verification issue.
            </Dialog.Description>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input type="text" placeholder="Your name" className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Corporate Email</label>
                <input type="email" placeholder="name@company.com" className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Inquiry Message</label>
                <textarea placeholder="Describe your issue" rows={3} className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2 justify-end">
                <button onClick={() => setShowSupportModal(false)} className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">Close</button>
                <button onClick={() => setShowSupportModal(false)} className="h-9 px-4 bg-primary hover:bg-blue-700 rounded-lg text-xs font-semibold text-white cursor-pointer">Send Inquiry</button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
