"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

// Variable global para evitar verificaciones repetidas
let authVerified = false;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(!authVerified);
  const [isAuthenticated, setIsAuthenticated] = useState(authVerified);

  // Determine active section based on pathname
  const activeSection = pathname.includes("/gallery") ? "gallery" : "products";

  // Check if user is authenticated - solo una vez al montar el componente y si no está ya verificado
  useEffect(() => {
    const checkAuth = async () => {
      // Si ya se verificó la autenticación, no hacerlo de nuevo
      if (authVerified) {
        setIsLoading(false);
        setIsAuthenticated(true);
        return;
      }
      
      console.log("Verificando autenticación...");
      try {
        // Verificar autenticación haciendo una petición al servidor
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Incluir credentials para que se envíen las cookies
          credentials: "include",
        });

        console.log("Respuesta de verificación:", response.status);
        
        if (!response.ok) {
          // Si no está autenticado, redirigir al login
          console.error("No autenticado, redirigiendo al login");
          router.push("/admin");
          return;
        }

        const data = await response.json();
        console.log("Usuario autenticado:", data.user);
        
        // Marcar como verificado globalmente
        authVerified = true;
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        router.push("/admin");
      }
    };

    checkAuth();
  }, []); // Dependencia vacía para que solo se ejecute al montar el componente

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Asegura que las cookies se envíen correctamente
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al cerrar sesión");
      }

      // Ya no necesitamos eliminar la cookie aquí
      // La cookie se elimina desde el servidor
      setIsAuthenticated(false);
      
      // Resetear la variable global
      authVerified = false;

      // Redirect to login
      router.push("/admin");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, redirigir al login
      setIsAuthenticated(false);
      authVerified = false;
      router.push("/admin");
    }
  };

  // Si todavía está cargando, mostrar indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold-light">Verificando autenticación...</p>
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
