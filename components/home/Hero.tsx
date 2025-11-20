import Link from "next/link";
import React from "react";

import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Hero = async () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[20px] bg-light-900 px-8 py-16 shadow-light-100 dark:bg-dark-200 dark:shadow-none sm:px-12 border border-light-800 dark:border-dark-400/50">
      {/* Decorative Background */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-500/10"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-500/10"></div>

      <div className="relative z-10 flex flex-1 flex-col items-center gap-6 text-center">
        <h1 className="h1-bold text-dark100_light900 max-w-[600px]">
          Unleash your <span className="primary-text-gradient">Developer</span>{" "}
          Potential
        </h1>
        <p className="paragraph-regular text-dark500_light700 max-w-[500px]">
          Join the community of developers to share knowledge, solve complex
          problems, and build your career.
        </p>

        <div className="mt-4 flex w-full max-w-[600px] flex-col gap-4 sm:flex-row">
          <LocalSearch
            imgSrc="/icons/search.svg"
            placeholder="Search for answers..."
            className="flex-1 shadow-md dark:shadow-none"
          />
          <Button
            className="primary-gradient min-h-[56px] px-4 py-3 !text-light-900"
            asChild
          >
            <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
