"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import React, { useEffect, useRef, useState } from "react";

import GlobalResult from "@/components/GlobalResult";
import { Input } from "@/components/ui/input";

const GlobalSearch = () => {
  const [query, setQuery] = useQueryState("global", { defaultValue: "" });
  const [type, setType] = useQueryState("type");

  const [search, setSearch] = useState(query);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setSearch("");
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(search);
      setType(search ? type : null);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, setQuery, setType, type]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="relative flex min-h-[56px] grow items-center gap-1 rounded-xl background-light800_darkgradient px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search anything globally..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none !bg-transparent paragraph-regular placeholder text-dark400_light700 shadow-none no-focus outline-none"
        />
      </div>
      {query && search && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
