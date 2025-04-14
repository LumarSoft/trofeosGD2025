"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  Building,
  Calendar,
  FileText,
  AlertTriangle,
  X,
  FileIcon,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id?: number;
  company: string;
  description: string;
  date: string;
  image_url: string;
}

interface GalleryFormProps {
  onSave: (galleryItem: any) => void;
  onCancel: () => void;
  initialData?: GalleryItem | null;
  maxFileSize?: number;
}

export default function GalleryForm({
  onSave,
  onCancel,
  initialData = null,
  maxFileSize = 2 * 1024 * 1024, // 2MB por defecto
}: GalleryFormProps) {
  // Estado principal del formulario
  const [formData, setFormData] = useState<GalleryItem>({
    company: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    image_url: "/placeholder.svg",
  });

  // Estado para el calendario
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Generamos un ID de sesión único para este formulario
  const [sessionId] = useState(
    `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  );

  // Estados para la gestión de imágenes
  const [uploading, setUploading] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [imageInfo, setImageInfo] = useState<{
    name: string;
    size: number;
    sizeFormatted: string;
  } | null>(null);

  // Estado para errores
  const [fileSizeError, setFileSizeError] = useState(false);
  const [fileSizeErrorMessage, setFileSizeErrorMessage] = useState("");
  const [sizeErrorDialogOpen, setSizeErrorDialogOpen] = useState(false);

  // Estado para validación
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);

  // Ref para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Si hay initialData, cargar en el formulario
  useEffect(() => {
    if (initialData) {
      const initialDate = initialData.date
        ? new Date(initialData.date)
        : new Date();

      setDate(initialDate);

      setFormData({
        ...initialData,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  // Utilidad para formatear tamaños de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Función que maneja errores de tamaño de archivo
  const handleFileSizeError = (file: File) => {
    console.log(
      `Error de tamaño: ${file.name} (${file.size} bytes) excede ${maxFileSize} bytes`
    );

    setFileSizeError(true);
    setFileSizeErrorMessage(
      `El archivo "${file.name}" (${formatFileSize(
        file.size
      )}) excede el tamaño máximo permitido (${formatFileSize(maxFileSize)})`
    );
    setSizeErrorDialogOpen(true);

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

  // Configuración de react-dropzone
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

  // Manejar cambios en inputs de texto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Subir archivo al servidor
  const handleFileUpload = async (file: File) => {
    try {
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
      formDataUpload.append("folder", "gallery"); // Carpeta específica para galería

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
        image_url: data.url,
      }));

      // Marcar que la imagen ha cambiado
      setImageChanged(true);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error(
        error instanceof Error ? error.message : "No se pudo subir la imagen"
      );
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
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: "/placeholder.svg",
    }));
    setImageInfo(null);
    setFileSizeError(false);
    setImageChanged(true);
    // Resetear el input de archivo también
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validar formulario antes de enviar
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.company.trim()) {
      errors.push("El nombre de la empresa es obligatorio");
    }

    if (!formData.description.trim()) {
      errors.push("La descripción es obligatoria");
    }

    if (formData.image_url === "/placeholder.svg" && !initialData) {
      errors.push("Debe subir una imagen");
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
      setUploading(true);

      // Si estamos editando y la imagen no ha cambiado, simplemente enviamos los datos actuales
      if (initialData && !imageChanged) {
        onSave(formData);
        return;
      }

      // Si hay una nueva imagen y no es el placeholder, procesarla
      if (
        formData.image_url &&
        formData.image_url !== "/placeholder.svg" &&
        imageChanged
      ) {
        // Verificar si la imagen es una URL temporal que necesita ser procesada
        if (formData.image_url.includes("/temp/")) {
          // Confirmar la sesión y subir la imagen a Supabase
          const response = await fetch("/api/finish-gallery-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              save: true,
              path: formData.image_url,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al procesar la imagen");
          }

          const data = await response.json();

          // Si se devuelve URL final, usarla
          const finalData = {
            ...formData,
            image_url: data.finalUrl || formData.image_url,
          };

          onSave(finalData);
        } else {
          // Si ya es una URL permanente o externa
          onSave(formData);
        }
      } else {
        // Si no hay imagen nueva o se eliminó, usar los datos actuales
        onSave(formData);
      }
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la imagen"
      );
    } finally {
      setUploading(false);
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
          <FileText className="mr-2 h-5 w-5" />
          {initialData ? "Editar Imagen de Galería" : "Nueva Imagen de Galería"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-6">
                {/* Área de imagen con drag & drop */}
                <div
                  {...getRootProps()}
                  className={`relative w-full h-60 rounded-lg overflow-hidden border-2 ${
                    isDragActive
                      ? "border-dashed border-gold"
                      : fileSizeError
                      ? "border-dashed border-red-500"
                      : "border border-gold/30"
                  } transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] group`}
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <input {...getInputProps()} />
                  <Image
                    src={formData.image_url || "/placeholder.svg"}
                    alt="Vista previa de la imagen"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Botón de eliminación de imagen */}
                  {formData.image_url !== "/placeholder.svg" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  {/* Overlay para drag & drop o hover */}
                  {(isDragActive || imageHover) && !fileSizeError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gold mb-2" />
                      <p className="text-gold text-center px-4">
                        {isDragActive
                          ? "Suelta la imagen aquí"
                          : "Arrastra una imagen o haz clic para seleccionar"}
                      </p>
                    </motion.div>
                  )}

                  {/* Mensaje de error de tamaño dentro del dropzone */}
                  {fileSizeError && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-red-500 p-4">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      <p className="text-center">
                        El archivo excede el tamaño máximo permitido (
                        {formatFileSize(maxFileSize)})
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileSizeError(false);
                        }}
                        className="mt-3 px-3 py-1 bg-gold text-black rounded hover:bg-gold-dark"
                      >
                        Entendido
                      </button>
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
                      Tamaño del archivo: {imageInfo.sizeFormatted}
                    </p>
                  </div>
                )}

                {/* Botón de carga alternativo */}
                <div className="w-full">
                  <Label htmlFor="image-upload" className="w-full">
                    <div
                      className={`flex items-center justify-center w-full ${
                        fileSizeError
                          ? "border border-red-500"
                          : "border border-gold/30"
                      } text-gold hover:bg-gold/10 rounded-md h-11 px-4 py-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px_rgba(208,177,110,0.2)] ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
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
                    disabled={uploading}
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
                  htmlFor="company"
                  className="text-gold-light flex items-center font-medium"
                >
                  <Building className="h-4 w-4 mr-2 opacity-70" />
                  Empresa Cliente *
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-black/60 border-gold/30 focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)] h-11"
                  placeholder="Nombre de la empresa para la que se hizo el trabajo"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-gold-light flex items-center font-medium"
                >
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  Fecha del Proyecto
                </Label>

                {/* Nuevo componente de calendario */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 bg-black/60 border-gold/30 hover:bg-gold/10 hover:text-gold hover:border-gold focus:border-gold text-gold-light transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)]",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border border-gold/30 shadow-[0_5px_30px_rgba(208,177,110,0.15)]">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setFormData((prev) => ({
                          ...prev,
                          date: newDate
                            ? newDate.toISOString().split("T")[0]
                            : prev.date,
                        }));
                      }}
                      initialFocus
                      className="rounded-md border-gold/20"
                      classNames={{
                        months: "space-y-4",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center text-gold",
                        caption_label: "text-sm font-medium text-gold-light",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-black/60 hover:bg-gold/20 rounded-md flex items-center justify-center text-gold-light hover:text-gold",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gold-light/70 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm relative p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-gold/10",
                        day: "h-9 w-9 p-0 flex items-center justify-center rounded-md text-gold-light hover:bg-gold/20 hover:text-gold aria-selected:opacity-100",
                        day_selected:
                          "bg-gold text-black hover:bg-gold-dark hover:text-black focus:bg-gold-dark focus:text-black",
                        day_today: "bg-gold/20 text-gold",
                        day_outside: "text-gold-light/40 opacity-50",
                        day_disabled: "text-gold-light/30",
                        day_range_middle:
                          "aria-selected:bg-gold/20 aria-selected:text-gold-light",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => (
                          <ChevronLeft
                            className="h-4 w-4 text-gold-light"
                            {...props}
                          />
                        ),
                        IconRight: ({ ...props }) => (
                          <ChevronRight
                            className="h-4 w-4 text-gold-light"
                            {...props}
                          />
                        ),
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gold-light flex items-center font-medium"
                >
                  <FileText className="h-4 w-4 mr-2 opacity-70" />
                  Descripción del Proyecto *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-black/60 border-gold/30 focus:border-gold text-gold-light min-h-[150px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(208,177,110,0.15)]"
                  placeholder="Describe los trofeos realizados para esta empresa"
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
              onClick={onCancel}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-black font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(208,177,110,0.3)] h-11"
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-t-2 border-b-2 border-black rounded-full animate-spin mr-2"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                "Guardar"
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

      {/* Diálogo de error de tamaño de archivo */}
      <Dialog open={sizeErrorDialogOpen} onOpenChange={setSizeErrorDialogOpen}>
        <DialogContent className="bg-black border border-gold/30 text-gold-light">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-gold">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Tamaño de archivo excedido
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gold-light/80">
            <div className="py-2 text-gold-light/90">
              {fileSizeErrorMessage}
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setSizeErrorDialogOpen(false)}
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
