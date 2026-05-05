import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

const publicRoutes = ["/", "/login", "/register"];
const adminRoutes = ["/usuarios"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Permitir rutas publicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar autenticacion para rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = verifyToken(token);

    // Verificar rol admin para rutas administrativas
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clientes/:path*",
    "/proyectos/:path*",
    "/tareas/:path*",
    "/usuarios/:path*",
    "/perfil/:path*",
  ],
};