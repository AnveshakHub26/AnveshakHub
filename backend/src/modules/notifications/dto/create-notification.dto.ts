import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export enum NotificationType {
  PROJECT = 'PROJECT',
  MEETING = 'MEETING',
  VERIFICATION = 'VERIFICATION',
  APPLICATION = 'APPLICATION',
  SYSTEM = 'SYSTEM',
}

export class CreateNotificationDto {
  @ApiProperty({ example: 'user_123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Verification Approved' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Your industry organization profile has been verified' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: NotificationType, example: NotificationType.VERIFICATION })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
