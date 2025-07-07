import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ROUTES from "@/constants/routes";

const loading = () => {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="min-h-[46px] px-4 py-3 !text-light-900 primary-gradient"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] flex-1 grow" />
        <Skeleton className="min-h-[56px] flex-1 grow sm:hidden" />
      </div>

      <div className="my-10 hidden flex-wrap gap-3 sm:flex">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-9 w-24" />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-45 w-full" />
        ))}
      </div>
    </section>
  );
};

export default loading;
