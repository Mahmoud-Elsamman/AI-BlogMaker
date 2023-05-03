import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function TokenPage() {
  return (
    <div>
      <h1>This is the the token page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
