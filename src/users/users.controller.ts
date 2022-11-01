import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { User } from './entities';

import { ApiKeyAuthGuard, JwtAuthGuard, UserRoleGuard } from '../auth/guards/';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HTTP_SWAGGER_401 } from '../common/interfaces/';
import { RoleProtected } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard, UserRoleGuard)
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer Auth',
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYWYzODk4OS1jNjU5LTRjOTctYTgwZi04ZDNkNjI0MWZjYjkifQ.4YG9GYBxKI2gZxe8wdwrqT76-kiN2vnHKPnA456hZz8',
  allowEmptyValue: false,
  required: true,
})
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for request',
  example: '1af38989-c659-4c97-a80f-8d3d6241fcb9',
  allowEmptyValue: false,
  required: true,
})
@ApiUnauthorizedResponse(HTTP_SWAGGER_401)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RoleProtected(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'List all records' })
  @ApiOkResponse({ description: 'List all records', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }
}
