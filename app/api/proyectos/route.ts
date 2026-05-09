import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

function requireAdmin(request: NextRequest) {
  const userRole = request.headers.get("x-user-role");
  if (userRole !== "ADMIN") {
    return errorResponse("No autorizado. Solo el administrador puede realizar esta acción.", 403);
  }
  return null;
}

// Calcular el porcentaje de avance de un proyecto
function calcularPorcentajeAvance(tasks: { status: string }[]): number {
  if (tasks.length === 0) return 0;
  const completadas = tasks.filter((t) => t.status === "COMPLETED").length;
  return Math.round((completadas / tasks.length) * 100);
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    let projects;

    if (userRole === "ADMIN") {
      // Admin ve todos los proyectos con tareas
      projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: { id: true, name: true, company: true },
          },
          tasks: {
            select: { id: true, status: true },
          },
        },
      });
    } else {
      // Usuario normal solo ve proyectos donde tiene tareas asignadas
      const userTasks = await prisma.task.findMany({
        where: { responsibleId: userId || "" },
        select: { projectId: true },
        distinct: ["projectId"],
      });

      const projectIds = userTasks.map((t) => t.projectId);

      projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: { id: true, name: true, company: true },
          },
          tasks: {
            select: { id: true, status: true },
          },
        },
      });
    }

    // Agregar porcentaje de avance a cada proyecto
    const projectsWithProgress = projects.map((project) => ({
      ...project,
      progress: calcularPorcentajeAvance(project.tasks),
      _count: { tasks: project.tasks.length },
    }));

    return successResponse(projectsWithProgress);
  } catch (error) {
    console.error("Get projects error:", error);
    return errorResponse("Error al obtener proyectos", 500);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, description, startDate, endDate, status, clientId } = body;

    const project = await prisma.project.create({
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
    console.error("Create project error:", error);
    return errorResponse("Error al crear proyecto", 500);
  }
}
