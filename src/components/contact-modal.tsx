"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    role: "industry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate NestJS API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form
      setFormData({
        companyName: "",
        fullName: "",
        email: "",
        role: "industry",
        message: "",
      });
      // Auto close after 2.5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
      }, 2500);
    }, 1500);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" />
        
        {/* Modal Content */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white border border-slate-200 p-8 shadow-2xl transition-all focus:outline-none animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-xl font-bold text-secondary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Schedule Consultation
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 mt-1.5">
                Connect with our enterprise partnerships team to integrate your research pipeline or join the expert pool.
              </Dialog.Description>
            </div>
            
            <Dialog.Close className="rounded-md text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-primary/20">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Form Content */}
          <div className="mt-6">
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4 animate-[bounce_1s_infinite_alternate]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-secondary">Consultation Requested</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                  Thank you! An AnveshakHub partnerships coordinator will contact you at the provided email within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Stakeholder Role selection */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    I am interested in joining as:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["industry", "expert", "student"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center capitalize transition-all focus:outline-none ${
                          formData.role === r
                            ? "bg-blue-50 border-primary text-primary"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company/Institution Name */}
                <div>
                  <label htmlFor="companyName" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    {formData.role === "student" ? "Institution Name" : "Company / Institution Name"} *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={formData.role === "student" ? "e.g. Indian Institute of Science" : "e.g. Aether Technologies Ltd"}
                    className="w-full text-sm py-2 px-3.5 border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. Elena Rostova"
                    className="w-full text-sm py-2 px-3.5 border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. elena@aethertech.com"
                    className="w-full text-sm py-2 px-3.5 border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Message Request */}
                <div>
                  <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Consultation Request Details *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your project goals, research requirements, or academic fields..."
                    className="w-full text-sm py-2 px-3.5 border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none transition-colors"
                  />
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
