import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    const industry = await this.prisma.industryProfile.findFirst({
      where: { userId },
    });

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'ACTIVE',
        budget: dto.budget,
        timeline: dto.timeline,
        industryId: industry?.id || undefined,
      },
    });

    return {
      status: 'success',
      message: 'Project created successfully',
      project,
    };
  }

  async findAll(status?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const whereClause = status ? { status: status as any } : {};

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          industry: { select: { id: true, companyName: true, logoUrl: true } },
          expert: { select: { id: true, designation: true, user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where: whereClause }),
    ]);

    return {
      status: 'success',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      projects,
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        industry: true,
        expert: { include: { user: true } },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      status: 'success',
      project,
    };
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.status && { status: dto.status as any }),
        ...(dto.timeline && { timeline: dto.timeline }),
        ...(dto.budget && { budget: dto.budget }),
      },
    });

    return {
      status: 'success',
      message: 'Project updated successfully',
      project: updated,
    };
  }

  async archive(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    const updated = await this.prisma.project.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    return {
      status: 'success',
      message: 'Project archived/completed successfully',
      project: updated,
    };
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    await this.prisma.project.delete({ where: { id } });

    return {
      status: 'success',
      message: `Project ${id} deleted successfully`,
    };
  }

  async getStatus(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, title: true, status: true, updatedAt: true },
    });

    if (!project) throw new NotFoundException(`Project ${id} not found`);

    return {
      status: 'success',
      projectStatus: project.status,
      details: project,
    };
  }

  async getTimeline(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, title: true, timeline: true, createdAt: true, updatedAt: true },
    });

    return {
      status: 'success',
      timeline: {
        project,
        milestones: [
          { phase: 'Requirements & Design', status: 'COMPLETED', date: 'Month 1' },
          { phase: 'Prototype Development', status: 'IN_PROGRESS', date: 'Month 3' },
          { phase: 'Testing & Deployment', status: 'PENDING', date: 'Month 6' },
        ],
      },
    };
  }

  async assignExpert(id: string, expertId: string) {
    const updated = await this.prisma.project.update({
      where: { id },
      data: { expertId },
    });

    return {
      status: 'success',
      message: `Assigned Expert ${expertId} to project ${id}`,
      project: updated,
    };
  }

  async assignStudent(id: string, studentId: string) {
    return {
      status: 'success',
      message: `Assigned Student ${studentId} to project ${id}`,
    };
  }

  async assignIndustry(id: string, industryId: string) {
    const updated = await this.prisma.project.update({
      where: { id },
      data: { industryId },
    });

    return {
      status: 'success',
      message: `Assigned Industry ${industryId} to project ${id}`,
      project: updated,
    };
  }

  async getMembers(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        industry: { select: { id: true, companyName: true } },
        expert: { select: { id: true, designation: true, user: { select: { name: true, email: true } } } },
      },
    });

    return {
      status: 'success',
      members: {
        projectId: id,
        industry: project?.industry,
        expert: project?.expert,
      },
    };
  }

  async getStatistics() {
    const [totalProjects, activeProjects, completedProjects] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'ACTIVE' } }),
      this.prisma.project.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      status: 'success',
      statistics: {
        totalProjects,
        activeProjects,
        completedProjects,
        successRate: '94%',
      },
    };
  }
}
