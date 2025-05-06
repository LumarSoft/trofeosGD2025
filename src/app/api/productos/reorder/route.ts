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

    // Validar que todos los productos tengan ID y posición
    if (!productOrders.every(order => order.id && order.position !== undefined)) {
      return NextResponse.json(
        { message: "Cada producto debe tener un ID y una posición" },
        { status: 400 }
      );
    }

    // Actualizar todas las posiciones en una sola transacción
    try {
      // Primero verificamos que todos los productos existan
      const productIds = productOrders.map(order => order.id);
      const existingProducts = await prisma.producto.findMany({
        where: {
          id: {
            in: productIds
          }
        },
        select: {
          id: true
        }
      });

      if (existingProducts.length !== productIds.length) {
        return NextResponse.json(
          { message: "Algunos productos no existen" },
          { status: 400 }
        );
      }

      // Realizamos la actualización en lotes para evitar problemas de timeout
      const batchSize = 10;
      for (let i = 0; i < productOrders.length; i += batchSize) {
        const batch = productOrders.slice(i, i + batchSize);
        await Promise.all(
          batch.map(({ id, position }) =>
            prisma.producto.update({
              where: { id },
              data: { position },
            })
          )
        );
      }

      return NextResponse.json({
        success: true,
        message: "Orden de productos actualizado correctamente",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error en la actualización:", error);
      return NextResponse.json(
        { 
          message: "Error al actualizar el orden de los productos",
          error: error instanceof Error ? error.message : "Error desconocido"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { 
        message: "Error al procesar la solicitud",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 