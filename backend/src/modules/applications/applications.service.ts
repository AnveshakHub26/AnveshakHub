import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ApplyProjectDto } from './dto/apply-project.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, dto: ApplyProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);

    return {
      status: 'success',
      message: 'Application submitted successfully',
      application: {
        id: `app_${Date.now()}`,
        projectId: dto.projectId,
        userId,
        coverLetter: dto.coverLetter,
        applicationStatus: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    };
  }

  async withdraw(id: string, userId: string) {
    return {
      status: 'success',
      message: `Application ${id} withdrawn successfully`,
    };
  }

  async accept(id: string) {
    return {
      status: 'success',
      message: `Application ${id} accepted`,
      applicationStatus: 'ACCEPTED',
    };
  }

  async reject(id: string) {
    return {
      status: 'success',
      message: `Application ${id} rejected`,
      applicationStatus: 'REJECTED',
    };
  }

  async shortlist(id: string) {
    return {
      status: 'success',
      message: `Candidate application ${id} shortlisted`,
      applicationStatus: 'SHORTLISTED',
    };
  }

  async viewApplicants(projectId: string) {
    return {
      status: 'success',
      projectId,
      applicants: [
        {
          id: 'app_1',
          name: 'Ananya Deshmukh',
          email: 'ananya@iitm.ac.in',
          role: 'STUDENT',
          status: 'SHORTLISTED',
        },
        {
          id: 'app_2',
          name: 'Dr. Ramesh Kumar',
          email: 'ramesh@expert.org',
          role: 'EXPERT',
          status: 'PENDING',
        },
      ],
    };
  }

  async getStatus(id: string) {
    return {
      status: 'success',
      applicationId: id,
      applicationStatus: 'SHORTLISTED',
    };
  }

  async getCandidatePipeline(projectId: string) {
    return {
      status: 'success',
      projectId,
      pipeline: {
        totalApplicants: 12,
        pendingReview: 5,
        shortlisted: 4,
        interviewScheduled: 2,
        accepted: 1,
      },
    };
  }
}
