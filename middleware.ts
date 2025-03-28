import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Verificar la ruta actual
  const pathname = request.nextUrl.pathname;

  // Obtener el token de autenticación
  const token = request.cookies.get("auth_token")?.value;

  // Casos específicos según la ruta

  // Caso 1: Exactamente la página de login (/admin)
  if (pathname === "/admin") {
    // Si ya está autenticado, redirigir al dashboard
    if (token) {
      try {
        const payload = verifyToken(token);
        if (payload.isAdmin) {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      } catch (error) {
        // Token inválido - dejarlo continuar a la página de login y eliminar el token
        const response = NextResponse.next();
        response.cookies.delete("auth_token");
        return response;
      }
    }
    // Si no está autenticado, mostrar la página de login normalmente
    return NextResponse.next();
  }

  // Caso 2: Cualquier ruta dentro del panel admin (/admin/*)
  if (pathname.startsWith("/admin/")) {
    // Si no tiene token, redirigir al login
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Si tiene token, verificar que sea válido
    try {
      const payload = verifyToken(token);

      // Verificar que sea admin
      if (!payload.isAdmin) {
        const response = NextResponse.redirect(new URL("/admin", request.url));
        response.cookies.delete("auth_token");
        return response;
      }

      // Si todo está correcto, permitir acceso
      return NextResponse.next();
    } catch (error) {
      // Token inválido
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // Para cualquier otra ruta (fuera de /admin*), permitir acceso sin verificar
  return NextResponse.next();
}

function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  try {
    return jwt.verify(token, secret) as any;
  } catch (error) {
    console.error("Error verificando token:", error);
    throw error;
  }
}

// Configurar EXACTAMENTE qué rutas debe interceptar el middleware
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
