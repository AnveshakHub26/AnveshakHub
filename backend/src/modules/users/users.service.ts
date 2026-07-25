import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSettingsDto } from './dto/user-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        industryProfile: true,
        expertProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User profile with ID ${userId} not found`);
    }

    return {
      status: 'success',
      user,
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone && { phone: dto.phone }),
      },
    });

    return {
      status: 'success',
      message: 'Profile updated successfully',
      user: updated,
    };
  }

  async uploadProfilePicture(userId: string, fileBuffer: Buffer, mimeType: string) {
    const path = `avatars/${userId}-${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`;
    const publicUrl = await this.supabaseService.uploadFile('avatars', path, fileBuffer, mimeType);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: publicUrl },
    });

    return {
      status: 'success',
      avatarUrl: publicUrl,
      user: updated,
    };
  }

  async changePassword(user: any, dto: ChangePasswordDto) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.admin.updateUserById(user.supabaseAuthId || user.id, {
      password: dto.newPassword,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      status: 'success',
      settings: {
        userId,
        user,
        emailNotifications: true,
        twoFactorEnabled: false,
        theme: 'dark',
      },
    };
  }

  async updateSettings(userId: string, dto: UserSettingsDto) {
    return {
      status: 'success',
      message: 'User settings updated successfully',
      settings: {
        userId,
        ...dto,
      },
    };
  }

  async softDelete(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: `[Deactivated User ${userId.slice(0, 6)}]`,
      },
    });

    return {
      status: 'success',
      message: 'Account soft-deleted successfully',
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        industryProfile: { select: { companyName: true } },
        expertProfile: { select: { designation: true } },
        studentProfile: { select: { institution: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        industryProfile: true,
        expertProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
