import { motion } from "framer-motion";

export default function CatalogLoading() {
  // Simulamos productos cargando con esqueletos
  const placeholders = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gold">
            Catálogo de productos
          </h1>
          <p className="text-base md:text-lg text-gold-light/80 max-w-2xl mx-auto">
            Cargando nuestra colección de trofeos y reconocimientos...
          </p>
        </motion.div>

        {/* Barra de búsqueda simulada */}
        <div className="mb-8">
          <div className="w-full h-12 bg-black/40 border border-gold/20 rounded-lg animate-pulse"></div>
        </div>

        {/* Esqueletos de productos */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {placeholders.map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-black/30 border border-gold/10 rounded-lg overflow-hidden h-[300px] flex flex-col"
            >
              {/* Imagen de placeholder */}
              <div className="relative w-full pt-[100%] bg-black/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 animate-pulse"></div>
                
                {/* Flechas de navegación placeholder */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 rounded-full animate-pulse"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 rounded-full animate-pulse"></div>
                
                {/* Indicadores de imágenes placeholder */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                  {[0, 1, 2].map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-gold/20 animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Contenido de texto placeholder */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="h-5 w-20 bg-gold/20 rounded-full mb-2 animate-pulse"></div>
                <div className="h-6 w-4/5 bg-gold/20 rounded-full mb-4 animate-pulse"></div>
                <div className="h-4 w-full bg-gold/10 rounded-full mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gold/10 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Indicador de carga sutil */}
        <div className="mt-8 flex justify-center items-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-gold/60 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
