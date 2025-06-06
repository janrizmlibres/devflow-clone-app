import Link from "next/link";

import ROUTES from "@/constants/routes";

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

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link key={_id} href={ROUTES.QUESTION(_id)}>
              {title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
