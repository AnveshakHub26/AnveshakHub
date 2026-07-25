import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class IndustryService {
  constructor(private prisma: PrismaService) {}

  async getProblemStatements() {
    return this.prisma.problemStatement.findMany({
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
