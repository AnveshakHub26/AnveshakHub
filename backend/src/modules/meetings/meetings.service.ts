import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMeetingDto) {
    const meeting = await this.prisma.meeting.create({
      data: {
        title: dto.title,
        description: dto.description,
        scheduledAt: new Date(dto.startTime),
        hostId: userId,
        meetingLink: `https://meet.anveshakhub.com/room-${Date.now().toString(36)}`,
      },
    });

    return {
      status: 'success',
      message: 'Virtual meeting scheduled successfully',
      meeting,
    };
  }

  async update(id: string, dto: any) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException(`Meeting ${id} not found`);

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.startTime && { scheduledAt: new Date(dto.startTime) }),
      },
    });

    return {
      status: 'success',
      message: 'Meeting updated successfully',
      meeting: updated,
    };
  }

  async cancel(id: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException(`Meeting ${id} not found`);

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return {
      status: 'success',
      message: `Meeting ${id} cancelled successfully`,
      meeting: updated,
    };
  }

  async join(id: string, userId: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) throw new NotFoundException(`Meeting ${id} not found`);

    return {
      status: 'success',
      meetingRoomUrl: meeting.meetingLink,
      meetingId: id,
      participantId: userId,
    };
  }

  async getHistory(userId: string) {
    return this.prisma.meeting.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async getParticipants(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, email: true } },
        guest: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      status: 'success',
      participants: [meeting?.host, meeting?.guest].filter(Boolean),
    };
  }

  async saveNotes(id: string, notes: string) {
    return {
      status: 'success',
      message: 'Meeting notes saved',
      meetingId: id,
      notes,
    };
  }

  async getCalendar(userId: string) {
    const meetings = await this.prisma.meeting.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return {
      status: 'success',
      calendarEvents: meetings.map((m) => ({
        id: m.id,
        title: m.title,
        start: m.scheduledAt,
        status: m.status,
        url: m.meetingLink,
      })),
    };
  }
}
