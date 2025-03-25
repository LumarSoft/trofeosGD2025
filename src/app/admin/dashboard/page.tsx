"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useProducts from "./hooks/useProducts";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import ProductTabs from "./ProductTabs";

export default function AdminDashboard() {
  const router = useRouter();
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
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      // Para fines de demostración, lo estableceremos en true cuando lleguemos a esta página
      localStorage.setItem("isAuthenticated", "true");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/admin");
  };

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
