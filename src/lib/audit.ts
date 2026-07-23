import { prisma } from "./prisma";

export interface LogAuditOptions {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
  Log compliance & security action into Supabase PostgreSQL.
 */
export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
  userAgent,
}: LogAuditOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        details: details || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error: any) {
    console.error("Audit Logging Error:", error.message);
  }
}
