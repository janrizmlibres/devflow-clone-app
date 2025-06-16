import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";
import { loadSearchParams } from "@/lib/loaders";
import { RouteParams } from "@/types/module";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } =
    await loadSearchParams(searchParams);

  const { success, data, error } = await getTags({
    page,
    pageSize,
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-3xl text-dark100_light900">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          className="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] min-w-[170px]"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Tags;
