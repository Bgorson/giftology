import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const postProduct = (product, token) =>
  request
    .post("/api/products/add_product")
    .set({ authorization: `Bearer ${token}` })
    .send({ product })
    .then(handleSuccess)
    .catch(handleError);
