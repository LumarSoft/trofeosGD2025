import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Buscar el usuario en la base de datos sin select explícito
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    // @ts-ignore - Ignoramos el error de TypeScript si el campo no es reconocido
    if (!user.is_admin) {
      return NextResponse.json(
        { message: "No tienes permisos de administrador" },
        { status: 403 }
      );
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        // @ts-ignore
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    // Enviar respuesta con token
    return NextResponse.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        // @ts-ignore
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
