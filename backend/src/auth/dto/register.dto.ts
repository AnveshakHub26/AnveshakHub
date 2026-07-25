import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@anveshakhub.com', description: 'User email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'StrongPassword@2026', description: 'User account password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Dr. Vikram Sharma', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiPropertyOptional({ example: 'EXPERT', enum: ['SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT', 'STUDENT'] })
  @IsOptional()
  @IsString()
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'INDUSTRY', 'EXPERT', 'STUDENT'], { message: 'Role must be one of SUPER_ADMIN, ADMIN, INDUSTRY, EXPERT, STUDENT' })
  role?: string;

  @ApiPropertyOptional({ example: 'Indian Institute of Science (IISc)', description: 'Associated organization or institution' })
  @IsOptional()
  @IsString()
  organization?: string;
}
