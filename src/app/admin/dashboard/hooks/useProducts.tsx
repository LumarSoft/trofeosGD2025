import { useState } from "react";

// Datos de muestra: en una aplicación real, procederían de una API o una base de datos.
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

export default function useProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  return {
    products,
    isFormOpen,
    editingProduct,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handleCancelForm,
  };
}
