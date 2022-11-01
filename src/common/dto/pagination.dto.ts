import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({
    default: 10,
    description: 'How many rows do yow need',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  // @Min(0)
  @Type(() => Number)
  offset?: number;
}
