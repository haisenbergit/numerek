export type AuthFlow = "signIn" | "signUp" | "signUpVerification";

// Stages of the OTP login process
export enum OtpStep {
  Idle = "idle",
  CodeSent = "codeSent",
}
