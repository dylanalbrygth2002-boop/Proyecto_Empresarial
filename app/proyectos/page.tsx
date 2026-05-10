"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

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
    fetch("/api/proyectos", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) { setProjects(res.data); setFilteredProjects(res.data); } })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) { setFilteredProjects(projects); return; }
    setFilteredProjects(projects.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.client.name.toLowerCase().includes(query) ||
      p.client.company.toLowerCase().includes(query)
    ));
  }, [searchQuery, projects]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    const res = await fetch(`/api/proyectos/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      setFilteredProjects(updated);
    } else { alert(data.message); }
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PLANNED: "default", IN_PROGRESS: "info", PAUSED: "warning", FINISHED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PLANNED: "Planificado", IN_PROGRESS: "En progreso", PAUSED: "Pausado", FINISHED: "Finalizado", CANCELLED: "Cancelado" };
    return map[status] || status;
  };
  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-slate-200";
    if (progress < 30) return "bg-red-500";
    if (progress < 60) return "bg-amber-500";
    if (progress < 100) return "bg-indigo-500";
    return "bg-emerald-500";
  };

  const isAdmin = userRole === "ADMIN";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Proyectos</h1>
            <p className="text-sm text-slate-500 mt-0.5">{isAdmin ? "Gestión de proyectos" : "Proyectos asignados"}</p>
          </div>
          {isAdmin && (
            <Link href="/proyectos/nuevo">
              <Button>+ Nuevo proyecto</Button>
            </Link>
          )}
        </div>

        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" placeholder="Buscar proyecto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-blue-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium">{searchQuery ? `${filteredProjects.length} de ${projects.length}` : `${projects.length} proyectos`}</p>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div>
        ) : filteredProjects.length === 0 ? (
          <p className="text-center text-slate-500 py-12">{searchQuery ? "No se encontraron" : "No hay proyectos"}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project, idx) => (
               <Card key={project.id} color="indigo" className={`!p-0 flex flex-col !border-t-4 animate-fade-in stagger-${Math.min(idx + 1, 8)}`}>
                <CardBody className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-blue-700 truncate">{project.name}</h3>
                      <p className="text-sm text-slate-500">{project.client.name}</p>
                    </div>
                    <Badge variant={getStatusVariant(project.status)} className="shrink-0 ml-2">{getStatusLabel(project.status)}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Avance</span>
                      <span className="font-bold text-slate-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{project._count.tasks} tareas</span>
                      <span>{new Date(project.startDate).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <Link href={`/proyectos/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Ver detalle</Button>
                    </Link>
                    {isAdmin && (
                      <>
                        <Link href={`/proyectos/${project.id}/editar`}><Button variant="outline" size="sm">Editar</Button></Link>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>Eliminar</Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
