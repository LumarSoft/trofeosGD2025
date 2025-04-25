import type { Metadata } from "next";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "TrofeosGD - Admin",
  description: "Panel de administración de TrofeosGD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </Providers>
  );
} 