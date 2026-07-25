import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IndustryService } from './industry.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Industry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Get('problem-statements')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INDUSTRY')
  @ApiOperation({ summary: 'Get list of industry problem statements' })
  async getProblemStatements() {
    return this.industryService.getProblemStatements();
  }
}
