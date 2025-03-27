// lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface UserPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

export async function auth(
  request: Request | NextRequest
): Promise<UserPayload | null> {
  try {
    // Intentar obtener token de cookie
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get("auth_token")?.value;

    // Intentar obtener token del encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    const tokenFromHeader =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return null;
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as UserPayload;

    return decoded;
  } catch (error) {
    console.error("Error de autenticación:", error);
    return null;
  }
}
