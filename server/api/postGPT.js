const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const postGPT = async ({
  who,
  name,
  age,
  occasion,
  hobbies,
  type,
  tags,
  moreLikeThis,
  lessLikeThis,
  isFirstMessage,
}) => {
  let prompt = "";
  prompt = `Give me a list of 50 amazon product names seperated by commas that would be a good gift for this kind of person: someone between the ages of ${age} and likes ${hobbies.join(`
  `)}, and wants something ${type.join(
    ", "
  )}, and is they type of person that is ${tags.join(
    ", "
  )} for any occassion. Output it in this format: 'Product, Product, Product'`;
  // if (moreLikeThis.length > 0 || lessLikeThis.length > 0) {
  //   const intro = isFirstMessage
  //     ? `Remember that I'm trying to get a gift for someone who likes ${hobbies.join(
  //         ", "
  //       )} and is ${type.join(", ")} and likes ${tags.join(
  //         ", "
  //       )} for ${occasion}. Please `
  //     : `Based off my last request and what I told you to remember`;
  //   prompt = `${intro}, give me more products like ${moreLikeThis.join(
  //     ","
  //   )}, and less products like ${lessLikeThis.join(
  //     ","
  //   )}. Please show me just the product name seperated by commas like this: "Product, Product, Product". No repeats from earlier`;
  // } else {
  //   prompt = `Give me a list of 6 Amazon Products and their IDs that would be a good gift for this kind of person:
  //   between the ages of ${age}  and likes ${hobbies.join(
  //     ", "
  //   )}, and is ${type.join(", ")}, and likes ${tags.join(
  //     ", "
  //   )} for ${occasion}. Output it in this format: [Product Name] (ID: [Product ID]) - [Product Description]`;
  // }
  console.log("PROMMPT", prompt);

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try {
      const completion = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          temperature: 0,
          frequency_penalty: 1,
          presence_penalty: 0,
          messages: [
            // {
            //   role: "system",
            //   content: `The following is a conversation with an Amazon Gift Finder Bot. The bot only responds with a list of responses seperated by commas. No extra comments.`,
            // },
            {
              role: "user",
              content:
                "I am looking for a gift for someone and only want your response to be the list of product names seperated by commas with no additional information or numbers. Output it in this format: 'Product, Product, Product'",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          httpsAgent: agent,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(completion.data.choices[0].message.content.split(","));
      const response = completion.data.choices[0].message.content.split(",");
      return response.map((item) => {
        return item.trim();
      });
    } catch (error) {
      console.log("Error:", error.message);
      return null;
    }
  } catch (error) {
    console.log("Error:", error.message);
    return null;
  }
};
module.exports = postGPT;
