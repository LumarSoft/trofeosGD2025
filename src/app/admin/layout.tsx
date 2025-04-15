import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrofeosGD - Panel de Administración",
  description: "Panel de administración para TrofeosGD",
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}