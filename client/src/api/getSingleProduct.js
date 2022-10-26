import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const getProducts = ({ id }) =>
  request
    .get(`/api/products/product/${id}`)
    .then(handleSuccess)
    .catch(handleError);
