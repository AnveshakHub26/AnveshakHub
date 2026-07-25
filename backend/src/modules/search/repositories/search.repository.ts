import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SearchRepository {
  constructor(private prisma: PrismaService) {}

  async searchProjects(query: string, skip: number, take: number) {
    return this.prisma.project.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
    });
  }

  async searchExperts(query: string, skip: number, take: number) {
    return this.prisma.expertProfile.findMany({
      where: query
        ? {
            OR: [
              { designation: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async searchIndustries(query: string, skip: number, take: number) {
    return this.prisma.industryProfile.findMany({
      where: query
        ? {
            OR: [
              { companyName: { contains: query, mode: 'insensitive' } },
              { industryType: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
    });
  }

  async searchStudents(query: string, skip: number, take: number) {
    return this.prisma.studentProfile.findMany({
      where: query
        ? {
            OR: [
              { institution: { contains: query, mode: 'insensitive' } },
              { degree: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
      include: { user: { select: { name: true, email: true } } },
    });
  }
}
