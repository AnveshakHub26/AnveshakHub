import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExpertDto {
  @ApiPropertyOptional({ example: 'Senior AI/ML Research Architect' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 'Artificial Intelligence, Computer Vision, PyTorch, Deep Learning' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'LLMs'] })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional({ example: '12+ years of industry & research consulting experience' })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({ example: 'https://github.com/expert-profile' })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Availability for consulting' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
