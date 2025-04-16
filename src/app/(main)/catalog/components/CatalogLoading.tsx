export default function CatalogLoading() {
  return (
    <section className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gold">
            Catálogo de productos
          </h1>
          <p className="text-base md:text-lg text-gold-light/80 max-w-2xl mx-auto">
            Cargando catálogo...
          </p>
        </div>
        <div className="flex justify-center items-center py-16 md:py-20">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </div>
    </section>
  );
}
