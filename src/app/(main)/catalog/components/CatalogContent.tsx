"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCatalogData } from "../hooks/useCatalogData";
import SearchFilters from "./SearchFilters";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { memo, useCallback, useMemo } from "react";
import { Suspense } from "react";
import CatalogLoading from "./CatalogLoading";
import dynamic from "next/dynamic";
import { Producto } from "@/shared/types/catalog";

// Carga dinámica del modal para reducir el tamaño del bundle inicial
const DynamicProductModal = dynamic(() => import("./ProductModal"), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-gold/30 rounded-lg overflow-hidden max-w-4xl w-full p-8 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
});

// Memo para evitar re-renders innecesarios
const CatalogContent = memo(function CatalogContent() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categoryOptions,
    loading,
    error,
    selectedProduct,
    isModalOpen,
    handleProductClick,
    closeModal,
  } = useCatalogData();

  const handleProductCardClick = useCallback((product: Producto) => {
    handleProductClick(product);
  }, [handleProductClick]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reducir para hacer la animación más rápida
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15, // Añadir damping para reducir sobre-oscilación
        mass: 0.8, // Reducir mass para acelerar
      },
    },
  };

  // Memoizar la lista de productos para reducir re-renders
  const productList = useMemo(() => {
    return filteredProducts.map((product) => (
      <motion.div 
        key={product.id} 
        variants={itemVariants}
        layout
        layoutId={`product-container-${product.id}`}
      >
        <ProductCard 
          product={product} 
          onClick={handleProductCardClick}
        />
      </motion.div>
    ));
  }, [filteredProducts, handleProductCardClick, itemVariants]);

  if (loading) {
    return <CatalogLoading />;
  }

  return (
    <section className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gold">
            Catálogo de productos
          </h1>
          <p className="text-base md:text-lg text-gold-light/80 max-w-2xl mx-auto">
            Explore nuestra colección de trofeos, medallas y reconocimientos de
            alta calidad
          </p>
        </motion.div>

        {/* Componente de búsqueda y filtros */}
        <div className="mb-6 md:mb-8">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryOptions={categoryOptions}
          />
        </div>

        {error && (
          <div className="text-center py-8 md:py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!error && filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            layout
          >
            {productList}
          </motion.div>
        ) : !error ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-gold-light/70 text-lg">
              No se encontraron productos que coincidan con su búsqueda.
            </p>
          </div>
        ) : null}
      </div>

      {/* Modal de producto */}
      <AnimatePresence mode="wait">
        {isModalOpen && selectedProduct && (
          <Suspense fallback={null}>
            <DynamicProductModal 
              product={selectedProduct} 
              onClose={closeModal} 
            />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
});

export default CatalogContent;
