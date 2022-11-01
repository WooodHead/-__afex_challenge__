import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { StudentSchema, EmailStudentSchema } from './schemas';

@Module({
  imports: [
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
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
