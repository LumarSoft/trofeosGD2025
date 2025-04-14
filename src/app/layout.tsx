import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "./globals.css";
import WhatsAppButton from "@/shared/components/whatsapp-button";
import Footer from "@/shared/components/footer";

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
    <html lang="es">
      <body className={inter.className}>
        {/* Your existing header/navigation might be here */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

<WhatsAppButton
  phoneNumber="+5493416615774"
  message="Hola! Estoy interesado en conocer más sobre sus trofeos y productos. ¿Podría darme más información?"
/>;
