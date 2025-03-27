"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link
              href="/"
              className="text-gold-light/80 hover:text-gold transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              className="text-gold-light/80 hover:text-gold transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/about"
              className="text-gold-light/80 hover:text-gold transition-colors"
            >
              Nosotros
            </Link>
            <Link
              href="/contact"
              className="text-gold-light/80 hover:text-gold transition-colors"
            >
              Contacto
            </Link>
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
              >
                <User className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
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
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black border-t border-gold/20"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gold-light/80 hover:text-gold py-2 transition-colors"
              onClick={toggleMenu}
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              className="text-gold-light/80 hover:text-gold py-2 transition-colors"
              onClick={toggleMenu}
            >
              Catálogo
            </Link>
            <Link
              href="/about"
              className="text-gold-light/80 hover:text-gold py-2 transition-colors"
              onClick={toggleMenu}
            >
              Nosotros
            </Link>
            <Link
              href="/contact"
              className="text-gold-light/80 hover:text-gold py-2 transition-colors"
              onClick={toggleMenu}
            >
              Contacto
            </Link>
            <Link href="/admin" onClick={toggleMenu}>
              <Button
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold hover:text-black"
              >
                <User className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
