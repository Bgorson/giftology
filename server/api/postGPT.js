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
  prompt = `List 50 Amazon products that would be a good gift for someone between the ages of ${age}, who likes  ${hobbies.join(
    `, `
  )}. Include gifts that are related to their interests in  ${hobbies.join(
    `, `
  )}. Make sure the list includes a variety of products beyond just one hobby and ideally involve all of their interests. Output the list in this format: 'Product, Product, Product' No Headers of what category.
  `;

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
      console.log(typeof completion.data.choices[0].message.content.split(","));

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
