import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { taskSchema } from "@/lib/validations/task";
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get task error:", error);
    return errorResponse("Error al obtener tarea", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const { dueDate, ...data } = result.data;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return successResponse(task);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Update task error:", error);
    return errorResponse("Error al actualizar tarea", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;

    await prisma.task.delete({
      where: { id },
    });

    return successResponse({ message: "Tarea eliminada" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Delete task error:", error);
    return errorResponse("Error al eliminar tarea", 500);
  }
}