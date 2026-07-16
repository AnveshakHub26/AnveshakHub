"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, GraduationCap, UploadCloud, CheckCircle, Plus, Trash2 } from "lucide-react";

interface Qualification {
  degree: string;
  institution: string;
  year: string;
}

export default function ExpertRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    institution: "",
    domainTags: "",
    experienceYears: 5,
    certifications: "",
  });
  
  // Repeatable qualifications
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { degree: "", institution: "", year: "" }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          Subject Expert Registration
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Onboard as a verified mentor or advisor to lead research initiatives and milestones.
        </p>

        <div className="mt-8 bg-white border border-slate-200 shadow-md rounded-xl p-8">
          {isSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-16 w-16 text-emerald-600 mb-4 animate-[bounce_1s_infinite_alternate]" />
              <h3 className="text-lg font-bold text-secondary">Profile Submitted for Review</h3>
              <p className="mt-2 text-xs text-slate-650 max-w-xs leading-relaxed">
                Thank you! Your profile and academic qualifications are now in our verification queue. An administrator will review your credentials and publications.
              </p>
              <div className="mt-6">
                <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Landing Page
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Personal Info & Domain
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Prof. Rajesh Kumar"
                  className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Institution & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Institution / Org *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Indian Institute of Science"
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Consulting Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Expertise Tags */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Expertise / Domain Tags *
                </label>
                <input
                  type="text"
                  required
                  value={formData.domainTags}
                  onChange={(e) => setFormData({ ...formData, domainTags: e.target.value })}
                  placeholder="e.g. ML/NLP, Embedded Systems, Quantum Computing (comma separated)"
                  className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pt-3 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Academic Qualifications *
                </span>
                <button
                  type="button"
                  onClick={addQualification}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
              </div>

              {/* Repeatable Qualifications */}
              <div className="space-y-4">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative">
                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualification(idx)}
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        aria-label="Remove qualification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Degree *
                        </label>
                        <input
                          type="text"
                          required
                          value={q.degree}
                          onChange={(e) => updateQualification(idx, "degree", e.target.value)}
                          placeholder="PhD / M.Tech"
                          className="w-full text-xs py-1.5 px-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Institution *
                        </label>
                        <input
                          type="text"
                          required
                          value={q.institution}
                          onChange={(e) => updateQualification(idx, "institution", e.target.value)}
                          placeholder="IISc / IIT"
                          className="w-full text-xs py-1.5 px-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Year *
                        </label>
                        <input
                          type="text"
                          required
                          value={q.year}
                          onChange={(e) => updateQualification(idx, "year", e.target.value)}
                          placeholder="e.g. 2018"
                          className="w-full text-xs py-1.5 px-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pt-3 pb-2">
                CV & Supporting Credentials
              </div>

              {/* CV Resume upload */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Curriculum Vitae (CV) * (PDF up to 10MB)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50/50 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-600">Drag and drop CV or <span className="text-primary font-bold hover:underline">browse</span></span>
                  <span className="text-[10px] text-slate-400 mt-1">Provide a detailed research and consulting resume</span>
                </div>
              </div>

              {/* Action buttons */}
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
                  {isSubmitting ? "Submitting..." : "Submit Profile"}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </main>
  );
}
