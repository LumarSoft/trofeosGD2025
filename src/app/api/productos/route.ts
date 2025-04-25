import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Extender el tipo Producto para incluir el campo images y la relación con categoria
type ProductoWithImages = {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  image_url: string | null;
  images: string | null;
  position: number;
  created_at: Date;
  updated_at: Date;
  categoria?: {
    name: string;
  } | null;
};

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
      orderBy: {
        position: 'asc', // Ordenar por posición ascendente
      },
    }) as ProductoWithImages[];

    // Transformar los productos para incluir las imágenes como array
    const transformedProducts = productos.map(producto => ({
      ...producto,
      // Si ya tiene images parseado, usarlo, si no, crear un array con image_url si existe
      images: producto.images 
        ? JSON.parse(producto.images) 
        : producto.image_url 
          ? [producto.image_url]
          : [],
    }));

    return NextResponse.json(transformedProducts);
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
    const { name, description, images, category_id } = body;

    // Obtener el mayor valor de position para asignar el próximo
    const maxPositionProduct = await prisma.producto.findFirst({
      orderBy: {
        position: 'desc',
      },
    });
    
    const nextPosition = maxPositionProduct ? maxPositionProduct.position + 1 : 0;

    // Datos mínimos para crear un producto
    const createData: any = {
      name,
      description,
      images: images ? JSON.stringify(images) : null,
      image_url: images && images.length > 0 ? images[0] : null, // Mantener compatibilidad con el campo image_url
      position: nextPosition, // Asignar la nueva posición
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
    }) as ProductoWithImages;

    // Transformar el producto para incluir las imágenes como array
    const transformedProduct = {
      ...producto,
      images: producto.images ? JSON.parse(producto.images) : [],
    };

    return NextResponse.json(transformedProduct, { status: 201 });
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
