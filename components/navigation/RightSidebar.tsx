import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l border-light-800 dark:border-dark-400/50 bg-light-900/50 dark:bg-dark-200/50 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none backdrop-blur-lg">
      <div className="rounded-2xl bg-light-800/50 dark:bg-dark-300/30 p-6 shadow-sm">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet.",
          }}
          success={success}
          error={error}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex-between cursor-pointer gap-7"
                >
                  <p className="line-clamp-2 body-medium text-dark500_light700">
                    {title}
                  </p>

                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-light-800/50 dark:bg-dark-300/30 p-6 shadow-sm">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          data={tags}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet.",
          }}
          success={tagSuccess}
          error={tagError}
          render={(popularTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {popularTags.map((tag) => (
                <TagCard key={tag._id} {...tag} showCount compact />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
