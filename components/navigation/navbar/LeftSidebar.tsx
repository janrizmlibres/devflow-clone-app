import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import NavLinks from "./NavLinks";

const LeftSidebar = async () => {
  const session = await auth();

  return (
    <div className="custom-scrollbar flex h-[calc(100vh-84px)] flex-col justify-between overflow-y-auto background-light900_dark200 p-5 pt-16 max-sm:hidden lg:basis-[265px]">
      <section className="flex flex-col justify-center gap-6">
        <NavLinks />
      </section>

      {!session && (
        <div className="mt-6 flex flex-col gap-3">
          <Link href={ROUTES.SIGN_IN}>
            <Button className="min-h-[41px] w-full rounded-lg btn-secondary px-4 py-3 small-medium shadow-none">
              <Image
                src="/icons/account.svg"
                alt="Sign In"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href={ROUTES.SIGN_UP}>
            <Button className="min-h-[41px] w-full rounded-lg border light-border-2 btn-tertiary px-4 py-3 small-medium text-dark400_light900 shadow-none">
              <Image
                src="/icons/sign-up.svg"
                alt="Sign Un"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
