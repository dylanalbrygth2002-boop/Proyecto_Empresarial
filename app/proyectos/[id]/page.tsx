"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";
import { Browser } from "@capacitor/browser";

export default function ProyectoDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`/api/proyectos/${params.id}`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) setProject(res.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/proyectos/${params.id}/reporte`, { headers: getAuthHeaders() });
      if (!res.ok) { alert("Error al generar reporte"); setDownloading(false); return; }
      const blob = await res.blob();
      const fileName = `reporte-${project.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;

      // Detectar si estamos en Capacitor (app movil)
      const isCapacitor = typeof window !== "undefined" && !!(window as any).Capacitor;

      if (isCapacitor) {
        // App movil: abrir PDF en navegador interno con Capacitor Browser
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          try {
            await Browser.open({ url: base64data });
          } catch {
            alert("Error al abrir el navegador");
          }
          setDownloading(false);
        };
        reader.onerror = () => { alert("Error al procesar el PDF"); setDownloading(false); };
      } else {
        // Navegador web: descarga normal
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); a.click();
        window.URL.revokeObjectURL(url); document.body.removeChild(a);
        setDownloading(false);
      }
    } catch { alert("Error al descargar"); setDownloading(false); }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-slate-200";
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-amber-500";
    if (progress < 100) return "bg-indigo-500";
    return "bg-emerald-500";
  };
  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PLANNED: "default", IN_PROGRESS: "info", PAUSED: "warning", FINISHED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PLANNED: "Planificado", IN_PROGRESS: "En progreso", PAUSED: "Pausado", FINISHED: "Finalizado", CANCELLED: "Cancelado" };
    return map[status] || status;
  };
  const getTaskStatusVariant = (status: string) => {
    const map: Record<string, any> = { PENDING: "warning", IN_PROGRESS: "info", IN_REVIEW: "default", COMPLETED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getTaskStatusLabel = (status: string) => {
    const map: Record<string, string> = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", IN_REVIEW: "En revisión", COMPLETED: "Completada", CANCELLED: "Cancelada" };
    return map[status] || status;
  };

  if (loading) return <AppShell><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div></AppShell>;
  if (!project) return <AppShell><p className="text-center text-slate-500 py-12">Proyecto no encontrado</p></AppShell>;

  const progress = project.progress || 0;
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
             <h1 className="text-2xl font-bold text-blue-700 tracking-tight break-words">{project.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Detalle del proyecto</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadReport} isLoading={downloading}>
              {downloading ? "Generando..." : "Descargar PDF"}
            </Button>
            <Link href={`/proyectos/${project.id}/editar`}><Button variant="outline" size="sm">Editar</Button></Link>
            <Link href="/proyectos"><Button variant="outline" size="sm">Volver</Button></Link>
          </div>
        </div>

        {/* Progreso */}
        <Card color="indigo" className="!p-0 !border-t-4">
          <CardBody className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-blue-700">Progreso del proyecto</h2>
                  <p className="text-sm text-slate-500">{completedTasks} de {totalTasks} tareas completadas</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-blue-700">{progress}<span className="text-2xl text-slate-400">%</span></span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(progress)}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-2xl font-bold text-blue-700">{totalTasks}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Total tareas</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">{project.tasks?.filter((t: any) => t.status === "PENDING").length || 0}</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">Pendientes</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">{project.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length || 0}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">En progreso</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">{completedTasks}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">Completadas</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Info */}
        <Card color="indigo" className="!border-t-4">
          <CardBody className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cliente</p>
                <p className="font-semibold text-blue-700 truncate">{project.client.name} <span className="text-slate-500 font-normal">({project.client.company})</span></p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de inicio</p>
                <p className="font-semibold text-blue-700">{new Date(project.startDate).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha de fin</p>
                <p className="font-semibold text-blue-700">{project.endDate ? new Date(project.endDate).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' }) : "No definida"}</p>
              </div>
            </div>
            {project.description && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</p>
                 <p className="text-slate-700 leading-relaxed break-words">{project.description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tareas */}
        <Card color="blue" className="!p-0 !border-t-4">
          <CardHeader>
            <h2 className="text-lg font-semibold text-blue-700">Tareas asociadas</h2>
          </CardHeader>
          <CardBody className="p-0">
            {project.tasks.length === 0 ? (
              <p className="text-sm text-slate-500 px-6 py-6">No hay tareas asociadas</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {project.tasks.map((task: any) => (
                  <Link key={task.id} href={`/tareas/${task.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-blue-700 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 truncate">Responsable: {task.responsible.name}</p>
                    </div>
                    <Badge variant={getTaskStatusVariant(task.status)}>{getTaskStatusLabel(task.status)}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
