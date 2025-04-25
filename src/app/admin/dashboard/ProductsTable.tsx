import Image from "next/image";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  image?: string; // Campo anterior (mantener para compatibilidad)
  image_url?: string; // Campo anterior (mantener para compatibilidad)
  images?: string[]; // Nuevo campo de imágenes
  category: string;
  position?: number; // Nuevo campo para el orden
}

interface ProductsTableProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  isLoading?: boolean;
  reloadProducts?: () => Promise<void>;
  deletingProducts?: number[]; // Añadir array de IDs de productos en proceso de eliminación
}

export default function ProductsTable({
  products,
  handleEditProduct,
  handleDeleteProduct,
  isLoading = false,
  reloadProducts,
  deletingProducts = [], // Default a array vacío
}: ProductsTableProps) {
  // Estado local para productos ordenados
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Ordenar productos para mostrar los más recientes primero (asumiendo que los IDs más altos son los más recientes)
  // Y luego por posición si está disponible
  useMemo(() => {
    // Primero ordenar por posición (si existe)
    const sorted = [...products].sort((a, b) => {
      // Si ambos tienen posición, usar ese valor
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      // Si uno tiene posición y el otro no, el que tiene posición va primero
      if (a.position !== undefined) return -1;
      if (b.position !== undefined) return 1;
      
      // Si ninguno tiene posición, ordenar por ID descendente (más reciente primero)
      return b.id - a.id;
    });
    
    console.log("Productos ordenados por posición:", sorted.map(p => ({ id: p.id, name: p.name, pos: p.position })));
    setOrderedProducts(sorted);
  }, [products]);

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
    // Primero intentar usar el nuevo campo images
    if (Array.isArray(product.images) && product.images.length > 0) {
      return buildSupabaseUrl(product.images[0]);
    }
    // Si no hay images, usar los campos antiguos como fallback
    const rawUrl = product.image_url || product.image || "/placeholder.svg";
    return buildSupabaseUrl(rawUrl);
  };

  // Manejar el fin del arrastre
  const handleDragEnd = async (result: any) => {
    setIsDragging(false);

    // Si no hay destino (se soltó fuera del área) o no se movió, no hacer nada
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    // Reordenar los productos localmente
    const items = Array.from(orderedProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar posiciones en el array local
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    // Actualizar el estado local inmediatamente
    setOrderedProducts(updatedItems);

    // Preparar datos para enviar a la API
    const productOrders = updatedItems.map((product, index) => ({
      id: product.id,
      position: index,
    }));

    // Guardar el nuevo orden en la base de datos
    try {
      setIsSavingOrder(true);
      const response = await fetch("/api/productos/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productOrders }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el orden");
      }

      // Guardar timestamp de actualización para que el catálogo lo detecte
      if (typeof window !== 'undefined') {
        localStorage.setItem("admin_update_timestamp", Date.now().toString());
      }

      // Refrescar productos desde el servidor para asegurar la consistencia
      if (reloadProducts) {
        await reloadProducts();
        toast.success("Orden de productos actualizado");
      } else {
        toast.success("Orden actualizado. Recarga la página para ver los cambios.");
      }
    } catch (error) {
      console.error("Error al actualizar el orden:", error);
      toast.error("No se pudo actualizar el orden de los productos");
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="border border-gold/30 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-gold/10">
              <tr>
                <th className="px-4 py-3 text-left text-gold font-medium w-8"></th>
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
            <Droppable droppableId="products-table" direction="vertical">
              {(provided) => (
                <tbody
                  className="divide-y divide-gold/10"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {isLoading || isSavingOrder ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gold-light/70"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gold mb-2"></div>
                          <span>
                            {isSavingOrder
                              ? "Guardando nuevo orden..."
                              : "Cargando productos..."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : orderedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gold-light/70"
                      >
                        No hay productos disponibles
                      </td>
                    </tr>
                  ) : (
                    orderedProducts.map((product, index) => (
                      <Draggable
                        key={`product-${product.id}`}
                        draggableId={`product-${product.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${
                              snapshot.isDragging
                                ? "bg-gold/5 shadow-lg"
                                : deletingProducts.includes(product.id)
                                ? "opacity-50 bg-destructive/5" 
                                : "hover:bg-gold/5"
                            } transition-all duration-300`}
                          >
                            <td
                              className="px-2 py-3 cursor-grab"
                              {...provided.dragHandleProps}
                            >
                              <div className="flex justify-center items-center text-gold-light/50">
                                <GripVertical className="h-5 w-5" />
                              </div>
                            </td>
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
                            <td className="px-4 py-3 text-gold-light">
                              {product.name}
                            </td>
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
                                  disabled={isDragging || deletingProducts.includes(product.id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gold-light/70 hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={isDragging || deletingProducts.includes(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
      {!isLoading && orderedProducts.length > 1 && (
        <div className="p-4 text-center text-gold-light/70 text-sm">
          Arrastra y suelta las filas para reordenar los productos
        </div>
      )}
    </div>
  );
}
