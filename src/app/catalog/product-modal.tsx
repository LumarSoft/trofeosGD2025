"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface ProductModalProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    category: string;
  };
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Función para manejar clicks fuera del modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Función para manejar tecla Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      {/* Barra superior móvil */}
      <div className="fixed top-0 left-0 right-0 bg-black border-b border-gold/30 p-3 flex items-center justify-between md:hidden z-[60]">
        <button onClick={onClose} className="flex items-center text-gold">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Volver</span>
        </button>
        <span className="text-gold font-medium line-clamp-1">
          {product.name}
        </span>
        <button onClick={onClose} className="text-gold p-1">
          <X className="h-5 w-5" />
        </button>
      </div>

      <motion.div
        ref={modalRef}
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
      >
        {/* Botón de cierre (solo visible en desktop) */}
        <div className="relative hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 text-gold hover:bg-gold/10 rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-auto">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="p-4 sm:p-6 md:p-8 w-full md:w-1/2">
            <div className="md:block hidden">
              <div className="text-sm text-gold-light/60 mb-2">
                {product.category}
              </div>
              <h2 className="text-2xl font-bold text-gold mb-4">
                {product.name}
              </h2>
            </div>

            <p className="text-gold-light/80 mb-6">{product.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gold mb-2">
                  Características
                </h3>
                <ul className="list-disc list-inside text-gold-light/70 space-y-1">
                  <li>Material de alta calidad</li>
                  <li>Acabado premium</li>
                  <li>Personalizable</li>
                  <li>Incluye estuche de presentación</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gold mb-2">
                  Personalización
                </h3>
                <p className="text-gold-light/70">
                  Este producto puede ser personalizado con grabado láser,
                  placas metálicas o impresión UV.
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-8 bottom-0 bg-black py-3 border-t border-gold/20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 will-change-auto z-10">
              <Button
                className="w-full bg-gold hover:bg-gold-dark text-black font-medium"
                onClick={() => (window.location.href = "/contact")}
              >
                Solicitar información
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
