import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabaseUrl');
    const key = this.configService.get<string>('supabaseServiceKey') || this.configService.get<string>('supabaseAnonKey');
    this.client = createClient(url || 'https://qehkqwwotuqyqozuyaji.supabase.co', key || 'sb_publishable_1tVghl8k0qXobIVmZdKrLg_0y85_1bQ');
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
