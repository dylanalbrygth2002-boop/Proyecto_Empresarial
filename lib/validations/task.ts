import { z } from "zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

export const taskSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
  projectId: z.string().min(1, "El proyecto es requerido"),
  responsibleId: z.string().min(1, "El responsable es requerido"),
  priority: z.nativeEnum(TaskPriority).default("MEDIUM"),
  status: z.nativeEnum(TaskStatus).default("PENDING"),
  dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().or(z.literal("")),
});

export type TaskInput = z.infer<typeof taskSchema>;