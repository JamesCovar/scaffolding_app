import { useSignIn } from "@clerk/nextjs";
import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";

interface SignInProps {
  setShowForgotEmail: (value: boolean) => void;
}

export default function SignIn({ setShowForgotEmail }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect_url");

  const handleSignIn = async (formValues: FieldValues) => {
    if (!isLoaded) return;

    const { email, password } = formValues;
    setIsLoading(true);
    try {
      await signIn.create({
        identifier: email,
        password: password,
        actionCompleteRedirectUrl: redirect || "/",
      });

      //TODO: Bad practice, review why middleware is blocking the first redirection after login
      setTimeout(() => {
        window.location.href = redirect || "/";
      }, 1000);
      setIsLoading(false);
    } catch (e: any) {
      const errorCode = e.errors[0].code;
      let errorMessage = "";
      console.log(e);
      if (errorCode === "form_password_incorrect") {
        errorMessage =
          "Password or email is incorrect. Try again, or use another method.";
        setError("email", { message: "" });
        return setError("password", { message: errorMessage });
      }
      setError("email", { message: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Controller
        name="email"
        control={control}
        rules={{
          required: true,
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        }}
        render={({ field }) => (
          <Input
            placeholder="Email"
            required
            {...field}
            isInvalid={!!errors.email}
            errorMessage={
              errors.email?.type === "pattern"
                ? "Please enter a valid email"
                : ""
            }
          />
        )}
      ></Controller>
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="Password"
            isInvalid={!!errors.password}
            errorMessage={(errors?.password?.message as string) || ""}
          />
        )}
      ></Controller>
      <Button onClick={handleSubmit(handleSignIn)} isLoading={isLoading}>
        Sign In
      </Button>
      <div className="text-center">
        <span
          className="underline text-xs cursor-pointer"
          onClick={() => setShowForgotEmail(true)}
        >
          Forgot password
        </span>
      </div>
    </>
  );
}
