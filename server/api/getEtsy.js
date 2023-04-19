const { default: axios } = require("axios");
const axiosThrottle = require("axios-request-throttle");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false,
});
axiosThrottle.use(axios, { requestsPerSecond: 15 });

require("dotenv").config();

const apiKey = process.env.ETSY;

const getEtsyProduct = async (listingID) => {
  try {
    const response = await axios.get(
      `https://api.etsy.com/v3/application/listings/${listingID}&includes=images`,
      {
        httpsAgent: agent,
        headers: {
          "x-api-key": `${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getImage = async (id) => {
  const product = await getEtsyProduct(id);
  if (product && product.images && product.images[0]) {
    return product.images[0].url_fullxfull;
  } else {
    console.log("Not found");
    return null;
  }
};

module.exports = getImage;
