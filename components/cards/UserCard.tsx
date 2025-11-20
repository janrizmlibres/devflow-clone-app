import Link from "next/link";

import ROUTES from "@/constants/routes";

import UserAvatar from "../UserAvatar";

const UserCard = ({ _id, name, image, username }: User) => {
  return (
    <div className="w-full shadow-light100_darknone xs:w-[230px]">
      <article className="flex-center w-full flex-col rounded-2xl border light-border card-wrapper card-interactive p-8">
        <UserAvatar
          id={_id}
          name={name}
          imageUrl={image}
          className="size-[100px] rounded-full object-cover"
          fallbackClassName="text-3xl tracking-widest"
        />

        <Link href={ROUTES.PROFILE(_id)}>
          <div className="mt-4 text-center">
            <h3 className="line-clamp-1 h3-bold text-dark200_light900">
              {name}
            </h3>
            <p className="mt-2 body-regular text-dark500_light500">
              @{username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;
