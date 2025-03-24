"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Home,
  Package,
  Settings,
  Users,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductForm from "@/components/admin-product-form";

// Sample data - in a real app, this would come from an API or database
const initialProducts = [
  {
    id: 1,
    name: "Copa Campeón Elite",
    description:
      "Copa metálica de alta calidad con base de mármol negro y detalles dorados.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Copas Metálicas",
  },
  {
    id: 2,
    name: "Trofeo Victoria",
    description:
      "Trofeo elegante con figura de victoria alada y base personalizable.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Trofeos",
  },
  {
    id: 3,
    name: "Medalla Olímpica",
    description:
      "Medalla de metal con cinta personalizable y acabado brillante.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Medallas",
  },
  {
    id: 4,
    name: "Plaqueta Conmemorativa",
    description: "Plaqueta de cristal con grabado láser y base iluminada.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Plaquetas",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Check if user is authenticated (in a real app, this would verify a token or session)
  useEffect(() => {
    // Simulate checking authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      // For demo purposes, we'll set this to true when we reach this page
      localStorage.setItem("isAuthenticated", "true");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/admin");
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      setProducts(products.filter((product) => product.id !== productId));
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : product
        )
      );
    } else {
      // Add new product
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      setProducts([...products, { ...productData, id: newId }]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
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
          <Button
            variant="ghost"
            className="w-full justify-start text-gold-light/80 hover:text-gold hover:bg-gold/10"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Estadísticas
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gold-light/80 hover:text-gold hover:bg-gold/10"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
        </nav>

        <div className="absolute bottom-4 w-56">
          <Button
            variant="outline"
            className="w-full border-gold/30 text-gold hover:bg-gold/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gold">
              Panel de Administración
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 md:hidden"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
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

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-black border border-gold/30 mb-6">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                Productos
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                Categorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-0">
              {isFormOpen ? (
                <AdminProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelForm}
                />
              ) : (
                <div className="border border-gold/30 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gold/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-gold font-medium">
                            Imagen
                          </th>
                          <th className="px-4 py-3 text-left text-gold font-medium">
                            Nombre
                          </th>
                          <th className="px-4 py-3 text-left text-gold font-medium">
                            Categoría
                          </th>
                          <th className="px-4 py-3 text-left text-gold font-medium">
                            Descripción
                          </th>
                          <th className="px-4 py-3 text-right text-gold font-medium">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/10">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gold/5">
                            <td className="px-4 py-3">
                              <div className="relative h-12 w-12 rounded overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gold-light">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-gold-light/70">
                              {product.category}
                            </td>
                            <td className="px-4 py-3 text-gold-light/70 max-w-xs truncate">
                              {product.description}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gold-light/70 hover:text-gold hover:bg-gold/10"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gold-light/70 hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories">
              <div className="text-center py-12 text-gold-light/70">
                Gestión de categorías en desarrollo...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
