import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postAllQuizResults = (answers, email, quizId) =>
  request
    .post("/api/quiz/allCategories")
    .send({ answers, email, quizId })
    .then(handleSuccess)
    .catch(handleError);
