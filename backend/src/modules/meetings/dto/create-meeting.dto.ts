import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ example: 'R&D Project Architecture Review' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Technical evaluation of milestone deliverables' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-08-01T10:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ example: '60' })
  @IsOptional()
  @IsString()
  durationMinutes?: string;

  @ApiPropertyOptional({ example: ['user1@anveshakhub.com', 'user2@anveshakhub.com'] })
  @IsOptional()
  @IsArray()
  participants?: string[];
}
