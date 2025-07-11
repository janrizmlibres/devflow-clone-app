import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  isAuthor?: boolean;
  textStyles: string;
  imgStyles?: string;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      {imgUrl ? (
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`rounded-full object-contain ${imgStyles}`}
        />
      ) : (
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-full background-light800_dark400 text-[10px] ${imgStyles}`}
        >
          ?
        </div>
      )}

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        {title && (
          <span className={cn(`line-clamp-1 small-regular`, titleStyles)}>
            {title}
          </span>
        )}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
