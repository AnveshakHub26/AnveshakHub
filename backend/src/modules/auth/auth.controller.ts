import { Controller, Post, Get, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out active user session' })
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getProfile(user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset password for authenticated user' })
  async resetPassword(@CurrentUser() user: any, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(user.id, dto);
  }
}
