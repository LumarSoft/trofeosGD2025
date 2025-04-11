"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import GalleryForm from "./GalleryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Trash2,
  Edit,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import AdminLayout from "../AdminLayout";

interface GalleryItem {
  id: number;
  image_url: string;
  company: string;
  description: string;
  date: string;
}

export default function GalleryAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Load gallery items
  useEffect(() => {
    loadGalleryItems();
  }, []);

  // Function to load gallery items
  const loadGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");

      if (!response.ok) {
        throw new Error("Error al cargar datos");
      }

      const data = await response.json();

      // Formatear los datos recibidos si es necesario
      const formattedItems = data.map((item: any) => ({
        ...item,
        date: item.date
          ? new Date(item.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }));

      setGalleryItems(formattedItems);
    } catch (error) {
      console.error("Error al cargar los items de galería:", error);
      toast.error("Error al cargar los items de galería");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGalleryItem = async (itemData: any) => {
    try {
      const url = editingItem
        ? `/api/gallery/${editingItem.id}`
        : "/api/gallery";

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar");
      }

      // Recargar la lista después de guardar
      await loadGalleryItems();

      // Resetear el estado
      setIsFormOpen(false);
      setEditingItem(null);

      toast.success(
        editingItem
          ? "Imagen actualizada correctamente"
          : "Imagen añadida a la galería correctamente"
      );
    } catch (error) {
      console.error("Error al guardar el item:", error);
      toast.error("Error al guardar la imagen en la galería");
    }
  };

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete === null) return;

    try {
      const response = await fetch(`/api/gallery/${itemToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar");
      }

      // Recargar la lista después de eliminar
      await loadGalleryItems();

      // Resetear el estado
      setDeleteDialogOpen(false);
      setItemToDelete(null);

      toast.success("Imagen eliminada de la galería correctamente");
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      toast.error("Error al eliminar la imagen de la galería");
    }
  };

  const handleFormCancel = async () => {
    // Si estaba editando, simplemente cerrar el formulario
    if (editingItem) {
      setEditingItem(null);
      setIsFormOpen(false);
      return;
    }

    // Si estaba creando, necesitamos limpiar los archivos temporales
    try {
      // Generamos el mismo ID de sesión que se usa en el formulario para asegurarnos de limpiar los archivos correctos
      const sessionId = `gallery_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;

      await fetch("/api/finish-gallery-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          save: false,
        }),
      });
    } catch (error) {
      console.error("Error al limpiar archivos temporales:", error);
    }

    setIsFormOpen(false);
  };

  // Show loading while loading gallery items
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold mx-auto mb-4"></div>
            <p className="text-gold-light">Cargando galería...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {isFormOpen ? (
        <GalleryForm
          onSave={handleSaveGalleryItem}
          onCancel={handleFormCancel}
          initialData={editingItem}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gold flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Galería de Trabajos
            </h2>
            <Button
              className="bg-gold hover:bg-gold/80 text-black"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Imagen
            </Button>
          </div>

          {galleryItems.length === 0 ? (
            <div className="text-center py-12 text-gold-light/70 border border-gold/30 rounded-md">
              No hay imágenes en la galería. Agrega una nueva imagen.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group border border-gold/30 rounded-lg overflow-hidden bg-black/60"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={item.image_url}
                      alt={`Trabajo para ${item.company}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="w-full p-3 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 bg-black/70 border-gold/50 text-gold hover:bg-gold hover:text-black"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 bg-black/70 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gold">
                        {item.company}
                      </h3>
                      <span className="text-gold-light/60 text-xs">
                        {new Date(item.date).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <p className="text-gold-light/80 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-gold/30 text-gold-light">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-gold">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gold-light/80">
            <div className="py-2">
              ¿Estás seguro de que deseas eliminar esta imagen de la galería?
              Esta acción no se puede deshacer.
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDeleteItem}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
