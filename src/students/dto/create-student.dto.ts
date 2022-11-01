import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    example: 'John',
    description: 'First Name',
    uniqueItems: false,
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last Name',
    uniqueItems: false,
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567TJ',
    description: 'DNI',
    uniqueItems: true,
  })
  @MinLength(7)
  @MaxLength(10)
  dni: string;
}
