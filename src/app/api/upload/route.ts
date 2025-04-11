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

    // Convertir el archivo a ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Inicializar el cliente de Supabase
    const supabase = getServerSupabaseClient();

    // Subir el archivo a la carpeta temp en Supabase
    const { data, error } = await supabase.storage
      .from("productos")
      .upload(`temp/${fileName}`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error al subir archivo a Supabase:", error);
      return NextResponse.json(
        { message: `Error al subir archivo: ${error.message}` },
        { status: 500 }
      );
    }

    // Obtener la URL pública
    const { data: urlData } = supabase.storage
      .from("productos")
      .getPublicUrl(`temp/${fileName}`);

    // Devolver la URL relativa para acceder a la imagen
    return NextResponse.json(
      {
        url: urlData.publicUrl,
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
