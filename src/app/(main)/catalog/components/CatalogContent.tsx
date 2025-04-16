"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCatalogData } from "../hooks/useCatalogData";
import SearchFilters from "./SearchFilters";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function CatalogContent() {
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
    <section className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryOptions={categoryOptions}
        />

        {loading && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gold-light/70 text-lg">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 md:py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} onClick={handleProductClick} />
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-gold-light/70 text-lg">
              No se encontraron productos que coincidan con su búsqueda.
            </p>
          </div>
        ) : null}
      </div>

      {/* Modal de producto */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <ProductModal product={selectedProduct} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  );
}
