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

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    let clients;

    if (userRole === "ADMIN") {
      // Admin ve todos los clientes
      clients = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });
    } else {
      // Usuario normal solo ve clientes de proyectos donde tiene tareas
      const userTasks = await prisma.task.findMany({
        where: { responsibleId: userId || "" },
        select: { projectId: true },
        distinct: ["projectId"],
      });

      const projectIds = userTasks.map((t) => t.projectId);

      const projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        select: { clientId: true },
        distinct: ["clientId"],
      });

      const clientIds = projects.map((p) => p.clientId);

      clients = await prisma.client.findMany({
        where: { id: { in: clientIds } },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });
    }

    return successResponse(clients);
  } catch (error) {
    console.error("Get clients error:", error);
    return errorResponse("Error al obtener clientes", 500);
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, email, phone, company, status } = body;

    // Verificar que no exista un cliente con el mismo correo
    const existingClient = await prisma.client.findFirst({
      where: { email },
    });

    if (existingClient) {
      return errorResponse("Ya existe un cliente con ese correo electrónico", 409);
    }

    const client = await prisma.client.create({
      data: { name, email, phone, company, status },
    });

    return successResponse(client);
  } catch (error) {
    console.error("Create client error:", error);
    return errorResponse("Error al crear cliente", 500);
  }
}
