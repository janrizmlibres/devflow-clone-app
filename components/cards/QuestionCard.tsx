import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import ROUTES from "@/constants/routes";

import TagCard from "./TagCard";
import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}

const QuestionCard = async ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
  showActionBtns = false,
}: Props) => {
  const formattedDate = formatDistanceToNow(createdAt);

  return (
    <div className="rounded-[10px] card-wrapper p-9 sm:px-11">
      <div className="flex-between flex-col-reverse gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="line-clamp-1 flex subtle-regular text-dark400_light700 sm:hidden">
            {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)} ago
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="line-clamp-1 flex-1 base-semibold text-dark200_light900 sm:h3-semibold">
              {title}
            </h3>
          </Link>
        </div>

        {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} {...tag} compact />
        ))}
      </div>

      <div className="mt-6 flex-between w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${formattedDate} ago`}
          href={ROUTES.PROFILE(author._id)}
          isAuthor
          textStyles="body-medium text-dark400_light700"
          titleStyles="max-sm:hidden"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="Like"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="Answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="Views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
