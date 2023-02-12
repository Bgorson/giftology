import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postToMailingList = (userName, email) =>
  request
    .post("/api/user/mailingList")
    .send({ userName, email })
    .then(handleSuccess)
    .catch(handleError);
