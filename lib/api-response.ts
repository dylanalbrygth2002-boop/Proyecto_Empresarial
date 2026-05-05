export function successResponse<T>(data: T) {
  return Response.json({ success: true, data });
}

export function errorResponse(message: string, status: number = 400, errors?: Record<string, string[]>) {
  return Response.json(
    { success: false, message, errors },
    { status }
  );
}

export function unauthorizedResponse(message: string = "No autorizado") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Acceso denegado") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = "Recurso no encontrado") {
  return errorResponse(message, 404);
}