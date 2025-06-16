import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import { loadSearchParams } from "@/lib/loaders";
import { RouteParams } from "@/types/module";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } =
    await loadSearchParams(searchParams);

  const { success, data, error } = await getUsers({
    page,
    pageSize,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!"
          className="flex-1"
        />

        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] min-w-[170px]"
        />
      </div>

      <DataRenderer
        empty={EMPTY_USERS}
        success={success}
        error={error}
        data={users}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
