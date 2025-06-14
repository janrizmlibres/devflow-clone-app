"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  imgSrc: string;
  placeholder: string;
  iconPosition?: "left" | "right";
  className?: string;
}

const LocalSearch = ({
  imgSrc,
  placeholder,
  iconPosition = "left",
  className,
}: Props) => {
  const [query, setQuery] = useQueryState("query", { defaultValue: "" });
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchInput, { shallow: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, setQuery]);

  return (
    <div
      className={`flex min-h-[56px] grow items-center gap-4 rounded-[10px] background-light800_darkgradient px-4 ${className}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border-none !bg-transparent paragraph-regular placeholder text-dark400_light700 shadow-none no-focus outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={15}
          height={15}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
