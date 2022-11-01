import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './../src/app.module';

const jwt: JwtService = new JwtService();
const apiKeys: Array<string> = JSON.parse(process.env.API_KEYS!);

const tokenAdmin: string = jwt.sign(
  { sub: 'b9b0b23f-5f2c-4dee-ade4-2ba8422f2c50' },
  { secret: process.env.JWT_SECRET },
);
const tokenUser: string = jwt.sign(
  { sub: '279a7a96-4980-49b7-be86-1543d41fdcb2' },
  { secret: process.env.JWT_SECRET },
);
const tokenWOPrivileges: string = jwt.sign(
  { sub: '75f5dcdb-2d7f-4e76-ae13-8cbedeca6e4b' },
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
const noPriv: object = {
  'x-api-key': apiKeys[0],
  Authorization: `Bearer ${tokenWOPrivileges}`,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET) - 401 - Invalid request (without API key and )', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('/users (GET) - 200 - with admin privileges (API Key + admin token)', () => {
    return request(app.getHttpServer()).get('/users').set(admin).expect(200);
  });

  it('/users (GET) - 403 - with user privileges (API Key + user token)', () => {
    return request(app.getHttpServer()).get('/users').set(user).expect(403);
  });

  it('/users (GET) - 403 - without privileges (API Key + user without roles token)', () => {
    return request(app.getHttpServer()).get('/users').set(noPriv).expect(403);
  });
});
