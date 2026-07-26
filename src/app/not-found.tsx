import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FFF0ED] text-[#FF5A36] font-heading font-extrabold text-2xl border border-[#FFCFC4]">
          404
        </div>

        {/* Rule #5 Error Page Copy */}
        <h1 className="font-heading text-3xl font-extrabold text-[#211F1D]">
          This page wandered off.
        </h1>
        <p className="text-sm text-[#57534E]">
          Let's get you back to your dashboard or landing page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/" className="btn-primary text-xs min-h-[44px]">
            <Home className="h-4 w-4" /> Go to Home
          </Link>
          <Link href="/auth/login" className="btn-secondary text-xs min-h-[44px]">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
