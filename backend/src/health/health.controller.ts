import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'System Health Check' })
  async checkHealth() {
    let dbStatus = 'healthy';
    let supabaseStatus = 'healthy';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = `unhealthy: ${e.message}`;
    }

    try {
      const client = this.supabaseService.getClient();
      if (!client) supabaseStatus = 'unconfigured';
    } catch (e) {
      supabaseStatus = `unhealthy: ${e.message}`;
    }

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'AnveshakHub Enterprise NestJS Backend',
      version: '1.0.0',
      components: {
        database: dbStatus,
        supabase: supabaseStatus,
        redis: process.env.REDIS_URL ? 'configured' : 'unconfigured',
        opensearch: process.env.OPENSEARCH_NODE ? 'configured' : 'unconfigured',
      },
    };
  }
}
