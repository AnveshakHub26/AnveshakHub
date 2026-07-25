import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AdminActionDto {
  @ApiPropertyOptional({ example: 'Verified compliance documentation and license' })
  @IsOptional()
  @IsString()
  reason?: string;
}
