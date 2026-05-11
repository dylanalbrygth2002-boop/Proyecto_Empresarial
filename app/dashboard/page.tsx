"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAuthHeaders } from "@/components/AuthProvider";

interface DashboardData {
  totalClientes?: number;
  totalProyectos?: number;
  proyectosActivos?: number;
  proyectosFinalizados?: number;
  tareasPendientes?: number;
  tareasCompletadas?: number;
  usuariosRegistrados?: number;
  totalTareas?: number;
  tareasEnProgreso?: number;
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
    setUserRole(role);

    fetch("/api/dashboard/resumen", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = userRole === "ADMIN";

  const adminStats = [
    { label: "Clientes", value: data?.totalClientes ?? 0, color: "from-blue-500 to-blue-600", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { label: "Proyectos", value: data?.totalProyectos ?? 0, color: "from-indigo-500 to-indigo-600", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Activos", value: data?.proyectosActivos ?? 0, color: "from-emerald-500 to-emerald-600", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Finalizados", value: data?.proyectosFinalizados ?? 0, color: "from-slate-500 to-slate-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Tareas pendientes", value: data?.tareasPendientes ?? 0, color: "from-amber-500 to-amber-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Tareas completadas", value: data?.tareasCompletadas ?? 0, color: "from-green-500 to-green-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Usuarios", value: data?.usuariosRegistrados ?? 0, color: "from-purple-500 to-purple-600", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  const userStats = [
    { label: "Mis tareas", value: data?.totalTareas ?? 0, color: "from-blue-500 to-blue-600", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Pendientes", value: data?.tareasPendientes ?? 0, color: "from-amber-500 to-amber-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "En progreso", value: data?.tareasEnProgreso ?? 0, color: "from-indigo-500 to-indigo-600", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Completadas", value: data?.tareasCompletadas ?? 0, color: "from-green-500 to-green-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Mis proyectos", value: data?.totalProyectos ?? 0, color: "from-emerald-500 to-emerald-600", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ];

  const stats = isAdmin ? adminStats : userStats;

  const getStatusVariant = (status: string) => {
    const map: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
      PLANNED: "default", IN_PROGRESS: "info", PAUSED: "warning",
      FINISHED: "success", CANCELLED: "danger", PENDING: "warning", COMPLETED: "success",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: "Planificado", IN_PROGRESS: "En progreso", PAUSED: "Pausado",
      FINISHED: "Finalizado", CANCELLED: "Cancelado", PENDING: "Pendiente",
      IN_REVIEW: "En revisión", COMPLETED: "Completada",
    };
    return map[status] || status;
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Inicio</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isAdmin ? "Resumen general del sistema" : "Tu resumen personal"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className={`grid grid-cols-2 ${isAdmin ? "lg:grid-cols-4 xl:grid-cols-7" : "lg:grid-cols-5"} gap-4`}>
              {stats.map((stat, i) => (
                <Card key={stat.label} className={`!p-0 group animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wide leading-tight">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-700 group-hover:scale-105 transition-transform duration-200">{stat.value}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {/* Proyectos - con color indigo */}
              <Card color="indigo" className="!p-0 !border-t-4">
                <CardHeader className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h2 className="text-base font-bold text-blue-700">{isAdmin ? "Últimos proyectos" : "Mis proyectos"}</h2>
                    </div>
                    <Link href="/proyectos" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Ver todos →</Link>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  {data?.ultimosProyectos.length === 0 ? (
                    <p className="text-sm text-slate-500 px-5 py-6">{isAdmin ? "No hay proyectos" : "No tienes proyectos"}</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {data?.ultimosProyectos.map((project, idx) => (
                        <Link key={project.id} href={`/proyectos/${project.id}`} className={`flex items-center justify-between px-5 py-3.5 hover:bg-indigo-50/40 transition-all duration-200 hover:translate-x-1 animate-fade-in stagger-${Math.min(idx + 1, 8)}`}>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-blue-700 truncate">{project.name}</p>
                            <p className="text-xs text-slate-500 truncate">{project.client.name}</p>
                          </div>
                          <Badge variant={getStatusVariant(project.status)} className="shrink-0 ml-3">
                            {getStatusLabel(project.status)}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Tareas - con color blue */}
              <Card color="blue" className="!p-0 !border-t-4">
                <CardHeader className="px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h2 className="text-base font-bold text-blue-700">{isAdmin ? "Últimas tareas" : "Mis tareas"}</h2>
                    </div>
                    <Link href="/tareas" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Ver todas →</Link>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  {data?.ultimasTareas.length === 0 ? (
                    <p className="text-sm text-slate-500 px-5 py-6">{isAdmin ? "No hay tareas" : "No tienes tareas"}</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {data?.ultimasTareas.map((task, idx) => (
                        <Link key={task.id} href={`/tareas/${task.id}`} className={`flex items-center justify-between px-5 py-3.5 hover:bg-blue-50/40 transition-all duration-200 hover:translate-x-1 animate-fade-in stagger-${Math.min(idx + 1, 8)}`}>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-blue-700 truncate">{task.title}</p>
                             <p className="text-xs text-slate-500 truncate">{task.project.name} {isAdmin && `• ${task.responsible.name}`}</p>
                          </div>
                          <Badge variant={getStatusVariant(task.status)} className="shrink-0 ml-3">
                            {getStatusLabel(task.status)}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
