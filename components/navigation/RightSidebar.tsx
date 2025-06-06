import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";

import TagCard from "../cards/TagCard";

const hotQuestions = [
  {
    _id: "1",
    title: "How to create a custom hook in React?",
  },
  {
    _id: "2",
    title: "How to use React Query?",
  },
  {
    _id: "3",
    title: "What is the difference between useState and useReducer?",
  },
  {
    _id: "4",
    title: "How to optimize performance in React applications?",
  },
  {
    _id: "5",
    title: "What are the best practices for state management in React?",
  },
];

const popularTags = [
  {
    _id: "1",
    name: "react",
    questions: 100,
  },
  {
    _id: "2",
    name: "javascript",
    questions: 80,
  },
  {
    _id: "3",
    name: "css",
    questions: 60,
  },
  {
    _id: "4",
    name: "html",
    questions: 50,
  },
  {
    _id: "5",
    name: "nextjs",
    questions: 40,
  },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.QUESTION(_id)}
              className="flex-between cursor-pointer gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>

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
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <TagCard key={tag._id} {...tag} showCount compact />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
