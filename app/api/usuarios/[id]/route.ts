import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    console.error("Get user error:", error);
    return errorResponse("Error al obtener usuario", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await prisma.user.update({
      where: { id },
      data: body,
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
    console.error("Update user error:", error);
    return errorResponse("Error al actualizar usuario", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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
    console.error("Delete user error:", error);
    return errorResponse("Error al eliminar usuario", 500);
  }
}