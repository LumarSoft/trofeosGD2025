import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrofeosGD",
  description:
    "Explore nuestra colección de trofeos, medallas y regalos de empresa de alta calidad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        {children}
      </body>
    </html>
  );
}
