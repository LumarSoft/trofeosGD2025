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

    const { paths } = await request.json();

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { message: "No se proporcionaron rutas de imágenes para limpiar" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseClient();
    const tempPaths: string[] = [];
    const results: { path: string; success: boolean; error?: string }[] = [];

    // Extraer las rutas correctas de las URLs
    for (const path of paths) {
      try {
        if (!path || path === "/placeholder.svg") continue;

        // Comprobar si la ruta contiene una imagen temporal
        const isTempImage =
          path.includes("/temp/") ||
          path.includes("temp%2F") ||
          path.includes("/productos/temp/");

        if (!isTempImage) continue;

        // Extraer el nombre de archivo de la URL
        const fileName = path.split("/").pop();
        if (!fileName) continue;

        // Construir la ruta correcta para la carpeta temp
        const tempPath = `temp/${fileName}`;
        tempPaths.push(tempPath);
      } catch (error: any) {
        console.error(`Error al procesar ruta ${path}:`, error);
        results.push({
          path,
          success: false,
          error: error.message || "Error desconocido"
        });
      }
    }

    // Si no hay rutas válidas para eliminar, retornar
    if (tempPaths.length === 0) {
      return NextResponse.json({
        message: "No hay imágenes temporales para eliminar",
        deleted: 0,
        results
      });
    }

    // Eliminar los archivos
    console.log(`Eliminando ${tempPaths.length} archivos temporales:`, tempPaths);
    const { data, error } = await supabase.storage
      .from("productos")
      .remove(tempPaths);

    if (error) {
      console.error("Error al eliminar archivos temporales:", error);
      return NextResponse.json(
        { 
          message: `Error al eliminar archivos temporales: ${error.message}`,
          deleted: 0,
          results
        },
        { status: 500 }
      );
    }

    // Registrar resultados individuales
    for (const path of tempPaths) {
      results.push({
        path,
        success: true
      });
    }

    return NextResponse.json({
      success: true,
      message: `${tempPaths.length} archivos temporales eliminados con éxito`,
      deleted: tempPaths.length,
      results
    });
  } catch (error: any) {
    console.error("Error al limpiar imágenes temporales:", error);
    return NextResponse.json(
      { 
        message: `Error al procesar la solicitud: ${error.message}`,
        deleted: 0 
      },
      { status: 500 }
    );
  }
} 