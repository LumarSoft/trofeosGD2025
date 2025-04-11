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
    if (save === true && path) {
      try {
        // Comprobación de seguridad para la URL
        if (!path || typeof path !== "string") {
          throw new Error("URL de imagen no válida");
        }

        // Extraer el nombre de archivo de la URL
        const fileName = path.split("/").pop();

        if (!fileName) {
          throw new Error("Nombre de archivo no válido");
        }

        // Comprobar si el archivo está en la carpeta temp de Supabase
        if (path.includes("temp/")) {
          console.log(`Procesando archivo temporal: ${fileName}`);

          // Extraer el nombre sin el prefijo de sesión para la versión permanente
          // Importante: asegúrese de que el patrón coincida con cómo se guarda en el endpoint de upload
          const finalFileName = fileName.replace(`${sessionId}-`, "");

          // Añadir prefijo gallery_ para distinguir de otros archivos
          const galleryFileName = `gallery_${finalFileName}`;

          // Descargar el archivo temporal primero
          const { data: fileData, error: downloadError } =
            await supabase.storage
              .from("productos")
              .download(`temp/${fileName}`);

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

          console.log(`Archivo temporal descargado: ${fileName}`);

          // Subir a la ubicación permanente
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("productos")
              .upload(`uploads/${galleryFileName}`, fileData, {
                contentType: fileData.type,
                upsert: true,
              });

          if (uploadError) {
            console.error("Error al subir a carpeta permanente:", uploadError);
            throw new Error(
              `Error al subir a carpeta permanente: ${uploadError.message}`
            );
          }

          console.log(
            `Archivo subido a carpeta permanente: uploads/${galleryFileName}`
          );

          // Obtener la URL pública permanente
          const { data: urlData } = supabase.storage
            .from("productos")
            .getPublicUrl(`uploads/${galleryFileName}`);

          console.log(`URL pública obtenida: ${urlData.publicUrl}`);

          // Eliminar el archivo temporal
          const { error: deleteError } = await supabase.storage
            .from("productos")
            .remove([`temp/${fileName}`]);

          if (deleteError) {
            console.warn(
              "No se pudo eliminar el archivo temporal:",
              deleteError
            );
          } else {
            console.log(`Archivo temporal eliminado: temp/${fileName}`);
          }

          return NextResponse.json({
            success: true,
            message: "Archivo movido con éxito",
            finalUrl: urlData.publicUrl,
          });
        } else {
          // Si no es un archivo temporal, simplemente devolver la URL actual
          console.log("La URL no es temporal, se mantiene tal cual:", path);
          return NextResponse.json({
            success: true,
            message: "URL mantenida",
            finalUrl: path,
          });
        }
      } catch (error: any) {
        console.error("Error al procesar archivo de galería:", error);
        return NextResponse.json(
          {
            success: false,
            message: `Error al procesar archivo: ${error.message}`,
            fallbackUrl: path, // Devolver la URL original como fallback
          },
          { status: 500 }
        );
      }
    } else if (save === false) {
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
          console.error("Error al listar archivos temporales:", listError);
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

        console.log(
          `Encontrados ${sessionFiles.length} archivos temporales para eliminar`
        );

        if (sessionFiles.length > 0) {
          // Eliminar archivos
          const { error: deleteError } = await supabase.storage
            .from("productos")
            .remove(sessionFiles);

          if (deleteError) {
            console.error(
              "Error al eliminar archivos temporales:",
              deleteError
            );
            throw new Error(
              `Error al eliminar archivos temporales: ${deleteError.message}`
            );
          }

          console.log(`Eliminados ${sessionFiles.length} archivos temporales`);
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
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "Operación no válida. Debe especificar 'save' como true o false",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error al finalizar la sesión de galería:", error);
    return NextResponse.json(
      { message: `Error al procesar la solicitud: ${error.message}` },
      { status: 500 }
    );
  }
}
