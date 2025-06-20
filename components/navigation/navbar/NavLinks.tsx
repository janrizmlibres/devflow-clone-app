"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.label === "Profile") {
          if (userId) item.route = ROUTES.PROFILE(userId.toString());
          else return null;
        }

        const LinkComponent = (
          <Link
            href={item.route}
            className={cn(
              isActive
                ? "rounded-lg text-light-900 primary-gradient"
                : "text-dark300_light900",
              !isMobileNav && "max-lg:flex-center",
              "flex-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose key={item.label} asChild>
            {LinkComponent}
          </SheetClose>
        ) : (
          <Fragment key={item.label}>{LinkComponent}</Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
