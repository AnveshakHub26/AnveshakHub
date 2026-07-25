import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async getDashboardStats(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    return {
      status: 'success',
      dashboard: {
        profile,
        activeApplicationsCount: 2,
        internshipStatus: 'ACTIVE_SEARCH',
        profileCompletionScore: '85%',
      },
    };
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Student profile for user ${userId} not found`);
    }

    return {
      status: 'success',
      profile,
    };
  }

  async updateProfile(userId: string, dto: UpdateStudentDto) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Student profile for user ${userId} not found`);
    }

    const updated = await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        ...(dto.institution && { institution: dto.institution }),
        ...(dto.degree && { degree: dto.degree }),
        ...(dto.graduationYear && { graduationYear: dto.graduationYear }),
        ...(dto.skills && { skills: JSON.stringify(dto.skills) }),
      },
    });

    return {
      status: 'success',
      message: 'Student profile updated successfully',
      profile: updated,
    };
  }

  async uploadResume(userId: string, fileBuffer: Buffer, mimeType: string) {
    const path = `resumes/student-${userId}-${Date.now()}.${mimeType.split('/')[1] || 'pdf'}`;
    const resumeUrl = await this.supabaseService.uploadFile('resumes', path, fileBuffer, mimeType);

    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (profile) {
      await this.prisma.studentProfile.update({
        where: { userId },
        data: { resumeUrl },
      });
    }

    return {
      status: 'success',
      resumeUrl,
    };
  }

  async getInternshipStatus(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { institution: true, degree: true, createdAt: true },
    });

    return {
      status: 'success',
      internshipStatus: 'ACTIVE_SEARCH',
      applicationsSubmitted: 3,
      interviewsScheduled: 1,
      details: profile,
    };
  }

  async getProfileCompletion(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    let score = 40;

    if (profile?.institution) score += 20;
    if (profile?.degree) score += 20;
    if (profile?.resumeUrl) score += 20;

    return {
      status: 'success',
      profileCompletionScore: `${score}%`,
      breakdown: {
        basicInfo: 40,
        education: profile?.institution ? 20 : 0,
        degree: profile?.degree ? 20 : 0,
        resumeUploaded: profile?.resumeUrl ? 20 : 0,
      },
    };
  }

  async getStudents() {
    return this.prisma.studentProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
