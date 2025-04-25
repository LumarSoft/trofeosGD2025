import {
  Producto as PrismaProducto,
  Categoria as PrismaCategoria,
} from "@prisma/client";

export type Producto = PrismaProducto & {
  categoria?: PrismaCategoria | null;
  images?: string[]; // Array de URLs de imágenes
  image_url?: string; // URL de la imagen principal (para compatibilidad)
  image?: string; // URL de la imagen (para compatibilidad)
};

export type Categoria = PrismaCategoria;
