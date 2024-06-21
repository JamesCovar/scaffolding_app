import { hideEmail } from "@/helper/hideEmail";
import { useSignIn } from "@clerk/nextjs";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Code from "../ui/Code";

interface ForgotEmailProps {
  setShowForgotEmail: (value: boolean) => void;
}

export default function ForgotEmail({ setShowForgotEmail }: ForgotEmailProps) {
  const [successfullCode, setSuccessfullCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clearCode, setClearCode] = useState(0);
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    setError,
    watch,
  } = useForm();
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleResetPassword = async (formValues: FieldValues) => {
    if (!isLoaded) return;
    const { email } = formValues;
    setIsLoading(true);
    try {
      await signIn
        .create({
          strategy: "reset_password_email_code",
          identifier: email,
        })
        .then(() => {
          setSuccessfullCode(true);
          console.log("Code sent");
        })
        .catch((error) => {
          console.log(error);
        });
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setClearCode(Math.random());
  };

  useEffect(() => {
    if (errors.code?.type === "verification_failed")
      setTimeout(() => {
        setShowForgotEmail(false);
      }, 3000);

    console.log(errors);
  }, [errors.code]);

  const handleSubmitPassword = async (formValues: FieldValues) => {
    resetCode();
    setValue("password", "");
    const { code, password } = formValues;
    try {
      setIsLoading(true);
      await signIn
        ?.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
          password,
        })
        .then((res) => {
          if (res.status === "needs_second_factor") {
            console.log("Needs second factor");
          } else if (res.status === "complete") {
            setActive({ session: res.createdSessionId });
          }
        });
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      const errorCode = e.errors[0].code;
      let errorMsg = "";
      let errorType = "";

      if (errorCode === "form_code_incorrect") {
        errorMsg = "Oops! The code you entered is incorrect. Please try again.";
        errorType = "form_code_incorrect";
      } else if (errorCode === "form_password_pwned") {
        setError("password", {
          message:
            "Password has been found in an online data breach. For account safety, please use a different password. Try using a mix of special characters, letters, and numbers.",
          type: "form_password_pwned",
        });
      } else if (errorCode === "verification_failed") {
        errorMsg =
          "Too many failed attempts. You have to try again with the same or another method.";
        errorType = "verification_failed";
      } else {
        setError("code", {
          message:
            "An unexpected error occurred. Please contact us to resolve this issue.",
        });
      }

      setError("code", { message: errorMsg, type: errorType });
    }
  };

  return (
    <>
      {!successfullCode && (
        <>
          <div className="text-xs">
            <p>
              Enter your email address to request a{" "}
              <span className="font-medium">password reset</span>
            </p>
          </div>
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
          <Button
            onClick={handleSubmit(handleResetPassword)}
            isLoading={isLoading}
          >
            Send reset password
          </Button>
        </>
      )}
      {successfullCode && (
        <>
          <div className="flex flex-col gap-2">
            <div className="text-xs">
              <p>
                A reset code has been sent to{" "}
                <span className="font-medium">
                  {hideEmail(getValues("email"))}
                </span>
                . Please check your inbox
              </p>
            </div>
            <Controller
              name="code"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Code
                  length={6}
                  onChangeCode={(code) => field.onChange(code)}
                  key={clearCode}
                  isInvalid={errors.code?.type === "required"}
                  errorMessage={errors.code?.message as string}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true, minLength: 8, maxLength: 22 }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="New Password"
                  isInvalid={!!errors.password}
                  errorMessage={
                    errors.password?.type === "minLength" ||
                    errors.password?.type === "maxLength"
                      ? "Password must be between 8 and 22 characters"
                      : (errors.password?.message as string)
                  }
                />
              )}
            ></Controller>
            <Button
              onClick={handleSubmit(handleSubmitPassword)}
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </div>
        </>
      )}
      <p
        className="text-xs text-center cursor-pointer underline"
        onClick={() => setShowForgotEmail(false)}
      >
        Sign In
      </p>
    </>
  );
}
