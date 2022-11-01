import {
  IsString,
  MaxLength,
  IsIn,
  IsEmail,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from '../../auth/interfaces';

export class CreateUserDto {
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

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: ['user'],
    description: 'Role of authorization',
    enum: Object.values(ValidRoles),
  })
  @IsIn([Object.values(ValidRoles)])
  @ApiProperty({
    type: String,
    isArray: true,
  })
  roles: string[];
}
