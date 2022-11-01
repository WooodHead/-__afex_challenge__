import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HTTP_404 {
  @ApiProperty({
    example: 404,
    description: 'HTTP Code',
  })
  @IsInt()
  statusCode: number;

  @ApiProperty({
    example: 'Not found',
    description: 'Error description',
  })
  @IsString()
  message: string;
}
