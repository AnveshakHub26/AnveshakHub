import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyProjectDto {
  @ApiProperty({ example: 'proj_12345', description: 'Target project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'Proposal cover letter describing research domain expertise & past background' })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
