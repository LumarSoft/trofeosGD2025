import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Admin Dashboard - TrofeosGD",
  description: "Panel de administración de TrofeosGD",
};

export default function AdminLayout({
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
