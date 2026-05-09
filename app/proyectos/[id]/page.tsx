"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function ProyectoDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`/api/proyectos/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProject(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/proyectos/${params.id}/reporte`);
      if (!res.ok) {
        alert("Error al generar el reporte");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-proyecto-${project.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert("Error al descargar el reporte");
    } finally {
      setDownloading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-slate-200";
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-blue-500";
    if (progress < 100) return "bg-emerald-500";
    return "bg-green-600";
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = {
      PLANNED: "default",
      IN_PROGRESS: "info",
      PAUSED: "warning",
      FINISHED: "success",
      CANCELLED: "danger",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: "Planificado",
      IN_PROGRESS: "En Progreso",
      PAUSED: "Pausado",
      FINISHED: "Finalizado",
      CANCELLED: "Cancelado",
    };
    return map[status] || status;
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

  if (!project) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Proyecto no encontrado</p>
      </AppShell>
    );
  }

  const progress = project.progress || 0;
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500">Detalle del proyecto</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleDownloadReport} 
              isLoading={downloading}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {downloading ? "Generando..." : "Descargar PDF"}
            </Button>
            <Link href={`/proyectos/${project.id}/editar`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Editar</Button>
            </Link>
            <Link href="/proyectos" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Volver</Button>
            </Link>
          </div>
        </div>

        {/* Card de progreso */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Progreso del proyecto</h2>
                  <p className="text-sm text-slate-500">
                    {completedTasks} de {totalTasks} tareas completadas
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-slate-900">{progress}%</span>
                </div>
              </div>
              
              {/* Barra de progreso grande */}
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Estadísticas de tareas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
                  <p className="text-xs text-slate-500">Total tareas</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700">
                    {project.tasks?.filter((t: any) => t.status === "PENDING").length || 0}
                  </p>
                  <p className="text-xs text-amber-600">Pendientes</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">
                    {project.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length || 0}
                  </p>
                  <p className="text-xs text-blue-600">En progreso</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-700">{completedTasks}</p>
                  <p className="text-xs text-emerald-600">Completadas</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Cliente</p>
                <p className="font-medium">{project.client.name} ({project.client.company})</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <Badge variant={getStatusVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fecha de inicio</p>
                <p className="font-medium">{new Date(project.startDate).toLocaleDateString("es-ES")}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fecha de fin</p>
                <p className="font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString("es-ES") : "No definida"}</p>
              </div>
            </div>
            {project.description && (
              <div>
                <p className="text-sm text-slate-500">Descripción</p>
                <p className="mt-1">{project.description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Tareas asociadas</h2>
          </CardHeader>
          <CardBody>
            {project.tasks.length === 0 ? (
              <p className="text-sm text-slate-500">No hay tareas asociadas</p>
            ) : (
              <div className="space-y-2">
                {project.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-slate-500">Responsable: {task.responsible.name}</p>
                    </div>
                    <Badge variant={task.status === "COMPLETED" ? "success" : task.status === "IN_PROGRESS" ? "info" : "warning"}>
                      {task.status === "PENDING" ? "Pendiente" : task.status === "IN_PROGRESS" ? "En Progreso" : task.status === "IN_REVIEW" ? "En Revisión" : task.status === "COMPLETED" ? "Completada" : "Cancelada"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
