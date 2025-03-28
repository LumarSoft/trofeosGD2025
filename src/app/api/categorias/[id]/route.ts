import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener una categoría por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      return NextResponse.json(
        { message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return NextResponse.json(
      { message: "Error al obtener la categoría" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar una categoría
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
      return NextResponse.json(
        { message: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: {
        name,
      },
    });

    return NextResponse.json(categoriaActualizada);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return NextResponse.json(
      { message: "Error al actualizar la categoría" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar una categoría
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
      return NextResponse.json(
        { message: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    // Verificar si hay productos asociados a esta categoría
    const productosCount = await prisma.producto.count({
      where: { category_id: id },
    });

    if (productosCount > 0) {
      // Establecer category_id a null en los productos asociados
      await prisma.producto.updateMany({
        where: { category_id: id },
        data: { category_id: null },
      });
    }

    // Eliminar la categoría
    await prisma.categoria.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return NextResponse.json(
      { message: "Error al eliminar la categoría" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
