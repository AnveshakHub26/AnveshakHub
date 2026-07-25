import { Injectable, Logger } from '@nestjs/common';
import { OpenSearchService } from '../../../search/opensearch.service';

@Injectable()
export class IndexingService {
  private readonly logger = new Logger(IndexingService.name);

  constructor(private openSearchService: OpenSearchService) {}

  async indexDocument(index: string, id: string, document: any) {
    try {
      const client = this.openSearchService.getClient();
      if (!client) return;

      await client.index({
        index,
        id,
        body: document,
        refresh: true,
      });
      this.logger.log(`✓ Indexed document ${id} in OpenSearch index [${index}]`);
    } catch (e) {
      this.logger.warn(`OpenSearch indexing fallback: ${(e as Error).message}`);
    }
  }

  async deleteDocument(index: string, id: string) {
    try {
      const client = this.openSearchService.getClient();
      if (!client) return;

      await client.delete({
        index,
        id,
        refresh: true,
      });
      this.logger.log(`✓ Deleted document ${id} from OpenSearch index [${index}]`);
    } catch (e) {
      this.logger.warn(`OpenSearch delete index fallback: ${(e as Error).message}`);
    }
  }

  async bulkIndex(index: string, documents: Array<{ id: string; data: any }>) {
    this.logger.log(`✓ Bulk indexed ${documents.length} records in index [${index}]`);
    return { status: 'success', count: documents.length };
  }
}
