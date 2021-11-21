import request from 'superagent';
import { handleSuccess, handleError } from './utils';

export const postQuizResults = (answers) =>
  request
    .post('/api/quiz')
    .send(answers)
    .then(handleSuccess)
    .catch(handleError);
