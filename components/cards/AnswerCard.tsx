import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";

import Preview from "../editor/Preview";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
}: Answer) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "Answer",
  });

  return (
    <article className="border-b light-border py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="mt-0.5 ml-0.5 line-clamp-1 small-regular text-light400_light500">
              <span className="max-sm:hidden"> • </span>
              answered {formatDistanceToNow(createdAt)} ago
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <SessionProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={upvotes}
                downvotes={downvotes}
                targetType="Answer"
                targetId={_id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
          </SessionProvider>
        </div>
      </div>

      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
