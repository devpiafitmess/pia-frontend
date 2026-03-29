"use client";

import {
  Box,
  Button,
  ClientOnly,
  Field,
  IconButton,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { PasswordInput } from "../ui/password-input";
import type { AuthErrorCode } from "@/types/auth";
import { APP_HOME } from "@lib/auth/constants";

type FieldState = { value: string; error: string | null };

const ERROR_MESSAGES: Partial<Record<AuthErrorCode, string>> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  invalid_session: "Sesión inválida. Por favor ingresá de nuevo.",
};

function getErrorMessage(code: string | undefined, fallback: string): string {
  if (!code) return fallback;
  return ERROR_MESSAGES[code as AuthErrorCode] ?? fallback;
}

/**
 * Validates a redirect parameter from the URL to prevent open redirect attacks.
 * Only accepts relative paths that start with "/" but not "//".
 * "//" would be interpreted by browsers as a protocol-relative URL.
 */
function safeRedirect(param: string | null): string {
  if (!param) return APP_HOME;
  const isRelative = param.startsWith("/") && !param.startsWith("//");
  return isRelative ? param : APP_HOME;
}

export function Login() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<FieldState>({ value: "", error: null });
  const [password, setPassword] = useState<FieldState>({
    value: "",
    error: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    // Basic client-side validation
    let hasError = false;
    if (!email.value.trim()) {
      setEmail((s) => ({ ...s, error: "El correo es requerido." }));
      hasError = true;
    }
    if (!password.value) {
      setPassword((s) => ({ ...s, error: "La contraseña es requerida." }));
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim(), password: password.value }),
      });

      if (res.ok) {
        router.push(safeRedirect(searchParams.get("redirect")));
        return;
      }

      const body = await res.json().catch(() => ({}));
      setFormError(
        getErrorMessage(body.code, "No fue posible iniciar sesión. Intentá de nuevo."),
      );
    } catch {
      setFormError("Error de conexión. Verificá tu internet e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

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
        <form onSubmit={onSubmit} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
            Iniciar sesión
          </Text>

          <VStack flexGrow={1}>
            <Field.Root required invalid={!!email.error} mb={6}>
              <Field.Label>Correo electrónico</Field.Label>
              <Input
                type="email"
                autoFocus
                placeholder="tu@email.com"
                name="email"
                value={email.value}
                onChange={(e) =>
                  setEmail({ value: e.target.value, error: null })
                }
                disabled={loading}
              />
              {email.error && (
                <Field.ErrorText>{email.error}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root required invalid={!!password.error}>
              <Field.Label>Contraseña</Field.Label>
              <PasswordInput
                value={password.value}
                onChange={(e) =>
                  setPassword({ value: e.target.value, error: null })
                }
                disabled={loading}
              />
              {password.error && (
                <Field.ErrorText>{password.error}</Field.ErrorText>
              )}
              <Box w="100%" textAlign="right" mt={3}>
                <Link href="/forgot" passHref>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Field.Root>

            {formError && (
              <Text color="red.300" fontSize="sm" w="100%" textAlign="center" mt={2}>
                {formError}
              </Text>
            )}
          </VStack>

          <VStack gap={4}>
            <Button
              w="100%"
              type="submit"
              variant="pia-solid"
              loading={loading}
              disabled={loading}
            >
              Iniciar sesión
            </Button>
            <Text fontSize="sm" color="whiteAlpha.800">
              ¿No tienes cuenta?{" "}
              <Link href="/register">Regístrate aquí</Link>
            </Text>
          </VStack>
        </form>
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
