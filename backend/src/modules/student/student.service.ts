import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getStudents() {
    return this.prisma.studentProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
