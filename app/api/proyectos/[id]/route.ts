import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { projectSchema } from "@/lib/validations/project";
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, company: true, email: true },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
          include: {
            responsible: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!project) {
      return notFoundResponse("Proyecto no encontrado");
    }

    return successResponse(project);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get project error:", error);
    return errorResponse("Error al obtener proyecto", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const { startDate, endDate, ...data } = result.data;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return successResponse(project);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Update project error:", error);
    return errorResponse("Error al actualizar proyecto", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    const tasksCount = await prisma.task.count({
      where: { projectId: id },
    });

    if (tasksCount > 0) {
      return errorResponse("No se puede eliminar el proyecto porque tiene tareas asociadas", 409);
    }

    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ message: "Proyecto eliminado" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Delete project error:", error);
    return errorResponse("Error al eliminar proyecto", 500);
  }
}