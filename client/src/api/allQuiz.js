import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postAllQuizResults = (answers, email) =>
  request
    .post("/api/quiz/allProducts")
    .send({ answers, email })
    .then(handleSuccess)
    .catch(handleError);
