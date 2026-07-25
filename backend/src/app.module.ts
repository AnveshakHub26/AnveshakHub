import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './common/config/env.config';
import { PrismaModule } from './database/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { IndustryModule } from './modules/industry/industry.module';
import { ExpertModule } from './modules/expert/expert.module';
import { StudentModule } from './modules/student/student.module';
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
    UsersModule,
    AdminModule,
    IndustryModule,
    ExpertModule,
    StudentModule,
    HealthModule,
    OpenSearchModule,
    QueueModule,
    WebsocketModule,
  ],
})
export class AppModule {}
