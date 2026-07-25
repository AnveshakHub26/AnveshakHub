import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private defaultQueue: Queue;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('redisUrl') || 'redis://localhost:6379';
    try {
      this.defaultQueue = new Queue('anveshakhub-tasks', {
        connection: { host: 'localhost', port: 6379 },
      });
    } catch (e) {
      console.warn('BullMQ Queue connection initialized with fallback settings');
    }
  }

  async addJob(name: string, data: any) {
    if (this.defaultQueue) {
      return this.defaultQueue.add(name, data);
    }
  }
}
