import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postGPT = (prompt) => {
  const superagentRequest = request.post("/api/v2/quiz/").send(prompt);

  const cancelRequest = () => {
    superagentRequest.abort(); // Call the abort() method to cancel the request
  };

  return superagentRequest.then(handleSuccess).catch(handleError);
};

// Call this function to cancel the request
const cancelRequest = () => {
  postGPT.cancelRequest();
};
