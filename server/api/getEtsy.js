const { default: axios } = require('axios');
require('dotenv').config();

const apiKey = process.env.ETSY;

const baseURL = `https://openapi.etsy.com/v2/listings/:listing_id?api_key=${apiKey}&includes=MainImage`;
//turn this into a get function that works
//To test, get this activated on a route
// The logic being if the  website is Etsy- run it through the etst fetcher and add it as a property of the products
const getEstyProduct = async (listingID) => {
  console.log('id', listingID);
  try {
    return await axios.get(
      `https://openapi.etsy.com/v2/listings/${listingID}?api_key=${apiKey}&includes=MainImage`
    );
  } catch (error) {
    console.error(error);
  }
};

const getImage = async (id) => {
  const product = await getEstyProduct(id);
  let image;

  if (product.data.results[0].MainImage) {
    image = product.data.results[0].MainImage.url_fullxfull;
    return image;
  } else console.log('Not found');
};
module.exports = getImage;