"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { system } from "./system";

export function Provider({ children, ...rest }: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange {...rest}>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
