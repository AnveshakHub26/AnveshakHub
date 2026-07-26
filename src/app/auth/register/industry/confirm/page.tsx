"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  Lock,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface IndustryOnboardingData {
  orgName: string;
  email: string;
  phone: string;
  orgType: string;
  country: string;
  founderName: string;
  startupIndiaReg: string;
  fundingStage: string;
  teamSize: string;
  incubationStatus: string;
  incubatorName: string;
  cin: string;
  gst: string;
  pan: string;
  registeredOffice: string;
  website: string;
  llpNumber: string;
  partnerDetails: string;
  msmeReg: string;
  businessCategory: string;
  state: string;
  district: string;
  city: string;
  pin: string;
  addressLine: string;
}

export default function OnboardingConfirm() {
  const router = useRouter();
  const [formData, setFormData] = useState<IndustryOnboardingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved onboarding draft", e);
      }
    } else {
      // If no draft exists, redirect back to onboarding form
      router.push("/auth/register/industry");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate final backend verification submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.removeItem("anveshakhub_industry_onboarding"); // Clear draft on successful submit
    }, 1800);
  };

  if (!formData && !isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF7F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF5A36]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF7F0]">
      {/* Sticky Navigation */}
      <Navigation showBack={true} />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-[#FBF7F0]/45 relative overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {isSuccess ? (
            /* SUCCESS VIEW */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-[#FBF7F0] border border-[#E2DCD2] shadow-xl rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-55/60 border border-emerald-100 mb-5 animate-pulse">
                <CheckCircle2 className="h-9 w-9 text-[#2F6B4F]" />
              </div>
              <h1 className="text-xl font-black text-[#211F1D] tracking-tight">Organization Profile Submitted</h1>
              <p className="mt-3 text-xs text-[#78716A] leading-relaxed max-w-sm mx-auto">
                Your onboarding profile details have been successfully submitted to the validation queue. 
                Our compliance team will cross-reference the identifiers with MCA registry records. 
                Review processes typically complete within 24 hours.
              </p>

              <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 mt-6 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A8A196] uppercase tracking-widest">
                  <Clock className="h-3.5 w-3.5" /> What Happens Next?
                </div>
                <ul className="text-[10px] text-slate-550 space-y-1.5 list-disc pl-4 leading-normal">
                  <li>You will receive verification status notifications via your registered corporate email.</li>
                  <li>Our administrators might reach out to confirm contact points if standard auto-audits fail.</li>
                  <li>Once approved, your credential badges will be generated and access to secure portals unlocked.</li>
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="h-11 px-5 inline-flex items-center justify-center gap-1 border border-[#E2DCD2] rounded-lg text-xs font-bold text-[#57534E] hover:bg-[#FBF7F0] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Go to Homepage
                </Link>
                <Link
                  href="/auth/login"
                  className="h-11 px-6 inline-flex items-center justify-center bg-[#FF5A36] hover:bg-blue-700 rounded-lg text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
                >
                  Log In to Dashboard
                </Link>
              </div>
            </motion.div>
          ) : (
            /* PREVIEW SUMMARY VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Data Grid Summary */}
              <div className="lg:col-span-8 bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-sm)] space-y-6">
                <div className="border-b border-[#E2DCD2] pb-5">
                  <h1 className="text-xl font-black text-[#211F1D] tracking-tight">Review & Confirm Profile</h1>
                  <p className="mt-1.5 text-xs text-[#78716A] leading-relaxed">
                    Verify all legal registration identifiers match official documentation before finalizing profile submission.
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Basic Organization Profile Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#A8A196] uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Basic Organization Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FBF7F0] p-4 border border-slate-150 rounded-xl text-xs">
                      <div>
                        <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Official Legal Name</span>
                        <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.orgName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Contact Corporate Email</span>
                        <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Contact Phone</span>
                        <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Legal Business Entity Type</span>
                        <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.orgType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Organization Type Specific Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#A8A196] uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Registry Registration Credentials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FBF7F0] p-4 border border-slate-150 rounded-xl text-xs">
                      
                      {formData?.orgType === "Startup" && (
                        <>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Founder / CEO Name</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">{formData.founderName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Startup India Registration</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">{formData.startupIndiaReg || "Not Declared"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Strategic Funding Stage</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">{formData.fundingStage}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Incubator Status</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">
                              {formData.incubationStatus === "Yes" ? `Incubated at ${formData.incubatorName}` : "Not Incubated"}
                            </span>
                          </div>
                        </>
                      )}

                      {formData?.orgType === "Private Limited" && (
                        <>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Corporate Identity Number (CIN)</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.cin}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">GST Identification Number (GSTIN)</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.gst || "Not Declared"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Income Tax PAN</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.pan}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Website URL</span>
                            <span className="font-bold text-[#FF5A36] mt-0.5 block hover:underline">
                              {formData.website ? (
                                <a href={formData.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                                  {formData.website} <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : "Not Declared"}
                            </span>
                          </div>
                        </>
                      )}

                      {formData?.orgType === "LLP" && (
                        <>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">LLP Identification Number</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.llpNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">GST Identification Number</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.gst || "Not Declared"}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Partner Representatives</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">{formData.partnerDetails}</span>
                          </div>
                        </>
                      )}

                      {formData?.orgType === "MSME" && (
                        <>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">MSME Udyam Registration</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block uppercase tracking-wide">{formData.msmeReg}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Business Sector Category</span>
                            <span className="font-bold text-[#211F1D] mt-0.5 block">{formData.businessCategory}</span>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  {/* Registered Smart Address Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#A8A196] uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Verified Smart Address
                    </h3>
                    <div className="bg-[#FBF7F0] p-4 border border-slate-150 rounded-xl text-xs space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <span className="text-[10px] text-[#A8A196] font-semibold uppercase">State</span>
                          <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.state}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8A196] font-semibold uppercase">District</span>
                          <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.district}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8A196] font-semibold uppercase">City / Locality</span>
                          <span className="font-bold text-[#211F1D] mt-0.5 block">{formData?.city}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8A196] font-semibold uppercase">PIN Code</span>
                          <span className="font-bold text-[#211F1D] mt-0.5 block tracking-wide">{formData?.pin}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#E2DCD2]">
                        <span className="text-[10px] text-[#A8A196] font-semibold uppercase block">Registered Office Address Line</span>
                        <span className="font-bold text-[#211F1D] mt-1 block leading-relaxed">{formData?.addressLine}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Terms and Submissions */}
                <form onSubmit={handleSubmit} className="pt-6 border-t border-[#E2DCD2] flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/auth/register/industry"
                    className="h-10 px-4 inline-flex items-center justify-center border border-[#E2DCD2] text-xs font-bold text-[#57534E] rounded-lg hover:bg-[#FBF7F0] transition-colors cursor-pointer"
                  >
                    Back to Form
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-6 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg shadow-[var(--shadow-sm)] hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying Profile...
                      </span>
                    ) : (
                      "Submit for Verification"
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Security/Data Info widgets */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Guidelines */}
                <div className="card-flat rounded-2xl p-5 shadow-[var(--shadow-sm)] space-y-4">
                  <h3 className="text-xs font-extrabold text-[#211F1D] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Audit Checklist
                  </h3>
                  <ul className="space-y-3.5 text-[10px] text-slate-550 leading-relaxed pl-1">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2F6B4F] shrink-0" />
                      <span>Company Name matches official GSTIN or Corporate registrations.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2F6B4F] shrink-0" />
                      <span>Corporate domain email address is active for official audit notices.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2F6B4F] shrink-0" />
                      <span>Smart addresses align with state jurisdiction boards.</span>
                    </li>
                  </ul>
                </div>

                {/* Trust Indicators */}
                <div className="card-flat rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-[#211F1D]">
                    <Lock className="h-[1.125rem] w-[1.125rem] text-[#57534E]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Secured Channel</h4>
                  </div>
                  <p className="text-[10px] text-[#78716A] leading-relaxed">
                    Credentials submitted here are encrypted in-transit (TLS 1.3) and verified only against verified state registrar databases. No verification rules are exposed.
                  </p>
                </div>

                {/* Support Assistance */}
                <div className="card-flat rounded-2xl p-5 shadow-[var(--shadow-sm)] space-y-3">
                  <h4 className="text-xs font-bold text-slate-750 uppercase tracking-wider">Verification Support</h4>
                  <p className="text-[10px] text-[#78716A] leading-relaxed">
                    Experiencing delays or matching issues with your CIN or GST credentials? Open a priority inquiry ticket.
                  </p>
                  <a
                    href="mailto:support@anveshakhub.gov.in"
                    className="w-full h-9 inline-flex items-center justify-center border border-[#E2DCD2] rounded-lg text-xs font-bold text-[#57534E] hover:bg-[#FBF7F0] transition-colors"
                  >
                    Email Support Desk
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
