import { Injectable } from '@nestjs/common';
import { SearchRepository } from './repositories/search.repository';
import { IndexingService } from './services/indexing.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    private searchRepository: SearchRepository,
    private indexingService: IndexingService,
  ) {}

  async globalSearch(dto: SearchQueryDto) {
    const query = dto.q || '';
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, experts, industries, students] = await Promise.all([
      this.searchRepository.searchProjects(query, skip, limit),
      this.searchRepository.searchExperts(query, skip, limit),
      this.searchRepository.searchIndustries(query, skip, limit),
      this.searchRepository.searchStudents(query, skip, limit),
    ]);

    const totalResults = projects.length + experts.length + industries.length + students.length;

    return {
      status: 'success',
      query,
      pagination: {
        page,
        limit,
        totalResults,
      },
      results: {
        projects,
        experts,
        industries,
        students,
      },
    };
  }

  async indexItem(index: string, id: string, data: any) {
    return this.indexingService.indexDocument(index, id, data);
  }
}
