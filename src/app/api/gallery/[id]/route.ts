import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener un item de galería por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { message: "Item de galería no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Error al obtener item de galería:", error);
    return NextResponse.json(
      { message: "Error al obtener item de galería" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar un item de galería
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Verificar si el item existe
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Item de galería no encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { company, description, date, image_url } = body;

    // Validar datos
    if (!company || !description) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const updateData: any = {
      company,
      description,
      date: new Date(date),
    };

    // Solo actualizar image_url si se proporciona una válida
    if (image_url && image_url !== "/placeholder.svg") {
      updateData.image_url = image_url;
    }

    const galleryItem = await prisma.galleryItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Error al actualizar item de galería:", error);
    return NextResponse.json(
      { message: "Error al actualizar item de galería" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar un item de galería
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Verificar si el item existe
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Item de galería no encontrado" },
        { status: 404 }
      );
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Item de galería eliminado con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar item de galería:", error);
    return NextResponse.json(
      { message: "Error al eliminar item de galería" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
