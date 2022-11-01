import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HTTP_400 {
  @ApiProperty({
    example: 400,
    description: 'HTTP Code',
  })
  @IsInt()
  statusCode: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error description',
  })
  @IsString()
  error: string;

  @ApiProperty({
    example: ['email must be email'],
    description: 'Error messages',
  })
  @ApiProperty({
    type: String,
    isArray: true,
  })
  message: string[];
}
