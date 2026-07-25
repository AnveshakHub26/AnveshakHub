import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents & Supabase Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file to Supabase Storage bucket' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'bucket', required: false, example: 'project-documents' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser('id') userId: string,
    @Query('bucket') bucket = 'project-documents',
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('File buffer is required');
    return this.documentsService.upload(userId, bucket, file.buffer, file.mimetype, file.originalname);
  }

  @Get('download')
  @ApiOperation({ summary: 'Generate secure signed/public URL for document download' })
  @ApiQuery({ name: 'bucket', required: true, example: 'project-documents' })
  @ApiQuery({ name: 'path', required: true, example: 'user_123/file.pdf' })
  async getSignedUrl(@Query('bucket') bucket: string, @Query('path') path: string) {
    return this.documentsService.getSignedUrl(bucket, path);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete document from Supabase Storage' })
  @ApiQuery({ name: 'bucket', required: true, example: 'project-documents' })
  @ApiQuery({ name: 'path', required: true, example: 'user_123/file.pdf' })
  async delete(@Query('bucket') bucket: string, @Query('path') path: string) {
    return this.documentsService.delete(bucket, path);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List project technical documents & attachments' })
  async getProjectDocuments(@Param('projectId') projectId: string) {
    return this.documentsService.getProjectDocuments(projectId);
  }

  @Get('meeting/:meetingId')
  @ApiOperation({ summary: 'List meeting documents & presentations' })
  async getMeetingDocuments(@Param('meetingId') meetingId: string) {
    return this.documentsService.getMeetingDocuments(meetingId);
  }

  @Get('resumes')
  @ApiOperation({ summary: 'List user uploaded resume attachments' })
  async getResumes(@CurrentUser('id') userId: string) {
    return this.documentsService.getResumes(userId);
  }
}
