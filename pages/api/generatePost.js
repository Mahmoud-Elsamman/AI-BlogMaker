import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("AI-BlogMaker");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openAI = new OpenAIApi(config);

  const { topic, keywords } = req.body;
  //   const topic = "Top 10 tips for dog owners";
  //   const keywords =
  //     "first-time dog owner, common dog health issues, best dog breeds";
  if (!topic || !keywords || topic.length > 80 || keywords.length > 80) {
    res.status(422);
    return;
  }

  const response = await openAI.createCompletion({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 3600,
    prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
    The content should be formatted in SEO-friendly HTML.
    The response must also include appropriate HTML title and meta description content.
    The return format must be stringified JSON in the following format:
    {
      "postContent": post content here
      "title": title goes here
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

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const parsed = JSON.parse(
    response.data.choices[0]?.text.split("\n").join("")
  );

  // const parsed2 = JSON.parse(
  //   response2.data.choices[0]?.message.content.split("\n").join("")
  // );

  const post = await db.collection("posts").insertOne({
    postContent: parsed?.postContent,
    title: parsed?.title,
    metaDescription: parsed?.metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    postId: post.insertedId,
  });
});
