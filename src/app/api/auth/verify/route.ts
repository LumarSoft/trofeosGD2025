import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Obtener la cookie auth_token
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    // Si no hay token, usuario no autenticado
    if (!token) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;

    // Verificar que sea admin
    if (!decoded.isAdmin) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 403 }
      );
    }

    // Si llegamos aquí, el token es válido y el usuario es admin
    return NextResponse.json({
      message: "Autenticado correctamente",
      user: {
        userId: decoded.userId,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error al verificar token:", error);
    return NextResponse.json(
      { message: "Token inválido o expirado" },
      { status: 401 }
    );
  }
} 