import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="size-35 rounded-full" />

          <div className="mt-3">
            <Skeleton className="h-7 w-37" />
            <Skeleton className="mt-2 h-5 w-37" />
            <Skeleton className="mt-5 h-5 w-25" />
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {<Skeleton className="min-h-12 min-w-44" />}
        </div>
      </div>

      <div className="mt-3">
        <Skeleton className="h-6 w-16" />

        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-26 w-full md:h-39" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Loading;
