import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const loginUser = (credentials) =>
  request
    .post('/api/auth/login')
    .send(credentials)
    .then(handleSuccess)
    .catch(handleError);
