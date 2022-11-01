import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HTTP_401 {
  @ApiProperty({
    example: 401,
    description: 'HTTP Code',
  })
  @IsInt()
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Error message',
  })
  @IsString()
  message: string;
}
