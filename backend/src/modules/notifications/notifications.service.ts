import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: (dto.type as any) || 'SYSTEM',
        isRead: false,
      },
    });

    return {
      status: 'success',
      notification,
    };
  }

  async getUserNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
      status: 'success',
      unreadCount,
      notifications,
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) throw new NotFoundException(`Notification ${id} not found`);

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return {
      status: 'success',
      notification: updated,
    };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return {
      status: 'success',
      message: 'All notifications marked as read',
    };
  }

  async broadcast(title: string, message: string, role?: string) {
    const users = await this.prisma.user.findMany({
      where: role ? { role: role as any } : {},
      select: { id: true },
    });

    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        message,
        type: 'SYSTEM',
        isRead: false,
      })),
    });

    return {
      status: 'success',
      message: `Broadcasted notification to ${users.length} users`,
    };
  }
}
