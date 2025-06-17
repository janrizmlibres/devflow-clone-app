import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn } from "@/lib/utils";

import Preview from "../editor/Preview";
import EditDeleteAction from "../user/EditDeleteAction";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

interface Props extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
}

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}: Props) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "Answer",
  });

  return (
    <article
      className={cn("relative border-b light-border py-10", containerClasses)}
    >
      <span id={`answer-${_id}`} className="hash-span" />

      {showActionBtns && (
        <div className="absolute -top-5 -right-2 flex-center size-9 rounded-full background-light800_dark300">
          <EditDeleteAction type="Answer" itemId={_id} />
        </div>
      )}

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

      {showReadMore && (
        <Link
          href={`${ROUTES.QUESTION(question)}#answer-${_id}`}
          className="relative z-10 font-space-grotesk body-semibold text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
