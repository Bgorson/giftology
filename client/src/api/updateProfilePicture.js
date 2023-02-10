import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const updateProfilePicture = (id, url, token) =>
  request
    .patch("/api/user/profile")
    .set({ authorization: `Bearer ${token}` })
    .send({ id, url })
    .then(handleSuccess)
    .catch(handleError);
