import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Student')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT', 'STUDENT')
  @ApiOperation({ summary: 'Get list of student profiles' })
  async getStudents() {
    return this.studentService.getStudents();
  }
}
