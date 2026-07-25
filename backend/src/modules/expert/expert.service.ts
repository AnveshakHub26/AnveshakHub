import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateExpertDto } from './dto/update-expert.dto';

@Injectable()
export class ExpertService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async getDashboardStats(userId: string) {
    const profile = await this.prisma.expertProfile.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    return {
      status: 'success',
      dashboard: {
        profile,
        activeConsultations: profile?._count.projects || 0,
        verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING_APPROVAL',
        rating: 4.9,
      },
    };
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.expertProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        category: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Expert profile for user ${userId} not found`);
    }

    return {
      status: 'success',
      profile,
    };
  }

  async updateProfile(userId: string, dto: UpdateExpertDto) {
    const profile = await this.prisma.expertProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Expert profile for user ${userId} not found`);
    }

    const updated = await this.prisma.expertProfile.update({
      where: { userId },
      data: {
        ...(dto.designation && { designation: dto.designation }),
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.skills && { skills: JSON.stringify(dto.skills) }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
      },
    });

    return {
      status: 'success',
      message: 'Expert profile updated successfully',
      profile: updated,
    };
  }

  async uploadResume(userId: string, fileBuffer: Buffer, mimeType: string) {
    const path = `resumes/expert-${userId}-${Date.now()}.${mimeType.split('/')[1] || 'pdf'}`;
    const resumeUrl = await this.supabaseService.uploadFile('resumes', path, fileBuffer, mimeType);

    return {
      status: 'success',
      resumeUrl,
    };
  }

  async updateAvailability(userId: string, isAvailable: boolean) {
    const profile = await this.prisma.expertProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Expert profile for user ${userId} not found`);
    }

    const updated = await this.prisma.expertProfile.update({
      where: { userId },
      data: { isAvailable },
    });

    return {
      status: 'success',
      message: `Expert availability set to ${isAvailable}`,
      profile: updated,
    };
  }

  async getVerificationStatus(userId: string) {
    const profile = await this.prisma.expertProfile.findUnique({
      where: { userId },
      select: { isVerified: true, designation: true, createdAt: true },
    });

    return {
      status: 'success',
      isVerified: profile?.isVerified || false,
      verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING_APPROVAL',
      details: profile,
    };
  }

  async getExperts() {
    return this.prisma.expertProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
