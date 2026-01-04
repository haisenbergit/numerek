"use client";

import { useEffect, useState } from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { SignUpVerificationCard } from "@/features/auth/components/sign-up-verification-card";
import { SignInFlow } from "@/features/auth/types";
import { useVerifyJoinCode } from "@/features/workspaces/api/use-verify-join-code";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const { data: verificationResult } = useVerifyJoinCode({
    joinCode: verificationCode,
  });

  const handleVerified = (code: string) => {
    setVerificationCode(code);
    setVerificationError("");
  };

  useEffect(() => {
    if (verificationCode && !isVerified && verificationResult !== undefined) {
      if (verificationResult.isValid) {
        setIsVerified(true);
        setState("signUp");
      } else {
        setVerificationError("Nieprawidłowy kod dostępu");
        setVerificationCode("");
      }
    }
  }, [verificationResult, verificationCode, isVerified]);

  const handleSignUpClick = () => {
    if (!isVerified) {
      setState("signUpVerification");
    } else {
      setState("signUp");
    }
  };

  return (
    <div className="flex h-full items-center justify-center border-2 bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard
            setState={(newState) => {
              if (newState === "signUp") {
                handleSignUpClick();
              } else {
                setState(newState);
              }
            }}
          />
        ) : state === "signUpVerification" ? (
          <SignUpVerificationCard
            setState={setState}
            onVerified={handleVerified}
            error={verificationError}
          />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
