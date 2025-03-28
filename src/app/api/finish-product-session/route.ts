import { NextRequest, NextResponse } from "next/server";
import { readdir, copyFile, unlink, mkdir, access } from "fs/promises";
import { join } from "path";
import { auth } from "@/lib/auth";

// Función para verificar y crear directorio si no existe
async function ensureDirectoryExists(dirPath: string) {
  try {
    await access(dirPath);
  } catch (error) {
    // Si el directorio no existe, crearlo
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { sessionId, save, imageUrl } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { message: "ID de sesión no proporcionado" },
        { status: 400 }
      );
    }

    const tempDir = join(process.cwd(), "public/temp");
    const uploadsDir = join(process.cwd(), "public/uploads");

    // Asegurarse de que el directorio uploads existe
    await ensureDirectoryExists(uploadsDir);

    // Si save=true, mover la imagen seleccionada al directorio final
    if (save && imageUrl && imageUrl.startsWith("/temp/")) {
      // Obtener el nombre del archivo de la URL
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        const sourcePath = join(tempDir, fileName);
        // Generar un nuevo nombre para la versión final para evitar problemas con nombres temporales
        const finalFileName = fileName.replace(`${sessionId}-`, "");
        const destPath = join(uploadsDir, finalFileName);

        await copyFile(sourcePath, destPath);

        // Eliminar la versión temporal
        await unlink(sourcePath);

        return NextResponse.json(
          {
            success: true,
            message: "Sesión finalizada y archivo movido con éxito",
            finalUrl: `/uploads/${finalFileName}`,
          },
          { status: 200 }
        );
      }
    }

    // Si save=false o no hay imageUrl, simplemente eliminar todos los archivos de esta sesión
    try {
      const files = await readdir(tempDir);
      // Filtrar solo los archivos que pertenecen a esta sesión
      const sessionFiles = files.filter((file) =>
        file.startsWith(`${sessionId}-`)
      );

      // Eliminar cada archivo temporal de esta sesión
      for (const file of sessionFiles) {
        await unlink(join(tempDir, file));
      }

      return NextResponse.json(
        {
          success: true,
          message: `Sesión cancelada y ${sessionFiles.length} archivos temporales eliminados`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al eliminar archivos temporales:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Error al eliminar archivos temporales",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al finalizar la sesión:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
