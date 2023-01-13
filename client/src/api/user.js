import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const getUser = (token) =>
  request
    .get('/api/user')
    .set({ authorization: `Bearer ${token}` })
    .then(handleSuccess)
    .catch(handleError);

export const putUser = (info) =>
  request.put('/api/user').send(info).then(handleSuccess).catch(handleError);

export const putUserPassword = (passwordInfo) =>
  request
    .put('/api/user/password')
    .send(passwordInfo)
    .then(handleSuccess)
    .catch(handleError);
