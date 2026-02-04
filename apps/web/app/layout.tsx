import type { ReactNode } from "react";
import { AppProvider } from "../contexts/AppContext";
import { ToastContainer } from "../components/ui/Toast";
import "./globals.css";

export const metadata = {
  title: "Calendario Laboral",
  description: "Intercambio de turnos profesional",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
