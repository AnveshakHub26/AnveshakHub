import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpenSearchService } from '../../search/opensearch.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private openSearchService: OpenSearchService,
  ) {}

  async globalSearch(dto: SearchQueryDto) {
    const query = dto.q || '';
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, experts, industries, students, meetings] = await Promise.all([
      this.prisma.project.findMany({
        where: query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
        skip,
        select: { id: true, title: true, description: true, status: true, budget: true },
      }),
      this.prisma.expertProfile.findMany({
        where: query
          ? {
              OR: [
                { designation: { contains: query, mode: 'insensitive' } },
                { bio: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
        skip,
        include: { user: { select: { name: true, email: true } } },
      }),
      this.prisma.industryProfile.findMany({
        where: query
          ? {
              OR: [
                { companyName: { contains: query, mode: 'insensitive' } },
                { industryType: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
        skip,
        select: { id: true, companyName: true, industryType: true, isVerified: true, logoUrl: true },
      }),
      this.prisma.studentProfile.findMany({
        where: query
          ? {
              OR: [
                { institution: { contains: query, mode: 'insensitive' } },
                { degree: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
        skip,
        include: { user: { select: { name: true, email: true } } },
      }),
      this.prisma.meeting.findMany({
        where: query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        take: limit,
        skip,
        select: { id: true, title: true, scheduledAt: true, meetingLink: true },
      }),
    ]);

    const totalResults = projects.length + experts.length + industries.length + students.length + meetings.length;

    return {
      status: 'success',
      query,
      pagination: {
        page,
        limit,
        totalResults,
      },
      results: {
        projects,
        experts,
        industries,
        students,
        meetings,
      },
    };
  }
}
