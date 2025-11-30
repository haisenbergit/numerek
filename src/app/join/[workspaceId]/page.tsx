"use client";
import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Button } from "@/components/ui/button";

const JoinPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src="/verification.svg" width={60} height={60} alt="Logo" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          length={6}
          classNames={{
            container: "flex gap-x-2",
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-grey-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinPage;
