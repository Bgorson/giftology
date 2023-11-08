import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postGPT = (prompt) => {
  const superagentRequest = request.post("/api/v2/quiz/").send(prompt);

  return superagentRequest.then(handleSuccess).catch(handleError);
};
