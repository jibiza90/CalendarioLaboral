import type { ReactNode } from "react";
import "../src/styles/globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "TurnSwap - Intercambia turnos con tus compañeros",
  description: "La forma más fácil de coordinar cambios de turno entre compañeros de trabajo. Privado, directo y 100% gratis.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
