import "server-only";

function readRequiredEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getServerEnv() {
  return {
    apiBaseUrl: readRequiredEnv("API_BASE_URL"),
    internalApiKeyName: readRequiredEnv("INTERNAL_API_KEY_NAME"),
    internalApiKey: readRequiredEnv("INTERNAL_API_KEY"),
  };
}
