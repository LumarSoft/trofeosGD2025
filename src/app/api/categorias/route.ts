import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { message: "Error al obtener categorías" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear una nueva categoría
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const categoria = await prisma.categoria.create({
      data: { name },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return NextResponse.json(
      { message: "Error al crear categoría" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
