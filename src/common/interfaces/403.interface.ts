import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HTTP_403 {
  @ApiProperty({
    example: 403,
    description: 'HTTP Code',
  })
  @IsInt()
  statusCode: number;

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error message',
  })
  @IsString()
  message: string;
}
