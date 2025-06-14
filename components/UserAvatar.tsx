import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "size-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {imageUrl && <AvatarImage src={imageUrl} />}
        <AvatarFallback
          className={cn(
            "font-space-grotesk font-bold tracking-wider text-white primary-gradient",
            fallbackClassName
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
