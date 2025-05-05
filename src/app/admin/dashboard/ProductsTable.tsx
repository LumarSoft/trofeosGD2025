import Image from "next/image";
import { Pencil, Trash2, GripVertical, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  images?: string[];
  category: string;
  position?: number;
}

interface ProductsTableProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  isLoading?: boolean;
  reloadProducts?: () => Promise<void>;
  deletingProducts?: number[];
}

export default function ProductsTable({
  products,
  handleEditProduct,
  handleDeleteProduct,
  isLoading = false,
  reloadProducts,
  deletingProducts = [],
}: ProductsTableProps) {
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Ref para el scroll automático durante el arrastre
  const tableRef = useRef<HTMLDivElement>(null);

  // Prevenir navegación con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Función para manejar acciones que requieren confirmación
  const handleActionWithConfirmation = (action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowUnsavedChangesDialog(true);
    } else {
      action();
    }
  };

  // Función para descartar cambios
  const handleDiscardChanges = () => {
    setOrderedProducts(products);
    setHasUnsavedChanges(false);
    setShowUnsavedChangesDialog(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Ordenar productos inicialmente
  useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      if (a.position !== undefined) return -1;
      if (b.position !== undefined) return 1;
      return a.id - b.id;
    });
    setOrderedProducts(sorted);
  }, [products]);

  // Función para construir URLs completas de Supabase si es necesario
  const buildSupabaseUrl = (path: string): string => {
    if (path && path.startsWith("http")) {
      return path;
    }

    if (path && path.includes("uploads/")) {
      const fileName = path.split("/").pop();
      if (fileName) {
        return `https://bdxxvwjghayycdueeoot.supabase.co/storage/v1/object/public/productos/uploads/${fileName}`;
      }
    }

    return path;
  };

  // Función auxiliar para obtener la URL de la imagen
  const getImageUrl = (product: Product): string => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return buildSupabaseUrl(product.images[0]);
    }
    const rawUrl = product.image_url || product.image || "/placeholder.svg";
    return buildSupabaseUrl(rawUrl);
  };

  // Scroll automático durante el arrastre
  useEffect(() => {
    if (!isDragging || !tableRef.current) return;

    const handleAutoScroll = (e: MouseEvent) => {
      if (!tableRef.current) return;

      const container = tableRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollSpeed = 15;
      const scrollThreshold = 60; // Área sensible en píxeles

      // Scroll hacia abajo
      if (e.clientY > containerRect.bottom - scrollThreshold) {
        container.scrollTop += scrollSpeed;
      }
      // Scroll hacia arriba
      else if (e.clientY < containerRect.top + scrollThreshold) {
        container.scrollTop -= scrollSpeed;
      }
    };

    window.addEventListener("mousemove", handleAutoScroll);
    return () => window.removeEventListener("mousemove", handleAutoScroll);
  }, [isDragging]);

  // Manejar el inicio del arrastre
  const handleDragStart = (result: any) => {
    setIsDragging(true);
    setDraggedItemId(result.draggableId);

    // Añadir clase al body para cambiar el cursor en toda la página
    document.body.classList.add("dragging");
  };

  // Manejar el fin del arrastre
  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    setDraggedItemId(null);
    setDropTargetId(null);

    // Remover clase del body
    document.body.classList.remove("dragging");

    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }

    // Aplicar los cambios de orden con un enfoque que mantenga mejor la estabilidad visual
    const items = Array.from(orderedProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setOrderedProducts(updatedItems);
    setHasUnsavedChanges(true);
  };

  // Manejar el movimiento durante el arrastre para resaltar la zona de destino
  const handleDragUpdate = (result: any) => {
    if (!result.destination) {
      setDropTargetId(null);
      return;
    }

    const targetId = `product-${orderedProducts[result.destination.index]?.id}`;
    setDropTargetId(targetId);
  };

  // Guardar el nuevo orden
  const handleSaveOrder = async () => {
    if (!hasUnsavedChanges) return;

    try {
      setIsSavingOrder(true);
      const productOrders = orderedProducts.map((product, index) => ({
        id: product.id,
        position: index,
      }));

      const response = await fetch("/api/productos/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productOrders }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el orden");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("admin_update_timestamp", Date.now().toString());
      }

      if (reloadProducts) {
        await reloadProducts();
      }

      setHasUnsavedChanges(false);
      toast.success("Orden de productos guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el orden:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el orden de los productos"
      );
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Modificar handleEditProduct para usar la confirmación
  const handleEditWithConfirmation = (product: Product) => {
    handleActionWithConfirmation(() => handleEditProduct(product));
  };

  // Modificar handleDeleteProduct para usar la confirmación
  const handleDeleteWithConfirmation = (productId: number) => {
    handleActionWithConfirmation(() => handleDeleteProduct(productId));
  };

  return (
    <div className="border border-gold/30 rounded-lg overflow-hidden relative">
      {/* Estilos para drag & drop */}
      <style jsx global>{`
        /* Estilo para el cursor durante el arrastre en toda la página */
        body.dragging {
          cursor: grabbing !important;
        }

        /* Estilos para el item siendo arrastrado */
        .dragging-item {
          background-color: rgba(208, 177, 110, 0.15) !important;
          border: 1px dashed rgba(208, 177, 110, 0.4) !important;
          border-radius: 4px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
        }

        /* Estilo para la zona de destino */
        .drop-target {
          border-top: 2px dashed rgba(208, 177, 110, 0.7) !important;
          background-color: rgba(208, 177, 110, 0.05) !important;
        }

        /* Animación suave para todos los elementos de la tabla */
        .products-table-row {
          transition: transform 0.2s ease, background-color 0.2s ease,
            opacity 0.2s ease;
        }

        /* Estilo para el grip */
        .drag-handle {
          transition: color 0.2s ease;
        }

        .drag-handle:hover {
          color: rgba(208, 177, 110, 0.9) !important;
        }

        /* Animación suave para la tabla en modo arrastre */
        .table-dragging tbody tr:not(.dragging-item) {
          transition: transform 0.25s ease;
        }
      `}</style>

      {/* Barra superior con botón de guardar */}
      {hasUnsavedChanges && (
        <div className="bg-gold/5 border-b border-gold/10 p-4 flex justify-between items-center">
          <div className="text-gold-light/70 text-sm flex items-center">
            <AlertTriangle className="h-4 w-4 text-gold mr-2" />
            <span className="text-gold font-medium mr-2">
              Hay cambios sin guardar
            </span>
            <span className="text-gold-light/50">
              Arrastra y suelta las filas para reordenar los productos
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDiscardChanges()}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              Descartar cambios
            </Button>
            <Button
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="bg-gold hover:bg-gold-dark text-black font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.3)] min-w-[140px]"
            >
              {isSavingOrder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar orden
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div
        className={`overflow-x-auto max-h-[70vh] overflow-y-auto ${
          isDragging ? "table-dragging" : ""
        }`}
        ref={tableRef}
      >
        <DragDropContext
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-gold/10 sticky top-0 z-10">
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
                            className={`products-table-row
                              ${snapshot.isDragging ? "dragging-item" : ""}
                              ${
                                draggedItemId === `product-${product.id}`
                                  ? "opacity-90"
                                  : ""
                              }
                              ${
                                dropTargetId === `product-${product.id}`
                                  ? "drop-target"
                                  : ""
                              }
                              ${
                                deletingProducts.includes(product.id)
                                  ? "opacity-50 bg-destructive/5"
                                  : "hover:bg-gold/5"
                              }
                              transition-all duration-300
                            `}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <td
                              className="px-2 py-3 cursor-grab"
                              {...provided.dragHandleProps}
                            >
                              <div className="flex justify-center items-center text-gold-light/50 drag-handle hover:text-gold-light/80">
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
                                  onClick={() => handleEditWithConfirmation(product)}
                                  disabled={
                                    isDragging ||
                                    deletingProducts.includes(product.id)
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gold-light/70 hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteWithConfirmation(product.id)}
                                  disabled={
                                    isDragging ||
                                    deletingProducts.includes(product.id)
                                  }
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

      {/* Mensaje de ayuda en la parte inferior */}
      {!hasUnsavedChanges && !isLoading && orderedProducts.length > 1 && (
        <div className="p-4 border-t border-gold/10 text-center text-gold-light/70 text-sm">
          <div className="flex items-center justify-center gap-2">
            <GripVertical className="h-4 w-4 text-gold-light/50" />
            <span>
              Arrastra y suelta las filas para reordenar los productos
            </span>
          </div>
        </div>
      )}

      {/* Indicador de arrastre activo */}
      {isDragging && (
        <div className="fixed bottom-6 right-6 bg-gold text-black px-4 py-2 rounded-full shadow-lg z-50 flex items-center">
          <GripVertical className="h-4 w-4 mr-2" />
          <span className="font-medium">Ordenando productos...</span>
        </div>
      )}

      {/* Diálogo de confirmación para cambios sin guardar */}
      <AlertDialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hay cambios sin guardar</AlertDialogTitle>
            <AlertDialogDescription>
              Si continúas, perderás los cambios en el orden de los productos. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
