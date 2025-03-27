// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Verificar si la ruta requiere autenticación
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin";
  const isLogoutRoute = request.nextUrl.pathname === "/api/auth/logout";
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");

  // Para la ruta de logout, permitir el acceso
  if (isLogoutRoute) {
    return NextResponse.next();
  }

  // Para otras rutas de API de autenticación, permitir el acceso
  if (isApiAuthRoute && !isLogoutRoute) {
    return NextResponse.next();
  }

  // Si es la página de login, y ya está autenticado, redirigir al dashboard
  if (isLoginRoute && token) {
    try {
      const payload = verifyToken(token);
      // Solo redirigir si es administrador
      if (payload.isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch (error) {
      // Si el token no es válido, eliminar la cookie
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // Si es una ruta de admin (excepto login) y no hay token, redirigir al login
  if (isAdminRoute && !isLoginRoute && !token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Si es una ruta de admin (excepto login) y hay token, verificar que sea válido
  if (isAdminRoute && !isLoginRoute && token) {
    try {
      const payload = verifyToken(token);

      // Verificar si el usuario es administrador según el token
      if (!payload.isAdmin) {
        const response = NextResponse.redirect(new URL("/admin", request.url));
        response.cookies.delete("auth_token");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      // Si el token no es válido, eliminar la cookie y redirigir al login
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

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

// Configurar las rutas que el middleware debe procesar
export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
