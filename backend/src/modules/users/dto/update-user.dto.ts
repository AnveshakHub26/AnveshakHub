import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Dr. Vikram Sharma' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'EXPERT', enum: ['SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT', 'STUDENT'] })
  @IsOptional()
  @IsString()
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT', 'STUDENT'])
  role?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;
}
