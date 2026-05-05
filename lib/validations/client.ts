import { z } from "zod";
import { ClientStatus } from "@prisma/client";

export const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().min(1, "La empresa es requerida"),
  status: z.nativeEnum(ClientStatus).default("ACTIVE"),
});

export type ClientInput = z.infer<typeof clientSchema>;