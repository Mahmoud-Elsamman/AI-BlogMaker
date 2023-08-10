import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenPage() {
  const handleClick = async () => {
    const result = await fetch("/api/addTokens", {
      method: "POST",
    });

    const json = await result.json();

    console.log("RESULT: ", json);

    window.location.href = json.session.url;
  };
  return (
    <div className='h-screen overflow-hidden flex justify-center items-center relative'>
      <div className='flex flex-col items-center justify-center h-3/4 w-3/4 relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm'>
        <div>
          <h1 className='mb-0'>Start add Tokens now!</h1>
          <p>add tokens to start create your blog posts. </p>
          <button className='btn mt-8' onClick={handleClick}>
            Add Tokens
          </button>
        </div>
      </div>
    </div>
  );
}

TokenPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
