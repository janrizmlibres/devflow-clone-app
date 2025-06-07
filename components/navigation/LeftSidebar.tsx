import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  const session = await auth();

  return (
    <section className="custom-scrollbar sticky top-0 left-0 flex h-screen flex-col justify-between gap-6 overflow-y-auto border-r light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-sm:hidden lg:w-[266px] dark:shadow-none">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks />
      </div>

      {!session && (
        <div className="flex flex-col gap-3">
          <Button
            className="min-h-[41px] w-full rounded-lg btn-secondary px-4 py-3 small-medium shadow-none"
            asChild
          >
            <Link href={ROUTES.SIGN_IN}>
              <Image
                src="/icons/account.svg"
                alt="Account"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Link>
          </Button>

          <Button
            className="min-h-[41px] w-full rounded-lg border light-border-2 btn-tertiary px-4 py-3 small-medium text-dark400_light900 shadow-none"
            asChild
          >
            <Link href={ROUTES.SIGN_UP}>
              <Image
                src="/icons/sign-up.svg"
                alt="Sign Up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
