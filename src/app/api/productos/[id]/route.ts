import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getServerSupabaseClient } from "@/lib/supabaseStorage";

// Definir los tipos localmente sin depender de los tipos de Prisma
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
    }) as ProductoWithImages | null;

    if (!producto) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Transformar el producto para incluir las imágenes como array
    const transformedProduct = {
      ...producto,
      images: producto.images 
        ? JSON.parse(producto.images) 
        : producto.image_url 
          ? [producto.image_url]
          : [],
    };

    return NextResponse.json(transformedProduct);
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
    const { name, description, category_id, images, position } = body;

    // Obtener el producto actual para saber si necesitamos desconectar la categoría
    const currentProduct = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    }) as ProductoWithImages | null;

    // Preparar datos de actualización
    const updateData = {
      name,
      description,
      images: images ? JSON.stringify(images) : null,
      image_url: images && images.length > 0 ? images[0] : null, // Mantener compatibilidad con el campo image_url
      position: position !== undefined ? position : currentProduct?.position || 0, // Preservar la posición actual o usar la nueva
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
    }) as ProductoWithImages;

    // Transformar el producto para incluir las imágenes como array
    const transformedProduct = {
      ...producto,
      images: producto.images 
        ? JSON.parse(producto.images) 
        : producto.image_url 
          ? [producto.image_url]
          : [],
    };

    return NextResponse.json(transformedProduct);
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
    
    // Primero obtener el producto para acceder a sus imágenes
    const producto = await prisma.producto.findUnique({
      where: { id }
    }) as ProductoWithImages | null;
    
    if (!producto) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    // Extraer las URLs de imágenes
    const imageUrls = producto.images 
      ? JSON.parse(producto.images) as string[]
      : producto.image_url 
        ? [producto.image_url]
        : [];
    
    // Eliminar el producto de la base de datos
    await prisma.producto.delete({
      where: { id },
    });
    
    // Eliminar imágenes asociadas de Supabase Storage
    if (imageUrls.length > 0) {
      try {
        const supabase = getServerSupabaseClient();
        
        // Para cada imagen, obtener la ruta relativa en el bucket y eliminarla
        const filesToDelete = imageUrls
          .filter(url => url && url.includes('/uploads/')) // Solo procesar imágenes en la carpeta 'uploads'
          .map(url => {
            // Extraer el nombre del archivo de la URL
            const fileName = url.split('/').pop();
            return `uploads/${fileName}`;
          });
        
        if (filesToDelete.length > 0) {
          const { error } = await supabase.storage
            .from('productos')
            .remove(filesToDelete);
            
          if (error) {
            console.error('Error al eliminar imágenes de Supabase:', error);
          } else {
            console.log(`${filesToDelete.length} imágenes eliminadas de Supabase`);
          }
        }
      } catch (storageError) {
        console.error('Error al interactuar con Supabase Storage:', storageError);
        // No interrumpimos el flujo si hay un error al eliminar las imágenes
      }
    }

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
