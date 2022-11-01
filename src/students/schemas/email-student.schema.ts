import { Schema } from 'dynamoose';

export const EmailStudentSchema = new Schema({
  email: {
    type: String,
    hashKey: true,
  },
  idStudent: {
    type: String,
    set: (newValue, oldValue) => (oldValue ? oldValue : newValue),
    index: {
      name: 'studentIndex',
      type: 'global',
    },
  },
});
