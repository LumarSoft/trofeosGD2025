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
    let token = null;

    // Intentar obtener token del encabezado Authorization
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Si no hay token en el encabezado, intentar obtenerlo de la cookie
    if (!token) {
      // Intentar obtener de la cookie usando Next.js cookies()
      try {
        const cookieStore = cookies();
        token = cookieStore.get("auth_token")?.value;
      } catch (error) {
        // Si hay error (puede ocurrir en API routes), intentar parsear manualmente
        const cookieHeader = request.headers.get("cookie");
        if (cookieHeader) {
          const cookieArray = cookieHeader.split(";");
          for (let cookie of cookieArray) {
            const [name, value] = cookie.trim().split("=");
            if (name === "auth_token") {
              token = value;
              break;
            }
          }
        }
      }
    }

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
