"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Package, LogOut, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface SidebarProps {
  router: AppRouterInstance;
  handleLogout: () => Promise<void>;
  activeSection?: string;
}

export default function Sidebar({
  router,
  handleLogout,
  activeSection = "products",
}: SidebarProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 border-r border-gold/20 p-4 hidden md:block"
      >
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-xl font-bold text-gold">ADMIN PANEL</h1>
        </div>

        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="w-full">
            <Button
              variant={activeSection === "products" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeSection === "products"
                  ? "bg-gold/20 text-gold"
                  : "text-gold-light/80 hover:text-gold hover:bg-gold/10"
              }`}
            >
              <Package className="mr-2 h-4 w-4" />
              Productos
            </Button>
          </Link>

          <Link href="/admin/dashboard/gallery" className="w-full">
            <Button
              variant={activeSection === "gallery" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeSection === "gallery"
                  ? "bg-gold/20 text-gold"
                  : "text-gold-light/80 hover:text-gold hover:bg-gold/10"
              }`}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Galería
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-4 w-56">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-colors"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </motion.div>

      {/* Diálogo de confirmación de cierre de sesión */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-black border border-gold/30 text-gold-light">
          <DialogHeader>
            <DialogTitle className="text-gold">Cerrar sesión</DialogTitle>
            <DialogDescription className="text-gold-light/70">
              ¿Estás seguro de que quieres cerrar sesión?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-gold/30 text-gold-light hover:bg-gold/10"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Cerrando sesión..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
