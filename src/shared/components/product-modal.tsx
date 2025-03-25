"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-black border border-gold/50 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
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
            <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 md:p-8 w-full md:w-1/2">
              <div className="text-sm text-gold-light/60 mb-2">
                {product.category}
              </div>
              <h2 className="text-2xl font-bold text-gold mb-4">
                {product.name}
              </h2>
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

              <div className="mt-8">
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
    </AnimatePresence>
  );
}
