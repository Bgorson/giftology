import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postGPT = (prompt) =>
  request
    .post("/api/v2/quiz/")
    .send(prompt)
    .then(handleSuccess)
    .catch(handleError);
