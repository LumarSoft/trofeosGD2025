import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Edit, X, Check } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: number;
  name: string;
}

interface CategoriesManagerProps {
  categories: Categoria[];
  isAddingCategory?: boolean;
  setIsAddingCategory?: (value: boolean) => void;
}

export default function CategoriesManager({
  categories: initialCategories,
  isAddingCategory = false,
  setIsAddingCategory = () => {},
}: CategoriesManagerProps) {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategories);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Controlar el estado externo de isAddingCategory
  useEffect(() => {
    if (isAddingCategory) {
      setCategoriaEditando(null);
      setNuevaCategoria("");
      setIsFormOpen(true);
    }
  }, [isAddingCategory]);

  // Cerrar el formulario también actualiza el estado externo
  const closeForm = () => {
    setIsFormOpen(false);
    setIsAddingCategory(false);
  };

  // Función para cargar las categorías
  const cargarCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      } else {
        toast.error("Error al cargar las categorías");
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
      toast.error("Error al cargar las categorías");
    }
  };

  // Función para crear una nueva categoría
  const handleCreateCategoria = async () => {
    try {
      if (!nuevaCategoria.trim()) {
        toast.error("El nombre de la categoría no puede estar vacío");
        return;
      }

      setIsLoading(true);
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nuevaCategoria }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la categoría");
      }

      const nuevaCategoriaCreada = await response.json();

      setCategorias([...categorias, nuevaCategoriaCreada]);
      setNuevaCategoria("");
      closeForm();
      toast.success("Categoría creada con éxito");
    } catch (error) {
      console.error("Error creando categoría:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al crear la categoría"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar una categoría
  const handleUpdateCategoria = async () => {
    try {
      if (!categoriaEditando || !categoriaEditando.name.trim()) {
        toast.error("El nombre de la categoría no puede estar vacío");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`/api/categorias/${categoriaEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoriaEditando.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar la categoría"
        );
      }

      const categoriaActualizada = await response.json();

      setCategorias(
        categorias.map((cat) =>
          cat.id === categoriaActualizada.id ? categoriaActualizada : cat
        )
      );

      setCategoriaEditando(null);
      closeForm();
      toast.success("Categoría actualizada con éxito");
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar la categoría"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una categoría
  const handleDeleteCategoria = async () => {
    try {
      if (!categoriaEliminar) return;

      setIsLoading(true);
      const response = await fetch(`/api/categorias/${categoriaEliminar.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la categoría");
      }

      setCategorias(
        categorias.filter((cat) => cat.id !== categoriaEliminar.id)
      );
      setCategoriaEliminar(null);
      setIsDeleteDialogOpen(false);
      toast.success("Categoría eliminada con éxito");
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar la categoría"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para abrir el diálogo de eliminación
  const openDeleteDialog = (categoria: Categoria) => {
    setCategoriaEliminar(categoria);
    setIsDeleteDialogOpen(true);
  };

  // Función para abrir el formulario de edición
  const openEditForm = (categoria: Categoria) => {
    setCategoriaEditando({ ...categoria });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Tabla de categorías */}
      {categorias.length > 0 ? (
        <Table className="border border-gold/30">
          <TableHeader className="bg-black">
            <TableRow>
              <TableHead className="text-gold">Nombre</TableHead>
              <TableHead className="text-gold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id} className="border-gold/30">
                <TableCell className="text-gold-light">
                  {categoria.name}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => openEditForm(categoria)}
                      variant="outline"
                      size="sm"
                      className="border-gold/30 text-gold hover:bg-gold/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => openDeleteDialog(categoria)}
                      variant="outline"
                      size="sm"
                      className="border-red-700/30 text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 text-gold-light/70 border border-gold/30 rounded-md">
          No hay categorías disponibles. Crea una nueva categoría.
        </div>
      )}

      {/* Formulario para crear/editar categoría */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setIsAddingCategory(false);
        }}
      >
        <DialogContent className="bg-zinc-900 border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-gold">
              {categoriaEditando ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gold-light">
                Nombre de la categoría
              </label>
              <Input
                value={
                  categoriaEditando ? categoriaEditando.name : nuevaCategoria
                }
                onChange={(e) =>
                  categoriaEditando
                    ? setCategoriaEditando({
                        ...categoriaEditando,
                        name: e.target.value,
                      })
                    : setNuevaCategoria(e.target.value)
                }
                className="bg-black border-gold/30 text-gold-light focus-visible:ring-gold"
                placeholder="Ingrese el nombre de la categoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeForm}
              className="border-gold/30 text-gold hover:bg-gold/20"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={
                categoriaEditando
                  ? handleUpdateCategoria
                  : handleCreateCategoria
              }
              className="bg-gold hover:bg-gold/80 text-black"
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              {isLoading
                ? "Procesando..."
                : categoriaEditando
                ? "Actualizar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-gold">
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gold-light">
              ¿Estás seguro de que deseas eliminar la categoría
              <span className="font-semibold">
                {" "}
                {categoriaEliminar?.name}
              </span>? Esta acción puede afectar a los productos asociados.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gold/30 text-gold hover:bg-gold/20"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteCategoria}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
