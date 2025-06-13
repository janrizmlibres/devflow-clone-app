"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useTransition } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";

import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>
  ) => {
    startTransition(async () => {
      const result =
        isEdit && question
          ? await editQuestion({
              questionId: question._id,
              ...data,
            })
          : await createQuestion(data);

      if (result.success) {
        toast.success("Success", {
          description: `Question ${!isEdit ? "created" : "updated"} successfully`,
        });

        router.push(ROUTES.QUESTION(result.data!._id.toString()));
      } else {
        toast.error(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong",
        });
      }
    });
  };

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<
      { title: string; content: string; tags: string[] },
      "tags"
    >
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (!tagInput) return;

      if (field.value.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must not exceed 15 characters.",
        });
        return;
      }

      if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists.",
        });
        return;
      }

      form.setValue("tags", [...field.value, tagInput], {
        shouldValidate: true,
      });

      form.clearErrors("tags");
      e.currentTarget.value = "";
    }
  };

  const handleTagRemove = (
    tag: string,
    field: ControllerRenderProps<
      { title: string; content: string; tags: string[] },
      "tags"
    >
  ) => {
    const updatedTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", updatedTags, {
      shouldValidate: true,
    });
    form.clearErrors("tags");
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="min-h-[56px] border light-border-2 background-light700_dark300 paragraph-regular text-dark300_light700 no-focus"
                />
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor markdown={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="min-h-[56px] border light-border-2 background-light700_dark300 paragraph-regular text-dark300_light700 no-focus"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex-start flex-wrap gap-2.5">
                      {field.value.map((tag) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              {form.formState.errors.tags?.[0]?.message}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-fit !text-light-900 primary-gradient"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>{!isEdit ? "Ask A Question" : "Edit"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
