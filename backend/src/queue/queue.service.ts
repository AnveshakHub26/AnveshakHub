import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private notificationQueue: Queue;
  private emailQueue: Queue;
  private documentQueue: Queue;
  private activityQueue: Queue;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 3000);
        this.logger.warn(`[Redis] Reconnecting attempt ${times}... retrying in ${delay}ms`);
        return delay;
      },
    };

    const defaultJobOptions = {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: false, // Job persistence on restart
      removeOnFail: false,
    };

    try {
      this.notificationQueue = new Queue('notification-queue', { connection, defaultJobOptions });
      this.emailQueue = new Queue('email-queue', { connection, defaultJobOptions });
      this.documentQueue = new Queue('document-queue', { connection, defaultJobOptions });
      this.activityQueue = new Queue('activity-queue', { connection, defaultJobOptions });
      this.logger.log('✓ BullMQ Queues initialized with auto-reconnect & job persistence');
    } catch (e) {
      this.logger.warn('BullMQ initialized with offline fallback queue mode');
    }
  }

  async addNotificationJob(name: string, data: any) {
    if (this.notificationQueue) {
      return this.notificationQueue.add(name, data);
    }
  }

  async addEmailJob(name: string, data: any) {
    if (this.emailQueue) {
      return this.emailQueue.add(name, data);
    }
  }

  async addDocumentJob(name: string, data: any) {
    if (this.documentQueue) {
      return this.documentQueue.add(name, data);
    }
  }

  async addActivityJob(name: string, data: any) {
    if (this.activityQueue) {
      return this.activityQueue.add(name, data);
    }
  }
}
