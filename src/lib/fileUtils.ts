// utils/fileUtils.ts

/**
 * Formatea el tamaño de un archivo en bytes a una representación legible
 * @param bytes Tamaño en bytes
 * @returns Cadena formateada con unidades (bytes, KB, MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

/**
 * Limpia una sesión de carga de imágenes
 * @param sessionId ID de la sesión
 * @param save Indica si se debe guardar la imagen permanentemente
 * @param path Ruta de la imagen temporal
 */
export const cleanupSession = async (
  sessionId: string,
  save: boolean,
  path?: string
) => {
  try {
    const response = await fetch("/api/finish-product-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, save, path }),
    });

    if (save && path) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error al finalizar la sesión:", error);
    return null;
  }
};
