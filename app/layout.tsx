import type { Metadata, Viewport } from "next";
import { Provider } from "@components/ui/provider";
import { GtmNoScript, GtmScript } from "@components/gtm";
import "./globals.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pia Fitmess | Entrena a tu ritmo, desde donde quieras",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050c0c" },
    { media: "(prefers-color-scheme: dark)", color: "#050c0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${raleway.className}`}>
      <body>
        <GtmNoScript />
        <Provider>{children}</Provider>
        <GtmScript />
      </body>
    </html>
  );
}
