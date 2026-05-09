import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export function getUserIdFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function requireAuth(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function getCurrentUser(request: NextRequest) {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}