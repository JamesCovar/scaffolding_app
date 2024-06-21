import { useSignUp } from "@clerk/nextjs";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

interface SignUpProps {
  setShowOTP: (value: boolean) => void;
  setEmail: (value: string) => void;
}

export default function SignUp({ setShowOTP, setEmail }: SignUpProps) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleSignUp = async (formValues: FieldValues) => {
    if (!isLoaded) return;
    try {
      const { email, password } = formValues;
      await signUp.create({
        emailAddress: email,
        password,
      });

      //Send email code to verify
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setEmail(email);
      setShowOTP(true);
    } catch (e: any) {
      const errorType = e?.errors?.[0].code;

      if (errorType === "form_password_pwned")
        setError("password", {
          message:
            "Password has been found in an online data breach. For account safety, please use a different password. Try using a mix of special characters, letters, and numbers.",
          type: "validate",
        });
      if (errorType === "form_identifier_exists") {
        setError("email", {
          message:
            "That email address is already in use. Please try a different one or log in.",
        });
      }

      console.log(e);
    }
  };

  errors;

  const validatePasswordMatch = (value: string, formValues: FieldValues) => {
    if (formValues.password !== formValues.confirmPassword) {
      setError("passwordMismatch", {
        type: "validate",
        message: "The passwords you entered do not match.",
      });
      return false;
    }
    clearErrors("passwordMismatch");
    return true;
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
                : (errors.email?.message as string)
            }
          />
        )}
      ></Controller>
      <Controller
        name="password"
        control={control}
        rules={{ required: true, minLength: 8, maxLength: 22 }}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="Password"
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
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          validate: validatePasswordMatch,
        }}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="Confirm password"
            isInvalid={!!errors.passwordMismatch?.message}
            errorMessage={(errors.passwordMismatch?.message as string) || ""}
          />
        )}
      ></Controller>

      <Button onClick={handleSubmit(handleSignUp)}>Sign Up</Button>
    </>
  );
}
