"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function TareaDetailPage() {
  const params = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tareas/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setTask(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  if (!task) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Tarea no encontrada</p>
      </AppShell>
    );
  }

  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = {
      LOW: "default",
      MEDIUM: "info",
      HIGH: "warning",
      CRITICAL: "danger",
    };
    return map[priority] || "default";
  };

  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
      CRITICAL: "Crítica",
    };
    return map[priority] || priority;
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = {
      PENDING: "warning",
      IN_PROGRESS: "info",
      IN_REVIEW: "default",
      COMPLETED: "success",
      CANCELLED: "danger",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Pendiente",
      IN_PROGRESS: "En progreso",
      IN_REVIEW: "En revisión",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    };
    return map[status] || status;
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
            <p className="text-slate-500">Detalle de la tarea</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/tareas/${task.id}/editar`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Link href="/tareas">
              <Button variant="outline">Volver</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Proyecto</p>
                <p className="font-medium">{task.project.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Responsable</p>
                <p className="font-medium">{task.responsible.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Prioridad</p>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <Badge variant={getStatusVariant(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fecha límite</p>
                <p className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("es-ES") : "No definida"}</p>
              </div>
            </div>
            {task.description && (
              <div>
                <p className="text-sm text-slate-500">Descripción</p>
                <p className="mt-1">{task.description}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}