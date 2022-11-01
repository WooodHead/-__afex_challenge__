import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { User } from '../users/entities';
import { Student } from './entities';
import { EmailStudentSchema, StudentSchema } from './schemas';
import { StudentsService } from './students.service';
import { v4 as uuid } from 'uuid';

const user: User = {
  id: 'jestNotValidId',
  fullName: 'Jest Test',
  email: 'jest@afex.test',
  password: 'notvalidhash',
  roles: ['admin'],
};

const ts: string = new Date().getTime().toString();
const newId: string = uuid();
const newEmail = `student1_${ts}@afexstudent.test`;
const newRecord: Student = {
  firstName: 'Student 1',
  lastName: 'Last Name Student 1',
  dni: `${ts}DNI`,
  id: newId,
  email: newEmail,
};

const ts2: string = (new Date().getTime() + 1).toString();
const newId2: string = uuid();
const newEmail2 = `student2_${ts2}@afexstudent.test`;
const newRecord2: Student = {
  firstName: 'Student 2',
  lastName: 'Last Name Student 2',
  dni: `${ts2}DNI`,
  id: newId2,
  email: newEmail2,
};

describe('StudentsService', () => {
  let service: StudentsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DynamooseModule.forRoot({
          local: (() => {
            if (process.env.IS_LOCAL_DDB !== 'true') return false;
            if (process.env.DDB_LOCAL_ENDPOINT)
              return process.env.DDB_LOCAL_ENDPOINT;
            return true;
          })(),
          aws: {
            region: process.env.REGION,
          },
          table: {
            create: true,
            prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
            suffix: '-table',
          },
        }),
        DynamooseModule.forFeature([
          {
            name: 'Students',
            schema: StudentSchema,
          },
          {
            name: 'EmailsStudents',
            schema: EmailStudentSchema,
          },
        ]),
      ],
      providers: [StudentsService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`findOne not registered student with ${newEmail}`, async () => {
    const find: any = (async () => {
      try {
        await service.findOne(newEmail);
      } catch (error: any) {
        return null;
      }
      return 1;
    })();
    expect(await find).toBeNull();
  });

  it(`create new student with email ${newEmail}`, async () => {
    expect(await (await service.create(newRecord, user))!['email']).toBe(
      newEmail,
    );
  });

  it(`findOne by new id ${newId}`, async () => {
    expect(await (await service.findOne(newId))!['email']).toBe(newEmail);
  });

  it(`findOne by new email ${newEmail}`, async () => {
    expect(await (await service.findOne(newEmail))!['id']).toBe(newId);
  });

  it(`create second student with email ${newEmail2}`, async () => {
    expect(await (await service.create(newRecord2, user))!['email']).toBe(
      newEmail2,
    );
  });

  it(`update Email student 1 with existing student 2 email ${newEmail2}`, async () => {
    const find: any = (async () => {
      try {
        await service.update(newId, { email: newEmail2 }, user);
      } catch (error: any) {
        return null;
      }
      return 1;
    })();
    expect(await find).toBeNull();
  });

  it(`update First Name student 1 to 'New First Name Updated'`, async () => {
    expect(
      await (await service.update(
        newId,
        { firstName: 'New First Name Updated' },
        user,
      ))!['firstName'],
    ).toBe('New First Name Updated');
  });

  it(`remove student 2 ${newEmail2}`, async () => {
    expect(await service.remove(newId2, user)).toBe(undefined);
  });

  it(`update Email student 1 with removed student 2 email ${newEmail2}`, async () => {
    expect(
      await (await service.update(newId, { email: newEmail2 }, user))!['email'],
    ).toBe(newEmail2);
  });

  it(`remove student 1 ${newEmail2}`, async () => {
    expect(await service.remove(newId, user)).toBe(undefined);
  });

  it('findAll records', async () => {
    expect(await (await service.findAll()).length).toBeGreaterThanOrEqual(0);
  });
});
