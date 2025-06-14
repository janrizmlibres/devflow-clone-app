import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);

  const content = (
    <>
      <Badge className="flex flex-row gap-2 rounded-md border-none background-light800_dark300 px-4 py-2 subtle-medium text-light400_light500 uppercase">
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

  return isButton ? (
    <button className="flex justify-between gap-2" type="button">
      {content}
    </button>
  ) : (
    <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
      {content}
    </Link>
  );
};

export default TagCard;
