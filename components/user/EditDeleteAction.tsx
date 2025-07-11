"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ROUTES from "@/constants/routes";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";

interface Props {
  type: "Question" | "Answer";
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    router.push(ROUTES.QUESTION_EDIT(itemId));
  };

  const handleDelete = async () => {
    const { success } =
      type === "Question"
        ? await deleteQuestion({ questionId: itemId })
        : await deleteAnswer({ answerId: itemId });

    if (!success) {
      toast.error("Error", {
        description: `Failed to delete ${type.toLowerCase()}. Please try again.`,
      });
      return;
    }

    toast(`${type} deleted`, {
      description: `Your ${type.toLowerCase()} has been deleted successfully.`,
    });
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "justify-center gap-0"}`}
    >
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              {type.toString().toLowerCase()} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="border-primary-100! bg-primary-500! text-light-800!"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
