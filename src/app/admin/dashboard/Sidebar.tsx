import { motion } from "framer-motion";
import { Home, Package, Users, BarChart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SidebarProps {
  router: AppRouterInstance;
  handleLogout: () => void;
}

export default function Sidebar({ router, handleLogout }: SidebarProps) {
  return (
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
        <Button
          variant="ghost"
          className="w-full justify-start text-gold-light/80 hover:text-gold hover:bg-gold/10"
          onClick={() => router.push("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gold hover:bg-gold/10 bg-gold/5"
        >
          <Package className="mr-2 h-4 w-4" />
          Productos
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gold-light/80 hover:text-gold hover:bg-gold/10"
        >
          <Users className="mr-2 h-4 w-4" />
          Usuarios
        </Button>
      </nav>

      <div className="absolute bottom-4 w-56">
        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </motion.div>
  );
}
