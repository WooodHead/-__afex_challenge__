import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema, EmailUserSchema } from './schemas';
import { UsersController } from './users.controller';

@Module({
  imports: [
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
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
