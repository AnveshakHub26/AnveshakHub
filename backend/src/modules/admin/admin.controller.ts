import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminActionDto } from './dto/admin-action.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Executive Platform Dashboard Statistics' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('verifications/pending')
  @ApiOperation({ summary: 'Get list of pending verification requests' })
  async getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user management overview' })
  async getUserManagementOverview() {
    return this.adminService.getUserManagementOverview();
  }

  @Post('verify/industry/:id')
  @ApiOperation({ summary: 'Verify/Approve Industry Profile' })
  async verifyIndustry(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.adminService.verifyIndustry(id, dto);
  }

  @Post('verify/expert/:id')
  @ApiOperation({ summary: 'Approve Expert Profile' })
  async approveExpert(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.adminService.approveExpert(id, dto);
  }

  @Post('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend User Account' })
  async suspendUser(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.adminService.suspendUser(id, dto);
  }

  @Post('users/:id/activate')
  @ApiOperation({ summary: 'Activate User Account' })
  async activateUser(@Param('id') id: string, @Body() dto: AdminActionDto) {
    return this.adminService.activateUser(id, dto);
  }

  @Post('verify/:type/:id/reject')
  @ApiOperation({ summary: 'Reject Verification Request' })
  async rejectVerification(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() dto: AdminActionDto,
  ) {
    return this.adminService.rejectVerification(type, id, dto);
  }

  @Patch('users/:id/roles')
  @ApiOperation({ summary: 'Assign Role to User' })
  async assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.adminService.assignRole(id, dto);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'View System Audit Logs' })
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
