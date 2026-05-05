import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { clientSchema } from "@/lib/validations/client";
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get client error:", error);
    return errorResponse("Error al obtener cliente", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = clientSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const client = await prisma.client.update({
      where: { id },
      data: result.data,
    });

    return successResponse(client);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Update client error:", error);
    return errorResponse("Error al actualizar cliente", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Delete client error:", error);
    return errorResponse("Error al eliminar cliente", 500);
  }
}