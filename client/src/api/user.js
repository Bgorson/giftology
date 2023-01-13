import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const getUser = (token) =>
  request
    .get("/api/user")
    .set({ authorization: `Bearer ${token}` })
    .then(handleSuccess)
    .catch(handleError);
