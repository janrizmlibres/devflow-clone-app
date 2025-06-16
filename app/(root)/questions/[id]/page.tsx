import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { loadSearchParams } from "@/lib/loaders";
import { formatNumber } from "@/lib/utils";
import { RouteParams } from "@/types/module";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await loadSearchParams(searchParams);
  const { success, data: question } = await getQuestion({ questionId: id });

  // Increment question views when user visits the page (Approach #2)
  // const [, { success, data: question }] = await Promise.all([
  //   incrementViews({ questionId: id }),
  //   getQuestion({ questionId: id }),
  // ]);

  // Increment question views after the component is rendered (Approach #3)
  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) return redirect("/404");

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({ questionId: id, page, pageSize, filter });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "Question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  const { author, createdAt, answers, views, tags, content, title } = question;

  return (
    <>
      {/* Needed for the Approach #1 */}
      {/* <View questionId={id} /> */}

      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <SessionProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <Votes
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
                  targetType="Question"
                  targetId={question._id}
                  hasVotedPromise={hasVotedPromise}
                />
              </Suspense>

              <Suspense fallback={<div>Loading...</div>}>
                <SaveQuestion
                  questionId={question._id}
                  hasSavedQuestionPromise={hasSavedQuestionPromise}
                />
              </Suspense>
            </SessionProvider>
          </div>
        </div>

        <h2 className="mt-3.5 w-full h2-semibold text-dark200_light900">
          {title}
        </h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="Clock Icon"
          value={` asked ${formatDistanceToNow(new Date(createdAt))} ago`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="Message Icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="Eye Icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} {...tag} compact />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <SessionProvider>
          <AnswerForm
            questionId={question._id}
            questionTitle={question.title}
            questionContent={question.content}
          />
        </SessionProvider>
      </section>
    </>
  );
};

export default QuestionDetails;
