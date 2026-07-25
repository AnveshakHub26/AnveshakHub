import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserSettingsDto {
  @ApiPropertyOptional({ example: true, description: 'Enable email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable 2FA authentication' })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({ example: 'dark', description: 'UI Theme preference' })
  @IsOptional()
  @IsString()
  theme?: string;
}
