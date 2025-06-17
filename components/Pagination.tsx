"use client";

import { useQueryState } from "nuqs";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface Props {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page, isNext, containerClasses }: Props) => {
  const [, setPage] = useQueryState("page", {
    shallow: false,
    defaultValue: "1",
  });

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    setPage(nextPageNumber.toString());
  };

  return (
    <div className={cn("mt-5 flex-center w-full gap-2", containerClasses)}>
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="flex-center min-h-[36px] gap-2 border light-border-2 btn"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="flex-center min-h-[36px] gap-2 border light-border-2 btn"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
