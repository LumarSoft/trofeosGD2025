import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener todos los items de la galería
export async function GET(request: Request) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Error al obtener items de galería:", error);
    return NextResponse.json(
      { message: "Error al obtener items de galería" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear un nuevo item de galería
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { company, description, date, image_url } = body;

    // Validar datos
    if (!company || !description || !image_url) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que la URL de la imagen es válida (no un placeholder)
    if (image_url === "/placeholder.svg") {
      return NextResponse.json(
        { message: "Se requiere una imagen válida" },
        { status: 400 }
      );
    }

    // Crear el item en la base de datos
    const galleryItem = await prisma.galleryItem.create({
      data: {
        company,
        description,
        date: new Date(date),
        image_url,
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error("Error al crear item de galería:", error);
    return NextResponse.json(
      { message: "Error al crear item de galería", error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
