"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

export default function TareaHistorialPage() {
  const params = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tareas/${params.id}`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) setTask(res.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PENDING: "warning", IN_PROGRESS: "info", IN_REVIEW: "default", COMPLETED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", IN_REVIEW: "En revisión", COMPLETED: "Completada", CANCELLED: "Cancelada" };
    return map[status] || status;
  };
  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = { LOW: "default", MEDIUM: "info", HIGH: "warning", CRITICAL: "danger" };
    return map[priority] || "default";
  };
  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Crítica" };
    return map[priority] || priority;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "No definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' }) + " a las " + date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <AppShell><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div></AppShell>;
  if (!task) return <AppShell><p className="text-center text-slate-500 py-12">Tarea no encontrada</p></AppShell>;

  const timelineEvents = [
    { date: task.createdAt, title: "Tarea creada", description: `La tarea "${task.title}" fue creada en el proyecto ${task.project.name}.`, icon: "M12 6v6m0 0v6m0-6h6m-6 0H6", color: "bg-blue-500" },
    { date: task.dueDate, title: "Fecha límite", description: `Fecha de entrega establecida: ${formatDate(task.dueDate)}`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-amber-500" },
    { date: task.updatedAt, title: "Última actualización", description: `La tarea fue modificada por última vez.`, icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", color: "bg-indigo-500" },
  ];
  if (task.status === "COMPLETED" && task.completedAt) {
    timelineEvents.push({ date: task.completedAt, title: "Tarea completada", description: "La tarea fue marcada como completada.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-emerald-500" });
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Historial de tarea</h1>
            <p className="text-sm text-slate-500 mt-0.5">{task.title}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/tareas/${task.id}`}><Button variant="outline" size="sm">Ver tarea</Button></Link>
            <Link href="/tareas"><Button variant="outline" size="sm">Volver</Button></Link>
          </div>
        </div>

        {/* Info */}
        <Card>
          <CardBody>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
              <Badge variant={getStatusVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
              <span className="text-sm text-slate-500">Proyecto: <Link href={`/proyectos/${task.project.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700">{task.project.name}</Link></span>
            </div>
          </CardBody>
        </Card>

        {/* Timeline */}
        <Card className="!p-0">
          <CardHeader className="px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">Línea de tiempo</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4 px-6 py-5 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${event.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={event.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{formatDateTime(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
