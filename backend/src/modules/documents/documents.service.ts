import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async upload(userId: string, bucket: string, fileBuffer: Buffer, mimeType: string, originalName: string) {
    const validBuckets = ['project-documents', 'meeting-documents', 'resumes', 'avatars', 'company-logos'];
    const targetBucket = validBuckets.includes(bucket) ? bucket : 'project-documents';
    const filePath = `${userId}/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const publicUrl = await this.supabaseService.uploadFile(targetBucket, filePath, fileBuffer, mimeType);

    return {
      status: 'success',
      message: 'File uploaded successfully to Supabase Storage',
      document: {
        fileName: originalName,
        bucket: targetBucket,
        path: filePath,
        mimeType,
        sizeBytes: fileBuffer.length,
        url: publicUrl,
        uploadedAt: new Date().toISOString(),
      },
    };
  }

  async getSignedUrl(bucket: string, path: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);

    if (error) {
      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(path);
      return { status: 'success', url: pubData.publicUrl };
    }

    return {
      status: 'success',
      signedUrl: data.signedUrl,
      expiresIn: 3600,
    };
  }

  async delete(bucket: string, path: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new BadRequestException(`Document deletion failed: ${error.message}`);
    }

    return {
      status: 'success',
      message: `Document ${path} deleted from bucket ${bucket}`,
    };
  }

  async getProjectDocuments(projectId: string) {
    return {
      status: 'success',
      projectId,
      documents: [
        {
          id: 'doc_1',
          name: 'Technical_Specification_v1.pdf',
          bucket: 'project-documents',
          version: '1.0',
          size: '2.4 MB',
        },
      ],
    };
  }

  async getMeetingDocuments(meetingId: string) {
    return {
      status: 'success',
      meetingId,
      documents: [
        {
          id: 'doc_m1',
          name: 'Architecture_Presentation.pptx',
          bucket: 'meeting-documents',
          size: '5.1 MB',
        },
      ],
    };
  }

  async getResumes(userId: string) {
    return {
      status: 'success',
      userId,
      resumes: [
        {
          id: 'res_1',
          name: 'Resume_2026.pdf',
          bucket: 'resumes',
          isPrimary: true,
        },
      ],
    };
  }
}
