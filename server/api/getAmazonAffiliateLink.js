// Take a product name
// Search for it to get the amazon URL
// Generate the amazon affiliate link from it
const amazonPaapi = require("amazon-paapi");
require("dotenv").config();
const awsAccess = process.env.AMAZON_ACCESS;
const awsSecret = process.env.AMAZON_SECRET;
const awsTAG = process.env.AFFLIATE_TRACKING;

const commonParameters = {
  AccessKey: awsAccess,
  SecretKey: awsSecret,
  PartnerTag: awsTAG,
  Marketplace: "www.amazon.com",
  PartnerType: "Associates",
  Host: "webservices.amazon.com",
  Region: "us-east-1",
};

const getAffiliateInformation = async ({ productName }) => {
  const requestParameters = {
    Keywords: productName,
    SearchIndex: "All",
    ItemCount: 2,
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
  };

  try {
    const response = await amazonPaapi.SearchItems(
      commonParameters,
      requestParameters
    );
    // const amazonProduct = response.SearchResult.Items[0];

    return {
      productName: response.SearchResult.Items[0].ItemInfo.Title.DisplayValue,
      directImageSrc: response.SearchResult.Items[0].Images.Primary.Large.URL,
      link: response.SearchResult.Items[0].DetailPageURL,
      price:
        response.SearchResult.Items[0].Offers.Listings[0].Price.DisplayAmount,
    };
  } catch (error) {
    return error;
  }
};

module.exports = getAffiliateInformation;
