import { Producto } from "@/shared/types/catalog";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, memo } from "react";

interface ProductCardProps {
  product: Producto;
  onClick: (product: Producto) => void;
}

// Memo para evitar re-renders innecesarios
const ProductCard = memo(function ProductCard({ product, onClick }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para obtener la URL de la imagen con índice
  const getImageUrl = useCallback((product: Producto, index: number = 0): string => {
    // Si el producto tiene un array de imágenes, usar la imagen del índice
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[index];
    }
    // Si no, usar image_url o image como fallback
    return product.image_url || product.image || "/placeholder.svg";
  }, []);

  // Funciones para navegar entre imágenes
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que el clic propague al card
    if (Array.isArray(product.images) && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % (product.images?.length || 1));
    }
  }, [product.images]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que el clic propague al card
    if (Array.isArray(product.images) && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
    }
  }, [product.images]);

  const handleDotClick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }, []);

  const hasMultipleImages = Array.isArray(product.images) && product.images.length > 1;
  const imageUrl = getImageUrl(product, currentImageIndex);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product)}
      className="bg-black/90 border border-gold/20 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col h-full"
      layout="position"
      layoutId={`product-${product.id}`}
    >
      <div className="relative w-full pt-[75%] sm:pt-[100%] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name || "Producto"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 absolute top-0 left-0"
          loading="lazy"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg=="
          placeholder="blur"
          quality={75}
        />
        {/* Overlay gradiente sutil que aparece en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Flechas de navegación */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gold/50"
              aria-label="Imagen anterior"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gold/50"
              aria-label="Siguiente imagen"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Indicadores de imágenes */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.images && product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(e, index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentImageIndex === index
                      ? "bg-gold"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          </>
        )}

        {/* Borde decorativo que aparece en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500 will-change-transform"></div>
          <div className="absolute top-0 right-0 w-0 h-[2px] bg-gradient-to-l from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500 delay-100 will-change-transform"></div>
        </div>
      </div>
      <div className="p-3 sm:p-4 relative flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-medium text-gold mb-1 transition-colors duration-300 group-hover:text-gold line-clamp-1">
          {product.name || "Sin nombre"}
        </h3>
        <p className="text-xs sm:text-sm text-gold-light/70 line-clamp-2 group-hover:text-gold-light/90 transition-colors duration-300 mb-auto">
          {product.description || ""}
        </p>
        <div className="mt-2 sm:mt-3 text-xs text-gold-light/50 group-hover:text-gold-light/70 transition-colors duration-300">
          {product.categoria?.name || "Sin categoría"}
        </div>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-[1px] bg-gold/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 will-change-transform"></div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
