"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { id: string; name: string };
  responsible: { id: string; name: string };
}

interface GroupedTasks { projectId: string; projectName: string; tasks: Task[]; }

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const id = localStorage.getItem("userId") || "";
    setUserRole(role);
    setUserId(id);
    fetch("/api/tareas", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) setTasks(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const [userId, setUserId] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    const res = await fetch(`/api/tareas/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) setTasks(tasks.filter((t) => t.id !== id));
    else alert(data.message);
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PENDING: "warning", IN_PROGRESS: "info", IN_REVIEW: "default", COMPLETED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = { LOW: "default", MEDIUM: "info", HIGH: "warning", CRITICAL: "danger" };
    return map[priority] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", IN_REVIEW: "En revisión", COMPLETED: "Completada", CANCELLED: "Cancelada" };
    return map[status] || status;
  };
  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Crítica" };
    return map[priority] || priority;
  };

  const isAdmin = userRole === "ADMIN";

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(query) || t.project.name.toLowerCase().includes(query) || t.responsible.name.toLowerCase().includes(query));
  }, [searchQuery, tasks]);

  const groupedTasks: GroupedTasks[] = useMemo(() => {
    const groups: Record<string, GroupedTasks> = {};
    filteredTasks.forEach((task) => {
      if (!groups[task.project.id]) groups[task.project.id] = { projectId: task.project.id, projectName: task.project.name, tasks: [] };
      groups[task.project.id].tasks.push(task);
    });
    return Object.values(groups);
  }, [filteredTasks]);

  const getTaskStats = (projectTasks: Task[]) => {
    const pending = projectTasks.filter((t) => t.status === "PENDING").length;
    const inProgress = projectTasks.filter((t) => t.status === "IN_PROGRESS").length;
    const completed = projectTasks.filter((t) => t.status === "COMPLETED").length;
    return { pending, inProgress, completed, total: projectTasks.length };
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Tareas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{isAdmin ? "Gestión de todas las tareas" : "Tareas asignadas a ti"}</p>
        </div>

        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" placeholder="Buscar tarea..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-blue-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div>
        ) : groupedTasks.length === 0 ? (
          <Card color="blue"><CardBody><p className="text-center text-slate-500 py-8">{searchQuery ? "No se encontraron" : (isAdmin ? "No hay tareas" : "No tienes tareas")}</p></CardBody></Card>
        ) : (
          <div className="space-y-5">
            {searchQuery && <p className="text-sm text-slate-500 font-medium">{filteredTasks.length} tareas encontradas</p>}
            {groupedTasks.map((group, gIdx) => {
               const stats = getTaskStats(group.tasks);
               return (
                  <Card key={group.projectId} color="blue" className={`!p-0 overflow-hidden !border-t-4 animate-fade-in stagger-${Math.min(gIdx + 1, 8)}`}>
                  <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base font-bold text-blue-700 truncate">{group.projectName}</h2>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                          <span>{stats.total} tarea{stats.total !== 1 ? "s" : ""}</span>
                          {stats.pending > 0 && <span className="text-amber-600 font-medium">• {stats.pending} pendiente{stats.pending !== 1 ? "s" : ""}</span>}
                          {stats.inProgress > 0 && <span className="text-blue-600 font-medium">• {stats.inProgress} en progreso</span>}
                          {stats.completed > 0 && <span className="text-emerald-600 font-medium">• {stats.completed} completada{stats.completed !== 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/tareas/nueva?proyectoId=${group.projectId}`} className="shrink-0">
                          <Button size="sm">+ Nueva tarea</Button>
                        </Link>
                        <Link href={`/proyectos/${group.projectId}`} className="shrink-0">
                          <Button variant="outline" size="sm">Ver proyecto</Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                     <div className="divide-y divide-slate-100">
                       {group.tasks.map((task, tIdx) => (
                         <div key={task.id} className={`px-5 py-3.5 hover:bg-slate-50/60 transition-all duration-200 hover:translate-x-1 animate-fade-in stagger-${Math.min(tIdx + 1, 8)}`}>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-semibold text-blue-700 leading-snug flex-1">{task.title}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                              <Badge variant={getStatusVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{task.responsible.name}{task.dueDate && <span> • {new Date(task.dueDate).toLocaleDateString("es-ES")}</span>}</p>
                          <div className="flex items-center gap-2">
                            <Link href={`/tareas/${task.id}/historial`} className="flex-1 sm:flex-none"><Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">Historial</Button></Link>
                            {isAdmin && (
                              <>
                                <Link href={`/tareas/${task.id}/editar`} className="flex-1 sm:flex-none"><Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">Editar</Button></Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)} className="flex-1 sm:flex-none text-xs">Eliminar</Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
