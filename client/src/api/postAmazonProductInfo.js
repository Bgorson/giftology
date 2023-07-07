import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postAmazonProductInfo = (productName) =>
  request
    .post("/api/v2/quiz/amazon")
    .send({ productName })
    .then(handleSuccess)
    .catch(handleError);
