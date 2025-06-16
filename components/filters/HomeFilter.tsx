"use client";

import { useQueryState } from "nuqs";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const HomeFilter = ({
  filters,
}: {
  filters: { name: string; value: string }[];
}) => {
  const [filter, setFilter] = useQueryState("filter", { shallow: false });

  const handleTypeClick = (value: string) => {
    setFilter((prev) => (prev !== value ? value : null));
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map(({ name, value }) => (
        <Button
          key={name}
          className={cn(
            `rounded-lg px-6 py-3 body-medium capitalize shadow-none`,
            filter === value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleTypeClick(value)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
