import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid email or password credentials');
    }

    // Sync user record in Supabase PostgreSQL via Prisma
    let dbUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!dbUser) {
      dbUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: data.user.user_metadata?.full_name || dto.email.split('@')[0],
          role: (data.user.user_metadata?.role as any) || 'SUPER_ADMIN',
        },
      });
    }

    return {
      status: 'success',
      message: 'Authentication successful',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        supabaseAuthId: data.user.id,
      },
    };
  }

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();
    const userRole = dto.role || 'STUDENT';

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        full_name: dto.fullName,
        role: userRole,
        organization: dto.organization,
      },
    });

    if (authError && !authError.message.includes('already registered')) {
      throw new BadRequestException(`Registration failed: ${authError.message}`);
    }

    // 2. Sync / Upsert User in Supabase PostgreSQL
    const dbUser = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: {
        name: dto.fullName,
        role: userRole as any,
      },
      create: {
        email: dto.email,
        name: dto.fullName,
        role: userRole as any,
      },
    });

    return {
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      },
    };
  }

  async logout(token: string) {
    const supabase = this.supabaseService.getClient();
    await supabase.auth.signOut();
    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: dto.refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid or expired refresh token');
    }

    return {
      status: 'success',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.resetPasswordForEmail(dto.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://anveshakhub.com'}/auth/reset-password`,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      status: 'success',
      message: 'Password reset email sent successfully',
    };
  }

  async resetPassword(userId: string, dto: ResetPasswordDto) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: dto.newPassword,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      status: 'success',
      message: 'Password updated successfully',
    };
  }

  async getProfile(user: any) {
    const dbUser = await this.prisma.user.findUnique({
      where: { email: user.email },
      include: {
        industryProfile: true,
        expertProfile: true,
        studentProfile: true,
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('User profile not found');
    }

    return {
      status: 'success',
      user: dbUser,
    };
  }
}
