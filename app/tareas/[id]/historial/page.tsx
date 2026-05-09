"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function TaskHistoryPage() {
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

  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
      CRITICAL: "Crítica",
    };
    return map[priority] || priority;
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Historial de Tarea</h1>
            <p className="text-slate-500">{task.title}</p>
          </div>
          <Link href="/tareas">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>

        {/* Información general */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Información General</h2>
          </CardHeader>
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
                <Badge variant={task.priority === "CRITICAL" ? "danger" : task.priority === "HIGH" ? "warning" : task.priority === "MEDIUM" ? "info" : "default"}>
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado Actual</p>
                <Badge variant={getStatusVariant(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Línea de tiempo - Historial */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Línea de Tiempo</h2>
          </CardHeader>
          <CardBody>
            <div className="relative border-l-2 border-blue-200 ml-3 space-y-6">
              {/* Fecha de creación */}
              <div className="relative pl-6">
                <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Tarea creada</p>
                  <p className="text-sm text-slate-500">{formatDateTime(task.createdAt)}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    La tarea fue registrada en el sistema
                  </p>
                </div>
              </div>

              {/* Fecha límite */}
              {task.dueDate && (
                <div className="relative pl-6">
                  <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Fecha límite establecida</p>
                    <p className="text-sm text-slate-500">{formatDate(task.dueDate)}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Fecha de entrega esperada
                    </p>
                  </div>
                </div>
              )}

              {/* Última actualización */}
              <div className="relative pl-6">
                <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Última actualización</p>
                  <p className="text-sm text-slate-500">{formatDateTime(task.updatedAt)}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Estado actual: {getStatusLabel(task.status)}
                  </p>
                </div>
              </div>

              {/* Si está completada, mostrar fecha de finalización */}
              {task.status === "COMPLETED" && (
                <div className="relative pl-6">
                  <div className="absolute -left-2.5 top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Tarea completada</p>
                    <p className="text-sm text-slate-500">{formatDateTime(task.updatedAt)}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      La tarea fue marcada como completada
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Descripción */}
        {task.description && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Descripción</h2>
            </CardHeader>
            <CardBody>
              <p className="text-slate-700">{task.description}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
