import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    // Obtener el sessionId del formulario (identificador único para cada sesión de edición)
    const sessionId = formData.get("sessionId") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No se ha proporcionado ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo (solo imágenes)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WEBP, GIF)",
        },
        { status: 400 }
      );
    }

    // Limitar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "El archivo excede el tamaño máximo permitido (2MB)" },
        { status: 400 }
      );
    }

    // Generar nombre único para evitar colisiones
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const extension = originalName.split(".").pop();
    // Incluir sessionId en el nombre para identificar a qué sesión pertenece
    const fileName = `${sessionId}-${timestamp}.${extension}`;

    // Guardar en la carpeta "temp"
    const path = join(process.cwd(), "public/temp");

    // Asegurarse de que el directorio existe
    await ensureDirectoryExists(path);

    // Convertir el archivo a ArrayBuffer y luego a Buffer para escribirlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar el archivo
    const filePath = join(path, fileName);
    await writeFile(filePath, buffer);

    // Devolver la URL relativa para acceder a la imagen
    const imageUrl = `/temp/${fileName}`;

    return NextResponse.json(
      {
        url: imageUrl,
        sessionId: sessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { message: "Error al procesar la subida del archivo" },
      { status: 500 }
    );
  }
}
