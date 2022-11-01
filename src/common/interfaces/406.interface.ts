import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HTTP_406 {
  @ApiProperty({
    example: 406,
    description: 'HTTP Code',
  })
  @IsInt()
  statusCode: number;

  @ApiProperty({
    example: 'email@example.com is unavailable',
    description: 'Error message',
  })
  @IsString()
  message: string;
}
