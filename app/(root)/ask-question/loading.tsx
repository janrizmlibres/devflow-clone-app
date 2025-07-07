import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="flex flex-col gap-10">
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-98 w-full" />
      <Skeleton className="h-9 max-w-33" />
    </section>
  );
};

export default Loading;
