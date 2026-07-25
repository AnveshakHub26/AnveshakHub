import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalIndustries, totalExperts, totalStudents, activeProjects] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.industryProfile.count(),
      this.prisma.expertProfile.count(),
      this.prisma.studentProfile.count(),
      this.prisma.project.count(),
    ]);

    return {
      status: 'success',
      metrics: {
        totalUsers,
        totalIndustries,
        totalExperts,
        totalStudents,
        activeProjects,
      },
    };
  }
}
