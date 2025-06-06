import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <>
      <h1 className="pt-24 font-space-grotesk text-3xl font-black">
        Welcome World!
      </h1>
    </>
  );
};

export default Home;
