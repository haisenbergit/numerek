"use client";

import { ReactNode } from "react";
import { Provider } from "jotai";

interface JotaiProviderProps {
  children: ReactNode;
}

export function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
