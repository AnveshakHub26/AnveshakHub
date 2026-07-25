import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { ProjectStatus } from './create-project.dto';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'AI Predictive Maintenance Platform v2' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '8 Months' })
  @IsOptional()
  @IsString()
  timeline?: string;

  @ApiPropertyOptional({ example: '₹20,00,000' })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional({ example: ['Machine Learning', 'Edge Computing'] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
