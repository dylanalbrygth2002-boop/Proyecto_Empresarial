import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { taskSchema } from "@/lib/validations/task";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const responsibleId = searchParams.get("responsibleId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (responsibleId) where.responsibleId = responsibleId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, name: true },
        },
        responsible: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return successResponse(tasks);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get tasks error:", error);
    return errorResponse("Error al obtener tareas", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const { dueDate, ...data } = result.data;

    const task = await prisma.task.create({
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
    console.error("Create task error:", error);
    return errorResponse("Error al crear tarea", 500);
  }
}