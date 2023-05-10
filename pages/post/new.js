import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    });

    const json = await response.json();

    console.log("Result: ", json.post.postContent);
    setPostContent(json.post.postContent);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <button type='submit' className='btn'>
          Generate
        </button>
      </form>
      <div
        className='max-w-screen-sm p-10'
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
