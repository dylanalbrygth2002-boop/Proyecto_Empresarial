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

interface GroupedTasks {
  projectId: string;
  projectName: string;
  tasks: Task[];
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const id = localStorage.getItem("userId") || "";
    setUserRole(role);
    setUserId(id);

    fetch("/api/tareas", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setTasks(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;

    const res = await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setTasks(tasks.filter((t) => t.id !== id));
    } else {
      alert(data.message);
    }
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = {
      PENDING: "warning",
      IN_PROGRESS: "info",
      IN_REVIEW: "default",
      COMPLETED: "success",
      CANCELLED: "danger",
    };
    return map[status] || "default";
  };

  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = {
      LOW: "default",
      MEDIUM: "info",
      HIGH: "warning",
      CRITICAL: "danger",
    };
    return map[priority] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Pendiente",
      IN_PROGRESS: "En progreso",
      IN_REVIEW: "En revisión",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    };
    return map[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
      CRITICAL: "Crítica",
    };
    return map[priority] || priority;
  };

  const isAdmin = userRole === "ADMIN";

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.project.name.toLowerCase().includes(query) ||
        t.responsible.name.toLowerCase().includes(query)
    );
  }, [searchQuery, tasks]);

  const groupedTasks: GroupedTasks[] = useMemo(() => {
    const groups: Record<string, GroupedTasks> = {};
    filteredTasks.forEach((task) => {
      if (!groups[task.project.id]) {
        groups[task.project.id] = {
          projectId: task.project.id,
          projectName: task.project.name,
          tasks: [],
        };
      }
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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Tareas</h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Gestión de todas las tareas" : "Tareas asignadas a ti"}
          </p>
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
            placeholder="Buscar tarea..."
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

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : groupedTasks.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-slate-500 py-8">
                {searchQuery ? "No se encontraron tareas" : (isAdmin ? "No hay tareas registradas" : "No tienes tareas asignadas")}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {searchQuery && (
              <p className="text-sm text-slate-500">
                {filteredTasks.length} tareas encontradas
              </p>
            )}

            {groupedTasks.map((group) => {
              const stats = getTaskStats(group.tasks);
              return (
                <Card key={group.projectId} className="!p-0 overflow-hidden">
                  {/* Header del proyecto */}
                  <CardHeader className="bg-slate-50 border-b border-slate-100 px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base md:text-lg font-semibold text-slate-900 truncate">{group.projectName}</h2>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                          <span>{stats.total} tarea{stats.total !== 1 ? "s" : ""}</span>
                          {stats.pending > 0 && <span className="text-amber-600">• {stats.pending} pendiente{stats.pending !== 1 ? "s" : ""}</span>}
                          {stats.inProgress > 0 && <span className="text-blue-600">• {stats.inProgress} en progreso</span>}
                          {stats.completed > 0 && <span className="text-emerald-600">• {stats.completed} completada{stats.completed !== 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/tareas/nueva?proyectoId=${group.projectId}`} className="shrink-0">
                          <Button size="sm" className="w-full sm:w-auto">+ Nueva tarea</Button>
                        </Link>
                        <Link href={`/proyectos/${group.projectId}`} className="shrink-0">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">Ver proyecto</Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Lista de tareas */}
                  <CardBody className="p-0">
                    <div className="divide-y divide-slate-100">
                      {group.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                          {/* Fila 1: Título y badges */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-sm font-medium text-slate-900 leading-snug flex-1">{task.title}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant={getPriorityVariant(task.priority)}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                              <Badge variant={getStatusVariant(task.status)}>
                                {getStatusLabel(task.status)}
                              </Badge>
                            </div>
                          </div>

                          {/* Fila 2: Info */}
                          <p className="text-xs text-slate-500 mb-2">
                            {task.responsible.name}
                            {task.dueDate && (
                              <span> • {new Date(task.dueDate).toLocaleDateString("es-ES")}</span>
                            )}
                          </p>

                          {/* Fila 3: Acciones */}
                          <div className="flex items-center gap-2">
                            <Link href={`/tareas/${task.id}/historial`} className="flex-1 sm:flex-none">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">Historial</Button>
                            </Link>
                            {isAdmin && (
                              <>
                                <Link href={`/tareas/${task.id}/editar`} className="flex-1 sm:flex-none">
                                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">Editar</Button>
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)} className="flex-1 sm:flex-none text-xs">
                                  Eliminar
                                </Button>
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
