import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { CreateStudentDto } from 'src/students/dto';
import { AppModule } from './../src/app.module';

const ts: string = new Date().getTime().toString();
const newEmail = `student1_${ts}@afexstudent.test`;
const newRecord: CreateStudentDto = {
  firstName: 'Student 1',
  lastName: 'Last Name Student 1',
  dni: `${ts}DNI`,
  email: newEmail,
};

const ts2: string = (new Date().getTime() + 1).toString();
const newEmail2 = `student2_${ts2}@afexstudent.test`;
const newRecord2: CreateStudentDto = {
  firstName: 'Student 2',
  lastName: 'Last Name Student 2',
  dni: `${ts2}DNI`,
  email: newEmail2,
};

const jwt: JwtService = new JwtService();
const apiKeys: Array<string> = JSON.parse(process.env.API_KEYS!);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const tokenAdmin: string = jwt.sign(
    { sub: 'b9b0b23f-5f2c-4dee-ade4-2ba8422f2c50' },
    { secret: process.env.JWT_SECRET },
  );
  const tokenUser: string = jwt.sign(
    { sub: '279a7a96-4980-49b7-be86-1543d41fdcb2' },
    { secret: process.env.JWT_SECRET },
  );

  const admin: object = {
    'x-api-key': apiKeys[0],
    Authorization: `Bearer ${tokenAdmin}`,
  };
  const user: object = {
    'x-api-key': apiKeys[0],
    Authorization: `Bearer ${tokenUser}`,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/students/${newEmail} (GET) - 404 - get not registered student`, () => {
    return request(app.getHttpServer())
      .get(`/students/${newEmail}`)
      .set(admin)
      .expect(404);
  });

  it(`/students/ (POST) - 403 - create new student (user without privileges)`, () => {
    return request(app.getHttpServer())
      .post(`/students`)
      .send(newRecord)
      .set(user)
      .expect(403);
  });

  it(`/students/ (POST) - 201 - create new student with email ${newEmail}`, () => {
    return request(app.getHttpServer())
      .post(`/students`)
      .send(newRecord)
      .set(admin)
      .expect(201);
  });

  it(`/students/${newEmail} (GET) - 200 - get new student`, () => {
    return request(app.getHttpServer())
      .get(`/students/${newEmail}`)
      .set(admin)
      .expect(200);
  });

  it(`/students/ (POST) - 201 - create second student with email ${newEmail2}`, () => {
    return request(app.getHttpServer())
      .post(`/students`)
      .send(newRecord2)
      .set(admin)
      .expect(201);
  });

  it(`/students/:idStudent1 (PATCH) - 406 - update Email student 1 with existing student 2 email ${newEmail2}`, async () => {
    const record = await request(app.getHttpServer())
      .get(`/students/${newEmail}`)
      .set(admin)
      .expect(200);

    return await request(app.getHttpServer())
      .patch(`/students/${record.body.id}`)
      .send({ email: newEmail2 })
      .set(admin)
      .expect(406);
  });

  it(`/students/:idStudent1 (PATCH) - 200 - update First Name student 1 to 'New First Name Updated'`, async () => {
    const record = await request(app.getHttpServer())
      .get(`/students/${newEmail}`)
      .set(admin)
      .expect(200);

    return await request(app.getHttpServer())
      .patch(`/students/${record.body.id}`)
      .send({ name: 'New First Name Updated' })
      .set(admin)
      .expect(200);
  });

  it(`/students/:idStudent2 (DELETE) - 200 - remove student 2 ${newEmail2}`, async () => {
    const record = await request(app.getHttpServer())
      .get(`/students/${newEmail2}`)
      .set(admin)
      .expect(200);

    return await request(app.getHttpServer())
      .delete(`/students/${record.body.id}`)
      .set(admin)
      .expect(200);
  });

  it(`/students/:idStudent1 (PATCH) - 200 - update Email student 1 with removed student 2 email ${newEmail2}`, async () => {
    const record = await request(app.getHttpServer())
      .get(`/students/${newEmail}`)
      .set(admin)
      .expect(200);

    return await request(app.getHttpServer())
      .patch(`/students/${record.body.id}`)
      .send({ email: newEmail2 })
      .set(admin)
      .expect(200);
  });

  it(`/students/:idStudent1 (DELETE) - 200 - remove student 1 ${newEmail2}`, async () => {
    const record = await request(app.getHttpServer())
      .get(`/students/${newEmail2}`)
      .set(admin)
      .expect(200);

    return await request(app.getHttpServer())
      .delete(`/students/${record.body.id}`)
      .set(admin)
      .expect(200);
  });

  it('/students (GET) - 200 - List all students', () => {
    return request(app.getHttpServer()).get('/students').set(admin).expect(200);
  });
});
