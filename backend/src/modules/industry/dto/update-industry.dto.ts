import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateIndustryDto {
  @ApiPropertyOptional({ example: 'Tata Consultancy Services' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: 'Information Technology' })
  @IsOptional()
  @IsString()
  industryType?: string;

  @ApiPropertyOptional({ example: 'https://tcs.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Enterprise IT Services & AI Consulting' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Mumbai, Maharashtra, India' })
  @IsOptional()
  @IsString()
  address?: string;
}
