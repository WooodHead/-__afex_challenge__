import { Module } from '@nestjs/common';

@Module({})
export class CommonModule {}

// @Module({
//     imports: [
//       DynamooseModule.forFeature([
//         {
//           name: 'Student',
//           schema: StudentSchema,
//           options: {
//             create: true,
//             initialize: true
//           }
//         }
//       ]),
//     ],
//     controllers: [StudentsController],
//     providers: [StudentsService]
//   })
//   export class StudentsModule {}
