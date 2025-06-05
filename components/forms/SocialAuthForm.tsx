import Image from "next/image";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className="rounded-2temp min-h-12 flex-1 background-dark400_light900 px-4 py-3.5 body-medium text-dark200_light800">
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain invert-colors"
        />
      </Button>
    </div>
  );
};

export default SocialAuthForm;
