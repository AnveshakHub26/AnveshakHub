import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSettingsDto } from './dto/user-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private supabaseService: SupabaseService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User profile with ID ${userId} not found`);
    }

    return {
      status: 'success',
      user,
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updated = await this.userRepository.update(userId, {
      ...(dto.name && { name: dto.name }),
      ...(dto.phone && { phone: dto.phone }),
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

    const updated = await this.userRepository.update(userId, { avatarUrl: publicUrl });

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
    const user = await this.userRepository.findById(userId);
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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userRepository.update(userId, {
      name: `[Deactivated User ${userId.slice(0, 6)}]`,
    });

    return {
      status: 'success',
      message: 'Account soft-deleted successfully',
    };
  }

  async findAll() {
    return this.userRepository.findMany();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
