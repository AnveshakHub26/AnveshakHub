import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ example: 'EXPERT', enum: ['SUPER_ADMIN', 'CRM_SPECIALIST', 'COMPLIANCE_OFFICER', 'VERIFICATION_OFFICER', 'INDUSTRY_MANAGER', 'INDUSTRY_REPRESENTATIVE', 'EXPERT', 'STUDENT'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['SUPER_ADMIN', 'CRM_SPECIALIST', 'COMPLIANCE_OFFICER', 'VERIFICATION_OFFICER', 'INDUSTRY_MANAGER', 'INDUSTRY_REPRESENTATIVE', 'EXPERT', 'STUDENT'])
  role: string;
}
