import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      fontSize: "1rem",
    },
    a: {
      color: "{colors.pia-color.default}",
      textDecoration: "none",
      cursor: "pointer",
      transition: "text-decoration 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        textDecoration: "underline",
      },
    },
  },
  theme: {
    tokens: {
      colors: {
        // Primary — pia-color (teal)
        "pia-color": {
          50: { value: "#edfafa" },
          100: { value: "#cff0f0" },
          200: { value: "#9fe2e2" },
          300: { value: "#4fcdcc" }, // dark mode default
          400: { value: "#3db8b7" },
          500: { value: "#349392" }, // light mode default
          600: { value: "#2a7a79" }, // hover
          700: { value: "#1f5c5c" },
          800: { value: "#143d3d" },
          900: { value: "#0a2020" },
          950: { value: "#051010" },
        },
        // Secondary — coral (energético, contrapunto cálido al teal)
        coral: {
          50: { value: "#fff3ee" },
          100: { value: "#fdddd0" },
          200: { value: "#fbb89e" },
          300: { value: "#f78e6c" },
          400: { value: "#f16540" },
          500: { value: "#e04e28" }, // default
          600: { value: "#c03b1b" }, // hover
          700: { value: "#952b12" },
          800: { value: "#6b1d0b" },
          900: { value: "#430f06" },
          950: { value: "#240703" },
        },
        // Neutrales — dark-first
        neutral: {
          50: { value: "#f5f5f5" },
          100: { value: "#e8e8e8" },
          200: { value: "#d0d0d0" },
          300: { value: "#a8a8a8" },
          400: { value: "#808080" },
          500: { value: "#585858" },
          600: { value: "#383838" },
          700: { value: "#282828" },
          800: { value: "#1a1a1a" },
          900: { value: "#111111" },
          950: { value: "#080808" },
        },
        // Colores de estado
        success: {
          500: { value: "#2e9e6e" },
          600: { value: "#237a54" },
        },
        warning: {
          500: { value: "#d4900a" },
          600: { value: "#a86f06" },
        },
        error: {
          500: { value: "#d93d3d" },
          600: { value: "#b02e2e" },
        },
        info: {
          500: { value: "#3b82c4" },
          600: { value: "#2d6499" },
        },
      },
    },

    semanticTokens: {
      colors: {
        // Primary
        "pia-color.default": {
          value: {
            base: "{colors.pia-color.500}",
            _dark: "{colors.pia-color.300}",
          },
        },
        "pia-color.hover": {
          value: {
            base: "{colors.pia-color.600}",
            _dark: "{colors.pia-color.400}",
          },
        },
        // Secondary
        "secondary.default": {
          value: { base: "{colors.coral.500}", _dark: "{colors.coral.400}" },
        },
        "secondary.hover": {
          value: { base: "{colors.coral.600}", _dark: "{colors.coral.500}" },
        },
        // Fondos
        "bg.default": {
          value: { base: "white", _dark: "{colors.neutral.950}" },
        },
        "bg.surface": {
          value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.900}" },
        },
        "bg.input": {
          value: { base: "white", _dark: "{colors.neutral.800}" },
        },
        // Bordes
        "border.default": {
          value: {
            base: "{colors.neutral.200}",
            _dark: "{colors.neutral.700}",
          },
        },
        // Texto
        "text.primary": {
          value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.50}" },
        },
        "text.muted": {
          value: {
            base: "{colors.neutral.500}",
            _dark: "{colors.neutral.400}",
          },
        },
      },
    },

    recipes: {
      link: {
        base: {
          color: "{colors.pia-color.default}",
          textDecoration: "none",
          cursor: "pointer",
          transition: "text-decoration 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          _hover: {
            textDecoration: "underline",
          },
        },
      },
      button: {
        variants: {
          variant: {
            "pia-solid": {
              bg: "{colors.pia-color.default}",
              color: "white",
              borderRadius: "full",
              px: 4,
              fontSize: "1rem",
              _hover: {
                bg: "{colors.pia-color.hover}",
              },
            },
            "pia-secondary": {
              bg: "{colors.secondary.default}",
              color: "white",
              borderRadius: "full",
              px: 4,
              fontSize: "1rem",
              _hover: {
                bg: "{colors.secondary.hover}",
              },
            },
          },
        },
      },
      input: {
        variants: {
          variant: {
            outline: {
              bg: "var(--colors-bg-input)",
              borderWidth: "1px",
              borderColor: "var(--colors-border-default)",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              height: "46px",
              py: 3,
              px: 4,
              // Override the CSS variable used by focusVisibleRing + focusRingColor
              "--focus-color": "var(--colors-pia-color-default)",
              _focusVisible: {
                borderColor: "var(--colors-pia-color-default)",
              },
              _placeholder: {
                color: "var(--colors-text-muted)",
              },
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
