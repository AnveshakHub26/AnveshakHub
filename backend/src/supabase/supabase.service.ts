import { Injectable, BadRequestException } from '@nestjs/common';
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

  async uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const { data, error } = await this.client.storage.from(bucket).upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      throw new BadRequestException(`Storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.client.storage.from(bucket).getPublicUrl(path);
    return publicUrlData.publicUrl;
  }
}
