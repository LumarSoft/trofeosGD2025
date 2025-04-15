"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/shared/components/navbar";
import { categories, Category } from "./categories";

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    router.push(`/catalog?category=${encodeURIComponent(categoryName)}`);
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

  const renderIconOrImage = (category: Category) => {
    if (category.type === "icon" && category.icon) {
      const IconComponent = category.icon;
      return (
        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-gold transition-transform duration-300 group-hover:scale-110 md:group-hover:scale-125" />
        </div>
      );
    } else if (category.type === "image" && category.image) {
      return (
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
            className="object-contain transition-transform duration-300 group-hover:scale-110 md:group-hover:scale-125"
          />
        </div>
      );
    }
    return null;
  };

  // Estilos comunes para todas las tarjetas de categoría
  const categoryCardClass =
    "card-category card-hover cursor-pointer p-2 sm:p-3 md:p-4 bg-black/5 rounded-lg hover:shadow-md transition-all group flex flex-col items-center justify-center h-full";

  // División de categorías para versión móvil - Desktop usará otra estructura
  const topCategories = categories.slice(0, 4);
  const bottomCategories = categories.slice(4);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gold">
              Elegancia en cada premio
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gold-light/80 max-w-2xl mx-auto">
              Explorá nuestra colección exclusiva de trofeos y reconocimientos
              de la más alta calidad
            </p>
          </motion.div>

          <div className="px-2 sm:px-4 md:hidden">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 sm:gap-5"
            >
              {/* Primera fila en móvil: 2 columnas */}
              {categories.slice(0, 2).map((category) => (
                <motion.div
                  key={`mobile-${category.id}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={categoryCardClass}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      {renderIconOrImage(category)}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gold line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {/* Segunda fila en móvil: 2 columnas */}
              {categories.slice(2, 4).map((category) => (
                <motion.div
                  key={`mobile-${category.id}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={categoryCardClass}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      {renderIconOrImage(category)}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gold line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {/* Tercera fila en móvil: 2 columnas */}
              {categories.slice(4, 6).map((category) => (
                <motion.div
                  key={`mobile-${category.id}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={categoryCardClass}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      {renderIconOrImage(category)}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gold line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {/* Última categoría que ocupa el ancho de 2 en móvil */}
              {categories.slice(6, 7).map((category) => (
                <motion.div
                  key={`mobile-${category.id}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={`${categoryCardClass} col-span-2`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      {renderIconOrImage(category)}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gold line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="hidden md:block px-8 lg:px-12">
            {/* Primeras 4 categorías en grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 gap-6 lg:gap-8"
            >
              {topCategories.map((category) => (
                <motion.div
                  key={`desktop-${category.id}`}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={categoryCardClass}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex items-center justify-center">
                      {renderIconOrImage(category)}
                    </div>
                    <h3 className="text-lg font-medium text-gold">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Últimas 3 categorías centradas */}
            <div className="flex justify-center mt-6 lg:mt-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-6 lg:gap-8 w-3/4"
              >
                {bottomCategories.map((category) => (
                  <motion.div
                    key={`desktop-${category.id}`}
                    variants={itemVariants}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleCategoryClick(category.id, category.name)
                    }
                    className={categoryCardClass}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex items-center justify-center">
                        {renderIconOrImage(category)}
                      </div>
                      <h3 className="text-lg font-medium text-gold">
                        {category.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 sm:mt-12 md:mt-16 text-center"
          >
            <Button
              onClick={() => router.push("/catalog")}
              className="btn-primary px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md font-medium text-sm sm:text-base"
            >
              Ver catálogo completo
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
