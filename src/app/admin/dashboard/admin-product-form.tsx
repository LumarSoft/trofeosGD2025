"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  ImageIcon,
  Layers,
  TagIcon,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AdminProductFormProps {
  product?: any;
  categories?: { id: number; name: string }[];
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export default function AdminProductForm({
  product,
  categories = [],
  onSave,
  onCancel,
}: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    id: undefined as number | undefined,
    name: "",
    description: "",
    category: "",
    category_id: undefined as number | undefined,
    // Agregamos category_name para mantener el nombre de la categoría
    category_name: "",
    image: "/placeholder.svg",
  });

  // Generar un ID de sesión único para este formulario
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  );
  const [uploading, setUploading] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  // Estado para el diálogo de validación
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      // Para depuración - ver qué datos llegan exactamente
      console.log("Producto cargado para editar:", product);
      console.log("Categorías disponibles:", categories);

      // Buscar la categoría por ID
      const categoryInfo = categories.find((c) => c.id === product.category_id);

      // Si se encontró la categoría por ID, usar su nombre
      // Si no se encontró, intentar usar la propiedad category directamente o un string vacío como fallback
      const categoryName = categoryInfo
        ? categoryInfo.name
        : product.category || "";

      console.log("Categoría encontrada:", categoryInfo);
      console.log("Nombre de categoría a usar:", categoryName);
      console.log("ID de categoría:", product.category_id);

      setFormData({
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        // Muy importante: aquí pasamos el ID de la categoría como string para el Select
        category: categoryInfo ? String(categoryInfo.id) : "",
        category_id: product.category_id,
        // Guardamos también el nombre de la categoría
        category_name: categoryName,
        image: product.image || "/placeholder.svg",
      });
    }

    // Limpieza al desmontar el componente - por si el usuario cierra la página sin guardar/cancelar
    return () => {
      // Enviar petición para limpiar los archivos de esta sesión
      fetch("/api/finish-product-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, save: false }),
      }).catch((err) => console.error("Error al limpiar sesión:", err));
    };
  }, [product, sessionId, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    // El value ahora es el ID de la categoría como string
    const selectedCategoryId = parseInt(value, 10);
    const selectedCategory = categories.find(
      (c) => c.id === selectedCategoryId
    );

    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        category: value, // Guardamos el ID como string para el Select
        category_id: selectedCategory.id, // Guardamos el ID numérico para la base de datos
        category_name: selectedCategory.name, // Guardamos el nombre para mostrarlo en la tabla
      }));

      console.log(
        "Categoría seleccionada:",
        selectedCategory.name,
        "ID:",
        selectedCategory.id
      );
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Crear FormData para enviar el archivo
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("sessionId", sessionId); // Incluir el ID de sesión

      // Enviar el archivo al servidor
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir la imagen");
      }

      const data = await response.json();

      // Actualizar el formulario con la URL de la imagen subida
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert(
        error instanceof Error ? error.message : "No se pudo subir la imagen"
      );
    } finally {
      setUploading(false);
    }
  };

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("El nombre del producto es obligatorio");
    }

    if (!formData.category) {
      errors.push("Debe seleccionar una categoría");
    }

    if (!formData.description.trim()) {
      errors.push("La descripción del producto es obligatoria");
    }

    // Si hay errores, mostrarlos
    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationDialogOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      return;
    }

    try {
      // Confirmar la sesión y mover la imagen a la carpeta permanente
      const response = await fetch("/api/finish-product-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          save: true,
          imageUrl: formData.image,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Si se nos devuelve una URL final, usar esa
        const finalData = {
          ...formData,
          image: data.finalUrl || formData.image,
          // Asegurarnos de incluir tanto el ID como el nombre de la categoría
          category: formData.category_name, // Aquí pasamos el nombre para que se muestre en la tabla
        };

        console.log("Datos finales a guardar:", finalData);
        // Guardar el producto con los datos finales
        onSave(finalData);
      } else {
        // Si hubo un error, aún guardar el producto pero con la URL temporal
        console.warn(
          "No se pudo finalizar la sesión correctamente, guardando con URL temporal"
        );
        const finalData = {
          ...formData,
          // Asegurarnos de incluir el nombre para la tabla
          category: formData.category_name,
        };
        onSave(finalData);
      }
    } catch (error) {
      console.error("Error al finalizar la sesión:", error);
      // En caso de error, intentar guardar con la URL que tengamos
      const finalData = {
        ...formData,
        // Asegurarnos de incluir el nombre para la tabla
        category: formData.category_name,
      };
      onSave(finalData);
    }
  };

  // Función para manejar la cancelación y limpiar las imágenes temporales
  const handleCancel = async () => {
    try {
      // Cancelar la sesión y eliminar las imágenes temporales
      await fetch("/api/finish-product-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, save: false }),
      });
    } catch (error) {
      console.error("Error al cancelar la sesión:", error);
    } finally {
      // Llamar a la función de cancelación original
      onCancel();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gold/30 rounded-lg p-6 bg-black/50 backdrop-blur-sm shadow-[0_5px_30px_rgba(208,177,110,0.1)]"
      >
        <h2 className="text-2xl font-bold text-gold mb-6 flex items-center">
          {product ? (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Editar Producto
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Nuevo Producto
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-6">
                <div
                  className="relative h-60 w-full rounded-lg overflow-hidden border border-gold/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Vista previa del producto"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {imageHover && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center"
                    >
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="bg-gold text-black rounded-full p-3 hover:bg-gold-dark transition-colors">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      </Label>
                    </motion.div>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="image-upload" className="w-full">
                    <div
                      className={`flex items-center justify-center w-full border border-gold/30 text-gold hover:bg-gold/10 rounded-md h-11 px-4 py-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px_rgba(208,177,110,0.2)] ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Subiendo imagen..." : "Subir imagen"}
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gold-light flex items-center font-medium"
                >
                  <TagIcon className="h-4 w-4 mr-2 opacity-70" />
                  Nombre del producto *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)] h-11"
                  placeholder="Ingrese el nombre del producto"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-gold-light flex items-center font-medium"
                >
                  <Layers className="h-4 w-4 mr-2 opacity-70" />
                  Categoría *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  defaultValue={formData.category}
                >
                  <SelectTrigger className="bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)] h-11">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gold/30">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)} // Muy importante: pasamos el ID como string
                        className="text-gold-light hover:bg-gold/10 focus:bg-gold/10"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gold-light flex items-center font-medium"
                >
                  <FileText className="h-4 w-4 mr-2 opacity-70" />
                  Descripción *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-black/60 border-gold/30 focus:border-gold text-gold-light min-h-[150px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)]"
                  placeholder="Ingrese la descripción del producto"
                />
              </div>

              <div className="text-gold-light/70 text-sm italic">
                Los campos marcados con * son obligatorios
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gold/10">
            <Button
              type="button"
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.1)] h-11"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-black font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.3)] h-11"
            >
              {product ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Diálogo de validación */}
      <Dialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
      >
        <DialogContent className="bg-black border border-gold/30 text-gold-light">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-gold">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Campos Obligatorios
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gold-light/80">
            <div className="py-2">
              Por favor, complete todos los campos obligatorios antes de
              continuar:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-yellow-500">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setValidationDialogOpen(false)}
              className="bg-gold hover:bg-gold-dark text-black font-medium"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
