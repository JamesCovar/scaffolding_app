"use client";
import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useEffect, useState } from "react";
import OtpCode from "./OtpCode";
import { useSession } from "@clerk/nextjs";
import ForgotEmail from "./ForgotEmail";
import { useRouter } from "next/navigation";

export const Login = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotEmail, setShowForgotEmail] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <Tabs aria-label="Options" classNames={{ tabList: "w-full" }}>
      <Tab key="signin" title="Sign In">
        <Card>
          <CardBody>
            <div className="flex flex-col gap-2">
              {!showForgotEmail && (
                <SignIn setShowForgotEmail={setShowForgotEmail} />
              )}
              {showForgotEmail && (
                <ForgotEmail setShowForgotEmail={setShowForgotEmail} />
              )}
            </div>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="signup" title="Sign Up">
        <Card>
          <CardBody>
            <div className="flex flex-col gap-2">
              {!showOTP && (
                <SignUp setShowOTP={setShowOTP} setEmail={setEmail} />
              )}
              {showOTP && <OtpCode email={email} setShowOTP={setShowOTP} />}
            </div>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
};
