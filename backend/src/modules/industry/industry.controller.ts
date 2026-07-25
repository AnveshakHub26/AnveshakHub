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
import { IndustryService } from './industry.service';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Industry Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
@Controller('api/v1/industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Industry Dashboard metrics' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.industryService.getDashboardStats(userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get Industry Company Profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.industryService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update Company Details' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateIndustryDto) {
    return this.industryService.updateProfile(userId, dto);
  }

  @Post('logo')
  @ApiOperation({ summary: 'Upload Company Logo to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@CurrentUser('id') userId: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Logo image file is required');
    return this.industryService.uploadLogo(userId, file.buffer, file.mimetype);
  }

  @Get('verification-status')
  @ApiOperation({ summary: 'Get Industry Verification Status' })
  async getVerificationStatus(@CurrentUser('id') userId: string) {
    return this.industryService.getVerificationStatus(userId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get Industry Performance Analytics' })
  async getAnalytics(@CurrentUser('id') userId: string) {
    return this.industryService.getAnalytics(userId);
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get Assigned Industry Projects' })
  async getAssignedProjects(@CurrentUser('id') userId: string) {
    return this.industryService.getAssignedProjects(userId);
  }
}
