import { IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PrimaryKeyDTO {
  @ApiProperty({
    example: '1af38989-c659-4c97-a80f-8d3d6241fcb9',
    description: 'Primary Key',
    uniqueItems: true,
  })
  @IsString()
  @IsUUID('4')
  id?: string;
}
