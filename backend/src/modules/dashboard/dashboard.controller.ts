import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard APIs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get Executive Admin Dashboard KPIs, Activity & Pending Verifications' })
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('industry')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
  @ApiOperation({ summary: 'Get Industry Dashboard KPIs, Projects & Meetings' })
  async getIndustryDashboard(@CurrentUser('id') userId: string) {
    return this.dashboardService.getIndustryDashboard(userId);
  }

  @Get('expert')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Get Expert Dashboard KPIs, Consultations & Availability' })
  async getExpertDashboard(@CurrentUser('id') userId: string) {
    return this.dashboardService.getExpertDashboard(userId);
  }

  @Get('student')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get Student Dashboard KPIs, Applications & Tasks' })
  async getStudentDashboard(@CurrentUser('id') userId: string) {
    return this.dashboardService.getStudentDashboard(userId);
  }
}
