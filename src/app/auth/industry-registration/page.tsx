"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Building2, UploadCloud, CheckCircle } from "lucide-react";

export default function IndustryRegistration() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "Startup/MSME",
    domain: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-secondary">
              Anveshak<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-2xl font-extrabold text-secondary tracking-tight">
          Industry Partner Registration
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Create an enterprise profile to submit problem statements and match with expert advisors.
        </p>

        <div className="mt-8 bg-white border border-slate-200 shadow-md rounded-xl p-8">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-16 w-16 text-emerald-600 mb-4 animate-[bounce_1s_infinite_alternate]" />
              <h3 className="text-lg font-bold text-secondary">Registration Submitted</h3>
              <p className="mt-2 text-xs text-slate-650 max-w-xs leading-relaxed">
                Thank you! Your company registration is currently in our verification queue. An administrator will review your documents within 24 hours.
              </p>
              <div className="mt-6 flex gap-4">
                <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Landing Page
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Company Information
              </div>

              {/* Company Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Aether Technologies Ltd"
                  className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Company Type & Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Company Type *
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white transition-colors"
                  >
                    <option>Startup/MSME</option>
                    <option>LLP</option>
                    <option>Pvt/Public Ltd</option>
                    <option>Government/Research Org</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Industry Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g. DeepTech / Biotech"
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Website */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Company Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="e.g. https://aethertech.com"
                  className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pt-3 pb-2">
                Primary Contact Person
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Contact Email & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. elena@aethertech.com"
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Company Registration Documents * (PDF/JPG/PNG up to 10MB)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50/50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-600">Drag and drop registration files or <span className="text-primary font-bold hover:underline">browse</span></span>
                  <span className="text-[10px] text-slate-400 mt-1">Certificate of Incorporation, LLP Agreement or tax documents</span>
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start pt-2">
                <input
                  id="agree"
                  type="checkbox"
                  required
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary/20 border-slate-300 rounded mt-0.5"
                />
                <label htmlFor="agree" className="ml-2 text-xs leading-normal text-slate-555">
                  I certify that all details submitted represent a legally registered entity, and I accept the AnveshakHub{" "}
                  <Link href="/" className="font-semibold text-primary hover:underline">Intellectual Property & Non-Disclosure Guidelines</Link>.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <Link
                  href="/auth/role-selection"
                  className="w-1/3 py-2 px-4 border border-slate-200 text-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2 px-4 rounded-lg bg-primary hover:bg-blue-700 text-sm font-semibold text-white shadow-sm disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </main>
  );
}
