"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/shared/components/navbar";
import Footer from "@/shared/components/footer";
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
        <div className="flex items-center justify-center w-20 h-20">
          <IconComponent className="w-14 h-14 text-gold transition-transform duration-300 group-hover:scale-125" />
        </div>
      );
    } else if (category.type === "image" && category.image) {
      return (
        <div className="w-20 h-20 relative">
          <Image
            src={category.image}
            alt={category.name}
            fill
            objectFit="contain"
            className="transition-transform duration-300 group-hover:scale-125"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="heading-primary mb-4">Elegancia en cada premio</h1>
            <p className="text-lg md:text-xl text-gold-light/80 max-w-2xl mx-auto">
              Explorá nuestra colección exclusiva de trofeos y reconocimientos
              de la más alta calidad
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="card-category card-hover cursor-pointer p-4 bg-black/5 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex items-center justify-center h-20">
                    {renderIconOrImage(category)}
                  </div>
                  <h3 className="text-lg font-medium text-gold">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Button
              onClick={() => router.push("/catalog")}
              className="btn-primary px-8 py-6 rounded-md font-medium"
            >
              Ver catálogo completo
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
