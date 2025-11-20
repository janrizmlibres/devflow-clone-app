import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { cn, getDeviconClassName, getTechDescription, getTagColor } from "@/lib/utils";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);
  const badgeColor = getTagColor(name);

  const content = (
    <>
      <Badge className={cn("flex flex-row gap-2 rounded-full border-none px-4 py-2 subtle-medium uppercase transition-all hover:shadow-sm", badgeColor)}>
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="Close Icon"
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact)
    return isButton ? (
      <button className="flex justify-between gap-2" type="button">
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {content}
      </Link>
    );

  return (
    <Link
      href={ROUTES.TAG(_id)}
      className="shadow-light100_darknone max-sm:w-full"
    >
      <article className="flex flex-col rounded-2xl border light-border card-wrapper card-interactive px-8 py-10 sm:w-[260px]">
        <div className="flex-between gap-3">
          <div className="w-fit rounded-sm background-light800_dark400 px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>

          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="mt-5 line-clamp-3 w-full small-regular text-dark500_light700">
          {iconDescription}
        </p>

        <p className="mt-3.5 small-medium text-dark400_light500">
          <span className="mr-2.5 primary-text-gradient body-semibold">
            {questions}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
