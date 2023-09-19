import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postUserBehavior = (product, quizId, userId,token,behavior) =>
  request
    .post("/api/user/behavior")
    .set({ authorization: `Bearer ${token}` })
    .send({ product, quizId,userId, behavior })
    .then(handleSuccess)
    .catch(handleError);
