import Link from "next/link";
import { SearchParams } from "nuqs/server";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { loadSearchParams } from "@/lib/loaders";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I am new to React and need some guidance on how to start.",
    tags: [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "What is the best way to learn Next.js?",
    description: "Looking for resources and tips to learn Next.js effectively.",
    tags: [
      {
        _id: "3",
        name: "NextJS",
      },
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "2",
      name: "Jane Smith",
      image:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    },
    upvotes: 20,
    answers: 10,
    views: 200,
    createdAt: new Date(),
  },
];

const test = async () => {
  try {
    throw new ValidationError({
      title: ["Required"],
      tags: ["JavaScript is not a valid tag", "React is not a valid tag"],
    });
  } catch (error) {
    return handleError(error);
  }
};
interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Home = async ({ searchParams }: PageProps) => {
  const result = await test();
  console.log(result);

  const { query, filter } = await loadSearchParams(searchParams);

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags.some(
          (tag) => tag.name.toLowerCase() === filter.toLowerCase()
        )
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="min-h-[46px] px-4 py-3 !text-light-900 primary-gradient"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
