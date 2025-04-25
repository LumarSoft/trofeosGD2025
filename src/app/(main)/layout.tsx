import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "TrofeosGD",
  description: "Plataforma de logros y trofeos para juegos",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">{children}</div>
    </Providers>
  );
}
