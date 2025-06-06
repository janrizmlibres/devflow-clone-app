import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";

import NavLinks from "./NavLinks";

const MobileNavigation = async () => {
  const session = await auth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none background-light900_dark200 p-5"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/site-logo.svg"
            width={23}
            height={23}
            alt="Devflow Logo"
          />

          <p className="font-space-grotesk h2-bold text-dark-100 dark:text-light-900">
            Dev <span className="text-primary-500">Flow</span>
          </p>
        </Link>

        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between gap-6 overflow-y-auto pt-16">
          <section className="flex flex-col gap-6">
            <NavLinks isMobileNav />
          </section>

          {!session && (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href={ROUTES.SIGN_IN}>
                  <Button className="min-h-[41px] w-full rounded-lg btn-secondary px-4 py-3 small-medium shadow-none">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={ROUTES.SIGN_UP}>
                  <Button className="min-h-[41px] w-full rounded-lg border light-border-2 btn-tertiary px-4 py-3 small-medium text-dark400_light900 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
