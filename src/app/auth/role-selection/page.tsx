"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import {
  Building2,
  GraduationCap,
  UserCheck,
  Search,
  X,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles
} from "lucide-react";

interface RoleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  badge: string;
  responsibilities: string[];
  buttonText: string;
  destination: string;
}

const roles: RoleItem[] = [
  {
    id: "industry",
    title: "Industry / Organization",
    description: "For companies, startups, LLPs, MSMEs, academic institutions, research organizations, NGOs, government agencies and vendors seeking technical solutions & research collaboration.",
    icon: Building2,
    badge: "Dynamic Metadata Registration",
    responsibilities: ["Submit R&D Problem Statements", "Sponsor Applied Research", "Access Vetted Experts & Talents"],
    buttonText: "Continue as Industry / Organization",
    destination: "/auth/register/industry"
  },
  {
    id: "expert",
    title: "Experts",
    description: "For professors, PhD holders, researchers, industry professionals, freelancers, consultants, cyber security, AI/ML, legal & financial specialists.",
    icon: GraduationCap,
    badge: "Professional Credential Audit",
    responsibilities: ["Structure R&D Milestones", "Supervise Student Research", "Deliver Specialized Solutions"],
    buttonText: "Continue as Expert",
    destination: "/auth/register/expert"
  },
  {
    id: "student",
    title: "Student Researcher",
    description: "For students, postgraduates & young researchers seeking internships, skill development, mentorship and industry-sponsored project execution.",
    icon: UserCheck,
    badge: "Student Verification",
    responsibilities: ["Apply to Vacancies & Internships", "Execute Project Milestones", "Mentorship & Skill Certification"],
    buttonText: "Continue as Student",
    destination: "/auth/register/student"
  }
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Support modal states
  const [helpForm, setHelpForm] = useState({
    fullName: "",
    email: "",
    organization: "",
    message: ""
  });
  const [isHelpSubmitting, setIsHelpSubmitting] = useState(false);
  const [isHelpSuccess, setIsHelpSuccess] = useState(false);

  // Filtering roles matching search
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const query = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.title.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query) ||
        role.responsibilities.some((r) => r.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsHelpSubmitting(true);

    setTimeout(() => {
      setIsHelpSubmitting(false);
      setIsHelpSuccess(true);
      setHelpForm({ fullName: "", email: "", organization: "", message: "" });
      setTimeout(() => {
        setIsHelpSuccess(false);
        setIsHelpOpen(false);
      }, 2000);
    }, 1200);
  };

  const handleRoleContinue = (roleId: string, destination: string) => {
    setSelectedRole(roleId);
    setTimeout(() => {
      setSelectedRole(null);
      router.push(destination);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* Navigation Header */}
      <Navigation showBack={true} />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Select Platform Onboarding Track
            </span>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-black text-white tracking-tight sm:text-5xl"
            >
              Choose Your Role
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-4 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Select the onboarding track that best describes your profile. Based on your selection, we will guide you through verified registration and NDA onboarding.
            </motion.p>
          </div>

          {/* Centered Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="max-w-md mx-auto mb-14"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your role (e.g. Industry, Expert, Student)..."
                className="w-full pl-11 pr-10 py-3 text-sm border border-slate-800 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Staggered 3-Card Role Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredRoles.map((role, index) => {
                const Icon = role.icon;
                const isCurrentLoading = selectedRole === role.id;

                return (
                  <motion.div
                    key={role.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flex flex-col justify-between bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleRoleContinue(role.id, role.destination)}
                  >
                    {/* Top: Icon & Title */}
                    <div>
                      <div className="h-14 w-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-7 w-7" />
                      </div>
                      
                      <h3 className="mt-6 text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {role.title}
                      </h3>
                      <p className="mt-3 text-xs text-slate-400 leading-relaxed min-h-[64px]">
                        {role.description}
                      </p>

                      {/* Responsibilities list */}
                      <ul className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
                        {role.responsibilities.map((resp) => (
                          <li key={resp} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Badge & Button */}
                    <div className="mt-8 pt-5 border-t border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20">
                          {role.badge}
                        </span>
                        <ArrowRight className="h-4.5 w-4.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>

                      <button
                        disabled={isCurrentLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleContinue(role.id, role.destination);
                        }}
                        className="w-full h-12 inline-flex items-center justify-center px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                      >
                        {isCurrentLoading ? (
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          role.buttonText
                        )}
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Zero states search */}
          {filteredRoles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl mt-6 max-w-xl mx-auto"
            >
              <HelpCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No roles matched</h3>
              <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
                No standard onboarding track matched "{searchQuery}". Contact our support team for custom enterprise registration.
              </p>
            </motion.div>
          )}

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
          >
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
                Unsure which track fits your organization?
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Our enterprise team will guide you through custom NDA agreements and platform access.
              </p>
            </div>
            <Dialog.Root open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <Dialog.Trigger asChild>
                <button className="px-5 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 transition-colors shrink-0 cursor-pointer">
                  Request Guidance
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-fade-in" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-50 text-white">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <Dialog.Title className="text-lg font-bold text-white">
                      Request Guidance
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {isHelpSuccess ? (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                      <h4 className="text-base font-bold text-white">Request Received</h4>
                      <p className="mt-1 text-xs text-slate-400">
                        An enterprise onboarding advisor will reach out to your email shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleHelpSubmit} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                        <input
                          required
                          type="text"
                          value={helpForm.fullName}
                          onChange={(e) => setHelpForm({ ...helpForm, fullName: e.target.value })}
                          placeholder="Dr. Rajesh Sharma"
                          className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                        <input
                          required
                          type="email"
                          value={helpForm.email}
                          onChange={(e) => setHelpForm({ ...helpForm, email: e.target.value })}
                          placeholder="rajesh@org.in"
                          className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Institute</label>
                        <input
                          required
                          type="text"
                          value={helpForm.organization}
                          onChange={(e) => setHelpForm({ ...helpForm, organization: e.target.value })}
                          placeholder="IISc / ISRO / Corporate R&D"
                          className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                        <textarea
                          required
                          rows={3}
                          value={helpForm.message}
                          onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })}
                          placeholder="Describe your research project or organization requirements..."
                          className="w-full px-3 py-2 text-xs border border-slate-800 rounded-lg bg-slate-950 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isHelpSubmitting}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isHelpSubmitting ? "Submitting..." : "Submit Guidance Request"}
                      </button>
                    </form>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
