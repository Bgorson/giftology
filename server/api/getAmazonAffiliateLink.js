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

const getAffiliateInformation = async () => {
  const requestParameters = {
    Keywords: "Harry Potter",
    SearchIndex: "Books",
    ItemCount: 2,
    Resources: [
      "Images.Primary.Medium",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
  };

  try {
    const response = await amazonPaapi.SearchItems(
      commonParameters,
      requestParameters
    );
    console.log(response); // Handle the success response.
  } catch (error) {
    console.log(error); // Handle the error.
  }
};

module.exports = getAffiliateInformation;
