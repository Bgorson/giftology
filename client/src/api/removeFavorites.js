import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const removeFavorites = (product, quizId, token) =>
  request
    .delete("/api/quiz/favorite")
    .set({ authorization: `Bearer ${token}` })
    .send({ product, quizId })
    .then(handleSuccess)
    .catch(handleError);
