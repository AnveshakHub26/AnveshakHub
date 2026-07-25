import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  // Asynchronous non-blocking audit logging
  logActionAsync(data: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    details?: any;
    ip?: string;
    userAgent?: string;
  }): void {
    setImmediate(async () => {
      try {
        await this.prisma.auditLog.create({
          data: {
            userId: data.userId || null,
            action: data.action,
            entity: data.entity || 'SYSTEM',
            entityId: data.entityId || null,
            details: data.details ? JSON.stringify(data.details) : null,
            ipAddress: data.ip || '127.0.0.1',
            userAgent: data.userAgent || 'AnveshakHub Enterprise Agent',
          },
        });
      } catch (e) {
        this.logger.error(`[Audit Log Async Failure] ${(e as Error).message}`);
      }
    });
  }

  async logAction(data: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    details?: any;
    ip?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        entity: data.entity || 'SYSTEM',
        entityId: data.entityId || null,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ip || '127.0.0.1',
        userAgent: data.userAgent || 'AnveshakHub Enterprise Agent',
      },
    });
  }

  async getLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, name: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      status: 'success',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      logs,
    };
  }
}
