import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openAI = new OpenAIApi(config);

  const { topic, keywords } = req.body;
  //   const topic = "Top 10 tips for dog owners";
  //   const keywords =
  //     "first-time dog owner, common dog health issues, best dog breeds";

  const response = await openAI.createCompletion({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 3600,
    prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following comma-seperated words: ${keywords}.
    The content should be formatted in SEO-friendly HTML.
    The response must also include appropriate HTML title and meta discription content.
    The return format must be stringified JSON in the following format:
    {
        "postContent": post content here,
        "title": title goes here,
        "metaDescription": meta description goes here
    }`,
  });

  const response2 = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following comma-seperated words: ${keywords}.
            The content should be formatted in SEO-friendly HTML.
            The response must also include appropriate HTML title and meta discription content.
            The return format must be stringified JSON in the following format:
            {
                "postContent": post content here,
                "title": title goes here,
                "metaDescription": meta description goes here
            }`,
      },
    ],
    max_tokens: 3600,
    temperature: 0,
  });

  console.log(response2);
  res.status(200).json({
    post: JSON.parse(
      response2.data.choices[0]?.message.content.split("\n").join("")
    ),
  });
}
