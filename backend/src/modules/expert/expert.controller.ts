import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ExpertService } from './expert.service';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Expert Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Get('dashboard')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Get Expert Dashboard metrics' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.expertService.getDashboardStats(userId);
  }

  @Get('profile')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Get Expert Profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.expertService.getProfile(userId);
  }

  @Patch('profile')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Update Expert Skills, Bio, & Portfolio' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateExpertDto) {
    return this.expertService.updateProfile(userId, dto);
  }

  @Post('resume')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Upload Expert Resume to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@CurrentUser('id') userId: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Resume document file is required');
    return this.expertService.uploadResume(userId, file.buffer, file.mimetype);
  }

  @Patch('availability')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Update Availability Status' })
  async updateAvailability(@CurrentUser('id') userId: string, @Body('isAvailable') isAvailable: boolean) {
    return this.expertService.updateAvailability(userId, isAvailable);
  }

  @Get('verification-status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Get Expert Approval Verification Status' })
  async getVerificationStatus(@CurrentUser('id') userId: string) {
    return this.expertService.getVerificationStatus(userId);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List all Expert profiles (Admin only)' })
  async getExperts() {
    return this.expertService.getExperts();
  }
}
