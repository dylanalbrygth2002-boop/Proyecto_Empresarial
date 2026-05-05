import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth-server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse("No hay sesión activa");
    }

    return successResponse({ user });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Error al obtener usuario", 500);
  }
}