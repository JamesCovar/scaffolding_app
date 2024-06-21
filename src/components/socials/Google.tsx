"use client";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { OAuthStrategy } from "@clerk/types";

//TODO: Make it a generic social button
export default function Google() {
  const { signUp } = useSignUp();

  if (!signUp) return null;

  const signUpWith = (strategy: OAuthStrategy) => {
    return signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <Button isIconOnly radius="full" variant="bordered" size="md">
      <FcGoogle fontSize={"22px"} onClick={() => signUpWith("oauth_google")} />
    </Button>
  );
}
