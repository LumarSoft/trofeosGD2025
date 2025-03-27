"use client";

import { useState } from "react";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  handleAddProduct: () => void;
  handleLogout: () => Promise<void>;
}

export default function AdminHeader({
  handleAddProduct,
  handleLogout,
}: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      setIsLoggingOut(true);
      try {
        await handleLogout();
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gold">Panel de Administración</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/10 md:hidden"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gold"></div>
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
        <Button
          className="bg-gold hover:bg-gold-dark text-black"
          onClick={handleAddProduct}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
    </div>
  );
}
