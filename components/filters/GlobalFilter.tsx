"use client";

import { useQueryState } from "nuqs";

import { GlobalSearchFilters } from "@/constants/filters";

const GlobalFilter = () => {
  const [active, setActive] = useQueryState("type");

  const handleTypeClick = (item: string) => {
    setActive((prev) => (prev !== item ? item : null));
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="body-medium text-dark400_light900">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`rounded-2xl light-border-2 px-5 py-2 small-medium capitalize ${
              active === item.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
            }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;
