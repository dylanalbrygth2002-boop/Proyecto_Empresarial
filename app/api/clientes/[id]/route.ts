import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";

function requireAdmin(request: NextRequest) {
  const userRole = request.headers.get("x-user-role");
  if (userRole !== "ADMIN") {
    return errorResponse("No autorizado. Solo el administrador puede realizar esta acción.", 403);
  }
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!client) {
      return notFoundResponse("Cliente no encontrado");
    }

    return successResponse(client);
  } catch (error) {
    console.error("Get client error:", error);
    return errorResponse("Error al obtener cliente", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const client = await prisma.client.update({
      where: { id },
      data: body,
    });

    return successResponse(client);
  } catch (error) {
    console.error("Update client error:", error);
    return errorResponse("Error al actualizar cliente", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const projectsCount = await prisma.project.count({
      where: { clientId: id },
    });

    if (projectsCount > 0) {
      return errorResponse("No se puede eliminar el cliente porque tiene proyectos asociados", 409);
    }

    await prisma.client.delete({
      where: { id },
    });

    return successResponse({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Delete client error:", error);
    return errorResponse("Error al eliminar cliente", 500);
  }
}
