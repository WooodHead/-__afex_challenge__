import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'USER',
    description: 'Role',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    example: 'user',
    description: 'Role Key',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  description: string;
}
