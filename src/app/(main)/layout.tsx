import type { ReactNode } from "react";
import WhatsAppButton from "@/shared/components/whatsapp-button";
import Footer from "@/shared/components/footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <WhatsAppButton
          phoneNumber="+5493416615774"
          message="Hola! Estoy interesado en conocer más sobre sus trofeos y productos. ¿Podría darme más información?"
        />
        <Footer />
      </body>
    </html>
  );
}
