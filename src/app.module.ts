import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';

import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
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
        create: process.env.IS_LOCAL_DDB === 'true',
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
        suffix: '-table',
      },
    }),
    CommonModule,
    UsersModule,
    StudentsModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
