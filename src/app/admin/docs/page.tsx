"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText, Hash, ShieldCheck, Layers, Terminal, BookOpen, Clock, Server, Play, Code
} from "lucide-react";

export default function DevDocsPage() {
  return (
    <div className="p-6 space-y-6 flex-grow relative z-10 flex flex-col max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-secondary tracking-tight">System Developer Documentation</h1>
        <p className="text-xs text-slate-500 mt-0.5">Technical specifications, API catalogs, Prisma schemas, and directory structure guidelines.</p>
      </div>

      <div className="space-y-6">
        
        {/* Directory Structure */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-primary" />
            1. System Folder Architecture
          </h2>
          <pre className="bg-slate-900 text-slate-200 rounded-xl p-5 text-[11px] font-mono leading-relaxed overflow-x-auto select-all">
{`d:/AnveshakHub
├── prisma/
│   └── schema.prisma                 # Core Prisma Database Schema definition
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Collapsible Sidebar & Header wrapper shell
│   │   │   ├── dashboard/            # ADM-001 Executive Control Center
│   │   │   ├── crm/                  # ADM-002 Drag & Drop CRM Pipeline
│   │   │   ├── verification/         # Compliance Audit Queue
│   │   │   └── docs/                 # Developer Documentation Dashboard [This Page]
│   │   └── api/
│   │       └── admin/
│   │           ├── dashboard/        # REST API for system telemetry
│   │           ├── crm/              # REST API for lead stage updates
│   │           └── verify/           # REST API for audits and verifications
│   └── components/
│       ├── navigation.tsx            # Global landing header
│       └── footer.tsx                # Reusable system footer`}
          </pre>
        </section>

        {/* REST API Catalogue */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className="h-4.5 w-4.5 text-primary" />
            2. REST API Documentation (Swagger Ready)
          </h2>
          <div className="space-y-4">
            {[
              {
                method: "GET",
                url: "/api/admin/dashboard",
                desc: "Fetches system stats, health matrix, recent timeline logs, and active today meetings.",
                curl: "curl -X GET http://localhost:3000/api/admin/dashboard -H 'Authorization: Bearer <TOKEN>'"
              },
              {
                method: "POST",
                url: "/api/admin/crm",
                desc: "Performs pipeline drag-and-drop state adjustments, task priority updates, or creates new leads.",
                curl: "curl -X POST http://localhost:3000/api/admin/crm -H 'Content-Type: application/json' -d '{\n  \"action\": \"UPDATE_LEAD_STAGE\",\n  \"leadId\": \"lead-1\",\n  \"newStage\": \"PROPOSAL_SHARED\"\n}'"
              },
              {
                method: "POST",
                url: "/api/admin/verify",
                desc: "Approves or rejects a pending organization profile in the compliance verification registry queue.",
                curl: "curl -X POST http://localhost:3000/api/admin/verify -H 'Content-Type: application/json' -d '{\n  \"action\": \"APPROVE\",\n  \"id\": \"v-1\"\n}'"
              }
            ].map(api => (
              <div key={api.url} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className={[
                    "text-[9px] font-black px-2 py-0.5 rounded border leading-none shrink-0",
                    api.method === "GET" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-primary border-blue-200"
                  ].join(" ")}>{api.method}</span>
                  <code className="text-xs font-mono font-bold text-slate-800">{api.url}</code>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{api.desc}</p>
                <pre className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono leading-relaxed overflow-x-auto select-all">
                  {api.curl}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Access Management */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            3. Security, RBAC & Data Integrity Architecture
          </h2>
          <ul className="space-y-3 text-xs text-slate-650 leading-relaxed">
            <li>
              <span className="font-extrabold text-slate-850">Role-Based Access Control (RBAC):</span> Security guards assess active roles (`SUPER_ADMIN`, `CRM_SPECIALIST`, `STAKEHOLDER`) prior to mapping UI render states, preventing unauthorized users from accessing sensitive pipelines.
            </li>
            <li>
              <span className="font-extrabold text-slate-850">Cross-Site Scripting (XSS) & Injections Protection:</span> Input values entered in lead creation or appeals are fully sanitized. Password compliance enforces 12 characters, uppercase, and special chars via frontend strength rules.
            </li>
            <li>
              <span className="font-extrabold text-slate-850">Immutable Audit Trails:</span> Approval operations write logs containing timestamp, IP addresses, and auditor credentials, ensuring full traceability.
            </li>
          </ul>
        </section>

        {/* Testing Guide */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Code className="h-4.5 w-4.5 text-primary" />
            4. Testing Suite Guide
          </h2>
          <p className="text-xs text-slate-500 mb-3.5">Verify compilation and pipeline state logic using the following terminal command protocols:</p>
          <pre className="bg-slate-900 text-slate-200 rounded-xl p-4 text-[10px] font-mono leading-relaxed overflow-x-auto select-all">
{`# 1. Run codebase TypeScript verification
npx tsc --noEmit

# 2. Run static application build checklist
npm run build`}
          </pre>
        </section>

      </div>
    </div>
  );
}
