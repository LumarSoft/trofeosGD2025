import { Producto } from "@/shared/types/catalog";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: Producto;
  onClick: (product: Producto) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product)}
      className="bg-black/90 border border-gold/20 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative w-full pt-[75%] sm:pt-[100%] overflow-hidden">
        <Image
          src={product.image_url || product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 absolute top-0 left-0"
        />
        {/* Overlay gradiente sutil que aparece en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Borde decorativo que aparece en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-0 h-[2px] bg-gradient-to-l from-gold/0 via-gold/80 to-gold/0 group-hover:w-full transition-all duration-500 delay-100"></div>
        </div>
      </div>
      <div className="p-3 sm:p-4 relative flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-medium text-gold mb-1 transition-colors duration-300 group-hover:text-gold line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gold-light/70 line-clamp-2 group-hover:text-gold-light/90 transition-colors duration-300 mb-auto">
          {product.description || ""}
        </p>
        <div className="mt-2 sm:mt-3 text-xs text-gold-light/50 group-hover:text-gold-light/70 transition-colors duration-300">
          {product.categoria?.name || "Sin categoría"}
        </div>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-[1px] bg-gold/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </motion.div>
  );
}
