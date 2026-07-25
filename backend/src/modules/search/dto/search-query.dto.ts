import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @ApiPropertyOptional({ example: 'artificial intelligence R&D', description: 'Search term query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'projects', description: 'Filter category (projects, experts, industries, students, documents)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
