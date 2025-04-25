"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Categoria {
  id: number;
  name: string;
}

interface Producto {
  id?: number;
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  images?: string[];
  position?: number;
  categoria?: {
    name: string;
  };
}

// Transformar producto de la API al formato que espera el componente
const transformApiProduct = (product: Producto) => {
  return {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    category_id: product.category_id,
    category: product.categoria?.name || "",
    images: product.images || [],
    position: product.position !== undefined ? product.position : 999999,
    image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=400&width=300",
  };
};

// Transformar producto del componente al formato que espera la API
const transformFormProduct = (product: any) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    category_id: product.category_id || null,
    images: product.images || [],
    position: product.position,
  };
};

export default function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [deletingProducts, setDeletingProducts] = useState<number[]>([]);

  // Función para recargar los productos
  const reloadProducts = async () => {
    try {
      setIsLoading(true);
      const productsResponse = await fetch("/api/productos");
      if (!productsResponse.ok) {
        throw new Error("Error al recargar los productos");
      }
      const productsData = await productsResponse.json();
      
      setProducts(
        Array.isArray(productsData)
          ? productsData.map(transformApiProduct)
          : []
      );
    } catch (error) {
      console.error("Error al recargar productos:", error);
      toast.error("No se pudieron recargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Obtener productos
        const productsResponse = await fetch("/api/productos");
        if (!productsResponse.ok) {
          throw new Error("Error al cargar los productos");
        }
        const productsData = await productsResponse.json();

        // Establecer categorías predeterminadas en caso de error
        const defaultCategories = [
          { id: 1, name: "Copas Metálicas" },
          { id: 2, name: "Trofeos" },
          { id: 3, name: "Medallas" },
          { id: 4, name: "Plaquetas" },
          { id: 5, name: "Placas" },
          { id: 6, name: "Regalos Empresariales" },
          { id: 7, name: "Marroquinería" },
        ];

        try {
          // Intentar obtener categorías
          const categoriesResponse = await fetch("/api/categorias");
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setCategories(
              categoriesData.length > 0 ? categoriesData : defaultCategories
            );
          } else {
            // Usar categorías predeterminadas si hay error
            setCategories(defaultCategories);
          }
        } catch (error) {
          console.error("Error al cargar categorías:", error);
          // Usar categorías predeterminadas en caso de error
          setCategories(defaultCategories);
        }

        setProducts(
          Array.isArray(productsData)
            ? productsData.map(transformApiProduct)
            : []
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("No se pudieron cargar los productos");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Abrir formulario para añadir producto
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar producto
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Mostrar diálogo de confirmación para eliminar producto
  const handleDeleteProduct = (productId: number) => {
    if (!productId) return;
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  // Confirmar eliminación de producto
  const confirmDelete = async () => {
    const productId = productToDelete;
    
    if (!productId) return;
    
    try {
      // Marcar producto como "eliminándose" para efectos visuales
      setDeletingProducts(prev => [...prev, productId]);
      
      // Cerrar el diálogo
      setDeleteDialogOpen(false);
      
      const response = await fetch(`/api/productos/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // Actualizar lista de productos
      setProducts(products.filter((p) => p.id !== productId));
      
      // Guardar timestamp de actualización para que el catálogo lo detecte
      if (typeof window !== 'undefined') {
        localStorage.setItem("admin_update_timestamp", Date.now().toString());
      }
      
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("No se pudo eliminar el producto");
    } finally {
      // Quitar el producto de la lista de "eliminándose"
      setDeletingProducts(prev => prev.filter(id => id !== productId));
      setProductToDelete(null);
    }
  };

  // Guardar producto (crear o actualizar)
  const handleSaveProduct = async (productData: any) => {
    try {
      // Buscar el ID de la categoría basado en el nombre
      const category = categories.find((c) => c.name === productData.category);
      const category_id = category?.id;

      // Preparar datos para la API
      const apiData = {
        ...transformFormProduct(productData),
        category_id,
      };

      let response;

      if (editingProduct && editingProduct.id) {
        // Actualizar producto existente
        response = await fetch(`/api/productos/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });
      } else {
        // Crear nuevo producto
        response = await fetch("/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el producto");
      }

      const savedProduct = await response.json();

      // Actualizar lista de productos
      if (editingProduct && editingProduct.id) {
        setProducts(
          products.map((p) =>
            p.id === savedProduct.id ? transformApiProduct(savedProduct) : p
          )
        );
        toast.success("Producto actualizado correctamente");
      } else {
        setProducts([...products, transformApiProduct(savedProduct)]);
        toast.success("Producto creado correctamente");
      }

      // Guardar timestamp de actualización para que el catálogo lo detecte
      if (typeof window !== 'undefined') {
        localStorage.setItem("admin_update_timestamp", Date.now().toString());
      }

      // Cerrar formulario
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto"
      );
    }
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return {
    products,
    categories,
    isFormOpen,
    editingProduct,
    isLoading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    productToDelete,
    deletingProducts,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handleCancelForm,
    confirmDelete,
    reloadProducts,
  };
}
