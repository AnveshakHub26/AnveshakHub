import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { ApplyProjectDto } from './dto/apply-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Applications Pipeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('apply')
  @Roles('SUPER_ADMIN', 'EXPERT', 'STUDENT')
  @ApiOperation({ summary: 'Submit application to R&D project' })
  async apply(@CurrentUser('id') userId: string, @Body() dto: ApplyProjectDto) {
    return this.applicationsService.apply(userId, dto);
  }

  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw project application' })
  async withdraw(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.applicationsService.withdraw(id, userId);
  }

  @Post(':id/accept')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT')
  @ApiOperation({ summary: 'Accept applicant proposal' })
  async accept(@Param('id') id: string) {
    return this.applicationsService.accept(id);
  }

  @Post(':id/reject')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT')
  @ApiOperation({ summary: 'Reject applicant proposal' })
  async reject(@Param('id') id: string) {
    return this.applicationsService.reject(id);
  }

  @Post(':id/shortlist')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT')
  @ApiOperation({ summary: 'Shortlist candidate for project' })
  async shortlist(@Param('id') id: string) {
    return this.applicationsService.shortlist(id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'View all applicants for a specific project' })
  async viewApplicants(@Param('projectId') projectId: string) {
    return this.applicationsService.viewApplicants(projectId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get application processing status' })
  async getStatus(@Param('id') id: string) {
    return this.applicationsService.getStatus(id);
  }

  @Get('project/:projectId/pipeline')
  @ApiOperation({ summary: 'Get candidate review pipeline analytics' })
  async getCandidatePipeline(@Param('projectId') projectId: string) {
    return this.applicationsService.getCandidatePipeline(projectId);
  }
}
