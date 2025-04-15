"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ImageIcon, Calendar, Building, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/shared/components/footer";

interface GalleryItem {
  id: number;
  image_url: string;
  company: string;
  description: string;
  date: string;
}

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/gallery");

        if (!response.ok) {
          throw new Error("No se pudieron cargar los elementos de la galería");
        }

        const data = await response.json();
        setGalleryItems(data);
      } catch (err) {
        console.error("Error al cargar la galería:", err);
        setError(
          "No se pudo cargar la galería. Por favor, inténtelo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchGalleryItems();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Elementos animation variants para framer-motion
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold mx-auto mb-4"></div>
            <p className="text-gold-light">Cargando galería...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8 bg-black/60 rounded-lg border border-gold/30">
            <ImageIcon className="h-16 w-16 text-gold/50 mx-auto mb-4" />
            <h2 className="text-gold text-xl font-bold mb-2">
              Error de Conexión
            </h2>
            <p className="text-gold-light">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section con Background y subtítulo */}
      <section className="relative h-72 md:h-96 bg-black">
        {/* Botón de regreso */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 backdrop-blur-sm border-gold/30 text-gold hover:bg-gold/20 rounded-full w-10 h-10"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Regresar</span>
            </Button>
          </Link>
        </div>

        <Image
          src="/trofeoAboutSection.webp" // Reemplaza con tu imagen real
          alt="Galería de trabajos"
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          priority
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgICAQQDAAAAAAAAAAAAAQIDBAUGESEABxITFDFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBETIUH/2gAMAwEAAhEDEQA/AMxsOezcFZb+PiEsXwKHUeC/hVVlLvz9sqjkAk9AdLZDK3bdrHVZmtZB2nZInIKsxAYkfnHUDpNa5Z86WoWQljPr8lXryonq+KwkBIOyDwQQCP7ozt2dz+bDwVeS7DDyokjZT3lZTyQAOPBeCSeOnBwaiAOEI0o7a2aFSfHIqbMsSzP/2Q=="
          className="object-cover opacity-40"
          style={{
            objectPosition: "center 40%",
          }}
        />
        {/* Overlay con gradiente mejorado que se difumina a negro en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black"></div>

        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <motion.div
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
              Galería de trabajos
            </h1>
            <p className="text-lg md:text-xl text-gold-light/90 max-w-2xl mx-auto">
              Descubre nuestros trabajos más destacados y las empresas que han
              confiado en nosotros
            </p>
          </motion.div>
        </div>
      </section>

      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          ></motion.div>

          {/* Grid de la galería */}
          {galleryItems.length === 0 ? (
            <div className="text-center py-16 border border-gold/20 rounded-lg">
              <ImageIcon className="h-16 w-16 text-gold/30 mx-auto mb-4" />
              <p className="text-gold-light/70 text-lg">
                No hay elementos disponibles en la galería en este momento.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {galleryItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className="bg-black/90 border border-gold/20 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={`Trabajo para ${item.company}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                      {item.company}
                    </h3>
                    <p className="text-sm text-gold-light/70 line-clamp-2 group-hover:text-gold-light/90 transition-colors duration-300">
                      {item.description}
                    </p>
                    <div className="mt-3 text-xs text-gold-light/50 flex items-center group-hover:text-gold-light/70 transition-colors duration-300">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.date)}
                    </div>

                    {/* Línea decorativa inferior */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gold/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal para vista detallada, simplificado sin referencias al DOM ni control de scroll */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <GalleryItemModal item={selectedItem} onClose={closeModal} />
        )}
      </AnimatePresence>
    </main>
  );
}

interface GalleryItemModalProps {
  item: GalleryItem;
  onClose: () => void;
}

function GalleryItemModal({ item, onClose }: GalleryItemModalProps) {
  // Formato de fecha para el modal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Barra superior móvil - Solo visible en móvil */}
      <div className="fixed top-0 left-0 right-0 bg-black border-b border-gold/30 p-3 flex items-center justify-between md:hidden z-[60]">
        <button onClick={onClose} className="flex items-center text-gold">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Volver</span>
        </button>
        <span className="text-gold font-medium line-clamp-1">
          {item.company}
        </span>
        <div className="w-5"></div>{" "}
        {/* Espacio vacío para mantener el centrado */}
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
        className="bg-black border border-gold/50 rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto mt-12 md:mt-0 transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre (solo visible en desktop) */}
        <div className="relative hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 text-gold hover:bg-gold/10 rounded-full"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={`Trabajo para ${item.company}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="p-4 sm:p-6 md:p-8 w-full md:w-1/2">
            <div className="md:block hidden">
              <div className="flex items-center text-gold-light/60 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(item.date)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                {item.company}
              </h2>
            </div>

            <div className="text-gold-light/80 mb-6 whitespace-pre-wrap break-words">
              {item.description || ""}
            </div>

            <div className="mt-6 md:mt-8 bottom-0 bg-black py-3 border-t border-gold/20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 will-change-auto z-10">
              <Button
                className="w-full bg-gold hover:bg-gold-dark text-black font-medium"
                onClick={() => (window.location.href = "/contact")}
              >
                Contactar para un proyecto similar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
