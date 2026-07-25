import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Search Engine & OpenSearch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global full-text search across Projects, Experts, Industries, Students, Meetings' })
  async globalSearch(@Query() dto: SearchQueryDto) {
    return this.searchService.globalSearch(dto);
  }
}
