import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener un producto por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { message: "Error al obtener producto" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar un producto
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
    const body = await request.json();
    const { name, description, stock, category_id, image_url } = body;

    // Obtener el producto actual para saber si necesitamos desconectar la categoría
    const currentProduct = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });

    // Preparar datos de actualización
    const updateData = {
      name,
      description,
      stock: stock !== undefined ? parseInt(stock) : undefined,
      image_url,
    };

    // Manejar la relación de categoría
    if (category_id) {
      // Si hay un category_id, conectar con esa categoría
      Object.assign(updateData, {
        categoria: {
          connect: { id: parseInt(category_id) },
        },
      });
    } else if (currentProduct?.categoria) {
      // Si no hay category_id pero había una categoría conectada, desconectarla
      Object.assign(updateData, {
        categoria: {
          disconnect: true,
        },
      });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: updateData,
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { message: "Error al actualizar producto" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar un producto
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
    await prisma.producto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { message: "Error al eliminar producto" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
