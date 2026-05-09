"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  client: { name: string; company: string };
  _count: { tasks: number };
  progress: number;
}

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);

    fetch("/api/proyectos")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProjects(res.data);
          setFilteredProjects(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredProjects(projects);
      return;
    }
    const filtered = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.client.name.toLowerCase().includes(query) ||
        p.client.company.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    const res = await fetch(`/api/proyectos/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      setFilteredProjects(updated);
    } else {
      alert(data.message);
    }
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
      IN_PROGRESS: "En progreso",
      PAUSED: "Pausado",
      FINISHED: "Finalizado",
      CANCELLED: "Cancelado",
    };
    return map[status] || status;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-slate-200";
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-blue-500";
    if (progress < 100) return "bg-emerald-500";
    return "bg-green-600";
  };

  const isAdmin = userRole === "ADMIN";

  return (
    <AppShell>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Proyectos</h1>
            <p className="text-sm text-slate-500">
              {isAdmin ? "Gestión de todos los proyectos" : "Proyectos asignados a ti"}
            </p>
          </div>
          {isAdmin && (
            <Link href="/proyectos/nuevo">
              <Button className="w-full sm:w-auto">Nuevo proyecto</Button>
            </Link>
          )}
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Contador */}
        <div className="text-sm text-slate-500">
          {searchQuery ? `${filteredProjects.length} de ${projects.length} proyectos` : `${projects.length} proyectos`}
        </div>

        {/* Vista móvil y desktop: Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-8">
              {searchQuery ? "No se encontraron proyectos" : (isAdmin ? "No hay proyectos registrados" : "No tienes proyectos asignados")}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="!p-0">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
                      <p className="text-sm text-slate-500">{project.client.name}</p>
                    </div>
                    <Badge variant={getStatusVariant(project.status)} className="shrink-0 ml-2">
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Avance</span>
                      <span className="font-semibold text-slate-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{project._count.tasks} tareas</span>
                      <span>{new Date(project.startDate).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/proyectos/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Ver detalle</Button>
                    </Link>
                    {isAdmin && (
                      <>
                        <Link href={`/proyectos/${project.id}/editar`}>
                          <Button variant="outline" size="sm">Editar</Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
