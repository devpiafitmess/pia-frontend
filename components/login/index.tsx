"use client";

import {
  Bleed,
  Box,
  Button,
  ClientOnly,
  Field,
  IconButton,
  Input,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";

export function Login() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <VStack
      bg={{ base: "linear-gradient(#050c0c, #153B3B)", _dark: "bg" }}
      minH="100dvh"
      w="100vw"
      justifyContent="center"
      px={[5, 0]}
    >
      <Box maxW={448} width="100%" my={4}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={36}
          loading="eager"
        />
      </Box>
      <Box
        maxW={448}
        width="100%"
        height={554}
        p={8}
        border="1px solid"
        borderRadius="2xl"
        borderColor="rgba(255, 255, 255, 0.2)"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(8px)"
        boxShadow="xl"
        mb={10}
      >
        <Stack
          as="form"
          // onSubmit={(e) =>
          //   onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          // }
          height={"100%"}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
            Iniciar sesión
          </Text>

          <VStack flexGrow={1}>
            <Field.Root required mb={6}>
              <Field.Label>Correo electrónico</Field.Label>
              <Input
                type="email"
                autoFocus
                placeholder="tu@email.com"
                name="email"
                // value={email?.value ?? ""}
                // onChange={(e) =>
                //   setEmail({ value: e.target.value, error: null })
                // }
                disabled={loading}
              />
              {/* {email?.error && <Field.ErrorText>{email.error}</Field.ErrorText>} */}
            </Field.Root>
            <Field.Root required>
              <Field.Label>Contraseña</Field.Label>
              <PasswordInput
                type="password"
                name="password"
                // value={password?.value ?? ""}
                // onChange={(e) =>
                //   setPassword({ value: e.target.value, error: null })
                // }
                // disabled={isLoading}
              />
              {/* {password?.error && (
                <Field.ErrorText>{password.error}</Field.ErrorText>
              )} */}
              <Box w="100%" textAlign="right" mt={3}>
                <Link href="/forgot" passHref>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Field.Root>
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
            color={"white"}
            _hover={{ color: isDark ? "white" : "black" }}
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
