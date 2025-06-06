import Image from "next/image";
import Link from "next/link";

import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className="fixed z-50 flex-between w-full gap-5 background-light900_dark200 p-6 shadow-light-300 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="Devflow Logo"
        />

        <p className="font-space-grotesk h2-bold text-dark-100 max-sm:hidden dark:text-light-900">
          Dev <span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">
        <Theme />
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
