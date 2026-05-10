"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DashboardData {
  // Admin fields
  totalClientes?: number;
  totalProyectos?: number;
  proyectosActivos?: number;
  proyectosFinalizados?: number;
  tareasPendientes?: number;
  tareasCompletadas?: number;
  usuariosRegistrados?: number;
  // User fields
  totalTareas?: number;
  tareasEnProgreso?: number;
  // Common fields
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
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const id = localStorage.getItem("userId") || "";
    setUserRole(role);

    // Asegurar que el fetch siempre lleve headers de auth
    // (respaldo si AuthProvider aun no intercepto fetch)
    fetch("/api/dashboard/resumen", {
      headers: {
        "X-User-Id": id,
        "X-User-Role": role,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = userRole === "ADMIN";

  // Stats for Admin
  const adminStats = [
    { label: "Clientes", value: data?.totalClientes ?? 0, color: "blue" },
    { label: "Proyectos", value: data?.totalProyectos ?? 0, color: "indigo" },
    { label: "Proyectos activos", value: data?.proyectosActivos ?? 0, color: "emerald" },
    { label: "Proyectos finalizados", value: data?.proyectosFinalizados ?? 0, color: "slate" },
    { label: "Tareas pendientes", value: data?.tareasPendientes ?? 0, color: "amber" },
    { label: "Tareas completadas", value: data?.tareasCompletadas ?? 0, color: "green" },
    { label: "Usuarios", value: data?.usuariosRegistrados ?? 0, color: "purple" },
  ];

  // Stats for User
  const userStats = [
    { label: "Mis tareas", value: data?.totalTareas ?? 0, color: "blue" },
    { label: "Tareas pendientes", value: data?.tareasPendientes ?? 0, color: "amber" },
    { label: "En progreso", value: data?.tareasEnProgreso ?? 0, color: "indigo" },
    { label: "Tareas completadas", value: data?.tareasCompletadas ?? 0, color: "green" },
    { label: "Mis proyectos", value: data?.totalProyectos ?? 0, color: "emerald" },
  ];

  const stats = isAdmin ? adminStats : userStats;

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
          <p className="text-slate-500">
            {isAdmin ? "Resumen general del sistema" : "Tu resumen personal"}
          </p>
        </div>

        <div className={`grid grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-5"} gap-3`}>
          {stats.map((stat) => (
            <Card key={stat.label} className="!p-0">
              <CardBody className="p-3">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="!p-0">
            <CardHeader className="px-4 py-3 pb-0">
              <h2 className="text-base font-semibold text-slate-900">
                {isAdmin ? "Últimos proyectos" : "Mis proyectos"}
              </h2>
            </CardHeader>
            <CardBody className="p-4 pt-2">
              {data?.ultimosProyectos.length === 0 ? (
                <p className="text-xs text-slate-500">
                  {isAdmin ? "No hay proyectos registrados" : "No tienes proyectos asignados"}
                </p>
              ) : (
                <div className="space-y-2">
                  {data?.ultimosProyectos.map((project) => (
                    <div key={project.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{project.name}</p>
                        <p className="text-[10px] text-slate-500">{project.client.name}</p>
                      </div>
                      <Badge variant={getStatusVariant(project.status)} className="text-[10px] px-1.5 py-0.5 shrink-0 ml-2">
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="!p-0">
            <CardHeader className="px-4 py-3 pb-0">
              <h2 className="text-base font-semibold text-slate-900">
                {isAdmin ? "Últimas tareas" : "Mis tareas"}
              </h2>
            </CardHeader>
            <CardBody className="p-4 pt-2">
              {data?.ultimasTareas.length === 0 ? (
                <p className="text-xs text-slate-500">
                  {isAdmin ? "No hay tareas registradas" : "No tienes tareas asignadas"}
                </p>
              ) : (
                <div className="space-y-2">
                  {data?.ultimasTareas.map((task) => (
                    <div key={task.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{task.title}</p>
                        <p className="text-[10px] text-slate-500">
                          {task.project.name} • {isAdmin ? task.responsible.name : "Asignada a ti"}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(task.status)} className="text-[10px] px-1.5 py-0.5 shrink-0 ml-2">
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
