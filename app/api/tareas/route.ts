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

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const responsibleId = searchParams.get("responsibleId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (responsibleId) where.responsibleId = responsibleId;

    // Si no es admin, solo mostrar tareas asignadas al usuario
    if (userRole !== "ADMIN") {
      where.responsibleId = userId || "";
    }

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
    console.error("Get tasks error:", error);
    return errorResponse("Error al obtener tareas", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const isAdmin = userRole === "ADMIN";

    const body = await request.json();
    const { title, description, projectId, responsibleId, priority, status, dueDate } = body;

    // Validaciones para usuario normal
    if (!isAdmin) {
      // Verificar que el proyecto esté asignado al usuario (tiene tareas ahí)
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        responsibleId: isAdmin ? responsibleId : (userId || ""),
        priority: priority || "MEDIUM",
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return successResponse(task);
  } catch (error) {
    console.error("Create task error:", error);
    return errorResponse("Error al crear tarea", 500);
  }
}
