import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel, Model, ScanResponse, Document } from 'nestjs-dynamoose';
import { validate as isUUID } from 'uuid';
import { User, UserPK } from './entities';
import { Condition } from 'dynamoose';
import { ValidStatus } from '../common/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users')
    private userModel: Model<User, UserPK>,
  ) {}

  async findOne(term: string): Promise<User | void> {
    const user: User | void = isUUID(term)
      ? await this.#findRecordById(term)
      : await this.#findRecordByEmail(term);
    return user;
  }

  async findAll(): Promise<Array<User>> {
    let res: ScanResponse<Document<User>>;
    const resWOPass: Array<User> = [];

    try {
      //TODO: Adicionar filtros y paginación
      res = await this.userModel
        .scan('_status')
        .in([ValidStatus.active, ValidStatus.inactive])
        .exec();
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    res.map((o: User) => {
      const { password, ...userData } = o;
      let user: User = new User();
      user = { ...user, ...userData };
      resWOPass.push(user);
      if (password) return;
    });
    return resWOPass;
  }

  async #findRecordById(id: string): Promise<User | void> {
    let res: User;

    try {
      res = await this.userModel.get({ id });

      if (!res || res._status === ValidStatus.deleted) return;
    } catch (error) {
      //TODO: Elaborar catch de errores con los comunes de ddb
      throw new InternalServerErrorException();
    }

    return res;
  }

  async #findRecordByEmail(email: string): Promise<User | void> {
    let res: User[];
    try {
      res = await this.userModel
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
}
