import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

export const projectSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().or(z.literal("")),
  status: z.nativeEnum(ProjectStatus).default("PLANNED"),
  clientId: z.string().min(1, "El cliente es requerido"),
});

export type ProjectInput = z.infer<typeof projectSchema>;