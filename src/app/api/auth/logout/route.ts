// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Eliminar la cookie auth_token
    cookies().delete("auth_token");

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
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
