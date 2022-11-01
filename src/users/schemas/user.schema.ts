import { Schema } from 'dynamoose';
import { ValidStatus } from '../../common/interfaces/';
import { v4 as uuid } from 'uuid';

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuid,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    index: {
      name: 'emailIndex',
      type: 'global',
    },
  },
  password: {
    type: String,
  },
  roles: {
    type: Array,
    schema: [String],
  },

  _status: {
    type: String,
    enum: [ValidStatus.active, ValidStatus.inactive, ValidStatus.deleted],
    default: ValidStatus.active,
    index: {
      name: 'statusIndex',
      type: 'global',
    },
  },
  _idCreator: {
    type: String,
    set: (newValue, oldValue) => (oldValue ? oldValue : newValue),
  },
  _createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    set: (newValue, oldValue) => (oldValue ? oldValue : newValue),
  },
  _idLastModificator: {
    type: String,
  },
  _updatedAt: {
    type: String,
    default: () => new Date().toISOString(),
    forceDefault: true,
  },
});
