import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { EmailUserSchema, UserSchema } from './schemas';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

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
            name: 'Users',
            schema: UserSchema,
          },
          {
            name: 'EmailsUsers',
            schema: EmailUserSchema,
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne by id b9b0b23f-5f2c-4dee-ade4-2ba8422f2c50', async () => {
    expect(await (await service.findOne('admin@afex.test'))!['email']).toBe(
      'admin@afex.test',
    );
  });

  it('findOne by email admin@afex.test', async () => {
    expect(await (await service.findOne('admin@afex.test'))!['id']).toBe(
      'b9b0b23f-5f2c-4dee-ade4-2ba8422f2c50',
    );
  });

  it('findOne by "unknown" value somevalue', async () => {
    expect(await service.findOne('somevalue')).toBe(undefined);
  });

  it('findAll records', async () => {
    expect(await (await service.findAll()).length).toBeGreaterThan(0);
  });
});
