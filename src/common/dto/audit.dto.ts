import { IsIn, IsString, IsDate } from 'class-validator';
import { ValidStatus } from '../interfaces/';
import { ApiProperty } from '@nestjs/swagger';

export class AuditDTO {
  @ApiProperty({
    description: 'Status of record',
    example: 'active',
    enum: Object.values(ValidStatus),
  })
  @IsIn([ValidStatus])
  _status?: string;

  @ApiProperty({
    description: 'Creator User ID',
    example: '8f69bb69-a0ac-4c87-aa38-1a10a9efe44d',
  })
  @IsString()
  _idCreator?: string;

  @ApiProperty({
    description: 'Date of creation',
    example: '2021-12-17T16:54:25.251Z',
  })
  @IsDate()
  _createdAt?: Date;

  @ApiProperty({
    description: 'Last Modificator User ID',
    example: '40906bd8-c2bd-417e-875e-7dd2a338a586',
  })
  @IsString()
  _idLastModificator?: string;

  @ApiProperty({
    description: 'Date of last updated',
    example: '2022-10-29T05:09:42.333Z',
  })
  @IsDate()
  _updatedAt?: Date;
}
