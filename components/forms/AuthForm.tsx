"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  formType: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
}: AuthFormProps<T>) => {
  // 1. Define your form.
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<T> = async () => {
    // TODO: Authenticate user
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    type={field.name === "password" ? "passwrd" : "text"}
                    {...field}
                    className="min-h-12 rounded-1.5 border light-border-2 background-light900_dark300 paragraph-regular text-dark300_light700 no-focus"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          className="min-h-12 w-full rounded-2 px-4 py-3 font-inter paragraph-medium !text-light-900 primary-gradient"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="primary-text-gradient paragraph-semibold"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="primary-text-gradient paragraph-semibold"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
