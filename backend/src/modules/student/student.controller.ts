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
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Student Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get Student Dashboard metrics' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.studentService.getDashboardStats(userId);
  }

  @Get('profile')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get Student Profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.studentService.getProfile(userId);
  }

  @Patch('profile')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Update Education, Skills, & Portfolio' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.updateProfile(userId, dto);
  }

  @Post('resume')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Upload Student Resume to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@CurrentUser('id') userId: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Resume PDF file is required');
    return this.studentService.uploadResume(userId, file.buffer, file.mimetype);
  }

  @Get('internship-status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get Student Internship Application Status' })
  async getInternshipStatus(@CurrentUser('id') userId: string) {
    return this.studentService.getInternshipStatus(userId);
  }

  @Get('completion')
  @Roles('SUPER_ADMIN', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get Student Profile Completion Score' })
  async getProfileCompletion(@CurrentUser('id') userId: string) {
    return this.studentService.getProfileCompletion(userId);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List all Student profiles (Admin only)' })
  async getStudents() {
    return this.studentService.getStudents();
  }
}
