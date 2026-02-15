"use client";

import { ThemeProvider, globalStyles } from "@maximeheckel/design-system";

globalStyles();

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}