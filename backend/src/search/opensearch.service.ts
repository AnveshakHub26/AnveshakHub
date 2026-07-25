import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class OpenSearchService implements OnModuleInit {
  private client: Client;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const node = this.configService.get<string>('opensearchNode') || 'http://localhost:9200';
    this.client = new Client({ node });
  }

  getClient(): Client {
    return this.client;
  }
}
