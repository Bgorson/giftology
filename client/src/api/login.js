import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const loginUser = (token) =>
  request
    .post('/api/auth/login')
    .send({ token })
    .then(handleSuccess)
    .catch(handleError);
