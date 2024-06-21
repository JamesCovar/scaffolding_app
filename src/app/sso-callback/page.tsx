import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import React from "react";

export default function SSOCallback() {
  return <AuthenticateWithRedirectCallback />;
}
