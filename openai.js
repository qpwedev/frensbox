require("dotenv").config();

const requestText =
  "please recommend what to talk about with a friend if we talked about %keywords%. create a bullet point list, only use 1 or 2 from the keywords. suggest the original ways how we can meet. be short. 50 words max";

function createStringFromKeywords(keywords) {
  let stringOfKeywords = "";
  for (let i = 0; i < keywords.length; i++) {
    if (i === keywords.length - 1) {
      stringOfKeywords += "and " + keywords[i];
    } else {
      stringOfKeywords += keywords[i] + ", ";
    }
  }

  return stringOfKeywords;
}

function insertKeywords(keywords) {
  const stringOfKeywords = createStringFromKeywords(keywords);
  let requestTextWithKeywords = requestText.replace(
    "%keywords%",
    stringOfKeywords
  );
  return requestTextWithKeywords;
}

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const keywords = ["dogs", "cats", "birds"];

async function main() {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: insertKeywords(keywords),
    temperature: 1,
    max_tokens: 10 ,
  });

  console.log(response.data);
}

main();
