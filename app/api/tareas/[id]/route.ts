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
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        responsible: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!task) {
      return notFoundResponse("Tarea no encontrada");
    }

    return successResponse(task);
  } catch (error) {
    console.error("Get task error:", error);
    return errorResponse("Error al obtener tarea", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const isAdmin = userRole === "ADMIN";

    const { id } = await params;
    const body = await request.json();
    const { title, description, projectId, responsibleId, priority, status, dueDate } = body;

    // Verificar que la tarea existe
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return notFoundResponse("Tarea no encontrada");
    }

    // Si no es admin, solo puede editar sus propias tareas
    if (!isAdmin && existingTask.responsibleId !== userId) {
      return errorResponse("No puedes editar tareas de otros usuarios", 403);
    }

    // Si no es admin y quiere cambiar el proyecto, verificar que tenga acceso
    if (!isAdmin && projectId && projectId !== existingTask.projectId) {
      const userProjectTask = await prisma.task.findFirst({
        where: { 
          responsibleId: userId || "",
          projectId: projectId
        }
      });

      if (!userProjectTask) {
        return errorResponse("No tienes acceso a este proyecto", 403);
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        projectId,
        responsibleId: isAdmin ? responsibleId : existingTask.responsibleId,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return successResponse(task);
  } catch (error) {
    console.error("Update task error:", error);
    return errorResponse("Error al actualizar tarea", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const isAdmin = userRole === "ADMIN";

    const { id } = await params;

    // Verificar que la tarea existe
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return notFoundResponse("Tarea no encontrada");
    }

    // Si no es admin, solo puede eliminar sus propias tareas
    if (!isAdmin && existingTask.responsibleId !== userId) {
      return errorResponse("No puedes eliminar tareas de otros usuarios", 403);
    }

    await prisma.task.delete({
      where: { id },
    });

    return successResponse({ message: "Tarea eliminada" });
  } catch (error) {
    console.error("Delete task error:", error);
    return errorResponse("Error al eliminar tarea", 500);
  }
}
