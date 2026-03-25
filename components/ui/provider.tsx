"use client";

import {
  ChakraProvider,
  defaultSystem,
} from "@chakra-ui/react";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";

export function Provider(props: ThemeProviderProps) {
  const { children, ...rest } = props;

  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange {...rest}>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
