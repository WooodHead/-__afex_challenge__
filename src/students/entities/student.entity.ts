import { IntersectionType } from '@nestjs/swagger';
import { PrimaryKeyDTO, AuditDTO } from '../../common/dto/';
import { CreateStudentDto } from '../dto/';

const _Student = class Student extends IntersectionType(
  PrimaryKeyDTO,
  CreateStudentDto,
) {};
export class Student extends IntersectionType(_Student, AuditDTO) {}
export class StudentPK extends PrimaryKeyDTO {}
