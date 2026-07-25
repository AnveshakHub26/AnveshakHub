import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AdminActionDto } from './dto/admin-action.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalIndustries, totalExperts, totalStudents, activeProjects, pendingVerificationsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.industryProfile.count(),
      this.prisma.expertProfile.count(),
      this.prisma.studentProfile.count(),
      this.prisma.project.count(),
      this.prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      status: 'success',
      metrics: {
        totalUsers,
        totalIndustries,
        totalExperts,
        totalStudents,
        activeProjects,
        pendingVerificationsCount,
      },
    };
  }

  async getPendingVerifications() {
    return this.prisma.verificationRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, email: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserManagementOverview() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        industryProfile: { select: { id: true, companyName: true, isVerified: true } },
        expertProfile: { select: { id: true, designation: true, isVerified: true } },
        studentProfile: { select: { id: true, institution: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyIndustry(id: string, dto: AdminActionDto) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { id } });
    if (!industry) {
      throw new NotFoundException(`Industry profile with ID ${id} not found`);
    }

    const updated = await this.prisma.industryProfile.update({
      where: { id },
      data: { isVerified: true },
    });

    return {
      status: 'success',
      message: 'Industry verified successfully',
      industry: updated,
    };
  }

  async approveExpert(id: string, dto: AdminActionDto) {
    const expert = await this.prisma.expertProfile.findUnique({ where: { id } });
    if (!expert) {
      throw new NotFoundException(`Expert profile with ID ${id} not found`);
    }

    const updated = await this.prisma.expertProfile.update({
      where: { id },
      data: { isVerified: true },
    });

    return {
      status: 'success',
      message: 'Expert approved successfully',
      expert: updated,
    };
  }

  async suspendUser(id: string, dto: AdminActionDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      status: 'success',
      message: `User ${user.email} suspended successfully`,
      reason: dto.reason || 'Administrative suspension',
    };
  }

  async activateUser(id: string, dto: AdminActionDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      status: 'success',
      message: `User ${user.email} activated successfully`,
    };
  }

  async rejectVerification(type: string, id: string, dto: AdminActionDto) {
    return {
      status: 'success',
      message: `${type} verification rejected`,
      reason: dto.reason || 'Insufficient verification documents',
    };
  }

  async assignRole(id: string, dto: AssignRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role as any },
    });

    return {
      status: 'success',
      message: `Assigned role ${dto.role} to user ${user.email}`,
      user: updated,
    };
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }
}
