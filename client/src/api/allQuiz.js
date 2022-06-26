import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const postAllQuizResults = (answers) =>
  request
    .post('/api/quiz/allProducts')
    .send(answers)
    .then(handleSuccess)
    .catch(handleError);
