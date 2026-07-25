import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './common/config/env.config';
import { PrismaModule } from './database/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OpenSearchModule } from './search/opensearch.module';
import { QueueModule } from './queue/queue.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    HealthModule,
    OpenSearchModule,
    QueueModule,
    WebsocketModule,
  ],
})
export class AppModule {}
