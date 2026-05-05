"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DashboardData {
  totalClientes: number;
  totalProyectos: number;
  proyectosActivos: number;
  proyectosFinalizados: number;
  tareasPendientes: number;
  tareasCompletadas: number;
  usuariosRegistrados: number;
  ultimosProyectos: Array<{
    id: string;
    name: string;
    status: string;
    client: { name: string };
  }>;
  ultimasTareas: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    project: { name: string };
    responsible: { name: string };
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/resumen")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Clientes", value: data?.totalClientes ?? 0, color: "blue" },
    { label: "Proyectos", value: data?.totalProyectos ?? 0, color: "indigo" },
    { label: "Proyectos activos", value: data?.proyectosActivos ?? 0, color: "emerald" },
    { label: "Proyectos finalizados", value: data?.proyectosFinalizados ?? 0, color: "slate" },
    { label: "Tareas pendientes", value: data?.tareasPendientes ?? 0, color: "amber" },
    { label: "Tareas completadas", value: data?.tareasCompletadas ?? 0, color: "green" },
    { label: "Usuarios", value: data?.usuariosRegistrados ?? 0, color: "purple" },
  ];

  const getStatusVariant = (status: string) => {
    const map: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
      PLANNED: "default",
      IN_PROGRESS: "info",
      PAUSED: "warning",
      FINISHED: "success",
      CANCELLED: "danger",
      PENDING: "warning",
      COMPLETED: "success",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: "Planificado",
      IN_PROGRESS: "En progreso",
      PAUSED: "Pausado",
      FINISHED: "Finalizado",
      CANCELLED: "Cancelado",
      PENDING: "Pendiente",
      COMPLETED: "Completada",
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Resumen general del sistema</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Últimos proyectos</h2>
            </CardHeader>
            <CardBody>
              {data?.ultimosProyectos.length === 0 ? (
                <p className="text-sm text-slate-500">No hay proyectos registrados</p>
              ) : (
                <div className="space-y-3">
                  {data?.ultimosProyectos.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500">{project.client.name}</p>
                      </div>
                      <Badge variant={getStatusVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Últimas tareas</h2>
            </CardHeader>
            <CardBody>
              {data?.ultimasTareas.length === 0 ? (
                <p className="text-sm text-slate-500">No hay tareas registradas</p>
              ) : (
                <div className="space-y-3">
                  {data?.ultimasTareas.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">
                          {task.project.name} • {task.responsible.name}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
