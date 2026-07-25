import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        industryProfile: true,
        expertProfile: true,
        studentProfile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findMany() {
    return this.prisma.user.findMany({
      include: {
        industryProfile: { select: { companyName: true } },
        expertProfile: { select: { designation: true } },
        studentProfile: { select: { institution: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
