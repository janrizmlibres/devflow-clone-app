import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";

import DataRenderer from "../DataRenderer";

const RightSidebar = async () => {
  const { success, data: hotQuestions = [], error } = await getHotQuestions();

  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
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

      {/* <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <TagCard key={tag._id} {...tag} showCount compact />
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default RightSidebar;
