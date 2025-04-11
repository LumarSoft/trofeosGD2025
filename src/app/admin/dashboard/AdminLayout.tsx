"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Determine active section based on pathname
  const activeSection = pathname.includes("/gallery") ? "gallery" : "products";

  // Check if user is authenticated - solo una vez al montar el componente
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        router.push("/admin");
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Dependencia vacía para que solo se ejecute al montar el componente

  // Efecto para manejar cambios de ruta sin mostrar pantalla de carga
  useEffect(() => {
    // Si ya estamos autenticados, no necesitamos mostrar la pantalla de carga
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [pathname, isAuthenticated]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al cerrar sesión");
      }

      // Remove client-side cookie
      Cookies.remove("auth_token");
      setIsAuthenticated(false);

      // Redirect to login
      router.push("/admin");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Still try to remove cookie and redirect
      Cookies.remove("auth_token");
      setIsAuthenticated(false);
      router.push("/admin");
    }
  };

  // Show loading while verifying authentication only on initial load
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold mx-auto mb-4"></div>
          <p className="text-gold-light">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar
        router={router}
        handleLogout={handleLogout}
        activeSection={activeSection}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <AdminHeader handleLogout={handleLogout} />
          {children}
        </div>
      </div>
    </div>
  );
}
