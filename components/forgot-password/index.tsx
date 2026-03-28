"use client";

import {
  Box,
  Button,
  ClientOnly,
  Field,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export function ForgotPassword() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
        p={8}
        border="1px solid"
        borderRadius="2xl"
        borderColor="rgba(255, 255, 255, 0.2)"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(8px)"
        boxShadow="xl"
        mb={10}
      >
        <Stack as="form" gap={6}>
          <VStack gap={1} align="flex-start">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" w="100%">
              Olvidé la contraseña
            </Text>
            <Text fontSize="sm" color="whiteAlpha.700" textAlign="center" w="100%">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
          </VStack>

          <Field.Root required>
            <Field.Label>Correo electrónico</Field.Label>
            <Input
              type="email"
              autoFocus
              placeholder="tu@email.com"
              name="email"
            />
          </Field.Root>

          <VStack gap={3}>
            <Button w="100%" type="submit" colorPalette="teal">
              Enviar enlace
            </Button>
            <Link href="/" passHref>
              <Text
                fontSize="sm"
                color="whiteAlpha.700"
                _hover={{ color: "white" }}
                cursor="pointer"
                transition="color 0.2s"
              >
                ← Volver al inicio de sesión
              </Text>
            </Link>
          </VStack>
        </Stack>
      </Box>

      <Box position="absolute" zIndex="1" right={0} bottom={0} mr={4} mb={4}>
        <ClientOnly>
          <IconButton
            size="md"
            variant="ghost"
            color="white"
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
