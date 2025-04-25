// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Crear una respuesta
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
    
    // Eliminar la cookie auth_token con la misma configuración que al crearla
    response.cookies.delete({
      name: "auth_token",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al cerrar sesión",
      },
      { status: 500 }
    );
  }
}
