import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  description: string;
  image?: string; // Campo anterior (mantener para compatibilidad)
  image_url?: string; // Campo nuevo de la base de datos
  category: string;
}

interface ProductsTableProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  isLoading?: boolean; // Added loading state prop
}

export default function ProductsTable({
  products,
  handleEditProduct,
  handleDeleteProduct,
  isLoading = false, // Default to false
}: ProductsTableProps) {
  // Función para construir URLs completas de Supabase si es necesario
  const buildSupabaseUrl = (path: string): string => {
    // Si ya es una URL completa, devolverla
    if (path && path.startsWith("http")) {
      return path;
    }

    // Si es una ruta relativa que parece ser de supabase, construir la URL completa
    if (path && path.includes("uploads/")) {
      // Extraer solo el nombre del archivo
      const fileName = path.split("/").pop();
      if (fileName) {
        return `https://bdxxvwjghayycdueeoot.supabase.co/storage/v1/object/public/productos/uploads/${fileName}`;
      }
    }

    // Si es una imagen local o placeholder, devolverla sin cambios
    return path;
  };

  // Función auxiliar para obtener la URL de la imagen
  const getImageUrl = (product: Product): string => {
    // Usar image_url si existe, de lo contrario usar image, o el placeholder como fallback
    const rawUrl = product.image_url || product.image || "/placeholder.svg";
    return buildSupabaseUrl(rawUrl);
  };

  return (
    <div className="border border-gold/30 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gold/10">
            <tr>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Imagen
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Descripción
              </th>
              <th className="px-4 py-3 text-right text-gold font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gold-light/70"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gold mb-2"></div>
                    <span>Cargando productos...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gold-light/70"
                >
                  No hay productos disponibles
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gold/5">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={getImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={getImageUrl(product).includes(
                          "supabase.co"
                        )}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gold-light">{product.name}</td>
                  <td className="px-4 py-3 text-gold-light/70">
                    {product.category}
                  </td>

                  <td className="px-4 py-3 text-gold-light/70 max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold-light/70 hover:text-gold hover:bg-gold/10"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold-light/70 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
