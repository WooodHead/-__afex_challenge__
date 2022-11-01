import { HTTP_400 } from './400.interface';
export const HTTP_SWAGGER_400 = {
  description: 'Request error',
  type: HTTP_400,
};

import { HTTP_401 } from './401.interface';
export const HTTP_SWAGGER_401 = {
  description: 'Unauthorized request',
  type: HTTP_401,
};

import { HTTP_403 } from './403.interface';
export const HTTP_SWAGGER_403 = { description: 'Forbidden', type: HTTP_403 };

import { HTTP_404 } from './404.interface';
export const HTTP_SWAGGER_404 = {
  description: 'Resource not found',
  type: HTTP_404,
};

import { HTTP_406 } from './406.interface';
export const HTTP_SWAGGER_406 = {
  description: 'Request not acceptable',
  type: HTTP_406,
};

export { ValidStatus } from './valid-status.interface';
