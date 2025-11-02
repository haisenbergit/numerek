// Types for authentication flow
export type SignInFlow = "signIn" | "signUp";

// Stages of the OTP login process
export enum OtpStep {
  Idle = "idle",
  CodeSent = "codeSent",
}
