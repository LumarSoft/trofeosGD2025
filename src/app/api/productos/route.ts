import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET(request: Request) {
  try {
    const productos = await prisma.producto.findMany({
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
    const { name, description, image_url, category_id } = body;

    // Datos mínimos para crear un producto
    const createData: any = {
      name,
      description,
      image_url,
    };

    // Sólo agregamos la categoría si hay un category_id
    if (category_id) {
      createData.categoria = {
        connect: { id: parseInt(category_id) },
      };
    }

    const producto = await prisma.producto.create({
      data: createData,
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { message: "Error al crear producto", error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
