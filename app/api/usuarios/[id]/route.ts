import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getSession } from "@/lib/auth-server";
import { userUpdateSchema } from "@/lib/validations/user";
import { successResponse, errorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return notFoundResponse("Usuario no encontrado");
    }

    return successResponse(user);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbiddenResponse();
    }
    console.error("Get user error:", error);
    return errorResponse("Error al obtener usuario", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const result = userUpdateSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    if (id === session.userId && result.data.role && result.data.role !== "ADMIN") {
      return errorResponse("No puedes cambiar tu propio rol de administrador", 403);
    }

    const user = await prisma.user.update({
      where: { id },
      data: result.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbiddenResponse();
    }
    console.error("Update user error:", error);
    return errorResponse("Error al actualizar usuario", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    if (id === session.userId) {
      return errorResponse("No puedes eliminar tu propio usuario", 403);
    }

    const tasksCount = await prisma.task.count({
      where: { responsibleId: id },
    });

    if (tasksCount > 0) {
      return errorResponse("No se puede eliminar el usuario porque tiene tareas asignadas", 409);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ message: "Usuario eliminado" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbiddenResponse();
    }
    console.error("Delete user error:", error);
    return errorResponse("Error al eliminar usuario", 500);
  }
}