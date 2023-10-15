import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const getQuizes = (token) =>
  request
    .get("/api/user/quizes")
    .set({ authorization: `Bearer ${token}` })
    .then(handleSuccess)
    .catch(handleError);
