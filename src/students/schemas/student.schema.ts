import { Schema } from 'dynamoose';
import { ValidStatus } from '../../common/interfaces/';
import { v4 as uuid } from 'uuid';

export const StudentSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuid,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    index: {
      name: 'emailIndex',
      type: 'global',
    },
  },
  dni: {
    type: String,
    required: true,
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
