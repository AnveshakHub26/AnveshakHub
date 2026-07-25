import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchRepository } from './repositories/search.repository';
import { IndexingService } from './services/indexing.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchRepository, IndexingService],
  exports: [SearchService, SearchRepository, IndexingService],
})
export class SearchModule {}
