import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const isAdmin = userRole === "ADMIN";

    if (isAdmin) {
      // Dashboard para Admin: resumen global del sistema
      const [
        totalClientes,
        totalProyectos,
        proyectosActivos,
        proyectosFinalizados,
        tareasPendientes,
        tareasCompletadas,
        usuariosRegistrados,
        ultimosProyectos,
        ultimasTareas,
      ] = await Promise.all([
        prisma.client.count(),
        prisma.project.count(),
        prisma.project.count({ where: { status: "IN_PROGRESS" } }),
        prisma.project.count({ where: { status: "FINISHED" } }),
        prisma.task.count({ where: { status: "PENDING" } }),
        prisma.task.count({ where: { status: "COMPLETED" } }),
        prisma.user.count(),
        prisma.project.findMany({
          take: 4,
          orderBy: { createdAt: "desc" },
          include: {
            client: { select: { name: true } },
          },
        }),
        prisma.task.findMany({
          take: 4,
          orderBy: { createdAt: "desc" },
          include: {
            project: { select: { name: true } },
            responsible: { select: { name: true } },
          },
        }),
      ]);

      return successResponse({
        totalClientes,
        totalProyectos,
        proyectosActivos,
        proyectosFinalizados,
        tareasPendientes,
        tareasCompletadas,
        usuariosRegistrados,
        ultimosProyectos,
        ultimasTareas,
      });
    } else {
      // Dashboard para Usuario: solo sus tareas y proyectos
      const [
        totalTareas,
        tareasPendientes,
        tareasEnProgreso,
        tareasCompletadas,
        proyectosUsuario,
        ultimasTareas,
      ] = await Promise.all([
        prisma.task.count({ where: { responsibleId: userId || "" } }),
        prisma.task.count({ where: { responsibleId: userId || "", status: "PENDING" } }),
        prisma.task.count({ where: { responsibleId: userId || "", status: "IN_PROGRESS" } }),
        prisma.task.count({ where: { responsibleId: userId || "", status: "COMPLETED" } }),
        prisma.task.findMany({
          where: { responsibleId: userId || "" },
          select: { projectId: true },
          distinct: ["projectId"],
        }),
        prisma.task.findMany({
          where: { responsibleId: userId || "" },
          take: 4,
          orderBy: { createdAt: "desc" },
          include: {
            project: { select: { name: true } },
            responsible: { select: { name: true } },
          },
        }),
      ]);

      // Obtener los proyectos del usuario
      const projectIds = proyectosUsuario.map((t) => t.projectId);
      const ultimosProyectos = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { name: true } },
        },
      });

      return successResponse({
        totalTareas,
        tareasPendientes,
        tareasEnProgreso,
        tareasCompletadas,
        totalProyectos: projectIds.length,
        ultimosProyectos,
        ultimasTareas,
      });
    }
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return errorResponse("Error al obtener resumen", 500);
  }
}
