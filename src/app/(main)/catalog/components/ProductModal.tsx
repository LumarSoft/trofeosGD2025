"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Producto } from "@/shared/types/catalog";

interface ProductModalProps {
  product: Producto;
  onClose: () => void;
}

// Memo para prevenir renders innecesarios
const ProductModal = memo(function ProductModal({ product, onClose }: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [initialLoad, setInitialLoad] = useState(true);

  // Función para construir URLs completas de Supabase si es necesario
  const buildSupabaseUrl = useCallback((path: string): string => {
    // Si ya es una URL completa, devolverla pero asegurándose de que use /uploads en lugar de /temp
    if (path && path.startsWith("http")) {
      // Reemplazar /temp/ por /uploads/ en la URL
      return path.replace("/temp/", "/uploads/");
    }

    // Si es una ruta relativa que parece ser de supabase, construir la URL completa
    if (path && (path.includes("uploads/") || path.includes("temp/"))) {
      // Extraer solo el nombre del archivo
      const fileName = path.split("/").pop();
      if (fileName) {
        return `https://bdxxvwjghayycdueeoot.supabase.co/storage/v1/object/public/productos/uploads/${fileName}`;
      }
    }

    // Si es una imagen local o placeholder, devolverla sin cambios
    return path;
  }, []);

  // Función para obtener la URL de la imagen
  const getImageUrl = useCallback((product: Producto, index: number = 0): string => {
    // Si el producto tiene un array de imágenes, usar ese
    if (Array.isArray(product.images) && product.images.length > 0) {
      return buildSupabaseUrl(product.images[index]);
    }
    // Si no, usar image_url o image como fallback
    return buildSupabaseUrl(product.image_url || product.image || "/placeholder.svg");
  }, [buildSupabaseUrl]);

  // Función para navegar entre imágenes con transición suave
  const nextImage = useCallback(() => {
    if (isTransitioning) return;
    
    const images = product.images;
    if (Array.isArray(images) && images.length > 1) {
      // Verificar si la siguiente imagen ya está cargada
      const nextIndex = (currentImageIndex + 1) % images.length;
      const nextImageLoaded = imagesLoaded[nextIndex];
      
      // Solo mostrar transición si la imagen no está cargada
      setIsTransitioning(!nextImageLoaded);
      
      // Cambiar inmediatamente si la imagen ya está cargada, sino con un pequeño delay
      if (nextImageLoaded) {
        setCurrentImageIndex(nextIndex);
      } else {
        setTimeout(() => {
          setCurrentImageIndex(nextIndex);
          setIsTransitioning(false);
        }, 150);
      }
    }
  }, [currentImageIndex, imagesLoaded, isTransitioning, product.images]);

  const prevImage = useCallback(() => {
    if (isTransitioning) return;
    
    const images = product.images;
    if (Array.isArray(images) && images.length > 1) {
      // Verificar si la imagen anterior ya está cargada
      const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
      const prevImageLoaded = imagesLoaded[prevIndex];
      
      // Solo mostrar transición si la imagen no está cargada
      setIsTransitioning(!prevImageLoaded);
      
      // Cambiar inmediatamente si la imagen ya está cargada, sino con un pequeño delay
      if (prevImageLoaded) {
        setCurrentImageIndex(prevIndex);
      } else {
        setTimeout(() => {
          setCurrentImageIndex(prevIndex);
          setIsTransitioning(false);
        }, 150);
      }
    }
  }, [currentImageIndex, imagesLoaded, isTransitioning, product.images]);

  // Función para cambiar a una imagen específica
  const goToImage = useCallback((index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    
    const imageLoaded = imagesLoaded[index];
    
    // Solo mostrar transición si la imagen no está cargada
    setIsTransitioning(!imageLoaded);
    
    // Cambiar inmediatamente si la imagen ya está cargada, sino con un pequeño delay
    if (imageLoaded) {
      setCurrentImageIndex(index);
    } else {
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentImageIndex, imagesLoaded, isTransitioning]);

  // Precargar todas las imágenes del producto
  useEffect(() => {
    let isMounted = true;
    
    if (Array.isArray(product.images) && product.images.length > 0) {
      const imagesToPreload = product.images.map((img, index) => getImageUrl(product, index));
      
      // Precargar las imágenes
      Promise.all(imagesToPreload.map((url, index) => {
        return new Promise<string>((resolve) => {
          const img = new window.Image();
          img.src = url;
          img.onload = () => {
            // Solo actualizar el estado si el componente está montado
            if (isMounted) {
              setImagesLoaded(prev => ({...prev, [index]: true}));
            }
            resolve(url);
          };
          img.onerror = () => resolve(url); // Continúa incluso si hay error
        });
      }))
      .then(preloaded => {
        if (isMounted) {
          setPreloadedImages(preloaded);
          setInitialLoad(false);
        }
      });
    }
    
    // Cleanup para evitar fugas de memoria
    return () => {
      isMounted = false;
    };
  }, [product, getImageUrl]);

  // Efecto para cerrar el modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Efecto para manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentImageIndex, imagesLoaded, nextImage, onClose, prevImage]);

  // Verificar si tenemos múltiples imágenes
  const hasMultipleImages = Array.isArray(product.images) && product.images.length > 1;
  const currentImageUrl = getImageUrl(product, currentImageIndex);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black/90 border border-gold/30 rounded-lg overflow-hidden max-w-4xl w-full"
        layoutId={`product-modal-${product.id}`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] bg-black/50">
            {/* Capa de carga si está en transición */}
            {isTransitioning && (
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Preload de todas las imágenes en el fondo */}
            {initialLoad && (
              <div className="hidden">
                {preloadedImages.map((src, i) => (
                  <Image 
                    key={`preload-${i}`}
                    src={src}
                    alt="preload"
                    width={10}
                    height={10}
                  />
                ))}
              </div>
            )}
            
            {/* Imagen actual con animación */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative"
              >
                <Image
                  src={currentImageUrl}
                  alt={product.name || "Detalle del producto"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg=="
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Estado de carga inicial */}
            {initialLoad && (
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/50 text-gold-light text-xs rounded-full px-2 py-1 flex items-center">
                  <div className="w-2 h-2 mr-1 bg-gold rounded-full animate-pulse"></div>
                  Cargando imágenes
                </div>
              </div>
            )}
            
            {/* Controles del carrusel */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  disabled={isTransitioning}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors z-20 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Imagen anterior"
                  type="button"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={isTransitioning}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors z-20 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Siguiente imagen"
                  type="button"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Indicadores de imágenes */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  {product.images && product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentImageIndex === index
                          ? "bg-gold"
                          : imagesLoaded[index]
                            ? "bg-white/60 hover:bg-white/80"
                            : "bg-white/30 hover:bg-white/50"
                      } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isTransitioning}
                      aria-label={`Ver imagen ${index + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
            <div className="md:block hidden">
              <div className="text-sm text-gold-light/60 mb-2">
                {product.categoria?.name || "Sin categoría"}
              </div>
              <h2 id="modal-title" className="text-2xl font-bold text-gold mb-4">
                {product.name || "Detalle del producto"}
              </h2>
            </div>

            <div className="text-gold-light/80 mb-6 whitespace-pre-wrap break-words">
              {product.description || ""}
            </div>

            <div className="mt-6 md:mt-8 bottom-0 bg-black py-3 border-t border-gold/20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 will-change-auto z-10">
              <Button
                className="w-full bg-gold hover:bg-gold-dark text-black font-medium"
                onClick={() => (window.location.href = "/contact")}
                type="button"
              >
                Solicitar información
              </Button>
            </div>
          </div>
        </div>
        
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors z-20"
          aria-label="Cerrar modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
});

export default ProductModal;
