"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/shared/components/navbar";
import ProductModal from "./product-modal";
import { useSearchParams } from "next/navigation";

interface Producto {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url: string;
  category_id: number | null;
  categoria: {
    name: string;
  } | null;
}

interface Categoria {
  id: number;
  name: string;
}

// Componente interno que usa useSearchParams
function CatalogContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para almacenar datos de la API
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar productos
        const productosRes = await fetch("/api/productos");
        if (!productosRes.ok) throw new Error("Error al cargar productos");
        const productosData = await productosRes.json();

        // Cargar categorías
        const categoriasRes = await fetch("/api/categorias");
        if (!categoriasRes.ok) throw new Error("Error al cargar categorías");
        const categoriasData = await categoriasRes.json();

        setProductos(productosData);
        setCategorias(categoriasData);

        // Leer el parámetro de categoría de la URL
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
          // Verificar si la categoría de la URL existe en las categorías cargadas
          const categoryExists = categoriasData.some(
            (cat: Categoria) => cat.name === categoryFromUrl
          );
          // Establecer la categoría seleccionada si existe, de lo contrario mantener "Todas"
          if (categoryExists) {
            setSelectedCategory(categoryFromUrl);
          }
        }

        setError(null);
      } catch (err) {
        setError(
          "Error al cargar datos: " +
            (err instanceof Error ? err.message : String(err))
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Lista de categorías incluyendo "Todas" al inicio
  const categoryOptions = ["Todas", ...categorias.map((cat) => cat.name)];

  // Filtrar productos según búsqueda y categoría seleccionada
  const filteredProducts = productos.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesCategory =
      selectedCategory === "Todas" ||
      product.categoria?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: Producto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gold">
              Catálogo de Productos
            </h1>
            <p className="text-lg text-gold-light/80 max-w-2xl mx-auto">
              Explore nuestra colección de trofeos, medallas y reconocimientos
              de alta calidad
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light/50" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gold/30 focus:border-gold text-gold-light"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-black border-gold/30 focus:border-gold text-gold-light">
                  <Filter className="h-4 w-4 mr-2 text-gold" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gold/30">
                  {categoryOptions.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-gold-light hover:bg-gold/10 focus:bg-gold/10"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gold-light/70 text-lg">
                Cargando productos...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProductClick(product)}
                  className="bg-black/90 border border-gold/20 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={
                        product.image_url || product.image || "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay gradiente sutil que aparece en hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Borde decorativo que aparece en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500"></div>
                      <div className="absolute top-0 right-0 w-0 h-[2px] bg-gradient-to-l from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500 delay-100"></div>
                    </div>
                  </div>
                  <div className="p-4 relative">
                    <h3 className="text-lg font-medium text-gold mb-1 transition-colors duration-300 group-hover:text-gold">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gold-light/70 line-clamp-2 group-hover:text-gold-light/90 transition-colors duration-300">
                      {product.description || ""}
                    </p>
                    <div className="mt-3 text-xs text-gold-light/50 group-hover:text-gold-light/70 transition-colors duration-300">
                      {product.categoria?.name || "Sin categoría"}
                    </div>

                    {/* Línea decorativa inferior */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gold/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : !loading && !error ? (
            <div className="text-center py-12">
              <p className="text-gold-light/70 text-lg">
                No se encontraron productos que coincidan con su búsqueda.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <ProductModal product={selectedProduct} onClose={closeModal} />
        )}
      </AnimatePresence>
    </main>
  );
}

// Componente de carga para Suspense
function CatalogLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gold">
              Catálogo de Productos
            </h1>
            <p className="text-lg text-gold-light/80 max-w-2xl mx-auto">
              Cargando catálogo...
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}
