import "./globals.css";

export const metadata = {
  title: "Calendario Laboral",
  description: "Intercambio de turnos profesional"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
