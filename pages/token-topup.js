import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenPage() {
  const handleClick = async () => {
    await fetch("/api/addTokens", {
      method: "POST",
    });
  };
  return (
    <div>
      <h1>This is the the token page</h1>
      <button className='btn' onClick={handleClick}>
        Add Tokens
      </button>
    </div>
  );
}

TokenPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
