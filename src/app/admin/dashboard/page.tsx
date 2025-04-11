"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useProducts from "./hooks/useProducts";
import ProductTabs from "./ProductTabs";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");

  const {
    products,
    categories,
    isFormOpen,
    editingProduct,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handleCancelForm,
  } = useProducts();

  return (
    <AdminLayout>
      <ProductTabs
        products={products}
        categories={categories}
        isFormOpen={isFormOpen}
        editingProduct={editingProduct}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
        handleSaveProduct={handleSaveProduct}
        handleCancelForm={handleCancelForm}
        handleAddProduct={handleAddProduct}
        onTabChange={setActiveTab}
      />
    </AdminLayout>
  );
}
