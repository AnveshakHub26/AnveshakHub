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
  Handshake,
  Network,
  Landmark,
  Briefcase,
  Search,
  X,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lock
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
    title: "Expert Advisor",
    description: "For professors, PhD holders, researchers, industry professionals, freelancers, consultants, cyber security, AI/ML, legal & financial specialists.",
    icon: GraduationCap,
    badge: "Professional Credential Audit",
    responsibilities: ["Structure R&D Milestones", "Supervise Student Research", "Deliver Specialized Solutions"],
    buttonText: "Continue as Expert Advisor",
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

  // Suggestions while typing
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return roles
      .filter((role) => role.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((role) => role.title);
  }, [searchQuery]);

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsHelpSubmitting(true);

    // Simulated API request
    setTimeout(() => {
      setIsHelpSubmitting(false);
      setIsHelpSuccess(true);
      setHelpForm({ fullName: "", email: "", organization: "", message: "" });
      setTimeout(() => {
        setIsHelpSuccess(false);
        setIsHelpOpen(false);
      }, 2000);
    }, 1500);
  };

  const handleRoleContinue = (roleId: string, destination: string) => {
    setSelectedRole(roleId);
    // Simulate API match check or route delay for loading spinner feedback
    setTimeout(() => {
      setSelectedRole(null);
      router.push(destination);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky header with back button enabled */}
      <Navigation showBack={true} />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50/40">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-extrabold text-secondary tracking-tight sm:text-4xl"
            >
              Choose Your Role
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              Select the role that best describes you. Based on your selection, we will guide you through the appropriate registration and verification process.
            </motion.p>
          </div>

          {/* Centered Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your role..."
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Live suggestion tags */}
            {searchQuery && suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center">
                {suggestions.map((title) => (
                  <button
                    key={title}
                    onClick={() => setSearchQuery(title)}
                    className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Staggered Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    className="flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-8 shadow-xs hover:shadow-md hover:border-primary hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleRoleContinue(role.id, role.destination)}
                  >
                    {/* Top: Icon & Title */}
                    <div>
                      <div className="h-12 w-12 rounded-lg bg-blue-50/50 border border-blue-100/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <h3 className="mt-5 text-base font-extrabold text-secondary tracking-tight">
                        {role.title}
                      </h3>
                      <p className="mt-2.5 text-xs text-slate-500 leading-relaxed min-h-[72px]">
                        {role.description}
                      </p>

                      {/* Responsibilities list */}
                      <ul className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        {role.responsibilities.map((resp) => (
                          <li key={resp} className="flex items-start gap-2 text-[10px] font-semibold text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Badge & Button */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-blue-100">
                          {role.badge}
                        </span>
                        <ArrowRight className="h-4.5 w-4.5 text-slate-350 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      <button
                        disabled={isCurrentLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleContinue(role.id, role.destination);
                        }}
                        className="w-full h-11 inline-flex items-center justify-center px-4 rounded-lg bg-primary hover:bg-blue-700 text-xs font-semibold text-white transition-all hover:scale-[1.02] shadow-sm cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
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
              className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6"
            >
              <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-secondary">No roles matched</h3>
              <p className="mt-1 text-xs text-slate-550 max-w-sm mx-auto">
                No standard roles found matching "{searchQuery}". Try refining search terms or contact our support team.
              </p>
            </motion.div>
          )}

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-16 max-w-2xl mx-auto text-center"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 mb-4">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-secondary">Not sure which role to choose?</h2>
              <p className="mt-2.5 text-xs text-slate-555 max-w-md leading-relaxed">
                Our support team can help you identify the appropriate registration category and set up credentials.
              </p>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="mt-5 inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Structured Footer */}
      <Footer />

      {/* Support Request Dialog Modal */}
      <Dialog.Root open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white border border-slate-200 p-8 shadow-2xl focus:outline-none animate-fade-in-up">
            
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="text-lg font-bold text-secondary flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Role Classification Support
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 mt-1">
                  Submit this query, and our operations coordinator will assist you with onboarding selection.
                </Dialog.Description>
              </div>
              <Dialog.Close className="rounded-md text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="mt-6">
              {isHelpSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-3 animate-[bounce_1s_infinite_alternate]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-secondary">Support Request Sent</h3>
                  <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-normal">
                    Thank you. We will reach out to you within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHelpSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={helpForm.fullName}
                      onChange={(e) => setHelpForm({ ...helpForm, fullName: e.target.value })}
                      placeholder="e.g. Priyan Sharma"
                      className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={helpForm.email}
                      onChange={(e) => setHelpForm({ ...helpForm, email: e.target.value })}
                      placeholder="e.g. priyan@org.com"
                      className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                    />
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={helpForm.organization}
                      onChange={(e) => setHelpForm({ ...helpForm, organization: e.target.value })}
                      placeholder="e.g. IISc / Research Lab"
                      className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Query Message</label>
                    <textarea
                      required
                      rows={3}
                      value={helpForm.message}
                      onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })}
                      placeholder="Explain your research field, business context, or student status..."
                      className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-primary focus:outline-none bg-white placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Security / Confidentiality Note */}
                  <div className="flex items-start gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-400">
                    <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Your request is handled through our secure support channel. No internal credentials will be shared before approval.</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <Dialog.Close className="w-1/3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 text-center hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </Dialog.Close>
                    <button
                      type="submit"
                      disabled={isHelpSubmitting}
                      className="w-2/3 py-2 bg-primary hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isHelpSubmitting ? "Sending..." : "Submit Support"}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
