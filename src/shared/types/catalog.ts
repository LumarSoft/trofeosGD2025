import {
  Producto as PrismaProducto,
  Categoria as PrismaCategoria,
} from "@prisma/client";

export type Producto = PrismaProducto & {
  categoria?: PrismaCategoria | null;
};

export type Categoria = PrismaCategoria;
