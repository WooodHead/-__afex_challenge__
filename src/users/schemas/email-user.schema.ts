import { Schema } from 'dynamoose';

export const EmailUserSchema = new Schema({
  email: {
    type: String,
    hashKey: true,
  },
  idUser: {
    type: String,
    set: (newValue, oldValue) => (oldValue ? oldValue : newValue),
    index: {
      name: 'userIndex',
      type: 'global',
    },
  },
});
