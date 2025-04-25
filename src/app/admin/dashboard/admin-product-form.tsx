"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  Layers,
  TagIcon,
  FileText,
  AlertTriangle,
  X,
  FileIcon,
  Save,
  RefreshCw,
  Plus,
  ArrowLeft,
  ArrowRight,
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
import { useDropzone } from "react-dropzone";
import { AdminProductFormProps } from "@/shared/types/IPproduct";

export default function AdminProductForm({
  product,
  categories = [],
  onSave,
  onCancel,
  maxFileSize = 2 * 1024 * 1024, // 2MB por defecto
}: AdminProductFormProps) {
  // Estado principal del formulario
  const [formData, setFormData] = useState({
    id: undefined as number | undefined,
    name: "",
    description: "",
    category: "",
    category_id: undefined as number | undefined,
    category_name: "",
    images: ["/placeholder.svg"],
  });

  // Generamos un ID de sesión único para este formulario
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  );

  // Estados para la gestión de imágenes
  const [uploading, setUploading] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [imageInfo, setImageInfo] = useState<{
    name: string;
    size: number;
    sizeFormatted: string;
  } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Estado para manejo de guardado/actualización
  const [isSaving, setIsSaving] = useState(false);

  // Estado para errores
  const [fileSizeError, setFileSizeError] = useState(false);
  const [fileSizeErrorMessage, setFileSizeErrorMessage] = useState("");
  const [sizeErrorDialogOpen, setSizeErrorDialogOpen] = useState(false);

  // Estado para validación y diálogos
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generalErrorDialogOpen, setGeneralErrorDialogOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  // Ref para el input de archivo (nos permitirá resetear su valor)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utilidad para formatear tamaños de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Función que maneja explícitamente los errores de tamaño de archivo
  const handleFileSizeError = (file: File) => {
    console.log(
      `Error de tamaño: ${file.name} (${file.size} bytes) excede ${maxFileSize} bytes`
    );

    // Establecemos todos los estados de error
    setFileSizeError(true);
    setFileSizeErrorMessage(
      `El archivo "${file.name}" (${formatFileSize(
        file.size
      )}) excede el tamaño máximo permitido (${formatFileSize(maxFileSize)})`
    );
    setSizeErrorDialogOpen(true);

    // Reseteamos el input de archivo para permitir un nuevo intento
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Función para manejar archivos soltados con drag & drop
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      // Verificar primero si hay archivos rechazados por tamaño
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const file = rejection.file;
        // Si el error es de tamaño, manejarlo
        if (rejection.errors.some((e: any) => e.code === "file-too-large")) {
          handleFileSizeError(file);
          return;
        }
      }

      // Si hay archivos aceptados, procesar el primero
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Verificación de tamaño explícita adicional
        if (file.size > maxFileSize) {
          handleFileSizeError(file);
          return;
        }

        // Si todo está bien, proceder con la carga
        setFileSizeError(false);
        handleFileUpload(file);
      }
    },
    [maxFileSize]
  );

  // Configuración de react-dropzone con validación explícita de tamaño
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: maxFileSize,
    multiple: false,
    validator: (file) => {
      if (file.size > maxFileSize) {
        return {
          code: "file-too-large",
          message: `El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(
            maxFileSize
          )}.`,
        };
      }
      return null;
    },
  });

  // Efecto para cargar datos del producto existente
  useEffect(() => {
    if (product) {
      console.log("Producto cargado para editar:", product);
      console.log("Categorías disponibles:", categories);

      // Buscar la categoría por ID
      const categoryInfo = categories.find((c) => c.id === product.category_id);
      const categoryName = categoryInfo
        ? categoryInfo.name
        : product.category || "";

      setFormData({
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        category: categoryInfo ? String(categoryInfo.id) : "",
        category_id: product.category_id,
        category_name: categoryName,
        images: product.images || ["/placeholder.svg"],
      });

      // Si hay una imagen y no es el placeholder, obtener información
      if (product.images && product.images.length > 0) {
        setImageInfo({
          name: product.images[0].split("/").pop() || "Imagen existente",
          size: 0,
          sizeFormatted: "Imagen existente",
        });
      }
    }

    // Limpieza al desmontar
    return () => {
      fetch("/api/finish-product-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, save: false }),
      }).catch((err) => console.error("Error al limpiar sesión:", err));
    };
  }, [product, sessionId, categories]);

  // Manejar cambios en inputs de texto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en la categoría seleccionada
  const handleCategoryChange = (value: string) => {
    const selectedCategoryId = parseInt(value, 10);
    const selectedCategory = categories.find(
      (c) => c.id === selectedCategoryId
    );

    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        category: value,
        category_id: selectedCategory.id,
        category_name: selectedCategory.name,
      }));
    }
  };

  // Subir archivo al servidor
  const handleFileUpload = async (file: File) => {
    try {
      // Verificación de seguridad adicional del tamaño del archivo
      if (file.size > maxFileSize) {
        handleFileSizeError(file);
        return;
      }

      setUploading(true);
      console.log(
        `Subiendo archivo: ${file.name} (${formatFileSize(file.size)})`
      );

      // Guardar información del archivo para mostrar
      setImageInfo({
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
      });

      // Preparar FormData para enviar el archivo
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("sessionId", sessionId);

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

      // Actualizar el formulario con la nueva imagen
      setFormData((prev) => {
        const newImages = [...prev.images];
        if (newImages[0] === "/placeholder.svg") {
          newImages[0] = data.url;
        } else if (newImages.length < 6) {
          newImages.push(data.url);
        }
        return {
          ...prev,
          images: newImages,
        };
      });
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setGeneralErrorMessage(
        error instanceof Error ? error.message : "No se pudo subir la imagen"
      );
      setGeneralErrorDialogOpen(true);
      setImageInfo(null);
    } finally {
      setUploading(false);
    }
  };

  // Manejar cambios en el input de archivo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log(
      `Archivo seleccionado: ${file.name} (${file.size} bytes), máximo: ${maxFileSize} bytes`
    );

    // Verificar tamaño explícitamente
    if (file.size > maxFileSize) {
      console.log("Archivo demasiado grande detectado en handleImageChange");
      handleFileSizeError(file);
      // Resetear el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = "";
      return;
    }

    // Si el tamaño es válido, subir el archivo
    setFileSizeError(false);
    handleFileUpload(file);
  };

  // Eliminar imagen actual
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      if (newImages.length === 0) {
        newImages.push("/placeholder.svg");
      }
      return {
        ...prev,
        images: newImages,
      };
    });
    setImageInfo(null);
    setFileSizeError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validar formulario antes de enviar
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

    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationDialogOpen(true);
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      return;
    }

    try {
      // Activar estado de guardado
      setIsSaving(true);

      // Array para almacenar las URLs finales de las imágenes
      let finalImages: string[] = [];
      // Array para almacenar las rutas temporales que deben eliminarse
      const tempPaths: string[] = [];

      // Procesar todas las imágenes temporales
      for (const image of formData.images) {
        // Saltar el placeholder
        if (image === "/placeholder.svg") continue;

        // Comprobar si la imagen es temporal
        const isTemporaryImage =
          image &&
          (image.includes("/temp/") ||
            image.includes("temp%2F") ||
            image.includes("/productos/temp/"));

        if (isTemporaryImage) {
          setUploading(true);
          console.log("Procesando imagen temporal:", image);
          
          // Guardar la ruta temporal para eliminarla después
          tempPaths.push(image);

          // Confirmar la sesión y subir la imagen a Supabase
          const response = await fetch("/api/finish-product-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              save: true,
              path: image,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            console.log("Imagen procesada correctamente:", data.finalUrl);
            finalImages.push(data.finalUrl);
          } else if (data.fallbackUrl) {
            console.warn(
              "Usando URL de imagen local debido a error en Supabase:",
              data.message
            );
            finalImages.push(data.fallbackUrl);
          } else {
            throw new Error(data.message || "Error al procesar la imagen");
          }
        } else {
          // Si la imagen no es temporal, mantenerla como está
          finalImages.push(image);
        }
      }

      // Si no hay imágenes finales, usar el placeholder
      if (finalImages.length === 0) {
        finalImages = ["/placeholder.svg"];
      }

      // Preparar datos finales del producto
      const finalData = {
        ...formData,
        images: finalImages,
        category: formData.category_name,
      };

      // Limpiar las imágenes temporales que ya han sido procesadas
      if (tempPaths.length > 0) {
        try {
          const cleanupResponse = await fetch("/api/cleanup-temp-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paths: tempPaths
            }),
          });
          
          const cleanupData = await cleanupResponse.json();
          if (cleanupResponse.ok) {
            console.log("Imágenes temporales eliminadas:", cleanupData.deleted);
          } else {
            console.warn("No se pudieron eliminar algunas imágenes temporales:", cleanupData.message);
          }
        } catch (cleanupError) {
          console.error("Error al limpiar imágenes temporales:", cleanupError);
          // No interrumpir el guardado por errores en la limpieza
        }
      }

      // Guardar el producto
      onSave(finalData);
    } catch (error) {
      console.error("Error al finalizar la sesión:", error);
      setIsSaving(false);
      setGeneralErrorMessage(
        `Error al guardar el producto: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      setGeneralErrorDialogOpen(true);
    } finally {
      setUploading(false);
    }
  };

  // Cancelar y limpiar imágenes temporales
  const handleCancel = async () => {
    try {
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
      onCancel();
    }
  };

  // Cerrar el diálogo de error de tamaño
  const handleCloseSizeErrorDialog = () => {
    setSizeErrorDialogOpen(false);
    setFileSizeError(false);
  };

  // Función para mover una imagen a la izquierda (cambiar posición)
  const moveImageLeft = (index: number) => {
    if (index <= 0) return; // No se puede mover más a la izquierda
    
    const newImages = [...formData.images];
    // Intercambiar con el elemento anterior
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    
    // Actualizar el índice seleccionado si es necesario
    if (selectedImageIndex === index) {
      setSelectedImageIndex(index - 1);
    } else if (selectedImageIndex === index - 1) {
      setSelectedImageIndex(index);
    }
  };

  // Función para mover una imagen a la derecha (cambiar posición)
  const moveImageRight = (index: number) => {
    if (index >= formData.images.length - 1) return; // No se puede mover más a la derecha
    
    const newImages = [...formData.images];
    // Intercambiar con el elemento siguiente
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    
    // Actualizar el índice seleccionado si es necesario
    if (selectedImageIndex === index) {
      setSelectedImageIndex(index + 1);
    } else if (selectedImageIndex === index + 1) {
      setSelectedImageIndex(index);
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
                {/* Área de imagen principal */}
                <div
                  {...getRootProps()}
                  className={`relative w-full h-80 rounded-lg overflow-hidden border-2 ${
                    isDragActive
                      ? "border-dashed border-gold"
                      : fileSizeError
                      ? "border-dashed border-red-500"
                      : "border border-gold/30"
                  } transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group ${
                    isSaving || uploading
                      ? "pointer-events-none opacity-70"
                      : ""
                  }`}
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <input
                    {...getInputProps()}
                    disabled={isSaving || uploading}
                  />
                  <Image
                    src={
                      formData.images[selectedImageIndex] || "/placeholder.svg"
                    }
                    alt="Vista previa del producto"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Botón de eliminación de imagen */}
                  {formData.images[selectedImageIndex] !==
                    "/placeholder.svg" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(selectedImageIndex);
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                      disabled={isSaving || uploading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  {(isDragActive || imageHover) &&
                    !fileSizeError &&
                    !isSaving &&
                    !uploading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-12 w-12 text-gold mb-3" />
                        <p className="text-gold text-center px-4 text-lg">
                          {isDragActive
                            ? "Suelta la imagen aquí"
                            : "Arrastra una imagen o haz clic para seleccionar"}
                        </p>
                      </motion.div>
                    )}

                  {/* Mensaje de error de tamaño dentro del dropzone */}
                  {fileSizeError && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-red-500 p-4">
                      <AlertTriangle className="h-12 w-12 mb-3" />
                      <p className="text-center text-lg">
                        El archivo excede el tamaño máximo permitido (
                        {formatFileSize(maxFileSize)})
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileSizeError(false);
                        }}
                        className="mt-4 px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors"
                        disabled={isSaving}
                      >
                        Entendido
                      </button>
                    </div>
                  )}
                </div>

                {/* Miniaturas de imágenes con controles de reordenamiento */}
                <div className="grid grid-cols-4 gap-4 w-full">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedImageIndex === index
                          ? "border-gold shadow-[0_0_15px_rgba(208,177,110,0.3)]"
                          : "border-transparent hover:border-gold/50"
                      } transition-all duration-300`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      
                      {image !== "/placeholder.svg" && (
                        <>
                          {/* Botones de reordenamiento */}
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveImageLeft(index);
                              }}
                              className={`bg-black/70 text-gold p-1 rounded-full hover:bg-gold/80 hover:text-black transition-colors ${
                                index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={index === 0 || isSaving || uploading}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveImageRight(index);
                              }}
                              className={`bg-black/70 text-gold p-1 rounded-full hover:bg-gold/80 hover:text-black transition-colors ${
                                index === formData.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={index === formData.images.length - 1 || isSaving || uploading}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Botón de eliminar */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {formData.images.length < 6 && (
                    <div
                      className="relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gold/30 flex items-center justify-center hover:bg-gold/10 transition-all duration-300 hover:border-gold group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-8 w-8 text-gold/50 group-hover:text-gold transition-colors" />
                    </div>
                  )}
                </div>

                {/* Información de la imagen */}
                {imageInfo && (
                  <div className="w-full p-3 border border-gold/20 rounded-md bg-black/30">
                    <div className="flex items-center text-gold-light mb-1">
                      <FileIcon className="h-4 w-4 mr-2 opacity-70" />
                      <p className="text-sm truncate">{imageInfo.name}</p>
                    </div>
                    <p className="text-xs text-gold-light/70">
                      Tamaño: {imageInfo.sizeFormatted}
                    </p>
                  </div>
                )}

                {/* Botón de carga alternativo */}
                <div className="w-full">
                  <Label
                    htmlFor="image-upload"
                    className={`w-full ${
                      isSaving || uploading ? "pointer-events-none" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-full ${
                        fileSizeError
                          ? "border border-red-500"
                          : "border border-gold/30"
                      } text-gold hover:bg-gold/10 rounded-md h-11 px-4 py-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px_rgba(208,177,110,0.2)] ${
                        uploading || isSaving
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading
                        ? "Subiendo imagen..."
                        : "Seleccionar otra imagen"}
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading || isSaving}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>

                {/* Aviso de tamaño máximo */}
                <div
                  className={`text-xs ${
                    fileSizeError
                      ? "text-red-400 font-bold"
                      : "text-gold-light/70"
                  } w-full text-center`}
                >
                  Tamaño máximo: {formatFileSize(maxFileSize)}
                  {fileSizeError && (
                    <span className="block mt-2 text-red-400">
                      ⚠️ El archivo seleccionado es demasiado grande
                    </span>
                  )}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                >
                  <SelectTrigger className="bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)] h-11">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gold/30">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
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
                  disabled={isSaving}
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
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`${
                isSaving ? "bg-gold/80" : "bg-gold hover:bg-gold-dark"
              } text-black font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.3)] h-11 min-w-[120px] flex items-center justify-center`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {product ? "Actualizando..." : "Guardando..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {product ? "Actualizar" : "Guardar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Diálogo de validación de campos requeridos */}
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

      {/* Diálogo de errores generales */}
      <Dialog
        open={generalErrorDialogOpen}
        onOpenChange={setGeneralErrorDialogOpen}
      >
        <DialogContent className="bg-black border border-gold/30 text-gold-light">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-gold">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Error
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gold-light/80">
            <div className="py-2 text-gold-light/90 whitespace-pre-line">
              {generalErrorMessage}
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setGeneralErrorDialogOpen(false)}
              className="bg-gold hover:bg-gold-dark text-black font-medium"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
