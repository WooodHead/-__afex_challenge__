import {
  IsEmail,
  IsString,
  MaxLength,
  IsIn,
  IsJWT,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from './valid-roles.interface';

export class Login {
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

  @ApiProperty({
    example: 'ccccccccccccccc.ccccccccccccccccc.cccccccccccccccccc',
    description: 'Access Token',
  })
  @IsJWT()
  access_token: string;
}
