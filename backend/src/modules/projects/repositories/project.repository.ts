import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.project.create({ data });
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        industry: true,
        expert: { include: { user: true } },
      },
    });
  }

  async findMany(where: any, skip: number, take: number) {
    return this.prisma.project.findMany({
      where,
      skip,
      take,
      include: {
        industry: { select: { id: true, companyName: true, logoUrl: true } },
        expert: { select: { id: true, designation: true, user: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where: any) {
    return this.prisma.project.count({ where });
  }

  async update(id: string, data: any) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
