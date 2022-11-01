import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Condition } from 'dynamoose';
import { Document, InjectModel, Model, ScanResponse } from 'nestjs-dynamoose';
import { CreateStudentDto, UpdateStudentDto } from './dto/';
import { Student, StudentPK, EmailStudent, EmailStudentPK } from './entities/';
import { validate as isUUID } from 'uuid';
import { ValidStatus } from '../common/interfaces/';
import { User } from '../users/entities';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel('Students')
    private studentModel: Model<Student, StudentPK>,

    @InjectModel('EmailsStudents')
    private emailStudentModel: Model<EmailStudent, EmailStudentPK>,
  ) {}

  async create(dto: CreateStudentDto, user: User): Promise<Student> {
    if (await this.#emailAvailability(dto.email))
      throw new NotAcceptableException(null, `${dto.email} is unavailable!`);

    const student: Student | void = await this.studentModel.create({
      ...dto,
      _idCreator: user.id!,
      _idLastModificator: user.id!,
    });

    await this.emailStudentModel.create({
      email: dto.email,
      idStudent: student.id!,
    });

    return student;
  }

  async update(
    id: string,
    dto: UpdateStudentDto,
    user: User,
  ): Promise<Student> {
    const student: Student | void = await this.#findRecordById(id);

    if (!student) throw new NotFoundException();

    if (dto.email && dto.email.toLowerCase().trim() !== student.email) {
      await this.#changeUniqueEmail(student.email, dto.email, student.id!);
    } else {
      delete dto.email;
    }

    return await this.studentModel.update(
      { id },
      { ...dto, _idLastModificator: user.id },
    );
  }

  async findAll(): Promise<ScanResponse<Document<Student>>> {
    let res: ScanResponse<Document<Student>>;

    try {
      //TODO: Adicionar filtros y paginación
      res = await this.studentModel
        .scan('_status')
        .in([ValidStatus.active, ValidStatus.inactive])
        .exec();
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    return res;
  }

  async #findRecordById(id: string): Promise<Student | void> {
    let res: Student;

    try {
      res = await this.studentModel.get({ id });

      if (!res || res._status === ValidStatus.deleted) return;
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    return res;
  }

  async #findRecordByEmail(email: string): Promise<Student | void> {
    let res: Student[];
    try {
      res = await this.studentModel
        .query(new Condition().where('email').eq(email.trim().toLowerCase()))
        .limit(1)
        .exec();
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    if (
      res.length === 0 ||
      (res.length > 0 && res[0]._status === ValidStatus.deleted)
    )
      return;

    return res[0];
  }

  async #emailAvailability(email: string): Promise<boolean> {
    let res: EmailStudent[];

    try {
      res = await this.emailStudentModel
        .query(new Condition().where('email').eq(email.trim().toLowerCase()))
        .limit(1)
        .exec();
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    return res.length > 0;
  }

  async findOne(term: string): Promise<Student> {
    const student: Student | void = isUUID(term)
      ? await this.#findRecordById(term)
      : await this.#findRecordByEmail(term);

    if (!student) throw new NotFoundException();

    return student;
  }

  async remove(id: string, user: User): Promise<void> {
    const student: Student | void = await this.#findRecordById(id);

    if (!student) throw new NotFoundException('no encontrados');

    try {
      await this.emailStudentModel.delete({ email: student.email });
      await this.studentModel.update(
        { id },
        { _status: ValidStatus.deleted, _idLastModificator: user.id },
      );
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }
  }

  async #changeUniqueEmail(
    oldEmail: string,
    newEmail: string,
    idStudent: string,
  ): Promise<void> {
    if (!(await this.#emailAvailability(newEmail))) {
      try {
        await this.emailStudentModel.delete({ email: oldEmail });

        await this.emailStudentModel.create({
          email: newEmail,
          idStudent,
        });
      } catch (error) {
        //TODO: Elaborar catch de errores con los comunes de ddb
        throw new InternalServerErrorException();
      }
    } else {
      throw new NotAcceptableException(null, `${newEmail} is not available`);
    }
  }
}
