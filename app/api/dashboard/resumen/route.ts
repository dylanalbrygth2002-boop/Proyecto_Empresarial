import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();

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
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { name: true } },
        },
      }),
      prisma.task.findMany({
        take: 5,
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
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Dashboard summary error:", error);
    return errorResponse("Error al obtener resumen", 500);
  }
}