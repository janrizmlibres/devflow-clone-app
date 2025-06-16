import DataRenderer from "@/components/DataRenderer";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { loadSearchParams } from "@/lib/loaders";
import { RouteParams } from "@/types/module";

const Collections = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } =
    await loadSearchParams(searchParams);

  const { success, data, error } = await getSavedQuestions({
    page,
    pageSize,
    query,
    filter,
  });

  const { collection: collections } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Collections</h1>

      {/* <div className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!"
          className="flex-1"
        />
      </div> */}

      <DataRenderer
        empty={EMPTY_COLLECTIONS}
        success={success}
        error={error}
        data={collections}
        render={(collections) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {collections.map((collection) => (
              <p key={collection._id.toString()}>
                {collection.question.toString()}
              </p>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Collections;
