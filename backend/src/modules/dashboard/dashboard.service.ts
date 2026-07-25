import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const [usersCount, projectsCount, pendingVerifications, auditLogsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.auditLog.count(),
    ]);

    return {
      status: 'success',
      role: 'ADMIN',
      kpis: {
        totalUsers: usersCount,
        activeProjects: projectsCount,
        pendingVerifications,
        auditLogsCount,
      },
      recentActivity: [
        { type: 'USER_REGISTERED', email: 'expert@iisc.ac.in', timestamp: new Date().toISOString() },
        { type: 'PROJECT_CREATED', title: 'Edge AI Vision Model', timestamp: new Date().toISOString() },
      ],
      pendingTasks: [
        'Review 3 Expert Verification Requests',
        'Approve 2 Industry Organization Registrations',
      ],
    };
  }

  async getIndustryDashboard(userId: string) {
    const profile = await this.prisma.industryProfile.findUnique({ where: { userId } });

    return {
      status: 'success',
      role: 'INDUSTRY',
      kpis: {
        companyName: profile?.companyName || 'Industry Organization',
        publishedProblems: 4,
        activeRndProjects: 2,
        verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING_APPROVAL',
      },
      assignedProjects: [
        { id: 'proj_1', title: 'Predictive Machinery Maintenance', status: 'IN_PROGRESS' },
      ],
      upcomingMeetings: [
        { id: 'm_1', title: 'Architecture Review with Expert', time: 'Tomorrow 10:00 AM' },
      ],
    };
  }

  async getExpertDashboard(userId: string) {
    const profile = await this.prisma.expertProfile.findUnique({ where: { userId } });

    return {
      status: 'success',
      role: 'EXPERT',
      kpis: {
        designation: profile?.designation || 'Research Expert',
        assignedProjectsCount: 3,
        rating: 4.9,
        isAvailable: profile?.isAvailable ?? true,
        verificationStatus: profile?.isVerified ? 'VERIFIED' : 'PENDING_APPROVAL',
      },
      assignedProjects: [
        { id: 'proj_1', title: 'Predictive Machinery Maintenance', role: 'Lead Expert' },
      ],
      upcomingMeetings: [
        { id: 'm_1', title: 'Consultation with Industry Partner', time: 'Tomorrow 10:00 AM' },
      ],
    };
  }

  async getStudentDashboard(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });

    return {
      status: 'success',
      role: 'STUDENT',
      kpis: {
        institution: profile?.institution || 'Academic Institute',
        internshipStatus: 'ACTIVE_SEARCH',
        profileCompletion: '85%',
        applicationsCount: 3,
      },
      assignedProjects: [
        { id: 'proj_2', title: 'Computer Vision Anomaly Detection', role: 'Research Assistant' },
      ],
      pendingTasks: [
        'Complete Milestone 2 Progress Report',
      ],
    };
  }
}
