import {
  IsEmail,
  IsString,
  MaxLength,
  IsIn,
  IsArray,
  IsJWT,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from '../interfaces';

export class LoginResponseDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full Name',
    uniqueItems: false,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'user',
    description: 'Role of authorization',
    enum: Object.values(ValidRoles),
  })
  @IsIn([Object.values(ValidRoles)])
  @IsString({ each: true })
  @IsArray()
  roles: string[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYWYzODk4OS1jNjU5LTRjOTctYTgwZi04ZDNkNjI0MWZjYjkifQ.4YG9GYBxKI2gZxe8wdwrqT76-kiN2vnHKPnA456hZz8',
    description: 'Access Token',
  })
  @IsJWT()
  access_token: string;
}
