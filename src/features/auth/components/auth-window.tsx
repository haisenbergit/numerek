"use client";

import { useEffect, useState } from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { SignUpVerificationCard } from "@/features/auth/components/sign-up-verification-card";
import { AuthFlow } from "@/features/auth/types";
import { useVerifyJoinCode } from "@/features/workspaces/api/use-verify-join-code";

export const AuthWindow = () => {
  const [authState, setAuthState] = useState<AuthFlow>("signIn");
  const [enteredJoinCode, setEnteredJoinCode] = useState("");
  const [isEnteredJoinCodeVerified, setIsEnteredJoinCodeVerified] =
    useState(false);
  const [
    enteredJoinCodeVerificationError,
    setEnteredJoinCodeVerificationError,
  ] = useState("");

  const { data: verificationResult } = useVerifyJoinCode({
    joinCode: enteredJoinCode,
  });

  const handleVerified = (code: string) => {
    setEnteredJoinCode(code);
    setEnteredJoinCodeVerificationError("");
  };

  useEffect(() => {
    if (
      enteredJoinCode &&
      !isEnteredJoinCodeVerified &&
      verificationResult !== undefined
    ) {
      if (verificationResult.isValid) {
        setIsEnteredJoinCodeVerified(true);
        setAuthState("signUp");
      } else {
        setEnteredJoinCodeVerificationError("Nieprawidłowy kod dostępu");
        setIsEnteredJoinCodeVerified(false);
        setEnteredJoinCode("");
      }
    }
  }, [verificationResult, enteredJoinCode, isEnteredJoinCodeVerified]);

  const handleSignUpClick = () => {
    if (!isEnteredJoinCodeVerified) {
      setAuthState("signUpVerification");
    } else {
      setAuthState("signUp");
    }
  };

  return (
    <div className="flex h-full items-center justify-center border-2 bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {authState === "signIn" ? (
          <SignInCard
            setAuthState={(newState) => {
              if (newState === "signUp") {
                handleSignUpClick();
              } else {
                setAuthState(newState);
              }
            }}
          />
        ) : authState === "signUpVerification" ? (
          <SignUpVerificationCard
            setAuthState={setAuthState}
            onVerified={handleVerified}
            error={enteredJoinCodeVerificationError}
          />
        ) : (
          <SignUpCard setAuthState={setAuthState} />
        )}
      </div>
    </div>
  );
};
