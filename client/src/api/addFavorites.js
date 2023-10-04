import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const addFavorites = (product, quizId, token) =>
  request
    .post("/api/user/favorites")
    .set({ authorization: `Bearer ${token}` })
    .send({ product, quizId })
    .then(handleSuccess)
    .catch(handleError);
