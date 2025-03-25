"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  Award,
  Gift,
  Shield,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/shared/components/navbar";
import Footer from "@/shared/components/footer";

const categories = [
  { id: "metal-cups", name: "Copas Metálicas", icon: Trophy },
  { id: "trophies", name: "Trofeos", icon: Award },
  { id: "medals", name: "Medallas", icon: Medal },
  { id: "plaques", name: "Plaquetas", icon: Shield },
  { id: "plates", name: "Placas", icon: BookOpen },
  { id: "corporate-gifts", name: "Regalos Empresariales", icon: Gift },
  { id: "leather-goods", name: "Marroquinería", icon: Briefcase },
];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/catalog/${categoryId}`);
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
                onClick={() => handleCategoryClick(category.id)}
                className="card-category card-hover cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <category.icon className="w-12 h-12 mb-4 text-gold" />
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
