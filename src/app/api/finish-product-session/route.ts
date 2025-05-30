import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServerSupabaseClient } from "@/lib/supabaseStorage";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { sessionId, save, path } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { message: "ID de sesión no proporcionado" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseClient();

    // Si save=true, mover la imagen temporal a la carpeta permanente
    if (save && path) {
      try {
        // Extraer el nombre de archivo de la URL
        const fileName = path.split("/").pop();

        // Mejorar la detección de imágenes temporales para incluir URLs completas de Supabase
        const isTempImage =
          path.includes("/temp/") ||
          path.includes("temp%2F") ||
          path.includes("/productos/temp/");

        if (!fileName) {
          throw new Error("Nombre de archivo no válido");
        }

        // Comprobar si el archivo está en la carpeta temp de Supabase
        if (isTempImage) {
          // Extraer el nombre sin el prefijo de sesión para la versión permanente
          const finalFileName = fileName.replace(`${sessionId}-`, "");

          // Construir la ruta correcta para la carpeta temp
          // Si la URL tiene formato diferente, extraer la parte relevante
          let tempPath = `temp/${fileName}`;

          // Si la URL tiene un formato completo de Supabase, necesitamos extraer solo la parte relevante
          if (path.includes("supabase.co")) {
            // La ruta en supabase es 'temp/filename' dentro del bucket 'productos'
            tempPath = `temp/${fileName}`;
          }

          console.log(`Intentando descargar archivo temporal: ${tempPath}`);

          // Descargar el archivo temporal primero
          const { data: fileData, error: downloadError } =
            await supabase.storage.from("productos").download(tempPath);

          if (downloadError) {
            console.error(
              "Error al descargar archivo temporal:",
              downloadError
            );
            throw new Error(
              `Error al descargar archivo temporal: ${downloadError.message}`
            );
          }

          if (!fileData) {
            throw new Error("No se pudo obtener el archivo temporal");
          }

          // Subir a la ubicación permanente
          const uploadPath = `uploads/${finalFileName}`;
          console.log(`Subiendo archivo a ubicación permanente: ${uploadPath}`);

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("productos")
              .upload(uploadPath, fileData, {
                contentType: fileData.type,
                upsert: true,
              });

          if (uploadError) {
            throw new Error(
              `Error al subir a carpeta permanente: ${uploadError.message}`
            );
          }

          // Obtener la URL pública permanente
          const { data: urlData } = supabase.storage
            .from("productos")
            .getPublicUrl(uploadPath);

          // Eliminar el archivo temporal
          await supabase.storage.from("productos").remove([tempPath]);

          console.log("Archivo movido con éxito a la carpeta permanente");

          return NextResponse.json({
            success: true,
            message: "Archivo movido con éxito",
            finalUrl: urlData.publicUrl,
          });
        } else {
          // Si no es un archivo temporal, simplemente devolver la URL actual
          console.log(
            "La URL no es una imagen temporal, manteniendo la URL actual"
          );

          return NextResponse.json({
            success: true,
            message: "URL mantenida",
            finalUrl: path,
          });
        }
      } catch (error: any) {
        console.error("Error al procesar archivo:", error);
        return NextResponse.json(
          {
            success: false,
            message: `Error al procesar archivo: ${error.message}`,
            fallbackUrl: path, // Devolver la URL original como fallback
          },
          { status: 500 }
        );
      }
    } else {
      // Si save=false, eliminar todos los archivos temporales de esta sesión
      try {
        console.log(
          `Limpiando archivos temporales para la sesión: ${sessionId}`
        );

        // Listar archivos en la carpeta temp
        const { data: files, error: listError } = await supabase.storage
          .from("productos")
          .list("temp");

        if (listError) {
          throw new Error(
            `Error al listar archivos temporales: ${listError.message}`
          );
        }

        // Filtrar solo los archivos de esta sesión
        const sessionFiles = files
          .filter((file: { name: string }) =>
            file.name.startsWith(`${sessionId}-`)
          )
          .map((file: { name: string }) => `temp/${file.name}`);

        if (sessionFiles.length > 0) {
          console.log(`Eliminando ${sessionFiles.length} archivos temporales`);

          // Eliminar archivos
          const { error: deleteError } = await supabase.storage
            .from("productos")
            .remove(sessionFiles);

          if (deleteError) {
            throw new Error(
              `Error al eliminar archivos temporales: ${deleteError.message}`
            );
          }
        }

        return NextResponse.json({
          success: true,
          message: `Sesión cancelada y ${sessionFiles.length} archivos temporales eliminados`,
        });
      } catch (error: any) {
        console.error("Error al eliminar archivos temporales:", error);
        return NextResponse.json(
          {
            success: false,
            message: `Error al eliminar archivos temporales: ${error.message}`,
          },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error("Error al finalizar la sesión:", error);
    return NextResponse.json(
      { message: `Error al procesar la solicitud: ${error.message}` },
      { status: 500 }
    );
  }
}
