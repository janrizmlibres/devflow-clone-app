import Navbar from "@/components/navigation/navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
    </>
  );
};

export default RootLayout;
