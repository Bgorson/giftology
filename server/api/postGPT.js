const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const postGPT = async ({ who, name, age, occasion, hobbies, type, tags }) => {
  const prompt = `Give me a list of 5 Amazon Products and their IDs that would be a good gift for this kind of person:
  between the ages of ${age}  and likes ${hobbies.join(
    ", "
  )}, and is ${type.join(", ")}, and likes ${tags.join(
    ", "
  )} for ${occasion}. Output it in this format: [Product Name] (ID: [Product ID]) - [Product Description]`;

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: "I'm trying to pick out a perfect gift" },
        ],
        messages: [{ role: "user", content: prompt }],
      },
      {
        httpsAgent: agent,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return completion.data.choices[0];
  } catch (err) {
    return err;
  }
};
module.exports = postGPT;
