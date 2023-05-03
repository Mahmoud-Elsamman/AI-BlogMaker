import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function NewPost(props) {
  return (
    <div>
      <h1>This is the the new post page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
