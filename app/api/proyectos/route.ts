import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { projectSchema } from "@/lib/validations/project";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: { id: true, name: true, company: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });
    return successResponse(projects);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get projects error:", error);
    return errorResponse("Error al obtener proyectos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const { startDate, endDate, ...data } = result.data;

    const project = await prisma.project.create({
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return successResponse(project);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Create project error:", error);
    return errorResponse("Error al crear proyecto", 500);
  }
}