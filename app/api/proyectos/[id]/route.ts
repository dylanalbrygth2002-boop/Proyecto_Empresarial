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

function calcularPorcentajeAvance(tasks: { status: string }[]): number {
  if (tasks.length === 0) return 0;
  const completadas = tasks.filter((t) => t.status === "COMPLETED").length;
  return Math.round((completadas / tasks.length) * 100);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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

    const projectWithProgress = {
      ...project,
      progress: calcularPorcentajeAvance(project.tasks),
    };

    return successResponse(projectWithProgress);
  } catch (error) {
    console.error("Get project error:", error);
    return errorResponse("Error al obtener proyecto", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, startDate, endDate, status, clientId } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        clientId,
      },
    });

    return successResponse(project);
  } catch (error) {
    console.error("Update project error:", error);
    return errorResponse("Error al actualizar proyecto", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
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
    console.error("Delete project error:", error);
    return errorResponse("Error al eliminar proyecto", 500);
  }
}
