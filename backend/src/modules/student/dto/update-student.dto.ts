import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'Indian Institute of Technology (IIT) Madras' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ example: 'B.Tech Computer Science & AI' })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  graduationYear?: string;

  @ApiPropertyOptional({ example: ['Python', 'Data Structures', 'React', 'Node.js'] })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional({ example: 'https://github.com/student-dev' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/student-dev' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}
