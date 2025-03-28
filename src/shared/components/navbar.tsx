"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    // Guardar la posición actual del scroll
    const scrollPosition = window.scrollY;

    setIsMenuOpen(!isMenuOpen);

    // Prevenir que la página se desplace hacia arriba al abrir el menú
    // usando un pequeño timeout para permitir que React actualice el DOM
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 10);
  };

  // Variantes de animación para elementos de navegación
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  // Variantes para elementos de menú móvil
  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.3,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      x: -10,
      transition: {
        delay: 0.03 * i,
        duration: 0.2,
      },
    }),
  };

  // Variantes para el contenedor móvil
  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2 },
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2, delay: 0.1 },
      },
    },
  };

  return (
    <header className="border-b border-gold/20 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Image
                src="/logoHD+.png"
                alt="Trofeos GD - Desde 1989"
                width={110}
                height={0}
                className="object-contain w-[85px] md:w-[110px]" // Tamaño más pequeño en móvil
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href="/"
                className="text-gold-light/80 hover:text-gold transition-colors"
              >
                Inicio
              </Link>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href="/catalog"
                className="text-gold-light/80 hover:text-gold transition-colors"
              >
                Catálogo
              </Link>
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href="/about"
                className="text-gold-light/80 hover:text-gold transition-colors"
              >
                Nosotros
              </Link>
            </motion.div>
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href="/contact"
                className="text-gold-light/80 hover:text-gold transition-colors"
              >
                Contacto
              </Link>
            </motion.div>
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-black"
                >
                  <User className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-gold hover:bg-gold/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden overflow-hidden">
        <motion.div
          ref={containerRef}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
          className="bg-black border-t border-gold/20 will-change-[height] overflow-hidden absolute left-0 right-0 z-40"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <motion.div
              custom={0}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              variants={mobileNavItemVariants}
            >
              <Link
                href="/"
                className="text-gold-light/80 hover:text-gold py-2 transition-colors block"
                onClick={toggleMenu}
              >
                Inicio
              </Link>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              variants={mobileNavItemVariants}
            >
              <Link
                href="/catalog"
                className="text-gold-light/80 hover:text-gold py-2 transition-colors block"
                onClick={toggleMenu}
              >
                Catálogo
              </Link>
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              variants={mobileNavItemVariants}
            >
              <Link
                href="/about"
                className="text-gold-light/80 hover:text-gold py-2 transition-colors block"
                onClick={toggleMenu}
              >
                Nosotros
              </Link>
            </motion.div>
            <motion.div
              custom={3}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              variants={mobileNavItemVariants}
            >
              <Link
                href="/contact"
                className="text-gold-light/80 hover:text-gold py-2 transition-colors block"
                onClick={toggleMenu}
              >
                Contacto
              </Link>
            </motion.div>
            <motion.div
              custom={4}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              variants={mobileNavItemVariants}
            >
              <Link href="/admin" onClick={toggleMenu}>
                <Button
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                >
                  <User className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
