"use client";

import {
  Box,
  Button,
  ClientOnly,
  Field,
  IconButton,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Login() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <VStack
      bg={{ base: "linear-gradient(#153B3B, #050c0c)", _dark: "bg" }}
      h="100vh"
      w="100vw"
      justifyContent="center"
    >
      <Box
        maxW="384px"
        width="100%"
        height={554}
        p={8}
        border="1px solid"
        borderRadius="2xl"
        borderColor="rgba(255, 255, 255, 0.2)"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(8px)"
        boxShadow="xl"
      >
        <Stack
          as="form"
          // onSubmit={(e) =>
          //   onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          // }
          height={"100%"}
        >
          <VStack flexGrow={1}>
            {/* <WwNortonLogo
              color={{ base: "wwnds-navy.80", _dark: "white" }}
              width={100}
              mt={4}
              mb={8}
            /> */}
            {/* <Field.Root required invalid={!!email?.error}>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                autoFocus
                placeholder="example@wwnorton.com"
                name="email"
                value={email?.value ?? ""}
                onChange={(e) =>
                  setEmail({ value: e.target.value, error: null })
                }
                disabled={isLoading}
              />
              {email?.error && <Field.ErrorText>{email.error}</Field.ErrorText>}
            </Field.Root> */}
            {/* <Field.Root required mt={4}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                name="password"
                value={password?.value ?? ""}
                onChange={(e) =>
                  setPassword({ value: e.target.value, error: null })
                }
                disabled={isLoading}
              />
              {password?.error && (
                <Field.ErrorText>{password.error}</Field.ErrorText>
              )}
            </Field.Root> */}
          </VStack>
          <VStack>
            <Button w={"100%"} type="submit" colorPalette="teal">
              Login
            </Button>
          </VStack>
        </Stack>
      </Box>
      <Box position="absolute" zIndex="1" right={0} bottom={0} mr={4} mb={4}>
        <ClientOnly>
          <IconButton
            size="md"
            variant="ghost"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle color mode"
          >
            {isDark ? <Moon /> : <Sun />}
          </IconButton>
        </ClientOnly>
      </Box>
    </VStack>
  );
}
