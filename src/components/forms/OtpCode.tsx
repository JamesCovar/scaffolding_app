import { hideEmail } from "@/helper/hideEmail";
import { useSignUp } from "@clerk/nextjs";
import { Button, Input, Link, input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Code from "../ui/Code";

interface OtpCodeProps {
  email: string;
  setShowOTP: (value: boolean) => void;
}

export default function OtpCode({ email, setShowOTP }: OtpCodeProps) {
  const [error, setError] = useState<{
    code: number | null;
    msg: string | null;
  }>({ code: null, msg: null });
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [resetCode, setResetCode] = useState(0);
  const length = 6;
  const router = useRouter();

  const requestNewCode = async () => {
    if (!email || !isLoaded) return;
    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    setError({ code: null, msg: null });
    setCode(null);
    clearCode();
  };

  const verifyCode = async () => {
    if (!isLoaded || !code || code.length < 6) return;
    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (e: any) {
      setCode(null);
      clearCode();
      console.log(Array(length).fill(""));
      setError({ code: e?.status, msg: e?.errors[0]?.code });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(error.msg);
    if (error.msg !== "verification_failed") return;

    console.log(error.msg);
    setTimeout(() => {
      setShowOTP(false);
    }, 3000);
  }, [error]);

  const clearCode = () => {
    setResetCode(Math.random());
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs">
        <p>
          An access code has been sent to{" "}
          <span className="font-medium">{hideEmail(email)}</span>. Please check
          your inbox
        </p>
      </div>
      <Code length={6} onChangeCode={setCode} key={resetCode} />

      {error.msg === "verification_expired" && (
        <p className="text-xs text-danger">
          Your code has expired.{" "}
          <Link onPress={requestNewCode} className="text-xs cursor-pointer">
            Click here to request a new one
          </Link>
        </p>
      )}
      {error.msg === "form_code_incorrect" && (
        <p className="text-xs text-danger">Invalid code. Please try again</p>
      )}
      {error.msg === "verification_failed" && (
        <p className="text-xs text-danger">
          You have exceeded the attempt limit. Please try again or use another
          sign-up method
        </p>
      )}
      <Button isDisabled={!code} onClick={verifyCode} isLoading={isLoading}>
        Verify
      </Button>
    </div>
  );
}
