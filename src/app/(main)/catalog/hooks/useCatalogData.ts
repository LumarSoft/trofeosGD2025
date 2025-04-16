import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Categoria, Producto } from "@/shared/types/catalog";

// Fetcher para SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error al cargar datos");
    return res.json();
  });

export function useCatalogData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();

  // Cargar productos con SWR
  const {
    data: productos,
    error: productosError,
    isLoading: productosLoading,
  } = useSWR<Producto[]>("/api/productos", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Cargar categorías con SWR
  const {
    data: categorias,
    error: categoriasError,
    isLoading: categoriasLoading,
  } = useSWR<Categoria[]>("/api/categorias", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Estado combinado
  const loading = productosLoading || categoriasLoading;
  const error =
    productosError || categoriasError
      ? `Error al cargar datos: ${(productosError || categoriasError)?.message}`
      : null;

  // Efectos para manejar categoría desde URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categorias) {
      const categoryExists = categorias.some(
        (cat) => cat.name === categoryFromUrl
      );
      if (categoryExists) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, [searchParams, categorias]);

  // Lista de categorías
  const categoryOptions = [
    "Todas",
    ...(categorias?.map((cat) => cat.name) || []),
  ];

  // Filtrado de productos
  const filteredProducts = productos
    ? productos.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false);

        const matchesCategory =
          selectedCategory === "Todas" ||
          product.categoria?.name === selectedCategory;

        return matchesSearch && matchesCategory;
      })
    : [];

  // Funciones para manejar el modal
  const handleProductClick = (product: Producto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    productos,
    categorias,
    filteredProducts,
    categoryOptions,
    loading,
    error,
    selectedProduct,
    isModalOpen,
    handleProductClick,
    closeModal,
  };
}
