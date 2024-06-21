import React from "react";
import { montserrat } from "../layout";
import { Login as LoginForm } from "@/components/forms/Login";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Google from "@/components/socials/Google";

export default function Login() {
  const { userId } = auth();

  if (userId) return redirect("/");

  return (
    <div className="w-full h-screen flex flex-row text-black">
      <div className="w-1/2 bg-white flex flex-row items-center">
        <div className="w-1/2 flex flex-col text-center gap-4 mx-auto">
          <div>
            <h1 className={`font-semibold text-3xl ${montserrat.className}`}>
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back, please enter your details
            </p>
          </div>
          <div className="flex w-full flex-col justify-center mx-auto">
            <LoginForm />
          </div>
          <div className="flex flex-row items-center gap-3">
            <hr className="text-black flex-1 flex"></hr>
            <p className="text-gray-600 text-sm">Or continue with</p>
            <hr className="text-black flex-1 flex"></hr>
          </div>
          <div>
            <Google />
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-orange-100">
        <img
          src="/88ac796f-c896-44b6-983b-f54c8d6d6021_upscaled.png"
          alt="RealState"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
