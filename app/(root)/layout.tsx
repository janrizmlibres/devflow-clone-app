import Navbar from "@/components/navigation/navbar";
import LeftSidebar from "@/components/navigation/navbar/LeftSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative flex background-light850_dark100">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto">{children}</div>
        </section>
      </main>
    </>
  );
};

export default RootLayout;
