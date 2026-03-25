"use client";

import { useState } from "react";

import {
  Box,
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldLabel,
  FieldRoot,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";

type HealthResponse = {
  ok: boolean;
  status?: number;
  upstreamUrl?: string;
  checkedAt?: string;
  payload?: unknown;
  message?: string;
  details?: string;
};

export function HomeDemo() {
  const [healthResponse, setHealthResponse] = useState<HealthResponse | null>(
    null,
  );
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleMakeApiCall() {
    setIsLoading(true);
    setRequestError(null);

    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as HealthResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Health check failed");
      }

      setHealthResponse(data);
    } catch (error) {
      setHealthResponse(null);
      setRequestError(
        error instanceof Error ? error.message : "Unexpected request error",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      position="relative"
      minH="100dvh"
      overflow="hidden"
      bg="#f7f2ea"
      color="#171717"
    >
      <Box
        position="absolute"
        inset="0"
        bgImage={[
          "radial-gradient(circle at 12% 18%, rgba(126, 186, 255, 0.22), transparent 24%)",
          "radial-gradient(circle at 85% 82%, rgba(144, 219, 206, 0.24), transparent 28%)",
          "linear-gradient(180deg, rgba(23,23,23,0.05) 0px, rgba(23,23,23,0.05) 1px, transparent 1px, transparent 128px)",
        ].join(",")}
        backgroundSize="auto, auto, 100% 128px"
        opacity="0.9"
      />

      <Box
        position="absolute"
        top={{ base: "-40px", md: "48px" }}
        right={{ base: "-60px", md: "120px" }}
        w={{ base: "180px", md: "260px" }}
        h={{ base: "180px", md: "260px" }}
        rounded="40px"
        border="1px solid rgba(23,23,23,0.08)"
        transform="rotate(18deg)"
      />

      <Box
        position="absolute"
        left={{ base: "-40px", md: "96px" }}
        bottom={{ base: "48px", md: "88px" }}
        w={{ base: "140px", md: "220px" }}
        h={{ base: "140px", md: "220px" }}
        rounded="full"
        bg="rgba(255,255,255,0.55)"
        filter="blur(10px)"
      />

      <Flex
        position="relative"
        zIndex="1"
        minH="100dvh"
        align="center"
        justify="center"
        px={{ base: "5", md: "8", xl: "12" }}
        py={{ base: "10", md: "14" }}
      >
        <Grid
          w="full"
          maxW="1120px"
          templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
          gap={{ base: "10", lg: "14" }}
          alignItems="center"
        >
          <Stack gap={{ base: "8", md: "10" }} maxW="560px">
            <Flex align="center" gap="4">
              <Box
                w="72px"
                h="10px"
                rounded="full"
                bg="#171717"
                boxShadow="0 8px 24px rgba(23,23,23,0.08)"
              />
              <Text
                textTransform="uppercase"
                letterSpacing="0.28em"
                fontSize="xs"
                color="#6e6a64"
              >
                Members Access
              </Text>
            </Flex>

            <Stack gap="5">
              <Heading
                fontSize={{ base: "4xl", md: "6xl", xl: "7xl" }}
                lineHeight="0.9"
                letterSpacing="-0.06em"
                maxW="10ch"
              >
                Inicia con calma.
              </Heading>

              <Text
                maxW="28rem"
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.8"
                color="#5f5a54"
              >
                Una entrada simple, luminosa y elegante para volver a tus
                sesiones, tus rutinas y tu progreso sin fricción.
              </Text>
            </Stack>

            <Stack
              gap="5"
              maxW="460px"
              bg="rgba(255,255,255,0.45)"
              border="1px solid rgba(23,23,23,0.08)"
              rounded="32px"
              p={{ base: "5", md: "6" }}
              backdropFilter="blur(16px)"
            >
              <Flex align="start" gap="4">
                <Text
                  minW="34px"
                  fontSize="sm"
                  fontWeight="700"
                  color="#171717"
                >
                  01
                </Text>
                <Stack gap="1">
                  <Text fontWeight="600">Agenda y progreso en un solo lugar</Text>
                  <Text color="#6e6a64">
                    Accede a tu actividad diaria, próximos bloques y métricas
                    recientes.
                  </Text>
                </Stack>
              </Flex>

              <Separator borderColor="rgba(23,23,23,0.08)" />

              <Flex align="start" gap="4">
                <Text
                  minW="34px"
                  fontSize="sm"
                  fontWeight="700"
                  color="#171717"
                >
                  02
                </Text>
                <Stack gap="1">
                  <Text fontWeight="600">Interfaz pensada para foco y ritmo</Text>
                  <Text color="#6e6a64">
                    Menos ruido visual, más claridad para entrar y seguir.
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Stack>

          <Box
            position="relative"
            maxW="460px"
            w="full"
            justifySelf={{ base: "stretch", lg: "end" }}
            bg="rgba(255,255,255,0.82)"
            border="1px solid rgba(23,23,23,0.08)"
            rounded={{ base: "28px", md: "34px" }}
            boxShadow="0 30px 80px rgba(42, 40, 37, 0.12)"
            backdropFilter="blur(20px)"
            p={{ base: "6", md: "8" }}
          >
            <Box
              position="absolute"
              inset="18px 18px auto auto"
              w="14px"
              h="14px"
              rounded="full"
              bg="#b9d5ff"
            />

            <Stack gap="7">
              <Stack gap="3">
                <Text
                  textTransform="uppercase"
                  letterSpacing="0.22em"
                  fontSize="xs"
                  color="#8a847d"
                >
                  Login
                </Text>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  lineHeight="1"
                  letterSpacing="-0.05em"
                >
                  Bienvenida de nuevo
                </Heading>
                <Text color="#69645e">
                  Entra a tu cuenta para continuar con tus sesiones y objetivos.
                </Text>
              </Stack>

              <Stack gap="5">
                <FieldRoot gap="2">
                  <FieldLabel color="#2d2a26">Correo electrónico</FieldLabel>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    bg="#fbf8f3"
                    borderColor="rgba(23,23,23,0.08)"
                    rounded="2xl"
                    color="#171717"
                    _placeholder={{ color: "#9b968f" }}
                    _hover={{ borderColor: "rgba(23,23,23,0.16)" }}
                    _focusVisible={{
                      borderColor: "#7fb0ff",
                      boxShadow: "0 0 0 1px #7fb0ff",
                    }}
                  />
                </FieldRoot>

                <FieldRoot gap="2">
                  <FieldLabel color="#2d2a26">Contraseña</FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    bg="#fbf8f3"
                    borderColor="rgba(23,23,23,0.08)"
                    rounded="2xl"
                    color="#171717"
                    _placeholder={{ color: "#9b968f" }}
                    _hover={{ borderColor: "rgba(23,23,23,0.16)" }}
                    _focusVisible={{
                      borderColor: "#7fb0ff",
                      boxShadow: "0 0 0 1px #7fb0ff",
                    }}
                  />
                </FieldRoot>
              </Stack>

              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                gap="3"
              >
                <CheckboxRoot colorPalette="blue">
                  <CheckboxHiddenInput />
                  <CheckboxControl
                    rounded="md"
                    bg="transparent"
                    borderColor="rgba(23,23,23,0.18)"
                  >
                    <CheckboxIndicator />
                  </CheckboxControl>
                  <CheckboxLabel color="#6a655f">Recordarme</CheckboxLabel>
                </CheckboxRoot>

                <Link color="#5a8cff" _hover={{ color: "#3d73ef" }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Flex>

              <Stack gap="3">
                <Button
                  rounded="full"
                  bg="#171717"
                  color="white"
                  fontWeight="600"
                  _hover={{ bg: "#262626" }}
                  _active={{ bg: "#101010" }}
                >
                  Entrar
                </Button>

                <Button
                  variant="ghost"
                  rounded="full"
                  color="#171717"
                  bg="rgba(255,255,255,0.55)"
                  border="1px solid rgba(23,23,23,0.08)"
                  _hover={{ bg: "rgba(255,255,255,0.9)" }}
                >
                  Solicitar acceso mágico
                </Button>

                <Button
                  rounded="full"
                  variant="outline"
                  borderColor="rgba(23,23,23,0.12)"
                  color="#171717"
                  bg="rgba(255,255,255,0.45)"
                  _hover={{ bg: "rgba(255,255,255,0.9)" }}
                  loading={isLoading}
                  onClick={handleMakeApiCall}
                >
                  make API call
                </Button>
              </Stack>

              {(healthResponse || requestError) && (
                <Box
                  rounded="24px"
                  bg="#fbf8f3"
                  border="1px solid rgba(23,23,23,0.08)"
                  p="4"
                >
                  <Stack gap="2">
                    <Text fontSize="sm" fontWeight="700" color="#2d2a26">
                      API health response
                    </Text>

                    {requestError ? (
                      <Text color="#b42318" fontSize="sm">
                        {requestError}
                      </Text>
                    ) : (
                      <>
                        <Text fontSize="sm" color="#6e6a64">
                          {healthResponse?.upstreamUrl}
                        </Text>
                        <Text fontSize="sm" color="#6e6a64">
                          status: {healthResponse?.status} · checkedAt:{" "}
                          {healthResponse?.checkedAt}
                        </Text>
                        <Box
                          as="pre"
                          m="0"
                          p="3"
                          rounded="16px"
                          overflowX="auto"
                          fontSize="xs"
                          bg="rgba(23,23,23,0.04)"
                          whiteSpace="pre-wrap"
                        >
                          {JSON.stringify(healthResponse?.payload, null, 2)}
                        </Box>
                      </>
                    )}
                  </Stack>
                </Box>
              )}

              <Text textAlign="center" color="#726c66">
                ¿Aún no tienes cuenta?{" "}
                <Link color="#5a8cff" _hover={{ color: "#3d73ef" }}>
                  Crear una ahora
                </Link>
              </Text>
            </Stack>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
}
