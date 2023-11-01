const { Configuration, OpenAIApi } = require("openai");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false,
});
const ageMap = {
  "0-2": "an Infant",
  "3-5": "a Toddler",
  "6-11": "a Child",
  "12-20": "a Teen",
  "21-44": "an Adult",
  "45-65": "a Senior",
  "65-100": "an Elderly Adult",
};

const postGPT = async ({
  who,
  name,
  age,
  occasion,
  hobbies,
  type,
  tags,
  gender,
  moreLikeThis,
  lessLikeThis,
  isFirstMessage,
  demo,
  productSpecific,
  product,
}) => {
  if (productSpecific) {
    prompt = `What category, tags and hobbies would you associate with ${product}? Format response as: 'Category: Category, Tags: [Tag, Tag, Tag]' and 'Hobbies: [Hobby, Hobby, Hobby]'`;
    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      try {
        const completion = await openai.createChatCompletion(
          {
            model: "gpt-3.5-turbo",
            temperature: 1,
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
                  "I am trying to get additional information on a product",
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
        var lines = completion.data.choices[0].message.content.split("\n");

        // Create an empty object to store the result
        var result = {};

        // Loop through each line of the input string
        lines.forEach(function (line) {
          // Split the line into key and values
          var parts = line.split(":");
          if (parts.length === 2) {
            // Trim the key and values, and split values into an array
            var key = parts[0].trim();
            var values = parts[1].trim().split(", ");
            // Add key-value pair to the result object
            result[key] = values;
          }
        });
        return result;
      } catch (error) {
        console.log("Error:", error.message);
        return null;
      }
    } catch (error) {
      console.log("Error:", error.message);
      return null;
    }
  } else {
    const ageRange = ageMap[age];
    let formattedTags = [...tags];
    formattedTags.forEach((tag, index) => {
      if (tag === "healthNut") {
        formattedTags[index] = "Health Nut";
      } else if (tag === "MustOwn") {
        formattedTags[index] = "Must Own";
      } else if (tag === "boardGames") {
        formattedTags[index] = "Board Games";
      } else if (tag === "bathAndBody") {
        formattedTags[index] = " Bath And Body";
      } else if (tag === "justForFun") {
        formattedTags[index] = " Just For Fun";
      } else if (tag === "artsAndCrafts") {
        formattedTags[index] = " Arts And Crafts";
      } else if (tag === "samplerkits") {
        formattedTags[index] = " Sampler Kits";
      } else {
        formattedTags[index] = " " + tag.charAt(0).toUpperCase() + tag.slice(1);
      }
    });
    let formattedHobbies = [...hobbies];
    formattedHobbies.forEach((hobby, index) => {
      if (hobby === "artsAndCrafts") {
        formattedHobbies[index] = "Arts And Crafts";
      } else if (hobby === "healthAndWellness") {
        formattedHobbies[index] = "Health And Wellness";
      } else if (hobby === "boardGames") {
        formattedHobbies[index] = "Board Games";
      } else if (hobby === "mixology") {
        formattedHobbies[index] = "Home Chef/Cooking";
      } else if (hobby === "homeChef") {
        formattedHobbies[index] = "Mixology/Alcohol";
      }
    });

    let prompt = "";
    prompt = `List ${
      demo ? `10` : `3`
    } special Amazon products that would be a good gift for ${ageRange} ${
      gender === "male" || gender === "female" ? gender : ""
    } ${
      formattedTags ? `that is ${formattedTags.join(", ")}` : ""
    }, who likes  ${
      formattedHobbies ? formattedHobbies.join(`, `) : "anything"
    }. Make sure the list includes a variety of products beyond just one hobby and ideally incorporates all of their interests and is age appropriate. If you can't think of anything- just pick ${
      demo ? `10` : `3`
    } unique gifts. Output the list in this format: 'Product, Product, Product' No Headers of what category.
  `;

    console.log("PROMPT", prompt);

    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      try {
        const completion = await openai.createChatCompletion(
          {
            model: "gpt-3.5-turbo",
            temperature: 1,
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
        console.log(
          typeof completion.data.choices[0].message.content.split(",")
        );

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
  }
};
module.exports = postGPT;
