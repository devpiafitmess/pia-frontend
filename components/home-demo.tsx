"use client";

import {
  Badge,
  Box,
  Button,
  ClientOnly,
  Container,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";

export function HomeDemo() {
  return (
    <Box minH="100dvh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Container maxW="4xl" py={{ base: "12", md: "20" }}>
        <Stack gap={{ base: "8", md: "12" }}>
          <Stack gap="5" maxW="2xl">
            <Badge alignSelf="start" colorPalette="teal" variant="subtle">
              Chakra UI configurado
            </Badge>
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              letterSpacing="tight"
              lineHeight="0.95"
            >
              El proyecto ya está listo para construir con Chakra UI 3.
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              La integración sigue la guía actual para Next.js App Router:
              proveedor global, soporte de tema con <code>next-themes</code> y
              optimización de imports para reducir bundle.
            </Text>
          </Stack>

          <HStack flexWrap="wrap" gap="4">
            <Button colorPalette="teal" size="lg">
              Componente Chakra funcionando
            </Button>
            <ClientOnly
              fallback={
                <Button variant="outline" size="lg">
                  Cambiar tema
                </Button>
              }
            >
              <ThemeToggleButton />
            </ClientOnly>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    </Button>
  );
}
