import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiHeader,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotAcceptableResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Student } from './entities';
import { User } from '../users/entities';
import {
  // Auth,
  GetUser,
  RoleProtected,
} from '../auth/decorators';
import { ApiKeyAuthGuard, JwtAuthGuard, UserRoleGuard } from '../auth/guards/';
import {
  HTTP_SWAGGER_400,
  HTTP_SWAGGER_401,
  HTTP_SWAGGER_403,
  HTTP_SWAGGER_404,
  HTTP_SWAGGER_406,
} from '../common/interfaces';
import { ValidRoles } from '../auth/interfaces';

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard, UserRoleGuard)
@ApiTags('Students')
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
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @RoleProtected(ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Create new record' })
  @ApiCreatedResponse({ description: 'Student was created', type: Student })
  @ApiBadRequestResponse(HTTP_SWAGGER_400)
  @ApiForbiddenResponse(HTTP_SWAGGER_403)
  @ApiNotAcceptableResponse(HTTP_SWAGGER_406)
  create(@Body() createStudentDto: CreateStudentDto, @GetUser() user: User) {
    return this.studentsService.create(createStudentDto, user);
  }

  @Get()
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  @ApiOperation({ summary: 'List all records' })
  @ApiOkResponse({ description: 'List all records', type: [Student] })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':term')
  @ApiParam({
    name: 'term',
    description: 'Term of search',
  })
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  @ApiOperation({ summary: 'Search record by Term ( Primary Key | Email )' })
  @ApiOkResponse({ description: 'Get record', type: Student })
  @ApiForbiddenResponse(HTTP_SWAGGER_403)
  @ApiNotFoundResponse(HTTP_SWAGGER_404)
  findOne(@Param('term') key: string) {
    return this.studentsService.findOne(key);
  }

  @Patch(':key')
  @RoleProtected(ValidRoles.ADMIN)
  @ApiParam({
    name: 'key',
    description: 'Primary Key',
  })
  @ApiOperation({ summary: 'Update record by Primary Key' })
  @ApiOkResponse({ description: 'Update', type: Student })
  @ApiBadRequestResponse(HTTP_SWAGGER_400)
  @ApiForbiddenResponse(HTTP_SWAGGER_403)
  @ApiNotFoundResponse(HTTP_SWAGGER_404)
  @ApiNotAcceptableResponse(HTTP_SWAGGER_406)
  update(
    @Param('key') key: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @GetUser() user: User,
  ) {
    return this.studentsService.update(key, updateStudentDto, user);
  }

  @Delete(':key')
  @RoleProtected(ValidRoles.ADMIN)
  @ApiParam({
    name: 'key',
    description: 'Primary Key',
  })
  @ApiOperation({ summary: 'Delete record by Primary Key' })
  @ApiOkResponse({ description: 'Delete student' })
  @ApiForbiddenResponse(HTTP_SWAGGER_403)
  @ApiNotFoundResponse(HTTP_SWAGGER_404)
  remove(@Param('key') key: string, @GetUser() user: User) {
    return this.studentsService.remove(key, user);
  }
}
