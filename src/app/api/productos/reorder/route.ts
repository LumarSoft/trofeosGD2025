import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Actualizar el orden de los productos
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Leer el body que contiene el nuevo orden
    const body = await request.json();
    const { productOrders } = body;

    if (!productOrders || !Array.isArray(productOrders)) {
      return NextResponse.json(
        { message: "Formato de datos inválido" },
        { status: 400 }
      );
    }

    // Actualizar la posición de cada producto
    const updatePromises = productOrders.map(({ id, position }) => {
      return prisma.producto.update({
        where: { id },
        data: { position },
      });
    });

    await Promise.all(updatePromises);

    // Guardar timestamp de actualización para que el catálogo lo detecte
    const timestamp = Date.now();

    return NextResponse.json({
      success: true,
      message: "Orden de productos actualizado correctamente",
      timestamp,
    });
  } catch (error) {
    console.error("Error al actualizar el orden de los productos:", error);
    return NextResponse.json(
      { message: "Error al actualizar el orden de los productos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 