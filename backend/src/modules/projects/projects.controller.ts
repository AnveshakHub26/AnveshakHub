import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Projects Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
  @ApiOperation({ summary: 'Create a new R&D project' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List R&D projects with status filtering & pagination' })
  @ApiQuery({ name: 'status', required: false, example: 'ACTIVE' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.projectsService.findAll(status, Number(page), Number(limit));
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get overall Project Statistics' })
  async getStatistics() {
    return this.projectsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details by ID' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT')
  @ApiOperation({ summary: 'Update project parameters & status' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Post(':id/archive')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
  @ApiOperation({ summary: 'Archive/Complete a project' })
  async archive(@Param('id') id: string) {
    return this.projectsService.archive(id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete a project (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get project execution status' })
  async getStatus(@Param('id') id: string) {
    return this.projectsService.getStatus(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get project milestone timeline' })
  async getTimeline(@Param('id') id: string) {
    return this.projectsService.getTimeline(id);
  }

  @Post(':id/assign-expert/:expertId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
  @ApiOperation({ summary: 'Assign Domain Expert to project' })
  async assignExpert(@Param('id') id: string, @Param('expertId') expertId: string) {
    return this.projectsService.assignExpert(id, expertId);
  }

  @Post(':id/assign-student/:studentId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Assign Student Research Assistant to project' })
  async assignStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.projectsService.assignStudent(id, studentId);
  }

  @Post(':id/assign-industry/:industryId')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Assign Industry sponsor to project' })
  async assignIndustry(@Param('id') id: string, @Param('industryId') industryId: string) {
    return this.projectsService.assignIndustry(id, industryId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get assigned project members & stakeholders' })
  async getMembers(@Param('id') id: string) {
    return this.projectsService.getMembers(id);
  }
}
