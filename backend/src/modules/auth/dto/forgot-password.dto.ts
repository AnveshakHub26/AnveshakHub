import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@anveshakhub.com', description: 'Registered user email for password reset' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
