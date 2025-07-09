import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="mb-9 h1-bold text-dark100_light900">Ask a question</h1>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-23" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div>
          <Skeleton className="mb-2 h-4 w-61" />
          <Skeleton className="mb-4.5 h-98 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <Skeleton className="mt-26 ml-auto h-9 w-33" />
    </section>
  );
};

export default Loading;
