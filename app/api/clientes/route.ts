import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { clientSchema } from "@/lib/validations/client";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });
    return successResponse(clients);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Get clients error:", error);
    return errorResponse("Error al obtener clientes", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = clientSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Datos inválidos", 400, result.error.flatten().fieldErrors);
    }

    const client = await prisma.client.create({
      data: result.data,
    });

    return successResponse(client);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    console.error("Create client error:", error);
    return errorResponse("Error al crear cliente", 500);
  }
}