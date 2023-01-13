import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const getFavorites = (quizId, token) =>
  request
    .get(`/api/user/favorites`)
    .query(`quizId=${quizId}`)
    .set({ authorization: `Bearer ${token}` })
    .then(handleSuccess)
    .catch(handleError);
