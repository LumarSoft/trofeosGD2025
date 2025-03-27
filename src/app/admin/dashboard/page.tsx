"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useProducts from "./hooks/useProducts";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import ProductTabs from "./ProductTabs";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    products,
    isFormOpen,
    editingProduct,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handleCancelForm,
  } = useProducts();

  // Comprobar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        router.push("/admin");
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      setIsLoading(true); // Mostrar loading mientras se cierra sesión

      // Llamar a la API de logout
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

      // Eliminar la cookie en el cliente también
      Cookies.remove("auth_token");

      // Redirigir al login
      router.push("/admin");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aun así, intentamos eliminar la cookie y redirigir
      Cookies.remove("auth_token");
      router.push("/admin");
    }
  };

  // Mostrar loading mientras se verifica la autenticación
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
      <Sidebar router={router} handleLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <AdminHeader
            handleAddProduct={handleAddProduct}
            handleLogout={handleLogout}
          />

          <ProductTabs
            products={products}
            isFormOpen={isFormOpen}
            editingProduct={editingProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleSaveProduct={handleSaveProduct}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  );
}
