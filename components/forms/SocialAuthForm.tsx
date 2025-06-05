"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";

const buttonClass =
  "rounded-2temp min-h-12 flex-1 background-dark400_light900 px-4 py-3.5 body-medium text-dark200_light800";

const SocialAuthForm = () => {
  const router = useRouter();

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      const response = await signIn(provider, {
        redirectTo: ROUTES.HOME,
        redirect: false,
      });

      if (!response.ok) throw new Error(response.error);

      router.push(response.url!);
    } catch (error) {
      console.log(error);

      toast.error("Sign-in Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occured during sign in.",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain invert-colors"
        />
        <span>Log in with GitHub</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
