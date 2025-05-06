import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Función auxiliar para reintentar operaciones con backoff exponencial
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5, // Aumentamos el número de reintentos
  initialDelay: number = 500 // Reducimos el delay inicial
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Intento ${i + 1} fallido:`, lastError.message);

      if (i < maxRetries - 1) {
        // Backoff exponencial con jitter para evitar sincronización
        const jitter = Math.random() * 200;
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

    // Establecer timeout para la solicitud
    const timeout = setTimeout(() => {
      console.warn("La operación está tardando demasiado tiempo");
    }, 8000);

    // Leer el body que contiene el nuevo orden
    const body = await request.json();
    const { productOrders } = body;

    if (!productOrders || !Array.isArray(productOrders)) {
      clearTimeout(timeout);
      return NextResponse.json(
        { message: "Formato de datos inválido" },
        { status: 400 }
      );
    }

    // Limitar el número de productos a procesar para evitar sobrecarga
    const maxProductsToProcess = 200;
    if (productOrders.length > maxProductsToProcess) {
      clearTimeout(timeout);
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
      clearTimeout(timeout);
      return NextResponse.json(
        { message: "Cada producto debe tener un ID y una posición" },
        { status: 400 }
      );
    }

    try {
      // Primero verificamos que todos los productos existan
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
        clearTimeout(timeout);
        return NextResponse.json(
          { message: "Algunos productos no existen" },
          { status: 400 }
        );
      }

      // Reducimos aún más el tamaño del lote para mayor estabilidad
      const batchSize = 5; // Reducimos aún más el tamaño para entornos de producción
      const batches = [];

      for (let i = 0; i < productOrders.length; i += batchSize) {
        const batch = productOrders.slice(i, i + batchSize);
        batches.push(batch);
      }

      // Procesar cada lote secuencialmente
      for (const batch of batches) {
        await retryOperation(
          async () => {
            // Procesamos de forma secuencial en lugar de usar Promise.all o transacciones
            for (const { id, position } of batch) {
              await prisma.producto.update({
                where: { id },
                data: { position },
              });
            }
          },
          3,
          300
        );

        // Pausa entre lotes para evitar sobrecarga
        if (batches.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      clearTimeout(timeout);
      return NextResponse.json({
        success: true,
        message: "Orden de productos actualizado correctamente",
        updatedCount: productOrders.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error en la actualización:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar el orden de los productos",
          error: error instanceof Error ? error.message : "Error desconocido",
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
  } finally {
    // No es necesario desconectar cuando se usa dataProxy
    // El cliente de Prisma se maneja automáticamente
  }
}
