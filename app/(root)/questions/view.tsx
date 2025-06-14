"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { incrementViews } from "@/lib/actions/question.action";

// Increment question views when the component mounts (Approach #1)
const View = ({ questionId }: { questionId: string }) => {
  const handleIncrement = useCallback(async () => {
    const result = await incrementViews({ questionId });

    if (result.success) {
      toast.success("Success", {
        description: "Views incremented",
      });
    } else {
      toast.error("Error", {
        description: result.error?.message,
      });
    }
  }, [questionId]);

  useEffect(() => {
    handleIncrement();
  }, [handleIncrement]);

  return null;
};

export default View;
