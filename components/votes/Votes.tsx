"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { toast } from "sonner";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";

interface Props {
  upvotes: number;
  downvotes: number;
  targetType: "Question" | "Answer";
  targetId: string;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({
  upvotes,
  downvotes,
  targetType,
  targetId,
  hasVotedPromise,
}: Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);

  const [isLoading, setIsLoading] = useState(false);
  const [bouncing, setBouncing] = useState<"upvote" | "downvote" | null>(null);

  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast("Please login to vote", {
        description: "Only logged-in users can vote.",
      });

    setIsLoading(true);
    setBouncing(voteType);

    // Reset bounce after animation
    setTimeout(() => setBouncing(null), 300);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success)
        return toast.error("Failed to vote", {
          description: result.error?.message,
        });

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast(successMessage, { description: "Your vote has been recorded." });
    } catch {
      toast.error("Failed to vote", {
        description: "An error occured while voting. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"} ${bouncing === "upvote" ? "animate-bounce-fast" : ""}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center min-w-5 rounded-sm background-light700_dark400 p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"} ${bouncing === "downvote" ? "animate-bounce-fast" : ""}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center min-w-5 rounded-sm background-light700_dark400 p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
