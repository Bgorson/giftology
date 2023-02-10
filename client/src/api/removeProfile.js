import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const removeProfile = (id, token) =>
  request
    .delete("/api/user/profile")
    .set({ authorization: `Bearer ${token}` })
    .send({ id })
    .then(handleSuccess)
    .catch(handleError);
