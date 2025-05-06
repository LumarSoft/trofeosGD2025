import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Función auxiliar para reintentar operaciones con backoff exponencial
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 200
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Intento ${i + 1} fallido:`, lastError.message);

      if (i < maxRetries - 1) {
        const jitter = Math.random() * 100;
        const delay = initialDelay * Math.pow(1.5, i) + jitter;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

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
    const { productOrders, chunkIndex = 0, totalChunks = 1 } = body;

    if (!productOrders || !Array.isArray(productOrders)) {
      return NextResponse.json(
        { message: "Formato de datos inválido" },
        { status: 400 }
      );
    }

    // Limitar el número de productos a procesar para evitar sobrecarga
    const maxProductsToProcess = 50;
    if (productOrders.length > maxProductsToProcess) {
      return NextResponse.json(
        {
          message: `No se pueden procesar más de ${maxProductsToProcess} productos a la vez`,
        },
        { status: 400 }
      );
    }

    // Validar que todos los productos tengan ID y posición
    if (
      !productOrders.every((order) => order.id && order.position !== undefined)
    ) {
      return NextResponse.json(
        { message: "Cada producto debe tener un ID y una posición" },
        { status: 400 }
      );
    }

    try {
      // Verificar que todos los productos existan
      const productIds = productOrders.map((order) => order.id);

      const existingProducts = await retryOperation(() =>
        prisma.producto.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
          },
        })
      );

      if (existingProducts.length !== productIds.length) {
        return NextResponse.json(
          { message: "Algunos productos no existen" },
          { status: 400 }
        );
      }

      // Procesar el chunk actual en una única transacción
      await retryOperation(async () => {
        await prisma.$transaction(
          productOrders.map(({ id, position }) =>
            prisma.producto.update({
              where: { id },
              data: { position },
            })
          )
        );
      });

      // Devolver información sobre el progreso
      return NextResponse.json({
        success: true,
        message: "Chunk procesado correctamente",
        chunkIndex,
        totalChunks,
        processedCount: productOrders.length,
        isComplete: chunkIndex === totalChunks - 1,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error en la actualización:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar el orden de los productos",
          error: error instanceof Error ? error.message : "Error desconocido",
          chunkIndex,
          totalChunks,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      {
        message: "Error al procesar la solicitud",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
