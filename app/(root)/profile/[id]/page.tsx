import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from "@/lib/actions/user.action";
import { loadSearchParams } from "@/lib/loaders";
import { RouteParams } from "@/types/module";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await loadSearchParams(searchParams);

  if (!id) return notFound();

  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });

  if (!success)
    return (
      <div className="h1-bold text-dark100_light900">{error?.message}</div>
    );

  const { user } = data!;

  const { data: userStats } = await getUserStats({ userId: id });

  const getUserQuestionsPromise = getUserQuestions({
    userId: id,
    page,
    pageSize,
  });
  const getUserAnswersPromise = getUserAnswers({ userId: id, page, pageSize });
  const getUserTopTagsPromise = getUserTopTags({ userId: id });

  const [questionsResponse, answersResponse, tagsResponse] = await Promise.all([
    getUserQuestionsPromise,
    getUserAnswersPromise,
    getUserTopTagsPromise,
  ]);

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = questionsResponse;

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = answersResponse;

  const {
    success: userTagsSuccess,
    data: userTags,
    error: userTagsError,
  } = tagsResponse;

  const { questions, isNext: hasMoreQuestions } = userQuestions!;
  const { answers, isNext: hasMoreAnswers } = userAnswers!;
  const { tags } = userTags!;

  const { _id, name, username, image, bio, portfolio, location, createdAt } =
    user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex-start flex-wrap gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}
              {location && (
                <ProfileLink imgUrl="/icons/location.svg" title="Portfolio" />
              )}
              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={format(createdAt, "MMMM yyyy")}
              />
            </div>

            {bio && (
              <p className="mt-8 paragraph-regular text-dark400_light800">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href="/profile/edit">
              <Button className="min-h-12 min-w-44 btn-secondary px-4 py-3 paragraph-medium text-dark300_light900">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] background-light800_dark400 p-1">
            <TabsTrigger value="top-posts" className="z-10 tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              data={questions}
              empty={EMPTY_QUESTION}
              success={userQuestionsSuccess}
              error={userQuestionsError}
              render={(hotQuestions) => (
                <div className="flex w-full flex-col gap-10">
                  {hotQuestions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={
                        loggedInUser?.user?.id === question.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>

          <TabsContent
            value="answers"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              data={answers}
              empty={EMPTY_ANSWERS}
              success={userAnswersSuccess}
              error={userAnswersError}
              render={(answers) => (
                <div className="flex w-full flex-col gap-10">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="rounded-[10px] card-wrapper px-7 py-9 sm:px-11"
                      showActionBtns={
                        loggedInUser?.user?.id === answer.author._id
                      }
                      showReadMore
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-6 flex flex-col gap-4">
            <DataRenderer
              data={tags}
              empty={EMPTY_TAGS}
              success={userTagsSuccess}
              error={userTagsError}
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map((tag: Tag) => (
                    <TagCard key={tag._id} {...tag} showCount compact />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
