"use client";

import {
  Box,
  Button,
  ClientOnly,
  Field,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ForgotPassword() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);

    if (!email.trim()) {
      setEmailError("El correo es requerido.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // We always show success to avoid leaking whether an email exists,
      // matching the backend's privacy-safe behaviour.
      if (res.ok || res.status !== 400) {
        setStatus("success");
        return;
      }

      // Only surface genuine payload errors (status 400)
      const body = await res.json().catch(() => ({}));
      setEmailError(body.error ?? "Error al enviar el enlace. Intentá de nuevo.");
      setStatus("error");
    } catch {
      setEmailError("Error de conexión. Verificá tu internet e intentá de nuevo.");
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

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
        {status === "success" ? (
          <VStack gap={6} py={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              ¡Listo!
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
              Si existe una cuenta con ese correo, recibirás un enlace para
              restablecer tu contraseña en los próximos minutos.
            </Text>
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
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--chakra-spacing-6)" }}>
            <VStack gap={1} align="flex-start">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                w="100%"
              >
                Olvidé la contraseña
              </Text>
              <Text
                fontSize="sm"
                color="whiteAlpha.700"
                textAlign="center"
                w="100%"
              >
                Ingresá tu correo y te enviaremos un enlace para restablecer
                tu contraseña.
              </Text>
            </VStack>

            <Field.Root required invalid={!!emailError}>
              <Field.Label>Correo electrónico</Field.Label>
              <Input
                type="email"
                autoFocus
                placeholder="tu@email.com"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                disabled={isLoading}
              />
              {emailError && (
                <Field.ErrorText>{emailError}</Field.ErrorText>
              )}
            </Field.Root>

            <VStack gap={3}>
              <Button
                w="100%"
                type="submit"
                colorPalette="teal"
                loading={isLoading}
                disabled={isLoading}
              >
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
          </form>
        )}
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
