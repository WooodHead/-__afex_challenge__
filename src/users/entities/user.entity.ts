import { IntersectionType } from '@nestjs/swagger';
import { PrimaryKeyDTO, AuditDTO } from '../../common/dto/';
import { CreateUserDto } from '../dto/';

class UserWithPK extends IntersectionType(PrimaryKeyDTO, CreateUserDto) {}
export class User extends IntersectionType(UserWithPK, AuditDTO) {}
export class UserPK extends PrimaryKeyDTO {}
