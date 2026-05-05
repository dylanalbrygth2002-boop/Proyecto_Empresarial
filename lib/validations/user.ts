import { z } from "zod";
import { UserRole } from "@prisma/client";

export const userUpdateSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  email: z.string().email("Correo electrónico inválido").optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;