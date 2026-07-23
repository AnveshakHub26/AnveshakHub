-- ─────────────────────────────────────────────────────────────────
-- ANVESHAKHUB SUPABASE ROW-LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────

-- 1. Enable RLS on core PostgreSQL tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IndustryProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProblemStatement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentVault" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. User Policies
CREATE POLICY "Users can read own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = "supabaseId");

CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (auth.uid()::text = "supabaseId");

-- 3. Notification Policies
CREATE POLICY "Users can read own notifications" ON "Notification"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- 4. Audit Log Policies (Read-only for Service Role / Compliance Admins)
CREATE POLICY "Audit logs read by admins" ON "AuditLog"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "supabaseId" = auth.uid()::text 
      AND role IN ('SUPER_ADMIN', 'COMPLIANCE_OFFICER')
    )
  );
