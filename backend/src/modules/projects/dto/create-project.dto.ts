import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum } from 'class-validator';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'AI-Powered Predictive Maintenance System for Heavy Machinery' })
  @IsString()
  @IsNotEmpty({ message: 'Project title is required' })
  title: string;

  @ApiProperty({ example: 'Development of real-time IoT sensor anomaly detection model' })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '6 Months' })
  @IsOptional()
  @IsString()
  timeline?: string;

  @ApiPropertyOptional({ example: '₹15,00,000' })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional({ example: ['Artificial Intelligence', 'IoT', 'Predictive Maintenance'] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
