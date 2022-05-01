import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const getEtsyProducts = (id) =>
  request
    .get(`/api/products/etsy/${id}`)
    .then(handleSuccess)
    .catch(handleError);
