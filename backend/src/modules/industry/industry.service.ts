import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustryService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async getDashboardStats(userId: string) {
    const profile = await this.prisma.industryProfile.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            problemStatements: true,
            projects: true,
          },
        },
      },
    });

    return {
      status: 'success',
      dashboard: {
        profile,
        activeProjectsCount: profile?._count.projects || 0,
        publishedProblemStatementsCount: profile?._count.problemStatements || 0,
        verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING_VERIFICATION',
      },
    };
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.industryProfile.findUnique({
      where: { userId },
      include: {
        organization: true,
        problemStatements: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Industry profile for user ${userId} not found`);
    }

    return {
      status: 'success',
      profile,
    };
  }

  async updateProfile(userId: string, dto: UpdateIndustryDto) {
    const profile = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Industry profile for user ${userId} not found`);
    }

    const updated = await this.prisma.industryProfile.update({
      where: { userId },
      data: {
        ...(dto.companyName && { companyName: dto.companyName }),
        ...(dto.industryType && { industryType: dto.industryType }),
        ...(dto.website && { website: dto.website }),
      },
    });

    return {
      status: 'success',
      message: 'Industry profile updated successfully',
      profile: updated,
    };
  }

  async uploadLogo(userId: string, fileBuffer: Buffer, mimeType: string) {
    const path = `logos/${userId}-${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
    const logoUrl = await this.supabaseService.uploadFile('company-logos', path, fileBuffer, mimeType);

    const profile = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (profile) {
      await this.prisma.industryProfile.update({
        where: { userId },
        data: { logoUrl },
      });
    }

    return {
      status: 'success',
      logoUrl,
    };
  }

  async getVerificationStatus(userId: string) {
    const profile = await this.prisma.industryProfile.findUnique({
      where: { userId },
      select: { isVerified: true, companyName: true, createdAt: true },
    });

    return {
      status: 'success',
      isVerified: profile?.isVerified || false,
      verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING',
      details: profile,
    };
  }

  async getAnalytics(userId: string) {
    return {
      status: 'success',
      analytics: {
        views: 1240,
        proposalRequests: 18,
        activeProjects: 4,
        completionRate: '96%',
      },
    };
  }

  async getAssignedProjects(userId: string) {
    const profile = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    return this.prisma.project.findMany({
      where: { industryId: profile.id },
      include: {
        expert: { select: { id: true, designation: true } },
      },
    });
  }
}
