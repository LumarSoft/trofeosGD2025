import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "./globals.css";
import WhatsAppButton from "@/shared/components/whatsapp-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrofeosGD",
  description:
    "Explore nuestra colección de trofeos, medallas y regalos de empresa de alta calidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {children}

        <WhatsAppButton
          phoneNumber="+5491112345678"
          message="Hola! Estoy interesado en conocer más sobre sus trofeos y productos. ¿Podría darme más información?"
        />
      </body>
    </html>
  );
}
