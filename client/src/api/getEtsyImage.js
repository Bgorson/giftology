import request from "superagent";
import { handleSuccess, handleError } from "./utils";

export const getEtsyImage = (listingId) =>
  request
    .get(`/api/quiz/etsyImages?listingId=${listingId}`)
    .then(handleSuccess)
    .catch(handleError);
