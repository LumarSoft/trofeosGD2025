import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");

    const where = categoryId ? { category_id: parseInt(categoryId) } : {};

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { message: "Error al obtener productos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear un nuevo producto
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await auth(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, stock, category_id, image_url } = body;

    const producto = await prisma.producto.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id: parseInt(category_id),
        image_url,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { message: "Error al crear producto" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
