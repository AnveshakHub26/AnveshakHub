import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  async getExperts() {
    return this.prisma.expertProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
