"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import { Input } from "../ui/input";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  className?: string;
}

const LocalSearch = ({ imgSrc, placeholder, className }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    let queryString = "";

    if (searchQuery) {
      queryString = formUrlQuery({
        params: searchParams.toString(),
        key: "query",
        value: searchQuery,
      });
    } else {
      queryString = removeKeyFromUrlQuery({
        params: searchParams.toString(),
        keyToRemove: ["query"],
      });
    }

    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [pathname, router, searchParams, searchQuery]);

  return (
    <div
      className={`flex min-h-[56px] grow items-center gap-4 rounded-[10px] background-light800_darkgradient px-4 ${className}`}
    >
      <Image
        src={imgSrc}
        width={24}
        height={24}
        alt="Search"
        className="cursor-pointer"
      />

      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-none !bg-transparent paragraph-regular placeholder text-dark400_light700 shadow-none no-focus outline-none"
      />
    </div>
  );
};

export default LocalSearch;
