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

// POST - Actualizar el orden de los productos mediante swap
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Leer el body que contiene los productos a intercambiar
    const body = await request.json();
    const { sourceProduct, destinationProduct } = body;

    if (!sourceProduct?.id || !destinationProduct?.id) {
      return NextResponse.json(
        { message: "Se requieren los IDs de ambos productos" },
        { status: 400 }
      );
    }

    try {
      // Realizar el swap en una única transacción
      await prisma.$transaction(async (tx) => {
        // Obtener las posiciones actuales
        const [source, destination] = await Promise.all([
          tx.producto.findUnique({
            where: { id: sourceProduct.id },
            select: { position: true },
          }),
          tx.producto.findUnique({
            where: { id: destinationProduct.id },
            select: { position: true },
          }),
        ]);

        if (!source || !destination) {
          throw new Error("Uno o ambos productos no existen");
        }

        // Intercambiar las posiciones
        await Promise.all([
          tx.producto.update({
            where: { id: sourceProduct.id },
            data: { position: destination.position },
          }),
          tx.producto.update({
            where: { id: destinationProduct.id },
            data: { position: source.position },
          }),
        ]);
      });

      return NextResponse.json({
        success: true,
        message: "Posiciones actualizadas correctamente",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error en la actualización:", error);
      return NextResponse.json(
        {
          message: "Error al actualizar las posiciones",
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
  }
}
