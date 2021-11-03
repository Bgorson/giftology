import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const getProducts = () =>
  request.get('/api/products')
    .then(handleSuccess)
    .catch(handleError);
