import { Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

interface OTPCodeProps {
  length: number;
  onChangeCode: (code: string | null) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

export default function Code({
  length,
  onChangeCode,
  isInvalid = false,
  errorMessage = "",
}: OTPCodeProps) {
  const [OTP, setOTP] = useState(Array(length).fill(""));
  const [code, setCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));

  useEffect(() => {
    const handlePaste = (event: any) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        event.preventDefault();
        navigator.clipboard
          .readText()
          .then((text) => {
            if (text.length === 6) {
              setCode(text);
              onChangeCode(text);
              const val = text.split("");
              setOTP(val);
            }
          })
          .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
          });
      }
    };
    document.addEventListener("keydown", handlePaste);
    return () => {
      document.removeEventListener("keydown", handlePaste);
    };
  }, []);

  const handleChangeCode = (value: string, index: number) => {
    const newPin = [...OTP];
    newPin[index] = value;
    setOTP(newPin);

    if (value.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (value.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      setCode(newPin.join(""));
      onChangeCode(newPin.join(""));
    } else {
      setCode(null);
      onChangeCode(null);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        {Array(length)
          .fill(null)
          .map((_el, index) => (
            <Input
              value={OTP[index]}
              onChange={(e) => handleChangeCode(e.target.value, index)}
              ref={(ref) => (inputRef.current[index] = ref as any)}
              key={index}
              classNames={{ base: "w-12 h-12", input: "text-center" }}
              maxLength={1}
              isInvalid={isInvalid}
            />
          ))}
      </div>
      <span className="text-danger text-xs mt-[-8px]">{errorMessage}</span>
    </>
  );
}
