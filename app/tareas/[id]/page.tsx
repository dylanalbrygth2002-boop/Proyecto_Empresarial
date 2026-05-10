"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

export default function TareaDetailPage() {
  const params = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tareas/${params.id}`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) setTask(res.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = { LOW: "default", MEDIUM: "info", HIGH: "warning", CRITICAL: "danger" };
    return map[priority] || "default";
  };
  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Crítica" };
    return map[priority] || priority;
  };
  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PENDING: "warning", IN_PROGRESS: "info", IN_REVIEW: "default", COMPLETED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", IN_REVIEW: "En revisión", COMPLETED: "Completada", CANCELLED: "Cancelada" };
    return map[status] || status;
  };

  if (loading) return <AppShell><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div></AppShell>;
  if (!task) return <AppShell><p className="text-center text-slate-500 py-12">Tarea no encontrada</p></AppShell>;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{task.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Detalle de la tarea</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/tareas/${task.id}/editar`}><Button variant="outline" size="sm">Editar</Button></Link>
            <Link href="/tareas"><Button variant="outline" size="sm">Volver</Button></Link>
          </div>
        </div>

        <Card color="blue" className="!border-t-4">
          <CardBody className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Proyecto</p>
                <Link href={`/proyectos/${task.project.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">{task.project.name}</Link>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Responsable</p>
                <p className="font-semibold text-slate-900">{task.responsible.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prioridad</p>
                <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                <Badge variant={getStatusVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha límite</p>
                <p className="font-semibold text-slate-900">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' }) : "No definida"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Creada</p>
                <p className="font-semibold text-slate-900">{new Date(task.createdAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            {task.description && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</p>
                <p className="text-slate-700 leading-relaxed">{task.description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="flex justify-center">
          <Link href={`/tareas/${task.id}/historial`}>
            <Button variant="outline">Ver historial completo</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
