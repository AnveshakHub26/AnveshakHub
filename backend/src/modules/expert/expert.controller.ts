import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpertService } from './expert.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Expert')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'EXPERT')
  @ApiOperation({ summary: 'Get list of expert profiles' })
  async getExperts() {
    return this.expertService.getExperts();
  }
}
