"use client";

import { useEffect, useState } from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { SignUpVerificationCard } from "@/features/auth/components/sign-up-verification-card";
import { AuthFlow } from "@/features/auth/types";
import { useVerifyJoinCode } from "@/features/workspaces/api/use-verify-join-code";

export const AuthWindow = () => {
  const [authState, setAuthState] = useState<AuthFlow>("signIn");
  const [receivedJoinCode, setReceivedJoinCode] = useState("");
  const [isReceivedJoinCodeVerified, setIsReceivedJoinCodeVerified] =
    useState(false);
  const [
    receivedJoinCodeVerificationError,
    setReceivedJoinCodeVerificationError,
  ] = useState("");

  const { data: verificationResult } = useVerifyJoinCode({
    joinCode: receivedJoinCode,
  });

  const handleVerified = (code: string) => {
    setReceivedJoinCode(code);
    setReceivedJoinCodeVerificationError("");
  };

  useEffect(() => {
    if (
      receivedJoinCode &&
      !isReceivedJoinCodeVerified &&
      verificationResult !== undefined
    ) {
      if (verificationResult.isValid) {
        setIsReceivedJoinCodeVerified(true);
        setAuthState("signUp");
      } else {
        setReceivedJoinCodeVerificationError("Nieprawidłowy kod dostępu");
        setReceivedJoinCode("");
      }
    }
  }, [verificationResult, receivedJoinCode, isReceivedJoinCodeVerified]);

  const handleSignUpClick = () => {
    if (!isReceivedJoinCodeVerified) {
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
            error={receivedJoinCodeVerificationError}
          />
        ) : (
          <SignUpCard setAuthState={setAuthState} />
        )}
      </div>
    </div>
  );
};
